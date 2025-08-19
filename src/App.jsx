import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/auth/useAuth.jsx';
import HomePage from '@/pages/Home.jsx';
import ChatPage from '@/pages/ChatPage.jsx';
import AuthPage from '@/auth/AuthPage';
import ProtectedRoute from '@/auth/ProtectedRoute.jsx';
import '@/styles.css';

function App() {
  return (
    <AuthProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/chat/:chatId" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </motion.div>
      <Toaster />
    </AuthProvider>
  );
}

export default App;