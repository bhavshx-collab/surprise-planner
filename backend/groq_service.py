import os
import json
import random
from groq import Groq


def get_groq_client():
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        return None
    try:
        return Groq(api_key=api_key)
    except Exception as e:
        print(f"[Groq Init Error] {e}")
        return None


def generate_smart_fallback_plan(occasion, relationship, budget, interests, description, likes, city, tone):
    """
    Intelligent, rich fallback generator that produces deeply customized,
    budget-exact surprise plans when AI provider is unavailable.
    """
    try:
        b = int(float(str(budget).replace(",", "").replace("Rs", "").strip()))
        if b <= 0:
            b = 5000
    except Exception:
        b = 5000

    # Exact budget breakdown summing to b
    v_amt = int(round(b * 0.30))
    f_amt = int(round(b * 0.25))
    d_amt = int(round(b * 0.20))
    g_amt = int(round(b * 0.15))
    buf_amt = b - (v_amt + f_amt + d_amt + g_amt)

    budget_breakdown = {
        "Venue": v_amt,
        "Food/Drinks": f_amt,
        "Decor": d_amt,
        "Gifts": g_amt,
        "Buffer": buf_amt,
    }

    occ = (occasion or "Birthday").strip()
    rel = (relationship or "Loved One").strip()
    ton = (tone or "Romantic").strip().title()
    cit = (city or "").strip()
    city_suffix = f" in {cit}" if cit else ""
    desc = (description or "").strip()
    likes_str = (likes or "").strip()

    interest_list = [i.strip() for i in interests if i.strip()] if interests else []
    first_int = interest_list[0] if interest_list else "Music"
    all_interests_str = ", ".join(interest_list) if interest_list else "the things they love most"

    # Tailored Idea Options by Tone & Interest
    ideas_catalog = {
        "Romantic": [
            f"The Candlelit Secret Rooftop & Acoustic Serenade Experience{city_suffix}",
            f"A Private Starlit Memory Trail & Curated Keepsake Celebration{city_suffix}",
            f"The Hidden Sunset Vineyard & Handwritten Love Letters Picnic{city_suffix}",
            f"An Enchanted Floral Sanctuary & Personalized Chef's Table{city_suffix}",
        ],
        "Adventurous": [
            f"The Mystery Coordinates & Hidden Scenic Roadtrip Expedition{city_suffix}",
            f"An Adrenaline Scavenger Quest with Secret Clues & Sunset Viewpoint{city_suffix}",
            f"The Starlit Camping Trail & Midnight Acoustic Campfire Surprise{city_suffix}",
            f"An Off-the-Beaten-Path Discovery Tour & Private Outdoor Celebration{city_suffix}",
        ],
        "Luxury": [
            f"The VIP Skyline Suite, Private Dining & Chauffeur Experience{city_suffix}",
            f"An Exclusive Golden Hour Yacht & Gourmet Degustation Evening{city_suffix}",
            f"The Haute Couture Studio & Fine Dining Candlelight Gala{city_suffix}",
            f"A Five-Star Private Lounge & Curated High-End Gift Reveal{city_suffix}",
        ],
        "Minimal": [
            f"The Cozy Hidden Café Sanctuary & Handcrafted Memory Journal{city_suffix}",
            f"A Warm Twilight Stroll, Polaroid Trail & Quiet Waterfront Moments{city_suffix}",
            f"The Intimate Vinyl Listening Session & Artisan Pastry Tasting{city_suffix}",
            f"A Thoughtfully Curated Care Package & Meaningful Sunset Rendezvous{city_suffix}",
        ],
        "Funny": [
            f"The 'Fake Routine' Operation Leading to an Epic Confetti Flashmob{city_suffix}",
            f"A Hilarious Meme-Themed Scavenger Hunt Ending in Their Favorite Feast{city_suffix}",
            f"The Undercover Secret Agent Mission with Ridiculous Clues & Cake{city_suffix}",
            f"The Comedy Roast & Toast Celebration with Close Friends & Custom Merch{city_suffix}",
        ],
        "Emotional": [
            f"The Living Memory Wall & Heartfelt Video Montage Celebration{city_suffix}",
            f"A Nostalgic Journey Through Every Chapter of Your Story Together{city_suffix}",
            f"The Reunion of Cherished Voices & Hand-Bound Memory Keepsake{city_suffix}",
            f"An Intimate Heart-to-Heart Candlelight Haven & Time-Capsule Reveal{city_suffix}",
        ],
    }

    category_ideas = ideas_catalog.get(ton, ideas_catalog["Romantic"])
    chosen_idea = random.choice(category_ideas)

    # Personal Warm Message
    messages = [
        f"To my favorite {rel.lower()}: you bring so much warmth, laughter, and light into every day. On this special {occ.lower()}, every single detail of this moment was crafted purely to celebrate you and your love for {all_interests_str}.",
        f"Happy {occ}! You deserve a celebration as genuinely extraordinary as you are. Today is all about honoring who you are, what you cherish, and making unforgettable memories together.",
        f"Watching you smile is the greatest joy. This {occ.lower()} celebration is a tribute to all the little moments that make you special, especially your passion for {first_int} and the wonderful energy you bring to the world.",
    ]
    chosen_message = random.choice(messages)

    # Explanation
    personal_touch = f"including details like '{desc[:60]}...'" if desc else f"highlighting their interest in {all_interests_str}"
    chosen_explanation = (
        f"This {ton.lower()} surprise perfectly balances your ₹{b:,} budget with deep emotional personalization. "
        f"It transforms {personal_touch} into an immersive experience without feeling generic or rushed."
    )

    # Concrete Actionable Timeline
    timeline = {
        "before": [
            f"2 Weeks Before: Discreetly confirm venue availability and secure private bookings{city_suffix}.",
            f"1 Week Before: Gather cherished photos, prepare custom gifts, and curate a dedicated {first_int} playlist.",
            f"2 Days Before: Finalize decor arrangements (fairy lights, custom signage, florals) and coordinate with vendors.",
            f"1 Day Before: Pack all surprise essentials and send a subtle decoy message to maintain complete surprise.",
        ],
        "during": [
            f"Morning: Deliver a heartfelt handwritten teaser note alongside their favorite morning beverage.",
            f"Afternoon: Guide them through a relaxed decoy plan before smoothly escorting them to the secret destination.",
            f"Evening: The Grand Reveal: Unveil the personalized setup with {all_interests_str}-themed highlights, dining, and celebration.",
        ],
        "after": [
            f"Next Day: Enjoy a leisurely breakfast together while looking through the captured photos and reaction clips.",
            f"Memory Keepsake: Frame the best picture from the evening or store keepsakes in a memory box as a lasting reminder.",
        ],
    }

    return {
        "idea": chosen_idea,
        "message": chosen_message,
        "explanation": chosen_explanation,
        "timeline": timeline,
        "budget_breakdown": budget_breakdown,
    }


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

    client = get_groq_client()
    if client:
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

            # Validate budget_breakdown
            if "budget_breakdown" not in data or not isinstance(data["budget_breakdown"], dict):
                try:
                    b = int(float(str(budget).replace(",", "")))
                except Exception:
                    b = 5000
                v = int(round(b * 0.30))
                f = int(round(b * 0.25))
                d = int(round(b * 0.20))
                g = int(round(b * 0.15))
                buf = b - (v + f + d + g)
                data["budget_breakdown"] = {
                    "Venue": v, "Food/Drinks": f, "Decor": d, "Gifts": g, "Buffer": buf
                }

            return data

        except json.JSONDecodeError as e:
            print(f"[Groq JSON error] {e} - falling back to smart generator")
        except Exception as e:
            print(f"[Groq API error] {e} - falling back to smart generator")

    # If Groq is unavailable, failed, or key is invalid:
    print("[Plan Generator] Using intelligent fallback generator.")
    return generate_smart_fallback_plan(
        occasion=occasion, relationship=relationship, budget=budget,
        interests=interests, description=description, likes=likes,
        city=city, tone=tone
    )