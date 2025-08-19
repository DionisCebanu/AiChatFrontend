// This file provides helper functions for interacting with localStorage.
// Note: For a real application, data should be stored on a secure server, not in localStorage.

// --- User Management ---
export const getUsers = () => {
  try {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const findUserByLogin = (login) => {
  const users = getUsers();
  const normalizedLogin = login.toLowerCase();
  return users.find(u => 
    u.username.toLowerCase() === normalizedLogin || 
    u.email.toLowerCase() === normalizedLogin
  );
};

// --- Session Management ---
export const saveSession = ({ username, sessionId, remember }) => {
  const sessionData = { username, sessionId, remember, createdAt: new Date().toISOString() };
  localStorage.setItem('session', JSON.stringify(sessionData));
};

export const getSession = () => {
  try {
    const sessionJson = localStorage.getItem('session');
    if (!sessionJson) return null;
    
    const session = JSON.parse(sessionJson);
    return session;
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem('session');
};

// --- Theme Management ---
export const getTheme = () => {
    const storedTheme = localStorage.getItem('chat-theme');
    if (storedTheme) {
        return storedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem('chat-theme', theme);
};