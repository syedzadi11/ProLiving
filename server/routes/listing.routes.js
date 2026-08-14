const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const listingController = require('../controllers/listingController');
const validate = require('../middlewares/validate');
const listingValidator = require('../validators/listingValidator');

router.get('/', listingController.search);
router.get('/my-listings', verifyToken, listingController.myListings);
router.get('/:id', listingController.getOne);

router.post('/', verifyToken, validate(listingValidator.createListingSchema), listingController.create);
router.put('/:id', verifyToken, validate(listingValidator.updateListingSchema), listingController.update);
router.delete('/:id', verifyToken, listingController.remove);
router.patch('/:id/rented', verifyToken, listingController.markRented);
router.patch('/:id/reactivate', verifyToken, listingController.reactivate);

module.exports = router;