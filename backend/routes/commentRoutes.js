const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getAllCommentsAdmin,
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, commentRules } = require('../validators/validators');

router.get('/admin/all', protect, authorize('admin'), getAllCommentsAdmin);
router.get('/:blogId', getComments);
router.post('/:blogId', protect, commentRules, validate, createComment);
router.put('/:id', protect, commentRules, validate, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleCommentLike);

module.exports = router;
