const { registerUser, loginUser } = require('../services/authService');

const signup = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { signup, login };