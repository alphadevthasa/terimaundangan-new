'use client';
import { useEffect, useState } from 'react';

const formatRupiah = (num: number) => 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const labelStyle = (label: string) => label === 'Total Pendapatan' || label === 'Status' || label === 'Amount' ? { color: '#d4af37' as const } : {};

const cardBase = {
  background: '#0a1424',
  border: '1px solid rgba(212,175,55,.1)',
  borderRadius: '8px',
  padding: '1.25rem',
};

const thStyle: React.CSSProperties = {
  padding: '.7rem .85rem',
  textAlign: 'left',
  fontSize: '.72rem',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  color: 'rgba(253,246,227,.4)',
  borderBottom: '1px solid rgba(212,175,55,.08)',
};

const tdStyle: React.CSSProperties = {
  padding: '.7rem .85rem',
  fontSize: '.82rem',
  borderBottom: '1px solid rgba(212,175,55,.04)',
  color: 'rgba(253,246,227,.7)',
};

const badge = (type: string): React.CSSProperties => {
  if (type === 'paid') return { padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block', background: 'rgba(34,197,94,.12)', color: '#22c55e' };
  if (type === 'pending') return { padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block', background: 'rgba(212,175,55,.15)', color: '#d4af37' };
  return { padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block', background: 'rgba(239,68,68,.1)', color: '#ef4444' };
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError('Failed to load stats'); setLoading(false); });
  }, []);

  if (error) return (
    <div style={{ ...cardBase, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );

  const cards = [
    { label: 'Total Templates', value: data?.totalTemplates },
    { label: 'Total Users', value: data?.totalUsers },
    { label: 'Total Orders', value: data?.totalOrders },
    { label: 'Total Pendapatan', value: data?.totalPendapatan != null ? formatRupiah(data.totalPendapatan) : null },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem', color: '#fdf6e3' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} style={cardBase}>
            <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.5)', marginBottom: '.5rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 500, ...labelStyle(c.label) }}>
              {loading ? 'Loading...' : c.value ?? 0}
            </div>
          </div>
        ))}
      </div>

      <div style={cardBase}>
        <h2 style={{ fontSize: '.95rem', fontWeight: 500, marginBottom: '1rem', color: '#fdf6e3' }}>Recent Orders</h2>
        {!data?.recentOrders?.length ? (
          <div style={{ color: 'rgba(253,246,227,.5)', fontSize: '.85rem', padding: '1.5rem 0', textAlign: 'center' }}>No orders yet</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Template</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o: any) => (
                  <tr key={o.id}>
                    <td style={tdStyle}>{o.customerName || o.customerEmail}</td>
                    <td style={tdStyle}>{o.templateName}</td>
                    <td style={{ ...tdStyle, ...labelStyle('Amount') }}>{o.amount > 0 ? formatRupiah(o.amount) : '-'}</td>
                    <td style={tdStyle}><span style={badge(o.status)}>{o.status}</span></td>
                    <td style={tdStyle}>{new Date(o.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
