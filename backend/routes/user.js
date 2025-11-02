const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);      // PUT
router.delete("/users/:id", userController.deleteUser);    // DELETE

module.exports = router;
router.get("/users", async (req, res) => {
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
});