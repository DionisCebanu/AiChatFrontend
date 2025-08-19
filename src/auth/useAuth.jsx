import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getUsers, saveUsers, findUserByLogin,
  saveSession, getSession, clearSession,
  getTheme, setTheme as saveThemeInStorage
} from '@/services/storage';

const AuthContext = createContext(null);

const arrayBufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return arrayBufferToHex(hashBuffer);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(getTheme());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const session = getSession();
      if (session && session.username) {
        const users = getUsers();
        const sessionUser = users.find(u => u.username === session.username);
        if (sessionUser) {
          setUser({ username: sessionUser.username, email: sessionUser.email });
        } else {
          clearSession();
        }
      }
    } catch(e) {
      console.error("Failed to initialize auth state", e);
      clearSession();
    } finally {
      setIsAuthLoading(false);
    }
  }, []);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveThemeInStorage(theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
  };

  const signup = async ({ username, email, password /* remember unused here */ }) => {
     const users = getUsers();
     
     if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
       throw new Error('Username already exists.');
     }
     if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
       throw new Error('Email is already in use.');
     }

     const passHash = await hashPassword(password);
     const newUser = {
       username,
       email,
       passHash,
       createdAt: new Date().toISOString()
     };
     
     saveUsers([...users, newUser]);
    // ✔️ Do NOT login here. Return a simple success indicator.
    return { ok: true };
  };

  const login = async ({ login: loginIdentifier, password, remember }) => {
    const userToLogin = findUserByLogin(loginIdentifier);

    if (!userToLogin) {
      throw new Error('Invalid username or password.');
    }

    const passHash = await hashPassword(password);
    if (passHash !== userToLogin.passHash) {
      throw new Error('Invalid username or password.');
    }

    const sessionId = crypto.randomUUID();
    saveSession({ username: userToLogin.username, sessionId, remember });
    setUser({ username: userToLogin.username, email: userToLogin.email });
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = { user, signup, login, logout, theme, toggleTheme, isAuthLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};