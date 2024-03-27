// Basic Lib Import
require('dotenv').config();
const express = require('express');
// Security Middleware Lib Import
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');



// Import routes
const routes = require('./src/routes');

// Database connection (assuming you have a separate file)
const { connectWithDB } = require('./src/config/mongo');

// Error handling middleware
const { handleError } = require('./src/utility/errors.js');

const app = new express();

// Set trust proxy to true
app.set('trust proxy', true);

// Security Middleware Implement
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use('/images', express.static(path.join(__dirname, '/src/uploads')));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

// CORS CONFIGURATIONS
const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:80',
  'http://localhost:40',
  'http://localhost:8080',
  '*',
];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    return callback(null, true);
  },
};
app.use(cors(corsOptions));

// Mongo DB Database Connection
connectWithDB();

// Routing Implement
app.use('/api/v1', routes);
app.use('/health-check', (req, res) => res.status(200).json('Working'));
app.use(handleError);

// Undefined Route Implement
app.use('*', (req, res) => {
  res.status(404).json({ status: 'fail', data: 'Undefined Route' });
});

// Start the server
const server = require('http').createServer(app);
const PORT = process.env.PORT || 8080;

server.listen(PORT, function () {
  console.log('Server running on port => ' + PORT);
});

module.exports = app;
