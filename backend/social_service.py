import json
from groq import Groq
import os

chat_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

ACTIVITY_DESCRIPTIONS = {
    "board_games": {
        "name": "Board Game Night",
        "emoji": "🎲",
        "teaser": "A curated evening of strategy, laughter, and connection — no experience needed.",
        "what_to_expect": [
            "Arrive at the venue independently (no awkward group entrances)",
            "Games chosen based on your group's collective vibe",
            "Starter icebreaker game to ease in",
            "2–3 hours of low-pressure fun",
        ],
        "energy": "low",
        "ideal_for": "Perfect if you love games but hate loud bars",
    },
    "coffee_trail": {
        "name": "Quiet Coffee Trail",
        "emoji": "☕",
        "teaser": "Three indie cafés, one afternoon, and the kind of conversation you actually remember.",
        "what_to_expect": [
            "Start at a curated indie café",
            "Short walk (5–10 min) between stops",
            "Each café has a conversation prompt on your table",
            "No rush, no pressure — leave when you want",
        ],
        "energy": "low",
        "ideal_for": "For people who think best over a good cup of coffee",
    },
    "art_workshop": {
        "name": "Art Workshop",
        "emoji": "🎨",
        "teaser": "Pottery, watercolour, or collage — guided by an artist, energised by strangers who become friends.",
        "what_to_expect": [
            "90-minute guided workshop with an artist",
            "All materials provided",
            "Side-by-side creative work (pressure-free)",
            "Take home what you make",
        ],
        "energy": "low",
        "ideal_for": "Curious hands and quiet minds",
    },
    "nature_walk": {
        "name": "Nature Walk",
        "emoji": "🌿",
        "teaser": "Cubbon Park or Lalbagh — golden light, birdsong, and people who chose fresh air over a Saturday couch.",
        "what_to_expect": [
            "60–90 minute guided walk",
            "Nature trivia & gentle prompts along the way",
            "Ends at a nearby café for chai",
            "Comfy shoes recommended",
        ],
        "energy": "medium",
        "ideal_for": "Early risers and outdoor lovers",
    },
    "book_swap": {
        "name": "Book Swap",
        "emoji": "📚",
        "teaser": "Bring a book you love. Leave with one you've never heard of. Talk about both.",
        "what_to_expect": [
            "Bring 1 book you'd recommend",
            "Each person pitches their book in 60 seconds",
            "Swap, read the first page together, discuss",
            "Chai / coffee included",
        ],
        "energy": "low",
        "ideal_for": "Readers who want to talk about books with real humans",
    },
    "cook_together": {
        "name": "Cook Together",
        "emoji": "🍳",
        "teaser": "One kitchen. One dish. Four people who've never met. The meal is just the excuse.",
        "what_to_expect": [
            "Community kitchen space",
            "Recipe chosen by the AI based on your group's food preferences",
            "Everyone has a role — no experience needed",
            "Eat together what you make",
        ],
        "energy": "medium",
        "ideal_for": "Food lovers who miss home cooking",
    },
}


def generate_icebreaker(activity_type: str, interests: list, vibe_tags: list) -> dict:
    """Generate an AI icebreaker card for a group based on their shared interests."""
    interest_str = ", ".join(interests[:8]) if interests else "varied"
    vibe_str = ", ".join(vibe_tags[:6]) if vibe_tags else "curious, thoughtful"

    prompt = f"""You are designing an icebreaker card for a small group of 3-4 introverts meeting for the first time at a {activity_type} event.

Group's collective interests: {interest_str}
Group's vibe: {vibe_str}

Create a JSON icebreaker card with:
- "starter_question": One warm, specific, non-generic question (not "what do you do?")
- "fun_fact_prompt": "Share one surprising fact about yourself that has nothing to do with work"
- "group_challenge": A light 2-minute activity they can do together right now
- "conversation_sparks": Array of 3 topic prompts drawn from their shared interests
- "secret_role": A fun secret role for each person (e.g., "You are the Official Timekeeper")

Return ONLY valid JSON, no explanation."""

    try:
        resp = chat_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.85,
            max_tokens=400,
        )
        content = resp.choices[0].message.content.strip()
        if "```" in content:
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except Exception as e:
        print(f"[Icebreaker] {e}")
        return {
            "starter_question": "What's one small thing that made you smile this week?",
            "fun_fact_prompt": "Share one surprising fact about yourself that has nothing to do with work",
            "group_challenge": "Everyone describe their perfect Saturday in exactly 10 words",
            "conversation_sparks": [
                "What's the last book / show / place that genuinely surprised you?",
                "What's something you're slowly getting good at?",
                "Where would you go if you had a free weekend and no plans?"
            ],
            "secret_role": "You are the Official Vibe Checker — give everyone a thumbs up when energy dips"
        }


def generate_mystery_teaser(activity_type: str, city: str) -> str:
    """Generate a poetic mystery teaser for an event without revealing the venue."""
    activity = ACTIVITY_DESCRIPTIONS.get(activity_type, {})
    activity_name = activity.get("name", activity_type)

    prompt = f"""Write a 2-sentence mystery teaser for an upcoming {activity_name} event in {city}.
Tone: warm, intriguing, slightly poetic. Do NOT mention the specific venue.
Make someone feel: "I want to be there." Max 40 words total. No quotes."""

    try:
        resp = chat_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=80,
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        print(f"[Teaser] {e}")
        return activity.get("teaser", "An experience crafted for the thoughtfully curious.")


def compute_match_score(profile1: dict, profile2: dict) -> int:
    """Score compatibility between two social profiles (0-100)."""
    score = 0
    # Interest overlap
    interests1 = set(profile1.get("interests", []))
    interests2 = set(profile2.get("interests", []))
    overlap = len(interests1 & interests2)
    score += min(overlap * 15, 60)  # Max 60 from interests

    # Energy level match
    if profile1.get("energy_level") == profile2.get("energy_level"):
        score += 25
    elif abs(["low", "medium", "high"].index(profile1.get("energy_level", "medium")) -
             ["low", "medium", "high"].index(profile2.get("energy_level", "medium"))) == 1:
        score += 12

    # Same city
    if profile1.get("city", "").lower() == profile2.get("city", "").lower():
        score += 15

    return min(score, 100)


def get_activity_info(activity_type: str) -> dict:
    return ACTIVITY_DESCRIPTIONS.get(activity_type, ACTIVITY_DESCRIPTIONS["coffee_trail"])
