
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-80"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border)'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        ) : (
          <Sun className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
