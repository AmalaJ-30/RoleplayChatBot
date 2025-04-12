import React from "react";
import styles from "./ChatSidebar.module.css";

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onStartNew, theme }) => {
  return (
    <div className={`${styles.sidebar} ${theme === "dark" ? styles.sidebarDark : styles.sidebarLight}`}>
      <h3>Chats</h3>

      <button className={styles.newChat} onClick={onStartNew}>
        + New Chat
      </button>

      <ul className={styles.chatList}>
        {chats.map((chat) => (
          <li
            key={chat.session_id}
            className={`${styles.chatItem} ${chat.session_id === activeChatId ? styles.active : ""}`}
            onClick={() => onSelectChat(chat.session_id)}
          >
            <strong>{chat.person}</strong> as <em>{chat.role}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;