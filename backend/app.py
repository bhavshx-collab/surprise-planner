from flask import Flask, request, jsonify
from flask_cors import CORS
import random

from groq_service import groq_generate_full_plan



app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Surprise Planner API is running 🚀"


# 🧠 FAKE AI ENGINE (MVP LOGIC)
def fake_ai_planner(occasion, relationship, budget, interests):
    ideas = []

    if "Music" in interests:
        ideas.append("A personalized music night with a handwritten note")
    if "Travel" in interests:
        ideas.append("A surprise one-day outing or future trip reveal")
    if "Food" in interests:
        ideas.append("A candle-light dinner with favorite dishes")

    if budget < 1000:
        ideas.append("A heartfelt letter with a small meaningful gift")
    elif budget < 3000:
        ideas.append("A memory scrapbook with flowers and cake")
    else:
        ideas.append("An experience-based surprise like a special date or stay")

    chosen_idea = random.choice(ideas)

    message = (
        f"I wanted this moment to feel truly special. "
        f"Thinking about your love for {', '.join(interests) if interests else 'simple joys'}, "
        f"this idea felt perfect 💖"
    )

    explanation = (
        f"This plan fits your budget of ₹{budget} and matches your interests, "
        f"making the surprise thoughtful and realistic."
    )

    # 🕒 Timeline logic
    timeline = {
        "before": [
            "Gather everything needed quietly",
            "Set the mood and plan the timing",
        ],
        "during": [
            f"Execute the surprise: {chosen_idea}",
            "Be present and enjoy the reaction",
        ],
        "after": [
            "Capture the moment with photos or notes",
            "Spend quality time talking about the experience",
        ]
    }

    return chosen_idea, message, explanation, timeline



# 🎯 MAIN API
@app.route("/api/surprise/plan", methods=["POST"])
def plan_surprise():
    data = request.json

    occasion = data.get("occasion", "Birthday")
    relationship = data.get("relationship", "Someone Special")
    budget = int(data.get("budget", 1000))
    interests = data.get("interests", [])
    description = data.get("description", "")
    likes = data.get("likes", "")
    city = data.get("city", "")
    tone = data.get("tone", "Romantic")



    idea, message, explanation, timeline = fake_ai_planner(
        occasion, relationship, budget, interests
    )

# 🔥 Enhance with Groq AI
    ai_plan = groq_generate_full_plan(
        occasion=occasion,
        relationship=relationship,
        budget=budget,
        interests=interests,
        description=description,
        likes=likes,
        city=city,
        tone = tone
        
    )


    return jsonify(ai_plan)


    
if __name__ == "__main__":
    app.run(debug=True)
