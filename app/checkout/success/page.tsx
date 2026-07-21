'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const [status, setStatus] = useState<'installing' | 'success' | 'error'>('installing');
  const [countdown, setCountdown] = useState(5);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => { setHasSession(!!localStorage.getItem('session')); }, []);

  useEffect(() => {
    if (!templateId) {
      setStatus('error');
      return;
    }

    let isMounted = true;

    const install = async () => {
      try {
        const res = await fetch('/api/customer/install', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId }),
        });

        if (!res.ok) throw new Error('Installation failed');
        if (isMounted) setStatus('success');
      } catch (e) {
        console.error('Install error:', e);
        if (isMounted) setStatus('error');
      }
    };

    install();
    return () => { isMounted = false; };
  }, [templateId]);

  // Auto-redirect to dashboard
  useEffect(() => {
    if (status !== 'success') return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard/kelola-template');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, router]);

  return (
    <div style={{ textAlign: 'center', maxWidth: '450px', padding: '2rem' }}>
      {status === 'installing' && (
        <>
          <div style={{
            width: '50px', height: '50px',
            border: '2px solid rgba(201, 169, 97, 0.15)',
            borderTop: '2px solid #c9a961',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1.5rem',
          }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontStyle: 'italic', color: '#c9a961', marginBottom: '0.5rem' }}>
            Finalizing Purchase
          </h2>
          <p style={{ color: 'rgba(245, 236, 217, 0.5)', fontSize: '0.9rem' }}>
            Installing your template. Please wait...
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}><i className="fas fa-circle-check"></i></div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontStyle: 'italic',
            background: 'linear-gradient(135deg, #c9a961, #dfc47a)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '0.75rem',
          }}>
            Payment Successful!
          </h2>
          <p style={{ color: 'rgba(245, 236, 217, 0.6)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your template has been installed successfully! You can now customize your wedding invitation.
          </p>
          <p style={{ color: 'rgba(245, 236, 217, 0.3)', fontSize: '0.8rem', marginBottom: '2rem' }}>
            Redirecting to editor in {countdown}s...
          </p>
          <button onClick={() => router.push('/dashboard/kelola-template')}
            style={{ padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #c9a961, #b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 169, 97, 0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            Start Editing
          </button>
        </>
      )}

      {status === 'error' && (
        <>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}><i className="fas fa-circle-exclamation"></i></div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontStyle: 'italic', color: '#ef4444', marginBottom: '0.75rem' }}>
            Something Went Wrong
          </h2>
          <p style={{ color: 'rgba(245, 236, 217, 0.6)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your payment was successful but we couldn&apos;t install the template. Please contact support.
          </p>
          <button onClick={() => router.push('/')}
            style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #c9a961', color: '#c9a961', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
            ← Back to Home
          </button>
          {hasSession && <button onClick={() => router.push('/dashboard')}
            style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #c9a961, #b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
            Go to Dashboard
          </button>}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0807', color: '#f5ecd9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Jost', sans-serif",
    }}>
      <Suspense fallback={
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid rgba(201, 169, 97, 0.15)',
            borderTop: '2px solid #c9a961',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'rgba(245, 236, 217, 0.5)', fontSize: '0.9rem' }}>Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
