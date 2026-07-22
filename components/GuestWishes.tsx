'use client';

import { useState, useEffect } from 'react';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface GuestWishesProps {
  templateDataId: string;
  title?: string;
  description?: string;
}

export default function GuestWishes({ templateDataId, title, description }: GuestWishesProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetch(`/api/wishes?templateDataId=${templateDataId}&limit=30`)
      .then(r => r.json())
      .then(d => {
        if (d.wishes) setWishes(d.wishes);
        if (d.total !== undefined) setTotal(d.total);
      })
      .catch(() => {});
  }, [templateDataId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateDataId, name: name.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Gagal mengirim');
        return;
      }
      setSubmitSuccess('Ucapan berhasil dikirim! 🎉');
      setWishes(prev => [{ ...data.wish, createdAt: new Date().toISOString() }, ...prev]);
      setTotal(prev => prev + 1);
      setName('');
      setMessage('');
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch {
      setSubmitError('Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      maxWidth: '600px', margin: '0 auto', padding: '3rem 1.5rem',
      fontFamily: "'Jost', 'Segoe UI', sans-serif",
    }}>
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.6rem', color: '#c9a961', textAlign: 'center',
        marginBottom: '0.5rem', fontStyle: 'italic',
      }}>
        {title || 'Guest Book'}
      </h3>
      <p style={{
        fontSize: '0.85rem', color: 'rgba(245,236,217,0.5)',
        textAlign: 'center', marginBottom: '2rem', lineHeight: 1.5,
      }}>
        {description || 'Tinggalkan ucapan dan doa terbaik untuk kedua mempelai'}
      </p>

      {/* Submit form */}
      <form onSubmit={handleSubmit} style={{
        background: '#14110d', border: '1px solid rgba(201,169,97,0.1)',
        borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem',
      }}>
        {submitSuccess && (
          <div style={{
            padding: '0.6rem 0.8rem', marginBottom: '1rem',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '4px', color: '#22c55e', fontSize: '0.85rem', textAlign: 'center',
          }}>
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div style={{
            padding: '0.6rem 0.8rem', marginBottom: '1rem',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '4px', color: '#ef4444', fontSize: '0.85rem', textAlign: 'center',
          }}>
            {submitError}
          </div>
        )}
        <div style={{ marginBottom: '0.75rem' }}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            placeholder="Nama Anda" disabled={submitting}
            style={{
              width: '100%', padding: '0.7rem 0.85rem', background: '#0a0807',
              border: '1px solid rgba(201,169,97,0.15)', borderRadius: '4px',
              color: '#f5ecd9', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={3}
            placeholder="Tulis ucapan dan doa untuk mempelai..." disabled={submitting}
            style={{
              width: '100%', padding: '0.7rem 0.85rem', background: '#0a0807',
              border: '1px solid rgba(201,169,97,0.15)', borderRadius: '4px',
              color: '#f5ecd9', fontSize: '0.85rem', outline: 'none', resize: 'vertical',
              boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>
        <button type="submit" disabled={submitting}
          style={{
            width: '100%', padding: '0.7rem',
            background: submitting ? '#666' : 'linear-gradient(135deg,#c9a961,#b8942e)',
            border: 'none', color: '#0a0807', borderRadius: '4px',
            fontSize: '0.85rem', fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>

      {/* Wishes list */}
      {total > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.8rem', color: 'rgba(245,236,217,0.4)' }}>
          {total} ucapan telah terkumpul
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {wishes.map(w => (
          <div key={w.id} style={{
            background: '#14110d', border: '1px solid rgba(201,169,97,0.08)',
            borderRadius: '8px', padding: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#c9a961', fontWeight: 500 }}>{w.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(245,236,217,0.3)' }}>{formatDate(w.createdAt)}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245,236,217,0.7)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
              {w.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
