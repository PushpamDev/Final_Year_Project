const express = require("express");
const router = express.Router();
const funcController = require("../controllers/funcController");

console.log("FuncController Import:", funcController); // 🔍 Debugging

// Routes
router.post("/fetch_role", funcController.fetchRole);
router.post("/fetch_profile", funcController.fetchProfile);
router.post("/fetch_schedule", funcController.fetchSchedule);
router.delete("/delete_schedule", funcController.deleteSchedule);
router.get("/get_classrooms", funcController.getClassrooms);
router.get("/get_courses", funcController.getCourses);
router.post("/add_classroom", funcController.addClassroom);
router.delete("/delete_classroom/:id", funcController.deleteClassroom);

module.exports = router;
