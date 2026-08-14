const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const listingRoutes = require('./listing.routes');
const connectionRoutes = require('./connection.routes');

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/connections', connectionRoutes);

module.exports = router;