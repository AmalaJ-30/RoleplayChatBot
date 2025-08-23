from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_keys import router as chat_router
from image_gen import router as image_router
from fastapi.responses import JSONResponse

app = FastAPI()


# ✅ CORS so frontend & Node can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://stellular-pavlova-647c52.netlify.app",
    "https://theairoleplay.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount routers
app.include_router(chat_router)                     # exposes /chat
app.include_router(image_router, prefix="/chats")   # exposes /chats/{chat_id}/image

# ✅ Debug route
@app.get("/routes")
async def list_routes():
    return [{"path": route.path, "methods": list(route.methods)} for route in app.routes]

# ✅ Debug print AFTER startup (ensures routes are mounted)
@app.on_event("startup")
async def startup_event():
    print(">>> FastAPI app started")
    print(">>> All registered routes:")
    for route in app.routes:
        print("   ", route.path, route.methods)
