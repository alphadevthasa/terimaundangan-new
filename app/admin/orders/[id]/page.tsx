'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const card: React.CSSProperties = {
  background: '#0a1424',
  border: '1px solid rgba(212,175,55,.1)',
  borderRadius: '8px',
  padding: '1.5rem',
};

const goldBtn: React.CSSProperties = {
  background: 'linear-gradient(135deg,#d4af37,#aa8c2c)',
  border: 'none',
  color: '#0a0807',
  padding: '.6rem 1.25rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '.8rem',
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

const selectStyle: React.CSSProperties = {
  padding: '.4rem .65rem',
  background: '#060b14',
  border: '1px solid rgba(212,175,55,.15)',
  borderRadius: '4px',
  color: '#fdf6e3',
  fontSize: '.8rem',
  outline: 'none',
  cursor: 'pointer',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchOrder = () => {
    setLoading(true);
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); } else { setOrder(d.order || d); setNewStatus((d.order || d).status); }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load order'); setLoading(false); });
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleUpdateStatus = () => {
    if (!newStatus || newStatus === order.status) return;
    setUpdating(true);
    setFeedback('');
    fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) { setFeedback(d.error); } else { setFeedback('Status updated'); fetchOrder(); }
        setUpdating(false);
      })
      .catch(() => { setFeedback('Failed to update status'); setUpdating(false); });
  };

  if (loading) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading...</div>
  );

  if (error) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );

  if (!order) return null;

  return (
    <div>
      <span onClick={() => router.push('/admin/orders')} style={{ fontSize: '.8rem', color: 'rgba(212,175,55,.7)', cursor: 'pointer', marginBottom: '1.5rem', display: 'inline-block' }}>&lt;- Back to Orders</span>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem', color: '#fdf6e3' }}>Order #{order.id?.slice(0, 8)}</h1>

      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Customer Name</div>
              <div style={{ color: 'rgba(253,246,227,.8)', fontSize: '.82rem' }}>{order.customerName || order.customer?.name || '-'}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Email</div>
              <div style={{ color: 'rgba(253,246,227,.8)', fontSize: '.82rem' }}>{order.email || order.customer?.email || '-'}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Template Name</div>
              <div style={{ color: 'rgba(253,246,227,.8)', fontSize: '.82rem' }}>{order.templateName || order.template?.name || '-'}</div>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Amount</div>
              <div style={{ color: 'rgba(253,246,227,.8)', fontSize: '.82rem' }}>{formatRupiah(order.amount || 0)}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Status</div>
              <div><span style={badge(order.status)}>{order.status}</span></div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Invoice URL</div>
              <div style={{ color: 'rgba(253,246,227,.8)', fontSize: '.82rem' }}>
                {order.invoiceUrl ? <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#d4af37' }}>Open Invoice</a> : '-'}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Payment Method</div>
              <div style={{ color: 'rgba(253,246,227,.8)', fontSize: '.82rem' }}>{order.paymentMethod || '-'}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(212,175,55,.08)' }}>
          <div>
            <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Date</div>
            <div style={{ color: 'rgba(253,246,227,.8)', fontSize: '.82rem' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.4)', marginBottom: '.25rem' }}>Paid At</div>
            <div style={{ color: 'rgba(253,246,227,.8)', fontSize: '.82rem' }}>{order.paidAt ? new Date(order.paidAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</div>
          </div>
        </div>
      </div>

      <div style={{ ...card, marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem', color: '#fdf6e3' }}>Update Status</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={selectStyle}>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="cancelled">cancelled</option>
            <option value="refunded">refunded</option>
          </select>
          <button onClick={handleUpdateStatus} disabled={updating || newStatus === order.status} style={{ ...goldBtn, opacity: updating || newStatus === order.status ? '.5' : '1' }}>
            {updating ? 'Updating...' : 'Update Status'}
          </button>
          {feedback && <span style={{ fontSize: '.8rem', color: feedback === 'Status updated' ? '#22c55e' : '#ef4444' }}>{feedback}</span>}
        </div>
      </div>
    </div>
  );
}
