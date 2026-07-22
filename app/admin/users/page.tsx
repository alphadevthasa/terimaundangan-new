'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const card: React.CSSProperties = {
  background: '#0a1424',
  border: '1px solid rgba(212,175,55,.1)',
  borderRadius: '8px',
  padding: '1.25rem',
};

const th: React.CSSProperties = {
  padding: '.7rem .85rem',
  textAlign: 'left',
  fontSize: '.72rem',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  color: 'rgba(253,246,227,.4)',
  borderBottom: '1px solid rgba(212,175,55,.08)',
};

const td: React.CSSProperties = {
  padding: '.7rem .85rem',
  fontSize: '.82rem',
  borderBottom: '1px solid rgba(212,175,55,.04)',
  color: 'rgba(253,246,227,.7)',
};

const badge = (status: string): React.CSSProperties => ({
  padding: '.2rem .55rem',
  borderRadius: '99px',
  fontSize: '.7rem',
  display: 'inline-block',
  background: status === 'active' ? 'rgba(34,197,94,.12)' : 'rgba(253,246,227,.08)',
  color: status === 'active' ? '#22c55e' : 'rgba(253,246,227,.5)',
});

const goldBtn: React.CSSProperties = {
  background: 'linear-gradient(135deg,#d4af37,#aa8c2c)',
  border: 'none',
  color: '#0a0807',
  padding: '.7rem 1.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '.8rem',
};

const dangerBtn: React.CSSProperties = {
  background: 'rgba(239,68,68,.1)',
  border: '1px solid rgba(239,68,68,.2)',
  color: '#ef4444',
  padding: '.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '.78rem',
};

export default function UsersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = () => {
    setLoading(true);
    fetch('/api/admin/customers')
      .then(r => r.json())
      .then(d => { setCustomers(d.customers || []); setLoading(false); })
      .catch(() => { setError('Failed to load users'); setLoading(false); });
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Delete this user permanently?')) return;
    fetch(`/api/admin/customers/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => fetchCustomers())
      .catch(() => alert('Failed to delete user'));
  };

  if (error) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem', color: '#fdf6e3' }}>Users</h1>
      {loading ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading...</div>
      ) : !customers.length ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>No users found</div>
      ) : (
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Template</th>
                  <th style={th}>Wedding Date</th>
                  <th style={th}>Status</th>
                  <th style={th}>Registered</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td style={td}>{c.name || '-'}</td>
                    <td style={td}>{c.email || '-'}</td>
                    <td style={td}>{c.templateName || '-'}</td>
                    <td style={td}>{c.templateData?.[0]?.dateText || '-'}</td>
                    <td style={td}><span style={badge(c.status)}>{c.status}</span></td>
                    <td style={td}>{new Date(c.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button onClick={() => router.push(`/admin/users/${c.id}`)} style={{ ...goldBtn, padding: '.4rem .85rem', fontSize: '.75rem', marginRight: '.5rem' }}>View</button>
                      <button onClick={() => handleDelete(c.id)} style={dangerBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
