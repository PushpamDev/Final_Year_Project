const express = require("express");
const router = express.Router();
const db = require("../db"); // Import the SQLite database connection

// Route to show details of all teachers
router.get("/teacher_details", (req, res) => {
    const query = `
        SELECT t.teacher_id, t.first_name, t.last_name, t.enrolled_date, t.date_of_birth, u.email 
        FROM teachers t
        JOIN users u ON t.teacher_id = u.id
        WHERE u.role_id = 3
    `;

    db.all(query, [], (err, results) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ message: "Database error" });
        }

        return res.status(results.length > 0 ? 200 : 404).json({
            message: results.length > 0 ? "Teachers found" : "No teachers found",
            teachers: results,
        });
    });
});

// Route to add a new teacher
router.post("/teacher_post", (req, res) => {
    const { firstName, lastName, dob, enrolledDate, email, teacherId, password, course } = req.body;
    console.log("Request body:", req.body);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const userQuery = `
            INSERT INTO users (id, username, password_hash, email, role_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `;
        const userValues = [teacherId, `${firstName} ${lastName}`, password, email, 3];

        db.run(userQuery, userValues, function (err) {
            if (err) {
                console.error("Error inserting user:", err.message);
                db.run("ROLLBACK");
                return res.status(500).json({ message: "Error inserting user" });
            }

            const teacherQuery = `
                INSERT INTO teachers (teacher_id, first_name, last_name, email, enrolled_date, date_of_birth, course)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const teacherValues = [teacherId, firstName, lastName, email, enrolledDate, dob, course];

            db.run(teacherQuery, teacherValues, function (err) {
                if (err) {
                    console.error("Error inserting teacher:", err.message);
                    db.run("ROLLBACK");
                    return res.status(500).json({ message: "Error inserting teacher" });
                }

                db.run("COMMIT");
                return res.status(201).json({ message: "User and teacher data inserted successfully" });
            });
        });
    });
});

// Search teachers by name or email
router.get("/search_teachers", (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    const searchQuery = `
        SELECT t.teacher_id, t.first_name, t.last_name, t.enrolled_date, t.date_of_birth, u.email AS teacher_email 
        FROM teachers t
        JOIN users u ON t.teacher_id = u.id
        WHERE u.role_id = 3 AND (t.first_name LIKE ? OR t.last_name LIKE ? OR u.email LIKE ?)
    `;
    const searchValues = [`%${query}%`, `%${query}%`, `%${query}%`];

    db.all(searchQuery, searchValues, (err, results) => {
        if (err) {
            console.error("Error searching for teachers:", err.message);
            return res.status(500).json({ message: "Database error" });
        }

        return res.status(200).json({
            message: results.length > 0 ? "Search results" : "No teachers found",
            teachers: results,
        });
    });
});

module.exports = router;
