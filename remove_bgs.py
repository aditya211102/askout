import os
from rembg import remove
from PIL import Image
import io

input_dir = 'C:\\Users\\adity\\.gemini\\antigravity\\brain\\e2ebdf3a-523f-437c-b40a-93bffc9b7c4b'
output_dir = 'c:\\Users\\adity\\OneDrive\\Desktop\\Loop\\askout\\public\\flowers'

# Make sure output directory exists
os.makedirs(output_dir, exist_ok=True)

# List of files we generated
flowers = [
    'flower_red_rose',
    'flower_pink_peony',
    'flower_blue_hydrangea',
    'flower_yellow_sunflower',
    'flower_white_daisy',
    'flower_purple_lavender',
    'flower_orange_tulip'
]

print("Starting background removal...")

for flower in flowers:
    # Find the newly generated file (it has a timestamp suffix)
    files = [f for f in os.listdir(input_dir) if f.startswith(flower) and f.endswith('.png')]
    if not files:
        print(f"Could not find generated image for {flower}")
        continue
        
    latest_file = sorted(files)[-1]  # Get the most recent one if multiple
    input_path = os.path.join(input_dir, latest_file)
    
    # We'll map the names to match the codebase's FLOWERS constant mapping
    output_name = latest_file.replace('flower_', '').split('_17')[0] + '.png'
    # Map back to exact IDs used in codebase
    name_map = {
        'red_rose': 'red-rose',
        'pink_peony': 'peony',
        'blue_hydrangea': 'hydrangea',
        'yellow_sunflower': 'sunflower',
        'white_daisy': 'daisy',
        'purple_lavender': 'lavender',
        'orange_tulip': 'tulip',
    }
    
    base_name = output_name.replace('.png', '')
    if base_name in name_map:
        output_name = name_map[base_name] + '.png'
        
    output_path = os.path.join(output_dir, output_name)
    
    print(f"Processing {input_path} -> {output_path}")
    
    try:
        with open(input_path, 'rb') as i:
            input_data = i.read()
            
        print(f"  Removing background...")
        # Use rembg to remove the background
        output_data = remove(input_data)
        
        # Save as PNG with transparency
        img = Image.open(io.BytesIO(output_data))
        
        # Crop the transparent edges tightly
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        # Resize to a reasonable size if it's too large (flowers don't need to be 1024x1024)
        img.thumbnail((400, 400), Image.Resampling.LANCZOS)
            
        img.save(output_path, 'PNG')
        print(f"  Saved {output_name} successfully")
    except Exception as e:
        print(f"Error processing {flower}: {e}")

print("Done!")
