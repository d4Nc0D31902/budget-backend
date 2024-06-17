const Savings = require("../models/savings");
const ErrorHandler = require("../utils/errorHandler");

// Create new savings entry
exports.newSavingsEntry = async (req, res, next) => {
  req.body.date = new Date();
  req.body.userId = req.user._id;
  const savings = await Savings.create(req.body);

  res.status(201).json({
    success: true,
    savings,
  });
};

exports.getAdminSavingsEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const savingsEntries = await Savings.find({ userId });

    res.status(200).json({
      success: true,
      savingsEntries,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleSavingsEntry = async (req, res, next) => {
  const savingsEntry = await Savings.findById(req.params.id);
  if (!savingsEntry) {
    return next(new ErrorHandler("Savings entry not found", 404));
  }
  res.status(200).json({
    success: true,
    savingsEntry,
  });
};

exports.updateSavingsEntry = async (req, res, next) => {
  const savingsEntry = await Savings.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!savingsEntry) {
    return next(new ErrorHandler("Savings entry not found", 404));
  }

  res.status(200).json({
    success: true,
    savingsEntry,
  });
};

exports.deleteSavingsEntry = async (req, res, next) => {
  const savingsEntry = await Savings.findById(req.params.id);

  if (!savingsEntry) {
    return next(new ErrorHandler("Savings entry not found", 404));
  }

  await savingsEntry.remove();
  res.status(200).json({
    success: true,
    message: "Savings entry deleted",
  });
};

// Get total monthly savings
exports.getTotalSavings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const savingsEntries = await Savings.find({ userId });

    const totalSavings = savingsEntries.reduce(
      (total, entry) => total + entry.amount,
      0
    );

    res.status(200).json({
      success: true,
      totalSavings,
    });
  } catch (error) {
    next(error);
  }
};

exports.savingsPerMonth = async (req, res, next) => {
  const savingsPerMonth = await Savings.aggregate([
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

  if (!savingsPerMonth) {
    return next(new ErrorHandler("Error calculating savings per month", 404));
  }

  res.status(200).json({
    success: true,
    savingsPerMonth,
  });
};
