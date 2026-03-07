const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const { getAdminStats, getHRStats, getInternStats } = require('../controllers/dashboardController');

router.use(auth);

router.get('/admin', authorize('admin'), getAdminStats);
router.get('/hr', authorize('admin', 'hr'), getHRStats);
router.get('/intern', authorize('intern'), getInternStats);

module.exports = router;
