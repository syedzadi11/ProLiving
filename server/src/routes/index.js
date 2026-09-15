
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const listingRoutes = require('./listing.routes');
const connectionRoutes = require('./connection.routes');
const userRoutes = require('./user.routes');

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/connections', connectionRoutes);
router.use('/users', userRoutes);

module.exports = router;