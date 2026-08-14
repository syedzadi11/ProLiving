const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const httpStatus = require('../utils/httpStatus');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

const registerUser = async ({ full_name, email, password, phone, city }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', httpStatus.CONFLICT);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    full_name,
    email,
    password: hashedPassword,
    phone,
    city
  });

  const { password: _, ...userWithoutPassword } = newUser.toJSON();
  return userWithoutPassword;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  const token = jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user.toJSON();
  return { user: userWithoutPassword, token };
};

module.exports = { registerUser, loginUser };