const express = require("express");
const router = express.Router();
const db = require("../db"); // Import the database connection from db.js

// Route to show details of all students
router.get("/stud_details", (req, res) => {
  const query = `
    SELECT s.stud_id, s.first_name, s.last_name, s.grade_level, s.stud_group, 
           s.enrollment_date, s.date_of_birth, u.email AS student_email
    FROM students s
    JOIN users u ON s.stud_id = u.id
  `;

  db.all(query, [], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(200).json({
      message: results.length > 0 ? "Students found" : "No students found",
      students: results,
    });
  });
});

// Route to insert student data into the students table
router.post("/stud_post", (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    enrollmentDate,
    gradeLevel,
    studGroup,
    email,
    studentId,
    password,
  } = req.body;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const userQuery = `
      INSERT INTO users (id, username, password_hash, email, role_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;
    const userValues = [studentId, `${firstName} ${lastName}`, password, email, 4];

    db.run(userQuery, userValues, function (err) {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ message: "Error inserting user", error: err.message });
      }

      const studentQuery = `
        INSERT INTO students (stud_id, first_name, last_name, grade_level, stud_group, enrollment_date, date_of_birth)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const studentValues = [studentId, firstName, lastName, gradeLevel, studGroup, enrollmentDate, dob];

      db.run(studentQuery, studentValues, function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ message: "Error inserting student", error: err.message });
        }

        db.run("COMMIT", () => {
          return res.status(201).json({ message: "User and student data inserted successfully" });
        });
      });
    });
  });
});

// Route to update student details
router.put("/update_student", (req, res) => {
  const { stud_id, first_name, last_name, grade_level, stud_group, date_of_birth, enrollment_date, student_email } = req.body;

  if (!stud_id || !first_name || !last_name || !grade_level || !stud_group || !date_of_birth || !enrollment_date || !student_email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const updateUserQuery = `UPDATE users SET email = ? WHERE id = ?`;
  const updateStudentQuery = `
    UPDATE students SET first_name = ?, last_name = ?, grade_level = ?, stud_group = ?, date_of_birth = ?, enrollment_date = ?
    WHERE stud_id = ?
  `;

  db.run(updateUserQuery, [student_email, stud_id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error updating user" });
    }

    db.run(updateStudentQuery, [first_name, last_name, grade_level, stud_group, date_of_birth, enrollment_date, stud_id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating student" });
      }
      return res.status(200).json({ message: "Student data updated successfully" });
    });
  });
});

// Route to search students
router.get("/search_students", (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const searchQuery = `
    SELECT s.stud_id, s.first_name, s.last_name, s.grade_level, s.stud_group, s.enrollment_date, s.date_of_birth, u.email AS student_email
    FROM students s
    JOIN users u ON s.stud_id = u.id
    WHERE s.first_name LIKE ? OR s.last_name LIKE ? OR u.email LIKE ?
  `;

  db.all(searchQuery, [`%${query}%`, `%${query}%`, `%${query}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json({
      message: results.length > 0 ? "Search results" : "No students found",
      students: results,
    });
  });
});

module.exports = router;
