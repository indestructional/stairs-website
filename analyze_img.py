import cv2
import numpy as np

img_path = r"c:\Users\user\.gemini\antigravity\playground\perihelion-hubble\stairs-website\public\gallery\main\photo_2026-03-11_16-18-20.jpg"
img = cv2.imread(img_path)

# Print image dimensions
print(f"Image shape: {img.shape}")

# Grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Threshold to find very dark objects
_, thresh = cv2.threshold(gray, 40, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

dark_objects = []
for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    area = w * h
    if 100 < area < 50000: # filter out too small and too large
        dark_objects.append({"x": x, "y": y, "w": w, "h": h, "area": area})

print("Found dark objects:")
for obj in sorted(dark_objects, key=lambda x: x['area'], reverse=True)[:5]:
    print(obj)
