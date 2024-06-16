const Category = require("../models/category");
const ErrorHandler = require("../utils/errorHandler");

// Create new category entry
exports.newCategory = async (req, res, next) => {
  req.body.date = new Date();
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
};

exports.getAdminCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categories = await Category.find({ user: userId });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorHandler("Category entry not found", 404));
  }
  res.status(200).json({
    success: true,
    category,
  });
};

exports.updateCategory = async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
};

exports.deleteCategory = async (req, res, next) => {
  const categoryEntry = await Category.findById(req.params.id);

  if (!categoryEntry) {
    return next(new ErrorHandler("Category entry not found", 404));
  }

  await categoryEntry.remove();
  res.status(200).json({
    success: true,
    message: "Category entry deleted",
  });
};
