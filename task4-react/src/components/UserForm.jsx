import { useState } from "react";

function UserForm({ addUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

//   const handleSubmit = () => {
//     addUser({ name, email });
//     setName("");
//     setEmail("");
//   };
  const handleSubmit = () => {
  if (!name || !email) {
    alert("Please fill all fields");
    return;
  }

  addUser({ name, email });
  setName("");
  setEmail("");
};

  return (
    <div className="form-box">
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