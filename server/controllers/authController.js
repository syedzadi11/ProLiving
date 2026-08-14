const { registerUser, loginUser } = require('../services/authService');
const asyncHandler = require('../middlewares/asyncHandler');
const httpStatus = require('../utils/httpStatus');

const signup = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(httpStatus.CREATED).json({ message: 'User registered successfully', user });
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.status(httpStatus.OK).json({ message: 'Login successful', ...result });
});

module.exports = { signup, login };