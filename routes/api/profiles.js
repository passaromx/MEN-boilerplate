const express = require('express');
const router = express.Router();

// Auth required middleware
const requireAuth = require('../../middlewares/requireAuth');

// Profile Controller
const ProfileController = require('../../controllers/profiles');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/health', ProfileController.health);

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', requireAuth(), ProfileController.getUserProfile);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', ProfileController.index);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', ProfileController.showByHandle);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', ProfileController.showByUser);

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', requireAuth(), ProfileController.create);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', requireAuth(), ProfileController.addExperience);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', requireAuth(), ProfileController.deleteExperience);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', requireAuth(), ProfileController.delete);

module.exports = router;
