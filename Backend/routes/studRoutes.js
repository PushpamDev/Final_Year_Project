const express = require("express");
const {
  getAllStudents,
  addStudent,
  updateStudent,
  searchStudents,
} = require("../controllers/studentController"); // ✅ Correct import

const router = express.Router();

// ✅ Define routes correctly
router.get("/students", getAllStudents);
router.post("/students", addStudent);
router.put("/students", updateStudent);
router.get("/students/search", searchStudents);

module.exports = router;
