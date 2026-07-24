'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token verifikasi tidak ditemukan.');
      return;
    }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        if (res.redirected) {
          window.location.href = res.url;
          return;
        }
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || 'Verifikasi gagal');
      })
      .catch(() => {
        setStatus('error');
        setMessage('Terjadi kesalahan. Silakan coba lagi.');
      });
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807', color: '#f5ecd9', fontFamily: "'Jost', sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2.5rem', background: '#14110d', border: '1px solid rgba(201,169,97,0.1)', borderRadius: '8px' }}>
        {status === 'loading' && (
          <>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(201,169,97,0.2)', borderTopColor: '#c9a961', borderRadius: '50%', animation: 'spin 0.6s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '0.9rem', color: 'rgba(245,236,217,0.6)' }}>Memverifikasi email...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ef4444' }}><i className="fas fa-circle-exclamation"></i></div>
            <h2 style={{ fontFamily: "'Italiana', serif", fontSize: '1.3rem', color: '#c9a961', margin: '0 0 0.75rem' }}>Verifikasi Gagal</h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245,236,217,0.6)', margin: '0 0 1.5rem' }}>{message}</p>
            <button onClick={() => router.push('/login')} style={{ background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
              Ke Halaman Login
            </button>
          </>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807', color: '#f5ecd9', fontFamily: "'Jost', sans-serif" }}>
        <p style={{ fontSize: '0.9rem', color: 'rgba(245,236,217,0.5)' }}>Loading...</p>
      </div>
    }>
      <VerifyEmailInner />
    </Suspense>
  );
}
