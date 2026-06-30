const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  changePassword,
  getBookmarks,
  getReadingHistory,
  toggleFollow,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/bookmarks', protect, getBookmarks);
router.get('/history', protect, getReadingHistory);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', getUserProfile);
router.post('/:id/follow', protect, toggleFollow);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
