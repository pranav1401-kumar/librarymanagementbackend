const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, roleCheck(['LIBRARIAN']), userController.getUsers);
router.put('/:id', auth, roleCheck(['LIBRARIAN']), userController.updateUser);
router.delete('/:id', auth, roleCheck(['LIBRARIAN']), userController.deleteUser);

router.delete('/me', auth, roleCheck(['MEMBER']), userController.deleteOwnAccount);

module.exports = router;