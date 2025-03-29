import os
import logging
import requests

logger = logging.getLogger(__name__)

def transcribe_with_deepgram(recording_url):
    """
    Sends audio from Twilio to Deepgram. Returns {transcript, summary} or None if error.
    """
    twilio_auth = (os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
    audio_response = requests.get(recording_url, auth=twilio_auth)

    if audio_response.status_code != 200:
        logger.error(f"Error retrieving recording from Twilio: {audio_response.status_code} {audio_response.text}")
        return None

    deepgram_url = "https://api.deepgram.com/v1/listen"
    headers = {"Authorization": f"Token {os.getenv('DEEPGRAM_API_KEY')}"}
    params = {
        "punctuate": "true",
        "language": "en-US",
        "diarize": "true",
        "utterances": "true",
        "sentiment": "true",
        "summarize": "v2"
    }
    files = {
        "audio": ("audio_file", audio_response.content, audio_response.headers.get("Content-Type"))
    }

    try:
        resp = requests.post(deepgram_url, params=params, headers=headers, files=files)
        if resp.status_code != 200:
            logger.error("Deepgram error: " + resp.text)
            return None

        data = resp.json()
        transcript = data.get("results", {}) \
                         .get("channels", [{}])[0] \
                         .get("alternatives", [{}])[0] \
                         .get("transcript", "")

        summary = data.get("results", {}).get("summary", {}).get("short", "")
        return {"transcript": transcript, "summary": summary}

    except Exception as e:
        logger.error(f"Deepgram transcription error: {e}")
        return None
