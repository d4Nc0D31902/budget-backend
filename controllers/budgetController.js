const Budget = require("../models/budget");
const ErrorHandler = require("../utils/errorHandler");

exports.newBudget = async (req, res, next) => {
  const budget = await Budget.create(req.body);

  res.status(201).json({
    success: true,
    budget,
  });
};

exports.getAdminBudgets = async (req, res, next) => {
  const userId = req.user.id;
  const budgets = await Budget.find({ user: userId });
  res.status(200).json({
    success: true,
    budgets,
  });
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
