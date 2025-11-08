const router = require("express").Router();
const auth = require("../middlewares/auth");
const { allow } = require("../middlewares/auth");
const ctrl = require("../controllers/userController");

// Admin endpoints
router.get("/users", auth, allow("admin"), ctrl.getUsers);
router.delete("/users/:id", auth, allow("admin"), ctrl.deleteUser);

// (Optional test)
router.post("/users", auth, allow("admin"), ctrl.createUser);
router.put("/users/:id", auth, allow("admin"), ctrl.updateUser);

module.exports = router;
