import requests
import re
import os
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

# Load env keys
load_dotenv()
SORA_API_KEY = os.getenv("SORA_API_KEY")
API_URL = "https://api.laozhang.ai/v1/chat/completions"

router = APIRouter()

class ImageRequest(BaseModel):
    person: str
    role: str

@router.post("/chats/{chat_id}/image")
async def generate_image(chat_id: str, request: ImageRequest):
    prompt = f"{request.person} dressed as a {request.role}, cinematic, photorealistic, detailed"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SORA_API_KEY}"
    }
    data = {
        "model": "sora_image",
        "stream": False,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt}
                ]
            }
        ]
    }

    response = requests.post(API_URL, headers=headers, json=data)

    try:
        result = response.json()
    except Exception as e:
        return {"error": f"Invalid response from image API: {e}", "raw": response.text}

    # Check if API returned choices
    if "choices" not in result or not result["choices"]:
        return {"error": f"Image API failed", "raw": result}

    content = result["choices"][0]["message"]["content"]

    match = re.search(r"\((.*?)\)", content)
    if not match:
        return {"error": f"No image URL found in content", "content": content}

    image_url = match.group(1)

    return {
        "chat_id": chat_id,
        "person": request.person,
        "role": request.role,
        "image_url": image_url
    }
