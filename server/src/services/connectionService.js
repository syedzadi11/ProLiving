const { ConnectionRequest, Listing, User } = require('../models');
const AppError = require('../errors/AppError');
const httpStatus = require('../utils/httpStatus');

const sendRequest = async (userId, listingId, message) => {
  const listing = await Listing.findByPk(listingId);
  if (!listing) {
    throw new AppError('Listing not found', httpStatus.NOT_FOUND);
  }

  if (listing.user_id === userId) {
    throw new AppError('You cannot send a request to your own listing', httpStatus.BAD_REQUEST);
  }

  const existing = await ConnectionRequest.findOne({
    where: { listing_id: listingId, user_id: userId }
  });
  if (existing) {
    throw new AppError('You have already sent a request for this listing', httpStatus.CONFLICT);
  }

  return ConnectionRequest.create({
    listing_id: listingId,
    user_id: userId,
    message,
    status: 'Pending'
  });
};


const getMyRequests = async (userId) => {
  const requests = await ConnectionRequest.findAll({
    where: { user_id: userId },
    include: [{
      model: Listing,
      include: [{ model: User, attributes: ['user_id', 'full_name', 'phone'] }]
    }]
  });

  // Hide phone unless the request is Accepted
  return requests.map((r) => {
    const plain = r.toJSON();
    if (plain.status !== 'Accepted' && plain.Listing?.User) {
      delete plain.Listing.User.phone;
    }
    return plain;
  });
};

const getIncomingRequests = async (ownerId) => {
  return ConnectionRequest.findAll({
    include: [
      { model: Listing, where: { user_id: ownerId } },
      { model: User, attributes: ['user_id', 'full_name', 'email'] }
    ]
  });
};

const decideRequest = async (requestId, ownerId, decision) => {
  const request = await ConnectionRequest.findByPk(requestId, {
    include: [{ model: Listing }]
  });

  if (!request) {
    throw new AppError('Request not found', httpStatus.NOT_FOUND);
  }

  if (request.Listing.user_id !== ownerId) {
    throw new AppError('You are not allowed to modify this request', httpStatus.FORBIDDEN);
  }

  if (request.status !== 'Pending') {
    throw new AppError('This request has already been processed', httpStatus.BAD_REQUEST);
  }

  request.status = decision;
  await request.save();

  if (decision === 'Accepted') {
    const owner = await User.findByPk(ownerId, { attributes: ['phone'] });
    return { request, ownerPhone: owner.phone };
  }

  return { request };
};

const withdrawRequest = async (requestId, userId) => {
  const request = await ConnectionRequest.findByPk(requestId);
  if (!request) {
    throw new AppError('Request not found', httpStatus.NOT_FOUND);
  }
  if (request.user_id !== userId) {
    throw new AppError('You are not allowed to withdraw this request', httpStatus.FORBIDDEN);
  }
  if (request.status !== 'Pending') {
    throw new AppError('Only pending requests can be withdrawn', httpStatus.BAD_REQUEST);
  }

  await request.destroy();
};

module.exports = { sendRequest, getMyRequests, getIncomingRequests, decideRequest, withdrawRequest };