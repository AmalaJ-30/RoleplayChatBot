import React, { useState } from "react";
import styles from "./ChatSidebar.module.css";


const ChatSidebar = ({ chats, activeChatId, onSelectChat, onStartNew, onDeleteChat, onRenameChat, theme }) => {
  
const [openMenuId, setOpenMenuId] = useState(null);
const toggleMenu = (id) => {
  setOpenMenuId(prev => (prev === id ? null : id));
};

const handleRename = (sessionId) => {
  const newPerson = prompt("New person name?");
  const newRole = prompt("New role name?");
  if (newPerson && newRole) {
    onRenameChat(sessionId, newPerson, newRole);
  }
};
  return (
    <div className={`${styles.sidebar} ${theme === "dark" ? styles.sidebarDark : styles.sidebarLight}`}>
      <h3>Chats</h3>

      <button
  className={styles.newChat}
  onClick={() => {
    console.log("New chat clicked");
    onStartNew();
  }}
>
  + New Chat
</button>

      <ul className={styles.chatList}>
      {chats.map((chat) => (
          <li
            key={chat.session_id}
            className={`${styles.chatItem} ${chat.session_id === activeChatId ? styles.active : ""}`}
            onClick={() => onSelectChat(chat.session_id)} 
          >
            {chat.person} as <em>{chat.role}</em>

            <div className={styles.menuWrapper}>
          <button
            className={styles.menuButton}
            onClick={() => toggleMenu(chat.session_id)}
          >
            ⋯
          </button>

          {openMenuId === chat.session_id && (
            <div className={styles.dropdown}>
              <button onClick={() => onDeleteChat(chat.session_id)}> 🚮 Delete</button>
              <button onClick={() => handleRename(chat.session_id)}> ✒️ Rename</button>
            </div>
          )}
        </div>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;