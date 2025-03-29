import logging
from flask import Blueprint, request, Response
from twilio.twiml.voice_response import VoiceResponse
from services.elevenlabs_service import generate_tts_audio, save_audio_to_file

logger = logging.getLogger(__name__)

call_start = Blueprint("call_start", __name__)

call_summaries = {}

@call_start.route("/call-start", methods=["POST"])
def handle_voice():
    call_sid = request.form.get("CallSid")
    logger.info(f"CallSid: {call_sid} initiating voice call.")

    greeting_text = "Welcome to Homekey—your smart assistant for real estate. What kind of property are you looking for?"
    audio_data = generate_tts_audio(greeting_text)
    audio_url, _ = save_audio_to_file(audio_data)

    response = VoiceResponse()
    response.play(audio_url)

    response.record(
        maxLength="15",
        action="/call-response",
        playBeep=False,
        trim="trim-silence",
        timeout="3"
    )

    return Response(str(response), mimetype="text/xml")
