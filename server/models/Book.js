const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a book title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  author: {
    type: String,
    required: [true, "Please provide an author name"],
    trim: true,
    maxlength: [100, "Author name cannot be more than 100 characters"],
  },
  isbn: {
    type: String,
    required: [true, "Please provide an ISBN"],
    trim: true,
    unique: true,
    maxlength: [20, "ISBN cannot be more than 20 characters"],
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: [
      "Fiction",
      "Non-Fiction",
      "Biography",
      "Science",
      "History",
      "Programming",
      "Self-Help",
      "Business",
      "Other",
    ],
  },
  publicationDate: {
    type: Date,
    required: [true, "Please provide a publication date"],
  },
  status: {
    type: String,
    required: [true, "Please select a status"],
    enum: ["Available", "Borrowed", "Lost", "Damaged"],
    default: "Available",
  },
  bookType: {
    type: String,
    required: [true, "Please specify if this is a new or old book"],
    enum: ["New", "Old"],
  },
  condition: {
    type: String,
    required: [true, "Please select the book condition"],
    enum: ["Excellent", "Good", "Fair", "Poor"],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  purchasePrice: {
    type: Number,
    required: [true, "Please provide the purchase price"],
    min: [0, "Purchase price cannot be negative"],
  },
  marketValue: {
    type: Number,
    required: [true, "Please provide the current market value"],
    min: [0, "Market value cannot be negative"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a virtual for the value change percentage (calculated field)
BookSchema.virtual("valueChangePercentage").get(function () {
  if (this.purchasePrice === 0) {
    return 0;
  }
  return Number(
    (
      ((this.marketValue - this.purchasePrice) / this.purchasePrice) *
      100
    ).toFixed(2)
  );
});

// Always include virtuals when converting to JSON
BookSchema.set("toJSON", { virtuals: true });
BookSchema.set("toObject", { virtuals: true });

// Update the updatedAt timestamp before saving
BookSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Book", BookSchema);
