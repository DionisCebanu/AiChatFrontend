import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/auth/useAuth';

const Header = ({ theme, onToggleTheme }) => {
  const { user, logout } = useAuth();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between p-4 border-b border-color"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
        >
          AI
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Mini AI Chat
        </motion.h1>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-2 text-sm text-muted">
            <User className="w-4 h-4" />
            <span>{user.username}</span>
          </div>
        )}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        {user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-80 flex items-center space-x-2"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)'
            }}
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};

export default Header;