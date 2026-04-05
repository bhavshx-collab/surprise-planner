import os, requests

FAL_KEY = os.getenv("FAL_API_KEY")

PROMPTS = [
    "cinematic luxury surprise, {tone} mood, {occasion}, golden hour, bokeh, editorial",
    "intimate romantic scene, {occasion} reveal, premium venue, candles, emotional, film",
    "elegant gift flat-lay, {tone} palette, luxury wrapping, soft studio light",
    "couple silhouette, surprise moment, {tone} atmosphere, cinematic, professional photo",
]

def generate_moodboard(idea, tone, occasion):
    if not FAL_KEY:
        return []
    urls = []
    for tmpl in PROMPTS:
        prompt = tmpl.format(tone=tone.lower(), occasion=occasion.lower())
        try:
            r = requests.post(
                "https://fal.run/fal-ai/flux/schnell",
                headers={"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"},
                json={"prompt": prompt, "image_size": "landscape_4_3", "num_images": 1, "num_inference_steps": 4},
                timeout=25,
            )
            data = r.json()
            if data.get("images"):
                urls.append(data["images"][0]["url"])
        except Exception as e:
            print(f"[Moodboard] {e}")
    return urls
