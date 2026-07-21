'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTemplate() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({ name: '', description: '', type: 'wedding', thumbnail: '', price: 'Free', isPopular: false, html: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/templates/${id}`);
        if (!res.ok) throw new Error('Failed to load template');
        const d = await res.json();
        setForm({ name: d.name || '', description: d.description || '', type: d.type || 'wedding', thumbnail: d.thumbnail || '', price: d.price || 'Free', isPopular: !!d.isPopular, html: d.html || '' });
      } catch (err: any) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to update template'); }
      router.push('/admin/templates');
    } catch (err: any) { setError(err.message); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.9rem' }}>Loading...</div>;

  const s = { label: { fontSize: '.8rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' as const },
    input: { width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.9rem', outline: 'none' },
    textarea: { width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.78rem', fontFamily: 'monospace', outline: 'none', resize: 'vertical' as const },
    field: { marginBottom: '1rem' } };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <button onClick={() => router.push('/admin/templates')} style={{ background: 'none', border: 'none', color: 'rgba(253,246,227,.5)', fontSize: '.85rem', cursor: 'pointer', padding: 0, marginBottom: '1.5rem' }}>&lt;- Back to Templates</button>
      <h1 style={{ fontSize: '1.3rem', color: '#fdf6e3', marginBottom: '1.5rem' }}>Edit Template</h1>
      {error && <div style={{ fontSize: '.8rem', color: '#ef4444', marginBottom: '1rem', padding: '.5rem .75rem', background: 'rgba(239,68,68,.1)', borderRadius: '4px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ background: '#0a1424', border: '1px solid rgba(212,175,55,.1)', borderRadius: '8px', padding: '2rem' }}>
        <div style={s.field}>
          <label style={s.label}>Name</label>
          <input style={s.input} value={form.name} onChange={e => update('name', e.target.value)} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Description</label>
          <textarea style={{ ...s.textarea, fontSize: '.9rem', fontFamily: "'Jost', sans-serif" } as any} rows={3} value={form.description} onChange={e => update('description', e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Type</label>
            <select style={s.input} value={form.type} onChange={e => update('type', e.target.value)}>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="corporate">Corporate</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Price</label>
            <input style={s.input} value={form.price} onChange={e => update('price', e.target.value)} />
          </div>
        </div>
        <div style={s.field}>
          <label style={s.label}>Thumbnail URL</label>
          <input style={s.input} value={form.thumbnail} onChange={e => update('thumbnail', e.target.value)} />
        </div>
        <div style={{ ...s.field, display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input type="checkbox" id="isPopular" checked={form.isPopular} onChange={e => update('isPopular', e.target.checked)} style={{ accentColor: '#d4af37' }} />
          <label htmlFor="isPopular" style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.6)', cursor: 'pointer' }}>Popular template</label>
        </div>
        <div style={s.field}>
          <label style={s.label}>HTML</label>
          <textarea style={s.textarea} rows={15} value={form.html} onChange={e => update('html', e.target.value)} />
        </div>
        <button type="submit" style={{ background: 'linear-gradient(135deg,#d4af37,#aa8c2c)', border: 'none', color: '#0a0807', padding: '.7rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '.9rem' }}>Update Template</button>
      </form>
    </div>
  );
}
