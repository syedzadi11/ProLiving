// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middlewares/authMiddleware');
// const userController = require('../controllers/userController');
// const validate = require('../middlewares/validate');
// const userValidator = require('../validators/userValidator');
// const uploadProfilePhoto = require('../middlewares/uploadProfilePhoto');

// router.get('/me', verifyToken, userController.getMe);

// router.put(
//   '/me',
//   verifyToken,
//   uploadProfilePhoto.single('profile_photo'),
//   validate(userValidator.updateProfileSchema),
//   userController.updateMe
// );

// module.exports = router;








const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const userValidator = require('../validators/userValidator');
const uploadProfilePhoto = require('../middlewares/uploadProfilePhoto');

router.get('/me', verifyToken, userController.getMe);

router.put(
  '/me',
  verifyToken,
  uploadProfilePhoto.single('profile_photo'),
  validate(userValidator.updateProfileSchema),
  userController.updateMe
);

router.put(
  '/me/password',
  verifyToken,
  validate(userValidator.changePasswordSchema),
  userController.changeMyPassword
);

router.delete('/me', verifyToken, userController.deleteMe);

module.exports = router;