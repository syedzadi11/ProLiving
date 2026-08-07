const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const connectionController = require('../controllers/connectionController');

router.post('/', verifyToken, connectionController.send);
router.get('/my-requests', verifyToken, connectionController.myRequests);
router.get('/incoming', verifyToken, connectionController.incomingRequests);
router.patch('/:id/decision', verifyToken, connectionController.decide);
router.delete('/:id', verifyToken, connectionController.withdraw);

module.exports = router;