const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getAdminCategory,
  newCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/category", isAuthenticatedUser, getAdminCategory);
router.post("/category/new", isAuthenticatedUser, newCategory);
router.get("/category/:id", isAuthenticatedUser, getSingleCategory);
router.put("/category/:id", isAuthenticatedUser, updateCategory);
router.delete("/category/:id", isAuthenticatedUser, deleteCategory);

module.exports = router;
