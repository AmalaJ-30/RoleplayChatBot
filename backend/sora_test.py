import requests
#import base64
from PIL import Image
#import io
import re
import os
from dotenv import load_dotenv
load_dotenv() 

API_KEY = os.getenv("SORA_API_KEY")
API_URL = "https://api.laozhang.ai/v1/chat/completions"

def generate_image(prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    data = {
        "model": "sora_image",
        "stream": False,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    }
    
    response = requests.post(API_URL, headers=headers, json=data)
    result = response.json()
    
    content = result["choices"][0]["message"]["content"]
    
    # Extract URL inside Markdown ![图片](URL)
    match = re.search(r"\((.*?)\)", content)
    if not match:
        raise ValueError("No image URL found in response")
    
    image_url = match.group(1)
    print("✅ Image URL:", image_url)
    
    # Download image
    img_data = requests.get(image_url).content
    with open("generated_image.png", "wb") as f:
        f.write(img_data)
    
    print("✅ Image saved as generated_image.png")
    return image_url

# Test run
generate_image("George Washington dressed as a pirate, cinematic, photorealistic, detailed")
