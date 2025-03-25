import React, { useState, useEffect } from "react";
import "./UserChat.css"; // We will style this later

function UserChat() {
  const [theme, setTheme] = useState("light"); // Light/Dark Mode
  const [conversation, setConversation] = useState([]); // Stores chat messages
  const [message, setMessage] = useState(""); // Input field for user messages
  const [person, setPerson] = useState(""); // Stores selected famous person
  const [role, setRole] = useState(""); // Stores selected role
  const [selectionLocked, setSelectionLocked] = useState(false); // Prevents mid-convo changes

  // Detect System Theme for Light/Dark Mode
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  // Handles user input messages
  const handleSendMessage = () => {
    if (message.trim() === "") return;

    setConversation([...conversation, { sender: "user", text: message }]);
    setMessage(""); // Clear input field

    // Placeholder AI response (later will connect to backend)
    setTimeout(() => {
      setConversation((prev) => [...prev, { sender: "ai", text: "This is a test AI response." }]);
    }, 1000);
  };

  // Handles selecting a famous person and role
  const handleSelection = () => {
    if (person.trim() === "" || role.trim() === "") return;
    setSelectionLocked(true); // Lock the selection
  };

  return (
    <div className={`userchat-container ${theme}`}>
      {/* Light/Dark Mode Toggle */}
      <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>

      {/* Famous Person & Role Selection */}
      {!selectionLocked && (
        <div className="selection-box">
          <input
            type="text"
            placeholder="Enter a famous person"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter their role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button onClick={handleSelection}>Start Chat</button>
        </div>
      )}

      {/* Chat Area */}
      <div className="chatbox">
        {conversation.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!selectionLocked} // Disable input until person & role are selected
        />
        <button onClick={handleSendMessage} disabled={!selectionLocked}>Send</button>
      </div>
    </div>
  );
}

export default UserChat;