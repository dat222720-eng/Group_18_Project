const crypto = require("crypto");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// POST /api/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body || {};
  const u = await User.findOne({ email });
  if (u) {
    u.resetToken = crypto.randomBytes(32).toString("hex");
    u.resetTokenExp = new Date(Date.now() + 1000 * 60 * 15); // 15'
    await u.save();
    console.log("🔑 RESET TOKEN for", email, "=>", u.resetToken);
  }
  res.json({ message: "Nếu email tồn tại, token đã được gửi" });
};

// POST /api/reset-password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ message: "Thiếu token/password" });

  const u = await User.findOne({
    resetToken: token,
    resetTokenExp: { $gt: new Date() },
  }).select("+password");

  if (!u) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

  u.password = password; // pre-save sẽ hash
  u.resetToken = undefined;
  u.resetTokenExp = undefined;
  await u.save();

  res.json({ message: "Đổi mật khẩu thành công" });
};

// POST /api/upload-avatar
exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Chưa chọn file" });

  let url = "";
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const uploaded = await cloudinary.uploader.upload_stream(
      { folder: "avatars", resource_type: "image" },
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        url = result.secure_url;
      }
    );
  }

  // Nếu không cấu hình Cloudinary, trả base64 tạm (demo)
  if (!url) {
    url = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  }

  const u = await User.findByIdAndUpdate(
    req.userId,
    { avatarUrl: url },
    { new: true }
  ).select("-password");

  res.json({ message: "Upload thành công", avatarUrl: u.avatarUrl });
};
