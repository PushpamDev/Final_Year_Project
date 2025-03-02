const { User, Student } = require("../models/Student");

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().lean();
    const users = await User.find().lean();

    const studentsWithEmail = students.map((s) => ({
      ...s,
      student_email: users.find((u) => u._id.toString() === s._id.toString())?.email || "",
    }));

    return res.status(studentsWithEmail.length ? 200 : 404).json({
      message: studentsWithEmail.length ? "Students found" : "No students found",
      students: studentsWithEmail,
    });
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const { firstName, lastName, dob, enrollmentDate, gradeLevel, studGroup, email, studentId, password } = req.body;

    const existingUser = await User.findById(studentId);
    if (existingUser) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    const newUser = new User({
      _id: studentId,
      username: `${firstName} ${lastName}`,
      passwordHash: password, // TODO: Hash before saving
      email,
      roleId: 4, // Student role
    });

    const newStudent = new Student({
      _id: studentId,
      firstName,
      lastName,
      gradeLevel,
      studGroup,
      enrollmentDate,
      dateOfBirth: dob,
    });

    await newUser.save();
    await newStudent.save();

    return res.status(201).json({ message: "User and student data inserted successfully" });
  } catch (error) {
    console.error("Error inserting student:", error.message);
    return res.status(500).json({ message: "Error inserting data", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { stud_id, first_name, last_name, grade_level, stud_group, date_of_birth, enrollment_date, student_email } = req.body;

    if (!stud_id) return res.status(400).json({ message: "Student ID is required" });

    await User.findByIdAndUpdate(stud_id, { email: student_email });
    await Student.findByIdAndUpdate(stud_id, {
      firstName: first_name,
      lastName: last_name,
      gradeLevel: grade_level,
      studGroup: stud_group,
      dateOfBirth: date_of_birth,
      enrollmentDate: enrollment_date,
    });

    return res.status(200).json({ message: "Student data updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error.message);
    return res.status(500).json({ message: "Error updating student", error: error.message });
  }
};

const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const students = await Student.find({
      $or: [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
      ],
    }).lean();

    const users = await User.find({ email: new RegExp(query, "i") }).lean();

    const results = students.map((s) => ({
      ...s,
      student_email: users.find((u) => u._id.toString() === s._id.toString())?.email || "",
    }));

    return res.status(results.length ? 200 : 404).json({
      message: results.length ? "Search results" : "No students found",
      students: results,
    });
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
};

// ✅ Ensure proper export
module.exports = { getAllStudents, addStudent, updateStudent, searchStudents };
