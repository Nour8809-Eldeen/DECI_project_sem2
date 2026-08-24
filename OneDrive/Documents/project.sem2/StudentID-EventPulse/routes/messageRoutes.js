const express = require('express');
const { getMessagesByEvent } = require('../controllers/messageController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

/**
 * @openapi
 * /api/messages/{eventId}:
 *   get:
 *     summary: Get announcement history for an event
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message history
 */
router.get('/:eventId', requireAuth, getMessagesByEvent);

module.exports = router;
