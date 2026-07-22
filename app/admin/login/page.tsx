'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    if (!turnstileToken) {
      setError('Silakan selesaikan verifikasi keamanan');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal');
        return;
      }

      // Check if user is admin
      if (!data.isAdmin) {
        setError('Akun ini tidak memiliki akses admin');
        return;
      }

      // Save to localStorage (fallback for client-side check)
      localStorage.setItem('admin', 'true');
      localStorage.setItem('adminEmail', email);
      if (data.customer?.name) {
        localStorage.setItem('adminName', data.customer.name);
      }

      // Cookie is set by the API via Set-Cookie header

      router.push('/admin');
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060b14', fontFamily: "'Jost', sans-serif" }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '380px', padding: '2.5rem', background: '#0a1424', border: '1px solid rgba(212,175,55,.2)', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#d4af37', fontFamily: "'Italiana', serif", marginBottom: '.25rem' }}>Admin Panel</div>
          <div style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.4)' }}>Terima Undangan</div>
        </div>

        {error && (
          <div style={{
            fontSize: '.8rem', color: '#ef4444', marginBottom: '1rem',
            padding: '.65rem .85rem', background: 'rgba(239,68,68,.1)',
            border: '1px solid rgba(239,68,68,.2)', borderRadius: '4px',
            display: 'flex', alignItems: 'center', gap: '.5rem',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading}
            style={{ width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.9rem', outline: 'none', opacity: isLoading ? 0.5 : 1 }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading}
            style={{ width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.9rem', outline: 'none', opacity: isLoading ? 0.5 : 1 }}
          />
        </div>
        <div ref={turnstileRef} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }} />
        <button type="submit" disabled={isLoading}
          style={{
            width: '100%', padding: '.8rem',
            background: isLoading ? '#4a4a4a' : 'linear-gradient(135deg,#d4af37,#aa8c2c)',
            border: 'none', borderRadius: '4px', color: '#0a0807',
            fontSize: '.9rem', fontWeight: 500, cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
          }}
        >
          {isLoading ? (
            <>
              <span style={{
                width: '14px', height: '14px', border: '2px solid rgba(10,8,7,0.3)',
                borderTopColor: '#0a0807', borderRadius: '50%', display: 'inline-block',
                animation: 'admSpin 0.6s linear infinite',
              }} />
              Memproses...
            </>
          ) : 'Masuk'}
        </button>

        <style>{`@keyframes admSpin { to { transform: rotate(360deg); } }`}</style>
      </form>
    </div>
  );
}
