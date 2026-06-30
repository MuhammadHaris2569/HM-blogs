import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiUploadCloud, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { blogApi, categoryApi, tagApi } from '../../api';

const BlogEditorPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [coverPreview, setCoverPreview] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { status: 'draft', isFeatured: false },
  });

  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: () => categoryApi.getAll() });
  const { data: tagsData } = useQuery({ queryKey: ['tags'], queryFn: () => tagApi.getAll() });
  const categories = categoriesData?.data?.data?.categories || [];
  const tags = tagsData?.data?.data?.tags || [];

  const { data: myBlogsData } = useQuery({
    queryKey: ['my-blogs', 'all-for-edit'],
    queryFn: () => blogApi.getMine({ limit: 100 }),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && myBlogsData) {
      const blog = myBlogsData.data.data.blogs.find((b) => b._id === id);
      if (blog) {
        setValue('title', blog.title);
        setValue('excerpt', blog.excerpt);
        setValue('content', blog.content);
        setValue('category', blog.category?._id);
        setValue('status', blog.status);
        setValue('isFeatured', blog.isFeatured);
        setValue('metaTitle', blog.metaTitle);
        setValue('metaDescription', blog.metaDescription);
        setCoverPreview(blog.coverImage?.url);
        setSelectedTags(blog.tags?.map((t) => t._id) || []);
      }
    }
  }, [isEdit, myBlogsData, id, setValue]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  };

  const mutation = useMutation({
    mutationFn: (formData) => (isEdit ? blogApi.update(id, formData) : blogApi.create(formData)),
    onSuccess: () => {
      toast.success(isEdit ? 'Blog updated successfully' : 'Blog created successfully');
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      navigate('/dashboard/blogs');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save blog'),
  });

  const onSubmit = (data) => {
    if (!isEdit && !coverFile) {
      toast.error('Please upload a cover image');
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'isFeatured') formData.append(key, value);
    });
    formData.append('isFeatured', data.isFeatured ? 'true' : 'false');
    formData.append('tags', JSON.stringify(selectedTags));
    if (coverFile) formData.append('coverImage', coverFile);

    mutation.mutate(formData);
  };

  return (
    <>
      <SEO title={isEdit ? 'Edit Blog' : 'Write New Blog'} />
      <h1 className="text-2xl font-extrabold">{isEdit ? 'Edit Blog' : 'Write a New Blog'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="card p-6">
          <label className="text-sm font-medium">Cover Image</label>
          <div className="mt-2">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="h-56 w-full rounded-xl object-cover" />
            ) : (
              <label className="flex h-56 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:border-primary/40">
                <FiUploadCloud className="h-8 w-8" />
                <span className="text-sm">Click or drag to upload</span>
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
            )}
            {coverPreview && (
              <label className="btn-secondary mt-3 inline-flex cursor-pointer !px-4 !py-2 text-xs">
                Change Image
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input {...register('title', { required: 'Title is required' })} className="input-field mt-1.5" />
            {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Excerpt</label>
            <textarea {...register('excerpt', { required: 'Excerpt is required', maxLength: 300 })} rows={2} className="input-field mt-1.5" />
            {errors.excerpt && <p className="mt-1 text-xs text-danger">{errors.excerpt.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Content (HTML supported)</label>
            <textarea {...register('content', { required: 'Content is required' })} rows={14} className="input-field mt-1.5 font-mono text-xs" />
            {errors.content && <p className="mt-1 text-xs text-danger">{errors.content.message}</p>}
          </div>
        </div>

        <div className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select {...register('category', { required: 'Category is required' })} className="input-field mt-1.5">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-xs text-danger">{errors.category.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select {...register('status')} className="input-field mt-1.5">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag._id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedTags.includes(tag._id) ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 rounded accent-primary" />
            <span className="text-sm">Mark as Featured</span>
          </label>
        </div>

        <div className="card space-y-4 p-6">
          <h3 className="font-semibold text-sm">SEO Settings</h3>
          <div>
            <label className="text-sm font-medium">Meta Title</label>
            <input {...register('metaTitle')} className="input-field mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium">Meta Description</label>
            <textarea {...register('metaDescription')} rows={2} className="input-field mt-1.5" />
          </div>
        </div>

        <button disabled={isSubmitting || mutation.isPending} className="btn-primary">
          <FiSave /> {isEdit ? 'Update Blog' : 'Publish Blog'}
        </button>
      </form>
    </>
  );
};

export default BlogEditorPage;
