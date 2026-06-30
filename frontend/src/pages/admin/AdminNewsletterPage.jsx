import { useQuery } from '@tanstack/react-query';
import { FiMail, FiDownload } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import { newsletterApi } from '../../api';
import { formatShortDate } from '../../utils/formatters';
import api from '../../api/axios';

const AdminNewsletterPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-newsletter'],
    queryFn: () => api.get('/newsletter'),
  });

  const subscribers = data?.data?.data?.subscribers || [];

  const exportCsv = () => {
    const csv = ['Email,Subscribed At', ...subscribers.map((s) => `${s.email},${s.createdAt}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
  };

  return (
    <>
      <SEO title="Newsletter Subscribers" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Newsletter Subscribers</h1>
        <button onClick={exportCsv} className="btn-secondary !px-4 !py-2 text-sm"><FiDownload /> Export CSV</button>
      </div>

      <div className="mt-6 card divide-y divide-slate-100 dark:divide-slate-800">
        {isLoading ? (
          <p className="p-6 text-slate-400">Loading...</p>
        ) : subscribers.length === 0 ? (
          <p className="p-6 text-slate-400">No subscribers yet.</p>
        ) : (
          subscribers.map((s) => (
            <div key={s._id} className="flex items-center justify-between p-4">
              <span className="flex items-center gap-2 text-sm"><FiMail className="h-4 w-4 text-primary" /> {s.email}</span>
              <span className="text-xs text-slate-400">{formatShortDate(s.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminNewsletterPage;
