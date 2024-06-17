const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Category", categorySchema);
