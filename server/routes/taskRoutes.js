const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createTask, getTasks, getMyTasks, getTaskById,
    updateTask, deleteTask
} = require('../controllers/taskController');

router.use(auth);

router.post('/', authorize('hr'), createTask);
router.get('/', authorize('admin', 'hr'), getTasks);
router.get('/my', authorize('intern'), getMyTasks);
router.get('/:id', getTaskById);
router.put('/:id', authorize('hr'), updateTask);
router.delete('/:id', authorize('hr'), deleteTask);

module.exports = router;
