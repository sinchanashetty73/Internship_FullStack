const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Temporary database (array)
let users = [
  { id: 1, name: "Sinchana", email: "sinchana@gmail.com" },
  { id: 2, name: "Rahul", email: "rahul@gmail.com" }
];

// Home Route
app.get("/", (req, res) => {
  res.send("REST API is running...");
});

// CREATE User
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email required" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});

// READ All Users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// READ Single User
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

// UPDATE User
app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  res.status(200).json({
    message: "User updated successfully",
    user
  });
});

// DELETE User
app.delete("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(index, 1);

  res.status(200).json({
    message: "User deleted successfully"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});