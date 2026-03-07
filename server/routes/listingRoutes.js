const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const {
    createListing, getPublicListings, getListingById,
    getAdminListings, updateListing, deleteListing, toggleListing
} = require('../controllers/listingController');

// Public routes (no auth needed)
router.get('/public', getPublicListings);
router.get('/public/:id', getListingById);

// Admin routes
router.post('/', auth, authorize('admin', 'hr'), createListing);
router.get('/admin', auth, authorize('admin', 'hr'), getAdminListings);
router.put('/:id', auth, authorize('admin', 'hr'), updateListing);
router.delete('/:id', auth, authorize('admin'), deleteListing);
router.patch('/:id/toggle', auth, authorize('admin', 'hr'), toggleListing);

module.exports = router;
