const router = require("express").Router();
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");
const User = require("../models/User");

// GET /api/profile
router.get("/profile", auth, async (req, res) => {
  const u = await User.findById(req.userId).select("-password");
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json(u);
});

// PUT /api/profile
router.put("/profile", auth, async (req, res) => {
  const payload = {};
  if (req.body.name != null) payload.name = req.body.name;
  if (req.body.password?.trim())
    payload.password = await bcrypt.hash(req.body.password, 10);

  const u = await User.findByIdAndUpdate(req.userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!u) return res.status(404).json({ message: "User not found" });
  res.json({ id: u._id, name: u.name, email: u.email, role: u.role, updatedAt: u.updatedAt });
});

module.exports = router;
