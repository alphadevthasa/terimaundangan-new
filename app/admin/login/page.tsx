'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }
    localStorage.setItem('admin', 'true');
    localStorage.setItem('adminEmail', email);
    router.push('/admin');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060b14', fontFamily: "'Jost', sans-serif" }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '380px', padding: '2.5rem', background: '#0a1424', border: '1px solid rgba(212,175,55,.2)', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#d4af37', fontFamily: "'Italiana', serif", marginBottom: '.25rem' }}>Admin Panel</div>
          <div style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.4)' }}>Terima Undangan</div>
        </div>
        {error && <div style={{ fontSize: '.8rem', color: '#ef4444', marginBottom: '1rem', padding: '.5rem .75rem', background: 'rgba(239,68,68,.1)', borderRadius: '4px' }}>{error}</div>}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.9rem', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.9rem', outline: 'none' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '.8rem', background: 'linear-gradient(135deg,#d4af37,#aa8c2c)', border: 'none', borderRadius: '4px', color: '#0a0807', fontSize: '.9rem', fontWeight: 500, cursor: 'pointer' }}>Masuk</button>
      </form>
    </div>
  );
}
