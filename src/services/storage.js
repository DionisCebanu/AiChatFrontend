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
  // Using sessionStorage for non-"remember me" sessions might be an option, but for this implementation
  // we'll stick to localStorage and check the 'remember' flag on load.
  // This simplifies the logic in useAuth.
  localStorage.setItem('session', JSON.stringify(sessionData));
};

export const getSession = () => {
  try {
    const sessionJson = localStorage.getItem('session');
    if (!sessionJson) return null;
    
    const session = JSON.parse(sessionJson);
    // If "remember me" wasn't checked, we'd ideally clear this on browser close.
    // Since we can't reliably do that, we check it in the useAuth hook.
    // For this demo, we'll always treat sessions as persistent if they exist.
    return session;
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem('session');
};

// --- Message Management ---
export const loadMessages = (username) => {
  if (!username) return [];
  try {
    const messagesJson = localStorage.getItem(`messages_${username}`);
    return messagesJson ? JSON.parse(messagesJson) : [];
  } catch (e) {
    return [];
  }
};

export const saveMessages = (username, messages) => {
  if (!username) return;
  // Keep only the last 100 messages to prevent localStorage from getting too large.
  const messagesToSave = messages.slice(-100);
  localStorage.setItem(`messages_${username}`, JSON.stringify(messagesToSave));
};


// --- Theme Management ---
export const getTheme = () => {
  return localStorage.getItem('chat-theme') || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem('chat-theme', theme);
};