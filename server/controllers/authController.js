const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const Intern = require('../models/Intern');

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, department } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        const user = await User.create({ name, email, password, role: role || 'intern', phone, department });
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = generateToken(user._id, user.role);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        let internData = null;

        if (user.role === 'intern') {
            internData = await Intern.findOne({ userId: user._id });
        }

        res.json({ success: true, user, internData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, avatar, department } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, avatar, department },
            { new: true, runValidators: true }
        );
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Validation rules
exports.registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];
