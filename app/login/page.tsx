'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<'login' | 'signup'>(pathname === '/signup' ? 'signup' : 'login');

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

        <div style={{
          display: 'flex', marginBottom: '2rem',
          borderBottom: '1px solid rgba(201, 169, 97, 0.1)',
        }}>
          <button onClick={() => { setMode('login'); router.push('/login'); }}
            style={{
              flex: 1, padding: '0.75rem', background: 'none',
              border: 'none', color: mode === 'login' ? '#c9a961' : 'rgba(245, 236, 217, 0.4)',
              borderBottom: mode === 'login' ? '2px solid #c9a961' : '2px solid transparent',
              cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
          >Login</button>
          <button onClick={() => { setMode('signup'); router.push('/signup'); }}
            style={{
              flex: 1, padding: '0.75rem', background: 'none',
              border: 'none', color: mode === 'signup' ? '#c9a961' : 'rgba(245, 236, 217, 0.4)',
              borderBottom: mode === 'signup' ? '2px solid #c9a961' : '2px solid transparent',
              cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
          >Sign Up</button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('session', 'true'); router.push('/dashboard'); }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Email</label>
              <input type="email" required
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                  color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" required
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                  color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button type="submit"
              style={{
                width: '100%', padding: '0.85rem',
                background: 'linear-gradient(135deg, #c9a961, #b8942e)',
                border: 'none', color: '#0a0807', borderRadius: '4px',
                fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
              }}
            >Login</button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('session', 'true'); router.push('/dashboard'); }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Name</label>
              <input type="text" required
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                  color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Email</label>
              <input type="email" required
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                  color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(245, 236, 217, 0.6)', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" required
                style={{
                  width: '100%', padding: '0.75rem', background: '#0a0807',
                  border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: '4px',
                  color: '#f5ecd9', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button type="submit"
              style={{
                width: '100%', padding: '0.85rem',
                background: 'linear-gradient(135deg, #c9a961, #b8942e)',
                border: 'none', color: '#0a0807', borderRadius: '4px',
                fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
              }}
            >Sign Up</button>
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
    </div>
  );
}
