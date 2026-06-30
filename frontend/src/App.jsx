import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import SearchPage from './pages/SearchPage';
import AuthorPage from './pages/AuthorPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyBlogsPage from './pages/dashboard/MyBlogsPage';
import BlogEditorPage from './pages/dashboard/BlogEditorPage';
import BookmarksPage from './pages/dashboard/BookmarksPage';
import ReadingHistoryPage from './pages/dashboard/ReadingHistoryPage';
import ProfilePage from './pages/dashboard/ProfilePage';

import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminManageBlogsPage from './pages/admin/AdminManageBlogsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminTagsPage from './pages/admin/AdminTagsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCommentsPage from './pages/admin/AdminCommentsPage';
import AdminNewsletterPage from './pages/admin/AdminNewsletterPage';

function App() {
  return (
    <Routes>
      {/* Public pages with main navbar/footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/author/:id" element={<AuthorPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth pages (no navbar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* User dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="blogs" element={<MyBlogsPage />} />
        <Route path="blogs/new" element={<BlogEditorPage />} />
        <Route path="blogs/edit/:id" element={<BlogEditorPage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
        <Route path="history" element={<ReadingHistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin panel */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminAnalyticsPage />} />
        <Route path="blogs" element={<AdminManageBlogsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="tags" element={<AdminTagsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="comments" element={<AdminCommentsPage />} />
        <Route path="newsletter" element={<AdminNewsletterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
