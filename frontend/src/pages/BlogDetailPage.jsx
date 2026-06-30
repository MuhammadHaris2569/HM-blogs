import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiClock, FiEye, FiHeart, FiBookmark, FiTwitter, FiFacebook, FiLinkedin, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import Spinner from '../components/common/Spinner';
import BlogCard from '../components/blog/BlogCard';
import CommentSection from '../components/blog/CommentSection';
import { blogApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div className="fixed top-16 left-0 z-40 h-1 w-full bg-transparent">
      <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBySlug(slug),
  });

  const blog = data?.data?.data?.blog;
  const relatedBlogs = data?.data?.data?.relatedBlogs || [];

  const likeMutation = useMutation({
    mutationFn: () => blogApi.toggleLike(blog._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog', slug] }),
    onError: () => toast.error('Please log in to like this post'),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => blogApi.toggleBookmark(blog._id),
    onSuccess: (res) => toast.success(res.data.data.bookmarked ? 'Bookmarked!' : 'Removed from bookmarks'),
    onError: () => toast.error('Please log in to bookmark this post'),
  });

  const handleShare = (platform) => {
    const url = window.location.href;
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
      return;
    }
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(blog.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
  };

  if (isLoading) return <Spinner full size="lg" />;

  if (error || !blog) {
    return (
      <div className="container-px mx-auto max-w-3xl py-24 text-center">
        <h2 className="text-2xl font-bold">Blog post not found</h2>
        <Link to="/blogs" className="btn-primary mt-6 inline-flex">Browse all blogs</Link>
      </div>
    );
  }

  const hasLiked = user && blog.likes?.includes(user._id);

  return (
    <>
      <SEO title={blog.metaTitle || blog.title} description={blog.metaDescription || blog.excerpt} image={blog.coverImage?.url} type="article" />
      <ReadingProgress />

      <article className="container-px mx-auto max-w-3xl py-12">
        {blog.category && (
          <Link
            to={`/blogs?category=${blog.category._id}`}
            className="inline-block rounded-lg px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: blog.category.color }}
          >
            {blog.category.name}
          </Link>
        )}

        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{blog.title}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-slate-200 dark:border-slate-700 py-4">
          <Link to={`/author/${blog.author?._id}`} className="flex items-center gap-3">
            {blog.author?.avatar?.url ? (
              <img src={blog.author.avatar.url} alt={blog.author.name} className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                {blog.author?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">{blog.author?.name}</p>
              <p className="text-xs text-slate-400">{formatDate(blog.publishedAt)}</p>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><FiClock className="h-4 w-4" />{blog.readingTime} min read</span>
            <span className="flex items-center gap-1"><FiEye className="h-4 w-4" />{blog.views} views</span>
          </div>
        </div>

        <img src={blog.coverImage?.url} alt={blog.title} className="mt-8 w-full rounded-2xl shadow-soft" />

        <div className="prose-content mt-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {blog.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Link key={tag._id} to={`/blogs?tag=${tag._id}`} className="rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1 text-xs font-medium hover:bg-primary/10 hover:text-primary">
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 dark:bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (isAuthenticated ? likeMutation.mutate() : toast.error('Please log in to like this post'))}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                hasLiked ? 'border-danger/30 bg-danger/10 text-danger' : 'border-slate-200 dark:border-slate-700 hover:border-danger/30 hover:text-danger'
              }`}
            >
              <FiHeart className={hasLiked ? 'fill-current' : ''} /> {blog.likesCount || 0}
            </button>
            <button
              onClick={() => (isAuthenticated ? bookmarkMutation.mutate() : toast.error('Please log in to bookmark this post'))}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:border-primary/30 hover:text-primary transition-colors"
            >
              <FiBookmark /> Save
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleShare('twitter')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:text-primary"><FiTwitter /></button>
            <button onClick={() => handleShare('facebook')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:text-primary"><FiFacebook /></button>
            <button onClick={() => handleShare('linkedin')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:text-primary"><FiLinkedin /></button>
            <button onClick={() => handleShare('copy')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:text-primary"><FiLink /></button>
          </div>
        </div>

        <CommentSection blogId={blog._id} />
      </article>

      {relatedBlogs.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-12">
          <h2 className="mb-8 text-2xl font-extrabold">Related Articles</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedBlogs.map((b, i) => <BlogCard key={b._id} blog={b} index={i} />)}
          </div>
        </section>
      )}
    </>
  );
};

export default BlogDetailPage;
