import React from 'react';
import { X, Send } from 'lucide-react';

export default function FloatingTutorChat({
  isOpen,
  messages,
  input,
  loading,
  onOpen,
  onClose,
  onChangeInput,
  onSubmit,
}) {
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}>
      {!isOpen ? (
        <button
          onClick={onOpen}
          style={{
            background: '#059669',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '999px',
            padding: '0.85rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.95rem',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span style={{ fontSize: '1.3rem' }}>👩🏼‍🏫</span>
          <span>Preguntar a la Tutora</span>
        </button>
      ) : (
        <div style={{
          width: '360px',
          height: '480px',
          background: '#FFFFFF',
          border: '1px solid #A7F3D0',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: '#059669',
            color: '#FFFFFF',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.4rem' }}>👩🏼‍🏫</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Beyli (Tu Tutora)</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>Resuelve tus dudas de esta lección</div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F8FAFC' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.role === 'user' ? '#059669' : '#FFFFFF',
                  color: m.role === 'user' ? '#FFFFFF' : '#0F172A',
                  border: m.role === 'user' ? 'none' : '1px solid #E2E8F0',
                  borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '0.7rem 0.95rem',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                Beyli está pensando su respuesta... ●●●
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={onSubmit} style={{ padding: '0.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.5rem', background: '#FFFFFF' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => onChangeInput(e.target.value)}
              placeholder="Pregúntale algo a tu tutora..."
              style={{
                flex: 1,
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '0.55rem 0.85rem',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#059669',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '0 0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
