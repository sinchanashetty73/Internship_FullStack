const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const mongoose = require("mongoose");
const AuthUser = require("./models/AuthUser"); 
const {  verifyAdmin } = require("./middleware/auth");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// let users = [];

const PORT = 3000;

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/userDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Home Route
app.get("/", (req, res) => {
  res.send("REST API is running...");
});

// Signup (already correct)
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new AuthUser({
    email,
    password: hashedPassword,
    role: "admin"   // first user = admin
  });

  await user.save();

  res.json({ message: "Signup successful" });
});

// Login (already correct)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await AuthUser.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },   // ✅ role added
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       { id: user.id },
//       "secretKey",
//       { expiresIn: "1h" }
//     );

//     res.json({ token });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// ✅ FIXED TOKEN ERROR (only change here)
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

// Protected Route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

// ✅ FIXED (async already correct)
app.get("/users", verifyToken, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ❌ FIXED CREATE (only error part changed)
// app.post("/users", async (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     return res.status(400).json({ message: "Name and Email required" });
//   }

//   const newUser = new User({ name, email });   // ✅ FIX
//   await newUser.save();                        // ✅ FIX

//   res.status(201).json({
//     message: "User created successfully",
//     user: newUser
//   });
// });
app.post("/users", verifyToken, verifyAdmin, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name & Email required" });
  }

  const newUser = new User({ name, email });
  await newUser.save();

  res.json({ message: "User added", user: newUser });
});

//   } catch (err) {
//     console.error("ADD USER ERROR:", err);   // ✅ better debug
//     res.status(500).json({ message: "Server error" });
//   }
// });
app.put("/users/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedUser);
});

// ❌ FIXED UPDATE (only error part changed)
app.put("/users/:id", verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id);   // ✅ FIX

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  await user.save();   // ✅ FIX

  res.json({ message: "Updated", user });
});

// ❌ FIXED DELETE (only error part changed)
app.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});