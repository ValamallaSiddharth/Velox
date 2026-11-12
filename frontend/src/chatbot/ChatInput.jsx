import React, { useState } from 'react';

const QUICK_CHIPS = [
  '🚀 Build a SaaS product',
  '💪 Fitness tracker app',
  '🎨 Best UI Design tools',
  '💻 Best coding tools',
  '⚖️ Compare ChatGPT vs Claude',
  '🎬 Content creator tools',
  '📚 Build a study app',
  '🌐 Social media app',
  '⚡ Productivity app',
];

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleChip = (chip) => {
    const text = chip.replace(/^[\p{Emoji}\s]+/u, '').trim();
    onSend(text);
  };

  return (
    <div className="velox-chat-input-area">
      {}
      <div className="velox-quick-chips">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            className="velox-quick-chip"
            onClick={() => handleChip(chip)}
            disabled={disabled}
          >
            {chip}
          </button>
        ))}
      </div>

      {}
      <div className="velox-input-row">
        <textarea
          className="velox-chat-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask me anything about AI tools..."
          rows={1}
          disabled={disabled}
        />
        <button
          className={`velox-send-btn${disabled ? ' velox-send-disabled' : ''}`}
          onClick={send}
          disabled={disabled}
          aria-label="Send message"
        >
          {disabled ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
}