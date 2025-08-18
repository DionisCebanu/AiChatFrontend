import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/auth/useAuth';
import { loadMessages, saveMessages } from '@/services/storage';
import Header from '@/components/Header';
import MessageList from '@/components/MessageList';
import InputBar from '@/components/InputBar';
import { sendMessage } from '@/services/chatService';
import { toast } from '@/components/ui/use-toast';

function ChatView() {
  const { user, theme, toggleTheme } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const userMessages = loadMessages(user.username);
      setMessages(userMessages);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      saveMessages(user.username, messages);
    }
  }, [messages, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: messageText,
      time: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const typingMessage = {
      id: Date.now() + 1,
      role: 'bot',
      text: '',
      time: new Date().toISOString(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const session = JSON.parse(localStorage.getItem('session'));
      const response = await sendMessage({
        message: messageText,
        sessionId: session?.sessionId
      });

      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isTyping);
        return [...newMessages, {
          id: Date.now() + 2,
          role: 'bot',
          text: response.reply,
          time: new Date().toISOString()
        }];
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isTyping);
        return [...newMessages, {
          id: Date.now() + 2,
          role: 'error',
          text: 'Failed to send message. Please try again.',
          time: new Date().toISOString(),
          originalMessage: messageText
        }];
      });

      toast({
        title: "Connection Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async (originalMessage) => {
    setMessages(prev => prev.filter(msg => !msg.isError));
    await handleSendMessage(originalMessage);
  };

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1 flex justify-center p-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl flex flex-col h-[calc(100vh-120px)]"
        >
          <div className="chat-container flex-1 rounded-2xl overflow-hidden flex flex-col">
            <MessageList 
              messages={messages}
              onRetry={handleRetry}
              messagesEndRef={messagesEndRef}
            />
            <InputBar
              ref={inputRef}
              value={input}
              onChange={setInput}
              onSend={handleSendMessage}
              isLoading={isLoading}
              isEmpty={messages.length === 0}
            />
          </div>
        </motion.div>
      </main>
    </>
  );
}

export default ChatView;