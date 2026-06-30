import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => (
  <Link to="/" className={`flex items-center gap-2 group ${className}`}>
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white font-extrabold text-sm shadow-glow transition-transform duration-300 group-hover:scale-105">
      HM
    </span>
    <span className="text-lg font-extrabold tracking-tight text-secondary dark:text-white">
      HM Blogs
    </span>
  </Link>
);

export default Logo;
