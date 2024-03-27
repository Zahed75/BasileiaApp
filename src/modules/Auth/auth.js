const express = require('express');
const router = express.Router();
const passport = require('passport'); // Import Passport

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // Initiate Google authentication

// ... other auth routes (e.g., logout, refresh token)

module.exports = router;
