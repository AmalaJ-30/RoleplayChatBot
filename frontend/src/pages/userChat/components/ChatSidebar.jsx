import React, { useState } from "react";
import styles from "./ChatSidebar.module.css";


const ChatSidebar = ({ chats, activeChatId, onSelectChat, onStartNew, onDeleteChat, onRenameChat, theme }) => {
  
const [openMenuId, setOpenMenuId] = useState(null);
const toggleMenu = (id) => {
  setOpenMenuId(prev => (prev === id ? null : id));
};

const handleRename = (sessionId) => {
  console.log("The rename train got here, Chatsidebar.jsx line 13");
  const newPerson = prompt("New person name?");
  const newRole = prompt("New role name?");
  if (newPerson && newRole) {
    onRenameChat(sessionId, newPerson, newRole);
  }
  console.log("[ChatSidebar] Rename clicked:", sessionId, newPerson, newRole);
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
            key={chat._id}
            className={`${styles.chatItem} ${chat._id === activeChatId ? styles.active : ""}`}
            onClick={() => onSelectChat(chat._id)} 
          >
            {chat.person} as <em>{chat.role}</em>

            <div className={styles.menuWrapper}>
          <button
            className={styles.menuButton}
            onClick={() => toggleMenu(chat._id)}
          >
            ⋯
          </button>

          {openMenuId === chat._id && (
            <div className={styles.dropdown}>
              <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id)}}> 🚮 Delete</button>
              <button onClick={(e) => { e.stopPropagation(); handleRename(chat._id)}}> ✒️ Rename</button>
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