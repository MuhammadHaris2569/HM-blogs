const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Blog.countDocuments({ category: cat._id, status: 'published' });
      return { ...cat.toObject(), blogCount: count };
    })
  );

  res.status(200).json({ success: true, data: { categories: withCounts } });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json({ success: true, data: { category } });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, message: 'Category created', data: { category } });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json({ success: true, message: 'Category updated', data: { category } });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Blog.countDocuments({ category: req.params.id });
  if (inUse > 0) {
    throw new ApiError(400, 'Cannot delete category that is in use by existing blogs');
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json({ success: true, message: 'Category deleted' });
});

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
