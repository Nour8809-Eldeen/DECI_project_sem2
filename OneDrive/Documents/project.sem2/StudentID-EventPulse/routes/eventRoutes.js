const express = require('express');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Get events with filters and pagination
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Events list
 *   post:
 *     summary: Create event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, date, city, venue, capacity, category]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *               city:
 *                 type: string
 *               venue:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created
 */
router.post('/', requireAuth, requireRole('admin'), createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.patch('/:id', requireAuth, requireRole('admin'), updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), deleteEvent);

module.exports = router;
