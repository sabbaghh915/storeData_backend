const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/worddata';

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Check if the admin user already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash the password before saving
        //const hashedPassword = await bcrypt.hash('admin1234', 10);
        //console.log('Hashed Password:', hashedPassword);

        const admin = new Admin({
            username: 'admin',
            password: 'admin1234', // Save the hashed password
        });

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();
