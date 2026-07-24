'use client';
import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string;
  createdAt: string;
}

const thStyle: React.CSSProperties = {
  padding: '.7rem .85rem',
  textAlign: 'left',
  fontSize: '.72rem',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  color: 'rgba(253,246,227,.4)',
  borderBottom: '1px solid rgba(212,175,55,.08)',
};

const tdStyle: React.CSSProperties = {
  padding: '.7rem .85rem',
  fontSize: '.82rem',
  borderBottom: '1px solid rgba(212,175,55,.04)',
  color: 'rgba(253,246,227,.7)',
};

const goldBtn: React.CSSProperties = {
  background: 'linear-gradient(135deg,#d4af37,#aa8c2c)',
  border: 'none',
  color: '#0a0807',
  padding: '.7rem 1.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '.82rem',
};

const cardBase: React.CSSProperties = {
  background: '#0a1424',
  border: '1px solid rgba(212,175,55,.1)',
  borderRadius: '8px',
  padding: '1.25rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '.6rem .75rem',
  background: '#060b14',
  border: '1px solid rgba(212,175,55,.15)',
  borderRadius: '4px',
  color: '#fdf6e3',
  fontSize: '.85rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const typeColors: Record<string, string> = {
  info: '#60a5fa',
  warning: '#f59e0b',
  success: '#34d399',
  promo: '#a78bfa',
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', link: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/notifications')
      .then(r => r.json())
      .then(d => { setNotifications(d.notifications ?? []); setLoading(false); })
      .catch(() => { setError('Failed to load notifications'); setLoading(false); });
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', message: '', type: 'info', link: '' });
    setShowModal(true);
  };

  const openEdit = (n: Notification) => {
    setEditingId(n.id);
    setForm({ title: n.title, message: n.message, type: n.type, link: n.link });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return alert('Title is required');
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/notifications/${editingId}` : '/api/admin/notifications';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to save'); }
      setShowModal(false);
      load();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete notification "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); alert(d.error || 'Failed to delete'); return; }
      load();
    } catch { alert('Failed to delete'); }
  };

  if (error) return <div style={{ ...cardBase, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#fdf6e3' }}>Notifications</h1>
        <button style={goldBtn} onClick={openCreate}>
          <i className="fas fa-plus" style={{ marginRight: '.5rem' }}></i>New Notification
        </button>
      </div>

      {loading ? (
        <div style={{ ...cardBase, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)' }}>Loading...</div>
      ) : !notifications.length ? (
        <div style={{ ...cardBase, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)' }}>
          <i className="fas fa-bell" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem', opacity: 0.3 }}></i>
          No notifications yet.
        </div>
      ) : (
        <div style={{ ...cardBase, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>Link</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id}>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block', padding: '.15rem .5rem', borderRadius: '99px',
                      fontSize: '.7rem', background: `${typeColors[n.type] || typeColors.info}20`,
                      color: typeColors[n.type] || typeColors.info,
                    }}>
                      <i className={`fas ${n.type === 'warning' ? 'fa-triangle-exclamation' : n.type === 'success' ? 'fa-check-circle' : n.type === 'promo' ? 'fa-tag' : 'fa-circle-info'}`}
                        style={{ marginRight: '.25rem', fontSize: '.65rem' }}></i>
                      {n.type}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: '#fdf6e3', fontWeight: 500 }}>{n.title}</td>
                  <td style={{ ...tdStyle, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.message || '-'}
                  </td>
                  <td style={tdStyle}>
                    {n.link ? (
                      <span style={{ color: '#d4af37', fontSize: '.75rem', fontFamily: 'monospace' }}>{n.link}</span>
                    ) : (
                      <span style={{ color: 'rgba(253,246,227,.2)' }}>-</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, fontSize: '.75rem', color: 'rgba(253,246,227,.4)' }}>
                    {new Date(n.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <button onClick={() => openEdit(n)} style={{
                        background: 'rgba(212,175,55,.1)', border: '1px solid rgba(212,175,55,.2)', color: '#d4af37',
                        padding: '.45rem .85rem', borderRadius: '4px', cursor: 'pointer', fontSize: '.75rem',
                        display: 'flex', alignItems: 'center', gap: '.35rem',
                      }}>
                        <i className="fas fa-pencil" style={{ fontSize: '.7rem' }}></i> Edit
                      </button>
                      <button onClick={() => handleDelete(n.id, n.title)} style={{
                        background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#ef4444',
                        padding: '.45rem .85rem', borderRadius: '4px', cursor: 'pointer', fontSize: '.75rem',
                        display: 'flex', alignItems: 'center', gap: '.35rem',
                      }}>
                        <i className="fas fa-trash-can" style={{ fontSize: '.7rem' }}></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{
            background: '#0a1424', border: '1px solid rgba(212,175,55,.15)', borderRadius: '12px',
            padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#fdf6e3', fontWeight: 500 }}>
                {editingId ? 'Edit Notification' : 'New Notification'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: 'none', color: 'rgba(253,246,227,.4)', cursor: 'pointer',
                fontSize: '1.2rem', padding: '.25rem',
              }}>
                <i className="fas fa-xmark"></i>
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Title *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. New template available" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Message</label>
              <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Notification message" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Type</label>
              <select style={{ ...inputStyle }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="promo">Promo</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Link (optional)</label>
              <input style={inputStyle} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="/dashboard/kelola-template" />
              <div style={{ fontSize: '.7rem', color: 'rgba(253,246,227,.35)', marginTop: '.25rem' }}>Path to navigate when clicked</div>
            </div>

            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '.6rem 1.25rem', background: 'none', border: '1px solid rgba(253,246,227,.15)',
                borderRadius: '4px', color: 'rgba(253,246,227,.6)', cursor: 'pointer', fontSize: '.82rem',
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                style={{ ...goldBtn, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
