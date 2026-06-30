import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { categoryApi } from '../api';

const CategoriesPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => categoryApi.getAll() });
  const categories = data?.data?.data?.categories || [];

  return (
    <>
      <SEO title="Categories" description="Browse articles by category on HM Blogs." />
      <section className="container-px mx-auto max-w-7xl py-12">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Categories</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Find articles organized by topic.</p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40" />)
            : categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/blogs?category=${cat._id}`} className="card flex h-40 flex-col justify-between p-6 hover:-translate-y-1 hover:shadow-glow">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg font-bold" style={{ backgroundColor: cat.color }}>
                      {cat.name.charAt(0)}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{cat.name}</h3>
                      <p className="text-sm text-slate-400">{cat.blogCount} articles</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>
    </>
  );
};

export default CategoriesPage;
