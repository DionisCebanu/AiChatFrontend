import { useState, useEffect, useCallback, useRef } from 'react';
import { sendMessage as sendMessageApi } from '@/services/chatService';

const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

export const useChatManager = (username) => {
  const userPrefix = username ? `user_${username}_` : '';

  const [chats, setChats] = useState(() => getFromStorage(`${userPrefix}chats`, []));
  const [currentChatId, setCurrentChatId] = useState(() => getFromStorage(`${userPrefix}currentChatId`, null));
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesCache = useRef(new Map());

  // Load initial messages for the current chat
  useEffect(() => {
    if (currentChatId) {
      if (messagesCache.current.has(currentChatId)) {
        setMessages(messagesCache.current.get(currentChatId));
      } else {
        const loadedMessages = getFromStorage(`${userPrefix}chat_${currentChatId}_messages`, []);
        messagesCache.current.set(currentChatId, loadedMessages);
        setMessages(loadedMessages);
      }
    } else {
      setMessages([]);
    }
  }, [currentChatId, userPrefix]);

  // Persist chats and currentChatId
  useEffect(() => {
    saveToStorage(`${userPrefix}chats`, chats);
  }, [chats, userPrefix]);

  useEffect(() => {
    saveToStorage(`${userPrefix}currentChatId`, currentChatId);
  }, [currentChatId, userPrefix]);


  const createChat = useCallback(() => {
    const newChat = {
      id: crypto.randomUUID(),
      name: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
    messagesCache.current.set(newChat.id, []);
    return newChat.id;
  }, []);

  const selectChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
  }, []);

  const renameChat = useCallback((chatId, newName) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, name: newName, updatedAt: new Date().toISOString() } : c));
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    localStorage.removeItem(`${userPrefix}chat_${chatId}_messages`);
    const sessions = getFromStorage('chat.sessions', {});
    delete sessions[chatId];
    saveToStorage('chat.sessions', sessions);

    if (currentChatId === chatId) {
        const nextChat = chats.filter(c => c.id !== chatId)[0];
        setCurrentChatId(nextChat ? nextChat.id : null);
    }
  }, [currentChatId, userPrefix, chats]);

  const updateMessages = useCallback((chatId, newMessages) => {
    const messagesToSave = typeof newMessages === 'function' ? newMessages(messagesCache.current.get(chatId) || []) : newMessages;
    
    messagesCache.current.set(chatId, messagesToSave.slice(-100));
    saveToStorage(`${userPrefix}chat_${chatId}_messages`, messagesToSave.slice(-100));

    if(chatId === currentChatId) {
      setMessages(messagesToSave);
    }
  }, [currentChatId, userPrefix]);

  const sendMessage = useCallback(async (chatId, messageText) => {
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: messageText,
      time: new Date().toISOString(),
    };

    const typingMessage = {
      id: crypto.randomUUID(),
      role: 'bot',
      isTyping: true,
      time: new Date().toISOString(),
    };

    updateMessages(chatId, prev => [...(prev || []), userMessage, typingMessage]);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, updatedAt: new Date().toISOString() } : c));
    setIsLoading(true);

    try {
      const response = await sendMessageApi({ message: messageText, chatId });
      const botMessage = {
        id: crypto.randomUUID(),
        role: 'bot',
        text: response.reply,
        time: new Date().toISOString(),
      };
      updateMessages(chatId, prev => [...prev.filter(m => !m.isTyping), botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        id: crypto.randomUUID(),
        role: 'error',
        text: error.message || 'An unknown error occurred.',
        time: new Date().toISOString(),
        originalMessage: messageText,
      };
      updateMessages(chatId, prev => [...prev.filter(m => !m.isTyping), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [updateMessages]);
  
  const retryMessage = useCallback(async (chatId, originalMessage) => {
      updateMessages(chatId, prev => prev.filter(m => !m.isError));
      await sendMessage(chatId, originalMessage);
  }, [updateMessages, sendMessage]);
  

  return {
    chats,
    currentChat: chats.find(c => c.id === currentChatId),
    messages,
    isLoading,
    createChat,
    selectChat,
    renameChat,
    deleteChat,
    sendMessage,
    retryMessage
  };
};