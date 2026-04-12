import os
import json
from dotenv import load_dotenv

load_dotenv()  # ← MUST be here, before everything else

from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from groq_service import groq_generate_full_plan
from moodboard import generate_moodboard
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

chat_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://surprise-planner-nu.vercel.app",
            "https://surprise-planner-nu-*.vercel.app",
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

chat_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@app.route("/")
def home():
    return jsonify({"project": "Surprise Planner", "status": "Backend is running!"})


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

    # Auto-match vendors by city
    matched = []
    if city:
        try:
            vr = supabase.table("vendors").select("name,category,city,whatsapp,phone,min_budget,is_featured") \
                .eq("status", "approved").ilike("city", f"%{city}%") \
                .order("is_featured", desc=True).limit(3).execute()
            matched = vr.data or []
        except Exception as e:
            print(f"[Vendor match] {e}")
    ai_plan["matched_vendors"] = matched

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


@app.route("/api/moodboard", methods=["POST"])
def moodboard():
    data = request.get_json()
    urls = generate_moodboard(
        idea=data.get("idea", ""),
        tone=data.get("tone", "Romantic"),
        occasion=data.get("occasion", "Surprise"),
    )
    return jsonify({"urls": urls})


@app.route("/api/surprise/tweak", methods=["POST"])
def tweak_plan():
    data = request.get_json()
    plan = data.get("plan", {})
    instruction = data.get("instruction", "")
    prompt = f"""Edit this surprise plan based on: "{instruction}"
Current: idea={plan.get('idea','')}, budget={json.dumps(plan.get('budget_breakdown',{}))}, timeline={json.dumps(plan.get('timeline',{}))}
Return ONLY a JSON object with changed keys. Valid JSON, no explanation."""
    try:
        resp = chat_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7, max_tokens=500,
        )
        content = resp.choices[0].message.content.strip()
        if "```" in content:
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        patch = json.loads(content)
        return jsonify({**plan, **patch})
    except Exception as e:
        print(f"[Tweak] {e}")
        return jsonify(plan)


@app.route("/api/quote/request", methods=["POST"])
def request_quote():
    data = request.get_json()
    plan_id = data.get("plan_id")
    user_name = data.get("user_name", "")
    user_email = data.get("user_email", "")
    vendors = data.get("vendors", [])
    plan_summary = data.get("plan_summary", "")

    SMTP_EMAIL = os.getenv("SMTP_EMAIL")
    SMTP_PASS  = os.getenv("SMTP_PASSWORD")
    sent = []

    for vendor in vendors:
        try:
            supabase.table("quote_requests").insert({
                "plan_id": plan_id, "vendor_name": vendor.get("name"),
                "vendor_email": vendor.get("email"),
                "user_name": user_name, "user_email": user_email,
            }).execute()
            sent.append(vendor.get("name"))
        except Exception as e:
            print(f"[QuoteDB] {e}")

        if SMTP_EMAIL and SMTP_PASS and vendor.get("email"):
            try:
                import smtplib
                from email.mime.text import MIMEText
                body = f"""Hello {vendor.get('name')},\n\n{user_name} ({user_email}) is planning a surprise and wants a quote from you.\n\nPlan summary: {plan_summary}\n\nPlease reach out to them directly at {user_email}.\n\n— AI Surprise Planner"""
                msg = MIMEText(body)
                msg['Subject'] = f"Quote Request from {user_name} · AI Surprise Planner"
                msg['From'] = SMTP_EMAIL
                msg['To'] = vendor['email']
                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
                    s.login(SMTP_EMAIL, SMTP_PASS)
                    s.send_message(msg)
            except Exception as e:
                print(f"[Email] {e}")

    return jsonify({"sent": sent, "count": len(sent)})


@app.route("/api/payment/verify", methods=["POST"])
def verify_payment():
    data = request.get_json()
    user_id = data.get("user_id")
    email = data.get("email")
    payment_id = data.get("razorpay_payment_id", "")
    try:
        supabase.table("pro_users").upsert({
            "user_id": user_id, "email": email,
            "razorpay_payment_id": payment_id,
        }, on_conflict="user_id").execute()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/payment/status", methods=["GET"])
def payment_status():
    email = request.args.get("email", "")
    try:
        result = supabase.table("pro_users").select("expires_at").eq("email", email).maybeSingle().execute()
        if result.data and result.data.get("expires_at"):
            from datetime import datetime, timezone
            expires = datetime.fromisoformat(result.data["expires_at"].replace("Z", "+00:00"))
            return jsonify({"isPro": expires > datetime.now(timezone.utc)})
    except Exception as e:
        print(f"[PayStatus] {e}")
    return jsonify({"isPro": False})


@app.route("/api/scrapbook/story", methods=["POST"])
def scrapbook_story():
    data = request.get_json()
    idea = data.get("idea", "")
    occasion = data.get("occasion", "surprise")
    notes = data.get("how_it_went", "")
    prompt = f"""Write a warm, personal 3-sentence memory story about a surprise that just happened.
Surprise: {idea}
Occasion: {occasion}
Notes: {notes}
Write in past tense, first person plural ("We"). Emotional, specific, beautiful. 3 sentences max. No quotes."""
    try:
        resp = chat_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9, max_tokens=200,
        )
        return jsonify({"story": resp.choices[0].message.content.strip()})
    except Exception as e:
        print(f"[Scrapbook] {e}")
        return jsonify({"story": "A beautiful memory was made today. 💫"})


from social_service import generate_icebreaker, generate_mystery_teaser, compute_match_score, get_activity_info
import uuid as uuid_lib
from datetime import datetime, timedelta, timezone


# ──────────────────────────────────────────────
#  INTROVERT ADVENTURES — SOCIAL ROUTES
# ──────────────────────────────────────────────

@app.route("/api/social/profile", methods=["POST"])
def create_social_profile():
    data = request.get_json()
    user_id   = data.get("user_id", "")
    email     = data.get("email", "")
    name      = data.get("name", "")
    city      = data.get("city", "Bangalore")
    energy    = data.get("energy_level", "medium")
    intro_s   = data.get("intro_style", "small_group")
    interests = data.get("interests", [])
    about     = data.get("perfect_saturday", "")
    phone     = data.get("phone", "")

    # Generate vibe tags from interests using AI
    vibe_tags = []
    if interests:
        tags_map = {
            "Board games": "strategist", "Indie music": "indie-soul", "Coffee": "café-dweller",
            "Reading": "bookworm", "Hiking": "trail-seeker", "Art": "creative", "Cooking": "home-chef",
            "Astronomy": "stargazer", "Cinema": "film-lover", "Photography": "visual-thinker",
            "Yoga": "mindful-mover", "Plants": "green-thumb", "Tech": "builder", "Design": "design-nerd",
            "Writing": "storyteller", "History": "deep-diver", "Travel": "explorer",
            "Podcasts": "curious-listener", "Anime": "anime-fan", "Philosophy": "deep-thinker",
            "Sustainability": "eco-conscious", "Startups": "dreamer-builder", "Food": "foodie",
        }
        vibe_tags = [tags_map.get(i, i.lower()) for i in interests[:5]]

    try:
        result = supabase.table("social_profiles").upsert({
            "user_id": user_id, "email": email, "name": name, "city": city,
            "energy_level": energy, "intro_style": intro_s,
            "interests": interests, "vibe_tags": vibe_tags,
            "about": about, "phone": phone,
        }, on_conflict="user_id").execute()
        profile = result.data[0] if result.data else {}
        return jsonify({"success": True, "profile": profile, "vibe_tags": vibe_tags})
    except Exception as e:
        print(f"[SocialProfile] {e}")
        return jsonify({"success": True, "profile": data, "vibe_tags": vibe_tags, "note": "Profile saved (Supabase table pending setup)"})


@app.route("/api/social/events", methods=["GET"])
def list_social_events():
    city = request.args.get("city", "Bangalore")
    try:
        result = supabase.table("mystery_events") \
            .select("*").eq("city", city).eq("status", "open") \
            .order("date_time").limit(12).execute()
        return jsonify({"events": result.data or []})
    except Exception as e:
        print(f"[SocialEvents] {e}")
        return jsonify({"events": [], "note": "Run Supabase SQL to create mystery_events table"})


@app.route("/api/social/event/<event_id>", methods=["GET"])
def get_social_event(event_id):
    try:
        event_result = supabase.table("mystery_events").select("*").eq("id", event_id).single().execute()
        members_result = supabase.table("event_members").select("name,joined_at").eq("event_id", event_id).execute()
        event = event_result.data
        event["members"] = members_result.data or []
        return jsonify(event)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/social/join", methods=["POST"])
def join_social_event():
    data = request.get_json()
    event_id = data.get("event_id")
    user_id  = data.get("user_id")
    email    = data.get("email", "")
    name     = data.get("name", "")

    try:
        # Check capacity
        event_result = supabase.table("mystery_events").select("max_members, status").eq("id", event_id).single().execute()
        event = event_result.data
        if event.get("status") != "open":
            return jsonify({"error": "This event is no longer accepting members"}), 400

        members_count = supabase.table("event_members").select("id").eq("event_id", event_id).execute()
        if len(members_count.data or []) >= event.get("max_members", 4):
            supabase.table("mystery_events").update({"status": "full"}).eq("id", event_id).execute()
            return jsonify({"error": "Event is now full"}), 400

        supabase.table("event_members").insert({
            "event_id": event_id, "user_id": user_id, "email": email, "name": name
        }).execute()

        return jsonify({"success": True, "message": "You're in! Venue revealed 30 min before the event."})
    except Exception as e:
        print(f"[JoinEvent] {e}")
        return jsonify({"success": True, "message": "Joined! (Supabase table pending setup)", "note": str(e)})


@app.route("/api/social/generate-activity", methods=["POST"])
def generate_social_activity():
    data = request.get_json()
    activity_type = data.get("activity_type", "coffee_trail")
    city          = data.get("city", "Bangalore")
    interests     = data.get("collective_interests", [])
    vibe_tags     = data.get("collective_vibe_tags", [])

    activity_info = get_activity_info(activity_type)
    teaser  = generate_mystery_teaser(activity_type, city)
    icebreaker = generate_icebreaker(activity_type, interests, vibe_tags)

    plan = {
        "activity_type": activity_type,
        "activity_info": activity_info,
        "teaser": teaser,
        "icebreaker": icebreaker,
        "city": city,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    try:
        supabase.table("mystery_events").insert({
            "title": f"Mystery {activity_info['name']}",
            "city": city, "activity_type": activity_type,
            "date_time": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            "max_members": 4, "ai_plan": plan, "status": "open",
        }).execute()
    except Exception as e:
        print(f"[GenerateActivity] {e}")

    return jsonify(plan)


# ──────────────────────────────────────────────
#  AI CONCIERGE — conversational planning
# ──────────────────────────────────────────────

@app.route("/api/concierge", methods=["POST"])
def concierge():
    data = request.get_json()
    history = data.get("history", [])

    system_prompt = """You are a warm, friendly AI surprise planner having a natural conversation to gather information.
Your goal: collect these 5 things through natural dialogue:
1. relationship (who the surprise is for)
2. occasion (birthday, anniversary, etc.)
3. interests (what they like)
4. budget (in Rs)
5. city (where they are)

Rules:
- Ask ONE question at a time
- Be warm, enthusiastic, and brief (1-2 sentences)
- When you have ALL 5 pieces of info, reply EXACTLY with a JSON block like this and NOTHING else:
{"ready": true, "reply": "Perfect! Generating your plan...", "formData": {"relationship": "Girlfriend", "occasion": "Birthday", "interests": ["Music", "Food"], "budget": "5000", "city": "Mumbai", "tone": "Romantic", "description": ""}}

Until you have all info, just ask the next question naturally. Never mention you're collecting "data" or "fields".
Extract anything the user already told you and keep track."""

    messages = [{"role": "system", "content": system_prompt}]
    for msg in history[-12:]:
        if msg.get("role") in ["user", "assistant"]:
            messages.append({"role": msg["role"], "content": msg["content"]})

    try:
        resp = chat_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.75,
            max_tokens=400,
        )
        content = resp.choices[0].message.content.strip()

        # Check if model returned ready JSON
        if '"ready": true' in content or '"ready":true' in content:
            try:
                # Extract JSON block
                import re
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    parsed = json.loads(json_match.group())
                    return jsonify({
                        "reply": parsed.get("reply", "Generating your plan..."),
                        "formData": parsed.get("formData", {}),
                        "readyToGenerate": True,
                    })
            except Exception as e:
                print(f"[ConciergeJSON] {e}")

        return jsonify({"reply": content, "formData": {}, "readyToGenerate": False})
    except Exception as e:
        print(f"[Concierge] {e}")
        return jsonify({"reply": "I'm having trouble connecting. What are you planning?", "formData": {}, "readyToGenerate": False})


# ──────────────────────────────────────────────
#  REMINDERS
# ──────────────────────────────────────────────

@app.route("/api/reminder/schedule", methods=["POST"])
def schedule_reminder():
    data = request.get_json()
    plan_id = data.get("plan_id")
    user_email = data.get("user_email")
    whatsapp_number = data.get("whatsapp_number")
    event_date = data.get("event_date")
    occasion = data.get("occasion", "surprise")
    plan_idea = data.get("plan_idea", "")

    if not user_email or not event_date:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        supabase.table("reminders").upsert({
            "plan_id": plan_id,
            "user_email": user_email,
            "whatsapp_number": whatsapp_number,
            "event_date": event_date,
            "occasion": occasion,
            "plan_idea": plan_idea,
            "status": "scheduled",
        }, on_conflict="plan_id").execute()
    except Exception as e:
        print(f"[Reminder insert] {e}")

    # Send confirmation email if SMTP configured
    SMTP_EMAIL = os.getenv("SMTP_EMAIL")
    SMTP_PASS = os.getenv("SMTP_PASSWORD")
    if SMTP_EMAIL and SMTP_PASS:
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            event_dt = datetime.fromisoformat(event_date)
            days_until = (event_dt - datetime.now()).days

            body = f"""Hi! 👋

Your reminder has been set for your {occasion} surprise plan.

🎁 Plan: {plan_idea}
📅 Date: {event_dt.strftime('%A, %B %d, %Y')}
⏰ Days until event: {days_until} days

We'll remind you:
• 2 days before — to finalize preparations
• Morning of the event — to make sure everything is ready

Good luck with your surprise! ✨

— AI Surprise Planner Team
https://surprise-planner-nu.vercel.app"""

            msg = MIMEMultipart()
            msg['Subject'] = f"🔔 Reminder set — {occasion} in {days_until} days"
            msg['From'] = SMTP_EMAIL
            msg['To'] = user_email
            msg.attach(MIMEText(body, 'plain'))

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
                s.login(SMTP_EMAIL, SMTP_PASS)
                s.send_message(msg)
        except Exception as e:
            print(f"[Reminder email] {e}")

    return jsonify({"success": True, "message": "Reminder scheduled!"})


@app.route("/api/reminder/send-due", methods=["POST"])
def send_due_reminders():
    """Called by a cron job to send reminders for upcoming events."""
    today = datetime.now(timezone.utc).date()
    in_2_days = (today + timedelta(days=2)).isoformat()
    today_str = today.isoformat()

    sent = []
    SMTP_EMAIL = os.getenv("SMTP_EMAIL")
    SMTP_PASS = os.getenv("SMTP_PASSWORD")

    if not SMTP_EMAIL or not SMTP_PASS:
        return jsonify({"message": "SMTP not configured", "sent": 0})

    try:
        result = supabase.table("reminders") \
            .select("*") \
            .in_("event_date", [in_2_days, today_str]) \
            .eq("status", "scheduled") \
            .execute()

        for reminder in (result.data or []):
            is_today = reminder["event_date"] == today_str
            subject = f"🎉 Today is the day! Your {reminder['occasion']} surprise" if is_today \
                else f"⏰ 2 days until your {reminder['occasion']} surprise"
            body = f"""{"IT'S TODAY! 🎉" if is_today else "Almost time! 🎁"}

Your {reminder['occasion']} surprise is {"TODAY!" if is_today else "in 2 days!"}

Plan: {reminder.get('plan_idea', '')}

{"Make sure everything is ready — flowers ordered, venue booked, phone charged!" if is_today else "Now's a great time to confirm bookings and prep any gifts or decorations."}

Go make it magical ✨

— AI Surprise Planner"""

            try:
                import smtplib
                from email.mime.text import MIMEText
                msg = MIMEText(body)
                msg['Subject'] = subject
                msg['From'] = SMTP_EMAIL
                msg['To'] = reminder['user_email']
                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
                    s.login(SMTP_EMAIL, SMTP_PASS)
                    s.send_message(msg)
                sent.append(reminder['user_email'])

                # Update status if today
                if is_today:
                    supabase.table("reminders").update({"status": "sent"}).eq("id", reminder["id"]).execute()
            except Exception as e:
                print(f"[SendReminder] {e}")
    except Exception as e:
        print(f"[DueReminders] {e}")

    return jsonify({"sent": len(sent), "emails": sent})


if __name__ == "__main__":
    app.run(debug=True)

