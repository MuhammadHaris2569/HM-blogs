import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import { userApi } from '../../api';
import { timeAgo } from '../../utils/formatters';

const ReadingHistoryPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['history'], queryFn: () => userApi.getHistory() });
  const history = (data?.data?.data?.history || []).filter((h) => h.blog);

  return (
    <>
      <SEO title="Reading History" />
      <h1 className="text-2xl font-extrabold">Reading History</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Articles you've recently read.</p>

      <div className="mt-6 card divide-y divide-slate-100 dark:divide-slate-800">
        {isLoading ? (
          <p className="p-6 text-sm text-slate-400">Loading...</p>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiClock className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-400">No reading history yet.</p>
          </div>
        ) : (
          history.map((item, i) => (
            <Link key={i} to={`/blogs/${item.blog.slug}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5">
              <img src={item.blog.coverImage?.url} alt={item.blog.title} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">{item.blog.title}</p>
                <p className="text-xs text-slate-400">{timeAgo(item.viewedAt)}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default ReadingHistoryPage;
