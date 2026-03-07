const InternshipListing = require('../models/InternshipListing');

// Create listing (Admin)
exports.createListing = async (req, res) => {
    try {
        const listing = await InternshipListing.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json({ success: true, listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all listings (Public - active only)
exports.getPublicListings = async (req, res) => {
    try {
        const { search, department, type, page = 1, limit = 12 } = req.query;
        const query = { isActive: true, deadline: { $gte: new Date() } };

        if (department) query.department = department;
        if (type) query.type = type;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await InternshipListing.countDocuments(query);
        const listings = await InternshipListing.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get distinct values for filters
        const departments = await InternshipListing.distinct('department', { isActive: true });

        res.json({
            success: true,
            listings,
            departments,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get listing by ID (Public)
exports.getListingById = async (req, res) => {
    try {
        const listing = await InternshipListing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }
        res.json({ success: true, listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all listings (Admin - includes inactive)
exports.getAdminListings = async (req, res) => {
    try {
        const listings = await InternshipListing.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update listing (Admin)
exports.updateListing = async (req, res) => {
    try {
        const listing = await InternshipListing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!listing) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete listing (Admin)
exports.deleteListing = async (req, res) => {
    try {
        await InternshipListing.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle listing active status (Admin)
exports.toggleListing = async (req, res) => {
    try {
        const listing = await InternshipListing.findById(req.params.id);
        if (!listing) return res.status(404).json({ success: false, message: 'Not found' });
        listing.isActive = !listing.isActive;
        await listing.save();
        res.json({ success: true, listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
