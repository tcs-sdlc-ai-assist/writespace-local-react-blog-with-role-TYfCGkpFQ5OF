import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, getPosts, setPosts } from '../utils/storage.js';
import { isAuthenticated } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      const isOwner = session && session.userId === post.authorId;
      const isAdminUser = session && session.role === 'admin';

      if (!isOwner && !isAdminUser) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    }
  }, [id, isEditMode, navigate, session]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX) {
      setError(`Title must be at most ${TITLE_MAX} characters`);
      return;
    }

    if (trimmedContent.length > CONTENT_MAX) {
      setError(`Content must be at most ${CONTENT_MAX} characters`);
      return;
    }

    const posts = getPosts();

    if (isEditMode) {
      const updatedPosts = posts.map((p) => {
        if (p.id === id) {
          return { ...p, title: trimmedTitle, content: trimmedContent };
        }
        return p;
      });
      setPosts(updatedPosts);
    } else {
      const newPost = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        authorId: session.userId,
        authorName: session.displayName,
      };
      setPosts([...posts, newPost]);
    }

    navigate('/blogs', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {isEditMode ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isEditMode
              ? 'Update your blog post below'
              : 'Share your thoughts with the world'}
          </p>
        </div>

        {error && (
          <div className="bg-pink-50 border border-pink-200 text-pink-700 text-sm font-medium rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              maxLength={TITLE_MAX}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {title.length}/{TITLE_MAX}
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here…"
              maxLength={CONTENT_MAX}
              rows={12}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {content.length}/{CONTENT_MAX}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              {isEditMode ? 'Update Post' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="text-sm font-medium text-slate-600 px-6 py-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}