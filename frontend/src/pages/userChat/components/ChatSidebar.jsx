import React, { useState } from "react";
import styles from "./ChatSidebar.module.css";
import PersonRolePicker from "./PersonRolePicker.jsx";


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

  return (
    <div
      className={`${styles.sidebar} ${
        theme === "dark" ? styles.sidebarDark : styles.sidebarLight
      }`}
    >
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
            className={`${styles.chatItem} ${
              chat._id === activeChatId ? styles.active : ""
            }`}
            onClick={() => onSelectChat(chat._id)}
          >
            {renamingChatId === chat._id ? (
              <div>
                {/* ✅ Show dropdowns when renaming */}
                <PersonRolePicker
                  person={renamePerson}
                  setPerson={setRenamePerson}
                  role={renameRole}
                  setRole={setRenameRole}
                  famousPeople={famousPeople}
                  roles={roles}
                />
                <button onClick={(e) => { e.stopPropagation(); saveRename(chat._id); }}>
                  ✅ Save
                </button>
                <button onClick={(e) => { e.stopPropagation(); setRenamingChatId(null); }}>
                  ❌ Cancel
                </button>
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
    </div>
  );
};

export default ChatSidebar;