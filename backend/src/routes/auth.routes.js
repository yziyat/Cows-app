// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { login, register, getCurrentUser } = require('../controllers/auth.controller');
const { authenticateToken, authorize } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', authenticateToken, authorize('admin'), register);
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
