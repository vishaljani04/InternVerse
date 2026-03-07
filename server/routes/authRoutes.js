const router = require('express').Router();
const { register, login, getProfile, updateProfile, changePassword, deleteAccount, registerValidation, loginValidation } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.delete('/account', auth, deleteAccount);

module.exports = router;
