import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiFileText, FiHeart, FiEye, FiBookmark, FiPlusCircle } from 'react-icons/fi';
import { blogApi, userApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';

const DashboardOverview = () => {
  const { user } = useAuth();

  const { data: blogsData } = useQuery({
    queryKey: ['my-blogs-overview'],
    queryFn: () => blogApi.getMine({ limit: 100 }),
    enabled: !!user,
  });

  const { data: bookmarksData } = useQuery({ queryKey: ['bookmarks-count'], queryFn: () => userApi.getBookmarks() });

  const blogs = blogsData?.data?.data?.blogs || [];
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likesCount || 0), 0);
  const bookmarksCount = bookmarksData?.data?.data?.bookmarks?.length || 0;

  const stats = [
    { label: 'My Articles', value: blogs.length, icon: FiFileText },
    { label: 'Total Views', value: totalViews, icon: FiEye },
    { label: 'Total Likes', value: totalLikes, icon: FiHeart },
    { label: 'Bookmarks', value: bookmarksCount, icon: FiBookmark },
  ];

  return (
    <>
      <SEO title="Dashboard" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening with your content.</p>
        </div>
        <Link to="/dashboard/blogs/new" className="btn-primary !px-4 !py-2 text-sm"><FiPlusCircle /> Write New</Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <h2 className="font-bold mb-4">Recent Articles</h2>
        <div className="space-y-3">
          {blogs.slice(0, 5).map((blog) => (
            <Link key={blog._id} to={`/blogs/${blog.slug}`} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">
              <span className="truncate text-sm font-medium">{blog.title}</span>
              <span className="shrink-0 rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-xs capitalize">{blog.status}</span>
            </Link>
          ))}
          {blogs.length === 0 && <p className="text-sm text-slate-400">No articles yet. Start writing your first post!</p>}
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;
