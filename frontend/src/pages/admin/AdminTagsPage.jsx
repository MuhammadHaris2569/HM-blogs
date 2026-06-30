import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { tagApi } from '../../api';

const AdminTagsPage = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { data, isLoading } = useQuery({ queryKey: ['tags'], queryFn: () => tagApi.getAll() });
  const tags = data?.data?.data?.tags || [];

  const createMutation = useMutation({
    mutationFn: (name) => tagApi.create(name),
    onSuccess: () => {
      toast.success('Tag created');
      reset();
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create tag'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => tagApi.remove(id),
    onSuccess: () => {
      toast.success('Tag deleted');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  return (
    <>
      <SEO title="Manage Tags" />
      <h1 className="text-2xl font-extrabold">Manage Tags</h1>

      <form onSubmit={handleSubmit((d) => createMutation.mutate(d.name))} className="mt-6 card flex items-end gap-3 p-5">
        <div className="flex-1">
          <label className="text-xs font-medium">Tag Name</label>
          <input {...register('name', { required: true })} className="input-field mt-1" />
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm"><FiPlus /> Add</button>
      </form>

      <div className="mt-6 flex flex-wrap gap-3">
        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          tags.map((tag) => (
            <div key={tag._id} className="card flex items-center gap-2 px-4 py-2">
              <span className="text-sm font-medium">#{tag.name}</span>
              <button onClick={() => deleteMutation.mutate(tag._id)} className="text-slate-400 hover:text-danger"><FiTrash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminTagsPage;
