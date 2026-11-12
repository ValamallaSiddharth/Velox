import React from 'react';
import { getLogoFallback } from '../data/tools';

function ToolChip({ tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="velox-chat-chip"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={tool.logo}
        alt=""
        className="velox-chat-chip-img"
        onError={(e) => {
          e.target.src = getLogoFallback(tool.url);
          e.target.onerror = () => { e.target.style.display = 'none'; };
        }}
      />
      <span className="velox-chat-chip-name">{tool.name}</span>
      <span className="velox-chat-chip-cat">{tool.category}</span>
      <span className="velox-chat-chip-arrow">↗</span>
    </a>
  );
}

function ComparisonCards({ tools }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tools.map((tool, i) => (
        <React.Fragment key={tool.id}>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="velox-comp-card"
          >
            <img
              src={tool.logo}
              alt=""
              className="velox-comp-img"
              onError={(e) => {
                e.target.src = getLogoFallback(tool.url);
                e.target.onerror = () => { e.target.style.display = 'none'; };
              }}
            />
            <div className="velox-comp-name">{tool.name}</div>
            <div className="velox-comp-cat">{tool.category}</div>
            <div className="velox-comp-rating">⭐ {tool.rating}</div>
            <p className="velox-comp-desc">{tool.description}</p>
          </a>
          {i === 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, color: '#9B40FF',
              background: 'rgba(139,47,232,0.12)', border: '1px solid rgba(139,47,232,0.3)',
              borderRadius: 8, padding: '4px 8px', alignSelf: 'center',
            }}>VS</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function RichText({ text }) {
  if (!text) return null;
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} style={{ color: '#f1f5f9' }}>{part}</strong>
          : <React.Fragment key={i}>{part.split(/\*(.*?)\*/g).map((p, j) =>
              j % 2 === 1
                ? <em key={j} style={{ color: '#94a3b8' }}>{p}</em>
                : p
            )}</React.Fragment>
      )}
    </>
  );
}

function AssistantBubble({ response }) {
  if (!response) return null;
  return (
    <div className="velox-assistant-bubble">
      {response.intro && (
        <p className="velox-msg-intro"><RichText text={response.intro} /></p>
      )}

      {response.bullets && (
        <ul className="velox-bullet-list">
          {response.bullets.map((b, i) => (
            <li key={i} className="velox-bullet-item">{b}</li>
          ))}
        </ul>
      )}

      {response.type === 'comparison' && response.comparison && (
        <ComparisonCards tools={response.comparison} />
      )}

      {response.sections && response.sections.map((sec, si) => (
        <div key={si} className="velox-section">
          <div className="velox-section-label">{sec.label}</div>
          {sec.tools && sec.tools.length > 0 && (
            <div className="velox-chip-list">
              {sec.tools.map((tool) => (
                <ToolChip key={tool.id} tool={tool} />
              ))}
            </div>
          )}
          {sec.note && <p className="velox-section-note">{sec.note}</p>}
        </div>
      ))}

      {response.outro && (
        <p className="velox-msg-outro"><RichText text={response.outro} /></p>
      )}
    </div>
  );
}

export default function ChatMessage({ message }) {
  if (message.role === 'user') {
    return (
      <div className="velox-user-row">
        <div className="velox-user-bubble">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="velox-assistant-row">
      <div className="velox-ai-avatar">✦</div>
      <AssistantBubble response={message.response} />
    </div>
  );
}