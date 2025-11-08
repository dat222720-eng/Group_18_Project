const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 5 },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Forgot password
    resetToken: { type: String, select: false },
    resetTokenExp: { type: Date, select: false },

    // Avatar
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before save if modified
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
