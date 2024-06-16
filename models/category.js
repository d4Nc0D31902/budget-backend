const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
