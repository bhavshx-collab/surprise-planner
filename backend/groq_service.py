import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def groq_generate_full_plan(occasion, relationship, budget, interests, description, likes, city, tone):

    interests_str = ", ".join(interests) if interests else "Not specified"
    city_str = city if city else "Not specified"
    likes_str = likes if likes else "Not specified"

    prompt = f"""You are a world-class luxury surprise planner who has planned thousands of deeply personal, emotional, and creative surprises.

User details:
- Occasion: {occasion}
- Relationship: {relationship}
- Budget: Rs {budget}
- City: {city_str}
- Interests: {interests_str}
- Favorite things: {likes_str}
- Personal description: {description}
- Tone/Vibe: {tone}

IMPORTANT RULES:
1. Make the surprise SPECIFIC to the person's interests and description — avoid generic ideas
2. The tone must strongly reflect "{tone}" — every word should feel {tone}
3. Budget breakdown must add up to EXACTLY Rs {budget}
4. Never suggest "cook dinner at home" or "write a letter" as the main idea — be creative and specific
5. Timeline steps must be actionable and concrete, not vague

Respond ONLY in valid JSON with no extra text, no markdown, no code blocks:

{{
  "idea": "One specific, creative surprise idea title",
  "message": "A warm, emotional 2-3 sentence message written to the person being surprised",
  "explanation": "2-3 sentences explaining why this plan is perfect for them specifically",
  "timeline": {{
    "before": [
      "2 weeks before: specific action",
      "1 week before: specific action",
      "2 days before: specific action",
      "1 day before: specific action"
    ],
    "during": [
      "Morning: specific action",
      "Afternoon: specific action",
      "Evening: specific action"
    ],
    "after": [
      "Next day: specific action",
      "Memory: specific keepsake or follow-up"
    ]
  }},
  "budget_breakdown": {{
    "Venue": 0,
    "Food/Drinks": 0,
    "Decor": 0,
    "Gifts": 0,
    "Buffer": 0
  }}
}}

All values in budget_breakdown must be numbers (not strings), and must sum to exactly {budget}."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
        )

        raw = response.choices[0].message.content
        print("GROQ RAW RESPONSE:\n", raw)

        # Clean up response if model wraps in markdown code blocks
        cleaned = raw.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        data = json.loads(cleaned)

        # Ensure budget_breakdown exists
        if "budget_breakdown" not in data:
            b = int(budget)
            data["budget_breakdown"] = {
                "Venue":        int(b * 0.30),
                "Food/Drinks":  int(b * 0.25),
                "Decor":        int(b * 0.20),
                "Gifts":        int(b * 0.15),
                "Buffer":       int(b * 0.10),
            }

        return data

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print(f"Raw response was: {raw}")
        # Return a safe fallback
        b = int(budget) if str(budget).isdigit() else 5000
        return {
            "idea": f"A special {tone.lower()} {occasion.lower()} surprise",
            "message": f"You deserve something truly special on your {occasion.lower()}. This plan was crafted with love just for you.",
            "explanation": f"Based on your interests and budget, this plan creates a memorable {tone.lower()} experience.",
            "timeline": {
                "before": ["1 week before: Start planning and booking", "1 day before: Prepare all materials"],
                "during": ["On the day: Execute the surprise", "Evening: Celebrate together"],
                "after": ["Next day: Relive the memories together"]
            },
            "budget_breakdown": {
                "Venue":       int(b * 0.30),
                "Food/Drinks": int(b * 0.25),
                "Decor":       int(b * 0.20),
                "Gifts":       int(b * 0.15),
                "Buffer":      int(b * 0.10),
            }
        }

    except Exception as e:
        print(f"Groq API error: {e}")
        raise