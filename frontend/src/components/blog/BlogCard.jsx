import { Link } from 'react-router-dom';
import { FiClock, FiEye, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatShortDate } from '../../utils/formatters';

const BlogCard = ({ blog, index = 0 }) => {
  if (!blog) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="card group overflow-hidden hover:-translate-y-1.5 hover:shadow-glow"
    >
      <Link to={`/blogs/${blog.slug}`} className="block overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={blog.coverImage?.url}
            alt={blog.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {blog.category?.name && (
            <span
              className="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-xs font-semibold text-white shadow-md"
              style={{ backgroundColor: blog.category.color || '#2563EB' }}
            >
              {blog.category.name}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/blogs/${blog.slug}`}>
          <h3 className="text-lg font-bold leading-snug line-clamp-2 transition-colors group-hover:text-primary">
            {blog.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{blog.excerpt}</p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
          <Link to={`/author/${blog.author?._id}`} className="flex items-center gap-2 min-w-0">
            {blog.author?.avatar?.url ? (
              <img src={blog.author.avatar.url} alt={blog.author.name} className="h-7 w-7 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {blog.author?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">{blog.author?.name}</span>
          </Link>

          <div className="flex shrink-0 items-center gap-2.5 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FiClock className="h-3 w-3" />{blog.readingTime}m</span>
            <span className="flex items-center gap-1"><FiEye className="h-3 w-3" />{blog.views ?? 0}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
