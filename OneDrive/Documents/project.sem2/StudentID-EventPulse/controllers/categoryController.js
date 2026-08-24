const { body, param } = require('express-validator');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const validate = require('../middleware/validate');

const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required')
];

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ success: true, message: 'Categories retrieved successfully', data: categories });
});

exports.getCategoryById = [
  param('id').isMongoId().withMessage('Invalid category id'),
  validate,
  asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.json({ success: true, message: 'Category retrieved successfully', data: category });
  })
];

exports.createCategory = [
  categoryValidation,
  validate,
  asyncHandler(async (req, res, next) => {
    const existing = await Category.findOne({ name: req.body.name });
    if (existing) {
      return next(new AppError('Category already exists', 409));
    }

    const category = await Category.create(req.body);
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  })
];

exports.updateCategory = [
  param('id').isMongoId().withMessage('Invalid category id'),
  categoryValidation,
  validate,
  asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.json({ success: true, message: 'Category updated successfully', data: category });
  })
];

exports.deleteCategory = [
  param('id').isMongoId().withMessage('Invalid category id'),
  validate,
  asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.json({ success: true, message: 'Category deleted successfully', data: null });
  })
];
