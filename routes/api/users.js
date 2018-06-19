const express = require('express');
const router = express.Router();

// Auth required middleware
const requireAuth = require('../../middlewares/requireAuth');

// Load User controller
const UserController = require('../../controllers/users');
// Load Auth controller
const AuthController = require('../../controllers/auth');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/health', UserController.health );

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', AuthController.register);

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', AuthController.login);

// @route   POST api/users/resetpassword
// @desc    Generate url for reset password
// @acces   Public
router.post('/resetpassword', AuthController.createReset);

// @route   Post api/users/resetpassword/:token
// @desc    Reset password / Set new password
// @acces   Public
router.post('/resetpassword/:token', AuthController.resetPassword);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/me', requireAuth(), UserController.me);

module.exports = router;
