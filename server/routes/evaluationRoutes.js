const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const {
    createEvaluation, getEvaluations, getMyEvaluations,
    getEvaluationById, updateEvaluation, deleteEvaluation
} = require('../controllers/evaluationController');

router.use(auth);

router.post('/', authorize('hr'), createEvaluation);
router.get('/', authorize('admin', 'hr'), getEvaluations);
router.get('/my', authorize('intern'), getMyEvaluations);
router.get('/:id', getEvaluationById);
router.put('/:id', authorize('hr'), updateEvaluation);
router.delete('/:id', authorize('admin', 'hr'), deleteEvaluation);

module.exports = router;
