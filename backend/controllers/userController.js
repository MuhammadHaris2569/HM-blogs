const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });

// @desc    Get public profile of an author
// @route   GET /api/users/:id
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshTokens');
  if (!user) throw new ApiError(404, 'User not found');

  const blogs = await Blog.find({ author: user._id, status: 'published' })
    .select('title slug excerpt coverImage readingTime views publishedAt')
    .sort({ publishedAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        socialLinks: user.socialLinks,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
      blogs,
    },
  });
});

// @desc    Update own profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  ['name', 'bio'].forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  if (req.body.socialLinks) {
    user.socialLinks = { ...user.socialLinks, ...JSON.parse(req.body.socialLinks) };
  }

  if (req.file) {
    if (user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId).catch(() => {});
    }
    const result = await uploadToCloudinary(req.file.buffer, 'hm-blogs/avatars');
    user.avatar = { url: result.secure_url, publicId: result.public_id };
  }

  await user.save();

  res.status(200).json({ success: true, message: 'Profile updated', data: { user: user.toSafeObject() } });
});

// @desc    Change password
// @route   PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const { currentPassword, newPassword } = req.body;

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  user.refreshTokens = [];
  await user.save();

  res.status(200).json({ success: true, message: 'Password changed successfully. Please log in again.' });
});

// @desc    Get bookmarked blogs
// @route   GET /api/users/bookmarks
const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'bookmarks',
    populate: [
      { path: 'author', select: 'name avatar' },
      { path: 'category', select: 'name slug' },
    ],
  });

  res.status(200).json({ success: true, data: { bookmarks: user.bookmarks } });
});

// @desc    Get reading history
// @route   GET /api/users/history
const getReadingHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'readingHistory.blog',
    populate: { path: 'author', select: 'name avatar' },
  });

  res.status(200).json({ success: true, data: { history: user.readingHistory } });
});

// @desc    Toggle follow author
// @route   POST /api/users/:id/follow
const toggleFollow = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot follow yourself');
  }

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) throw new ApiError(404, 'User not found');

  const currentUser = await User.findById(req.user._id);
  const isFollowing = currentUser.following.some((id) => id.toString() === targetUser._id.toString());

  if (isFollowing) {
    currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUser._id.toString());
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUser._id.toString());
  } else {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
  }

  await currentUser.save();
  await targetUser.save();

  res.status(200).json({ success: true, data: { following: !isFollowing } });
});

// @desc    Get all users (admin)
// @route   GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password -refreshTokens').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
});

// @desc    Update user role (admin)
// @route   PUT /api/users/:id/role
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  ).select('-password -refreshTokens');
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json({ success: true, message: 'User role updated', data: { user } });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json({ success: true, message: 'User deleted' });
});

module.exports = {
  getUserProfile,
  updateProfile,
  changePassword,
  getBookmarks,
  getReadingHistory,
  toggleFollow,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
