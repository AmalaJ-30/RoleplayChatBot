import React, { useState, useEffect } from "react";
import styles from "./ChatSidebar.module.css";
import PersonRolePicker from "./PersonRolePicker.jsx";
import { Link } from "react-router-dom";

const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onStartNew,
  onDeleteChat,
  onRenameChat,
  theme,
  famousPeople, // ✅ pass down
  roles         // ✅ pass down
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renamePerson, setRenamePerson] = useState("");
  const [renameRole, setRenameRole] = useState("");

  const [width, setWidth] = useState(() => {
  return parseInt(localStorage.getItem("sidebarWidth"), 10) || 280;
});
const [resizing, setResizing] = useState(false);

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const startRename = (chat) => {
    setRenamingChatId(chat._id);
    setRenamePerson(chat.person);
    setRenameRole(chat.role);
    setOpenMenuId(null);
  };

  const saveRename = (chatId) => {
    if (renamePerson && renameRole) {
      onRenameChat(chatId, renamePerson, renameRole);
      setRenamingChatId(null);
    }
  };

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.menuWrapper}`)) {
      setOpenMenuId(null); // closes dropdown
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

useEffect(() => {
  const handleMouseMove = (e) => {
    if (!resizing) return;
    let newWidth = e.clientX;
    if (newWidth < 200) newWidth = 100; // min
    if (newWidth > 400) newWidth = 400; // max
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    if (resizing) {
      setResizing(false);
      localStorage.setItem("sidebarWidth", width);
    }
  };

  if (resizing) {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
}, [resizing, width]);


  return (
    <div
      className={`${styles.sidebar} ${
        theme === "dark" ? styles.sidebarDark : styles.sidebarLight
      }`}
       style={{ width: `${width}px` }}
    >
      <h3
        
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  Chats
  <Link to="/profile">
    <span style={{ cursor: "pointer", fontSize: "18px" }}>👤</span>
  </Link>

      </h3>

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
            className={`${styles.chatItem} ${
              chat._id === activeChatId ? styles.active : ""
            }`}
            onClick={() => onSelectChat(chat._id)}
          >
            {renamingChatId === chat._id ? (
             <div className={styles.renameBox}>
  <PersonRolePicker
    person={renamePerson}
    setPerson={setRenamePerson}
    role={renameRole}
    setRole={setRenameRole}
    famousPeople={famousPeople}
    roles={roles}
  />
  <div className={styles.renameActions}>
    <button
      className={styles.renameSave}
      onClick={(e) => {
        e.stopPropagation();
        saveRename(chat._id);
      }}
    >
      ✅ Save
    </button>
    <button
      className={styles.renameCancel}
      onClick={(e) => {
        e.stopPropagation();
        setRenamingChatId(null);
      }}
    >
      ❌ Cancel
    </button>
  </div>
</div>

            ) : (
              <>
                {chat.person} as <em>{chat.role}</em>
                <div className={styles.menuWrapper}>
                  <button
                    className={styles.menuButton}
                    onClick={(e) => { e.stopPropagation(); toggleMenu(chat._id); }}
                  >
                    ⋯
                  </button>

                  {openMenuId === chat._id && (
                    <div className={styles.dropdown}>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }}>
                        🚮 Delete
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); startRename(chat); }}>
                        ✒️ Rename
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div
  className={styles.resizer}
  onMouseDown={() => setResizing(true)}
/>
    </div>
    
  );
};

export default ChatSidebar;