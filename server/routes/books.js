const express = require('express');
const { check } = require('express-validator');
const { 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook,
  getBookStats
} = require('../controllers/books');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get book stats
router.get('/stats', getBookStats);

// Get all books with pagination
router.get('/', getBooks);

// Get single book
router.get('/:id', getBookById);

// Create book - only ADMIN and EDITOR can create
router.post(
  '/',
  authorize('ADMIN', 'EDITOR'),
  [
    check('title', 'Title is required').notEmpty(),
    check('author', 'Author is required').notEmpty(),
    check('isbn', 'ISBN is required').notEmpty(),
    check('category', 'Category is required').notEmpty(),
    check('publicationDate', 'Publication date is required').notEmpty(),
    check('status', 'Status is required').notEmpty(),
    check('bookType', 'Book type is required').notEmpty(),
    check('condition', 'Condition is required').notEmpty(),
    check('purchasePrice', 'Purchase price is required').isNumeric(),
    check('marketValue', 'Market value is required').isNumeric()
  ],
  createBook
);

// Update book - only ADMIN and EDITOR can update
router.put(
  '/:id',
  authorize('ADMIN', 'EDITOR'),
  [
    check('title', 'Title is required if provided').optional().notEmpty(),
    check('author', 'Author is required if provided').optional().notEmpty(),
    check('isbn', 'ISBN is required if provided').optional().notEmpty(),
    check('category', 'Category is required if provided').optional().notEmpty(),
    check('publicationDate', 'Publication date is required if provided').optional().notEmpty(),
    check('status', 'Status is required if provided').optional().notEmpty(),
    check('bookType', 'Book type is required if provided').optional().notEmpty(),
    check('condition', 'Condition is required if provided').optional().notEmpty(),
    check('purchasePrice', 'Purchase price must be a number').optional().isNumeric(),
    check('marketValue', 'Market value must be a number').optional().isNumeric()
  ],
  updateBook
);

// Delete book - only ADMIN and EDITOR can delete
router.delete('/:id', authorize('ADMIN', 'EDITOR'), deleteBook);

module.exports = router;