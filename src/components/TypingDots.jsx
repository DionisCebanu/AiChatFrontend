
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingDots = () => {
  return (
    <div className="flex justify-start mb-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bot-message rounded-2xl px-4 py-3 shadow-sm"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                 style={{ 
                   backgroundColor: 'var(--bg-secondary)',
                   color: 'var(--text-primary)'
                 }}>
              <Bot className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium">Bot</span>
              <span className="text-xs text-muted">typing...</span>
            </div>
            
            <div className="flex space-x-1">
              <div 
                className="w-2 h-2 rounded-full typing-dot"
                style={{ backgroundColor: 'var(--text-muted)' }}
              />
              <div 
                className="w-2 h-2 rounded-full typing-dot"
                style={{ backgroundColor: 'var(--text-muted)' }}
              />
              <div 
                className="w-2 h-2 rounded-full typing-dot"
                style={{ backgroundColor: 'var(--text-muted)' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TypingDots;
