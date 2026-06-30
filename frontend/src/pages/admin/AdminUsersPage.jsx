import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { userApi } from '../../api';
import { formatShortDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const roleColors = { admin: 'bg-primary/10 text-primary', author: 'bg-accent/10 text-accent', user: 'bg-slate-200 text-slate-500' };

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: () => userApi.getAll({ limit: 50 }) });
  const users = data?.data?.data?.users || [];

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => userApi.updateRole(id, role),
    onSuccess: () => {
      toast.success('Role updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.remove(id),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return (
    <>
      <SEO title="Manage Users" />
      <h1 className="text-2xl font-extrabold">Manage Users</h1>

      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-700 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => roleMutation.mutate({ id: u._id, role: e.target.value })}
                      className={`rounded-lg border-0 px-2 py-1 text-xs font-medium capitalize ${roleColors[u.role]}`}
                    >
                      <option value="user">User</option>
                      <option value="author">Author</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{formatShortDate(u.createdAt)}</td>
                  <td className="px-5 py-3 text-right">
                    {u._id !== currentUser._id && (
                      <button onClick={() => window.confirm('Delete this user?') && deleteMutation.mutate(u._id)} className="text-slate-400 hover:text-danger">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    )}
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

export default AdminUsersPage;
