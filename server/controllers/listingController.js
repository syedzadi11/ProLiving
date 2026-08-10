const listingService = require('../services/listingService');

const create = async (req, res) => {
  try {
    const listing = await listingService.createListing(req.user.user_id, req.body);
    res.status(201).json({ message: 'Listing created', listing });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const search = async (req, res) => {
  try {
    const result = await listingService.searchListings(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const listing = await listingService.getListingById(req.params.id);
    res.status(200).json({ listing });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const myListings = async (req, res) => {
  try {
    const listings = await listingService.getMyListings(req.user.user_id);
    res.status(200).json({ listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const listing = await listingService.updateListing(req.params.id, req.user.user_id, req.body);
    res.status(200).json({ message: 'Listing updated', listing });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await listingService.deleteListing(req.params.id, req.user.user_id);
    res.status(200).json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const markRented = async (req, res) => {
  try {
    const listing = await listingService.markAsRented(req.params.id, req.user.user_id);
    res.status(200).json({ message: 'Listing marked as rented', listing });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const reactivate = async (req, res) => {
  try {
    const listing = await listingService.reactivateListing(req.params.id, req.user.user_id);
    res.status(200).json({ message: 'Listing reactivated', listing });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { create, search, getOne, myListings, update, remove, markRented, reactivate };