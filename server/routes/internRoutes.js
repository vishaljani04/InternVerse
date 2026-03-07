const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const {
    createIntern, getInterns, getInternById, getMyInternProfile,
    updateIntern, toggleInternStatus, deleteIntern
} = require('../controllers/internController');

router.use(auth);

router.post('/', authorize('admin', 'hr'), createIntern);
router.get('/', authorize('admin', 'hr'), getInterns);
router.get('/me', authorize('intern'), getMyInternProfile);
router.get('/:id', getInternById);
router.put('/:id', authorize('admin', 'hr'), updateIntern);
router.patch('/:id/toggle', authorize('admin', 'hr'), toggleInternStatus);
router.delete('/:id', authorize('admin'), deleteIntern);

module.exports = router;
