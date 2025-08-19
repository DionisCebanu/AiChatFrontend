import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MessageList from '@/components/MessageList';
import InputBar from '@/components/InputBar';
import { toast } from '@/components/ui/use-toast';

function ChatView({ chat, messages, isLoading, onSendMessage, onRetry }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chat]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;
    
    setInput('');
    try {
      await onSendMessage(chat.id, messageText);
    } catch (error) {
       toast({
        title: "Error Sending Message",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleRetry = (originalMessage) => {
    onRetry(chat.id, originalMessage);
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
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
      </main>
    </div>
  );
}

export default ChatView;