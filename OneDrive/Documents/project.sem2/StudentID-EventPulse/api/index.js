const app = require('../app');
const connectDB = require('../config/db');

module.exports = async function handler(req, res) {
  await connectDB();
  return app(req, res);
};