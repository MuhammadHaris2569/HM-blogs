import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiPlusCircle, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { blogApi } from '../../api';
import { formatShortDate } from '../../utils/formatters';

const statusColors = {
  published: 'bg-success/10 text-success',
  draft: 'bg-warning/10 text-warning',
  archived: 'bg-slate-200 text-slate-500',
};

const MyBlogsPage = () => {
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-blogs', status],
    queryFn: () => blogApi.getMine({ status: status || undefined, limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => blogApi.remove(id),
    onSuccess: () => {
      toast.success('Blog deleted');
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
    },
  });

  const blogs = data?.data?.data?.blogs || [];

  return (
    <>
      <SEO title="My Blogs" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">My Blogs</h1>
        <Link to="/dashboard/blogs/new" className="btn-primary !px-4 !py-2 text-sm"><FiPlusCircle /> Write New</Link>
      </div>

      <div className="mt-4 flex gap-2">
        {['', 'published', 'draft', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              status === s ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="mt-6 card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-700 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Views</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No blogs found</td></tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                  <td className="px-5 py-3 font-medium max-w-xs truncate">{blog.title}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[blog.status]}`}>{blog.status}</span>
                  </td>
                  <td className="px-5 py-3">{blog.views}</td>
                  <td className="px-5 py-3 text-slate-400">{formatShortDate(blog.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      {blog.status === 'published' && (
                        <Link to={`/blogs/${blog.slug}`} className="hover:text-primary"><FiEye className="h-4 w-4" /></Link>
                      )}
                      <Link to={`/dashboard/blogs/edit/${blog._id}`} className="hover:text-primary"><FiEdit2 className="h-4 w-4" /></Link>
                      <button onClick={() => window.confirm('Delete this blog?') && deleteMutation.mutate(blog._id)} className="hover:text-danger">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyBlogsPage;
