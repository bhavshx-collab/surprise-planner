# planner.py

# Step 1: Hardcoded surprise ideas (database later)
SURPRISE_IDEAS = [
    {
        "id": 1,
        "occasion": "Birthday",
        "relationship": "Girlfriend",
        "min_budget": 500,
        "max_budget": 3000,
        "idea": "Handwritten letter + small gift + cake"
    },
    {
        "id": 2,
        "occasion": "Birthday",
        "relationship": "Girlfriend",
        "min_budget": 3000,
        "max_budget": 8000,
        "idea": "Room decoration + surprise dinner + personalized gift"
    },
    {
        "id": 3,
        "occasion": "Anniversary",
        "relationship": "Girlfriend",
        "min_budget": 1000,
        "max_budget": 5000,
        "idea": "Memory scrapbook + flowers + candle-light setup"
    },
    {
        "id": 4,
        "occasion": "Birthday",
        "relationship": "Boyfriend",
        "min_budget": 500,
        "max_budget": 3000,
        "idea": "Customized wallet + handwritten note + cake"
    }
]


def get_surprise_ideas(occasion, relationship, budget):
    ideas = []

    if occasion == "Birthday" and relationship == "Girlfriend":
        if budget >= 500:
            ideas.extend([
                "Romantic candlelight dinner at home",
                "Handwritten letter with a small personalized gift",
                "Surprise video montage with favorite memories",
                "Customized playlist and evening walk together",
                "Mini surprise party with close friends"
            ])

    if occasion == "Birthday" and relationship == "Friend":
        if budget >= 300:
            ideas.extend([
                "Casual café meetup with cake",
                "Photo frame with a shared memory",
                "Surprise movie night",
                "Fun activity based on a shared hobby"
            ])

    if occasion == "Anniversary" and relationship in ["Girlfriend", "Boyfriend"]:
        if budget >= 1000:
            ideas.extend([
                "Romantic dinner date",
                "Weekend getaway plan",
                "Memory scrapbook with notes",
                "Recreate your first date"
            ])

    return ideas


# Test the logic
if __name__ == "__main__":
    results = get_surprise_ideas(
        occasion="Birthday",
        relationship="Girlfriend",
        budget=2500
    )

    print("Recommended Surprise Ideas:")
    for r in results:
        print("-", r)
