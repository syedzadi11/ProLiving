const connectionService = require('../services/connectionService');

const send = async (req, res) => {
  try {
    const request = await connectionService.sendRequest(req.user.user_id, req.body.listing_id, req.body.message);
    res.status(201).json({ message: 'Request sent', request });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const myRequests = async (req, res) => {
  try {
    const requests = await connectionService.getMyRequests(req.user.user_id);
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const incomingRequests = async (req, res) => {
  try {
    const requests = await connectionService.getIncomingRequests(req.user.user_id);
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const decide = async (req, res) => {
  try {
    const result = await connectionService.decideRequest(req.params.id, req.user.user_id, req.body.decision);
    res.status(200).json({ message: `Request ${req.body.decision.toLowerCase()}`, ...result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const withdraw = async (req, res) => {
  try {
    await connectionService.withdrawRequest(req.params.id, req.user.user_id);
    res.status(200).json({ message: 'Request withdrawn' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { send, myRequests, incomingRequests, decide, withdraw };