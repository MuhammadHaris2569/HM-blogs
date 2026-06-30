require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Blog = require('../models/Blog');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany(), Category.deleteMany(), Tag.deleteMany(), Blog.deleteMany()]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@hmblogs.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true,
    bio: 'Founder and editor at HM Blogs.',
  });

  const author = await User.create({
    name: 'Sarah Mitchell',
    email: 'sarah@hmblogs.com',
    password: 'Author@123',
    role: 'author',
    isVerified: true,
    bio: 'Tech writer covering web development and design.',
  });

  console.log('Creating categories...');
  const categories = await Category.insertMany([
    { name: 'Technology', description: 'Latest in tech and software', color: '#2563EB' },
    { name: 'Design', description: 'UI/UX and product design', color: '#14B8A6' },
    { name: 'Lifestyle', description: 'Productivity and personal growth', color: '#F59E0B' },
    { name: 'Business', description: 'Startups and entrepreneurship', color: '#22C55E' },
  ]);

  console.log('Creating tags...');
  const tags = await Tag.insertMany([
    { name: 'React' },
    { name: 'JavaScript' },
    { name: 'Node.js' },
    { name: 'MongoDB' },
    { name: 'Productivity' },
    { name: 'Startups' },
  ]);

  console.log('Creating blogs...');
  const sampleContent = `<h2>Introduction</h2><p>This is a sample blog post created for HM Blogs to demonstrate the platform's capabilities including rich text content, headings, and formatted paragraphs.</p><h2>Main Content</h2><p>HM Blogs is built with the MERN stack, offering a fast, modern, and elegant reading experience. This seed content can be replaced with real articles once the platform is live.</p><blockquote>Great content deserves a great platform.</blockquote><h2>Conclusion</h2><p>Thank you for reading this sample post. Explore more articles on HM Blogs.</p>`;

  const blogsData = [
    {
      title: 'Getting Started with React 19 and Vite',
      excerpt: 'A complete guide to building modern web applications with the latest React and Vite tooling.',
      content: sampleContent,
      category: categories[0]._id,
      tags: [tags[0]._id, tags[1]._id],
      coverImage: { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200', publicId: '' },
      author: author._id,
      status: 'published',
      isFeatured: true,
    },
    {
      title: 'Designing Beautiful Dark Mode Interfaces',
      excerpt: 'Learn the principles of designing elegant and accessible dark mode experiences.',
      content: sampleContent,
      category: categories[1]._id,
      tags: [tags[1]._id],
      coverImage: { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200', publicId: '' },
      author: admin._id,
      status: 'published',
      isFeatured: true,
    },
    {
      title: 'Building Scalable APIs with Node.js and Express',
      excerpt: 'Best practices for building production-ready REST APIs using Node.js, Express, and MongoDB.',
      content: sampleContent,
      category: categories[0]._id,
      tags: [tags[2]._id, tags[3]._id],
      coverImage: { url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200', publicId: '' },
      author: author._id,
      status: 'published',
    },
    {
      title: '10 Productivity Habits for Remote Developers',
      excerpt: 'Practical strategies to stay focused, healthy, and productive while working remotely.',
      content: sampleContent,
      category: categories[2]._id,
      tags: [tags[4]._id],
      coverImage: { url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200', publicId: '' },
      author: admin._id,
      status: 'published',
    },
    {
      title: 'How to Validate Your Startup Idea in 30 Days',
      excerpt: 'A practical framework for testing and validating your next big idea before writing a line of code.',
      content: sampleContent,
      category: categories[3]._id,
      tags: [tags[5]._id],
      coverImage: { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200', publicId: '' },
      author: author._id,
      status: 'published',
      isFeatured: true,
    },
  ];

  for (const data of blogsData) {
    await Blog.create(data);
  }

  console.log('Seed completed successfully!');
  console.log('Admin login: admin@hmblogs.com / Admin@123');
  console.log('Author login: sarah@hmblogs.com / Author@123');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
