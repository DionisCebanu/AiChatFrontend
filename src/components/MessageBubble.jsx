
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, User, Bot } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const MessageBubble = ({ message, onRetry }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const IMG_EXT = /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?(#.*)?$/i;
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = async (text, codeId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };
  const renderContent = (text) => {
  // 1) Existing "Image: <url>" lines → render as images
  if (text.includes('Image: ')) {
    const parts = text.split('\n');
    return parts.map((part, index) => {
      if (part.startsWith('Image: ')) {
        const imageUrl = part.replace('Image: ', '').trim();
        return (
          <div key={index} className="mt-2">
            <img
              src={imageUrl}
              alt="AI generated content"
              className="image-preview rounded-lg"
              loading="lazy"
              style={{ maxWidth: '100%', height: 'auto' }}
              onError={(e) => { e.currentTarget.replaceWith(createLinkFallback(imageUrl)); }}
            />
          </div>
        );
      }
      return <div key={index}>{renderTextContent(part)}</div>;
    });
  }

  // 2) NEW: detect direct image URLs in any reply and render a gallery
  const imgUrls = extractImageUrls(text);
  if (imgUrls.length) {
    const cleaned = stripUrlsFromText(text, imgUrls);
    return (
      <>
        {cleaned && <div>{renderTextContent(cleaned)}</div>}
        {renderImageGallery(imgUrls)}
      </>
    );
  }

  // 3) Fallback: normal rich text (links stay as anchors)
  return renderTextContent(text);
};


  function isImageUrl(url) {
    try {
      const u = new URL(url);
      return IMG_EXT.test(u.pathname);
    } catch {
      return false;
    }
  };

  function extractUrls(text) {
    const urlRegex = /(https?:\/\/[^\s)]+)(?=\s|$|[\)\]]|<)/g;
    const urls = [];
    let m;
    while ((m = urlRegex.exec(text)) !== null) {
      urls.push(m[1]);
    }
    return Array.from(new Set(urls));
  }

  function extractImageUrls(text) {
    return extractUrls(text).filter(isImageUrl);
  }

  function stripUrlsFromText(text, urls) {
    let out = text;
    for (const u of urls) {
      // remove as standalone or bullet link lines
      out = out.replace(new RegExp(`\\s*-?\\s*${u.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\s*`, 'g'), ' ');
    }
    return out.trim();
  }

  function renderImageGallery(urls) {
  return (
    <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
      {urls.slice(0, 8).map((src, i) => (
        <a key={src + i} href={src} target="_blank" rel="noopener noreferrer" title={src}>
          <img
            src={src}
            alt="image result"
            loading="lazy"
            className="rounded-lg"
            style={{ width: '100%', height: 140, objectFit: 'cover', background: 'var(--bg-secondary)' }}
            onError={(e) => { e.currentTarget.closest('a')?.replaceWith(createLinkFallback(src)); }}
          />
        </a>
      ))}
    </div>
  );
}

// Fallback: replace broken <img> with a clickable link
  function createLinkFallback(src) {
      const a = document.createElement('a');
      a.href = src;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = src;
      a.style.color = 'var(--input-focus)';
      a.style.textDecoration = 'underline';
      return a;
  }



  const renderTextContent = (text) => {
    // Handle code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(renderInlineFormatting(text.slice(lastIndex, match.index)));
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2];
      const codeId = `code-${Date.now()}-${Math.random()}`;
      
      parts.push(
        <div key={codeId} className="code-block">
          <button
            onClick={() => copyToClipboard(code, codeId)}
            className="copy-button"
            title="Copy code"
          >
            {copiedCode === codeId ? '✓' : <Copy className="w-3 h-3" />}
          </button>
          <div className="text-xs text-muted mb-2">{language}</div>
          <pre className="whitespace-pre-wrap overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(renderInlineFormatting(text.slice(lastIndex)));
    }

    return parts.length > 0 ? parts : renderInlineFormatting(text);
  };

  const renderInlineFormatting = (text) => {
    // Handle bold, italic, and links
    const parts = [];
    let currentText = text;

    // Handle URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    currentText = currentText.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--input-focus); text-decoration: underline;">${url}</a>`;
    });

    // Handle bold
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic
    currentText = currentText.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Preserve line breaks
    currentText = currentText.replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: currentText }} />;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`min-w-0 max-w-[80%] md:max-w-[70%] ${isError ? 'error-message' : isUser ? 'user-message' : 'bot-message'} rounded-2xl px-4 py-3 shadow-sm`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                 style={{ 
                   backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
                   color: isUser ? 'var(--user-text)' : 'var(--text-primary)'
                 }}>
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium">
                {isUser ? 'You' : 'Bot'}
              </span>
              <span className="text-xs text-muted">
                {formatTime(message.time)}
              </span>
            </div>
            
            <div className="text-sm leading-relaxed message-text break-words [overflow-wrap:anywhere] max-w-full">
              {isError ? (
                <div className="space-y-2">
                  <div>{message.text}</div>
                  <button
                    onClick={() => onRetry(message.originalMessage)}
                    className="inline-flex items-center space-x-1 text-xs px-2 py-1 rounded bg-opacity-20 hover:bg-opacity-30 transition-colors"
                    style={{ backgroundColor: 'var(--error-text)' }}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>
              ) : (
                renderContent(message.text)
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageBubble;
