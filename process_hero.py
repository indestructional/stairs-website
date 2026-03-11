import cv2
import numpy as np
from PIL import Image

def process_hero():
    img_path = r"c:\Users\user\.gemini\antigravity\playground\perihelion-hubble\stairs-website\public\gallery\main\photo_2026-03-11_16-18-20.jpg"
    out_path = r"c:\Users\user\.gemini\antigravity\playground\perihelion-hubble\stairs-website\public\hero-stairs-new.jpg"
    
    img = cv2.imread(img_path)
    if img is None:
        print("Error loading image")
        return
        
    print(f"Original shape: {img.shape}")
    
    # --- 1. Remove the black object (sconce) ---
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 40, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    mask = np.zeros(gray.shape, dtype=np.uint8)
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if 5000 < w*h < 50000:
            # Draw on mask
            cv2.drawContours(mask, [cnt], -1, 255, thickness=cv2.FILLED)
            # expand mask a bit
            mask[y:y+h, x:x+w] = 255

    # Dilate mask to ensure edges are covered
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=2)
    
    # Inpaint
    inpainted = cv2.inpaint(img, mask, 3, cv2.INPAINT_TELEA)
    print("Inpainted black objects.")

    # --- 2. Find the handrail on the left to crop ---
    # The handrail is a dark curvy structure. We can scan from the left to find where the dark pixels begin.
    # Looking at the middle rows (y from 400 to 1000)
    crop_x = 0
    for x in range(0, img.shape[1]):
        col = gray[400:1000, x]
        # if a significant number of pixels are dark (< 60)
        dark_pixels = np.sum(col < 60)
        if dark_pixels > 20: 
            # We found the handrail! Leave some margin
            crop_x = max(0, x - 20)
            break
        # Force crop coordinate deeper to ensure empty wall is removed
    crop_x = 220
    print(f"Using manual crop x={crop_x}")
    
    # --- 3. Extract the average wall color at the crop line ---
    # To make a seamless fade in CSS, the left background should match this color
    # Let's take a 10px wide strip at the crop line
    wall_strip = inpainted[200:1000, max(0, crop_x-10):crop_x+10]
    avg_color_bgr = np.mean(wall_strip, axis=(0,1))
    avg_color_rgb = (int(avg_color_bgr[2]), int(avg_color_bgr[1]), int(avg_color_bgr[0]))
    hex_color = '#{:02x}{:02x}{:02x}'.format(*avg_color_rgb)
    print(f"Wall color hex: {hex_color}")
    
    # --- 4. Crop and Upscale ---
    # The user wanted it somewhat square and on the right.
    # We will crop from crop_x to the right edge.
    h, w = inpainted.shape[:2]
    cropped = inpainted[0:h, crop_x:w]
    print(f"Cropped to: {cropped.shape}")
    
    # Upscale
    img_pil = Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
    
    # Resize to have height 1200
    ratio = 1200 / h
    new_w = int(cropped.shape[1] * ratio)
    img_upscaled = img_pil.resize((new_w, 1200), Image.Resampling.LANCZOS)
    
    img_upscaled.save(out_path, quality=95)
    print(f"Saved final image to {out_path} at size {img_upscaled.size}")

if __name__ == '__main__':
    process_hero()
