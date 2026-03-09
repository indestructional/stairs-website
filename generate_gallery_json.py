import os
import json
from collections import defaultdict

# Paths
GALLERY_DIR = r"c:\Users\user\.gemini\antigravity\playground\perihelion-hubble\stairs-website\public\gallery"

def process_folder(folder_name):
    folder_path = os.path.join(GALLERY_DIR, folder_name)
    if not os.path.exists(folder_path):
        return []

    all_images = [f for f in os.listdir(folder_path) if f.lower().endswith(('.webp', '.png', '.jpg', '.jpeg'))]
    all_images.sort(reverse=True)

    publications = defaultdict(list)
    for img in all_images:
        parts = img.split('_')
        group_key = img
        if len(parts) >= 4:
            # lestniza_krr_TIMESTAMP_...
            group_key = parts[2]
            
        publications[group_key].append(img)
        
    gallery_data = []
    for key, imgs in publications.items():
        gallery_data.append({
            "id": key,
            "images": [f"/gallery/{folder_name}/{i}" for i in imgs[:10]]
        })
        
    gallery_data.sort(key=lambda x: x["id"], reverse=True)
    return gallery_data

def generate_json_gallery():
    gallery_data = {
        "stairs": process_folder("stairs"),
        "other": process_folder("other")
    }
    
    json_path = os.path.join(GALLERY_DIR, "..", "gallery.json")
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(gallery_data, f, ensure_ascii=False, indent=4)
        
    print(f"Generated gallery.json with {len(gallery_data['stairs'])} stairs and {len(gallery_data['other'])} other publications.")

if __name__ == "__main__":
    generate_json_gallery()

