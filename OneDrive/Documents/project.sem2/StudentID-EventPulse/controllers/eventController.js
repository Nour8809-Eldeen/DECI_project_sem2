const { body, param, query } = require('express-validator');
const Event = require('../models/Event');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const validate = require('../middleware/validate');

const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Date is required and must be valid'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('category').isMongoId().withMessage('Category must be a valid id')
];

exports.createEvent = [
  eventValidation,
  validate,
  asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id
    });

    const populated = await Event.findById(event._id).populate('category');
    res.status(201).json({ success: true, message: 'Event created successfully', data: populated });
  })
];

exports.getEvents = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  validate,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-date';
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.city) filters.city = { $regex: new RegExp(String(req.query.city).trim(), 'i') };
    if (req.query.dateFrom || req.query.dateTo) {
      filters.date = {};
      if (req.query.dateFrom) filters.date.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filters.date.$lte = new Date(req.query.dateTo);
    }

    const queryFilter = { ...filters };
    if (search) {
      queryFilter.$text = { $search: search };
    }

    const total = await Event.countDocuments(queryFilter);
    const events = await Event.find(queryFilter)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      data: events,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  })
];

exports.getEventById = [
  param('id').isMongoId().withMessage('Invalid event id'),
  validate,
  asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id).populate('category');
    if (!event) {
      return next(new AppError('Event not found', 404));
    }
    res.json({ success: true, message: 'Event retrieved successfully', data: event });
  })
];

exports.updateEvent = [
  param('id').isMongoId().withMessage('Invalid event id'),
  eventValidation,
  validate,
  asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return next(new AppError('Category not found', 404));
      }
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('category');
    res.json({ success: true, message: 'Event updated successfully', data: updated });
  })
];

exports.deleteEvent = [
  param('id').isMongoId().withMessage('Invalid event id'),
  validate,
  asyncHandler(async (req, res, next) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }
    res.json({ success: true, message: 'Event deleted successfully', data: null });
  })
];
