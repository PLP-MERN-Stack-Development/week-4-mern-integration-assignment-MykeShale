const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Protected routes
router.get('/me', protect, authController.getCurrentUser);
router.get('/users', protect, authController.getAllUsers);

module.exports = router; 