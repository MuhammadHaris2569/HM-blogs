import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FiTwitter, FiGithub, FiLinkedin, FiGlobe, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import Spinner from '../components/common/Spinner';
import BlogCard from '../components/blog/BlogCard';
import { userApi } from '../api';
import { useAuth } from '../context/AuthContext';

const AuthorPage = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({ queryKey: ['author', id], queryFn: () => userApi.getProfile(id) });

  const followMutation = useMutation({
    mutationFn: () => userApi.toggleFollow(id),
    onSuccess: (res) => toast.success(res.data.data.following ? 'Following!' : 'Unfollowed'),
  });

  if (isLoading) return <Spinner full size="lg" />;

  const author = data?.data?.data?.user;
  const blogs = data?.data?.data?.blogs || [];

  if (!author) return null;

  const isOwnProfile = currentUser?._id === author._id;

  return (
    <>
      <SEO title={author.name} description={author.bio} />
      <section className="container-px mx-auto max-w-5xl py-12">
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          {author.avatar?.url ? (
            <img src={author.avatar.url} alt={author.name} className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl font-bold">
              {author.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-extrabold">{author.name}</h1>
          {author.bio && <p className="max-w-md text-slate-500 dark:text-slate-400">{author.bio}</p>}

          <div className="flex gap-6 text-sm">
            <span><strong>{blogs.length}</strong> articles</span>
            <span><strong>{author.followersCount}</strong> followers</span>
            <span><strong>{author.followingCount}</strong> following</span>
          </div>

          <div className="flex items-center gap-3">
            {author.socialLinks?.twitter && <a href={author.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary"><FiTwitter /></a>}
            {author.socialLinks?.github && <a href={author.socialLinks.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary"><FiGithub /></a>}
            {author.socialLinks?.linkedin && <a href={author.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary"><FiLinkedin /></a>}
            {author.socialLinks?.website && <a href={author.socialLinks.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary"><FiGlobe /></a>}
          </div>

          {!isOwnProfile && isAuthenticated && (
            <button onClick={() => followMutation.mutate()} className="btn-primary !px-5 !py-2 text-sm">
              <FiUserPlus /> Follow
            </button>
          )}
        </div>

        <h2 className="mt-12 mb-6 text-2xl font-extrabold">Articles by {author.name}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => <BlogCard key={blog._id} blog={{ ...blog, author }} index={i} />)}
        </div>
        {blogs.length === 0 && <p className="text-slate-400">No published articles yet.</p>}
      </section>
    </>
  );
};

export default AuthorPage;
