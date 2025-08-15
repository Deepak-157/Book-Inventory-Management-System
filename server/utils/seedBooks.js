const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/Book');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedBooks();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed sample books
const seedBooks = async () => {
  try {
    // First check if we already have books
    const bookCount = await Book.countDocuments();
    
    if (bookCount > 0) {
      console.log(`${bookCount} books already exist in the database.`);
      process.exit(0);
    }

    // Get the admin user to set as creator
    const admin = await User.findOne({ username: 'DeepakGoyal' });
    
    if (!admin) {
      console.error('Admin user not found. Please run seedAdmin.js first.');
      process.exit(1);
    }

    // Sample book data
    const books = [
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        category: 'Fiction',
        publicationDate: '1960-07-11',
        status: 'Available',
        bookType: 'Old',
        condition: 'Good',
        isFeatured: true,
        purchasePrice: 10,
        marketValue: 25,
        description: 'Classic novel set in the American South during the Great Depression',
        createdBy: admin._id
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        category: 'Fiction',
        publicationDate: '1925-04-10',
        status: 'Available',
        bookType: 'Old',
        condition: 'Fair',
        isFeatured: false,
        purchasePrice: 8,
        marketValue: 15,
        description: 'A portrait of the Jazz Age in all of its decadence and excess',
        createdBy: admin._id
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9780735211292',
        category: 'Self-Help',
        publicationDate: '2018-10-16',
        status: 'Borrowed',
        bookType: 'New',
        condition: 'Excellent',
        isFeatured: true,
        purchasePrice: 20,
        marketValue: 18,
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
        createdBy: admin._id
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '9780062316097',
        category: 'History',
        publicationDate: '2014-02-10',
        status: 'Available',
        bookType: 'New',
        condition: 'Good',
        isFeatured: true,
        purchasePrice: 22,
        marketValue: 24,
        description: 'A sweeping history of humankind from the Stone Age to the 21st century',
        createdBy: admin._id
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        category: 'Programming',
        publicationDate: '2008-08-01',
        status: 'Available',
        bookType: 'New',
        condition: 'Excellent',
        isFeatured: false,
        purchasePrice: 35,
        marketValue: 40,
        description: 'A handbook of agile software craftsmanship',
        createdBy: admin._id
      },
      {
        title: 'The Innovators',
        author: 'Walter Isaacson',
        isbn: '9781476708690',
        category: 'Biography',
        publicationDate: '2014-10-07',
        status: 'Available',
        bookType: 'New',
        condition: 'Good',
        isFeatured: false,
        purchasePrice: 30,
        marketValue: 27,
        description: 'How a Group of Hackers, Geniuses, and Geeks Created the Digital Revolution',
        createdBy: admin._id
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '9780374533557',
        category: 'Science',
        publicationDate: '2011-10-25',
        status: 'Borrowed',
        bookType: 'New',
        condition: 'Good',
        isFeatured: true,
        purchasePrice: 25,
        marketValue: 22,
        description: 'Engaging the reader in a lively conversation about how we think',
        createdBy: admin._id
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '9780316769488',
        category: 'Fiction',
        publicationDate: '1951-07-16',
        status: 'Damaged',
        bookType: 'Old',
        condition: 'Poor',
        isFeatured: false,
        purchasePrice: 5,
        marketValue: 10,
        description: 'The classic coming-of-age story that has inspired generations',
        createdBy: admin._id
      }
    ];

    await Book.insertMany(books);
    console.log(`${books.length} books have been added to the database.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding books:', err);
    process.exit(1);
  }
};