const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    passwordHash: { type: String, required: true }, // Will be hashed before saving
    email: { type: String, required: true, unique: true },
    roleId: { type: Number, required: true, default: 4 }, // 4 = Student (default)
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
