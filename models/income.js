const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    enum: {
      values: ["On Hand", "ATM", "Added Cash", "Salary"],
    },
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Income", incomeSchema);
