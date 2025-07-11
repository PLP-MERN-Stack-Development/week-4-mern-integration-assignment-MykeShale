const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// Create a new category
router.post('/', categoriesController.createCategory);

// Get all categories
router.get('/', categoriesController.getAllCategories);

module.exports = router; 