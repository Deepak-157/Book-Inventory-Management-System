const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  register
);

// Login route
router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists()
  ],
  login
);

// Get current user route
router.get('/me', protect, getMe);

module.exports = router;