import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiEdit2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { blogApi } from '../../api';
import { formatShortDate } from '../../utils/formatters';

const statusColors = {
  published: 'bg-success/10 text-success',
  draft: 'bg-warning/10 text-warning',
  archived: 'bg-slate-200 text-slate-500',
};

const AdminManageBlogsPage = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', search],
    queryFn: () => blogApi.getAllAdmin({ search: search || undefined, limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => blogApi.remove(id),
    onSuccess: () => {
      toast.success('Blog deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    },
  });

  const blogs = data?.data?.data?.blogs || [];

  return (
    <>
      <SEO title="Manage Blogs" />
      <h1 className="text-2xl font-extrabold">Manage Blogs</h1>

      <div className="mt-4 relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blogs..." className="input-field !pl-10" />
      </div>

      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-700 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Author</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Views</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No blogs found</td></tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                  <td className="px-5 py-3 font-medium max-w-xs truncate">{blog.title}</td>
                  <td className="px-5 py-3 text-slate-500">{blog.author?.name}</td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[blog.status]}`}>{blog.status}</span></td>
                  <td className="px-5 py-3">{blog.views}</td>
                  <td className="px-5 py-3 text-slate-400">{formatShortDate(blog.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
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

export default AdminManageBlogsPage;
