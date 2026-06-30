import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';

const NotFoundPage = () => (
  <>
    <SEO title="404 - Page Not Found" />
    <section className="container-px mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-primary to-accent bg-clip-text text-8xl font-extrabold text-transparent"
      >
        404
      </motion.h1>
      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </section>
  </>
);

export default NotFoundPage;
