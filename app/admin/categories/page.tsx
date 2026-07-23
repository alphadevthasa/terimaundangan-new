'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  createdAt: string;
  _count?: { templates: number };
}

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

const cardBase: React.CSSProperties = {
  background: '#0a1424',
  border: '1px solid rgba(212,175,55,.1)',
  borderRadius: '8px',
  padding: '1.25rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '.6rem .75rem',
  background: '#060b14',
  border: '1px solid rgba(212,175,55,.15)',
  borderRadius: '4px',
  color: '#fdf6e3',
  fontSize: '.85rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '', sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(d => { setCategories(d.categories ?? []); setLoading(false); })
      .catch(() => { setError('Failed to load categories'); setLoading(false); });
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', description: '', icon: '', sortOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon, sortOrder: cat.sortOrder });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Name is required');
    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save category');
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Failed to delete');
        return;
      }
      load();
    } catch {
      alert('Failed to delete category');
    }
  };

  if (error) return (
    <div style={{ ...cardBase, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#fdf6e3' }}>Categories</h1>
        <button style={goldBtn} onClick={openCreate}>
          <i className="fas fa-plus" style={{ marginRight: '.5rem' }}></i>New Category
        </button>
      </div>

      {loading ? (
        <div style={{ ...cardBase, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)' }}>Loading...</div>
      ) : !categories.length ? (
        <div style={{ ...cardBase, textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)' }}>
          <i className="fas fa-folder-open" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem', opacity: 0.3 }}></i>
          No categories yet. Create your first category!
        </div>
      ) : (
        <div style={{ ...cardBase, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Order</th>
                <th style={thStyle}>Icon</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Templates</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{cat.sortOrder}</td>
                  <td style={tdStyle}>
                    {cat.icon ? (
                      <i className={cat.icon} style={{ color: '#d4af37', fontSize: '1rem' }}></i>
                    ) : (
                      <span style={{ color: 'rgba(253,246,227,.2)' }}>-</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: '#fdf6e3', fontWeight: 500 }}>{cat.name}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block', background: 'rgba(212,175,55,.1)', color: '#d4af37', fontFamily: 'monospace' }}>
                      {cat.slug}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: 'rgba(253,246,227,.5)', fontSize: '.78rem', maxWidth: '200px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.description || '-'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{
                      padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block',
                      background: cat._count?.templates ? 'rgba(212,175,55,.15)' : 'rgba(253,246,227,.08)',
                      color: cat._count?.templates ? '#d4af37' : 'rgba(253,246,227,.4)',
                    }}>
                      {cat._count?.templates ?? 0}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <button onClick={() => openEdit(cat)} style={{
                        background: 'rgba(212,175,55,.1)', border: '1px solid rgba(212,175,55,.2)', color: '#d4af37',
                        padding: '.45rem .85rem', borderRadius: '4px', cursor: 'pointer', fontSize: '.75rem',
                        display: 'flex', alignItems: 'center', gap: '.35rem', transition: 'all .15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,.1)'; }}
                      >
                        <i className="fas fa-pencil" style={{ fontSize: '.7rem' }}></i> Edit
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} style={{
                        background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#ef4444',
                        padding: '.45rem .85rem', borderRadius: '4px', cursor: 'pointer', fontSize: '.75rem',
                        display: 'flex', alignItems: 'center', gap: '.35rem', transition: 'all .15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,.1)'; }}
                      >
                        <i className="fas fa-trash-can" style={{ fontSize: '.7rem' }}></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{
            background: '#0a1424', border: '1px solid rgba(212,175,55,.15)', borderRadius: '12px',
            padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#fdf6e3', fontWeight: 500 }}>
                {editingId ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: 'none', color: 'rgba(253,246,227,.4)', cursor: 'pointer',
                fontSize: '1.2rem', padding: '.25rem', transition: 'color .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fdf6e3'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(253,246,227,.4)'; }}
              >
                <i className="fas fa-xmark"></i>
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Name *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Wedding" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Slug</label>
              <input style={{ ...inputStyle, fontFamily: 'monospace' }} value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="Auto-generated if empty (e.g. wedding)" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Short description for this category" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Icon (Font Awesome class)</label>
              <input style={inputStyle} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="e.g. fas fa-heart" />
              <div style={{ fontSize: '.7rem', color: 'rgba(253,246,227,.35)', marginTop: '.25rem' }}>
                {form.icon && <span>Preview: <i className={form.icon} style={{ color: '#d4af37', marginLeft: '.25rem' }}></i></span>}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '.3rem', display: 'block' }}>Sort Order</label>
              <input style={{ ...inputStyle, maxWidth: '100px' }} type="number" value={form.sortOrder}
                onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
            </div>

            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '.6rem 1.25rem', background: 'none', border: '1px solid rgba(253,246,227,.15)',
                borderRadius: '4px', color: 'rgba(253,246,227,.6)', cursor: 'pointer', fontSize: '.82rem',
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                style={{
                  ...goldBtn, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
