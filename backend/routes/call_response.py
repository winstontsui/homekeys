import time
import logging
from flask import Blueprint, request, Response
from twilio.twiml.voice_response import VoiceResponse

from services.twilio_service import get_recording_url
from services.deepgram_service import transcribe_with_deepgram
from services.gpt_service import ai_interaction
from services.elevenlabs_service import generate_tts_audio, save_audio_to_file
from services.email_service import send_email_summary

from routes.call_start import call_summaries

RECIPIENT_EMAIL = "nycwinston@gmail.com"
logger = logging.getLogger(__name__)

call_response = Blueprint("call_response", __name__)  

@call_response.route("/call-response", methods=["POST"])
def handle_recording():
    call_sid = request.form.get("CallSid")
    time.sleep(2)
    recording_url = request.form.get("RecordingUrl")
    time.sleep(0.2)
    if not recording_url:
        recording_url = get_recording_url(call_sid)

    if not recording_url:
        logger.error("Failed to retrieve a valid recording URL from Twilio.")
        return Response("Recording not found", status=404)

    transcript_data = transcribe_with_deepgram(recording_url)
    if transcript_data is None:
        logger.error("Transcription from Deepgram failed.")
        transcript = ""
    else:
        transcript = transcript_data.get("transcript", "")
        logger.info("Transcription processed successfully.")

    current_summary = call_summaries.get(call_sid, "")
    ai_response = ai_interaction(transcript, current_summary)
    call_summaries[call_sid] = ai_response.get("updated_summary", current_summary)

    response = VoiceResponse()
    if ai_response.get("done", False):
        greeting_text = "Thank you for calling HomeKeys. We've emailed you a summary of this conversation. You can also visit us at homekeys.casa. Take care!"
        audio_data = generate_tts_audio(greeting_text)
        audio_url, _ = save_audio_to_file(audio_data)
        response = VoiceResponse()
        response.play(audio_url)
        response.hangup()
        final_summary = call_summaries.get(call_sid, "No summary available.")
        send_email_summary(RECIPIENT_EMAIL, final_summary)
    else:
        greeting_text = ai_response.get("next_question", "Could you say it again?")
        audio_data = generate_tts_audio(greeting_text)
        audio_url, _ = save_audio_to_file(audio_data)
        response = VoiceResponse()
        response.play(audio_url)

        response.record(
            maxLength="15",
            action="/call-response",
            playBeep=False,
            trim="trim-silence",
            timeout="2"
        )
    
    return Response(str(response), mimetype="text/xml")
    