const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getAdminExpensesEntries,
  newExpensesEntry,
  getSingleExpensesEntry,
  updateExpensesEntry,
  deleteExpensesEntry,
  getTotalExpenses,
  expensesPerMonth,
} = require("../controllers/expensesController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/expenses", isAuthenticatedUser, getAdminExpensesEntries);
router.post("/expenses/new", isAuthenticatedUser, newExpensesEntry);
router.get("/expenses/:id", isAuthenticatedUser, getSingleExpensesEntry);
router.put("/expenses/:id", isAuthenticatedUser, updateExpensesEntry);
router.delete("/expenses/:id", isAuthenticatedUser, deleteExpensesEntry);

router.get("/expenses-perMonth", isAuthenticatedUser, expensesPerMonth);
router.get("/total-expenses", isAuthenticatedUser, getTotalExpenses);

module.exports = router;
