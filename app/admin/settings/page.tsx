'use client';
import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('adminEmail') || '';
    const name = localStorage.getItem('adminName') || '';
    setAdminEmail(email);
    setAdminName(name);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Password saat ini wajib diisi');
      return;
    }
    if (!newPassword) {
      setError('Password baru wajib diisi');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mengganti password');
        return;
      }

      setSuccess('Password berhasil diganti!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem', color: '#fdf6e3' }}>Settings</h1>
      <p style={{ fontSize: '.85rem', color: 'rgba(253,246,227,.5)', marginBottom: '1.5rem' }}>
        Manage your admin account settings
      </p>

      {/* Account Info */}
      <div style={{
        background: '#0a1424', border: '1px solid rgba(212,175,55,.1)',
        borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', maxWidth: '600px',
      }}>
        <h2 style={{ fontSize: '.95rem', fontWeight: 500, marginBottom: '1rem', color: '#fdf6e3' }}>
          <i className="fas fa-user-circle" style={{marginRight:'.5rem', color: '#d4af37'}}></i>
          Account
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid rgba(212,175,55,.06)' }}>
            <span style={{ fontSize: '.82rem', color: 'rgba(253,246,227,.5)' }}>Name</span>
            <span style={{ fontSize: '.82rem', color: '#fdf6e3' }}>{adminName || '-'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid rgba(212,175,55,.06)' }}>
            <span style={{ fontSize: '.82rem', color: 'rgba(253,246,227,.5)' }}>Email</span>
            <span style={{ fontSize: '.82rem', color: '#fdf6e3' }}>{adminEmail || '-'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0' }}>
            <span style={{ fontSize: '.82rem', color: 'rgba(253,246,227,.5)' }}>Role</span>
            <span style={{
              fontSize: '.75rem', padding: '.15rem .55rem', borderRadius: '99px',
              background: 'rgba(212,175,55,.15)', color: '#d4af37',
            }}>Admin</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div style={{
        background: '#0a1424', border: '1px solid rgba(212,175,55,.1)',
        borderRadius: '8px', padding: '1.5rem', maxWidth: '600px',
      }}>
        <h2 style={{ fontSize: '.95rem', fontWeight: 500, marginBottom: '.25rem', color: '#fdf6e3' }}>
          <i className="fas fa-lock" style={{marginRight:'.5rem', color: '#d4af37'}}></i>
          Change Password
        </h2>
        <p style={{ fontSize: '.78rem', color: 'rgba(253,246,227,.4)', marginBottom: '1.25rem' }}>
          Update your admin account password
        </p>

        {error && (
          <div style={{
            fontSize: '.8rem', color: '#ef4444', marginBottom: '1rem',
            padding: '.65rem .85rem', background: 'rgba(239,68,68,.1)',
            border: '1px solid rgba(239,68,68,.2)', borderRadius: '4px',
            display: 'flex', alignItems: 'center', gap: '.5rem',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            fontSize: '.8rem', color: '#22c55e', marginBottom: '1rem',
            padding: '.65rem .85rem', background: 'rgba(34,197,94,.1)',
            border: '1px solid rgba(34,197,94,.2)', borderRadius: '4px',
            display: 'flex', alignItems: 'center', gap: '.5rem',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '.78rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' }}>
              Current Password
            </label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} disabled={isLoading}
              style={{ width: '100%', maxWidth: '380px', padding: '.65rem .8rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.85rem', outline: 'none', opacity: isLoading ? .5 : 1, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '.78rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' }}>
              New Password
            </label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={isLoading} placeholder="Minimal 6 karakter"
              style={{ width: '100%', maxWidth: '380px', padding: '.65rem .8rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.85rem', outline: 'none', opacity: isLoading ? .5 : 1, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '.78rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' }}>
              Confirm New Password
            </label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isLoading}
              style={{ width: '100%', maxWidth: '380px', padding: '.65rem .8rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.85rem', outline: 'none', opacity: isLoading ? .5 : 1, boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" disabled={isLoading}
            style={{
              padding: '.7rem 1.5rem', background: isLoading ? '#4a4a4a' : 'linear-gradient(135deg,#d4af37,#aa8c2c)',
              border: 'none', borderRadius: '4px', color: '#0a0807', fontSize: '.85rem', fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '.5rem',
            }}
          >
            {isLoading ? (
              <>
                <span style={{ width: '14px', height: '14px', border: '2px solid rgba(10,8,7,0.3)', borderTopColor: '#0a0807', borderRadius: '50%', display: 'inline-block', animation: 'admSpin2 0.6s linear infinite' }} />
                Menyimpan...
              </>
            ) : 'Update Password'}
          </button>
        </form>

        <style>{`@keyframes admSpin2 { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
