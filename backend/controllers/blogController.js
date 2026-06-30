const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');
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

// @desc    Get all published blogs (with search/filter/sort/pagination)
// @route   GET /api/blogs
const getBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  const filter = { status: 'published' };

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.tag) {
    filter.tags = req.query.tag;
  }
  if (req.query.author) {
    filter.author = req.query.author;
  }
  if (req.query.featured === 'true') {
    filter.isFeatured = true;
  }

  let sort = { publishedAt: -1 };
  if (req.query.sort === 'popular') sort = { views: -1 };
  if (req.query.sort === 'liked') sort = { likesCount: -1 };
  if (req.query.sort === 'oldest') sort = { publishedAt: 1 };

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    },
  });
});

// @desc    Get a single blog by slug
// @route   GET /api/blogs/:slug
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('author', 'name avatar bio socialLinks')
    .populate('category', 'name slug color')
    .populate('tags', 'name slug');

  if (!blog) {
    throw new ApiError(404, 'Blog post not found');
  }

  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { readingHistory: { $each: [{ blog: blog._id }], $position: 0, $slice: 50 } },
    });
  }

  const relatedBlogs = await Blog.find({
    _id: { $ne: blog._id },
    status: 'published',
    category: blog.category._id,
  })
    .limit(3)
    .select('title slug excerpt coverImage readingTime publishedAt')
    .populate('author', 'name avatar');

  res.status(200).json({ success: true, data: { blog, relatedBlogs } });
});

// @desc    Create a new blog
// @route   POST /api/blogs
const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, tags, status, isFeatured, metaTitle, metaDescription } = req.body;

  if (!req.file && !req.body.coverImageUrl) {
    throw new ApiError(400, 'A cover image is required');
  }

  let coverImage;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'hm-blogs/covers');
    coverImage = { url: result.secure_url, publicId: result.public_id };
  } else {
    coverImage = { url: req.body.coverImageUrl, publicId: '' };
  }

  const blog = await Blog.create({
    title,
    excerpt,
    content,
    category,
    tags: tags ? JSON.parse(tags) : [],
    status: status || 'draft',
    isFeatured: isFeatured === 'true' || isFeatured === true,
    metaTitle,
    metaDescription,
    coverImage,
    author: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Blog created successfully', data: { blog } });
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  const isOwner = blog.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to edit this blog');
  }

  const fields = ['title', 'excerpt', 'content', 'category', 'status', 'metaTitle', 'metaDescription'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) blog[field] = req.body[field];
  });

  if (req.body.tags) blog.tags = JSON.parse(req.body.tags);
  if (req.body.isFeatured !== undefined) blog.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;

  if (req.file) {
    if (blog.coverImage.publicId) {
      await cloudinary.uploader.destroy(blog.coverImage.publicId).catch(() => {});
    }
    const result = await uploadToCloudinary(req.file.buffer, 'hm-blogs/covers');
    blog.coverImage = { url: result.secure_url, publicId: result.public_id };
  }

  await blog.save();

  res.status(200).json({ success: true, message: 'Blog updated successfully', data: { blog } });
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  const isOwner = blog.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to delete this blog');
  }

  if (blog.coverImage.publicId) {
    await cloudinary.uploader.destroy(blog.coverImage.publicId).catch(() => {});
  }

  await Comment.deleteMany({ blog: blog._id });
  await blog.deleteOne();

  res.status(200).json({ success: true, message: 'Blog deleted successfully' });
});

// @desc    Toggle like on a blog
// @route   POST /api/blogs/:id/like
const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  const userId = req.user._id.toString();
  const hasLiked = blog.likes.some((id) => id.toString() === userId);

  if (hasLiked) {
    blog.likes = blog.likes.filter((id) => id.toString() !== userId);
  } else {
    blog.likes.push(req.user._id);
  }
  blog.likesCount = blog.likes.length;
  await blog.save();

  res.status(200).json({
    success: true,
    data: { liked: !hasLiked, likesCount: blog.likesCount },
  });
});

// @desc    Toggle bookmark on a blog
// @route   POST /api/blogs/:id/bookmark
const toggleBookmark = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  const user = await User.findById(req.user._id);
  const hasBookmarked = user.bookmarks.some((id) => id.toString() === blog._id.toString());

  if (hasBookmarked) {
    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== blog._id.toString());
  } else {
    user.bookmarks.push(blog._id);
  }
  await user.save();

  res.status(200).json({ success: true, data: { bookmarked: !hasBookmarked } });
});

// @desc    Get trending blogs
// @route   GET /api/blogs/trending
const getTrendingBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: 'published' })
    .sort({ views: -1, likesCount: -1 })
    .limit(6)
    .select('title slug excerpt coverImage readingTime views publishedAt')
    .populate('author', 'name avatar');

  res.status(200).json({ success: true, data: { blogs } });
});

// @desc    Get blogs belonging to the logged-in user (includes drafts)
// @route   GET /api/blogs/me/all
const getMyBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { author: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { blogs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
});

// @desc    Get all blogs for admin (any status, any author)
// @route   GET /api/blogs/admin/all
const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate('author', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { blogs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
});

module.exports = {
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
};
