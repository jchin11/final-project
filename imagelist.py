import os
import glob

# yoinked this from stack exchange
IMAGE_FOLDER = "images"
PATTERN = os.path.join(IMAGE_FOLDER, "*.jpg")

files = sorted(glob.glob(PATTERN))

with open("images.js", "w", encoding="utf-8") as f:
    f.write("const images = [\n")
    for path in files:
        web_path = path.replace("\\", "/")  
        f.write(f"  '{web_path}',\n")
    f.write("];\n")

print(f"Saved {len(files)} image paths to images.js")
