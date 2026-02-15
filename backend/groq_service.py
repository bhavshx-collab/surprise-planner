import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def groq_generate_full_plan(occasion, relationship, budget, interests, description, likes, city,tone ):

    prompt = f"""
You are an expert surprise planner.

User details:
- Occasion: {occasion}
- Relationship: {relationship}
- Budget: ₹{budget}
- City: {city if city else "Not specified"}
- Interests: {", ".join(interests) if interests else "Not specified"}
- Favorite things: {likes if likes else "Not specified"}
  Create a {tone} style surprise plan.
  Tone should strongly reflect {tone}.


User's personal description:
\"\"\"{description}\"\"\"

Use all information above to create a realistic, emotional, and personalized surprise plan.

Respond ONLY in valid JSON:

{{
  "idea": "...",
  "message": "...",
  "explanation": "...",
  "timeline": {{
    "before": ["..."],
    "during": ["..."],
    "after": ["..."]
  }}
}}
"""



    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.9,
    )

    raw = response.choices[0].message.content
    print("🟢 GROQ RAW JSON:\n", raw)

        
    data = json.loads(raw)

    return json.loads(raw)


   
