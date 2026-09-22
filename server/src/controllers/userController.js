// const userService = require('../services/userService');
// const asyncHandler = require('../middlewares/asyncHandler');
// const httpStatus = require('../enums/http-status.enum');

// const getMe = asyncHandler(async (req, res) => {
//   const user = await userService.getProfile(req.user.user_id);
//   res.status(httpStatus.OK).json({ user });
// });

// const updateMe = asyncHandler(async (req, res) => {
//   const profilePhotoUrl = req.file ? `/uploads/users/${req.file.filename}` : null;
//   const user = await userService.updateProfile(req.user.user_id, req.body, profilePhotoUrl);
//   res.status(httpStatus.OK).json({ message: 'Profile updated', user });
// });

// module.exports = { getMe, updateMe };







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

const changeMyPassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.user_id, req.body.current_password, req.body.new_password);
  res.status(httpStatus.OK).json({ message: 'Password updated successfully' });
});

const deleteMe = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.user.user_id);
  res.status(httpStatus.OK).json({ message: 'Account deleted successfully' });
});

module.exports = { getMe, updateMe, changeMyPassword, deleteMe };