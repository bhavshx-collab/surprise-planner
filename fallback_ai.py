import random

def fallback_message(relationship, occasion, idea, interests):
    tones = ["romantic", "sweet", "playful", "emotional"]
    tone = random.choice(tones)

    interest_text = ", ".join(interests)

    templates = [
        f"This {occasion.lower()} felt like the perfect moment to do something special for you. Knowing how much you love {interest_text}, I hope this brings a smile to your face 💖",

        f"I kept thinking about what would make you happiest, and this idea felt right — especially because of your love for {interest_text}. Happy {occasion.lower()} 💫",

        f"You mean so much to me, and this small surprise is just a reflection of that. Your love for {interest_text} inspired this moment 🌸",

        f"This isn’t just a {occasion.lower()} surprise — it’s a reminder of how much I cherish you and the little things you love, like {interest_text} 💕",
    ]

    return random.choice(templates)


def fallback_explanation(occasion, relationship, budget, idea, interests):
    interest_text = ", ".join(interests)

    explanations = [
        f"This surprise fits well within your budget while still feeling meaningful and personal. It connects naturally with interests like {interest_text}.",

        f"The idea keeps things simple yet thoughtful, making it perfect for a {relationship.lower()} on {occasion.lower()} within ₹{budget}.",

        f"This plan balances emotional value and budget, while also reflecting personal interests such as {interest_text}.",
    ]

    return random.choice(explanations)
