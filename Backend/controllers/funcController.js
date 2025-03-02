const User = require("../models/User");
const Schedule = require("../models/Schedule");
const Classroom = require("../models/Classroom");
const Course = require("../models/Course");
const mongoose = require("mongoose");  // ✅ Import mongoose

// Fetch Role by Email
const fetchRole = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email }).select("role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ 
      message: "Role fetched successfully", 
      role_id: user.role  // ✅ Add this line
    });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// Fetch User Profile by Email
const fetchProfile = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email }).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// Fetch Schedule by Group ID
const fetchSchedule = async (req, res) => {
  const { group_id } = req.body;
  if (!group_id) return res.status(400).json({ message: "Group ID is required" });

  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(group_id)) {
    return res.status(400).json({ message: "Invalid Group ID format" });
  }

  try {
    const schedules = await Schedule.find({ group_id: new mongoose.Types.ObjectId(group_id) })
      .populate("classroom_id", "name")
      .populate("course_id", "name")
      .populate("teacher_id", "name");

    res.status(200).json({ message: "Schedules fetched successfully", schedules });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// Delete Schedule
const deleteSchedule = async (req, res) => {
  const { schedule_id } = req.body;
  if (!schedule_id) return res.status(400).json({ message: "Schedule ID is required" });

  try {
    await Schedule.findByIdAndDelete(schedule_id);
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// Get All Classrooms
const getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json({ message: "Classrooms fetched successfully", data: classrooms });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// Get All Courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ message: "Courses fetched successfully", data: courses });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// Add a Classroom
const addClassroom = async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) return res.status(400).json({ message: "Name and type are required" });

  try {
    const newClassroom = await Classroom.create({ name, type });
    res.status(201).json({ message: "Classroom added successfully", data: newClassroom });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// Delete a Classroom by ID
const deleteClassroom = async (req, res) => {
  const { id } = req.params;

  try {
    await Classroom.findByIdAndDelete(id);
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// ✅ Export all functions properly
module.exports = {
  fetchRole,
  fetchProfile,
  fetchSchedule,
  deleteSchedule,
  getClassrooms,
  getCourses,
  addClassroom,
  deleteClassroom,
};
