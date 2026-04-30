const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const app = express();
app.use(cors());
app.use(express.json());

let users = [];

const PORT = 3000;
const token = req.headers.authorization.split(" ")[1];
// Temporary database (array)
// let users = [
//   { id: 1, name: "Sinchana", email: "sinchana@gmail.com" },
//   { id: 2, name: "Rahul", email: "rahul@gmail.com" }
// ];

// Home Route
app.get("/", (req, res) => {
  res.send("REST API is running...");
});

// signup API
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      id: users.length + 1,
      email,
      password: hashedPassword   // ✅ store hashed password
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup error" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 FIX: check password exists
    if (!user.password) {
      return res.status(400).json({
        message: "User not registered via signup"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id },
      "secretKey",
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}
function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}
// Protected Route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized!",user:req.user });
});
// Protect Existing Routes
app.get("/users", verifyToken, (req, res) => {
  res.json(users);
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

// // READ Single User
// app.get("/users/:id", (req, res) => {
//   const user = users.find(u => u.id == req.params.id);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.status(200).json(user);
// });

// // UPDATE User
app.put("/users/:id", verifyToken, (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  res.json({ message: "Updated", user });
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
app.listen(3000, () => {
  console.log("Server running on port 3000");
});