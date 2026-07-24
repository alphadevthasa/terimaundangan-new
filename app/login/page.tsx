'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function AuthForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<'login' | 'signup'>(pathname === '/signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    setVerifiedSuccess(url.searchParams.get('verified') === 'true');
  }, []);

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
  }, [turnstileReady, mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!turnstileToken) { setError('Silakan selesaikan verifikasi keamanan'); return; }
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsVerification) {
          setNeedsVerification(true);
          setError(data.error || 'Email belum diverifikasi');
        } else {
          setError(data.error || 'Login gagal');
        }
        return;
      }

      localStorage.setItem('session', 'true');
      localStorage.setItem('sessionEmail', email);
      if (data.customer?.name) {
        localStorage.setItem('sessionName', data.customer.name);
      }

      router.push('/dashboard');
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Konfirmasi password tidak sesuai'); return; }
    if (!turnstileToken) { setError('Silakan selesaikan verifikasi keamanan'); return; }
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Pendaftaran gagal');
        return;
      }

      setSignupSuccess(true);
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setNeedsVerification(false);
    setSignupSuccess(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    if (newMode === 'signup') {
      router.push('/signup');
    } else {
      router.push('/login');
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      });
      const data = await res.json();
      if (res.ok) {
        setError('');
        setError('Email verifikasi telah dikirim ulang.');
      } else {
        setError(data.error || 'Gagal mengirim ulang email verifikasi');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0807',
      color: '#f5ecd9',
      fontFamily: "'Jost', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem',
        background: '#14110d',
        border: '1px solid rgba(201, 169, 97, 0.1)',
        borderRadius: '8px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c9a961, #8a6d2b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem',
          }}>
            <span style={{ color: '#0a0807', fontWeight: 600, fontSize: '1.2rem' }}>E</span>
          </div>
          <h1 style={{ fontFamily: "'Italiana', serif", fontSize: '1.5rem', color: '#c9a961', margin: 0 }}>
            Terima Undangan
          </h1>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex', marginBottom: '2rem',
          borderBottom: '1px solid rgba(201, 169, 97, 0.1)',
        }}>
          <button onClick={() => switchMode('login')}
            style={{
              flex: 1, padding: '0.75rem', background: 'none',
              border: 'none', color: mode === 'login' ? '#c9a961' : 'rgba(245, 236, 217, 0.4)',
              borderBottom: mode === 'login' ? '2px solid #c9a961' : '2px solid transparent',
              cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
          >Login</button>
          <button onClick={() => switchMode('signup')}
            style={{
              flex: 1, padding: '0.75rem', background: 'none',
              border: 'none', color: mode === 'signup' ? '#c9a961' : 'rgba(245, 236, 217, 0.4)',
              borderBottom: mode === 'signup' ? '2px solid #c9a961' : '2px solid transparent',
              cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
          >Sign Up</button>
        </div>

        {/* Error Message */}
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

        {/* Verified Success Banner */}
        {verifiedSuccess && (
          <div style={{
            fontSize: '0.8rem', color: '#22c55e', marginBottom: '1rem',
            padding: '0.65rem 0.85rem', background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)', borderRadius: '4px',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Email berhasil diverifikasi! Silakan login.</span>
          </div>
        )}

        {/* Turnstile Widget */}
        <div ref={turnstileRef} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }} />

        {signupSuccess ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#c9a961' }}><i className="fas fa-envelope"></i></div>
            <h2 style={{ fontFamily: "'Italiana', serif", fontSize: '1.3rem', color: '#c9a961', margin: '0 0 0.75rem' }}>
              Cek Email Anda
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245,236,217,0.6)', lineHeight: '1.6', margin: 0 }}>
              Kami telah mengirim email verifikasi ke <strong style={{ color: '#c9a961' }}>{email}</strong>.
              Silakan klik link di email untuk mengaktifkan akun Anda.
            </p>
            <button onClick={() => { setSignupSuccess(false); setMode('login'); router.push('/login'); }}
              style={{
                marginTop: '1.5rem', background: 'none', border: '1px solid rgba(201,169,97,0.3)',
                color: '#c9a961', padding: '0.75rem 1.5rem', borderRadius: '4px',
                cursor: 'pointer', fontSize: '0.85rem',
              }}
            >Ke Halaman Login</button>
          </div>
        ) : mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                  color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box', opacity: isLoading ? 0.5 : 1,
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: '100%', padding: '0.75rem', paddingRight: '2.5rem', background: '#0a0807',
                    border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                    color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                    boxSizing: 'border-box', opacity: isLoading ? 0.5 : 1,
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,236,217,0.4)',
                    padding: '0.25rem', display: 'flex', alignItems: 'center',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={isLoading}
              style={{
                width: '100%', padding: '0.85rem',
                background: isLoading
                  ? 'linear-gradient(135deg, #8a7a4a, #8a7a4a)'
                  : 'linear-gradient(135deg, #c9a961, #b8942e)',
                border: 'none', color: '#0a0807', borderRadius: '4px',
                fontSize: '0.9rem', fontWeight: 500, cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    width: '14px', height: '14px', border: '2px solid rgba(10,8,7,0.3)',
                    borderTopColor: '#0a0807', borderRadius: '50%', display: 'inline-block',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                  Memproses...
                </>
              ) : 'Login'}
            </button>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                onClick={() => router.push('/forgot-password')}
                style={{
                  background: 'none', border: 'none', color: 'rgba(245, 236, 217, 0.4)',
                  cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 236, 217, 0.4)'}
              >
                Lupa Password?
              </button>
            </div>
            {needsVerification && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <button type="button" onClick={handleResendVerification} disabled={resending}
                  style={{
                    background: 'none', border: 'none', color: '#c9a961',
                    cursor: resending ? 'not-allowed' : 'pointer', fontSize: '0.8rem',
                    opacity: resending ? 0.5 : 1, textDecoration: 'underline',
                  }}
                >
                  {resending ? 'Mengirim ulang...' : 'Kirim ulang email verifikasi'}
                </button>
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Name</label>
              <input
                type="text" required value={name}
                onChange={e => setName(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                  color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box', opacity: isLoading ? 0.5 : 1,
                }}
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                  color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box', opacity: isLoading ? 0.5 : 1,
                }}
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Minimal 6 karakter"
                  style={{
                    width: '100%', padding: '0.75rem', paddingRight: '2.5rem', background: '#0a0807',
                    border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                    color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                    boxSizing: 'border-box', opacity: isLoading ? 0.5 : 1,
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,236,217,0.4)',
                    padding: '0.25rem', display: 'flex', alignItems: 'center',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Konfirmasi Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ketik ulang password"
                  style={{
                    width: '100%', padding: '0.75rem', paddingRight: '2.5rem', background: '#0a0807',
                    border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                    color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                    boxSizing: 'border-box', opacity: isLoading ? 0.5 : 1,
                  }}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,236,217,0.4)',
                    padding: '0.25rem', display: 'flex', alignItems: 'center',
                  }}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={isLoading}
              style={{
                width: '100%', padding: '0.85rem',
                background: isLoading
                  ? 'linear-gradient(135deg, #8a7a4a, #8a7a4a)'
                  : 'linear-gradient(135deg, #c9a961, #b8942e)',
                border: 'none', color: '#0a0807', borderRadius: '4px',
                fontSize: '0.9rem', fontWeight: 500, cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    width: '14px', height: '14px', border: '2px solid rgba(10,8,7,0.3)',
                    borderTopColor: '#0a0807', borderRadius: '50%', display: 'inline-block',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                  Mendaftar...
                </>
              ) : 'Sign Up'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button onClick={() => router.push('/')}
            style={{
              background: 'none', border: 'none', color: 'rgba(245, 236, 217, 0.4)',
              cursor: 'pointer', fontSize: '0.8rem',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 236, 217, 0.4)'}
          >← Back to Home</button>
        </div>
      </div>

      {/* Global style for spin animation */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807', color: '#f5ecd9', fontFamily: "'Jost', sans-serif" }}>
        <p style={{ fontSize: '0.9rem', color: 'rgba(245,236,217,0.5)' }}>Loading...</p>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}