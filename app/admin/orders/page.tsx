'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const card: React.CSSProperties = {
  background: '#0a1424',
  border: '1px solid rgba(212,175,55,.1)',
  borderRadius: '8px',
  padding: '1.5rem',
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

const goldBtn: React.CSSProperties = {
  background: 'linear-gradient(135deg,#d4af37,#aa8c2c)',
  border: 'none',
  color: '#0a0807',
  padding: '.4rem .85rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '.75rem',
};

const badge = (status: string): React.CSSProperties => ({
  padding: '.2rem .55rem',
  borderRadius: '99px',
  fontSize: '.7rem',
  display: 'inline-block',
  background:
    status === 'pending' ? 'rgba(234,179,8,.12)' :
    status === 'paid' ? 'rgba(34,197,94,.12)' :
    status === 'cancelled' ? 'rgba(239,68,68,.12)' :
    status === 'refunded' ? 'rgba(168,85,247,.12)' : 'rgba(253,246,227,.08)',
  color:
    status === 'pending' ? '#eab308' :
    status === 'paid' ? '#22c55e' :
    status === 'cancelled' ? '#ef4444' :
    status === 'refunded' ? '#a855f7' : 'rgba(253,246,227,.5)',
});

const formatRupiah = (num: number) => 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => { setError('Failed to load orders'); setLoading(false); });
  }, []);

  if (error) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem', color: '#fdf6e3' }}>Orders</h1>
      {loading ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading...</div>
      ) : !orders.length ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>No orders found</div>
      ) : (
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Invoice</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Template</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Status</th>
                  <th style={th}>Date</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={td}>#{o.id?.slice(0, 8) || '-'}</td>
                    <td style={td}>{o.customerName || o.customer?.name || '-'}</td>
                    <td style={td}>{o.templateName || o.template?.name || '-'}</td>
                    <td style={td}>{formatRupiah(o.amount || 0)}</td>
                    <td style={td}><span style={badge(o.status)}>{o.status}</span></td>
                    <td style={td}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button onClick={() => router.push(`/admin/orders/${o.id}`)} style={goldBtn}>View</button>
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
