const asyncHandler = require('express-async-handler');
const Newsletter = require('../models/Newsletter');
const ApiError = require('../utils/ApiError');

const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, 'Email is required');

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.isSubscribed) {
      return res.status(200).json({ success: true, message: 'You are already subscribed' });
    }
    existing.isSubscribed = true;
    await existing.save();
    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
  }

  await Newsletter.create({ email });
  res.status(201).json({ success: true, message: 'Subscribed successfully' });
});

const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await Newsletter.findOneAndUpdate({ email }, { isSubscribed: false });
  res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
});

const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find({ isSubscribed: true }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { subscribers, count: subscribers.length } });
});

module.exports = { subscribe, unsubscribe, getSubscribers };
