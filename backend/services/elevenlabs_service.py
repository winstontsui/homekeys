import os
import uuid
import logging
from elevenlabs import ElevenLabs
from config import Config

logger = logging.getLogger(__name__)

elevenlabs_client = ElevenLabs(api_key=Config.ELEVENLABS_API_KEY)

def generate_tts_audio(text, voice_id=Config.ELEVENLABS_VOICE_ID, model_id="eleven_multilingual_v2"):
    """
    Generates TTS audio from text using ElevenLabs. Returns raw audio data (iterator).
    """
    audio = elevenlabs_client.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id=model_id,
        output_format="mp3_44100_128"
    )
    return audio

def save_audio_to_file(audio_data):
    """
    Converts the audio iterator to bytes, saves as an MP3 file in /static,
    and returns (audio_url, absolute_path).
    """
    audio_bytes = b"".join(audio_data)
    filename = f"{uuid.uuid4()}.mp3"
    static_dir = "static"
    file_path = os.path.join(static_dir, filename)

    os.makedirs(static_dir, exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(audio_bytes)

    audio_url = f"/static/{filename}"
    return audio_url, file_path
