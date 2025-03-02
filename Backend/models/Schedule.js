const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
  {
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    classroom_id: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    day_of_week: { type: String, required: true },
    start_time: { type: Date, required: true }, // Changed from String to Date for better time handling
    end_time: { type: Date, required: true }, // Changed from String to Date
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model("Schedule", ScheduleSchema);
