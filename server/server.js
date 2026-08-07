require('dotenv').config();
const express = require('express');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const listingRoutes = require('./routes/listingRoutes');
app.use('/api/listings', listingRoutes);
const connectionRoutes = require('./routes/connectionRoutes');
app.use('/api/connections', connectionRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('ProLiving API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});