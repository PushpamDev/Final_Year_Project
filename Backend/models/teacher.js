const mongoose = require("mongoose");

// ✅ Teacher Schema (linked to User)
const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    enrolledDate: { type: Date, required: true },
    dateOfBirth: { type: Date, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Linking to Course model
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Export only the Teacher model (User should be in a separate file)
module.exports = mongoose.model("Teacher", teacherSchema);
