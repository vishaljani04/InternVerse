const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin.email);
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@internverse.com',
            password: 'admin123',
            role: 'admin',
            department: 'Management',
            isActive: true
        });

        const hr = await User.create({
            name: 'HR Manager',
            email: 'hr@internverse.com',
            password: 'hr123456',
            role: 'hr',
            department: 'Human Resources',
            isActive: true
        });

        console.log('✅ Seed data created:');
        console.log(`   Admin: ${admin.email} / admin123`);
        console.log(`   HR: ${hr.email} / hr123456`);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedAdmin();
