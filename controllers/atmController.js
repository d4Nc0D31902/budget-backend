const Atm = require("../models/atm");
const Income = require("../models/income");
const ErrorHandler = require("../utils/errorHandler");
const Cash = require("../models/cash");

//create new ATM entry
// exports.newAtmEntry = async (req, res, next) => {
//   req.body.date = new Date();
//   const atm = await Atm.create(req.body);

//   res.status(201).json({
//     success: true,
//     atm,
//   });
// };

exports.newAtmEntry = async (req, res, next) => {
  try {
    req.body.date = new Date();
    req.body.description = "Card";
    req.body.userId = req.user._id;

    const atm = await Atm.create(req.body);

    const incomeData = {
      description: "ATM",
      amount: req.body.amount,
      date: req.body.date,
      userId: req.user._id,
    };
    const income = await Income.create(incomeData);

    res.status(201).json({
      success: true,
      atm,
      income,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminAtmEntries = async (req, res, next) => {
  const userId = req.user.id;
  const atmEntries = await Atm.find({ userId });
  res.status(200).json({
    success: true,
    atmEntries,
  });
};

exports.getSingleAtmEntry = async (req, res, next) => {
  const atmEntry = await Atm.findById(req.params.id);
  if (!atmEntry) {
    return next(new ErrorHandler("ATM entry not found", 404));
  }
  res.status(200).json({
    success: true,
    atmEntry,
  });
};

exports.updateAtmEntry = async (req, res, next) => {
  const atmEntry = await Atm.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!atmEntry) {
    return next(new ErrorHandler("ATM entry not found", 404));
  }

  res.status(200).json({
    success: true,
    atmEntry,
  });
};

exports.deleteAtmEntry = async (req, res, next) => {
  const atmEntry = await Atm.findById(req.params.id);

  if (!atmEntry) {
    return next(new ErrorHandler("ATM entry not found", 404));
  }

  await atmEntry.remove();
  res.status(200).json({
    success: true,
    message: "ATM entry deleted",
  });
};

exports.getTotalAtmAmount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const atmEntries = await Atm.find({ userId });

    let totalAtm = 0;
    atmEntries.forEach((entry) => {
      totalAtm += entry.amount;
    });

    res.status(200).json({
      success: true,
      totalAtm,
    });
  } catch (error) {
    next(error);
  }
};

// Withdraw money from ATM
exports.withdrawMoney = async (req, res, next) => {
  try {
    const amountToWithdraw = req.body.amount;
    const userId = req.user.id;

    if (amountToWithdraw <= 0) {
      return next(new ErrorHandler("Invalid withdrawal amount", 400));
    }
    const atmEntry = await Atm.findOne({ userId });

    if (!atmEntry || atmEntry.amount < amountToWithdraw) {
      return next(new ErrorHandler("Insufficient funds", 400));
    }

    atmEntry.amount -= amountToWithdraw;
    await atmEntry.save();

    let cashEntry = await Cash.findOne({ userId });

    if (!cashEntry) {
      const cashData = {
        description: "ATM Withdrawal",
        amount: amountToWithdraw,
        date: new Date(),
        userId: userId,
      };
      cashEntry = await Cash.create(cashData);
    } else {
      cashEntry.amount += amountToWithdraw;
      await cashEntry.save();
    }

    res.status(200).json({
      success: true,
      message: "Withdrawal successful",
      atmEntry,
      cashEntry,
    });
  } catch (error) {
    next(error);
  }
};

exports.addAtmAmount = async (req, res, next) => {
  try {
    const atmEntry = await Atm.findById(req.params.id);
    const userId = req.user._id;
    if (!atmEntry) {
      return next(new ErrorHandler("Cash entry not found", 404));
    }

    const amountToAdd = req.body.amount;
    atmEntry.amount += amountToAdd;
    await atmEntry.save();

    const incomeData = {
      description: "Added Cash",
      amount: amountToAdd,
      date: new Date(),
      userId: req.user._id,
    };

    console.log("Income:", incomeData);
    const income = await Income.create(incomeData);

    res.status(200).json({
      success: true,
      message: "Amount added to cash entry successfully",
      atmEntry,
      income,
    });
  } catch (error) {
    next(error);
  }
};

//ATM Count
exports.atmCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Atm.countDocuments({ userId });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
