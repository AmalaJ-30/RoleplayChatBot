import React, { useState, useEffect } from "react";
import styles from './UserChat.module.css';

function UserChat() {
  const [theme, setTheme] = useState("light");
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [person, setPerson] = useState("");
  const [role, setRole] = useState("");
  const [selectionLocked, setSelectionLocked] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const tempMessage = message;
    setConversation([...conversation, { sender: "user", text: tempMessage }]);
    setMessage("");

    try {
      const response = await fetch("https://silver-space-computing-machine-jj7p6pjjr4rqhp697-8000.app.github.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "1",
          person: person,
          role: role,
          message: tempMessage,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setConversation((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        console.error("No reply received:", data);
        setConversation((prev) => [...prev, { sender: "ai", text: "[Error: No reply]" }]);
      }
    } catch (error) {
      console.error("Error talking to backend:", error);
    }
  };

  const handleSelection = () => {
    if (person.trim() === "" || role.trim() === "") return;
    setSelectionLocked(true);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={`${styles.userchatContainer} ${theme === "dark" ? styles.themeDark : styles.themeLight}`}>
        
        <button className={styles.themeToggle} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
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
            <button onClick={handleSelection} className={styles.sendButton}>Start Chat</button>
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
          <button onClick={handleSendMessage} disabled={!selectionLocked} className={styles.sendButton}>
            Send
          </button>
        </div>
  
      </div>
    </div>
  );
}


export default UserChat;