// server/routes/users.js

const express = require('express');
const { getUsers, getUserById, updateUser } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect and restrict all routes to admin
router.use(protect);
router.use(authorize('ADMIN'));

// User routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;