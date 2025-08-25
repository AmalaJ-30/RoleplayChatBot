# The AI Roleplay 🤖🎭
Live demo: [https://theairoleplay.com](https://theairoleplay.com)

## 📖 Overview
The AI Roleplay is an interactive chatbot platform that lets users roleplay with historical figures, celebrities, and characters.  
Users can:
- Sign up & log in securely
- Start and save multiple chats
- Generate AI-powered images for each roleplay
- Reset passwords via email verification

---

## 🚀 Tech Stack
- **Frontend:** React + Vite (deployed on Netlify)
- **Backend (Auth):** Node.js / Express + MongoDB (deployed on Render)
- **Backend (Chat & Images):** FastAPI (Python) + OpenAI API + AWS S3 (deployed on Render)
- **Image Generation:** DALL·E → S3 permanent storage
- **Email:** Postmark (verification & password reset)
- **Hosting:** Netlify (frontend), Render (backends)

---

## 🖥️ Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/roleplay-chatbot.git
   cd roleplay-chatbot

Install dependencies:

Frontend:

cd frontend
npm install
npm run dev


Auth backend:

cd backend-auth
npm install
npm run dev


FastAPI backend:

cd backend-fastapi
pip install -r requirements.txt
uvicorn main:app --reload
