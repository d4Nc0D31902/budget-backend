const Budget = require("../models/budget");
const ErrorHandler = require("../utils/errorHandler");

exports.newBudget = async (req, res, next) => {
  try {
    const budgetData = {
      ...req.body,
      userId: req.user._id,
    };
    const budget = await Budget.create(budgetData);
    res.status(201).json({
      success: true,
      budget,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.getAdminBudgets = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const budgets = await Budget.find({ userId });

    res.status(200).json({
      success: true,
      budgets,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSingleBudget = async (req, res, next) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) {
    return next(new ErrorHandler("Budget not found", 404));
  }
  res.status(200).json({
    success: true,
    budget,
  });
};

exports.updateBudget = async (req, res, next) => {
  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!budget) {
    return next(new ErrorHandler("Budget not found", 404));
  }

  res.status(200).json({
    success: true,
    budget,
  });
};

exports.deleteBudget = async (req, res, next) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    return next(new ErrorHandler("Budget not found", 404));
  }

  await budget.remove();
  res.status(200).json({
    success: true,
    message: "Budget deleted",
  });
};
