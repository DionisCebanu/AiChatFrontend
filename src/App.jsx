import React from 'react';
import { useEffect, useMemo, useRef } from 'react';
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
    // Compute backend base once (handles both absolute and relative VITE_API_URL)
  const backendBase = "https://ai-chat-hbt3.onrender.com";

  // 1) Stable cache-buster created once
  const warmSrc = useMemo(
    () => `${backendBase}/health?ts=${Date.now()}`,
    [backendBase]
  );

  // 2) Guard prewarm effect against StrictMode double-invoke
  const warmedRef = useRef(false);
  useEffect(() => {
    if (warmedRef.current) return;
    warmedRef.current = true;

    // optional backup ping; runs once per page load
    setTimeout(() => {
      new Image().src = `${backendBase}/?ts=${Date.now()}`;
    }, 800);
  }, []);

  return (
    <AuthProvider>
      {/* fires immediately on first paint too (works even if effect is delayed) */}
      <img
        src={warmSrc}
        alt=""
        width={1}
        height={1}
        loading="eager"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />

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