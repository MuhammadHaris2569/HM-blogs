import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 dark:from-primary/5 dark:to-accent/5" />
      <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="container-px mx-auto max-w-7xl py-20 sm:py-28 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
        >
          Welcome to HM Blogs
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        >
          Read. Learn. <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Inspire.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-slate-500 dark:text-slate-400"
        >
          Discover thoughtful articles on technology, design, business, and life — written by a
          community of curious minds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/blogs" className="btn-primary">
            Start Reading <FiArrowRight />
          </Link>
          <Link to="/register" className="btn-secondary">
            Join the Community
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
