'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactSubmission } from '@/lib/types';

export default function AdminContactSubmissionsPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<ContactSubmission | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      showToast('Error loading messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, newStatus = true) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contact_submissions')
        .update({ read: newStatus })
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: newStatus } : m));
      if (selectedMsg?.id === id) {
        setSelectedMsg(prev => prev ? { ...prev, read: newStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update read status:', err);
    }
  };

  const openModal = async (msg: ContactSubmission) => {
    setSelectedMsg(msg);
    // Automatically mark as read per spec §4.7
    if (!msg.read) {
      await markAsRead(msg.id, true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
      showToast('Message deleted.');
      if (selectedMsg?.id === id) setSelectedMsg(null);
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Delete failed.');
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#00E5FF',
          color: '#0A0A0A',
          padding: '12px 24px',
          borderRadius: '6px',
          fontWeight: 700,
          fontSize: '0.875rem',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
            Contact Submissions
          </h1>
          <p style={{ color: '#888888', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
            {unreadCount} unread message{unreadCount === 1 ? '' : 's'} received through public contact form
          </p>
        </div>

        <button
          onClick={fetchMessages}
          style={{
            padding: '8px 16px',
            background: '#181818',
            border: '1px solid #282828',
            color: '#CCC',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8125rem',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Messages Table */}
      <div style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '8px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading messages…</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#888' }}>
            No contact submissions received yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E1E1E', color: '#666', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Sender</th>
                <th style={{ padding: '14px 20px' }}>Subject</th>
                <th style={{ padding: '14px 20px' }}>Date</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr
                  key={msg.id}
                  style={{
                    borderBottom: '1px solid #1A1A1A',
                    borderLeft: msg.read ? '3px solid transparent' : '3px solid #00E5FF',
                    background: msg.read ? 'transparent' : 'rgba(0, 229, 255, 0.02)',
                  }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: msg.read ? 500 : 700, color: msg.read ? '#DDD' : '#FFF' }}>
                      {msg.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{msg.email}</div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#CCC', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.subject}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#888', fontSize: '0.8125rem' }}>
                    {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: msg.read ? '#1C1C1C' : 'rgba(0, 229, 255, 0.1)',
                      color: msg.read ? '#888' : '#00E5FF',
                    }}>
                      {msg.read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openModal(msg)}
                        style={{
                          padding: '6px 12px',
                          background: '#1A1A1A',
                          border: '1px solid #282828',
                          color: '#FFF',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => markAsRead(msg.id, !msg.read)}
                        style={{
                          padding: '6px 10px',
                          background: '#141414',
                          border: '1px solid #242424',
                          color: '#888',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        {msg.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        style={{
                          padding: '6px 10px',
                          background: 'rgba(255, 68, 68, 0.1)',
                          border: '1px solid rgba(255, 68, 68, 0.25)',
                          color: '#FF4444',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── View Message Modal ────────────────────────────── */}
      {selectedMsg && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#111111',
            border: '1px solid #242424',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '600px',
            padding: '28px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
          }}>
            {/* Header info */}
            <div style={{ borderBottom: '1px solid #202020', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#FFF', fontWeight: 700 }}>
                  {selectedMsg.subject}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>
                  {new Date(selectedMsg.created_at).toLocaleString()}
                </span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#AAA' }}>
                From: <strong style={{ color: '#FFF' }}>{selectedMsg.name}</strong> &lt;{selectedMsg.email}&gt;
              </div>
            </div>

            {/* Message body */}
            <div style={{
              background: '#161616',
              padding: '20px',
              borderRadius: '6px',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              color: '#DDD',
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '24px',
              border: '1px solid #202020',
            }}>
              {selectedMsg.message}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                  style={{
                    padding: '8px 16px',
                    background: '#00E5FF',
                    color: '#0A0A0A',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedMsg.id)}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(255, 68, 68, 0.1)',
                    border: '1px solid rgba(255, 68, 68, 0.3)',
                    color: '#FF4444',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                  }}
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => setSelectedMsg(null)}
                style={{
                  padding: '8px 16px',
                  background: '#1C1C1C',
                  border: '1px solid #333',
                  color: '#FFF',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
