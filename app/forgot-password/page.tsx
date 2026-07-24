'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileReady(true);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!turnstileReady || !(window as any).turnstile || !turnstileRef.current) return;
    try {
      (window as any).turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAD6aISQgEV4ePM3I',
        callback: (token: string) => setTurnstileToken(token),
        'error-callback': () => setTurnstileToken(''),
        'expired-callback': () => setTurnstileToken(''),
      });
    } catch (e) {
      console.error('[turnstile] render error', e);
    }
    return () => {
      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = '';
      }
    };
  }, [turnstileReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!turnstileToken) { setError('Silakan selesaikan verifikasi keamanan'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccessMessage(data.message || 'Link reset password telah dikirim ke email Anda.');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses permintaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0807', color: '#f5ecd9',
      fontFamily: "'Jost', sans-serif", display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', padding: '2.5rem',
        background: '#14110d', border: '1px solid rgba(201,169,97,0.1)', borderRadius: '8px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #c9a961, #8a6d2b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem',
          }}>
            <span style={{ color: '#0a0807', fontWeight: 600, fontSize: '1.2rem' }}>E</span>
          </div>
          <h1 style={{ fontFamily: "'Italiana', serif", fontSize: '1.5rem', color: '#c9a961', margin: 0 }}>
            Lupa Password
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(245,236,217,0.5)', marginTop: '0.5rem', lineHeight: 1.5 }}>
            {sent ? successMessage : 'Masukkan email Anda dan kami akan kirim link untuk mereset password.'}
          </p>
        </div>
        {error && (
          <div style={{
            fontSize: '0.8rem', color: '#ef4444', marginBottom: '1rem',
            padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.1)',
            borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            {error}
          </div>
        )}
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245,236,217,0.6)', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  boxSizing: 'border-box', border: '1px solid rgba(201,169,97,0.15)',
                  borderRadius: '4px', color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                }}
              />
            </div>
            <div ref={turnstileRef} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }} />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.85rem',
                background: loading ? '#666' : 'linear-gradient(135deg, #c9a961, #b8942e)',
                border: 'none', color: '#0a0807', borderRadius: '4px',
                fontSize: '0.9rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#22c55e' }}><i className="fas fa-check-circle"></i></div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(245,236,217,0.5)', marginBottom: '1.5rem' }}>
              Email terkirim ke <strong style={{ color: '#c9a961' }}>{email}</strong>
            </p>
          </div>
        )}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => router.push('/login')}
            style={{
              background: 'none', border: 'none', color: 'rgba(245,236,217,0.4)',
              cursor: 'pointer', fontSize: '0.8rem',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,236,217,0.4)'}
          >
            ← Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
}
