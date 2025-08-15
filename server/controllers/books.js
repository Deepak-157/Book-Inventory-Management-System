const { validationResult } = require("express-validator");
const Book = require("../models/Book");

// @desc    Get all books with pagination, filtering, and sorting
// @route   GET /api/books
// @access  Private
exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    const query = {};

    // Apply filters if they exist
    if (req.query.bookType) {
      query.bookType = req.query.bookType;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    if (req.query.isFeatured) {
      query.isFeatured = req.query.isFeatured === "true";
    }

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
        { description: searchRegex },
      ];
    }

    // Build sort object
    let sortObj = {};
    if (req.query.sortField) {
      sortObj[req.query.sortField] =
        req.query.sortDirection === "desc" ? -1 : 1;
    } else {
      sortObj = { createdAt: -1 }; // Default sort by most recent
    }

    // Count total documents that match the query
    const total = await Book.countDocuments(query);

    // Fetch books
    const books = await Book.find(query)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .populate("createdBy", "name");

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        books,
        total,
        page,
        totalPages,
      },
    });
  } catch (err) {
    console.error("Error getting books:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Private
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "createdBy",
      "name"
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    console.error("Error getting book:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Fetch book details from ISBN using Gemini API
// @route   POST /api/books/fetch-details
// @access  Private
exports.fetchBookDetails = async (req, res) => {
  try {
      const { isbn } = req.body;
      console.log("Hare Krishna",isbn)

    if (!isbn) {
      return res.status(400).json({
        success: false,
        message: "ISBN is required",
      });
    }

    // Make request to Google Generative AI API (Gemini)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    const prompt = `
      I need detailed information about a book with ISBN: ${isbn}.
      Please provide the following details in JSON format:
      {
        "title": "Book title",
        "author": "Author name",
        "publicationDate": "YYYY-MM-DD",
        "publisher": "Publisher name",
        "category": "Book category (Fiction, Non-Fiction, Biography, Science, History, Programming, Self-Help, Business, Other)",
        "description": "Brief description of the book"
      }
      Ensure the date is in YYYY-MM-DD format and the category matches one of the specified options exactly.
    `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    // Extract the JSON from the Gemini response
    let bookData = {};
    const responseText = response.data.candidates[0].content.parts[0].text;

    // Extract JSON object from response (which might contain markdown code blocks)
    const jsonMatch = responseText.match(
      /```json\n([\s\S]*?)\n```|({[\s\S]*})/
    );
    if (jsonMatch) {
      try {
        bookData = JSON.parse(jsonMatch[1] || jsonMatch[2]);
      } catch (parseError) {
        console.error("Error parsing JSON from Gemini response:", parseError);
      }
    }

    res.status(200).json({
      success: true,
      data: bookData,
    });
  } catch (err) {
    console.error("Error fetching book details:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching book details",
    });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
exports.createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Add the current user as the creator
    req.body.createdBy = req.user.id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (err) {
    console.error("Error creating book:", err);

    // Handle duplicate key error (like duplicate ISBN)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A book with this ISBN already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
exports.updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if user is admin or the creator of the book
    if (
      req.user.role !== "ADMIN" &&
      book.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this book",
      });
    }

    // Update timestamps
    req.body.updatedAt = Date.now();

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run model validators
    });

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    console.error("Error updating book:", err);

    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A book with this ISBN already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if user is admin or the creator of the book
    if (
      req.user.role !== "ADMIN" &&
      book.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this book",
      });
    }

    await book.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/books/stats
// @access  Private
exports.getBookStats = async (req, res) => {
  try {
    // Get total count
    const total = await Book.countDocuments();

    // Get counts by book type
    const newBooks = await Book.countDocuments({ bookType: "New" });
    const oldBooks = await Book.countDocuments({ bookType: "Old" });

    // Get counts by category
    const categoryStats = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get counts by status
    const statusStats = await Book.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Convert arrays to objects for easier consumption on frontend
    const byCategory = {};
    categoryStats.forEach((item) => {
      byCategory[item._id] = item.count;
    });

    const byStatus = {};
    statusStats.forEach((item) => {
      byStatus[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        newBooks,
        oldBooks,
        byCategory,
        byStatus,
      },
    });
  } catch (err) {
    console.error("Error getting book stats:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
