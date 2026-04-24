import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { getSession } from '../utils/storage.js';

const accentColors = [
  'border-indigo-400',
  'border-violet-400',
  'border-pink-400',
  'border-teal-400',
];

export default function BlogCard({ post, index = 0 }) {
  const session = getSession();
  const accentClass = accentColors[index % accentColors.length];

  const isOwner = session && session.userId === post.authorId;
  const isAdminUser = session && session.role === 'admin';
  const canEdit = isOwner || isAdminUser;

  const excerpt =
    post.content.length > 120
      ? post.content.slice(0, 120) + '…'
      : post.content;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

  return (
    <Link
      to={`/blog/${post.id}`}
      className={`block bg-white rounded-xl border-l-4 ${accentClass} shadow-sm hover:shadow-md transition-shadow p-5`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-2 flex-1">
          {post.title}
        </h3>
        {canEdit && (
          <span className="text-slate-400 text-sm select-none flex-shrink-0" title="Edit">
            ✏️
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 mb-4 line-clamp-3">{excerpt}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar role={authorRole} size="sm" />
          <span className="text-sm font-medium text-slate-700">
            {post.authorName}
          </span>
        </div>
        <span className="text-xs text-slate-400">{formattedDate}</span>
      </div>
    </Link>
  );
}