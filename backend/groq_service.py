import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def groq_generate_full_plan(occasion, relationship, budget, interests, description, likes, city, tone):

    interests_str = ", ".join(interests) if interests else "general"
    city_str = city or "the city"
    likes_str = likes or "not specified"

    prompt = f"""You are an expert surprise planner. Create a unique, creative, personalized surprise plan.

Details: {occasion} for {relationship} | Budget: Rs {budget} | City: {city_str} | Tone: {tone}
Interests: {interests_str} | Description: {description} | Favorites: {likes_str}

Rules:
- Be SPECIFIC to their interests, avoid generic plans
- Every detail must feel {tone}
- Budget breakdown must sum to EXACTLY {budget} (numbers only)
- Give actionable, concrete steps

Reply ONLY with valid JSON, no markdown:
{{
  "idea": "Creative surprise title",
  "message": "Warm 2-3 sentence personal message to the person",
  "explanation": "2-3 sentences why this plan suits them",
  "timeline": {{
    "before": ["2 weeks before: action", "1 week before: action", "2 days before: action", "1 day before: action"],
    "during": ["Morning: action", "Afternoon: action", "Evening: action"],
    "after": ["Next day: action", "Memory: keepsake idea"]
  }},
  "budget_breakdown": {{"Venue": 0, "Food/Drinks": 0, "Decor": 0, "Gifts": 0, "Buffer": 0}}
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=700,
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
    