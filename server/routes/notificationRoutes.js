const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, notificationController.getMyNotifications);
router.patch('/:id/read', protect, notificationController.markAsRead);
router.patch('/read-all', protect, notificationController.markAllAsRead);

module.exports = router;
