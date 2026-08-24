const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    data: {
      uptime: process.uptime(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  });
});

module.exports = router;
