const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  toggleBookmark,
  getTrendingBlogs,
  getMyBlogs,
  getAllBlogsAdmin,
} = require('../controllers/blogController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate, blogRules } = require('../validators/validators');

router.get('/', getBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/me/all', protect, getMyBlogs);
router.get('/admin/all', protect, authorize('admin'), getAllBlogsAdmin);
router.get('/:slug', optionalAuth, getBlogBySlug);

router.post('/', protect, upload.single('coverImage'), blogRules, validate, createBlog);
router.put('/:id', protect, upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, authorize('author', 'admin'), deleteBlog);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
