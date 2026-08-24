const jwt = require('jsonwebtoken');
const { param } = require('express-validator');
const Message = require('../models/Message');
const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const validate = require('../middleware/validate');

exports.getMessagesByEvent = [
  param('eventId').isMongoId().withMessage('Invalid event id'),
  validate,
  asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    const messages = await Message.find({ event: req.params.eventId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    res.json({ success: true, message: 'Messages retrieved successfully', data: messages });
  })
];

async function handleAnnouncement(io, socket, payload) {
  const { eventId, content, token } = payload || {};
  if (!eventId || !content) {
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    socket.emit('announcementError', { message: 'JWT secret is not configured' });
    return null;
  }

  let decoded = null;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    socket.emit('announcementError', { message: 'Invalid token' });
    return null;
  }

  const EventModel = require('../models/Event');
  const UserModel = require('../models/User');
  const MessageModel = require('../models/Message');

  const event = await EventModel.findById(eventId);
  const sender = await UserModel.findById(decoded.id);

  if (!event || !sender || sender.role !== 'admin') {
    socket.emit('announcementError', { message: 'Only admins can announce' });
    return null;
  }

  const message = await MessageModel.create({ event: event._id, sender: sender._id, content });
  const populatedMessage = await MessageModel.findById(message._id).populate('sender', 'name role');
  io.to(String(eventId)).emit('newAnnouncement', populatedMessage);
  return populatedMessage;
}

exports.handleAnnouncement = handleAnnouncement;
