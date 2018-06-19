const express = require('express');
const router = express.Router();

// Auth required middleware
const requireAuth = require('../../middlewares/requireAuth');

// Post controller
const PostController = require('../../controllers/posts');


// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/health', requireAuth(), PostController.health);

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', PostController.index);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', PostController.show);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', requireAuth(), PostController.store);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', requireAuth(), PostController.delete);

module.exports = router;
