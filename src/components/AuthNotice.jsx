import React from 'react';
import { Info } from 'lucide-react';

const AuthNotice = () => {
  return (
    <div 
      className="mt-6 p-3 rounded-lg flex items-center space-x-3 text-xs"
      style={{ backgroundColor: 'var(--bot-bubble)', color: 'var(--bot-text)' }}
    >
      <Info className="w-8 h-8 flex-shrink-0" />
      <div>
        <strong>Demo Authentication Only.</strong>
        <p>This is a mock authentication system using local storage. For production applications, always implement robust, server-side authentication.</p>
      </div>
    </div>
  );
};

export default AuthNotice;