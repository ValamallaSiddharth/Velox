import React, { useState, useCallback } from 'react';
import { useChatbot } from './ChatbotContext';
import { generateResponse, extractContextHints } from './chatResponder';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

let msgId = 0;
const nextId = () => ++msgId;

const WELCOME = {
  id: nextId(),
  role: 'assistant',
  response: {
    type: 'greeting',
    intro: "👋 Hi! I'm **Velox AI** — your AI project recommendation assistant.",
    bullets: [
      '🚀 Build a custom AI stack for any project idea',
      '⚖️ Compare AI tools side-by-side',
      '🎯 Get skill-level & budget-aware recommendations',
      '📚 Specialised stacks: study apps, SaaS, portfolios, dashboards & more',
    ],
    sections: [],
    outro: 'Try: *"I want to build a study app as a beginner"* or *"Compare ChatGPT vs Claude"*',
  },
};

export default function Chatbot() {
  const { isOpen, close } = useChatbot();
  const [messages, setMessages] = useState([WELCOME]);
  const [isTyping, setIsTyping]  = useState(false);

  const [context, setContext] = useState({
    messageCount: 0,
    skillLevel: null,
    budget: null,
    techStack: [],
  });

  const handleSend = useCallback((text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { id: nextId(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const hints = extractContextHints(text.toLowerCase());

    const updatedCtx = {
      ...context,
      messageCount: context.messageCount + 1,
      skillLevel: hints.skillLevel || context.skillLevel,
      budget:     hints.budget     || context.budget,
      techStack:  hints.techStack  ? [...new Set([...context.techStack, ...hints.techStack])] : context.techStack,
    };
    setContext(updatedCtx);

    setTimeout(() => {
      const response = generateResponse(text, updatedCtx);
      setMessages(prev => [...prev, { id: nextId(), role: 'assistant', response }]);
      setIsTyping(false);
    }, 750 + Math.random() * 700);
  }, [isTyping, context]);

  const handleClear = () => {
    msgId = 0;
    setMessages([{ ...WELCOME, id: nextId() }]);
    setIsTyping(false);
    setContext({ messageCount: 0, skillLevel: null, budget: null, techStack: [] });
  };

  return (
    <>

      <div
        className={`velox-chatbot-panel${isOpen ? ' velox-chatbot-open' : ''}`}
        aria-hidden={!isOpen}
      >

        <div className="velox-chat-header">
          <div className="velox-chat-header-left">
            <div className="velox-chat-avatar-pill">✦</div>
            <div>
              <div className="velox-chat-title">Velox AI</div>
              <div className="velox-chat-subtitle">
                Project Recommendation Assistant

                {context.skillLevel && (
                  <span style={{ marginLeft: 6, color: '#22D3EE', fontSize: '0.6rem', fontWeight: 700 }}>
                    · {context.skillLevel}
                  </span>
                )}
                {context.budget === 'low' && (
                  <span style={{ marginLeft: 4, color: '#6ee7b7', fontSize: '0.6rem', fontWeight: 700 }}>
                    · free tools
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="velox-chat-icon-btn"
              onClick={handleClear}
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              🗑
            </button>
            <button
              className="velox-chat-icon-btn"
              onClick={close}
              title="Close assistant"
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>
        </div>

        {(context.skillLevel || context.budget || context.techStack.length > 0) && (
          <div className="velox-context-bar">
            <span className="velox-context-label">🧠 Remembering:</span>
            {context.skillLevel && <span className="velox-context-chip">{context.skillLevel}</span>}
            {context.budget === 'low' && <span className="velox-context-chip">free tools</span>}
            {context.budget === 'high' && <span className="velox-context-chip">premium ok</span>}
            {context.techStack.map(t => <span key={t} className="velox-context-chip">{t}</span>)}
          </div>
        )}

        <ChatWindow messages={messages} isTyping={isTyping} />

        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>

      {isOpen && (
        <div
          className="velox-chatbot-backdrop"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
}