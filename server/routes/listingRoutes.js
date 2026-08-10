const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const listingController = require('../controllers/listingController');

const validate = require('../middlewares/validate');
const { createListingSchema, updateListingSchema } = require('../validators/listingValidator');

// Public routes (anyone can browse/search)
router.get('/', listingController.search);

// Protected routes (must be logged in)
router.post('/', verifyToken, validate(createListingSchema), listingController.create);
router.put('/:id', verifyToken, validate(updateListingSchema), listingController.update);
router.delete('/:id', verifyToken, listingController.remove);
router.patch('/:id/rented', verifyToken, listingController.markRented);
router.patch('/:id/reactivate', verifyToken, listingController.reactivate);

module.exports = router;