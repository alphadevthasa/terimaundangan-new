'use client';
import { useEffect, useState } from 'react';

const formatRupiah = (num: number) => 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

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

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/revenue')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError('Failed to load revenue'); setLoading(false); });
  }, []);

  if (error) return (
    <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );

  const summaryCards = data ? [
    { label: 'Total Pendapatan', value: formatRupiah(data.totalRevenue), color: '#22c55e' },
    { label: 'Pendapatan Kotor (Gross)', value: formatRupiah(data.gross), color: '#d4af37' },
    { label: 'PPN', value: formatRupiah(data.ppn), color: '#eab308' },
    { label: 'Promo / Diskon', value: formatRupiah(data.promo), color: '#a855f7' },
    { label: 'Pendapatan Bersih (Nett)', value: formatRupiah(data.nett), color: '#22c55e' },
  ] : [];

  const maxRevenue = data?.monthlyData?.length
    ? Math.max(...data.monthlyData.map((d: any) => d.revenue), 1)
    : 1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#fdf6e3' }}>Revenue</h1>
        {data && <span style={{ fontSize: '.82rem', color: 'rgba(253,246,227,.4)' }}>{data.totalOrders} transaksi</span>}
      </div>

      {loading ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading...</div>
      ) : !data ? null : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '.75rem', marginBottom: '1.5rem' }}>
            {summaryCards.map(c => (
              <div key={c.label} style={card}>
                <div style={{ fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'rgba(253,246,227,.5)', marginBottom: '.4rem' }}>{c.label}</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 500, color: c.color }}>{c.value}</div>
              </div>
            ))}
          </div>

          {data.monthlyData?.length > 0 && (
            <div style={{ ...card, marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '.95rem', fontWeight: 500, marginBottom: '1rem', color: '#fdf6e3' }}>Revenue per Bulan</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.5rem', height: '140px', padding: '0 .5rem' }}>
                {data.monthlyData.map((d: any) => {
                  const h = (d.revenue / maxRevenue) * 120;
                  const label = d.month.split('-').slice(1).join('/');
                  return (
                    <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.3rem', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '.6rem', color: 'rgba(253,246,227,.4)' }}>{formatRupiah(d.revenue)}</span>
                      <div style={{
                        width: '100%', borderRadius: '4px 4px 0 0',
                        background: 'linear-gradient(180deg, #d4af37, #aa8c2c)',
                        height: `${h}px`,
                        minHeight: '4px',
                        transition: 'height .3s',
                      }} />
                      <span style={{ fontSize: '.65rem', color: 'rgba(253,246,227,.5)', marginTop: '.2rem' }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {data.templateData?.length > 0 && (
            <div style={card}>
              <h2 style={{ fontSize: '.95rem', fontWeight: 500, marginBottom: '1rem', color: '#fdf6e3' }}>Revenue per Template</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={th}>Template</th>
                      <th style={th}>Orders</th>
                      <th style={th}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.templateData.map((t: any) => (
                      <tr key={t.name}>
                        <td style={td}>{t.name}</td>
                        <td style={td}>{t.count}</td>
                        <td style={{ ...td, color: '#d4af37' }}>{formatRupiah(t.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
