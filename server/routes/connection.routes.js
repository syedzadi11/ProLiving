const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const connectionController = require('../controllers/connectionController');
const validate = require('../middlewares/validate');
const connectionValidator = require('../validators/connectionValidator');

router.post('/', verifyToken, validate(connectionValidator.sendRequestSchema), connectionController.send);
router.get('/my-requests', verifyToken, connectionController.myRequests);
router.get('/incoming', verifyToken, connectionController.incomingRequests);
router.patch('/:id/decision', verifyToken, validate(connectionValidator.decisionSchema), connectionController.decide);
router.delete('/:id', verifyToken, connectionController.withdraw);

module.exports = router;