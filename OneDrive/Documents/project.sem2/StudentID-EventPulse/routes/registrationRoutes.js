const express = require('express');
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/**
 * @openapi
 * /api/registrations/me:
 *   get:
 *     summary: Get current user's registrations
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Registrations list
 * /api/registrations/{eventId}:
 *   post:
 *     summary: Register for an event
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Registration created
 *   delete:
 *     summary: Cancel registration for an event
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration cancelled
 */
router.post('/:eventId', requireAuth, requireRole('attendee'), registerForEvent);
router.get('/me', requireAuth, requireRole('attendee'), getMyRegistrations);
router.delete('/:eventId', requireAuth, requireRole('attendee'), cancelRegistration);

module.exports = router;
