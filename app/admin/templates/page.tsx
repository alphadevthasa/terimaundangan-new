'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

const goldBtn: React.CSSProperties = {
  background: 'linear-gradient(135deg,#d4af37,#aa8c2c)',
  border: 'none',
  color: '#0a0807',
  padding: '.7rem 1.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '.82rem',
};

const redBtn: React.CSSProperties = {
  background: 'rgba(239,68,68,.1)',
  border: '1px solid rgba(239,68,68,.2)',
  color: '#ef4444',
  padding: '.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '.78rem',
};

export default function AdminTemplates() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/admin/templates')
      .then(r => r.json())
      .then(d => { setTemplates(d.templates ?? []); setLoading(false); })
      .catch(() => { setError('Failed to load templates'); setLoading(false); });
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"?`)) return;
    try {
      const r = await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
      if (!r.ok) {
        const d = await r.json();
        alert(d.error || 'Failed to delete');
        return;
      }
      load();
    } catch { alert('Failed to delete template'); }
  };

  if (error) return (
    <div style={{ background: '#0a1424', border: '1px solid rgba(212,175,55,.1)', borderRadius: '8px', textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#fdf6e3' }}>Templates</h1>
        <button style={goldBtn} onClick={() => router.push('/admin/templates/create')}>Create New</button>
      </div>

      {loading ? (
        <div style={{ background: '#0a1424', border: '1px solid rgba(212,175,55,.1)', borderRadius: '8px', textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)' }}>Loading...</div>
      ) : !templates.length ? (
        <div style={{ background: '#0a1424', border: '1px solid rgba(212,175,55,.1)', borderRadius: '8px', textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)' }}>No templates yet</div>
      ) : (
        <div style={{ background: '#0a1424', border: '1px solid rgba(212,175,55,.1)', borderRadius: '8px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}></th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Theme</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Popular</th>
                <th style={thStyle}>Published</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id}>
                  <td style={tdStyle}>
                    {t.thumbnail ? <img src={t.thumbnail} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /> : null}
                  </td>
                  <td style={tdStyle}>{t.name}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block', background: 'rgba(212,175,55,.1)', color: '#d4af37' }}>{t.theme || '-'}</span>
                  </td>
                  <td style={tdStyle}>{t.type}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block',
                      ...(t.price === 'Free' ? { background: 'rgba(34,197,94,.12)', color: '#22c55e' } : { background: 'rgba(212,175,55,.15)', color: '#d4af37' }),
                    }}>{t.price}</span>
                  </td>
                  <td style={tdStyle}>
                    {t.isPopular ? <span style={{ padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block', background: 'rgba(212,175,55,.15)', color: '#d4af37' }}>Popular</span> : '-'}
                  </td>
                   <td style={tdStyle}>
                    <button onClick={async () => {
                      const next = !t.isPublished;
                      setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, isPublished: next } : x));
                      try {
                        const r = await fetch(`/api/admin/templates/${t.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isPublished: next }),
                        });
                        if (!r.ok) throw new Error();
                      } catch {
                        setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, isPublished: !next } : x));
                        alert('Failed to update publish status');
                      }
                    }} style={{
                      width: '36px', height: '20px', borderRadius: '99px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s',
                      background: t.isPublished ? '#22c55e' : 'rgba(253,246,227,.15)',
                    }}>
                      <span style={{
                        position: 'absolute', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left .2s',
                        left: t.isPublished ? '18px' : '2px',
                      }} />
                    </button>
                  </td>
                  <td style={tdStyle}>{new Date(t.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <button style={{ ...goldBtn, padding: '.5rem 1rem', fontSize: '.78rem' }} onClick={() => router.push(`/admin/templates/${t.id}/view`)}>View</button>
                      <button style={{ ...goldBtn, padding: '.5rem 1rem', fontSize: '.78rem' }} onClick={() => router.push(`/admin/templates/${t.id}/edit`)}>Edit</button>
                      <button style={redBtn} onClick={() => handleDelete(t.id, t.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
