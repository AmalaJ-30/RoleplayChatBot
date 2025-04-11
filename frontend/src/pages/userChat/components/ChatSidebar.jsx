import React from "react";
import ChatSidebar from "./components/ChatSidebar";

const ChatSidebar = ({ chats, onSelectChat, onStartNew }) => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.header}>Chats</h2>
      <button className={styles.newChat} onClick={onStartNew}>+ New Chat</button>
      <div className={styles.chatList}>
        {chats.map((chat, index) => (
          <div key={index} className={styles.chatItem} onClick={() => onSelectChat(chat.session_id)}>
            <strong>{chat.person}</strong> as <em>{chat.role}</em>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;