const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const { getUsers, getUserById, updateUser, deleteUser, toggleUserStatus } = require('../controllers/userController');

router.use(auth);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle', toggleUserStatus);

module.exports = router;
