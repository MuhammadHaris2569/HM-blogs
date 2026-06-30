import { useQuery } from '@tanstack/react-query';
import { FiBookmark } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import BlogCard from '../../components/blog/BlogCard';
import BlogCardSkeleton from '../../components/blog/BlogCardSkeleton';
import { userApi } from '../../api';

const BookmarksPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['bookmarks'], queryFn: () => userApi.getBookmarks() });
  const bookmarks = data?.data?.data?.bookmarks || [];

  return (
    <>
      <SEO title="My Bookmarks" />
      <h1 className="text-2xl font-extrabold">My Bookmarks</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Articles you've saved for later.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)
          : bookmarks.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
      </div>

      {!isLoading && bookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FiBookmark className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-slate-400">No bookmarks yet.</p>
        </div>
      )}
    </>
  );
};

export default BookmarksPage;
