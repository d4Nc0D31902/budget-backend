const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getAdminAtmEntries,
  newAtmEntry,
  getSingleAtmEntry,
  updateAtmEntry,
  deleteAtmEntry,
  getTotalAtmAmount,
  withdrawMoney,
  addAtmAmount,
  atmCount,
} = require("../controllers/atmController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/atm", isAuthenticatedUser, getAdminAtmEntries);
router.post("/atm/new", isAuthenticatedUser, newAtmEntry);
router.get("/atm/:id", isAuthenticatedUser, getSingleAtmEntry);
router.put("/atm/:id", isAuthenticatedUser, updateAtmEntry);
router.put("/atm/add/:id", isAuthenticatedUser, addAtmAmount);
router.delete("/atm/:id", isAuthenticatedUser, deleteAtmEntry);
router.post("/atm/withdraw", isAuthenticatedUser, withdrawMoney);

router.get("/total-atm", isAuthenticatedUser, getTotalAtmAmount);
router.get("/atm-count", isAuthenticatedUser, atmCount);

module.exports = router;
