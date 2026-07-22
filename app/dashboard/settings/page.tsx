'use client';

import { useState } from 'react';
import { useUser } from '@/lib/user-context';

export default function SettingsPage() {
  const { user, loading, refreshUser } = useUser();
  const [activeTab, setActiveTab] = useState('general');

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formInitialized, setFormInitialized] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize form when user data loads
  if (user && !formInitialized) {
    setName(user.name || '');
    setEmail(user.email || '');
    setFormInitialized(true);
  }

  // Hanya General tab yang fungsional — Appearance & Domain dihapus sementara
  // karena belum ada API backend yang mendukung
  const tabs = [
    { id: 'general', label: 'General' },
  ];

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }
    if (!email.trim()) {
      setError('Email tidak boleh kosong');
      return;
    }

    setIsSaving(true);

    try {
      const body: Record<string, any> = {
        email: user?.email || email,
        name: name.trim(),
      };

      // Only send newEmail if changed
      if (email.trim() !== user?.email) {
        body.newEmail = email.trim();
      }

      // Handle password change
      if (newPassword || currentPassword) {
        if (newPassword !== confirmPassword) {
          setError('Konfirmasi password baru tidak cocok');
          setIsSaving(false);
          return;
        }
        if (newPassword && newPassword.length < 6) {
          setError('Password baru minimal 6 karakter');
          setIsSaving(false);
          return;
        }
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan');
        return;
      }

      // Show success
      setSuccess(data.message || 'Profil berhasil diperbarui!');

      // Update localStorage if email changed
      if (data.customer?.email) {
        localStorage.setItem('sessionEmail', data.customer.email);
      }
      if (data.customer?.name) {
        localStorage.setItem('sessionName', data.customer.name);
      }

      // Refresh user context
      await refreshUser();

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Auto-dismiss success after 3s
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          color: 'var(--cream-dim)', fontSize: '0.9rem',
        }}>
          Memuat...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div className="animate-fadeIn">
        {/* Settings Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--line)',
            paddingBottom: '0',
            marginBottom: '2rem',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--cream-dim)',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-1px',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--cream)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--cream-dim)';
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Tab - Profile Settings */}
        {activeTab === 'general' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Success / Error Messages */}
            {success && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1rem', marginBottom: '1.5rem',
                background: 'rgba(52, 211, 153, 0.08)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#34d399', fontSize: '0.85rem',
                animation: 'fadeIn 0.3s ease-out',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1rem', marginBottom: '1.5rem',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444', fontSize: '0.85rem',
                animation: 'fadeIn 0.3s ease-out',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Profile Info Section */}
            <div
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), #8a6d2b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', color: '#0a0807', fontWeight: 600, flexShrink: 0,
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.3rem',
                      color: 'var(--gold)',
                      margin: 0,
                      fontStyle: 'italic',
                    }}
                  >
                    Profile Settings
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', margin: '0.25rem 0 0' }}>
                    Update your personal information and account settings
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Name */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                  />
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                marginBottom: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  marginBottom: '0.5rem',
                  fontStyle: 'italic',
                }}
              >
                Change Password
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', marginBottom: '1.5rem' }}>
                Leave empty if you don't want to change your password
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={user?.name ? 'Masukkan password saat ini' : 'Belum ada password, kosongkan jika tidak ingin menambah'}
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                  />
                </div>
              </div>
            </div>

            {/* Plan & Billing */}
            <div
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                marginBottom: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                }}
              >
                Account
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'rgba(201, 169, 97, 0.05)',
                    border: '1px solid rgba(201, 169, 97, 0.15)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 500 }}>Status</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', marginTop: '0.25rem' }}>
                      {user.email}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(52, 211, 153, 0.1)',
                      border: '1px solid rgba(52, 211, 153, 0.2)',
                      borderRadius: '100px',
                      color: '#34d399',
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {user.status || 'Active'}
                  </div>
                </div>


              </div>
            </div>

            {/* Save Button */}
            <div
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                style={{
                  padding: '0.7rem 2rem',
                  background: isSaving
                    ? 'var(--bg-3)'
                    : 'linear-gradient(135deg, var(--gold), #b8942e)',
                  border: 'none',
                  color: isSaving ? 'var(--cream-dim)' : 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.background = 'var(--gold-light)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--gold), #b8942e)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isSaving ? (
                  <>
                    <span style={{
                      width: '14px', height: '14px', border: '2px solid rgba(245,236,217,0.3)',
                      borderTopColor: 'var(--cream)', borderRadius: '50%', display: 'inline-block',
                      animation: 'settingsSpin 0.6s linear infinite',
                    }} />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Settings
                  </>
                )}
              </button>
            </div>

            <style>{`
              @keyframes settingsSpin { to { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

      </div>
    </div>
  );
}
