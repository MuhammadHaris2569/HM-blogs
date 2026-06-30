import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/common/SEO';
import BlogCard from '../components/blog/BlogCard';
import BlogCardSkeleton from '../components/blog/BlogCardSkeleton';
import { blogApi } from '../api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => blogApi.getAll({ search: query, limit: 12 }),
    enabled: !!query,
  });

  const blogs = data?.data?.data?.blogs || [];

  return (
    <>
      <SEO title={`Search: ${query}`} />
      <section className="container-px mx-auto max-w-7xl py-12">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          Search results for "<span className="text-primary">{query}</span>"
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{blogs.length} results found</p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
        </div>

        {!isLoading && blogs.length === 0 && (
          <p className="py-16 text-center text-slate-400">No articles matched your search.</p>
        )}
      </section>
    </>
  );
};

export default SearchPage;
