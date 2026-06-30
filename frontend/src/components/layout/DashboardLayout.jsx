import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiFileText, FiBookmark, FiUser, FiClock, FiPlusCircle } from 'react-icons/fi';
import Navbar from './Navbar';

const links = [
  { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/dashboard/blogs', label: 'My Blogs', icon: FiFileText },
  { to: '/dashboard/blogs/new', label: 'Write New', icon: FiPlusCircle },
  { to: '/dashboard/bookmarks', label: 'Bookmarks', icon: FiBookmark },
  { to: '/dashboard/history', label: 'Reading History', icon: FiClock },
  { to: '/dashboard/profile', label: 'Profile', icon: FiUser },
];

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container-px mx-auto flex max-w-7xl flex-1 gap-8 py-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="card sticky top-24 space-y-1 p-3">
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

export default DashboardLayout;
