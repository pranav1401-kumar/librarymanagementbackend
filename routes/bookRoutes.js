const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck(['LIBRARIAN']), bookController.addBook);
router.get('/', auth, bookController.getBooks);
router.put('/:id', auth, roleCheck(['LIBRARIAN']), bookController.updateBook);
router.delete('/:id', auth, roleCheck(['LIBRARIAN']), bookController.deleteBook);

router.post('/:id/borrow', auth, roleCheck(['MEMBER']), bookController.borrowBook);
router.post('/:id/return', auth, roleCheck(['MEMBER']), bookController.returnBook);
router.get('/history', auth, roleCheck(['MEMBER']), bookController.getBorrowHistory);
module.exports = router;