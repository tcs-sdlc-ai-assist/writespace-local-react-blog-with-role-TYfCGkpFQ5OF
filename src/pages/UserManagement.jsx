import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, getUsers, setUsers, getPosts, setPosts } from '../utils/storage.js';
import { isAuthenticated, isAdmin } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';
import UserRow from '../components/UserRow.jsx';

export default function UserManagement() {
  const navigate = useNavigate();
  const session = getSession();

  const [users, setUsersState] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
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

    setUsersState(getUsers());
  }, [navigate]);

  const hardCodedAdmin = {
    id: 'admin',
    displayName: 'Admin',
    username: 'admin',
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString(),
  };

  const allUsers = [hardCodedAdmin, ...users];

  const resetForm = () => {
    setDisplayName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRole('user');
    setError('');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();

    if (!trimmedDisplayName || !trimmedUsername || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (trimmedUsername === 'admin') {
      setError('Username not available');
      return;
    }

    if (users.some((u) => u.username === trimmedUsername)) {
      setError('Username already exists');
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password,
      role,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUsersState(updatedUsers);
    resetForm();
    setShowCreateForm(false);
  };

  const handleDeleteUser = (userId) => {
    setShowConfirm(userId);
  };

  const confirmDelete = () => {
    const userId = showConfirm;
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    setUsersState(updatedUsers);

    // Also remove posts by this user
    const posts = getPosts();
    const updatedPosts = posts.filter((p) => p.authorId !== userId);
    setPosts(updatedPosts);

    setShowConfirm(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              👥 User Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {allUsers.length} user{allUsers.length === 1 ? '' : 's'} registered
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm((prev) => !prev);
              if (showCreateForm) resetForm();
            }}
            className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            {showCreateForm ? '✕ Cancel' : '➕ Create User'}
          </button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Create New User
            </h2>

            {error && (
              <div className="bg-pink-50 border border-pink-200 text-pink-700 text-sm font-medium rounded-lg px-4 py-3 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newUsername"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Username
                  </label>
                  <input
                    id="newUsername"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newConfirmPassword"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="newConfirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full md:w-48 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="text-sm font-medium text-slate-600 px-6 py-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        {allUsers.length > 0 ? (
          <div className="space-y-3">
            {allUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                currentUserId={session?.userId}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-5xl select-none mb-4">👥</span>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              No users yet
            </h2>
            <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
              Create the first user to get started.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Create First User
            </button>
          </div>
        )}
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
                  Delete User?
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  This action cannot be undone. The user and all their posts will be permanently removed.
                </p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={confirmDelete}
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