import { motion } from 'framer-motion';
import Logo from '../../components/common/Logo';

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-light-bg dark:bg-dark-bg px-4 py-12">
    <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
    <div className="absolute -bottom-24 -left-24 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card w-full max-w-md p-8"
    >
      <div className="mb-6 flex justify-center"><Logo /></div>
      <h1 className="text-center text-2xl font-extrabold">{title}</h1>
      {subtitle && <p className="mt-1.5 text-center text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      <div className="mt-7">{children}</div>
    </motion.div>
  </div>
);

export default AuthLayout;
