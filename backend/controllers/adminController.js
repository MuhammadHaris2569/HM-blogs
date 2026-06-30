const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Newsletter = require('../models/Newsletter');

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalBlogs, publishedBlogs, draftBlogs, totalUsers, totalComments, totalSubscribers] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: 'published' }),
    Blog.countDocuments({ status: 'draft' }),
    User.countDocuments(),
    Comment.countDocuments(),
    Newsletter.countDocuments({ isSubscribed: true }),
  ]);

  const viewsAgg = await Blog.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]);
  const totalViews = viewsAgg[0]?.totalViews || 0;

  const topBlogs = await Blog.find({ status: 'published' })
    .sort({ views: -1 })
    .limit(5)
    .select('title slug views likesCount commentsCount');

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');

  const blogsPerMonth = await Blog.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: { year: { $year: '$publishedAt' }, month: { $month: '$publishedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: { totalBlogs, publishedBlogs, draftBlogs, totalUsers, totalComments, totalSubscribers, totalViews },
      topBlogs,
      recentUsers,
      blogsPerMonth,
    },
  });
});

module.exports = { getAnalytics };
