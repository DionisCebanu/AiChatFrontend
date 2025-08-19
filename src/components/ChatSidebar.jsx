import React, { useState } from 'react';
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
} from "@/components/ui/dropdown-menu"
import ThemeToggle from './ThemeToggle';

const ChatSidebar = ({ chats, currentChatId, onNewChat, onSelectChat, onRenameChat, onDeleteChat, user, logout, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleNewChat = () => {
    const newId = onNewChat();
    navigate(`/chat/${newId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.div 
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-72 flex flex-col h-full border-r border-color"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="p-4 border-b border-color flex justify-between items-center">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <Button variant="ghost" size="icon" onClick={handleNewChat}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar">
        <AnimatePresence>
          {chats.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(chat => (
            <ChatItem 
              key={chat.id}
              chat={chat}
              isActive={chat.id === currentChatId}
              onSelect={() => navigate(`/chat/${chat.id}`)}
              onRename={onRenameChat}
              onDelete={onDeleteChat}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-color mt-auto">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium truncate">{user.username}</span>
           </div>
           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 flex items-center justify-between">
                  <span>Theme</span>
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

         </div>
      </div>
    </motion.div>
  );
};

const ChatItem = ({ chat, isActive, onSelect, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(chat.name);
  const inputRef = React.useRef(null);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== chat.name) {
      onRename(chat.id, newName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(chat.name);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
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
      className={`flex items-center p-3 m-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
      style={isActive ? {} : {color: 'var(--text-primary)', backgroundColor: isActive ? '' : 'var(--bg-primary)'}}
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
        />
      ) : (
        <span className="flex-1 truncate text-sm font-medium">{chat.name}</span>
      )}

      {isActive && (
        <div className="flex items-center ml-2 space-x-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRename}><Check className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(false)}><X className="h-4 w-4" /></Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}><Edit2 className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-500/20 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the chat "{chat.name}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(chat.id)} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
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