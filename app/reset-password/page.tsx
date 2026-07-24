'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (!token) {
      setError('Token reset tidak ditemukan');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mereset password');
        return;
      }

      setSuccessMessage(data.message || 'Password berhasil direset!');
      setSuccess(true);
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
            Reset Password
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(245,236,217,0.5)', marginTop: '0.5rem', lineHeight: 1.5 }}>
            {success
              ? successMessage
              : 'Masukkan password baru untuk akun Anda.'}
          </p>
        </div>

        {error && (
          <div style={{
            fontSize: '0.8rem', color: '#ef4444', marginBottom: '1rem',
            padding: '0.65rem 0.85rem', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245,236,217,0.6)', marginBottom: '0.5rem' }}>
                Password Baru
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 6 karakter"
                disabled={!token || loading}
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  boxSizing: 'border-box', border: '1px solid rgba(201,169,97,0.15)',
                  borderRadius: '4px', color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  opacity: (!token || loading) ? 0.5 : 1,
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245,236,217,0.6)', marginBottom: '0.5rem' }}>
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Ketik ulang password"
                disabled={!token || loading}
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  boxSizing: 'border-box', border: '1px solid rgba(201,169,97,0.15)',
                  borderRadius: '4px', color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  opacity: (!token || loading) ? 0.5 : 1,
                }}
              />
            </div>

            {!token && (
              <div style={{
                padding: '0.75rem', background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.15)', borderRadius: '4px',
                fontSize: '0.8rem', color: 'rgba(245,236,217,0.6)', textAlign: 'center', marginBottom: '1rem',
              }}>
                Token reset tidak ditemukan. Silakan minta link reset baru.
              </div>
            )}

            <button
              type="submit"
              disabled={!token || loading}
              style={{
                width: '100%', padding: '0.85rem',
                background: loading
                  ? 'linear-gradient(135deg, #8a7a4a, #8a7a4a)'
                  : 'linear-gradient(135deg, #c9a961, #b8942e)',
                border: 'none', color: '#0a0807', borderRadius: '4px',
                fontSize: '0.9rem', fontWeight: 500,
                cursor: (!token || loading) ? 'not-allowed' : 'pointer',
                opacity: (!token || loading) ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '14px', height: '14px', border: '2px solid rgba(10,8,7,0.3)',
                    borderTopColor: '#0a0807', borderRadius: '50%', display: 'inline-block',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                  Memproses...
                </>
              ) : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#22c55e' }}><i className="fas fa-check-circle"></i></div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(245,236,217,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {successMessage}
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
            {success ? '→ Login Sekarang' : '← Kembali ke Login'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#0a0807',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(245,236,217,0.5)', fontFamily: "'Jost', sans-serif", fontSize: '0.9rem',
      }}>
        Loading...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
