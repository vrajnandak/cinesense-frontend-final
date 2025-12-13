import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: Props) {
console.log("before created navigate object");
  const navigate = useNavigate();

console.log("created navigate object");

  const [username, setUsername] = useState(""); // Only used for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const title = mode === "login" ? "Login" : "Signup";

  const handleSubmit = (e: React.FormEvent) => {
console.log("inside the submit function");
    e.preventDefault();
	console.log("Inside the handleSubmit function");

    if (mode === "signup") {
      console.log("Signup data:", {
        username,
        email,
        password,
      });
    } else {
      console.log("Login data:", {
        email,
        password,
      });
    }

    // TODO: Replace with backend call.Submit the signup data or the login data to backend, verify credibility and return a response. If successfull, redirect else display error.
    navigate("/home");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "300px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>{title}</h2>

      {/* Username field only for signup */}
      {mode === "signup" && (
        <input
          type="text"
          placeholder="Username"
          required={mode === "signup"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "12px",
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {title}
      </button>
    </form>
  );
}

