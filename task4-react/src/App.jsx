import { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { io } from "socket.io-client";
import { useRef } from "react";
import "./App.css";

function App() {

  // ✅ FIX 1: make token reactive
  const [token, setToken] = useState(localStorage.getItem("token"));
  const socketRef = useRef(null);

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

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");
    }

    // 🔥 SOCKET EVENTS

    socketRef.current.off("userAdded");
    socketRef.current.on("userAdded", (newUser) => {
      setUsers((prev) => [...prev, newUser]);
    });

    socketRef.current.off("userDeleted");
    socketRef.current.on("userDeleted", (id) => {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    });

    socketRef.current.off("userUpdated");
    socketRef.current.on("userUpdated", (updatedUser) => {
   setUsers((prev) =>
    prev.map((u) =>
      u._id === updatedUser._id
        ? { ...u, ...updatedUser }
        : u
    )
  );
});

    return () => {
      if (socketRef.current) {
        socketRef.current.off("userAdded");
      socketRef.current.off("userDeleted");
      socketRef.current.off("userUpdated");
      }
    };
  }, [token]);

  // ✅ FIX 7: ADD MISSING addUser FUNCTION
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
    alert("User added succcessfully");

    // fetchUsers();
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
    alert("User updated successfully");

    // fetchUsers();
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
     alert("User deleted successfully");
    // fetchUsers();
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