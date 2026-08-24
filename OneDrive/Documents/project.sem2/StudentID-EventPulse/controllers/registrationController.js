const { param } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const validate = require('../middleware/validate');

exports.registerForEvent = [
  param('eventId').isMongoId().withMessage('Invalid event id'),
  validate,
  asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    const existing = await Registration.findOne({ user: req.user._id, event: event._id });
    if (existing) {
      return next(new AppError('You are already registered for this event', 409));
    }

    if (event.registrationsCount >= event.capacity) {
      return next(new AppError('Event is full', 409));
    }

    const registration = await Registration.create({ user: req.user._id, event: event._id });
    event.registrationsCount = Math.min(event.capacity, event.registrationsCount + 1);
    await event.save();

    res.status(201).json({ success: true, message: 'Registration created successfully', data: registration });
  })
];

exports.getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate({ path: 'event', populate: { path: 'category' } })
    .sort({ createdAt: -1 });

  res.json({ success: true, message: 'Registrations retrieved successfully', data: registrations });
});

exports.cancelRegistration = [
  param('eventId').isMongoId().withMessage('Invalid event id'),
  validate,
  asyncHandler(async (req, res, next) => {
    const registration = await Registration.findOne({ user: req.user._id, event: req.params.eventId });
    if (!registration) {
      return next(new AppError('Registration not found', 404));
    }

    await Registration.deleteOne({ user: req.user._id, event: req.params.eventId });

    const event = await Event.findById(req.params.eventId);
    if (event) {
      event.registrationsCount = Math.max(0, event.registrationsCount - 1);
      await event.save();
    }

    res.json({ success: true, message: 'Registration cancelled successfully', data: null });
  })
];
