const User = require("../models/User");

// GET /api/users  (admin)
exports.getUsers = async (req, res) => {
  const {
    q = "",
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 5,
  } = req.query;

  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const sortOpt = { [sort]: order === "asc" ? 1 : -1 };
  const p = Math.max(parseInt(page) || 1, 1);
  const l = Math.max(parseInt(limit) || 5, 1);
  const skip = (p - 1) * l;

  const [items, total] = await Promise.all([
    User.find(filter).sort(sortOpt).skip(skip).limit(l),
    User.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: p,
    limit: l,
    totalPages: Math.max(Math.ceil(total / l), 1),
  });
};

// DELETE /api/users/:id  (admin)
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  if (String(id) === String(req.userId))
    return res.status(400).json({ message: "Không thể tự xoá chính mình" });
  const u = await User.findByIdAndDelete(id);
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Deleted" });
};

// (optional) tạo mới & cập nhật – dùng cho test
exports.createUser = async (req, res) => {
  const { name, email, password, role = "user" } = req.body || {};
  const u = await User.create({ name, email, password, role });
  res.status(201).json(u);
};

exports.updateUser = async (req, res) => {
  const { name, role } = req.body || {};
  const u = await User.findByIdAndUpdate(
    req.params.id,
    { ...(name != null && { name }), ...(role && { role }) },
    { new: true }
  );
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json(u);
};
