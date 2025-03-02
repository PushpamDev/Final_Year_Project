const { User, Teacher } = require("../models/teacher");

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().lean();
    return res.status(teachers.length ? 200 : 404).json({
      message: teachers.length ? "Teachers found" : "No teachers found",
      teachers,
    });
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
};

const addTeacher = async (req, res) => {
  try {
    const { name, email, subject, teacherId, password } = req.body;

    const existingUser = await User.findById(teacherId);
    if (existingUser) {
      return res.status(400).json({ message: "Teacher ID already exists" });
    }

    const newUser = new User({
      _id: teacherId,
      username: name,
      passwordHash: password, // TODO: Hash before saving
      email,
      roleId: 3, // Teacher role
    });

    const newTeacher = new Teacher({
      _id: teacherId,
      name,
      subject,
      email,
    });

    await newUser.save();
    await newTeacher.save();

    return res.status(201).json({ message: "Teacher added successfully" });
  } catch (error) {
    console.error("Error adding teacher:", error.message);
    return res.status(500).json({ message: "Error adding teacher", error: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { teacher_id, name, subject, email } = req.body;

    if (!teacher_id) return res.status(400).json({ message: "Teacher ID is required" });

    await User.findByIdAndUpdate(teacher_id, { email });
    await Teacher.findByIdAndUpdate(teacher_id, { name, subject, email });

    return res.status(200).json({ message: "Teacher data updated successfully" });
  } catch (error) {
    console.error("Error updating teacher:", error.message);
    return res.status(500).json({ message: "Error updating teacher", error: error.message });
  }
};

const searchTeachers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const teachers = await Teacher.find({
      $or: [{ name: new RegExp(query, "i") }, { subject: new RegExp(query, "i") }],
    }).lean();

    return res.status(teachers.length ? 200 : 404).json({
      message: teachers.length ? "Search results" : "No teachers found",
      teachers,
    });
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
};

// ✅ Ensure all functions are correctly exported
module.exports = { getAllTeachers, addTeacher, updateTeacher, searchTeachers };
