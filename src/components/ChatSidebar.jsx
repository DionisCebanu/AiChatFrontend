import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Edit2, Trash2, Check, X, LogOut, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from './ThemeToggle';

/**
 * Props:
 * - mobileOpen?: boolean       // controls mobile drawer visibility
 * - onClose?: () => void       // close callback for mobile drawer
 * - side?: 'left' | 'right'    // slide side for mobile (default 'left')
 */
const ChatSidebar = ({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  user,
  logout,
  theme,
  toggleTheme,
  mobileOpen = false,
  onClose = () => {},
  side = 'left',
}) => {
  const navigate = useNavigate();

  const sortedChats = useMemo(() => {
    return [...(chats || [])].sort(
      (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );
  }, [chats]);

  const handleNewChat = useCallback(() => {
    const newId = onNewChat();
    if (newId) navigate(`/chat/${newId}`);
    if (mobileOpen) onClose();
  }, [onNewChat, navigate, mobileOpen, onClose]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const initial = (user?.username?.[0] || '?').toUpperCase();

  // Lock scroll while drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // ---- Desktop static sidebar (md+) ----
  const sidebarContent = (
    <>
      <div className="p-4 border-b border-color flex items-center justify-between">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <Button variant="ghost" size="icon" onClick={handleNewChat} aria-label="New chat">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar">
        <AnimatePresence initial={false}>
          {sortedChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === currentChatId}
              onSelect={() => {
                onSelectChat?.(chat.id);
                navigate(`/chat/${chat.id}`);
                if (mobileOpen) onClose();
              }}
              onRename={onRenameChat}
              onDelete={onDeleteChat}
            />
          ))}
          {sortedChats.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} className="px-4 py-6 text-sm"
                        style={{ color: 'var(--text-muted)' }}>
              No conversations yet.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-color mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <span className="text-sm font-medium truncate">{user?.username || 'User'}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 flex items-center justify-between">
                <span>Theme</span>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );

  const panelX = side === 'right' ? 'right-0' : 'left-0';
  const initialX = side === 'right' ? '100%' : '-100%';

  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside
        className="hidden md:flex w-72 min-w-72 shrink-0 h-full flex-col border-r border-color"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile: off-canvas drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 md:hidden bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Sliding panel */}
            <motion.aside
              key="drawer"
              className={`fixed inset-y-0 ${panelX} md:hidden z-50 w-[86vw] max-w-xs flex flex-col border-r border-color`}
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              initial={{ x: initialX, opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: initialX, opacity: 0.9 }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            >
              <div className="p-4 border-b border-color flex items-center justify-between">
                <h2 className="text-lg font-semibold">Conversations</h2>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={handleNewChat} aria-label="New chat">
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const ChatItem = ({ chat, isActive, onSelect, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(chat.name);
  const inputRef = useRef(null);

  const handleRename = () => {
    const v = (newName || '').trim();
    if (v && v !== chat.name) onRename(chat.id, v);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRename();
    else if (e.key === 'Escape') {
      setNewName(chat.name);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={[
        'group flex items-center p-3 m-2 rounded-lg cursor-pointer transition-colors duration-200 min-w-0',
        isActive ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      ].join(' ')}
      style={!isActive ? { color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)' } : {}}
      onClick={() => !isEditing && onSelect()}
    >
      <MessageSquare className="h-5 w-5 mr-3 flex-shrink-0" />
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="h-8 text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 min-w-0 truncate text-sm font-medium">{chat.name}</span>
      )}

      {isActive && (
        <div className="flex items-center ml-2 space-x-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRename}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
                <Edit2 className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-red-500/20 hover:text-red-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the chat &quot;{chat.name}&quot;. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => onDelete(chat.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ChatSidebar;
