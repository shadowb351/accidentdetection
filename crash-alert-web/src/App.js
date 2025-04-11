// In your main server file (app.js or server.js)
const express = require('express');
const mongoose = require('mongoose');
const accidentRoutes = require('./routes/accidentRoutes');
const { countdownEmitter } = require('./services/countdownService');
const AlertService = require('./services/alertService');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/accident-detection', accidentRoutes);

// Handle countdown expiration
countdownEmitter.on('countdownExpired', async ({ userId }) => {
    console.log(`Countdown expired for user ${userId}, triggering emergency alert`);
    // Additional logic can be added here
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});