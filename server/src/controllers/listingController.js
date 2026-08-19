const listingService = require('../services/listingService');
const asyncHandler = require('../middlewares/asyncHandler');
const httpStatus = require('../utils/httpStatus');

const create = asyncHandler(async (req, res) => {
  const listing = await listingService.createListing(req.user.user_id, req.body);
  res.status(httpStatus.CREATED).json({ message: 'Listing created', listing });
});

const search = asyncHandler(async (req, res) => {
  const result = await listingService.searchListings(req.query);
  res.status(httpStatus.OK).json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const listing = await listingService.getListingById(req.params.id);
  res.status(httpStatus.OK).json({ listing });
});

const myListings = asyncHandler(async (req, res) => {
  const listings = await listingService.getMyListings(req.user.user_id);
  res.status(httpStatus.OK).json({ listings });
});

const update = asyncHandler(async (req, res) => {
  const listing = await listingService.updateListing(req.params.id, req.user.user_id, req.body);
  res.status(httpStatus.OK).json({ message: 'Listing updated', listing });
});

const remove = asyncHandler(async (req, res) => {
  await listingService.deleteListing(req.params.id, req.user.user_id);
  res.status(httpStatus.OK).json({ message: 'Listing deleted' });
});

const markRented = asyncHandler(async (req, res) => {
  const listing = await listingService.markAsRented(req.params.id, req.user.user_id);
  res.status(httpStatus.OK).json({ message: 'Listing marked as rented', listing });
});

const reactivate = asyncHandler(async (req, res) => {
  const listing = await listingService.reactivateListing(req.params.id, req.user.user_id);
  res.status(httpStatus.OK).json({ message: 'Listing reactivated', listing });
});

module.exports = { create, search, getOne, myListings, update, remove, markRented, reactivate };