const connectionService = require('../services/connectionService');
const asyncHandler = require('../middlewares/asyncHandler');
const httpStatus = require('../utils/httpStatus');

const send = asyncHandler(async (req, res) => {
  const request = await connectionService.sendRequest(req.user.user_id, req.body.listing_id, req.body.message);
  res.status(httpStatus.CREATED).json({ message: 'Request sent', request });
});

const myRequests = asyncHandler(async (req, res) => {
  const requests = await connectionService.getMyRequests(req.user.user_id);
  res.status(httpStatus.OK).json({ requests });
});

const incomingRequests = asyncHandler(async (req, res) => {
  const requests = await connectionService.getIncomingRequests(req.user.user_id);
  res.status(httpStatus.OK).json({ requests });
});

const decide = asyncHandler(async (req, res) => {
  const result = await connectionService.decideRequest(req.params.id, req.user.user_id, req.body.decision);
  res.status(httpStatus.OK).json({ message: `Request ${req.body.decision.toLowerCase()}`, ...result });
});

const withdraw = asyncHandler(async (req, res) => {
  await connectionService.withdrawRequest(req.params.id, req.user.user_id);
  res.status(httpStatus.OK).json({ message: 'Request withdrawn' });
});

module.exports = { send, myRequests, incomingRequests, decide, withdraw };