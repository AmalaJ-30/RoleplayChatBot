import boto3
import os
import uuid
from dotenv import load_dotenv
load_dotenv()
# Load from environment variables (recommended) or hardcode while testing
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "theairoleplay-images")

# Initialize S3 client
s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

def test_upload():
    try:
        # Create dummy file content
        test_content = b"Hello, this is a test upload from boto3!"
        filename = f"test-{uuid.uuid4().hex}.txt"

        # Upload
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=test_content,
            ContentType="text/plain",
            #ACL="public-read",  # important: makes it accessible
        )

        # Build file URL
        url = f"https://{BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
        print("✅ Upload successful! File available at:")
        print(url)

    except Exception as e:
        print("❌ Upload failed:", str(e))

if __name__ == "__main__":
    test_upload()
