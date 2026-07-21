'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'fa-gauge-high' },
  { href: '/admin/templates', label: 'Templates', icon: 'fa-layer-group' },
  { href: '/admin/users', label: 'Users', icon: 'fa-users' },
  { href: '/admin/orders', label: 'Orders', icon: 'fa-cart-shopping' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!authed) return null;

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
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(212,175,55,.08)' }}>
          <button onClick={() => { localStorage.removeItem('admin'); localStorage.removeItem('adminEmail'); router.push('/admin/login'); }}
            style={{ width: '100%', padding: '.6rem', background: 'none', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: 'rgba(253,246,227,.4)', fontSize: '.78rem', cursor: 'pointer' }}
          ><i className="fas fa-right-from-bracket" style={{marginRight:'.35rem'}}></i>Logout</button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>{children}</main>
    </div>
  );
}
