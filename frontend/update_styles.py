import os

directory = r'c:\Users\bhavesh kumar\OneDrive\Documents\surprice_planer\frontend\src'
replacements = {
    "'DM Sans'": "'Inter'",
    "'Cormorant Garamond'": "'Outfit'",
    "#D4AF37": "#E53935",
    "#E8C84A": "#F44336",
    "rgba(212,175,55": "rgba(229,57,53",
    "#7B6EE8": "#FFFFFF",
    "rgba(123,110,232": "rgba(255,255,255",
    "#1DB375": "#FFFFFF",
    "rgba(29,179,117": "rgba(255,255,255"
}

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {file}')
