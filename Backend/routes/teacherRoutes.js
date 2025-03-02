const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

// ✅ Routes using controllers
router.get("/teacher_details", teacherController.getAllTeachers);
router.post("/teacher_post", teacherController.addTeacher);
router.get("/search_teachers", teacherController.searchTeachers);

module.exports = router;
