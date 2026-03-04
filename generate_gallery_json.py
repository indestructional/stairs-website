import os
import shutil
import json
from pathlib import Path

# Paths
GALLERY_DIR = r"c:\Users\user\.gemini\antigravity\playground\perihelion-hubble\stairs-website\public\gallery"

def list_images(directory):
    return [f for f in os.listdir(directory) if f.lower().endswith(('.webp', '.png', '.jpg', '.jpeg'))]

def generate_json_gallery():
    # Read all images from the main folder since they haven't been sorted yet
    all_images = list_images(GALLERY_DIR)
    
    # Sort files by name (which contains timestamp) in reverse order to show newest first
    all_images.sort(reverse=True)

    gallery_data = {
        "stairs": [f"/gallery/{img}" for img in all_images],
        "other": []
    }
    
    json_path = r"c:\Users\user\.gemini\antigravity\playground\perihelion-hubble\stairs-website\public\gallery.json"
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(gallery_data, f, ensure_ascii=False, indent=4)
        
    print(f"Generated gallery.json with {len(all_images)} images.")

if __name__ == "__main__":
    generate_json_gallery()
