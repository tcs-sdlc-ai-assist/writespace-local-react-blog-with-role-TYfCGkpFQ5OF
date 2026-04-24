import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import BlogCard from '../components/BlogCard.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  const allPosts = getPosts();
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              All Blogs
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {sortedPosts.length > 0
                ? `${sortedPosts.length} post${sortedPosts.length === 1 ? '' : 's'} published`
                : 'No posts yet'}
            </p>
          </div>
          <Link
            to="/write"
            className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ✍️ Write
          </Link>
        </div>

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-5xl select-none mb-4">📝</span>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              No posts yet
            </h2>
            <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
              Be the first to share your thoughts! Create a new blog post and start
              writing today.
            </p>
            <Link
              to="/write"
              className="bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}