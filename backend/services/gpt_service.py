import json
import logging
import requests
from config import Config

logger = logging.getLogger(__name__)

def load_property_data():
    """Loads property data from JSON file."""
    with open("properties.json", "r") as file:
        return json.load(file)["properties"]

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
                "Authorization": f"Bearer {Config.OPENAI_API_KEY}",
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