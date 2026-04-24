import { getUsers, setUsers, getSession, setSession, clearSession } from './storage.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session = { userId: 'admin', username: 'admin', displayName: 'Admin', role: 'admin' };
    setSession(session);
    return { success: true, session };
  }

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const session = { userId: user.id, username: user.username, displayName: user.displayName, role: user.role };
    setSession(session);
    return { success: true, session };
  }

  return { success: false, error: 'Invalid credentials' };
}

export function register(displayName, username, password) {
  if (!displayName || !username || !password) {
    return { success: false, error: 'All fields required' };
  }

  if (password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters' };
  }

  if (username === ADMIN_USERNAME) {
    return { success: false, error: 'Username not available' };
  }

  const users = getUsers();

  if (users.some(u => u.username === username)) {
    return { success: false, error: 'Username already exists' };
  }

  const user = {
    id: crypto.randomUUID(),
    displayName,
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  setUsers([...users, user]);

  const session = { userId: user.id, username: user.username, displayName: user.displayName, role: 'user' };
  setSession(session);

  return { success: true, session };
}

export function logout() {
  clearSession();
}

export function isAuthenticated() {
  return getSession() !== null;
}

export function isAdmin() {
  const session = getSession();
  return session !== null && session.role === 'admin';
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) {
    return null;
  }

  if (session.userId === 'admin') {
    return { id: 'admin', displayName: 'Admin', username: 'admin', role: 'admin' };
  }

  const users = getUsers();
  const user = users.find(u => u.id === session.userId);
  return user || null;
}