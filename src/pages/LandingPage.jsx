import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import BlogCard from '../components/BlogCard.jsx';
import PublicNavbar from '../components/PublicNavbar.jsx';

const features = [
  {
    icon: '✍️',
    title: 'Write Freely',
    description:
      'Express your thoughts with a clean, distraction-free writing experience. Share your stories with the world.',
  },
  {
    icon: '🌍',
    title: 'Share & Discover',
    description:
      'Browse posts from other writers, discover new perspectives, and connect through the power of words.',
  },
  {
    icon: '🔒',
    title: 'Secure & Simple',
    description:
      'Your content stays safe with built-in authentication. Manage your posts with an intuitive dashboard.',
  },
];

export default function LandingPage() {
  const allPosts = getPosts();
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            ✍️ WriteSpace
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            A minimal blogging platform where your words take center stage. Write,
            share, and discover stories that matter.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
          Why WriteSpace?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="text-4xl mb-4 select-none">{feature.icon}</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Preview */}
      {latestPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-16 w-full">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl select-none">✍️</span>
              <span className="text-lg font-bold text-slate-800 tracking-tight">
                WriteSpace
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            © {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}