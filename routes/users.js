// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// GET /users - Fetch all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json({ users }); // Return the users in the response
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
