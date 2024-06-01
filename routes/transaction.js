const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth");
const {
  newTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
  transaction,
} = require("../controllers/transactionController");

// Transactions routes
router.post("/transactions", isAuthenticatedUser, newTransaction);
router.get("/transactions", isAuthenticatedUser, getAllTransactions);
router.get("/transactions/:id", isAuthenticatedUser, getSingleTransaction);
router.put("/transactions/:id", isAuthenticatedUser, updateTransaction);
router.delete("/transactions/:id", isAuthenticatedUser, deleteTransaction);

// Expenses route
router.post("/transaction", isAuthenticatedUser, transaction);

module.exports = router;
