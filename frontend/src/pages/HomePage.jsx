import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import BlogCard from '../components/blog/BlogCard';
import BlogCardSkeleton from '../components/blog/BlogCardSkeleton';
import { blogApi, categoryApi } from '../api';

const HomePage = () => {
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['blogs', 'featured'],
    queryFn: () => blogApi.getAll({ featured: true, limit: 3 }),
  });

  const { data: latestData, isLoading: loadingLatest } = useQuery({
    queryKey: ['blogs', 'latest'],
    queryFn: () => blogApi.getAll({ limit: 6 }),
  });

  const { data: trendingData, isLoading: loadingTrending } = useQuery({
    queryKey: ['blogs', 'trending'],
    queryFn: () => blogApi.getTrending(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  });

  const featured = featuredData?.data?.data?.blogs || [];
  const latest = latestData?.data?.data?.blogs || [];
  const trending = trendingData?.data?.data?.blogs || [];
  const categories = categoriesData?.data?.data?.categories || [];

  return (
    <>
      <SEO />
      <Hero />
      <StatsSection />

      {/* Featured Posts */}
      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Featured Posts</h2>
          <Link to="/blogs?featured=true" className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
            View all <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingFeatured
            ? Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : featured.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-10">
          <h2 className="mb-8 text-2xl font-extrabold sm:text-3xl">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                to={`/blogs?category=${cat._id}`}
                className="card flex flex-col items-center gap-2 p-6 text-center hover:-translate-y-1 hover:shadow-glow"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name.charAt(0)}
                </span>
                <p className="font-semibold">{cat.name}</p>
                <p className="text-xs text-slate-400">{cat.blogCount} articles</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Posts */}
      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Trending Now</h2>
          <Link to="/blogs?sort=popular" className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
            View all <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingTrending
            ? Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : trending.slice(0, 3).map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Latest Articles</h2>
          <Link to="/blogs" className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
            View all <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingLatest
            ? Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : latest.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container-px mx-auto max-w-7xl py-16">
        <div className="card relative overflow-hidden bg-gradient-to-br from-primary to-accent p-10 text-center text-white sm:p-16">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Never miss a great story</h2>
          <p className="mt-3 text-white/90">Subscribe to our newsletter and get the best articles every week.</p>
          <Link to="/contact" className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-primary hover:-translate-y-0.5 transition-transform">
            Subscribe Now
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
