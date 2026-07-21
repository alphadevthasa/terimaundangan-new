'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const card: React.CSSProperties = {
  background: '#0a1424',
  border: '1px solid rgba(212,175,55,.1)',
  borderRadius: '8px',
  padding: '1.25rem',
};

const detailRow: React.CSSProperties = {
  display: 'flex',
  padding: '.65rem 0',
  borderBottom: '1px solid rgba(212,175,55,.04)',
  fontSize: '.82rem',
};

const label: React.CSSProperties = {
  width: '140px',
  flexShrink: 0,
  color: 'rgba(253,246,227,.4)',
  fontSize: '.72rem',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
};

const value: React.CSSProperties = {
  color: 'rgba(253,246,227,.8)',
};

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); } else { setCustomer(d.customer); }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load user'); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading...</div>
  );

  if (error) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );

  if (!customer) return null;

  const rows: { label: string; value: any }[] = [
    { label: 'Name', value: customer.name },
    { label: 'Email', value: customer.email },
    { label: 'Status', value: customer.status },
    { label: 'Template', value: customer.templateName },
    { label: 'Bride', value: customer.brideNick },
    { label: 'Groom', value: customer.groomNick },
    { label: 'Wedding Date', value: customer.dateText },
    { label: 'Akad Date', value: customer.akadDate },
    { label: 'Akad Time', value: customer.akadTime },
    { label: 'Akad Place', value: customer.akadPlace },
    { label: 'Reception Date', value: customer.resepsiDate },
    { label: 'Reception Time', value: customer.resepsiTime },
    { label: 'Reception Place', value: customer.resepsiPlace },
    { label: 'Bank', value: customer.bankName },
    { label: 'Account', value: customer.bankAcc },
    { label: 'Account Holder', value: customer.bankHolder },
    { label: 'Created', value: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : null },
  ];

  return (
    <div>
      <span onClick={() => router.push('/admin/users')} style={{ fontSize: '.8rem', color: 'rgba(212,175,55,.7)', cursor: 'pointer', marginBottom: '1.5rem', display: 'inline-block' }}>&lt;- Back to Users</span>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem', color: '#fdf6e3' }}>{customer.name || 'User Detail'}</h1>
      <div style={card}>
        {rows.filter(r => r.value && r.value !== '').map(r => (
          <div key={r.label} style={detailRow}>
            <div style={label}>{r.label}</div>
            <div style={value}>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
