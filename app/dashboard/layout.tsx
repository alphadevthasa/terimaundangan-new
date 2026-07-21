'use client';

import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/list-template': 'List Template',
  '/dashboard/kelola-template': 'Kelola Template',
  '/dashboard/settings': 'Settings',
};

/** Check if pathname matches a known route prefix (for dynamic routes like [id]) */
function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Check prefix matches for dynamic routes
  if (pathname.startsWith('/dashboard/list-template/')) return 'Template Preview';
  if (pathname.startsWith('/dashboard/kelola-template/')) return 'Kelola Template';
  return 'Dashboard';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            padding: '0 2rem',
            flexShrink: 0,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'var(--gold)',
                fontStyle: 'italic',
              }}
            >
              {title}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={{
                background: 'transparent',
                border: '1px solid var(--line)',
                color: 'var(--cream-dim)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.color = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.color = 'var(--cream-dim)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Quick Help
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
