import React, { useEffect, useRef , useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import ChatSidebar from '@/components/ChatSidebar';
import ChatView from '@/components/ChatView';
import { useChatManager } from '@/hooks/useChatManager';
import { Menu } from 'lucide-react';
import {Button} from '@/components/ui/button';

const ChatPage = () => {
  const { user, theme, toggleTheme, logout } = useAuth();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    chats,
    currentChat,
    messages,
    isLoading,
    createChat,
    selectChat,
    renameChat,
    deleteChat,
    sendMessage: sendChatMessage,
    retryMessage
  } = useChatManager(user?.username);

  // Guard so initial redirect/create only runs once when no chatId in URL
  const didInitRef = useRef(false);

   useEffect(() => {
    if (!user) return;

    // 1) If URL has a chatId, make state follow it (no extra navigate here)
    if (chatId) {
      const exists = chats.some(c => String(c.id) === String(chatId));
      if (exists) {
        if (!currentChat || String(currentChat.id) !== String(chatId)) {
          selectChat(chatId);
        }
      } else if (chats.length > 0) {
        // Invalid chatId → push most recent valid instead of looping
        const mostRecent = [...chats].sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        )[0];
        if (mostRecent && String(mostRecent.id) !== String(chatId)) {
          navigate(`/chat/${mostRecent.id}`, { replace: true });
        }
      }
      return; // Important: don't also try to create/select below
    }

    // 2) No chatId in URL → once, go to most recent or create one
    if (!didInitRef.current) {
      if (chats.length > 0) {
        const mostRecent = [...chats].sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        )[0];
        navigate(`/chat/${mostRecent.id}`, { replace: true });
      } else {
        const newChatId = createChat();
        if (newChatId) navigate(`/chat/${newChatId}`, { replace: true });
      }
      didInitRef.current = true;
    }
  }, [user, chatId, chats, currentChat, selectChat, navigate, createChat]);



  // Navigate when a chat is selected
  /* useEffect(() => {
    if (currentChat && currentChat.id !== chatId) {
        navigate(`/chat/${currentChat.id}`);
    }
  }, [currentChat, chatId, navigate]); */

  if (!user) {
    return null; // Or a loading spinner, though ProtectedRoute should handle this.
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hamburger (mobile only) */}
      <div className="md:hidden absolute top-5 left-5 z-10 bg-[rgba(163,163,163,0.4)] rounded-3xl">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <Menu className="h-6 w-6" />
          </Button>
      </div>
      <ChatSidebar 
        chats={chats}
        currentChatId={currentChat?.id}
        onNewChat={createChat}
        onSelectChat={selectChat}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
        user={user}
        logout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        side="left"
      />
      <div className="flex-1 min-w-0 flex flex-col">
        {currentChat ? (
          <ChatView
            key={currentChat.id} // Re-mount ChatView when chat changes
            chat={currentChat}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendChatMessage}
            onRetry={retryMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            {chats.length > 0 ? "Select a chat to get started." : "Create a new chat!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;