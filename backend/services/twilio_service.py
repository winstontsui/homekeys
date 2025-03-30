import logging
from twilio.rest import Client
from config import Config


logger = logging.getLogger(__name__)

def get_recording_url(call_sid):
    client = Client(
        Config.TWILIO_ACCOUNT_SID,
        Config.TWILIO_AUTH_TOKEN
    )
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
