'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'fa-gauge-high' },
  { href: '/admin/templates', label: 'Templates', icon: 'fa-layer-group' },
  { href: '/admin/users', label: 'Users', icon: 'fa-users' },
  { href: '/admin/orders', label: 'Orders', icon: 'fa-cart-shopping' },
  { href: '/admin/revenue', label: 'Revenue', icon: 'fa-chart-line' },
  { href: '/admin/settings', label: 'Settings', icon: 'fa-gear' },
];

interface AdminUser {
  name: string;
  email: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check localStorage 'admin' flag (set by admin login page).
    // DO NOT check document.cookie — the real session cookie is httpOnly
    // (inaccessible via JS), and the forgeable 'session=true' cookie that
    // customer login sets would falsely trigger the admin redirect below.
    const admin = localStorage.getItem('admin');

    if (!admin) {
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else {
        setAuthed(true);
      }
      return;
    }

    // Already authenticated as admin — redirect away from login page
    if (pathname === '/admin/login') {
      router.replace('/admin');
      return;
    }

    setAuthed(true);
    const name = localStorage.getItem('adminName') || '';
    const email = localStorage.getItem('adminEmail') || '';
    if (name || email) {
      setAdminUser({ name, email });
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;
  if (!authed) return null;

  const adminInitial = adminUser?.name
    ? adminUser.name.charAt(0).toUpperCase()
    : adminUser?.email
      ? adminUser.email.charAt(0).toUpperCase()
      : 'A';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#04070d', color: '#fdf6e3', fontFamily: "'Jost', sans-serif" }}>
      <aside style={{ width: '240px', flexShrink: 0, background: '#0a1424', borderRight: '1px solid rgba(212,175,55,.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(212,175,55,.08)' }}>
          <div style={{ fontFamily: "'Italiana', serif", fontSize: '1.1rem', color: '#d4af37' }}>Admin Panel</div>
          <div style={{ fontSize: '.65rem', color: 'rgba(253,246,227,.35)', marginTop: '.15rem', letterSpacing: '.05em' }}>Terima Undangan</div>
        </div>
        <nav style={{ flex: 1, padding: '.75rem' }}>
          {NAV.map(item => (
            <button key={item.href} onClick={() => router.push(item.href)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.7rem .85rem',
                background: pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? 'rgba(212,175,55,.12)' : 'transparent',
                border: 'none', borderRadius: '6px', color: pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? '#d4af37' : 'rgba(253,246,227,.5)',
                fontSize: '.82rem', cursor: 'pointer', textAlign: 'left', marginBottom: '.2rem', transition: 'all .15s',
              }}
            >
              <i className={`fas ${item.icon}`} style={{ width: '16px', textAlign: 'center', fontSize: '.75rem' }}></i>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Admin user info */}
        {adminUser && (
          <div style={{ padding: '.75rem 1.25rem', borderTop: '1px solid rgba(212,175,55,.08)', borderBottom: '1px solid rgba(212,175,55,.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af37, #aa8c2c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.7rem', color: '#0a0807', fontWeight: 600, flexShrink: 0,
              }}>
                {adminInitial}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '.78rem', fontWeight: 500, color: '#fdf6e3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {adminUser.name || adminUser.email}
                </div>
                <div style={{ fontSize: '.65rem', color: 'rgba(253,246,227,.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {adminUser.email}
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(212,175,55,.08)' }}>
          <button onClick={handleLogout}
            style={{ width: '100%', padding: '.6rem', background: 'none', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: 'rgba(253,246,227,.4)', fontSize: '.78rem', cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,.4)'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,.15)'; e.currentTarget.style.color = 'rgba(253,246,227,.4)'; }}
          ><i className="fas fa-right-from-bracket" style={{marginRight:'.35rem'}}></i>Logout</button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>{children}</main>
    </div>
  );
}
