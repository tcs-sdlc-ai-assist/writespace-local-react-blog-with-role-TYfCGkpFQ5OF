import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSession, getPosts, setPosts } from '../utils/storage.js';
import { isAuthenticated } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';
import Avatar from '../components/Avatar.jsx';

export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    const posts = getPosts();
    const found = posts.find((p) => p.id === id);

    if (found) {
      setPost(found);
    } else {
      setNotFound(true);
    }
  }, [id, navigate]);

  const isOwner = session && post && session.userId === post.authorId;
  const isAdminUser = session && session.role === 'admin';
  const canEdit = isOwner || isAdminUser;

  const handleDelete = () => {
    const posts = getPosts();
    const updatedPosts = posts.filter((p) => p.id !== id);
    setPosts(updatedPosts);
    navigate('/blogs', { replace: true });
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <span className="text-5xl select-none mb-4">🔍</span>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Post not found
          </h2>
          <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
            The blog post you're looking for doesn't exist or may have been deleted.
          </p>
          <Link
            to="/blogs"
            className="bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <Link
          to="/blogs"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors mb-6"
        >
          ← Back to All Blogs
        </Link>

        <article className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Avatar role={authorRole} size="md" />
              <div>
                <span className="text-sm font-bold text-slate-800 block leading-tight">
                  {post.authorName}
                </span>
                <span className="text-xs text-slate-400">{formattedDate}</span>
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit/${post.id}`}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors cursor-pointer"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </main>

      {/* Delete confirmation dialog */}
      {showConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowConfirm(false)}
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
                  onClick={handleDelete}
                  className="bg-pink-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
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