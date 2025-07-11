const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Create a new user
router.post('/register', authController.registerUser);

// Get all users
router.get('/users', authController.getAllUsers);

// User login
router.post('/login', authController.loginUser);

module.exports = router; 