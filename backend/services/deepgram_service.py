import logging
import requests
from config import Config


logger = logging.getLogger(__name__)

def transcribe_with_deepgram(recording_url):
    """
    Downloads the recorded audio from Twilio and sends it to Deepgram for transcription.
    Returns the transcribed text or None if an error occurs.
    """
    twilio_auth = (Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)

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
        "Authorization": f"Token {Config.DEEPGRAM_API_KEY}"
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
    