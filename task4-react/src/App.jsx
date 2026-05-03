import { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./App.css";

function App() {

  // ✅ FIX 1: make token reactive
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 

  const API = "http://localhost:3000/users";

  // Fetch users
  const fetchUsers = async () => {

    // ✅ FIX 2: prevent call without token
    if (!token) return;

    const res = await fetch("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Invalid data:", data);
      setUsers([]);
      return;
    }

    setUsers(data);
  };

  // ✅ FIX 3: dependency added
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Add user
  const addUser = async (name, email) => {

    if (!name || !email) {
      alert("Enter name and email");
      return;
    }

    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, email })
    });

    fetchUsers();
  };

  // Update users
  const updateUser = async (id) => {
    const name = prompt("Enter new name");
    const email = prompt("Enter new email");

    await fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, email })
    });

    fetchUsers();
  };

  // Delete user
  const deleteUser = async (id) => {

    // ✅ FIX 4: use same token (no redeclare)
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchUsers();
  };

  // Role extraction
  let role = null;

  // ✅ FIX 5: safe token decoding
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  return (
    <div>
      <h1>User Management System</h1>

      {!token ? (
        <>
          <Signup />
          <Login />
        </>
      ) : (
        <>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);   // ✅ FIX 6: re-render properly
            }}
          >
            Logout
          </button>

          {/* Role based */}
          {role === "admin" && (
            <UserForm addUser={addUser} />
          )}

          <UserList 
  users={users} 
  deleteUser={deleteUser} 
  updateUser={updateUser}   // ✅ ADD THIS
/>
        </>
      )}
    </div>
  );
}

export default App;