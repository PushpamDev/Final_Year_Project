require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); // Import MongoDB connection

const authRoutes = require("./routes/authRoutes");
const studRoutes = require("./routes/studRoutes");
const teachRoutes = require("./routes/teacherRoutes");
const funcRoutes = require("./routes/funcRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser

// Route Handling
app.use("/api/auth", authRoutes);     // Authentication routes
app.use("/api/students", studRoutes); // Student-related routes
app.use("/api/teachers", teachRoutes); // Teacher-related routes
app.use("/api/functions", funcRoutes); // Other functional routes

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
