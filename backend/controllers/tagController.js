const asyncHandler = require('express-async-handler');
const Tag = require('../models/Tag');
const ApiError = require('../utils/ApiError');

const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });
  res.status(200).json({ success: true, data: { tags } });
});

const createTag = asyncHandler(async (req, res) => {
  const tag = await Tag.create({ name: req.body.name });
  res.status(201).json({ success: true, message: 'Tag created', data: { tag } });
});

const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findByIdAndDelete(req.params.id);
  if (!tag) throw new ApiError(404, 'Tag not found');
  res.status(200).json({ success: true, message: 'Tag deleted' });
});

module.exports = { getTags, createTag, deleteTag };
