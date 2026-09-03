

const { Listing, User } = require('../models'); 
const { Op } = require('sequelize');
const AppError = require('../errors/AppError');
const httpStatus = require('../utils/httpStatus');

const createListing = async (userId, data) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  const listing = await Listing.create({
    ...data,
    user_id: userId,
    expiry_date: expiryDate,
    status: 'Active'
  });

  return listing;
};

const searchListings = async (filters) => {
  const where = {
    status: 'Active',
    expiry_date: { [Op.gt]: new Date() }
  };

  if (filters.city) where.city = filters.city;
  if (filters.area) where.area = filters.area;
  if (filters.room_type) where.room_type = filters.room_type;

  if (filters.min_price || filters.max_price) {
    where.monthly_rent = {};
    if (filters.min_price) where.monthly_rent[Op.gte] = filters.min_price;
    if (filters.max_price) where.monthly_rent[Op.lte] = filters.max_price;
  }

  const page = parseInt(filters.page) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;

  const sortField = filters.sort === 'price' ? 'monthly_rent' : 'created_at';
  const sortOrder = filters.order === 'desc' ? 'DESC' : 'ASC';

  const { rows, count } = await Listing.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortField, sortOrder]]
  });

  return { listings: rows, total: count, page, totalPages: Math.ceil(count / limit) };
};

const getListingById = async (listingId) => {
  const listing = await Listing.findByPk(listingId, {
    include: [{ model: User, attributes: ['user_id', 'full_name'] }]
  });
  if (!listing) {
    throw new AppError('Listing not found', httpStatus.NOT_FOUND);
  }
  return listing;
};


const getMyListings = async (userId) => {
  return Listing.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });
};

const updateListing = async (listingId, userId, data) => {
  const listing = await Listing.findByPk(listingId);
  if (!listing) {
    throw new AppError('Listing not found', httpStatus.NOT_FOUND);
  }
  if (listing.user_id !== userId) {
    throw new AppError('You are not allowed to edit this listing', httpStatus.FORBIDDEN);
  }

  await listing.update(data);
  return listing;
};

const deleteListing = async (listingId, userId) => {
  const listing = await Listing.findByPk(listingId);
  if (!listing) {
    throw new AppError('Listing not found', httpStatus.NOT_FOUND);
  }
  if (listing.user_id !== userId) {
    throw new AppError('You are not allowed to delete this listing', httpStatus.FORBIDDEN);
  }

  await listing.destroy();
};

const markAsRented = async (listingId, userId) => {
  return updateListing(listingId, userId, { status: 'Rented' });
};

const reactivateListing = async (listingId, userId) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  return updateListing(listingId, userId, { status: 'Active', expiry_date: expiryDate });
};

module.exports = {
  createListing,
  searchListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
  markAsRented,
  reactivateListing
};