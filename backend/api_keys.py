#Api keys.py
#remeber that this does not remeber information when you go back and forth between session ID'S - it does now
import getpass
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.messages import AIMessage
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to talk to backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can tighten this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.environ["LANGCHAIN_TRACKING_V2"] = "true"
os.environ["OPENAI_API_KEY"] = "sk-_d9LhKLJqxPn7NRVyLIaHdLz-SPym78EU3bbyoF_3ZT3BlbkFJPMEVpxHLNeJ__88VWhgNceFipHzM7TkF80lhAsf8QA"
model = ChatOpenAI(model="gpt-3.5-turbo")
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
@app.post("/chat")
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