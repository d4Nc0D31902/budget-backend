const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getAdminIncomeEntries,
  newIncomeEntry,
  getSingleIncomeEntry,
  updateIncomeEntry,
  deleteIncomeEntry,
  getTotalIncome,
  incomePerMonth,
} = require("../controllers/incomeController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/income", isAuthenticatedUser, getAdminIncomeEntries);
router.post("/income/new", isAuthenticatedUser, newIncomeEntry);
router.get("/income/:id", isAuthenticatedUser, getSingleIncomeEntry);
router.put("/income/:id", isAuthenticatedUser, updateIncomeEntry);
router.delete("/income/:id", isAuthenticatedUser, deleteIncomeEntry);

router.get("/income-perMonth", isAuthenticatedUser, incomePerMonth);
router.get("/total-income", isAuthenticatedUser, getTotalIncome);


module.exports = router;
