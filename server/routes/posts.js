const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// GET all posts
router.get('/', postController.getAllPosts);

// POST create a new post
router.post('/', postController.createPost);

// GET a single post by ID
router.get('/:id', postController.getPostById);

// PUT update a post by ID
router.put('/:id', postController.updatePost);

// DELETE a post by ID
router.delete('/:id', postController.deletePost);

module.exports = router; 