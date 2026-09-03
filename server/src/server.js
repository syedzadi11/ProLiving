require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Allow requests from the Next.js frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware to parse JSON request bodies
app.use(express.json());

const routes = require('./routes/index');
app.use('/api', routes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Test route
app.get('/', (req, res) => {
  res.send('ProLiving API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});