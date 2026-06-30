const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, getSubscribers } = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/', protect, authorize('admin'), getSubscribers);

module.exports = router;
