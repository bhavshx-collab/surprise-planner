import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from groq_service import groq_generate_full_plan
from supabase import create_client, Client

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://your-vercel-app.vercel.app"
            "https://surprise-planner-72mpgui7c-bhavesh-kumats-projects.vercel.app"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://eokahkjzoajzrjvmhpzx.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVva2Foa2p6b2FqenJqdm1ocHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDE1MDcsImV4cCI6MjA4OTA3NzUwN30.gnzf7po9fgZiwP3K5VEEeh1QRB4Ph9l7L4XJ9tS_hFA")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

chat_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@app.route("/api/surprise/plan", methods=["POST"])
def plan_surprise():
    data = request.get_json()
    occasion     = data.get("occasion", "Birthday")
    relationship = data.get("relationship", "Friend")
    budget       = data.get("budget", "5000")
    interests    = data.get("interests", [])
    description  = data.get("description", "")
    likes        = data.get("likes", "")
    city         = data.get("city", "")
    tone         = data.get("tone", "Romantic")

    ai_plan = groq_generate_full_plan(
        occasion=occasion, relationship=relationship, budget=budget,
        interests=interests, description=description, likes=likes,
        city=city, tone=tone
    )

    try:
        save_result = supabase.table("plans").insert({
            "occasion": occasion, "relationship": relationship,
            "tone": tone, "budget": budget, "city": city,
            "interests": interests, "description": description,
            "plan_data": ai_plan,
        }).execute()
        ai_plan["plan_id"] = save_result.data[0]["id"]
    except Exception as e:
        print(f"[Supabase error] {e}")
        ai_plan["plan_id"] = None

    return jsonify(ai_plan)


@app.route("/api/surprise/plan/<plan_id>", methods=["GET"])
def get_plan(plan_id):
    try:
        result = supabase.table("plans").select("*").eq("id", plan_id).single().execute()
        if result.data:
            plan = result.data["plan_data"]
            plan["plan_id"] = result.data["id"]
            plan["form"] = {
                "occasion": result.data.get("occasion"),
                "relationship": result.data.get("relationship"),
                "tone": result.data.get("tone"),
                "budget": result.data.get("budget"),
                "city": result.data.get("city"),
            }
            return jsonify(plan)
        return jsonify({"error": "Plan not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat", methods=["POST"])
def chat():
    data     = request.get_json()
    question = data.get("question", "")
    plan     = data.get("plan", {})
    history  = data.get("history", [])

    if not question:
        return jsonify({"error": "No question provided"}), 400

    system_prompt = f"""You are a friendly surprise planning assistant who knows this plan in detail:

IDEA: {plan.get('idea', '')}
MESSAGE: {plan.get('message', '')}
EXPLANATION: {plan.get('explanation', '')}
BEFORE: {', '.join(plan.get('timeline', {}).get('before', []))}
DURING: {', '.join(plan.get('timeline', {}).get('during', []))}
AFTER: {', '.join(plan.get('timeline', {}).get('after', []))}
BUDGET: {json.dumps(plan.get('budget_breakdown', {}))}

Help the user execute this plan. Answer questions about bookings, alternatives, gifts, playlists, decorations, timing, and keeping it a secret. Be warm, concise, practical. Max 3-4 sentences."""

    messages = [{"role": "system", "content": system_prompt}]
    for msg in history[-6:]:
        if msg.get("role") in ["user", "assistant"]:
            messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": question})

    try:
        response = chat_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7,
            max_tokens=300,
        )
        return jsonify({"answer": response.choices[0].message.content})
    except Exception as e:
        print(f"[Chat error] {e}")
        return jsonify({"answer": "Sorry, I had trouble with that. Please try again!"}), 500


if __name__ == "__main__":
    app.run(debug=True)