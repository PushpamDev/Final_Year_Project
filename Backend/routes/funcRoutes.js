const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch role by email
router.post("/fetch_role", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = `SELECT role_id FROM users WHERE email = ?`;
  db.get(query, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    if (result) {
      return res.status(200).json({ message: "Role fetched successfully", role_id: result.role_id });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

// Fetch user profile by email
router.post("/fetch_profile", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = `SELECT username, email, role_id FROM users WHERE email = ?`;
  db.get(query, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    if (result) {
      return res.status(200).json({ message: "User fetched successfully", user: result });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

// Fetch schedule by group ID
router.post("/fetch_schedule", (req, res) => {
  const { group_id } = req.body;
  if (!group_id) {
    return res.status(400).json({ message: "Group ID is required" });
  }

  const query = `
    SELECT 
      schedules.id AS schedule_id,
      schedules.group_id,
      schedules.classroom_id,
      schedules.course_id,
      schedules.teacher_id,
      schedules.day_of_week,
      schedules.start_time,
      schedules.end_time,
      "group".name AS group_name,
      classrooms.name AS classroom_name,
      courses.name AS course_name,
      teachers.first_name || ' ' || teachers.last_name AS teacher_name
    FROM schedules
    JOIN "group" ON schedules.group_id = "group".id
    LEFT JOIN classrooms ON schedules.classroom_id = classrooms.id
    LEFT JOIN courses ON schedules.course_id = courses.id
    LEFT JOIN teachers ON schedules.teacher_id = teachers.teacher_id
    WHERE schedules.group_id = ?;
  `;

  db.all(query, [group_id], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json({ message: "Schedules fetched successfully", schedules: results });
  });
});

// Delete schedule
router.delete("/delete_schedule", (req, res) => {
  const { schedule_id } = req.body;
  if (!schedule_id) {
    return res.status(400).json({ message: "Schedule ID is required" });
  }

  const query = `DELETE FROM schedules WHERE id = ?`;
  db.run(query, [schedule_id], function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json({ message: "Schedule deleted successfully" });
  });
});

// Get all classrooms
router.get("/get_classrooms", (req, res) => {
  const query = "SELECT * FROM classrooms";
  db.all(query, [], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json({ message: "Classrooms fetched successfully", data: results });
  });
});

// Get all courses
router.get("/get_courses", (req, res) => {
  const query = "SELECT * FROM courses";
  db.all(query, [], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json({ message: "Courses fetched successfully", data: results });
  });
});

// Add a classroom
router.post("/add_classroom", (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Name and type are required" });
  }

  const query = "INSERT INTO classrooms (name, type) VALUES (?, ?)";
  db.run(query, [name, type], function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(201).json({ message: "Classroom added successfully", data: { id: this.lastID, name, type } });
  });
});

// Delete a classroom by ID
router.delete("/delete_classroom/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM classrooms WHERE id = ?";
  db.run(query, [id], function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json({ message: "Classroom deleted successfully" });
  });
});

module.exports = router;
