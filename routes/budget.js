const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getAdminBudgets,
  newBudget,
  getSingleBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/budget", isAuthenticatedUser, getAdminBudgets);
router.post("/budget/new", isAuthenticatedUser, newBudget);
router.get("/budget/:id", isAuthenticatedUser, getSingleBudget);
router.put("/budget/:id", isAuthenticatedUser, updateBudget);
router.delete("/budget/:id", isAuthenticatedUser, deleteBudget);

module.exports = router;
