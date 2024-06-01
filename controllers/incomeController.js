const Income = require("../models/income"); // Changed from Cash to Income
const Order = require("../models/order");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// Create new income entry
exports.newIncomeEntry = async (req, res, next) => {
  req.body.date = new Date();
  const income = await Income.create(req.body);

  res.status(201).json({
    success: true,
    income,
  });
};

exports.getAdminIncomeEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const incomeEntries = await Income.find({ user: userId });

    res.status(200).json({
      success: true,
      incomeEntries,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleIncomeEntry = async (req, res, next) => {
  const incomeEntry = await Income.findById(req.params.id);
  if (!incomeEntry) {
    return next(new ErrorHandler("Income entry not found", 404));
  }
  res.status(200).json({
    success: true,
    incomeEntry,
  });
};

exports.updateIncomeEntry = async (req, res, next) => {
  const incomeEntry = await Income.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!incomeEntry) {
    return next(new ErrorHandler("Income entry not found", 404));
  }

  res.status(200).json({
    success: true,
    incomeEntry,
  });
};

exports.deleteIncomeEntry = async (req, res, next) => {
  const incomeEntry = await Income.findById(req.params.id);

  if (!incomeEntry) {
    return next(new ErrorHandler("Income entry not found", 404));
  }

  await incomeEntry.remove();
  res.status(200).json({
    success: true,
    message: "Income entry deleted",
  });
};

// Get total monthly income
exports.getTotalIncome = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const incomeEntries = await Income.find({ user: userId });

    // Calculate total income
    const totalIncome = incomeEntries.reduce(
      (total, entry) => total + entry.amount,
      0
    );

    res.status(200).json({
      success: true,
      totalIncome,
    });
  } catch (error) {
    next(error);
  }
};

exports.incomePerMonth = async (req, res, next) => {
  const incomePerMonth = await Income.aggregate([
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
        total: { $sum: "$amount" },
      },
    },
    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                ,
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: ["$$monthsInString", "$_id.month"],
            },
          },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: 1,
        total: 1,
      },
    },
  ]);

  if (!incomePerMonth) {
    return next(new ErrorHandler("Error calculating income per month", 404));
  }

  res.status(200).json({
    success: true,
    incomePerMonth,
  });
};
