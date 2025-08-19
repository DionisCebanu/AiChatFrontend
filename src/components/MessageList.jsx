import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '@/components/MessageBubble';
import TypingDots from '@/components/TypingDots';

const MessageList = ({ messages, onRetry, messagesEndRef }) => {
  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto scrollbar p-4 space-y-4">
      <AnimatePresence mode="popLayout">
        {isEmpty ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl"
            >
              🤖
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Say hi 👋
              </h2>
              <p className="text-muted max-w-md">
                Start a conversation with the AI assistant. Ask questions, get help, or just chat!
              </p>
            </motion.div>
          </motion.div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {message.isTyping ? (
                <TypingDots />
              ) : (
                <MessageBubble 
                  message={message} 
                  onRetry={onRetry}
                />
              )}
            </motion.div>
          ))
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
