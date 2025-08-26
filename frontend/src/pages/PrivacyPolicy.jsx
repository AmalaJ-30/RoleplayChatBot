// frontend/src/pages/PrivacyPolicy.jsx
export default function PrivacyPolicy() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e1b4b, #6d28d9, #8b5cf6)",
        color: "#f5f5f5",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          padding: "40px",
          borderRadius: "15px",
          maxWidth: "700px",
          width: "100%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          textAlign: "left"
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#ffd700" }}>Privacy Policy</h1>

        <p>
          We respect your privacy. Any personal information you provide (such as
          your email address) will only be used for account authentication and will
          not be shared with third parties.
        </p>

        <p>
          This application is for demonstration purposes only. Please avoid
          entering sensitive data.
        </p>

        <p>
          If you have any questions, you can contact us at:{" "}
          <a
            href="mailto:jiaama752@gmail.com"
            style={{ color: "#ffd700", textDecoration: "underline" }}
          >
            jiaama752@gmail.com
          </a>
        </p>

        <p style={{ marginTop: "20px" }}>
  <a
    href="/signup"
    style={{
      color: "#ffd700",
      textDecoration: "underline",
      fontWeight: "bold"
    }}
  >
    ← Back to Signup page
  </a>
</p>
      </div>
    </div>
  );
}
