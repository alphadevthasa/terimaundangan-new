'use client';

import Sidebar from '@/components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { UserContext, UserData } from '@/lib/user-context';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/kelola-template': 'Kelola Template',
  '/dashboard/wishes': 'Guest Wishes',
  '/dashboard/settings': 'Settings',
};

/** Check if pathname matches a known route prefix (for dynamic routes like [id]) */
function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Check prefix matches for dynamic routes
  if (pathname.startsWith('/dashboard/kelola-template/')) return 'Template Editor';
  return 'Dashboard';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [templateDataId, setTemplateDataId] = useState<string | null>(null);
  const [newWishesCount, setNewWishesCount] = useState(0);
  const [toast, setToast] = useState<{ count: number; wishes: { id: string; name: string; message: string }[] } | null>(null);
  const lastCheckRef = useRef<string>(new Date().toISOString());
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUser = async (email: string) => {
    try {
      const res = await fetch(`/api/customer?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.customer) {
          localStorage.setItem('customerId', data.customer.id);
          setUser({
            name: data.customer.name || email.split('@')[0] || 'User',
            email: data.customer.email || email,
            status: data.customer.status || 'active',
          });
        } else {
          // Customer record not found, but still logged in
          setUser({
            name: localStorage.getItem('sessionName') || email.split('@')[0] || 'User',
            email,
            status: 'active',
          });
        }
      } else {
        // Fallback: just use what we have in localStorage
        setUser({
          name: localStorage.getItem('sessionName') || email.split('@')[0] || 'User',
          email,
          status: 'active',
        });
      }
    } catch {
      // Fallback on error
      setUser({
        name: localStorage.getItem('sessionName') || email.split('@')[0] || 'User',
        email,
        status: 'active',
      });
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (sessionEmail) {
      await fetchUser(sessionEmail);
    }
  };

  // Fetch template data ID for wish polling
  useEffect(() => {
    if (!authed) return;
    fetch('/api/customer')
      .then(r => r.json())
      .then(data => {
        const c = data.customer;
        if (c?.templateData?.[0]?.id) setTemplateDataId(c.templateData[0].id);
      })
      .catch(() => {});
  }, [authed]);

  // Play a notification beep using Web Audio API
  function playNotificationBeep() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.15);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(660, audioCtx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(audioCtx.currentTime + 0.15);
      osc2.stop(audioCtx.currentTime + 0.35);
      setTimeout(() => audioCtx.close(), 500);
    } catch {}
  }

  // Poll for new wishes
  useEffect(() => {
    if (!authed || !templateDataId) return;

    const checkNewWishes = () => {
      const isOnWishesPage = window.location.pathname.startsWith('/dashboard/wishes');
      const since = localStorage.getItem('lastWishesVisit') || lastCheckRef.current;
      fetch(`/api/wishes/recent?since=${encodeURIComponent(since)}&templateDataId=${templateDataId}`)
        .then(r => r.json())
        .then(data => {
          if (data.count > 0 && data.wishes?.length > 0) {
            if (!isOnWishesPage) {
              setNewWishesCount(prev => prev + data.count);
            }
            lastCheckRef.current = new Date().toISOString();
            playNotificationBeep();
            setToast({ count: data.count, wishes: data.wishes });
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            toastTimerRef.current = setTimeout(() => setToast(null), 6000);
          }
        })
        .catch(() => {});
    };

    const initialTimer = setTimeout(checkNewWishes, 5000);
    pollingRef.current = setInterval(checkNewWishes, 30000);

    return () => {
      clearTimeout(initialTimer);
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [authed, templateDataId]);

  // Reset new wishes count when visiting /dashboard/wishes
  useEffect(() => {
    if (pathname.startsWith('/dashboard/wishes')) {
      setNewWishesCount(0);
      localStorage.setItem('lastWishesVisit', new Date().toISOString());
    }
  }, [pathname]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('session');
    const sessionEmail = localStorage.getItem('sessionEmail');

    if (!session) {
      router.replace('/login');
    } else {
      setAuthed(true);
      if (sessionEmail) {
        fetchUser(sessionEmail);
      } else {
        setLoading(false);
      }
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    localStorage.removeItem('session');
    localStorage.removeItem('sessionEmail');
    localStorage.removeItem('sessionName');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/login');
  };

  if (pathname === '/login') return <>{children}</>;
  if (!authed) return null;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Mobile bottom navigation items
  const mobileNavItems = [
    { label: 'Overview', href: '/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { label: 'Template', href: '/dashboard/kelola-template', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
    { label: 'Wishes', href: '/dashboard/wishes', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
    { label: 'Settings', href: '/dashboard/settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
  ];

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
        {!isMobile && <Sidebar userName={user?.name} userEmail={user?.email} userInitial={userInitial} newWishesCount={newWishesCount} onToggle={setSidebarCollapsed} />}
        <main
          style={{
            marginLeft: !isMobile ? (sidebarCollapsed ? '72px' : 'var(--sidebar-width)') : '0',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            paddingBottom: isMobile ? '64px' : '0',
          }}
        >
          {/* Top Header Bar */}
          <header
            style={{
              height: 'var(--header-height)',
              background: 'var(--bg-2)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '0 1rem' : '0 2rem',
              flexShrink: 0,
            }}
          >
            {isMobile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), #8a6d2b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#0a0807', fontWeight: 600, fontSize: '0.9rem' }}>E</span>
                </div>
                <span style={{ fontFamily: "'Italiana', serif", fontSize: '1.1rem', color: 'var(--gold)' }}>
                  Terima Undangan
                </span>
              </div>
            ) : (
              <div>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 400,
                  color: 'var(--gold)', fontStyle: 'italic',
                }}>{title}</h1>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isMobile ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--cream-dim)',
                      cursor: 'pointer', padding: '0.5rem', borderRadius: '4px',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {mobileMenuOpen ? (
                        <>
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </>
                      ) : (
                        <>
                          <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                        </>
                      )}
                    </svg>
                  </button>
                  {mobileMenuOpen && (
                    <div
                      style={{
                        position: 'absolute', top: '100%', right: '-0.75rem', marginTop: '0.5rem',
                        background: 'var(--bg-3)', border: '1px solid var(--line)',
                        borderRadius: 'var(--radius)', minWidth: '200px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 100, padding: '0.5rem',
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem', borderBottom: '1px solid var(--line)',
                      }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'var(--bg-3)', border: '1px solid var(--line)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 500,
                        }}>{userInitial}</div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--cream)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>
                            {user?.name || 'User'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>
                            {user?.email || ''}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { handleLogout(); }}
                        style={{
                          width: '100%', padding: '0.75rem', background: 'none', border: 'none',
                          color: 'var(--cream-dim)', fontSize: '0.85rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          borderRadius: 'var(--radius-sm)', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {user && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.3rem 0.75rem', background: 'var(--bg)',
                      border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem', color: 'var(--cream-dim)',
                    }}>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--gold), #8a6d2b)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', color: '#0a0807', fontWeight: 600,
                      }}>{userInitial}</div>
                      <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name || user.email}
                      </span>
                    </div>
                  )}
                  <button onClick={handleLogout}
                    style={{
                      background: 'transparent', border: '1px solid var(--line)',
                      color: 'var(--cream-dim)', padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', cursor: 'pointer',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </>
              )}
            </div>
          </header>

          {/* Page Content */}
          <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
            {children}

            {/* Wishes notification toast */}
            {toast && (
              <div
                style={{
                  position: 'fixed',
                  bottom: isMobile ? '5rem' : '1.5rem',
                  right: '1.5rem',
                  zIndex: 9999,
                  background: 'var(--bg-3)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem 1.25rem',
                  maxWidth: '360px',
                  boxShadow: '0 8px 32px rgba(0,0,0,.5)',
                  animation: 'slideUp 0.3s ease-out',
                  cursor: 'pointer',
                }}
                onClick={() => router.push('/dashboard/wishes')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🫶</span>
                  <span style={{ fontSize: '.82rem', color: 'var(--gold)', fontWeight: 500 }}>
                    {toast.count} Ucapan Baru
                  </span>
                </div>
                {toast.wishes.slice(0, 3).map((w) => (
                  <div key={w.id} style={{ padding: '.25rem 0', borderBottom: '1px solid var(--line-light)', fontSize: '.78rem' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{w.name}</span>
                    <span style={{ color: 'var(--cream-dim)', marginLeft: '.25rem' }}>
                      — {w.message.length > 40 ? w.message.slice(0, 40) + '…' : w.message}
                    </span>
                  </div>
                ))}
                <div style={{ fontSize: '.7rem', color: 'var(--muted)', textAlign: 'right', marginTop: '.35rem' }}>
                  Klik untuk lihat
                </div>
              </div>
            )}

            <style>{`
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes wishPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
            `}</style>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <nav
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, height: '64px',
              background: 'var(--bg-2)', borderTop: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-around',
              zIndex: 100, paddingBottom: 'env(safe-area-inset-bottom, 0)',
            }}
          >
            {mobileNavItems.map((item) => {
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => { router.push(item.href); setMobileMenuOpen(false); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0.5rem 0.75rem', minWidth: '60px',
                    color: isActive ? 'var(--gold)' : 'var(--cream-dim)',
                    transition: 'color 0.2s', position: 'relative',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isActive ? 'var(--gold)' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </span>
                  {item.label === 'Wishes' && newWishesCount > 0 && !pathname.startsWith('/dashboard/wishes') && (
                    <span style={{
                      position: 'absolute', top: '4px', right: '8px',
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: '#ef4444', color: '#fff',
                      fontSize: '0.5rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{newWishesCount > 9 ? '9+' : newWishesCount}</span>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </UserContext.Provider>
  );
}
