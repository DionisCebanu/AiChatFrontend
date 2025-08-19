import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Zap, Sun, Image as ImageIcon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/auth/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, theme, toggleTheme, isAuthLoading } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <Helmet>
        <title>Welcome to AI Chat</title>
        <meta name="description" content="An intelligent AI assistant for conversations, image generation, weather updates, and more." />
      </Helmet>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="font-semibold">AI Chat</span>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        <main className="flex-1 flex items-center justify-center text-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <motion.div
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-2xl mb-6 shadow-lg"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <MessageSquare className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
              Your Intelligent AI Assistant
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
              Get instant answers, generate images, check the weather, find quick facts, translate languages, and so much more.
            </p>

            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isAuthLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
              >
                {isAuthLoading ? 'Loading...' : user ? 'Continue to Chat' : 'Get Started'}
              </Button>
            </div>

            <div className="mt-12 flex justify-center items-center flex-wrap gap-4 text-muted text-sm">
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-indigo-400" /> Quick Facts</span>
                <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-indigo-400" /> Image Generation</span>
                <span className="flex items-center gap-2"><Sun className="w-4 h-4 text-indigo-400" /> Weather Updates</span>
                <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400" /> Translation</span>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default HomePage;