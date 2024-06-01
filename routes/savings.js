const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getAdminSavingsEntries,
  newSavingsEntry,
  getSingleSavingsEntry,
  updateSavingsEntry,
  deleteSavingsEntry,
  getTotalSavings,
  savingsPerMonth,
} = require("../controllers/savingsController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/savings", isAuthenticatedUser, getAdminSavingsEntries);
router.post("/savings/new", isAuthenticatedUser, newSavingsEntry);
router.get("/savings/:id", isAuthenticatedUser, getSingleSavingsEntry);
router.put("/savings/:id", isAuthenticatedUser, updateSavingsEntry);
router.delete("/savings/:id", isAuthenticatedUser, deleteSavingsEntry);

router.get("/savings-perMonth", isAuthenticatedUser, savingsPerMonth);
router.get("/total-savings", isAuthenticatedUser, getTotalSavings);

module.exports = router;
