import os
import json
from collections import defaultdict

# Paths
GALLERY_DIR = r"c:\Users\user\.gemini\antigravity\playground\perihelion-hubble\stairs-website\public\gallery"

def generate_json_gallery():
    # Read all images
    all_images = [f for f in os.listdir(GALLERY_DIR) if f.lower().endswith(('.webp', '.png', '.jpg', '.jpeg'))]
    
    # Sort files by name in reverse order
    all_images.sort(reverse=True)

    # Group images by "publication". The filename format is lestniza_krr_TIMESTAMP_POSTID_USERID.jpg
    # By grouping by TIMESTAMP_POSTID (or just TIMESTAMP), we can create carousels.
    publications = defaultdict(list)
    for img in all_images:
        parts = img.split('_')
        group_key = img  # Default fallback
        if len(parts) >= 4:
            # Example: lestniza_krr_1642078916_2750279750149821678_37128118062.jpg
            # the timestamp is parts[2], post ID is parts[3]. Grouping by parts[2] is usually enough for the same post.
            group_key = parts[2]
            
        publications[group_key].append(img)
        
    gallery_data = []
    # Limit to 10 photos per publication to mimic instagram, though not strictly required
    for key, imgs in publications.items():
        gallery_data.append({
            "id": key,
            "images": [f"/gallery/{i}" for i in imgs[:10]]
        })
        
    # Sort the final array by ID (timestamp) descending just to be sure
    gallery_data.sort(key=lambda x: x["id"], reverse=True)
    
    json_path = r"c:\Users\user\.gemini\antigravity\playground\perihelion-hubble\stairs-website\public\gallery.json"
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(gallery_data, f, ensure_ascii=False, indent=4)
        
    print(f"Generated gallery.json with {len(gallery_data)} publications.")

if __name__ == "__main__":
    generate_json_gallery()

