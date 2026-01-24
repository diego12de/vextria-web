from PIL import Image
import os

def optimize_image(input_path, output_path, max_width=None):
    try:
        img = Image.open(input_path)
        
        if max_width and img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
        # Save as WebP
        img.save(output_path, 'WEBP', quality=80)
        print(f"Optimized: {input_path} -> {output_path}")
        
    except Exception as e:
        print(f"Error optimizing {input_path}: {e}")

# Optimize profile image
input_file = r"c:\Users\diego\OneDrive\Desktop\construcción agencia\vextria-web\assets\img\diego-profile.png"
output_file = r"c:\Users\diego\OneDrive\Desktop\construcción agencia\vextria-web\assets\img\diego-profile.webp"

# Resize to reasonable dimension (e.g. 400px width is usually enough for a profile pic unless it's hero background coverage)
# Visual inspection of the site suggests it's small, let's verify usage size first.
# Actually let's assume 800px width to be safe for retina displays if it's main feature.
optimize_image(input_file, output_file, max_width=600) 
