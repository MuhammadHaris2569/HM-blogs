const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId, status: 'approved' })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { comments } });
});

// @desc    Create a comment or reply
// @route   POST /api/comments/:blogId
const createComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.blogId);
  if (!blog) throw new ApiError(404, 'Blog not found');

  const comment = await Comment.create({
    blog: blog._id,
    author: req.user._id,
    content: req.body.content,
    parentComment: req.body.parentComment || null,
  });

  blog.commentsCount += 1;
  await blog.save();

  await comment.populate('author', 'name avatar');

  if (blog.author.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: blog.author,
      sender: req.user._id,
      type: req.body.parentComment ? 'reply' : 'comment',
      blog: blog._id,
      comment: comment._id,
      message: `${req.user.name} commented on your post "${blog.title}"`,
    });
  }

  res.status(201).json({ success: true, message: 'Comment posted', data: { comment } });
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, 'Comment not found');

  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to edit this comment');
  }

  comment.content = req.body.content;
  comment.isEdited = true;
  await comment.save();

  res.status(200).json({ success: true, message: 'Comment updated', data: { comment } });
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, 'Comment not found');

  const isOwner = comment.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to delete this comment');
  }

  await Comment.deleteMany({ parentComment: comment._id });
  await comment.deleteOne();
  await Blog.findByIdAndUpdate(comment.blog, { $inc: { commentsCount: -1 } });

  res.status(200).json({ success: true, message: 'Comment deleted' });
});

// @desc    Toggle like on a comment
// @route   POST /api/comments/:id/like
const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, 'Comment not found');

  const userId = req.user._id.toString();
  const hasLiked = comment.likes.some((id) => id.toString() === userId);

  if (hasLiked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
  } else {
    comment.likes.push(req.user._id);
  }
  await comment.save();

  res.status(200).json({ success: true, data: { liked: !hasLiked, likesCount: comment.likes.length } });
});

// @desc    Get all comments (admin)
// @route   GET /api/comments/admin/all
const getAllCommentsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find()
      .populate('author', 'name email')
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: { comments, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
});

module.exports = { getComments, createComment, updateComment, deleteComment, toggleCommentLike, getAllCommentsAdmin };
