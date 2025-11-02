const User = require("../models/User");

// GET
exports.getUsers = async (req, res) => {
  try {
    const list = await User.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// POST
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name?.trim() || !email?.trim())
      return res.status(400).json({ message: "Name & email required" });
    const u = await User.create({ name: name.trim(), email: email.trim() });
    res.status(201).json(u);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PUT
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {};
    if (req.body.name != null) payload.name = req.body.name;
    if (req.body.email != null) payload.email = req.body.email;

    const u = await User.findByIdAndUpdate(id, payload, {
      new: true, runValidators: true
    });
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const u = await User.findByIdAndDelete(id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.status(204).end();
  } catch (e) { res.status(500).json({ message: e.message }); }
};
