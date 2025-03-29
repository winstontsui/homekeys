import logging
from twilio.rest import Client
import os

logger = logging.getLogger(__name__)

def get_recording_url(call_sid):
    client = Client(
        os.getenv("TWILIO_ACCOUNT_SID"),
        os.getenv("TWILIO_AUTH_TOKEN")
    )
    try:
        recordings = client.recordings.list(call_sid=call_sid)
        if recordings:
            # Return the first or newest
            recording = recordings[0]
            logger.info(f"Found recording: SID {recording.sid}, URI {recording.uri}")
            return f"https://api.twilio.com{recording.uri}.mp3"
        else:
            logger.error("No recordings found for this Call SID.")
            return None
    except Exception as e:
        logger.error(f"Error retrieving recordings from Twilio API: {e}")
        return None
