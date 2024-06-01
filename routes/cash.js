const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getAdminCashEntries,
  newCashEntry,
  getSingleCashEntry,
  updateCashEntry,
  deleteCashEntry,
  getTotalCashAmount,
  addAmount,
} = require("../controllers/cashController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/cash", isAuthenticatedUser, getAdminCashEntries);
router.post("/cash/new", isAuthenticatedUser, newCashEntry);
router.put("/cash/add/:id", isAuthenticatedUser, addAmount);
router.get("/cash/:id", isAuthenticatedUser, getSingleCashEntry);
router.put("/cash/:id", isAuthenticatedUser, updateCashEntry);
router.delete("/cash/:id", isAuthenticatedUser, deleteCashEntry);

router.get("/total-cash", isAuthenticatedUser, getTotalCashAmount);

module.exports = router;
