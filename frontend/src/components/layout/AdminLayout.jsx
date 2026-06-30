import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiFileText, FiUsers, FiTag, FiFolder, FiMessageSquare, FiMail } from 'react-icons/fi';
import Navbar from './Navbar';

const links = [
  { to: '/admin', label: 'Analytics', icon: FiGrid, end: true },
  { to: '/admin/blogs', label: 'Manage Blogs', icon: FiFileText },
  { to: '/admin/categories', label: 'Categories', icon: FiFolder },
  { to: '/admin/tags', label: 'Tags', icon: FiTag },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/comments', label: 'Comments', icon: FiMessageSquare },
  { to: '/admin/newsletter', label: 'Newsletter', icon: FiMail },
];

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container-px mx-auto flex max-w-7xl flex-1 gap-8 py-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="card sticky top-24 space-y-1 p-3">
            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Panel</p>
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
