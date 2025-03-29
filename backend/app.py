import os
import json
import logging
import requests
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

def ai_interaction(user_input, current_property_info):
    """
    Calls the OpenAI API (GPT-4) to process the latest user input and update inquiry information.
    The prompt instructs the AI to:
      - Update the inquiry information based on the input.
      - Ask clarifying questions if the information is incomplete.
      - For any numeric details provided digit-by-digit, convert them into a standard numeric string.
      - Confirm the received information.
      - Output exactly a JSON object with the following keys (and no additional text):
            "updated_data", "next_question", "done", and "confirmation".
    """
    try:
        welcome_message = ""
        if all(value is None for value in current_property_info.values()):
            welcome_message = "Welcome to HomeKeys, your real estate assistant. "

        # Load all available properties and include that in the context.
        all_properties = load_property_data()

        prompt = f"""
        {welcome_message}
        You are a friendly virtual assistant for HomeKeys, helping users inquire about property listings or anything on https://www.homekeys.casa/.
        Here is the current property inventory: {json.dumps(all_properties, indent=2)}
        The current inquiry data is: {json.dumps(current_property_info)}.
        The user just said: "{user_input}".
        
        Update the inquiry data by extracting details such as the property address, property type, budget, or other relevant details.
        If the provided information is incomplete (for example, only an address is given without additional details),
        ask a clarifying question in the JSON to collect the missing part. Confirm the received information back to the user
        when applicable.
        
        IMPORTANT: Output a JSON object with the following keys:
          - "updated_data": the updated inquiry data.
          - "next_question": the next question or clarification or whatever to ask the user.
          - "done": True if the use has no other questions, False otherwise.
          - "confirmation": a message confirming the received information.
        There's exactly these keys: "updated_data", "next_question", "done", and "confirmation". Do not include any extra explanations.
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
            "updated_data": current_property_info,
            "next_question": "Sorry, can you say it again?",
            "done": False,
            "confirmation": ""
        }

def transcribe_with_deepgram(recording_url):
    """
    Downloads the recorded audio from Twilio and sends it to Deepgram for transcription.
    Returns the transcribed text or None if an error occurs.
    """
    twilio_auth = (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    audio_response = requests.get(recording_url, auth=twilio_auth)

    if audio_response.status_code != 200:
        logging.error(f"Error retrieving recording from Twilio: {audio_response.status_code} {audio_response.text}")
        return None

    content_type = audio_response.headers.get("Content-Type", "audio/wav")
    logging.info(f"Content-Type from Twilio: {content_type}")

    audio_data = audio_response.content

    logging.info("Sending audio to Deepgram for transcription.")
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

    response = VoiceResponse()
    response.say("Welcome to HomeKeys—the AI-powered, streamlined alternative to traditional real estate. We're here to simplify your property search and provide smart insights tailored to you. How can we assist you today?")
    
    response.record(
        maxLength="15",         # Maximum recording length in seconds
        action="/recording",     # Twilio will POST the recording details to this endpoint when done
        playBeep=False,
        trim="trim-silence",     # Automatically trim silence from start and end
        timeout="4"              # End recording after 2 seconds of silence
    )
    
    return Response(str(response), mimetype="text/xml")

@app.route("/recording", methods=["POST"])
def handle_recording():
    """
    Handles the recording callback from Twilio: sends the audio to Deepgram for transcription,
    processes the transcribed text using the AI interaction function, and determines the next step.
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

    transcript = transcribe_with_deepgram(recording_url)

    if transcript is None:
        logger.error("Transcription from Deepgram failed.")
        transcript = ""
    else:
        logger.info("Transcription processed successfully.")

    # Initialize the inquiry data (current property info) with minimal keys.
    current_property_info = {
        "address": None,
        "property_type": None,
        "budget": None,
        "bedrooms": None
    }
    response_data = ai_interaction(transcript, current_property_info)
    current_property_info.update(response_data.get("updated_data", {}))
    
    response = VoiceResponse()
    if response_data.get("done", False):
        response.say("Thank you for your inquiry. Goodbye!")
        response.hangup()
    else:
        if response_data.get("confirmation"):
            response.say(response_data["confirmation"])
        response.say(response_data.get("next_question", "Could you please provide more information?"))
        # Record the next response automatically using silence detection.
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
