import { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    alert("Signup successful");
  };

  // ❌ REMOVE THIS BLOCK (error part)
  // users.push({
  //   id: users.length + 1,
  //   email,
  //   password: hashedPassword,
  //   role: "user"
  // });

  return (
    <div>
      <h2>Signup</h2>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;