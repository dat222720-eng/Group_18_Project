const router = require("express").Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const account = require("../controllers/accountController");

// Forgot & reset password
router.post("/forgot-password", account.forgotPassword);
router.post("/reset-password", account.resetPassword);

// Upload avatar (auth)
router.post("/upload-avatar", auth, upload.single("file"), account.uploadAvatar);

module.exports = router;
