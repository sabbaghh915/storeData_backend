const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import the Admin model

const router = express.Router();

// Route for admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login request received:', { username, password });

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        console.log('Stored Hashed Password:', admin.password);
        console.log('Plaintext Password:', password);

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token, admin: { id: admin._id, username: admin.username } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login.' });
    }
});




// Export the router to be used in the main app
module.exports = router;