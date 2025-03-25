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
Person = input("Famous person: ")
Occupation = input("Role you want them to play: ")
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            f"You are {Person}, a {Occupation}. Answer all questions as if you are {Person}."
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)


os.environ["LANGCHAIN_TRACKING_V2"] = "true"
os.environ["OPENAI_API_KEY"] = "sk-_d9LhKLJqxPn7NRVyLIaHdLz-SPym78EU3bbyoF_3ZT3BlbkFJPMEVpxHLNeJ__88VWhgNceFipHzM7TkF80lhAsf8QA"
model = ChatOpenAI(model="gpt-3.5-turbo")
chain = prompt | model
store = {}
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]


with_message_history = RunnableWithMessageHistory(chain, get_session_history)
config = {"configurable": {"session_id": "1"}}



#.invoke([HumanMessage(content="Hi! I'm Bob")])

print("Start chat")
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Ending the chat. Goodbye!")
        break
    if user_input=="change id":
        uin = input("chat id: ")
        config = {"configurable": {"session_id": uin}}
        print("chat id changed to "+ uin)
        continue

    try:
        response = with_message_history.invoke([HumanMessage(content=user_input)], config=config)
        #response = chain.invoke({"messages": [HumanMessage(content="hi! I'm bob")]})


        print(f"AI: {response.content}")
    except AttributeError as e:
        print("Error:", e)
        print("The session history might not be initialized correctly.")
        break