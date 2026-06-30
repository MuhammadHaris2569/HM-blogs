import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';

const values = [
  { title: 'Quality First', desc: 'Every article goes through thoughtful review to ensure value for readers.' },
  { title: 'Open Community', desc: 'Writers from every background are welcome to share their voice.' },
  { title: 'Privacy Respected', desc: 'We never sell your data or compromise on security.' },
];

const AboutPage = () => (
  <>
    <SEO title="About Us" description="Learn more about HM Blogs, our mission, and our community." />
    <section className="container-px mx-auto max-w-4xl py-16 text-center">
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold sm:text-4xl">
        About HM Blogs
      </motion.h1>
      <p className="mx-auto mt-5 max-w-2xl text-slate-500 dark:text-slate-400">
        HM Blogs was founded with a simple mission: build a beautiful, distraction-free space for
        people to read, learn, and share ideas that inspire. We believe great writing deserves a
        great platform.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 text-left"
          >
            <h3 className="font-bold">{v.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  </>
);

export default AboutPage;
