import { motion } from 'framer-motion';
import { FiFileText, FiUsers, FiHeart, FiEye } from 'react-icons/fi';

const stats = [
  { icon: FiFileText, label: 'Articles Published', value: '500+' },
  { icon: FiUsers, label: 'Active Readers', value: '20K+' },
  { icon: FiHeart, label: 'Likes Given', value: '85K+' },
  { icon: FiEye, label: 'Monthly Views', value: '1.2M+' },
];

const StatsSection = () => (
  <section className="container-px mx-auto max-w-7xl py-14">
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="card flex flex-col items-center gap-2 p-6 text-center"
        >
          <stat.icon className="h-6 w-6 text-primary" />
          <p className="text-2xl font-extrabold">{stat.value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatsSection;
