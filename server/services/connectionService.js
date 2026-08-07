const { ConnectionRequest, Listing, User } = require('../models');

const sendRequest = async (userId, listingId, message) => {
  const listing = await Listing.findByPk(listingId);
  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    throw error;
  }

  // Rule 1: Anti-self-matching
  if (listing.user_id === userId) {
    const error = new Error('You cannot send a request to your own listing');
    error.statusCode = 400;
    throw error;
  }

  // Rule 2: Spam mitigation (also enforced by DB unique index)
  const existing = await ConnectionRequest.findOne({
    where: { listing_id: listingId, user_id: userId }
  });
  if (existing) {
    const error = new Error('You have already sent a request for this listing');
    error.statusCode = 409;
    throw error;
  }

  const request = await ConnectionRequest.create({
    listing_id: listingId,
    user_id: userId,
    message,
    status: 'Pending'
  });

  return request;
};

const getMyRequests = async (userId) => {
  return ConnectionRequest.findAll({
    where: { user_id: userId },
    include: [{ model: Listing }]
  });
};

const getIncomingRequests = async (ownerId) => {
  return ConnectionRequest.findAll({
    include: [{
      model: Listing,
      where: { user_id: ownerId }
    }, {
      model: User,
      attributes: ['user_id', 'full_name', 'email']
    }]
  });
};

const decideRequest = async (requestId, ownerId, decision) => {
  const request = await ConnectionRequest.findByPk(requestId, {
    include: [{ model: Listing }]
  });

  if (!request) {
    const error = new Error('Request not found');
    error.statusCode = 404;
    throw error;
  }

  if (request.Listing.user_id !== ownerId) {
    const error = new Error('You are not allowed to modify this request');
    error.statusCode = 403;
    throw error;
  }

  if (request.status !== 'Pending') {
    const error = new Error('This request has already been processed');
    error.statusCode = 400;
    throw error;
  }

  request.status = decision;   // 'Accepted' or 'Rejected'
  await request.save();

  // Rule 3: Only reveal contact info if accepted
  if (decision === 'Accepted') {
    const owner = await User.findByPk(ownerId, { attributes: ['phone'] });
    return { request, ownerPhone: owner.phone };
  }

  return { request };
};

const withdrawRequest = async (requestId, userId) => {
  const request = await ConnectionRequest.findByPk(requestId);
  if (!request) {
    const error = new Error('Request not found');
    error.statusCode = 404;
    throw error;
  }
  if (request.user_id !== userId) {
    const error = new Error('You are not allowed to withdraw this request');
    error.statusCode = 403;
    throw error;
  }
  if (request.status !== 'Pending') {
    const error = new Error('Only pending requests can be withdrawn');
    error.statusCode = 400;
    throw error;
  }

  await request.destroy();
};

module.exports = { sendRequest, getMyRequests, getIncomingRequests, decideRequest, withdrawRequest };