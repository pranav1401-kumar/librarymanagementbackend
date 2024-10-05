const mongoose = require('mongoose');

const borrowHistorySchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowDate: { type: Date, required: true },
  returnDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('BorrowHistory', borrowHistorySchema);