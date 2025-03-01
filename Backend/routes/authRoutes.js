const express = require("express");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const db = require("../db"); // Import SQLite database connection

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Query to fetch user based on email
  const query = `
    SELECT u.*, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?`;

  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name, // Include role in response
      },
    });
  });
});

module.exports = router;
