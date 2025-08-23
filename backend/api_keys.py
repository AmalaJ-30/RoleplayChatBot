#Api keys.py
#remeber that this does not remeber information when you go back and forth between session ID'S - it does now
'''import getpass
import os
from functools import lru_cache
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.messages import AIMessage
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
load_dotenv() 


router = APIRouter()


os.environ["LANGCHAIN_TRACKING_V2"] = "true"
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
model = ChatOpenAI(model="gpt-3.5-turbo")

@lru_cache(maxsize=1)
def get_chat_model():
    # Remove any proxy vars that Render/host might inject
    for k in ("OPENAI_PROXY", "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "OPENAI_HTTP_PROXY"):
        os.environ.pop(k, None)

    return ChatOpenAI(
        model="gpt-3.5-turbo",
        openai_api_key=os.environ.get("OPENAI_API_KEY")
    )

store = {}
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]



#.invoke([HumanMessage(content="Hi! I'm Bob")])
class ChatRequest(BaseModel):
    session_id: str
    person: str
    role: str
    message: str
print("Start chat")
@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    config = {"configurable": {"session_id": request.session_id}}

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            f"You are {request.person}, a {request.role}. Answer all questions as if you are {request.person}."
        ),
        MessagesPlaceholder(variable_name="messages"),
    ])
    chain = prompt | model
    with_message_history = RunnableWithMessageHistory(chain, get_session_history)

    response = with_message_history.invoke([HumanMessage(content=request.message)], config=config)
    return {"reply": response.content}
    '''
# backend/api_keys.py
import os
from functools import lru_cache

from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from openai import OpenAI
load_dotenv()

router = APIRouter()

os.environ["LANGCHAIN_TRACKING_V2"] = "true"
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

# ✅ Lazy getter — do NOT create ChatOpenAI at import time
@lru_cache(maxsize=1)
def get_chat_model():
    # Strip any proxy envs that can cause the 'proxies' kwarg crash
    for k in ("OPENAI_PROXY", "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "OPENAI_HTTP_PROXY"):
        os.environ.pop(k, None)
    return ChatOpenAI(
        model="gpt-3.5-turbo",              # or 'gpt-4o-mini'
        openai_api_key=os.environ.get("OPENAI_API_KEY"),
    )

store: dict[str, InMemoryChatMessageHistory] = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

class ChatRequest(BaseModel):
    session_id: str
    person: str
    role: str
    message: str

print("Start chat")
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    resp = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": f"You are {request.person}, a {request.role}."},
            {"role": "user", "content": request.message},
        ]
    )
    return {"reply": resp.choices[0].message.content}
