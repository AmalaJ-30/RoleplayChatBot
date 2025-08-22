'''import requests
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
        #"model": "gpt-image-1",
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
'''
# backend/image_gen.py
# pyright: reportMissingImports=false
import os
import traceback
import requests
import uuid
import boto3
from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
DALLE_KEY = os.getenv("OPENAI_API_KEY_Dalle") 
client = OpenAI(api_key=DALLE_KEY)

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# ✅ Correct boto3 client init
s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

router = APIRouter()

class ImageRequest(BaseModel):
    session_id: str
    person: str
    role: str

@router.post("/{chat_id}/image")
async def generate_image(chat_id: str, request: ImageRequest):
    prompt = f"{request.person} dressed as a {request.role}, cinematic, photorealistic, funny"

    try:
        # 👇 Ask for base64 response
        result = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            response_format="url"
        )

        # Extract base64 string
        #image_b64 = result.data[0].b64_json

        # Convert into data URI for frontend
        temp_url = result.data[0].url
        
        img_response = requests.get(temp_url)
        if img_response.status_code != 200:
           return {"error": "Failed to download image from OpenAI", "url": temp_url}
        

        filename = f"{uuid.uuid4().hex}.png"
        s3.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=filename,
            Body=img_response.content,
            ContentType="image/png"
        )

        # 4. Build permanent URL
        s3_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
        return {
            "session_id": request.session_id,
            "person": request.person,
            "role": request.role,
            "image_url": s3_url
        }

    except Exception as e:
        print("❌ Image generation error:")
        traceback.print_exc()
        return {"error": str(e)}
