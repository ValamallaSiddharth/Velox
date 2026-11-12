import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

function TypingIndicator() {
  return (
    <div className="velox-assistant-row" style={{ marginBottom: 8 }}>
      <div className="velox-ai-avatar">✦</div>
      <div className="velox-typing-bubble">
        <span className="velox-dot" style={{ animationDelay: '0ms' }} />
        <span className="velox-dot" style={{ animationDelay: '150ms' }} />
        <span className="velox-dot" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="velox-chat-window">

      {messages.length === 0 && !isTyping && (
        <div className="velox-chat-welcome">
          <div className="velox-welcome-icon">✦</div>
          <h3 className="velox-welcome-title">Velox AI Assistant</h3>
          <p className="velox-welcome-sub">
            Ask me to recommend AI tools for your project, compare tools, or suggest the best AI stack.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}