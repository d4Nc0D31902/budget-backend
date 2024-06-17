const Cash = require("../models/cash");
const ErrorHandler = require("../utils/errorHandler");
const Income = require("../models/income");

// Create new cash entry and corresponding income entry
exports.newCashEntry = async (req, res, next) => {
  try {
    req.body.date = new Date();
    req.body.description = "Cash";
    req.body.userId = req.user._id;

    const cash = await Cash.create(req.body);

    const incomeData = {
      description: "On Hand",
      amount: req.body.amount,
      date: req.body.date,
      userId: req.user._id,
    };
    const income = await Income.create(incomeData);

    res.status(201).json({
      success: true,
      cash,
      income,
    });
  } catch (error) {
    next(error);
  }
};

exports.addAmount = async (req, res, next) => {
  try {
    const cashEntry = await Cash.findById(req.params.id);
    if (!cashEntry) {
      return next(new ErrorHandler("Cash entry not found", 404));
    }

    const amountToAdd = req.body.amount;
    cashEntry.amount += amountToAdd;
    await cashEntry.save();

    const incomeData = {
      description: "Added Cash",
      amount: amountToAdd,
      userId: req.user._id,
      date: new Date(),
    };
    const income = await Income.create(incomeData);

    res.status(200).json({
      success: true,
      message: "Amount added to cash entry successfully",
      cashEntry,
      income,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminCashEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cashEntries = await Cash.find({ userId });

    res.status(200).json({
      success: true,
      cashEntries,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleCashEntry = async (req, res, next) => {
  const cashEntry = await Cash.findById(req.params.id);
  if (!cashEntry) {
    return next(new ErrorHandler("Cash entry not found", 404));
  }
  res.status(200).json({
    success: true,
    cashEntry,
  });
};

exports.updateCashEntry = async (req, res, next) => {
  const cashEntry = await Cash.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!cashEntry) {
    return next(new ErrorHandler("Cash entry not found", 404));
  }

  res.status(200).json({
    success: true,
    cashEntry,
  });
};

exports.deleteCashEntry = async (req, res, next) => {
  const cashEntry = await Cash.findById(req.params.id);

  if (!cashEntry) {
    return next(new ErrorHandler("Cash entry not found", 404));
  }

  await cashEntry.remove();
  res.status(200).json({
    success: true,
    message: "Cash entry deleted",
  });
};

exports.getTotalCashAmount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cashEntries = await Cash.find({ userId });
    let totalAmount = 0;
    cashEntries.forEach((entry) => {
      totalAmount += entry.amount;
    });
    res.status(200).json({
      success: true,
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

//CASH Count
exports.cashCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Cash.countDocuments({ userId });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
