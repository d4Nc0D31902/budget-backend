const Expenses = require("../models/expenses"); // Changed from Income to Expenses
const Order = require("../models/order");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// Create new expenses entry
exports.newExpensesEntry = async (req, res, next) => {
  req.body.date = new Date();
  req.body.userId = req.user._id;
  const expenses = await Expenses.create(req.body);

  res.status(201).json({
    success: true,
    expenses,
  });
};

exports.getAdminExpensesEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expensesEntries = await Expenses.find({ userId });

    res.status(200).json({
      success: true,
      expensesEntries,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleExpensesEntry = async (req, res, next) => {
  const expensesEntry = await Expenses.findById(req.params.id);
  if (!expensesEntry) {
    return next(new ErrorHandler("Expenses entry not found", 404));
  }
  res.status(200).json({
    success: true,
    expensesEntry,
  });
};

exports.updateExpensesEntry = async (req, res, next) => {
  const expensesEntry = await Expenses.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!expensesEntry) {
    return next(new ErrorHandler("Expenses entry not found", 404));
  }

  res.status(200).json({
    success: true,
    expensesEntry,
  });
};

exports.deleteExpensesEntry = async (req, res, next) => {
  const expensesEntry = await Expenses.findById(req.params.id);

  if (!expensesEntry) {
    return next(new ErrorHandler("Expenses entry not found", 404));
  }

  await expensesEntry.remove();
  res.status(200).json({
    success: true,
    message: "Expenses entry deleted",
  });
};

// Get total monthly expenses
exports.getTotalExpenses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expensesEntries = await Expenses.find({ userId });

    // Calculate total expenses
    const totalExpenses = expensesEntries.reduce(
      (total, entry) => total + entry.amount,
      0
    );

    res.status(200).json({
      success: true,
      totalExpenses,
    });
  } catch (error) {
    next(error);
  }
};

// exports.expensesPerMonth = async (req, res, next) => {
//   const expensesPerMonth = await Expenses.aggregate([
//     {
//       $group: {
//         _id: { year: { $year: "$date" }, month: { $month: "$date" } },
//         total: { $sum: "$amount" },
//       },
//     },
//     {
//       $addFields: {
//         month: {
//           $let: {
//             vars: {
//               monthsInString: [
//                 ,
//                 "Jan",
//                 "Feb",
//                 "Mar",
//                 "Apr",
//                 "May",
//                 "Jun",
//                 "Jul",
//                 "Aug",
//                 "Sept",
//                 "Oct",
//                 "Nov",
//                 "Dec",
//               ],
//             },
//             in: {
//               $arrayElemAt: ["$$monthsInString", "$_id.month"],
//             },
//           },
//         },
//       },
//     },
//     { $sort: { "_id.year": 1, "_id.month": 1 } },
//     {
//       $project: {
//         _id: 0,
//         year: "$_id.year",
//         month: 1,
//         total: 1,
//       },
//     },
//   ]);

//   if (!expensesPerMonth) {
//     return next(new ErrorHandler("Error calculating expenses per month", 404));
//   }

//   res.status(200).json({
//     success: true,
//     expensesPerMonth,
//   });
// };

exports.expensesPerMonth = async (req, res, next) => {
  const userId = req.user._id; 

  const expensesPerMonth = await Expenses.aggregate([
    {
      $match: {
        userId: userId,
      },
    },
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

  if (!expensesPerMonth) {
    return next(new ErrorHandler("Error calculating expenses per month", 404));
  }

  res.status(200).json({
    success: true,
    expensesPerMonth,
  });
};
