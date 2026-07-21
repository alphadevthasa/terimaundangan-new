'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '@/app/lib/templates-config';

export default function EditTemplate() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [form, setForm] = useState({ name: '', description: '', type: 'wedding', price: '', thumbnail: '', isPopular: false, html: '', defaultData: '{}' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/templates/${id}`);
        if (!res.ok) throw new Error('Failed to load template');
        const d = await res.json();
        const t = d.template || d;
        const cfg = TEMPLATE_CONFIGS[t.name] || DEFAULT_TEMPLATE_CONFIG;
        setForm({
          name: t.name || '',
          description: t.description || '',
          type: t.type || 'wedding',
          price: t.price || '',
          thumbnail: t.thumbnail || '',
          isPopular: !!t.isPopular,
          html: t.html || cfg.html,
          defaultData: t.defaultData ? (() => { try { return JSON.stringify(typeof t.defaultData === 'string' ? JSON.parse(t.defaultData) : t.defaultData, null, 2); } catch { return '{}'; } })() : '{}',
        });
      } catch (err: any) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const broadcastData = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      const parsed = JSON.parse(form.defaultData);
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE', payload: parsed }, '*');
    } catch { /* JSON parse error */ }
  }, [form.defaultData]);

  const handleIframeLoad = useCallback(() => {
    broadcastData();
  }, [broadcastData]);

  useEffect(() => {
    if (!loading) broadcastData();
  }, [form.html, broadcastData, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let parsedDefaultData: Record<string, any> = {};
      try { parsedDefaultData = JSON.parse(form.defaultData); }
      catch { throw new Error('Invalid JSON in Default Data'); }
      const body = { ...form, defaultData: parsedDefaultData };
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to update template'); }
      router.push('/admin/templates');
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#04070d' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid rgba(212,175,55,.2)', borderTop: '2px solid #d4af37', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading template...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  const labelS = { fontSize: '.8rem', color: 'rgba(253,246,227,.6)', marginBottom: '.35rem', display: 'block' as const };
  const inputS = { width: '100%', padding: '.7rem .85rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' as const };
  const textareaS = { ...inputS, fontSize: '.78rem', fontFamily: 'monospace', resize: 'vertical' as const };
  const fieldS = { marginBottom: '1rem' };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0, background: '#04070d' }}>
      {/* LEFT SIDEBAR */}
      <div style={{ width: '400px', minWidth: '400px', background: '#0a1424', borderRight: '1px solid rgba(212,175,55,.1)', overflowY: 'auto', padding: '1.5rem', flexShrink: 0 }}>
        <button onClick={() => router.push('/admin/templates')} style={{ background: 'none', border: 'none', color: 'rgba(253,246,227,.5)', fontSize: '.85rem', cursor: 'pointer', padding: 0, marginBottom: '1.5rem', display: 'block' }}>&lt;- Back to Templates</button>
        <h1 style={{ fontSize: '1.3rem', color: '#fdf6e3', marginBottom: '1.5rem' }}>Edit Template</h1>
        {error && <div style={{ fontSize: '.8rem', color: '#ef4444', marginBottom: '1rem', padding: '.5rem .75rem', background: 'rgba(239,68,68,.1)', borderRadius: '4px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={fieldS}>
            <label style={labelS}>Name</label>
            <input style={inputS} value={form.name} onChange={e => update('name', e.target.value)} required />
          </div>
          <div style={fieldS}>
            <label style={labelS}>Description</label>
            <textarea style={{ ...textareaS, fontSize: '.9rem', fontFamily: "'Jost', sans-serif" }} rows={3} value={form.description} onChange={e => update('description', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelS}>Type</label>
              <select style={inputS} value={form.type} onChange={e => update('type', e.target.value)}>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="corporate">Corporate</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelS}>Price</label>
              <input style={inputS} value={form.price} onChange={e => update('price', e.target.value)} />
            </div>
          </div>
          <div style={fieldS}>
            <label style={labelS}>Thumbnail URL</label>
            <input style={inputS} value={form.thumbnail} onChange={e => update('thumbnail', e.target.value)} />
          </div>
          <div style={{ ...fieldS, display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <input type="checkbox" id="isPopular" checked={form.isPopular} onChange={e => update('isPopular', e.target.checked)} style={{ accentColor: '#d4af37' }} />
            <label htmlFor="isPopular" style={{ fontSize: '.8rem', color: 'rgba(253,246,227,.6)', cursor: 'pointer' }}>Popular template</label>
          </div>
          <div style={fieldS}>
            <label style={labelS}>Default Data (JSON)</label>
            <textarea style={textareaS} rows={12} value={form.defaultData} onChange={e => update('defaultData', e.target.value)} />
          </div>
          <div style={fieldS}>
            <label style={labelS}>HTML</label>
            <textarea style={textareaS} rows={20} value={form.html} onChange={e => { update('html', e.target.value); setPreviewKey(k => k + 1); }} />
          </div>
          <button type="submit" disabled={saving} style={{ background: 'linear-gradient(135deg,#d4af37,#aa8c2c)', border: 'none', color: '#0a0807', padding: '.7rem 1.5rem', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '.9rem', opacity: saving ? .7 : 1, width: '100%' }}>
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </form>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#04070d' }}>
        {/* Toolbar */}
        <div style={{ height: '56px', background: '#0a1424', borderBottom: '1px solid rgba(212,175,55,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.75rem', padding: '0 1.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '.5rem', background: '#060b14', padding: '3px', borderRadius: '4px', border: '1px solid rgba(212,175,55,.15)' }}>
            <button onClick={() => setIsMobile(true)} style={{ padding: '.4rem 1rem', background: isMobile ? '#d4af37' : 'transparent', border: 'none', color: isMobile ? '#0a0807' : 'rgba(253,246,227,.5)', borderRadius: '2px', fontSize: '.75rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: '.4rem', transition: 'all .2s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Mobile
            </button>
            <button onClick={() => setIsMobile(false)} style={{ padding: '.4rem 1rem', background: !isMobile ? '#d4af37' : 'transparent', border: 'none', color: !isMobile ? '#0a0807' : 'rgba(253,246,227,.5)', borderRadius: '2px', fontSize: '.75rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: '.4rem', transition: 'all .2s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Desktop
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ flex: 1, padding: '2rem', overflow: 'hidden', background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #04070d 100%)' }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <iframe
              key={previewKey}
              ref={iframeRef}
              onLoad={handleIframeLoad}
              srcDoc={form.html}
              title="Template Preview"
              style={{
                background: '#0a0807',
                transition: 'all .5s cubic-bezier(.4,0,.2,1)',
                boxShadow: isMobile ? '0 20px 60px rgba(0,0,0,.6)' : '0 20px 50px rgba(0,0,0,.5)',
                width: isMobile ? '375px' : '100%',
                height: isMobile ? '812px' : '100%',
                borderRadius: isMobile ? '30px' : '4px',
                border: isMobile ? '8px solid #222' : '1px solid rgba(212,175,55,.1)',
                maxWidth: isMobile ? '375px' : '1100px',
                flexShrink: isMobile ? 0 : undefined,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
