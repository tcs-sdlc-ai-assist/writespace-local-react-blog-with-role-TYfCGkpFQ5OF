import Avatar from './Avatar.jsx';

export default function UserRow({ user, currentUserId, onDelete }) {
  const isAdmin = user.role === 'admin';
  const isHardCodedAdmin = user.id === 'admin';
  const isSelf = user.id === currentUserId;
  const canDelete = !isHardCodedAdmin && !isSelf;

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let deleteTooltip = 'Delete user';
  if (isHardCodedAdmin) {
    deleteTooltip = 'Cannot delete the default admin';
  } else if (isSelf) {
    deleteTooltip = 'Cannot delete your own account';
  }

  return (
    <div className="flex items-center justify-between gap-4 bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar role={user.role} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-800 truncate">
              {user.displayName}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full select-none ${
                isAdmin
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">@{user.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-xs text-slate-400 hidden sm:inline">{formattedDate}</span>
        <button
          onClick={() => canDelete && onDelete(user.id)}
          disabled={!canDelete}
          title={deleteTooltip}
          className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
            canDelete
              ? 'bg-pink-50 text-pink-600 hover:bg-pink-100 cursor-pointer'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}