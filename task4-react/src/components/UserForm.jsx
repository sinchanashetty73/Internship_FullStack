import { useState } from "react";

function UserForm({ addUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    addUser(name, email);   // ✅ send data to App
    setName("");
    setEmail("");
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <button onClick={handleSubmit}>Add User</button>
    </div>
  );
}

export default UserForm;