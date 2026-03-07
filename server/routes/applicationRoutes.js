const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    applyForInternship, getMyApplications, getAllApplications,
    updateApplicationStatus, checkApplication
} = require('../controllers/applicationController');

// Intern routes
router.post('/apply', auth, upload.single('resume'), applyForInternship);
router.get('/my', auth, getMyApplications);
router.get('/check/:listingId', auth, checkApplication);

// Admin routes
router.get('/', auth, authorize('admin', 'hr'), getAllApplications);
router.patch('/:id/status', auth, authorize('admin', 'hr'), updateApplicationStatus);

module.exports = router;
