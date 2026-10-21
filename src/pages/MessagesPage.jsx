import React, { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { Send, MessageSquare, ArrowLeft, GraduationCap } from 'lucide-react';

const ROLE_LABEL = {
  professor: 'Profesor',
  tenant_admin: 'Administrador',
  super_admin: 'Soporte',
  student: 'Estudiante',
};

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [contacts, setContacts] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showThreadMobile, setShowThreadMobile] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/messages/contacts');
        if (res.success) setContacts(res.data.contacts || []);
      } catch (err) {
        toast.error('No se pudieron cargar los contactos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadThread = useCallback(async (otherId, silent = false) => {
    try {
      const res = await api.get(`/messages/${otherId}`);
      if (res.success) setMessages(res.data.messages || []);
    } catch (err) {
      if (!silent) toast.error('No se pudo cargar la conversación');
    }
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    loadThread(active.id);
    const id = setInterval(() => loadThread(active.id, true), 5000);
    return () => clearInterval(id);
  }, [active, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openThread = (contact) => {
    setActive(contact);
    setMessages([]);
    setShowThreadMobile(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    setSending(true);
    try {
      const res = await api.post('/messages', { receiver_id: active.id, body: text.trim() });
      if (res.success) {
        setText('');
        await loadThread(active.id, true);
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '1.5rem 1rem 3rem', color: 'var(--text-primary)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
        <MessageSquare size={24} color="var(--primary)" /> Mensajería
      </h1>

      <div className="msg-layout" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '1rem', minHeight: '560px' }}>
        {/* Contacts */}
        <aside className={`msg-contacts ${showThreadMobile ? 'hide-mobile' : ''}`} style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden',
        }}>
          <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Contactos
          </div>
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>Cargando...</p>
          ) : contacts.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--text-subtle)', fontSize: '0.88rem' }}>
              No hay contactos disponibles todavía. {user?.role === 'student' ? 'Tu academia aún no tiene profesores asignados.' : 'Aún no hay estudiantes inscritos.'}
            </p>
          ) : (
            <div>
              {contacts.map((c) => {
                const isActive = active?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => openThread(c)}
                    style={{
                      width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.7rem',
                      padding: '0.8rem 1.1rem',
                      background: isActive ? 'var(--primary-bg)' : 'transparent',
                      borderLeft: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                    }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                      background: 'var(--primary-bg)', border: '1px solid var(--primary-soft-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)',
                    }}>
                      {c.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ROLE_LABEL[c.role] || c.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Thread */}
        <section className={`msg-thread ${showThreadMobile ? '' : 'hide-mobile'}`} style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {active ? (
            <>
              <div style={{ padding: '0.8rem 1.1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button className="msg-back" onClick={() => setShowThreadMobile(false)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}>
                  <ArrowLeft size={18} />
                </button>
                <GraduationCap size={18} color="var(--primary)" />
                <strong style={{ fontSize: '0.95rem' }}>{active.name}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· {ROLE_LABEL[active.role] || active.role}</span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'var(--bg-base)' }}>
                {messages.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', marginTop: '2rem' }}>
                    Aún no hay mensajes. ¡Escribe el primero!
                  </p>
                ) : (
                  messages.map((m) => {
                    const mine = m.sender_id === user?.id;
                    return (
                      <div key={m.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '72%' }}>
                        <div style={{
                          background: mine ? 'var(--primary)' : 'var(--bg-surface)',
                          color: mine ? 'var(--text-on-primary)' : 'var(--text-primary)',
                          border: `1px solid ${mine ? 'var(--primary)' : 'var(--border)'}`,
                          borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                          padding: '0.6rem 0.85rem', fontSize: '0.9rem', lineHeight: 1.45,
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}>
                          {m.body}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem', textAlign: mine ? 'right' : 'left' }}>
                          {new Date(m.created_at).toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  style={{
                    flex: 1, background: 'var(--bg-base)', border: '1px solid var(--border-strong)',
                    borderRadius: '12px', padding: '0.7rem 1rem', color: 'var(--text-primary)',
                    fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button type="submit" disabled={sending || !text.trim()} style={{
                  background: 'var(--primary)', color: 'var(--text-on-primary)', border: 'none',
                  borderRadius: '12px', padding: '0 1.1rem', cursor: sending ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700,
                }}>
                  <Send size={17} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '0.5rem' }}>
              <MessageSquare size={40} style={{ opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Selecciona un contacto para comenzar</p>
            </div>
          )}
        </section>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .msg-layout { grid-template-columns: 1fr !important; }
          .msg-contacts.hide-mobile, .msg-thread.hide-mobile { display: none !important; }
          .msg-back { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
