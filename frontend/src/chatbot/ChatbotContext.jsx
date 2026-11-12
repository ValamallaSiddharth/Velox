import React, { createContext, useContext, useState } from 'react';

const ChatbotContext = createContext(null);

export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((v) => !v);
  const open   = () => setIsOpen(true);
  const close  = () => setIsOpen(false);

  return (
    <ChatbotContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error('useChatbot must be used within <ChatbotProvider>');
  return ctx;
}
