import React, { useState, useEffect } from "react";
import styles from './UserChat.module.css';
import ChatSidebar from "./components/ChatSidebar";

function UserChat() {
  const [theme, setTheme] = useState("Dark");
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [person, setPerson] = useState("");
  const [role, setRole] = useState("");
  const [selectionLocked, setSelectionLocked] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  // 1. Set theme first (dark/light)
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  // 2. Load chatList and activeChatId first
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chatList"));
    console.log("Loaded chatList from localStorage:", saved);
    if (saved) {
      const restored = saved.map(chat => {
        const savedData = JSON.parse(localStorage.getItem(chat.session_id)) || {};
        return {
          ...chat,
          messages: savedData.messages || []
        };
      });
      setChats(restored);
    }

    const last = localStorage.getItem("lastActiveChatId");
    if (last) {
      setActiveChatId(last);
    }

    setLoadedFromStorage(true);
  }, []);

  // 3. Load messages for selected chat
  useEffect(() => {
    if (activeChatId) {
      const savedData = JSON.parse(localStorage.getItem(activeChatId));
      if (savedData && savedData.messages) {
        setConversation(savedData.messages);
      }
    }
  }, [activeChatId]);

  // 4. Save active chatId
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("lastActiveChatId", activeChatId);
    }
  }, [activeChatId]);

  // 5. Save chat list after storage is loaded
  useEffect(() => {
    if (loadedFromStorage) {
      localStorage.setItem("chatList", JSON.stringify(chats));
    }
  }, [chats, loadedFromStorage]);

  const handleSendMessage = async () => {
    if (!activeChatId || message.trim() === "") return;
  
    const tempMessage = message;
    setMessage("");
  
    // Optimistically show user message
    const userMessage = { sender: "user", text: tempMessage };
    setConversation(prev => [...prev, userMessage]);
  
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeChatId,
          person,
          role,
          message: tempMessage,
        }),
      });
  
      const data = await response.json();
  
      const aiMessage = { sender: "ai", text: data.reply || "[Error: No reply]" };
      const updatedMessages = [...conversation, userMessage, aiMessage];
  
      setConversation(updatedMessages);
  
      setChats(prev =>
        prev.map(chat =>
          chat.session_id === activeChatId
            ? { ...chat, messages: updatedMessages, person, role }
            : chat
        )
      );
  
      console.log("Sending to backend:", {
        session_id: activeChatId,
        person,
        role,
        message: tempMessage,
      });
  
    } catch (error) {
      console.error("Error talking to backend:", error);
      setConversation(prev => [...prev, { sender: "ai", text: "[Error: Connection failed]" }]);
    }
  };
  
  const handleSelection = () => {
    if (person.trim() === "" || role.trim() === "") return;
  
    const newId = crypto.randomUUID();
  
    const newChat = {
      session_id: newId,
      person,
      role,
      messages: [],
    };
  
    setChats(prev => [...prev, newChat]);
    setActiveChatId(newId);
    setConversation([]);
    setMessage("");
    setSelectionLocked(true);
  };
  
  const handleStartNewChat = () => {
    const newId = crypto.randomUUID(); // creates unique session_id
  
    const newChat = {
      session_id: newId,
      person: "",
      role: "",
      messages: [],
    };
  
    setChats(prev => [...prev, newChat]);
    setActiveChatId(newId);
    setPerson("");
    setRole("");
    setMessage("");
    setConversation([]);
    setSelectionLocked(false);
  };

  const handleSelectChat = (id) => {
    const chat = chats.find(c => c.session_id === id);
    if (!chat) return;
  
    setActiveChatId(chat.session_id);
    setPerson(chat.person);
    setRole(chat.role);
    setConversation(chat.messages || []);
    setSelectionLocked(true);
  };
  
  const handleDeleteChat = (sessionId) => {
    setChats(prevChats => prevChats.filter(chat => chat.session_id !== sessionId));
  
    if (sessionId === activeChatId) {
      setActiveChatId(null);
    }
  
    localStorage.removeItem(sessionId); // removes from everywhere
  };
  
  const handleRenameChat = (sessionId, newPerson, newRole) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.session_id === sessionId
          ? { ...chat, person: newPerson, role: newRole }
          : chat
      )
    );
  
    const chatData = JSON.parse(localStorage.getItem(sessionId));
    if (chatData) {
      localStorage.setItem(
        sessionId,
        JSON.stringify({ ...chatData, person: newPerson, role: newRole })
      );
    }
  };

  return (
      <div className={`${styles.pageWrapper} ${theme === "dark" ? styles.themeDark : styles.themeLight}`}>
        <div className={styles.layoutWrapper}>
  
        {/* Sidebar */}
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onStartNew={handleStartNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          theme={theme}
        />
  
        {/* Main Chat Area */}
        <div className={`${styles.userchatContainer} ${theme === "dark" ? styles.themeDark : styles.themeLight}`}>
  
          <button
            className={styles.themeToggle}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
  
          {!selectionLocked && (
            <div className={styles.selectionBox}>
              <input
                type="text"
                placeholder="Enter a famous person"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                className={styles.chatboxInput}
              />
              <input
                type="text"
                placeholder="Enter their role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.chatboxInput}
              />
              <button onClick={handleSelection} className={styles.sendButton}>
                Start Chat
              </button>
            </div>
          )}
  
          <div className={styles.chatbox}>
            {conversation.map((msg, index) => (
              <div key={index} className={`${styles.chatBubble} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))}
          </div>
  
          <div className={styles.messageInput}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!selectionLocked}
              className={styles.input}
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectionLocked}
              className={styles.sendButton}
            >
              Send
            </button>
          </div>
  
        </div>
      </div>
    </div>
  );
}


export default UserChat;