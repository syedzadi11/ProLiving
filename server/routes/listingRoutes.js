const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const listingController = require('../controllers/listingController');

// Public routes (anyone can browse/search)
router.get('/', listingController.search);

// Protected routes (must be logged in)
router.post('/', verifyToken, listingController.create);
router.put('/:id', verifyToken, listingController.update);
router.delete('/:id', verifyToken, listingController.remove);
router.patch('/:id/rented', verifyToken, listingController.markRented);
router.patch('/:id/reactivate', verifyToken, listingController.reactivate);

module.exports = router;