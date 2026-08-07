const { Listing } = require('../models');
const { Op } = require('sequelize');

const createListing = async (userId, data) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);   // 30 days from now

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
    expiry_date: { [Op.gt]: new Date() }   // hide expired listings
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

const updateListing = async (listingId, userId, data) => {
  const listing = await Listing.findByPk(listingId);
  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    throw error;
  }
  if (listing.user_id !== userId) {
    const error = new Error('You are not allowed to edit this listing');
    error.statusCode = 403;
    throw error;
  }

  await listing.update(data);
  return listing;
};

const deleteListing = async (listingId, userId) => {
  const listing = await Listing.findByPk(listingId);
  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    throw error;
  }
  if (listing.user_id !== userId) {
    const error = new Error('You are not allowed to delete this listing');
    error.statusCode = 403;
    throw error;
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
  updateListing,
  deleteListing,
  markAsRented,
  reactivateListing
};