import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_ai_message(occasion, relationship, idea, interests):
    interest_text = ", ".join(interests)

    prompt = f"""
Write a natural, human, emotional message for a {relationship} on {occasion}.

Surprise idea: {idea}
Interests: {interest_text}

Rules:
- Do NOT be generic
- Mention interests naturally
- Sound like a real person
- Different wording every time
"""

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=prompt,
            temperature=1.0
        )

        return response.output_text.strip()

    except Exception as e:
        raise RuntimeError("AI_FAILED") from e 

def explain_idea(occasion, relationship, budget, idea, interests):
    interest_text = ", ".join(interests)

    prompt = f"""
Explain why this surprise fits:
- Occasion: {occasion}
- Relationship: {relationship}
- Budget: ₹{budget}
- Interests: {interest_text}

Explain naturally in 2 sentences.
"""

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=prompt,
            temperature=0.6
        )

        return response.output_text.strip()

    except Exception as e:
        return f"AI ERROR: {str(e)}"
