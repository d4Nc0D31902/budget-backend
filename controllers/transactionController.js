const Transaction = require("../models/transaction");
const ErrorHandler = require("../utils/errorHandler");
const Expenses = require("../models/expenses");
const Cash = require("../models/cash");
const ATM = require("../models/atm");
const Savings = require("../models/savings");

// Create a new transaction
exports.newTransaction = async (req, res, next) => {
  try {
    const transactionData = {
      ...req.body,
      user: req.user._id,
    };

    const transaction = await Transaction.create(transactionData);

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single transaction by ID
exports.getSingleTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return next(new ErrorHandler("Transaction not found", 404));
    }
    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return next(new ErrorHandler("Transaction not found", 404));
    }
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return next(new ErrorHandler("Transaction not found", 404));
    }
    await transaction.remove();
    res.status(200).json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.transaction = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const userId = req.user.id;

    const { account, amount, notes, category } = req.body;
    const transactionData = {
      userId,
      account,
      amount,
      notes,
      date: currentDate,
      category,
    };

    console.log("Transaction:", transactionData);
    const transaction = await Transaction.create(transactionData);

    if (account === "On Hand") {
      const cash = await Cash.findOne();
      if (!cash) {
        return next(new ErrorHandler("Cash balance not found", 404));
      }
      cash.amount -= amount;
      await cash.save();
    } else if (account === "ATM") {
      const atm = await ATM.findOne();
      if (!atm) {
        return next(new ErrorHandler("ATM balance not found", 404));
      }
      atm.amount -= amount;
      await atm.save();
    }

    let entry;
    if (category === "Expenses") {
      const expensesData = {
        description: notes,
        amount,
        date: currentDate,
        userId,
      };
      entry = await Expenses.create(expensesData);
    } else if (category === "Savings") {
      const savingsData = {
        description: notes,
        amount,
        date: currentDate,
        userId,
      };
      entry = await Savings.create(savingsData);
    } else {
      return next(new ErrorHandler("Invalid category", 400));
    }

    res.status(201).json({
      success: true,
      transaction,
      entry,
    });
  } catch (error) {
    next(error);
  }
};
