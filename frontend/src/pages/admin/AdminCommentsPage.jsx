import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { commentApi } from '../../api';
import { timeAgo } from '../../utils/formatters';

const AdminCommentsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-comments'], queryFn: () => commentApi.getAllAdmin({ limit: 50 }) });
  const comments = data?.data?.data?.comments || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => commentApi.remove(id),
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
    },
  });

  return (
    <>
      <SEO title="Manage Comments" />
      <h1 className="text-2xl font-extrabold">Manage Comments</h1>

      <div className="mt-6 card divide-y divide-slate-100 dark:divide-slate-800">
        {isLoading ? (
          <p className="p-6 text-slate-400">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="p-6 text-slate-400">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{c.author?.name} <span className="text-xs text-slate-400 font-normal">commented on</span>{' '}
                  <Link to={`/blogs/${c.blog?.slug}`} className="text-primary hover:underline">{c.blog?.title}</Link>
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.content}</p>
                <p className="mt-1 text-xs text-slate-400">{timeAgo(c.createdAt)}</p>
              </div>
              <button onClick={() => deleteMutation.mutate(c._id)} className="shrink-0 text-slate-400 hover:text-danger"><FiTrash2 className="h-4 w-4" /></button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminCommentsPage;
