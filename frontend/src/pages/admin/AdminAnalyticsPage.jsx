import { useQuery } from '@tanstack/react-query';
import { FiFileText, FiUsers, FiMessageSquare, FiMail, FiEye } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import { adminApi } from '../../api';
import { formatShortDate } from '../../utils/formatters';

const AdminAnalyticsPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin-analytics'], queryFn: () => adminApi.getAnalytics() });
  const stats = data?.data?.data?.stats;
  const topBlogs = data?.data?.data?.topBlogs || [];
  const recentUsers = data?.data?.data?.recentUsers || [];

  if (isLoading) return <p className="text-slate-400">Loading analytics...</p>;

  const cards = [
    { label: 'Total Blogs', value: stats?.totalBlogs, icon: FiFileText },
    { label: 'Published', value: stats?.publishedBlogs, icon: FiFileText },
    { label: 'Total Views', value: stats?.totalViews, icon: FiEye },
    { label: 'Total Users', value: stats?.totalUsers, icon: FiUsers },
    { label: 'Total Comments', value: stats?.totalComments, icon: FiMessageSquare },
    { label: 'Newsletter Subscribers', value: stats?.totalSubscribers, icon: FiMail },
  ];

  return (
    <>
      <SEO title="Admin Analytics" />
      <h1 className="text-2xl font-extrabold">Analytics Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <c.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-2xl font-extrabold">{c.value ?? 0}</p>
            <p className="text-xs text-slate-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-bold mb-4">Top Performing Blogs</h2>
          <div className="space-y-3">
            {topBlogs.map((b) => (
              <div key={b._id} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium">{b.title}</span>
                <span className="shrink-0 text-slate-400">{b.views} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{formatShortDate(u.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAnalyticsPage;
