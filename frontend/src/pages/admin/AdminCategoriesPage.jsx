import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { categoryApi } from '../../api';

const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => categoryApi.getAll() });
  const categories = data?.data?.data?.categories || [];

  const createMutation = useMutation({
    mutationFn: (payload) => categoryApi.create(payload),
    onSuccess: () => {
      toast.success('Category created');
      reset();
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.remove(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  return (
    <>
      <SEO title="Manage Categories" />
      <h1 className="text-2xl font-extrabold">Manage Categories</h1>

      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="mt-6 card flex flex-wrap items-end gap-3 p-5">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-medium">Name</label>
          <input {...register('name', { required: true })} className="input-field mt-1" />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-medium">Description</label>
          <input {...register('description')} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium">Color</label>
          <input {...register('color')} type="color" defaultValue="#2563EB" className="mt-1 h-10 w-16 rounded-lg" />
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm"><FiPlus /> Add</button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="card flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg" style={{ backgroundColor: cat.color }} />
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-slate-400">{cat.blogCount} blogs</p>
                </div>
              </div>
              <button onClick={() => deleteMutation.mutate(cat._id)} className="text-slate-400 hover:text-danger"><FiTrash2 className="h-4 w-4" /></button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminCategoriesPage;
