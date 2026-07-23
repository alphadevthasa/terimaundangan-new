'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Feature { icon: string; label: string; }

const ICONS = [
  'fas fa-heart', 'fas fa-clock', 'fas fa-book', 'fas fa-scroll',
  'fas fa-calendar-check', 'fas fa-camera', 'fas fa-envelope', 'fas fa-gift',
  'fas fa-tv', 'fas fa-pen', 'fas fa-music', 'fas fa-mobile-screen-button',
  'fas fa-user', 'fas fa-crown', 'fas fa-star', 'fas fa-image',
  'fas fa-video', 'fas fa-location-dot', 'fas fa-bell', 'fas fa-share-nodes',
  'fas fa-qrcode', 'fas fa-cloud', 'fas fa-wifi', 'fas fa-check',
  'fas fa-map', 'fas fa-cake-candles', 'fas fa-building', 'fas fa-file',
];

export default function CreateTemplate() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', description: '', type: 'wedding', theme: '', category: 'wedding', thumbnail: '', price: '0', isPopular: false, html: '' });
  const [features, setFeatures] = useState<Feature[]>([]);
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [newIcon, setNewIcon] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    if (form.thumbnail) fd.append('oldUrl', form.thumbnail);
    setUploading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) { const err = await res.json(); alert(err.error || 'Upload failed'); return; }
      const data = await res.json();
      setForm(f => ({ ...f, thumbnail: data.url }));
    } catch { alert('Failed to upload image'); }
    finally { setUploading(false); }
  };

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(d => { setCategories(d.categories ?? []); })
      .catch(() => {});
  }, []);

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const addFeature = () => {
    if (!newIcon || !newLabel.trim()) return;
    setFeatures(p => [...p, { icon: newIcon, label: newLabel.trim() }]);
    setNewIcon('');
    setNewLabel('');
    setShowAddFeature(false);
  };

  const removeFeature = (idx: number) => {
    setFeatures(p => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const priceNum = parseInt(form.price, 10);
    if (isNaN(priceNum) || priceNum <= 0) { setError('Price must be greater than 0'); return; }
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, features }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to create template'); }
      router.push('/admin/templates');
    } catch (err: any) { setError(err.message); }
  };

  const formatPrice = (v: string) => { const n = parseInt(v.replace(/\D/g, ''), 10); return isNaN(n) ? '' : n.toLocaleString('id-ID'); };
  const s = { label: { fontSize: '.8rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' as const },
    input: { width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.9rem', outline: 'none' },
    textarea: { width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.78rem', fontFamily: 'monospace', outline: 'none', resize: 'vertical' as const },
    field: { marginBottom: '1rem' } };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <button onClick={() => router.push('/admin/templates')} style={{ background: 'none', border: 'none', color: 'rgba(253,246,227,.5)', fontSize: '.85rem', cursor: 'pointer', padding: 0, marginBottom: '1.5rem' }}>&lt;- Back to Templates</button>
      <h1 style={{ fontSize: '1.3rem', color: '#fdf6e3', marginBottom: '1.5rem' }}>Create Template</h1>
      {error && <div style={{ fontSize: '.8rem', color: '#ef4444', marginBottom: '1rem', padding: '.5rem .75rem', background: 'rgba(239,68,68,.1)', borderRadius: '4px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ background: '#0a1424', border: '1px solid rgba(212,175,55,.1)', borderRadius: '8px', padding: '2rem' }}>
        <div style={s.field}>
          <label style={s.label}>Name</label>
          <input style={s.input} value={form.name} onChange={e => update('name', e.target.value)} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Description</label>
          <textarea style={{ ...s.textarea, fontSize: '.9rem', fontFamily: "'Jost', sans-serif", rows: 3 } as any} value={form.description} onChange={e => update('description', e.target.value)} />
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
            <label style={s.label}>Category</label>
            <select style={s.input} value={form.category} onChange={e => update('category', e.target.value)}>
              {categories.length === 0 ? (
                <option value="wedding">Wedding</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))
              )}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Price (Rp)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(253,246,227,.4)', fontSize: '.85rem', pointerEvents: 'none' }}>Rp</span>
              <input type="text" inputMode="numeric" value={formatPrice(form.price)} onChange={e => update('price', e.target.value.replace(/\D/g, ''))} placeholder="0" style={{ ...s.input, paddingLeft: '2.2rem' }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Theme</label>
            <select style={s.input} value={form.theme} onChange={e => update('theme', e.target.value)}>
              <option value="">Select theme</option>
              <option value="Elegant">Elegant</option>
              <option value="Modern">Modern</option>
              <option value="Romantic">Romantic</option>
              <option value="Traditional">Traditional</option>
              <option value="Nature">Nature</option>
            </select>
          </div>
        </div>
        <div style={s.field}>
          <label style={s.label}>Thumbnail</label>
          {form.thumbnail && (
            <div style={{ width: '100%', height: '120px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', position: 'relative' }}>
              <img src={form.thumbnail} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <label style={{ display: 'inline-block', padding: '0.45rem 0.6rem', background: '#060b14', border: '1px dashed rgba(212,175,55,.15)', color: '#d4af37', borderRadius: '2px', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s' }}>
            {uploading ? 'Uploading...' : 'Upload Thumbnail'}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); e.target.value = ''; }} />
          </label>
        </div>
        <div style={{ ...s.field, display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input type="checkbox" id="isPopular" checked={form.isPopular} onChange={e => update('isPopular', e.target.checked)} style={{ accentColor: '#d4af37' }} />
          <label htmlFor="isPopular" style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.6)', cursor: 'pointer' }}>Popular template</label>
        </div>

        {/* Fitur Tambahan */}
        <div style={{ ...s.field, borderTop: '1px solid rgba(212,175,55,.1)', paddingTop: '1rem' }}>
          <label style={{ ...s.label, fontSize: '.9rem', color: '#d4af37' }}>Fitur Tambahan</label>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.4rem .5rem', background: 'rgba(212,175,55,.05)', borderRadius: '4px', marginBottom: '.35rem', border: '1px solid rgba(212,175,55,.08)' }}>
              <i className={f.icon} style={{ width: '18px', textAlign: 'center', color: '#d4af37' }}></i>
              <span style={{ flex: 1, fontSize: '.85rem', color: '#fdf6e3' }}>{f.label}</span>
              <button type="button" onClick={() => removeFeature(i)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,.6)', cursor: 'pointer', fontSize: '.8rem', padding: '.2rem' }}><i className="fas fa-xmark"></i></button>
            </div>
          ))}
          {showAddFeature ? (
            <div style={{ background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '6px', padding: '.75rem', marginTop: '.5rem' }}>
              <label style={{ fontSize: '.7rem', color: 'rgba(253,246,227,.5)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.5rem', display: 'block' }}>Pilih Icon</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem', marginBottom: '.75rem' }}>
                {ICONS.map(ic => (
                  <button key={ic} type="button" onClick={() => setNewIcon(ic)}
                    style={{
                      width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: newIcon === ic ? '#d4af37' : 'transparent',
                      border: '1px solid ' + (newIcon === ic ? '#d4af37' : 'rgba(212,175,55,.2)'),
                      borderRadius: '4px', color: newIcon === ic ? '#0a0807' : 'rgba(253,246,227,.7)',
                      cursor: 'pointer', fontSize: '.85rem', transition: 'all .15s',
                    }}
                  ><i className={ic}></i></button>
                ))}
              </div>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Nama fitur..." style={{ width: '100%', padding: '.5rem .65rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.85rem', outline: 'none', marginBottom: '.5rem', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <button type="button" onClick={addFeature} style={{ padding: '.4rem .85rem', background: '#d4af37', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '.78rem', cursor: 'pointer' }}>Add</button>
                <button type="button" onClick={() => { setShowAddFeature(false); setNewIcon(''); setNewLabel(''); }} style={{ padding: '.4rem .85rem', background: 'transparent', border: '1px solid rgba(212,175,55,.2)', color: 'rgba(253,246,227,.5)', borderRadius: '4px', fontSize: '.78rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setShowAddFeature(true)} style={{ marginTop: '.5rem', padding: '.45rem .85rem', background: 'transparent', border: '1px dashed rgba(212,175,55,.25)', color: '#d4af37', borderRadius: '4px', fontSize: '.78rem', cursor: 'pointer', width: '100%' }}>
              <i className="fas fa-plus" style={{ marginRight: '.35rem' }}></i>Add Fitur Tambahan
            </button>
          )}
        </div>

        <div style={s.field}>
          <label style={s.label}>HTML</label>
          <textarea style={s.textarea} rows={15} value={form.html} onChange={e => update('html', e.target.value)} />
        </div>
        <button type="submit" style={{ background: 'linear-gradient(135deg,#d4af37,#aa8c2c)', border: 'none', color: '#0a0807', padding: '.7rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '.9rem' }}>Create Template</button>
      </form>
    </div>
  );
}
