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
    logger.info(f"[call-response] Handling POST for CallSid: {call_sid}")
    
    time.sleep(2)

    recording_url = request.form.get("RecordingUrl")
    time.sleep(0.2)

    if not recording_url:
        logger.info(f"[call-response] No RecordingUrl in request. Attempting to retrieve from Twilio...")
        recording_url = get_recording_url(call_sid)

    if not recording_url:
        logger.error(f"[call-response] No valid recording URL found for CallSid: {call_sid}")
        return Response("Recording not found", status=404)

    logger.info(f"[call-response] Got recording URL: {recording_url}")

    transcript_data = transcribe_with_deepgram(recording_url)
    if not transcript_data:
        logger.warning(f"[call-response] Transcription failed or returned empty.")
        transcript = ""
    else:
        transcript = transcript_data.get("transcript", "")
        logger.info(f"[call-response] Transcript: {transcript}")

    current_summary = call_summaries.get(call_sid, "")
    logger.info(f"[call-response] Current summary: {current_summary}")

    ai_response = ai_interaction(transcript, current_summary)
    logger.info(f"[call-response] AI response: {ai_response}")

    updated_summary = ai_response.get("updated_summary", current_summary)
    call_summaries[call_sid] = updated_summary
    logger.info(f"[call-response] Updated summary stored.")

    response = VoiceResponse()

    if ai_response.get("done", False):
        logger.info(f"[call-response] Conversation marked as done. Sending goodbye.")
        goodbye_text = "Thank you for your call. Goodbye!"
        audio_data = generate_tts_audio(goodbye_text)
        audio_url, _ = save_audio_to_file(audio_data)
        response.play(audio_url)
        response.hangup()
    else:
        confirmation_text = ai_response.get("confirmation", "")
        if confirmation_text:
            logger.info(f"[call-response] Playing confirmation: {confirmation_text}")
            audio_data = generate_tts_audio(confirmation_text)
            audio_url, _ = save_audio_to_file(audio_data)
            response.play(audio_url)

        main_answer = ai_response.get("response", "")
        if main_answer.strip():
            logger.info(f"[call-response] Playing AI response: {main_answer}")
            audio_data = generate_tts_audio(main_answer)
            audio_url, _ = save_audio_to_file(audio_data)
            response.play(audio_url)

        next_question = ai_response.get("next_question", "Could you provide more information?")
        logger.info(f"[call-response] Asking next question: {next_question}")
        audio_data = generate_tts_audio(next_question)
        audio_url, _ = save_audio_to_file(audio_data)
        response.play(audio_url)

        logger.info(f"[call-response] Starting next recording cycle.")
        response.record(
            maxLength="15",
            action="/call-response",
            playBeep=False,
            trim="trim-silence",
            timeout="3"
        )

    logger.info(f"[call-response] Sending TwiML response for CallSid: {call_sid}")
    return Response(str(response), mimetype="text/xml")
