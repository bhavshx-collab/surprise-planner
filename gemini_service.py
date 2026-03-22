import os
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create model (THIS WORKS)
model = genai.GenerativeModel("gemini-pro")


def gemini_full_planner(occasion, relationship, budget, interests, ideas):
    interest_text = ", ".join(interests)
    idea_list = "\n".join([f"- {idea}" for idea in ideas])

    prompt = f"""
You are an expert human surprise planner.

User details:
- Occasion: {occasion}
- Relationship: {relationship}
- Budget: ₹{budget}
- Interests: {interest_text}

Available surprise ideas:
{idea_list}

Your task:
1. Start with: "Chosen Idea: <idea>"
2. Explain WHY this idea fits the budget and interests
3. Write a natural emotional message
4. Give a simple plan:
   - Before
   - During
   - After

Rules:
- Choose only from the given ideas
- Low budget → emotional & simple
- High budget → experiences & memories
- Avoid generic phrasing
"""

    try:
        print("🧠 GEMINI PROMPT SENT")

        response = model.generate_content(prompt)
        text = response.text.strip()

        print("🤖 GEMINI RESPONSE (preview):", text[:200])
        return text

    except Exception as e:
        print("❌ GEMINI FAILED:", e)
        return None
