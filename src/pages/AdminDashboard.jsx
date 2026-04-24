import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, getPosts, setPosts, getUsers } from '../utils/storage.js';
import { isAuthenticated, isAdmin } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import Avatar from '../components/Avatar.jsx';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [posts, setPostsState] = useState([]);
  const [users, setUsersState] = useState([]);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (!isAdmin()) {
      navigate('/blogs', { replace: true });
      return;
    }

    setPostsState(getPosts());
    setUsersState(getUsers());
  }, [navigate]);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleDelete = (postId) => {
    const updatedPosts = posts.filter((p) => p.id !== postId);
    setPosts(updatedPosts);
    setPostsState(updatedPosts);
    setShowConfirm(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Gradient Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 rounded-xl p-6 md:p-8 mb-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            👑 Admin Dashboard
          </h1>
          <p className="text-sm md:text-base text-white/90">
            Welcome back, {session?.displayName || 'Admin'}. Here's an overview of your WriteSpace platform.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Posts"
            value={totalPosts}
            icon="📝"
            bgColor="bg-indigo-100"
          />
          <StatCard
            label="Total Users"
            value={totalUsers}
            icon="👥"
            bgColor="bg-violet-100"
          />
          <StatCard
            label="Admins"
            value={adminCount}
            icon="👑"
            bgColor="bg-pink-100"
          />
          <StatCard
            label="Users"
            value={userCount}
            icon="📖"
            bgColor="bg-teal-100"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/write"
            className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ✍️ Write New Post
          </Link>
          <Link
            to="/users"
            className="bg-violet-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-violet-700 transition-colors"
          >
            👥 Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Recent Posts
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => {
                const formattedDate = new Date(post.createdAt).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                );

                const authorRole =
                  post.authorId === 'admin' ? 'admin' : 'user';

                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between gap-4 bg-white rounded-xl shadow-sm p-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar role={authorRole} size="sm" />
                      <div className="min-w-0">
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-sm font-bold text-slate-800 truncate block hover:text-indigo-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-slate-500 truncate">
                          by {post.authorName} · {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/edit/${post.id}`}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => setShowConfirm(post.id)}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-5xl select-none mb-4">📝</span>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                No posts yet
              </h2>
              <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
                Get started by creating the first blog post on your platform.
              </p>
              <Link
                to="/write"
                className="bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {showConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowConfirm(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-sm w-full">
              <div className="text-center mb-4">
                <span className="text-4xl select-none">⚠️</span>
                <h2 className="text-lg font-bold text-slate-800 mt-3">
                  Delete Post?
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  This action cannot be undone. The post will be permanently removed.
                </p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={() => handleDelete(showConfirm)}
                  className="bg-pink-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowConfirm(null)}
                  className="text-sm font-medium text-slate-600 px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}