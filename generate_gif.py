import os
from PIL import Image

assets_dir = 'assets'
frame_files = [
    'frame_01_home.png',
    'frame_02_location_detail.png',
    'frame_03_all_events.png',
    'frame_04_filtered_events.png',
    'frame_05_countdowns_past.png'
]

images = []
for file_name in frame_files:
    file_path = os.path.join(assets_dir, file_name)
    if os.path.exists(file_path):
        img = Image.open(file_path).convert('RGB')
        images.append(img)

if images:
    gif_path = os.path.join(assets_dir, 'demo.gif')
    images[0].save(
        gif_path,
        save_all=True,
        append_images=images[1:],
        duration=1500,  # 1.5 seconds per frame
        loop=0
    )
    print(f"Generated demo GIF successfully at {gif_path} (size: {os.path.getsize(gif_path)} bytes)")
else:
    print("No frame images found!")
