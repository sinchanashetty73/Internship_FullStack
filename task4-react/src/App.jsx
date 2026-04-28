import { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import "./App.css";
function App() {
  const [users, setUsers] = useState([]);

  const API = "http://localhost:3000/users";

  // Fetch users
  const fetchUsers = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const addUser = async (user) => {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    fetchUsers();
  };
  const deleteUser = async (id) => {
  await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });

  fetchUsers();
};

  return (
    <div>
      <h1>User Management System</h1>
      <UserForm addUser={addUser} />
      <UserList users={users} />
      <UserList users={users} deleteUser={deleteUser} />
      <div className="container"></div>
    </div>
  );
}

export default App;