import { useState } from "react";
import AuthForm from "../components/AuthForm";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

	console.log("Inside the AuthPage");
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <button
          onClick={() => setMode("login")}
          style={{
            padding: "10px 20px",
            background: mode === "login" ? "#333" : "#777",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Login
        </button>

        <button
          onClick={() => setMode("signup")}
          style={{
            padding: "10px 20px",
            background: mode === "signup" ? "#333" : "#777",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Signup
        </button>
      </div>

      <AuthForm mode={mode} />
    </div>
  );
}

