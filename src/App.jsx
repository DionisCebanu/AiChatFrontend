import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import ProtectedView from '@/auth/ProtectedView';
import AuthPage from '@/auth/AuthPage';
import ChatView from '@/components/ChatView';
import { AuthProvider } from '@/auth/useAuth';
import '@/styles.css';

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Mini AI Chat</title>
        <meta name="description" content="Modern AI chat interface with intelligent responses and beautiful design" />
        <meta property="og:title" content="Mini AI Chat" />
        <meta property="og:description" content="Modern AI chat interface with intelligent responses and beautiful design" />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <ProtectedView fallback={<AuthPage />}>
          <ChatView />
        </ProtectedView>
      </motion.div>
        
      <Toaster />
    </AuthProvider>
  );
}

export default App;