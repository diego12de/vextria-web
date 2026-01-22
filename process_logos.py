
import os
from PIL import Image

# Directory containing the logos
LOGO_DIR = r"c:\Users\diego\OneDrive\Desktop\agencia\vextria-web\assets\img\brands"

def process_image(filepath):
    try:
        img = Image.open(filepath).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # item is (R, G, B, A)
            # Check if pixel is white-ish (background)
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                # Make transparent
                new_data.append((255, 255, 255, 0))
            else:
                # It's part of the logo. 
                # Convert it to pure WHITE (255, 255, 255) but keep its original alpha
                # Or if it was fully opaque black/color, make it fully opaque white.
                if item[3] > 0:
                     new_data.append((255, 255, 255, item[3]))
                else:
                    new_data.append(item)

        img.putdata(new_data)
        
        # Save updating the file
        img.save(filepath, "PNG")
        print(f"Processed: {filepath}")
        
    except Exception as e:
        print(f"Failed to process {filepath}: {e}")

def main():
    if not os.path.exists(LOGO_DIR):
        print("Directory not found!")
        return

    for filename in os.listdir(LOGO_DIR):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            process_image(os.path.join(LOGO_DIR, filename))

if __name__ == "__main__":
    main()
