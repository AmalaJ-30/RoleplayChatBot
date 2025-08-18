import React, { useState, useEffect } from "react";
import styles from './UserChat.module.css';
import ChatSidebar from "./components/ChatSidebar";
import { api } from "../../api";


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
    await fetch(`http://localhost:5000/api/chats/${activeChatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ messages: updatedMessages })
    });

    // Call AI backend for reply
  const response = await fetch("http://localhost:8000/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ session_id: activeChatId, person, role, message: tempMessage })
});

    const data = await response.json();
    const aiMessage = { sender: "ai", text: data.reply || "[Error: No reply]" };
    const finalMessages = [...updatedMessages, aiMessage];

    setConversation(finalMessages);

    // Save final messages to backend
    await fetch(`http://localhost:5000/api/chats/${activeChatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ messages: finalMessages })
    });

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
    alert("Oops, not famous enough for me to know 'em. Try someone that's actually important 😉");
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
    setActiveChatId(id); // ✅ Use MongoDB _id directly

    const chatData = await api.get(`/chats/${id}`); // GET single chat from backend
    setPerson(chatData.person);
    setRole(chatData.role);
    setConversation(chatData.messages || []);
    setSelectionLocked(true);
    setBackgroundImage(chatData.image_url);

    // Load background image if it exists
 if (chatData.image_url) {
      setBackgroundImage(chatData.image_url);
    } else {
      const imgResponse = await api.post(`/chats/${id}/image`, {
        person: chatData.person,
        role: chatData.role,
      });
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
  //console.log("Renaming in UserChat:", chatId, newPerson, newRole);
  try {
    const updated = await api.put(`/chats/${chatId}`, {
      person: newPerson,
      role: newRole,
    });
   setChats(prev =>
  prev.map(chat =>
    chat._id === chatId ? { ...chat, person: newPerson, role: newRole } : chat
  )
);
// Regenerate background if renaming the active chat
if (chatId === activeChatId) {
  const imgResponse = await api.post(`/chats/${chatId}/image`, {
    person: newPerson,
    role: newRole,
  });
  setBackgroundImage(imgResponse.image_url);
}
  } catch (err) {
   // console.error("Error renaming chat:", err);
  }
};



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
  className={styles.chatboxInput}
>
  <option value="">-- Select a role --</option>
  {roles.map((r, i) => (
    <option key={i} value={r}>{r}</option>
  ))}
</select>

    <button onClick={handleSelection} className={styles.sendButton}>
      Start Chat
    </button>
  </div>
)}

<div 
  className={styles.chatMain}
  style={{
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
    backgroundSize: "contain",   // ✅ fit whole image
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
    </div>
    </div>
  );
}


export default UserChat;