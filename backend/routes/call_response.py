import time
import logging
from flask import Blueprint, request, Response
from twilio.twiml.voice_response import VoiceResponse

from services.twilio_service import get_recording_url
from services.deepgram_service import transcribe_with_deepgram
from services.gpt_service import ai_interaction
from services.elevenlabs_service import generate_tts_audio, save_audio_to_file

from routes.call_start import call_summaries

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
        return Response("Recording not found", status=404)

    transcript_data = transcribe_with_deepgram(recording_url)
    
    if transcript_data is None:
        logger.error("Transcription from Deepgram failed.")
        transcript = ""
    else:
        transcript = transcript_data.get("transcript", "")
        logger.info("Transcription processed successfully.")

    # Retrieve the current call summary.
    current_summary = call_summaries.get(call_sid, "")
    ai_response = ai_interaction(transcript, current_summary)
    call_summaries[call_sid] = ai_response.get("updated_summary", current_summary)

    response = VoiceResponse()
    if ai_response.get("done", False):
        greeting_text = "Thank you for your call. Goodbye!"
        audio_data = generate_tts_audio(greeting_text)
        audio_url, _ = save_audio_to_file(audio_data)
        response = VoiceResponse()
        response.play(audio_url)
        response.hangup()
        
    else:
        if ai_response.get("confirmation"):
            confirmation_text = ai_response["confirmation"]
            audio_data = generate_tts_audio(confirmation_text)
            audio_url, _ = save_audio_to_file(audio_data)
            response.play(audio_url)
        
        next_question = ai_response.get("next_question", "Could you please provide more information?")
        audio_data = generate_tts_audio(next_question)
        audio_url, _ = save_audio_to_file(audio_data)
        response.play(audio_url)
        
        response.record(
            maxLength="15",
            action="/call-response",
            playBeep=False,
            trim="trim-silence",
            timeout="2"
        )
    
    return Response(str(response), mimetype="text/xml")
