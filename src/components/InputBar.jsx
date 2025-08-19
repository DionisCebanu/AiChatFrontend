
import React, { forwardRef, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

const InputBar = forwardRef(({ value, onChange, onSend, isLoading, isEmpty }, ref) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 6 * 24; // 6 lines * 24px line height
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [value]);

  // Forward ref to textarea
  useEffect(() => {
    if (ref) {
      ref.current = textareaRef.current;
    }
  }, [ref]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line
        return;
      } else if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd + Enter = Send
        e.preventDefault();
        handleSend();
      } else {
        // Enter = Send
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value);
    }
  };

  const canSend = value.trim() && !isLoading;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-t border-color"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="flex space-x-3 items-center">
        <div className="flex-1">
          <label htmlFor="message-input" className="sr-only">
            Type your message
          </label>
          <div className="input-area rounded-xl transition-all duration-200">
            <textarea
              id="message-input"
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isEmpty ? "Say hi 👋" : "Type your message..."}
              className="w-full px-4 py-3 bg-transparent resize-none outline-none text-sm leading-6"
              style={{ 
                color: 'var(--text-primary)',
                minHeight: '48px',
                maxHeight: '144px'
              }}
              rows={1}
              disabled={isLoading}
            />
          </div>
          
        </div>
        
        <motion.button
          whileHover={canSend ? { scale: 1.05 } : {}}
          whileTap={canSend ? { scale: 0.95 } : {}}
          onClick={handleSend}
          disabled={!canSend}
          className={`p-3 rounded-xl transition-all duration-200 ${
            canSend 
              ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>
      <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-xs text-muted">
            Enter to send • Shift+Enter for new line
          </span>
          <span className="text-xs text-muted">
            {value.length}/2000
          </span>
      </div>
    </motion.div>
  );
});

InputBar.displayName = 'InputBar';

export default InputBar;
