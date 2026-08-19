const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const authValidator = require('../validators/authValidator');

router.post('/signup', validate(authValidator.signupSchema), authController.signup);
router.post('/login', validate(authValidator.loginSchema), authController.login);

module.exports = router;