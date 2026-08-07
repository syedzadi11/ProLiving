const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const registerUser = async ({ full_name, email, password, phone, city }) => {
  // Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    full_name,
    email,
    password: hashedPassword,
    phone,
    city
  });

  // Never return the password field
  const { password: _, ...userWithoutPassword } = newUser.toJSON();
  return userWithoutPassword;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
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