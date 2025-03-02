const mongoose = require("mongoose");

// ✅ Student Schema (linked to User)
const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    studGroup: { type: String, required: true },
    enrollmentDate: { type: Date, required: true },
    dateOfBirth: { type: Date, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Export Student model only (User should be in a separate file)
module.exports = mongoose.model("Student", studentSchema);
