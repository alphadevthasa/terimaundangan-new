'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionNavbar({ scrolled, isMobile, onNavigate, subtitle }: { scrolled: boolean; isMobile: boolean; onNavigate?: (href: string) => void; subtitle?: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.session?.email) {
            setIsLoggedIn(true);
            setCustomerName(data.session.email.split('@')[0]);
          }
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setIsLoggedIn(false);
    setCustomerName('');
    setMenuOpen(false);
    router.push('/');
  };

  const handleClick = (href: string) => {
    setMenuOpen(false);
    if (onNavigate) onNavigate(href);
    else router.push(href);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,8,7,.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,169,97,.1)' : '1px solid transparent',
      transition: 'all .3s ease', padding: isMobile ? '.75rem 1rem' : '.85rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: 'pointer' }} onClick={() => handleClick('/')}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#c9a961,#8a6d2b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#0a0807', fontWeight: 600, fontSize: '1rem' }}>E</span>
          </div>
          <div style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: '.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Italiana', serif", fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#c9a961', fontWeight: 600 }}>
              Terima Undangan
            </span>
            {subtitle && <span style={{ fontSize: isMobile ? '.75rem' : '.9rem', color: 'rgba(245,236,217,.5)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>/ {subtitle}</span>}
          </div>
        </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '.5rem' : '1.5rem' }}>
        {checkingSession ? null : isLoggedIn ? (
          <>
            <span style={{ fontSize: '.8rem', color: 'rgba(245,236,217,.7)' }}>{customerName}</span>
            <button onClick={handleLogout}
              style={{ padding: '.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(201,169,97,.4)', color: '#c9a961', borderRadius: '4px', fontSize: '.8rem', cursor: 'pointer', transition: 'all .2s', letterSpacing: '.1em' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,169,97,.1)'; e.currentTarget.style.borderColor = '#c9a961'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,169,97,.4)'; }}
            >Logout</button>
          </>
        ) : isMobile ? (
          <>
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#c9a961', cursor: 'pointer', fontSize: '1.3rem', position: 'relative', zIndex: 110 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>
                ) : (
                  <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                )}
              </svg>
            </button>
            {menuOpen && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.5)', zIndex: 100 }} onClick={() => setMenuOpen(false)} />}
            <div style={{
              position: 'fixed', top: '64px', right: '1rem', zIndex: 110,
              background: '#14110d', border: '1px solid rgba(201,169,97,.15)',
              borderRadius: '8px', padding: '.5rem', minWidth: '180px',
              display: menuOpen ? 'flex' : 'none',
              flexDirection: 'column', gap: '.35rem',
              boxShadow: '0 16px 48px rgba(0,0,0,.5)',
            }}>
              <button onClick={() => handleClick('/login')}
                style={{ padding: '.65rem 1rem', background: 'transparent', border: 'none', color: 'rgba(245,236,217,.7)', borderRadius: '4px', fontSize: '.85rem', cursor: 'pointer', textAlign: 'left', transition: 'background .15s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,169,97,.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >Login</button>
              <button onClick={() => handleClick('/signup')}
                style={{ padding: '.65rem 1rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '.85rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'opacity .15s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >Sign Up</button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => handleClick('/login')}
              style={{ padding: '.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(201,169,97,.4)', color: '#c9a961', borderRadius: '4px', fontSize: '.8rem', cursor: 'pointer', transition: 'all .2s', letterSpacing: '.1em' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,169,97,.1)'; e.currentTarget.style.borderColor = '#c9a961'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,169,97,.4)'; }}
            >Login</button>
            <button onClick={() => handleClick('/signup')}
              style={{ padding: '.5rem 1.25rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all .2s', letterSpacing: '.1em' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(201,169,97,.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}
