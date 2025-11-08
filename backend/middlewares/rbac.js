// (tuỳ bạn có dùng hay không, để sẵn helper)
module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userRole)) return res.status(403).json({ message: "Forbidden" });
  next();
};
