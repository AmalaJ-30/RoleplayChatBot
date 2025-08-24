import React, { useState, useEffect } from "react";
import styles from './UserChat.module.css';
import ChatSidebar from "./components/ChatSidebar";
import { api } from "../../api";
import PersonRolePicker from "./components/PersonRolePicker.jsx";


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
  const [famousPeople, setFamousPeople] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  //const [chatImage, setChatImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

const FASTAPI_BASE = import.meta.env.VITE_FASTAPI_URL.replace(/\/+$/, '');
  const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  // 1. Set theme first (dark/light)
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  // 2. Load chatList and activeChatId first
  /*useEffect(() => {
  const fetchFamousPeople = async () => {
    try {
      const list = await api.get("/chats/famous-people");
      setFamousPeople(list);
    } catch (err) {
      console.error("Error loading famous people:", err);
    }
  };

  fetchFamousPeople();
}, []);*/

/*useEffect(() => {
  api.get("/famous-people").then(setFamousPeople).catch(console.error);
}, []); */

const handlePersonChange = (e) => {
  const value = e.target.value;
  setPerson(value);

  if (value.trim().length === 0) {
    setSuggestions([]);
    return;
  }

  const filtered = famousPeople.filter(name =>
    name.toLowerCase().includes(value.toLowerCase())
  );
  setSuggestions(filtered);
};

useEffect(() => {
  api.get("/famous-people")
    .then((data) => {
      console.log("✅ Famous people loaded:", data);
      console.log("✅ Number of names:", data.length);
      setFamousPeople(data);
    })
    .catch((err) => {
      console.error("❌ Failed to load famous people:", err);
    });
}, []);


useEffect(() => {
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.get("/chats"); // call helper
      setChats(data); // this is your chat array
    } catch (err) {
      console.error("Error loading chats:", err);
    }
  };

  fetchChats();
}, []);

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

  // ✅ Save conversation + activeChatId
useEffect(() => {
  if (activeChatId) {
    localStorage.setItem("lastActiveChatId", activeChatId);
    localStorage.setItem("lastConversation", JSON.stringify(conversation));
  }
}, [activeChatId, conversation]);

  
  // ✅ Restore state on mount
useEffect(() => {
  const savedChatId = localStorage.getItem("lastActiveChatId");
  const savedConversation = localStorage.getItem("lastConversation");

  if (savedChatId) setActiveChatId(savedChatId);
  if (savedConversation) setConversation(JSON.parse(savedConversation));

  setLoadedFromStorage(true);
}, []);

  const handleSendMessage = async () => {
  if (!activeChatId || message.trim() === "") return;

  const tempMessage = message;
  setMessage("");

  const userMessage = { sender: "user", text: tempMessage };
  const updatedMessages = [...conversation, userMessage];
  setConversation(updatedMessages);

  try {
    const token = localStorage.getItem("token");

    // Update backend chat with new message
    await api.put(`/chats/${activeChatId}/messages`, { messages: updatedMessages });


    // Call AI backend for reply
  const response = await fetch(`${FASTAPI_BASE}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ session_id: activeChatId, person, role, message: tempMessage })
});

    const data = await response.json();
    const aiMessage = { sender: "ai", text: data.reply || "[Error: No reply]" };
    const finalMessages = [...updatedMessages, aiMessage];

    setConversation(finalMessages);

    // Save final messages to 
    await api.put(`/chats/${activeChatId}/messages`, { messages: finalMessages });


  } catch (error) {
    console.error("Error sending message:", error);
  }
};

  
const handleSelection = async () => {
  if (person.trim() === "" || role.trim() === "") return;

  // ✅ Normalize input
  const input = person.trim().toLowerCase();

  // ✅ First check direct match
  let resolvedName = famousPeople.find(
    (name) => name.toLowerCase() === input
  );

  // ✅ If no direct match, check aliases
  if (!resolvedName && window.aliases) {
    for (const [canonical, aliasList] of Object.entries(window.aliases)) {
      if (
        aliasList.some((alias) => alias.toLowerCase() === input) ||
        canonical.toLowerCase() === input
      ) {
        resolvedName = canonical; // always use the "real" name
        break;
      }
    }
  }

  if (!resolvedName) {
    alert("Oops, please pick a historical figure or a president of the United states 😉");
    return;
  }

  // ✅ Use resolved name when creating chat
  const newChat = { person: resolvedName, role, messages: [] };

  try {
    const token = localStorage.getItem("token");
    console.log("[Frontend] Token at chat create:", token);
    const savedChat = await api.post("/chats", newChat);

    setChats((prev) => [...prev, savedChat]);
    setActiveChatId(savedChat._id);

    // Fetch background image
const imgResponse = await api.post(`/chats/${savedChat._id}/image`, {
  person: resolvedName,
  role,
});
console.log("🖼️ Image response handle selection:", imgResponse);
setBackgroundImage(imgResponse.image_url);

    setConversation([]);
    setSelectionLocked(true);
  } catch (err) {
    console.error("Error creating chat (Handle selection UserChat.jsx):", err);
  }
};


  
  const handleStartNewChat = () => {
    // Just reset the state and unlock input — no chat is created yet
    setPerson("");
    setRole("");
    setMessage("");
    setConversation([]);
    setSelectionLocked(false);
  };

  const handleSelectChat = async (id) => {
  try {
    setActiveChatId(id);

    // 🧹 Clear old background while loading new one
    setBackgroundImage(null);

    const chatData = await api.get(`/chats/${id}`);
    setPerson(chatData.person);
    setRole(chatData.role);
    setConversation(chatData.messages || []);
    setSelectionLocked(true);

    if (chatData.image_url) {
      // ✅ Use saved image
      console.log("🖼️ Using saved image:", chatData.image_url);
      setBackgroundImage(chatData.image_url);
    } else {
      // ✅ Generate and save new one
      const imgResponse = await api.post(`/chats/${id}/image`, {
        session_id: id,
        person: chatData.person,
        role: chatData.role,
      });

      console.log("🖼️ Generated new image:", imgResponse);
      setBackgroundImage(imgResponse.image_url);
    }

  } catch (err) {
    console.error("Error loading chat: (Handle select chat, UserChat.jsx)", err);
  }
};


  
 const handleDeleteChat = async (id) => {
  try {
    await api.delete(`/chats/${id}`); // delete in MongoDB
    setChats(prevChats => prevChats.filter(chat => chat._id !== id));

    if (id === activeChatId) {
      setActiveChatId(null);
      setConversation([]);
    }
  } catch (err) {
    console.error("Error deleting chat:", err);
  }
};

  

const handleRenameChat = async (chatId, newPerson, newRole) => {
  try {
    // Normalize input like in handleSelection
    const input = newPerson.trim().toLowerCase();

    let resolvedName = famousPeople.find(
      (name) => name.toLowerCase() === input
    );

    if (!resolvedName && window.aliases) {
      for (const [canonical, aliasList] of Object.entries(window.aliases)) {
        if (
          aliasList.some((alias) => alias.toLowerCase() === input) ||
          canonical.toLowerCase() === input
        ) {
          resolvedName = canonical;
          break;
        }
      }
    }

    if (!resolvedName) {
      alert("Oops, please pick a historical figure or a president of the united states.");
      return;
    }

    // ✅ Send canonical name to backend
    const updated = await api.put(`/chats/${chatId}/rename`, {
      person: resolvedName,
      role: newRole,
    });

    setChats((prev) =>
      prev.map((chat) =>
        chat._id === chatId ? { ...chat, person: resolvedName, role: newRole } : chat
      )
    );

    if (chatId === activeChatId) {
      const imgResponse = await api.post(`/chats/${chatId}/image`, {
         session_id: chatId,  
        person: resolvedName,
        role: newRole,
         forceRegenerate: true, 
      });
      setBackgroundImage(imgResponse.image_url);
    }
  } catch (err) {
    console.error("Error renaming chat:", err);
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();  // enter sends
    handleSendMessage();
  }
};

useEffect(() => {
  const textarea = document.querySelector(`.${styles.input}`);
  if (textarea) {
    textarea.style.height = "auto";         // reset
    textarea.style.height = `${textarea.scrollHeight}px`;  // expand
  }
}, [message]);



const roles = [
  "Mom",
  "Dad",
  "Teacher",
  "Therapist",
  "Dog 🐶",
  "Cat 🐱",
  "Brother",
  "Sister",
  "Grandma",
  "Grandpa",
  "Boss",
  "Best Friend",
  "Roommate",
  "Coach",
  "Neighbor",
  "Celebrity Impersonator",
  "Santa 🎅",
  "Pirate 🏴‍☠️",
  "Detective",
  "Villain",
  "Superhero"
];
    
if (!activeChatId || !conversation) {
    return <div>Loading chat...</div>;
  }

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
           famousPeople={famousPeople}   // ✅ pass list
  roles={roles}      
        />
  
 {/* Main Chat Area */}
<div
  className={`${styles.userchatContainer} ${theme === "dark" ? styles.themeDark : styles.themeLight}`}
>


<button
  className={styles.themeToggle}
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
>
  {theme === "light" ? "Dark Mode" : "Light Mode"}
</button>

{!selectionLocked && (
<div className={styles.selectionBox}>
  <div className={styles.personInputWrapper}>
    <input
      type="text"
      value={person}
      onChange={handlePersonChange}
      placeholder="Enter a famous person"
      className={styles.chatboxInput}
    />
    {suggestions.length > 0 && (
      <ul className={styles.personSuggestions}>
        {suggestions.map((name, i) => (
          <li key={i} onClick={() => {
            setPerson(name);
            setSuggestions([]);
          }}>
            {name}
          </li>
        ))}
      </ul>
    )}
  </div>

  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className={styles.roleSelect}
  >
    <option value="">-- Select a role --</option>
    {roles.map((r, i) => (
      <option key={i} value={r}>{r}</option>
    ))}
  </select>

  <button onClick={handleSelection} className={styles.startButton}>
    Start Chat
  </button>
</div>
)} 

<div 
  className={styles.chatMain}
  style={{
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
    backgroundSize: "cover",   // ✅ fit whole image
    backgroundPosition: "top center",  // ✅ show head
    backgroundRepeat: "no-repeat",
  }}
>
  <div className={styles.chatbox}>
    {conversation.map((msg, index) => (
      <div key={index} className={`${styles.chatBubble} ${styles[msg.sender]}`}>
        {msg.text}
      </div>
    ))}
  </div>


  <div className={styles.messageInput}>
  <div className={styles.inputWrapper}>
   <textarea
  rows={1}
  placeholder="Type a message..."
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);

    // ✅ Auto-grow textarea
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }}
  disabled={!selectionLocked}
  className={styles.input}
/>
    <button
      onClick={handleSendMessage}
      disabled={!selectionLocked}
      className={styles.sendButton}
    >
      📩
    </button>
  </div>
</div>

</div>
</div>
    </div>
    </div>
  );
}


export default UserChat;