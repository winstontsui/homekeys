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
    The updated summary will follow a format similar to the example provided:
    
    Example Format:
    
    Hi [User's Name],
    
    Thank you for speaking with us today! As requested, here’s a summary of the properties we discussed, including a range of beautiful homes in the Stanford and Palo Alto area. Please see details below:
    
    🔑 Featured Properties
    1. 869 Tolman Drive, Stanford, CA 94305
       $2,975,000 | 4 Bed, 2 Bath | 2,588 sq ft
       Spacious home just minutes from central campus. High ceilings, garden views, and located in a quiet neighborhood.
       📐 Lot: 12,914 sq ft | 🚗 Garage: 2-car | 💰 Ground Rent: $385.16/mo | Lease: Standard
       
    2. 2254 Oberlin Street, Palo Alto, CA 94306
       $2,213,000 | 3 Bed, 3 Bath | 2,345 sq ft
       New Gambrel Cottage-style home with hardwood floors, solar power, and a smart grey water system.
       📐 Lot: 6,250 sq ft | 🚗 Garage: 1-car | 💰 Ground Rent: None | Lease: Restricted
       
    Thank you,
    HomeKeys AI Assistant
    homekeys.casa
    
    The JSON response will have the following keys:
      - "next_question": Your helpful, concise response to the user's input.
      - "done": True if the conversation should end, False if further interaction is expected.
      - "updated_summary": A summary in the above style.
    
    Only output this JSON, with nothing else.
    """
    try:
        # Load available properties for context.
        all_properties = load_property_data()

        prompt = f"""
You are a friendly virtual assistant for HomeKeys, here to help answer any questions about property listings or related topics from https://www.homekeys.casa/.
Here is the current property inventory: {json.dumps(all_properties, indent=2)}
The current call summary is: "{current_summary}".
The user just said: "{user_input}".

Please provide a response in JSON format with exactly the following keys:
  - "next_question": Your concise response to the user's input.
  - "done": True if the conversation should end, or False if further interaction is expected.
  - "updated_summary": A summary that will be emailed to the user, formatted in the style below.
Return only this JSON, with nothing else.

Example of updated_summary, may change based on the conversation:

Hello,
Thank you for speaking with us today! We discussed our current property inventory and focused on our most affordable property at 29 Pearce Mitchell Place, Stanford, CA 94305-8522. Here is the property details again for your convenience:

29 Pearce Mitchell Place, Stanford, CA 94305-8522
$525,000 | 2 Bed, 2 Bath | 1,100 sq ft
This property is a charming ground-floor condo with an open layout, spacious bedrooms, and a private back patio. It features a private patio, breakfast bar, and access to a community pool. The monthly ground rent is $288.28 with a lease type of Standard. It has a monthly HOA fee of $1052.


Best regards,
HomeKeys AI Assistant
https://www.homekeys.casa/

Please only return the json.
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
            "next_question": "I'm sorry, could you please repeat that?",
            "done": False,
            "updated_summary": current_summary
        }
