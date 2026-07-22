'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const card: React.CSSProperties = {
  background: '#0a1424',
  border: '1px solid rgba(212,175,55,.1)',
  borderRadius: '8px',
  padding: '1.5rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '380px',
  padding: '.6rem .8rem',
  background: '#060b14',
  border: '1px solid rgba(212,175,55,.15)',
  borderRadius: '4px',
  color: '#fdf6e3',
  fontSize: '.82rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); } else {
          setCustomer(d.customer);
          setName(d.customer.name || '');
          setEmail(d.customer.email || '');
        }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load user'); setLoading(false); });
  }, [id]);

  const handleUpdateProfile = async () => {
    setSaveError('');
    setSaveSuccess('');

    if (!name.trim()) { setSaveError('Nama tidak boleh kosong'); return; }
    if (!email.trim()) { setSaveError('Email tidak boleh kosong'); return; }

    setIsSaving(true);
    try {
      const body: Record<string, any> = { name: name.trim() };
      if (email.trim() !== customer.email) body.email = email.trim();
      if (newPassword) {
        if (newPassword.length < 6) { setSaveError('Password minimal 6 karakter'); setIsSaving(false); return; }
        if (newPassword !== confirmPassword) { setSaveError('Konfirmasi password tidak cocok'); setIsSaving(false); return; }
        body.newPassword = newPassword;
      }

      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error || 'Gagal menyimpan'); return; }

      setSaveSuccess(data.message || 'User berhasil diperbarui!');
      setCustomer({ ...customer, ...data.customer });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch {
      setSaveError('Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading...</div>
  );
  if (error) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );
  if (!customer) return null;

  const td = customer.templateData?.[0];
  const infoRows: { label: string; value: any }[] = [
    { label: 'Role', value: customer.isAdmin ? 'Admin' : 'User' },
    { label: 'Status', value: customer.status },
    { label: 'Template', value: td?.template?.name || '-' },
    { label: 'Bride', value: td?.brideNick },
    { label: 'Groom', value: td?.groomNick },
    { label: 'Wedding Date', value: td?.dateText || '-' },
    { label: 'Bank', value: td?.bankName },
    { label: 'Account', value: td?.bankAcc },
    { label: 'Created', value: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-' },
  ];

  const statusColor = customer.status === 'active' ? '#22c55e' : 'rgba(253,246,227,.5)';
  const statusBg = customer.status === 'active' ? 'rgba(34,197,94,.12)' : 'rgba(253,246,227,.08)';

  return (
    <div>
      <span onClick={() => router.push('/admin/users')} style={{ fontSize: '.8rem', color: 'rgba(212,175,55,.7)', cursor: 'pointer', marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '.35rem' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Users
      </span>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '.25rem', color: '#fdf6e3' }}>{customer.name || 'User Detail'}</h1>
      <p style={{ fontSize: '.82rem', color: 'rgba(253,246,227,.4)', marginBottom: '1.5rem' }}>{customer.email}</p>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem' }}>
        <span style={{ padding: '.25rem .6rem', borderRadius: '99px', fontSize: '.7rem', background: statusBg, color: statusColor }}>{customer.status}</span>
        {customer.isAdmin && <span style={{ padding: '.25rem .6rem', borderRadius: '99px', fontSize: '.7rem', background: 'rgba(212,175,55,.15)', color: '#d4af37' }}>Admin</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', maxWidth: '900px' }}>
        {/* Edit Profile Card */}
        <div style={card}>
          <h2 style={{ fontSize: '.95rem', fontWeight: 500, marginBottom: '1.25rem', color: '#fdf6e3', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Profile
          </h2>

          {saveError && (
            <div style={{ fontSize: '.78rem', color: '#ef4444', marginBottom: '1rem', padding: '.6rem .8rem', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '4px' }}>
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div style={{ fontSize: '.78rem', color: '#22c55e', marginBottom: '1rem', padding: '.6rem .8rem', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: '4px' }}>
              {saveSuccess}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '.72rem', color: 'rgba(253,246,227,.5)', marginBottom: '.35rem', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '.72rem', color: 'rgba(253,246,227,.5)', marginBottom: '.35rem', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <h3 style={{ fontSize: '.85rem', fontWeight: 500, marginTop: '1.5rem', marginBottom: '.75rem', color: '#d4af37', borderTop: '1px solid rgba(212,175,55,.08)', paddingTop: '1rem' }}>
            Reset Password
          </h3>
          <p style={{ fontSize: '.72rem', color: 'rgba(253,246,227,.35)', marginBottom: '.75rem' }}>Leave empty to keep current password</p>
          <div style={{ marginBottom: '.75rem' }}>
            <label style={{ fontSize: '.72rem', color: 'rgba(253,246,227,.5)', marginBottom: '.35rem', display: 'block' }}>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '.72rem', color: 'rgba(253,246,227,.5)', marginBottom: '.35rem', display: 'block' }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ketik ulang password baru" style={inputStyle} />
          </div>

          <button onClick={handleUpdateProfile} disabled={isSaving}
            style={{
              padding: '.65rem 1.5rem',
              background: isSaving ? '#4a4a4a' : 'linear-gradient(135deg,#d4af37,#aa8c2c)',
              border: 'none', borderRadius: '4px', color: '#0a0807', fontSize: '.82rem', fontWeight: 500,
              cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '.5rem',
            }}
          >
            {isSaving ? 'Menyimpan...' : 'Save Changes'}
            {isSaving && <span style={{ width: '12px', height: '12px', border: '2px solid rgba(10,8,7,0.3)', borderTopColor: '#0a0807', borderRadius: '50%', display: 'inline-block', animation: 'uspin 0.6s linear infinite' }} />}
          </button>
          <style>{`@keyframes uspin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* User Info Card */}
        <div style={card}>
          <h2 style={{ fontSize: '.95rem', fontWeight: 500, marginBottom: '1.25rem', color: '#fdf6e3', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            User Info
          </h2>
          {infoRows.filter(r => r.value && r.value !== '').map(r => (
            <div key={r.label} style={{ display: 'flex', padding: '.55rem 0', borderBottom: '1px solid rgba(212,175,55,.04)', fontSize: '.82rem' }}>
              <div style={{ width: '110px', flexShrink: 0, color: 'rgba(253,246,227,.4)', fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{r.label}</div>
              <div style={{ color: 'rgba(253,246,227,.8)' }}>{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
