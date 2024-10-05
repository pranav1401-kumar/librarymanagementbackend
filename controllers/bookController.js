const Book = require('../models/Book');
const User = require('../models/User');
const BorrowHistory = require('../models/BorrowHistory');

exports.addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

exports.borrowBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      if (book.status === 'BORROWED') return res.status(400).json({ message: 'Book is already borrowed' });
      
      book.status = 'BORROWED';
      book.borrower = req.userData.userId;
      await book.save();
  
      const borrowHistory = new BorrowHistory({
        book: book._id,
        user: req.userData.userId,
        borrowDate: new Date()
      });
      await borrowHistory.save();
  
      res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
      res.status(500).json({ message: 'Error borrowing book', error: error.message });
    }
  };
  
  exports.returnBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      if (book.status === 'AVAILABLE') return res.status(400).json({ message: 'Book is already available' });
      if (book.borrower.toString() !== req.userData.userId) return res.status(403).json({ message: 'You did not borrow this book' });
      
      book.status = 'AVAILABLE';
      book.borrower = null;
      await book.save();
  
      const borrowHistory = await BorrowHistory.findOne({ book: book._id, user: req.userData.userId, returnDate: null });
      if (borrowHistory) {
        borrowHistory.returnDate = new Date();
        await borrowHistory.save();
      }
  
      res.json({ message: 'Book returned successfully', book });
    } catch (error) {
      res.status(500).json({ message: 'Error returning book', error: error.message });
    }
  };
  
  exports.getBorrowHistory = async (req, res) => {
    try {
      const history = await BorrowHistory.find({ user: req.userData.userId }).populate('book');
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching borrow history', error: error.message });
    }
  };