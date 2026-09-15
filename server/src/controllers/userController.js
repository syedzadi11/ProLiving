const userService = require('../services/userService');
const asyncHandler = require('../middlewares/asyncHandler');
const httpStatus = require('../enums/http-status.enum');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.user_id);
  res.status(httpStatus.OK).json({ user });
});

const updateMe = asyncHandler(async (req, res) => {
  const profilePhotoUrl = req.file ? `/uploads/users/${req.file.filename}` : null;
  const user = await userService.updateProfile(req.user.user_id, req.body, profilePhotoUrl);
  res.status(httpStatus.OK).json({ message: 'Profile updated', user });
});

module.exports = { getMe, updateMe };