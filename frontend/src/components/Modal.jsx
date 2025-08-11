
/*This file is so I can have pretty pop up messages */

export default function Modal({ message, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white", padding: "20px", borderRadius: "8px", maxWidth: "400px", textAlign: "center"
      }}>
        <p style={{ color: "#333" }}>{message}</p>
        <button onClick={onClose} style={{ marginTop: "15px" }}>OK</button>
      </div>
    </div>
  );
}