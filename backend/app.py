import os
import json
import uuid
import logging
import requests
import smtplib
from elevenlabs import ElevenLabs
from email.mime.text import MIMEText
from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Environment variables (set these in your environment)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")


# Global dictionary to hold a single call summary for each call by CallSid.
call_summaries = {}
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

def generate_tts_audio(text, voice_id="yvc8Xy9LseeosFGplnuX", model_id="eleven_multilingual_v2"):
    """
    Generates TTS audio from text using ElevenLabs.
    Returns the raw audio data.
    """
    audio = elevenlabs_client.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id=model_id,
        output_format="mp3_44100_128"
    )
    return audio

def save_audio_to_file(audio_data):
    # Convert the generator to a bytes object
    audio_bytes = b"".join(audio_data)
    filename = f"{uuid.uuid4()}.mp3"
    file_path = os.path.join("static", filename)
    with open(file_path, "wb") as f:
        f.write(audio_bytes)
    return f"/static/{filename}", file_path


def load_property_data():
    """Load property data from JSON file."""
    with open("properties.json", "r") as file:
        return json.load(file)["properties"]

def get_recording_url(call_sid):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    try:
        recordings = client.recordings.list(call_sid=call_sid)
        if recordings:
            for recording in recordings:
                logger.info(f"Found recording: SID {recording.sid}, URL {recording.uri}")
                return f"https://api.twilio.com{recording.uri}.mp3"
        else:
            logger.error("No recordings found for this Call SID.")
            return None
    except Exception as e:
        logger.error(f"Error retrieving recordings from Twilio API: {str(e)}")
        return None

def ai_interaction(user_input, current_summary):
    """
    Interact with the AI to answer the user's query and update the call summary.
    The current call summary is provided so that the AI can return an updated version.
    """
    try:
        # Load available properties for context.
        all_properties = load_property_data()

        prompt = f"""
        You are a friendly virtual assistant for HomeKeys, here to help answer any questions about property listings or related topics from https://www.homekeys.casa/.
        Here is the current property inventory: {json.dumps(all_properties, indent=2)}
        The current call summary is: "{current_summary}".
        The user just said: "{user_input}".
        
        Provide a helpful and concise answer in JSON format with exactly the following keys:
          - "response": your answer to the user's query.
          - "next_question": any follow-up question if more details are needed, or an empty string if not.
          - "done": True if the conversation should end, or False if further interaction is expected.
          - "confirmation": a brief confirmation or summary of your response.
          - "updated_summary": A concise overall call summary of user's call.
        Return this JSON with nothing else.
        """
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        if response.status_code != 200:
            logger.error(f"OpenAI API error: {response.text}")
            raise Exception(f"OpenAI API error: {response.text}")

        raw_message = response.json()["choices"][0]["message"]["content"]
        if not raw_message.strip():
            raise ValueError("Received empty response from AI API.")

        try:
            parsed_message = json.loads(raw_message)
        except json.JSONDecodeError as jde:
            logger.error(f"JSON decode error: {jde}. Raw response: {raw_message}")
            raise

        return parsed_message

    except Exception as e:
        logger.error(f"AI interaction error: {e}")
        # Fallback: ask the user to repeat their response
        return {
            "response": "I'm sorry, could you please repeat that?",
            "next_question": "",
            "done": False,
            "confirmation": "",
            "updated_summary": current_summary
        }

def transcribe_with_deepgram(recording_url):
    """
    Downloads the recorded audio from Twilio and sends it to Deepgram for transcription.
    Returns the transcribed text or None if an error occurs.
    """
    twilio_auth = (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    audio_response = requests.get(recording_url, auth=twilio_auth)

    if audio_response.status_code != 200:
        logger.error(f"Error retrieving recording from Twilio: {audio_response.status_code} {audio_response.text}")
        return None

    content_type = audio_response.headers.get("Content-Type", "audio/wav")
    logger.info(f"Content-Type from Twilio: {content_type}")

    audio_data = audio_response.content

    logger.info("Sending audio to Deepgram for transcription.")
    deepgram_url = "https://api.deepgram.com/v1/listen"

    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}"
    }
    params = {
        "punctuate": "true",
        "language": "en-US",
        "diarize": "true",
        "utterances": "true",
        "sentiment": "true",
        "summarize": "v2"
    }
    files = {
        "audio": ("audio_file", audio_data, content_type)
    }

    try:
        deepgram_response = requests.post(deepgram_url, params=params, headers=headers, files=files)

        if deepgram_response.status_code != 200:
            logging.error("Error transcribing with Deepgram: " + deepgram_response.text)
            return None

        result = deepgram_response.json()

        transcript = (
            result.get("results", {})
                  .get("channels", [{}])[0]
                  .get("alternatives", [{}])[0]
                  .get("transcript", "")
        )
        summary = result.get("results", {}).get("summary", {}).get("short", "No summary available.")

        logging.info("Transcription successful.")
        logging.info(f"Transcription: {transcript}")
        logging.info(f"Summary: {summary}")

        return {
            "transcript": transcript,
            "summary": summary,
        }

    except Exception as e:
        logging.error(f"Unexpected error during transcription: {str(e)}")
        return None

@app.route("/voice", methods=["POST"])
def handle_voice():
    """
    Initiates the call flow by asking the caller to provide their inquiry after the beep.
    The recording stops automatically on detecting silence.
    """
    call_sid = request.form.get("CallSid")
    logger.info(f"CallSid: {call_sid} initiating voice call.")

    # Initialize the call summary for this call as an empty string.
    call_summaries[call_sid] = ""


    greeting_text = "Welcome to HomeKey—the AI-powered assistant here to help answer your property questions. How can I assist you today?"
    audio_data = generate_tts_audio(greeting_text)
    audio_url, file_path = save_audio_to_file(audio_data)

    
    response = VoiceResponse()
    response.play(audio_url)

    
    response.record(
        maxLength="15",
        action="/recording",
        playBeep=False,
        trim="trim-silence",
        timeout="3"
    )
    
    return Response(str(response), mimetype="text/xml")

@app.route("/recording", methods=["POST"])
def handle_recording():
    """
    Handles the recording callback from Twilio:
      - Sends the audio to Deepgram for transcription.
      - Processes the transcribed text with AI, providing the current call summary.
      - Updates the overall call summary with the AI's response.
      - If the conversation is done, sends a summary email.
    """
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

    # Retrieve the current call summary.
    current_summary = call_summaries.get(call_sid, "")
    ai_response = ai_interaction(transcript, current_summary)
    call_summaries[call_sid] = ai_response.get("updated_summary", current_summary)

    response = VoiceResponse()
    if ai_response.get("done", False):
        greeting_text = "Thank you for your call. Goodbye!"
        audio_data = generate_tts_audio(greeting_text)
        audio_url = save_audio_to_file(audio_data)
        response = VoiceResponse()
        response.play(audio_url)
        response.hangup()

        
    else:
        if ai_response.get("confirmation"):
            confirmation_text = ai_response["confirmation"]
            audio_data = generate_tts_audio(confirmation_text)
            audio_url = save_audio_to_file(audio_data)
            response.play(audio_url)
        
        next_question = ai_response.get("next_question", "Could you please provide more information?")
        audio_data = generate_tts_audio(next_question)
        audio_url = save_audio_to_file(audio_data)
        response.play(audio_url)
        
        response.record(
            maxLength="15",
            action="/recording",
            playBeep=False,
            trim="trim-silence",
            timeout="2"
        )
    
    return Response(str(response), mimetype="text/xml")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
