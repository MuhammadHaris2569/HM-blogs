import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiFilter } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import BlogCard from '../components/blog/BlogCard';
import BlogCardSkeleton from '../components/blog/BlogCardSkeleton';
import Pagination from '../components/common/Pagination';
import { blogApi, categoryApi } from '../api';

const BlogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';

  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: () => categoryApi.getAll() });
  const categories = categoriesData?.data?.data?.categories || [];

  const queryParams = useMemo(
    () => ({ page, limit: 9, category: category || undefined, sort, search: search || undefined, featured: featured || undefined }),
    [page, category, sort, search, featured]
  );

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', queryParams],
    queryFn: () => blogApi.getAll(queryParams),
  });

  const blogs = data?.data?.data?.blogs || [];
  const pagination = data?.data?.data?.pagination;

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  return (
    <>
      <SEO title="All Blogs" description="Browse our full collection of articles on technology, design, business, and more." />

      <section className="container-px mx-auto max-w-7xl py-12">
        <h1 className="text-3xl font-extrabold sm:text-4xl">All Articles</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Explore {pagination?.total || 0} thoughtfully written articles.</p>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleSearchSubmit} className="relative max-w-md flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="input-field !pl-10"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <select value={category} onChange={(e) => updateParam('category', e.target.value)} className="input-field !w-auto text-sm">
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="input-field !w-auto text-sm">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Viewed</option>
              <option value="liked">Most Liked</option>
            </select>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
        </div>

        {!isLoading && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FiFilter className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-lg font-semibold">No articles found</p>
            <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}

        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('page', p);
              setSearchParams(newParams);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </section>
    </>
  );
};

export default BlogsPage;
