// models/Admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Admin schema
const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash the password before saving the admin document
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Create the Admin model
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;