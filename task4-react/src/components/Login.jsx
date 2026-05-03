import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      // ✅ keep this check
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error:", errorText);
        alert("Login failed");
        return;
      }

      // ✅ keep ONLY this json()
      const data = await res.json();

      console.log("Token:", data.token);

      localStorage.setItem("token", data.token);

      alert("Login successful");

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;