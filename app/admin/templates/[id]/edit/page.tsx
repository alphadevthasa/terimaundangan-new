'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '@/app/lib/templates-config';
import { getTemplateSections, BACKGROUND_DEFAULTS, kebabToCamel } from '@/app/lib/editor-sections';

interface TemplateRecord {
  id: string;
  name: string;
  description: string;
  type: string;
  category?: string;
  theme: string;
  price: string;
  thumbnail: string;
  isPopular: boolean;
  html?: string;
  defaultData?: string | Record<string, any>;
  createdAt: Date;
}

function EditTemplateContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [categories, setCategories] = useState<{id:string;name:string;slug:string}[]>([]);
  const [meta, setMeta] = useState({ name: '', description: '', type: 'wedding', theme: '', category: 'wedding', price: '', thumbnail: '', isPopular: false });
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState<'editor' | 'preview'>('editor');
  const [isMobile, setIsMobile] = useState(true);
  const [windowIsMobile, setWindowIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [staticTemplateName, setStaticTemplateName] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const [leftTab, setLeftTab] = useState<'sections' | 'config'>('sections');

  const templateConfig = staticTemplateName ? (TEMPLATE_CONFIGS[staticTemplateName] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;
  const templateHtml = templateConfig.html;

  const templateSections = getTemplateSections(staticTemplateName);
  const hasBackgrounds = !!BACKGROUND_DEFAULTS[staticTemplateName];
  const visibleSections = !hasBackgrounds
    ? templateSections.filter(s => s.id !== 'backgrounds')
    : templateSections;

  useEffect(() => {
    const checkMobile = () => setWindowIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchTemplate();
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(d => { setCategories(d.categories ?? []); })
      .catch(() => {});
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/templates/${id}`);
      if (!res.ok) throw new Error('Failed to load template');
      const d = await res.json();
      const t: TemplateRecord = d.template || d;
      setStaticTemplateName(t.name || '');
      setMeta({
        name: t.name || '',
        description: t.description || '',
        type: t.type || 'wedding',
        category: t.category || 'wedding',
        theme: t.theme || '',
        price: t.price || '',
        thumbnail: t.thumbnail || '',
        isPopular: !!t.isPopular,
      });

      const parsed = typeof t.defaultData === 'string' ? JSON.parse(t.defaultData || '{}') : (t.defaultData || {});
      const tmplName = t.name || '';
      const bgDefaults = BACKGROUND_DEFAULTS[tmplName] || {};
      const sections = getTemplateSections(tmplName);
      const fields: Record<string, string> = {};
      sections.forEach(section => {
        section.fields.forEach(field => {
          fields[field.id] = parsed[field.id] ?? bgDefaults[field.id] ?? field.defaultValue;
        });
      });
      setFormData(fields);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async () => {
    try {
      setSaveStatus('saving');

      const sections = getTemplateSections(staticTemplateName);
      const defaultData: Record<string, string> = {};
      sections.forEach(section => {
        section.fields.forEach(field => {
          defaultData[field.id] = formData[field.id] || '';
        });
      });

      const body = {
        ...meta,
        thumbnail: formData.thumbnail || meta.thumbnail,
        defaultData,
      };

      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save template');
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Error saving template:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const buildIframePayload = useCallback((data: Record<string, string>): Record<string, string> => {
    const km = templateConfig.keyMap;
    if (!km) return data;
    const payload: Record<string, string> = {};
    for (const [key, val] of Object.entries(data)) {
      payload[km[key] || key] = val;
    }
    return payload;
  }, [templateConfig]);

  const broadcastToIframe = useCallback((data: Record<string, string>) => {
    if (iframeRef.current?.contentWindow) {
      try {
        const payload = buildIframePayload(data);
        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE', payload }, '*');
      } catch (e) {
        // ignore cross-origin errors
      }
    }
  }, [buildIframePayload]);

  const handleIframeLoad = useCallback(() => {
    if (Object.keys(formData).length > 0) {
      broadcastToIframe(formData);
    }
  }, [formData, broadcastToIframe]);

  const handleFieldChange = (id: string, value: string) => {
    const newData = { ...formData, [id]: value };
    setFormData(newData);
    broadcastToIframe(newData);
  };

  const handleImageUpload = async (fieldId: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    if (formData[fieldId]) fd.append('oldUrl', formData[fieldId]);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Upload failed');
        return;
      }
      const data = await res.json();
      handleFieldChange(fieldId, data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    }
  };

  if (!mounted || isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#04070d' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '2px solid rgba(212,175,55,.2)', borderTop: '2px solid #d4af37', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading template...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (windowIsMobile && previewMode === 'preview') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#04070d' }}>
        <header style={{ height: '48px', background: '#0a1424', borderBottom: '1px solid rgba(212,175,55,.1)', display: 'flex', alignItems: 'center', padding: '0 1rem', flexShrink: 0 }}>
          <button onClick={() => setPreviewMode('editor')} style={{ background: 'none', border: 'none', color: 'rgba(253,246,227,.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.4rem 0.5rem', borderRadius: '4px', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#d4af37'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(253,246,227,.5)'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#d4af37', fontSize: '1rem' }}>Preview</div>
          <div style={{ width: '60px' }} />
        </header>
        <div style={{ flex: 1, display: 'flex', background: '#04070d' }}>
          <iframe ref={iframeRef} onLoad={handleIframeLoad} srcDoc={templateHtml} title="Wedding Preview" style={{ width: '100%', height: '100%', border: 'none', background: '#0a0807' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0, background: '#04070d' }}>
      {/* LEFT PANE: EDITOR */}
      <div style={{ width: windowIsMobile ? '100%' : '400px', minWidth: windowIsMobile ? '100%' : '400px', background: '#0a1424', borderRight: windowIsMobile ? 'none' : '1px solid rgba(212,175,55,.1)', overflowY: 'auto', padding: windowIsMobile ? '1rem 0.75rem' : '1.5rem 1.25rem', flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: windowIsMobile ? '1.4rem' : '1.8rem', color: '#d4af37', borderBottom: '1px solid rgba(212,175,55,.1)', paddingBottom: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
          Edit Template
        </div>

        {/* Save button */}
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={saveTemplate} disabled={saveStatus === 'saving'} style={{ width: '100%', padding: '0.6rem 1rem', background: saveStatus === 'saved' ? '#34d399' : saveStatus === 'error' ? '#ef4444' : '#d4af37', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer', opacity: saveStatus === 'saving' ? 0.7 : 1, transition: 'all 0.2s' }}>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
          </button>
        </div>

        {error && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.75rem', padding: '0.5rem 0.65rem', background: 'rgba(239,68,68,.1)', borderRadius: '4px', border: '1px solid rgba(239,68,68,.2)' }}>{error}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', background: '#060b14', padding: '3px', borderRadius: '4px', border: '1px solid rgba(212,175,55,.15)' }}>
          <button onClick={() => setLeftTab('sections')} style={{ flex: 1, padding: '.45rem .5rem', background: leftTab === 'sections' ? '#d4af37' : 'transparent', border: 'none', color: leftTab === 'sections' ? '#0a0807' : 'rgba(253,246,227,.5)', borderRadius: '2px', fontSize: '.75rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.1em', transition: 'all .2s' }}>
            Edit Section
          </button>
          <button onClick={() => setLeftTab('config')} style={{ flex: 1, padding: '.45rem .5rem', background: leftTab === 'config' ? '#d4af37' : 'transparent', border: 'none', color: leftTab === 'config' ? '#0a0807' : 'rgba(253,246,227,.5)', borderRadius: '2px', fontSize: '.75rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.1em', transition: 'all .2s' }}>
            Configuration
          </button>
        </div>

        {/* Tab: Configuration */}
        {leftTab === 'config' && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(212,175,55,.05)', borderRadius: '6px', border: '1px solid rgba(212,175,55,.1)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4af37', marginBottom: '0.5rem' }}>Template Info</div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '0.25rem', display: 'block' }}>Name</label>
              <input value={meta.name} onChange={e => setMeta(m => ({ ...m, name: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.65rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '0.25rem', display: 'block' }}>Description</label>
              <textarea value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.65rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', minHeight: '60px', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '0.25rem', display: 'block' }}>Price</label>
              <input value={meta.price} onChange={e => setMeta(m => ({ ...m, price: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.65rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '0.25rem', display: 'block' }}>Category</label>
              <select value={meta.category} onChange={e => setMeta(m => ({ ...m, category: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.65rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}>
                {categories.length === 0 ? (
                  <option value="wedding">Wedding</option>
                ) : (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))
                )}
              </select>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'rgba(253,246,227,.6)', marginBottom: '0.25rem', display: 'block' }}>Theme</label>
              <select value={meta.theme} onChange={e => setMeta(m => ({ ...m, theme: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.65rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', borderRadius: '4px', color: '#fdf6e3', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Select theme</option>
                <option value="Elegant">Elegant</option>
                <option value="Modern">Modern</option>
                <option value="Romantic">Romantic</option>
                <option value="Traditional">Traditional</option>
                <option value="Nature">Nature</option>
              </select>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              {(formData.thumbnail || meta.thumbnail) && (
                <div style={{ width: '100%', height: '120px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', position: 'relative' }} className="image-preview-wrapper">
                  <img src={formData.thumbnail || meta.thumbnail} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { const wrapper = (e.target as HTMLImageElement).closest('.image-preview-wrapper'); if (wrapper) (wrapper as HTMLElement).style.display = 'none'; }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <label style={{ flex: 1, padding: '0.45rem 0.6rem', background: '#060b14', border: '1px dashed rgba(212,175,55,.15)', color: '#d4af37', borderRadius: '2px', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.background = 'rgba(212,175,55,.08)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,.15)'; e.currentTarget.style.background = '#060b14'; }}>
                  Upload Thumbnail
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={(e) => { const file = e.target.files?.[0]; if (file) { handleImageUpload('thumbnail', file); e.target.value = ''; } }} />
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input type="checkbox" id="isPopular" checked={meta.isPopular} onChange={e => setMeta(m => ({ ...m, isPopular: e.target.checked }))} style={{ accentColor: '#d4af37' }} />
              <label htmlFor="isPopular" style={{ fontSize: '0.75rem', color: 'rgba(253,246,227,.6)', cursor: 'pointer' }}>Popular</label>
            </div>
          </div>
        )}

        {/* Tab: Edit Section */}
        {leftTab === 'sections' && (
          <>
            {visibleSections.map((section) => (
              <details key={section.id} open={section.defaultOpen} style={{ marginBottom: '0.75rem', borderBottom: '1px solid rgba(212,175,55,.1)', paddingBottom: '0.5rem' }}>
                <summary style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.4em', cursor: 'pointer', outline: 'none', listStyle: 'none', padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                  {section.title}
                  <span style={{ fontFamily: "'Jost', sans-serif", fontStyle: 'normal', fontSize: '1rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </summary>
                <div style={{ padding: '0.5rem 0' }}>
                  {section.fields.map((field) => (
                    <div key={field.id} style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontFamily: "'Jost', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(253,246,227,.6)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                        {field.label}
                      </label>
                      {field.type === 'image' ? (
                        <div>
                          {formData[field.id] && (
                            <div style={{ width: '100%', height: windowIsMobile ? '80px' : '120px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', position: 'relative' }} className="image-preview-wrapper">
                              <img src={formData[field.id]} alt={field.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { const wrapper = (e.target as HTMLImageElement).closest('.image-preview-wrapper'); if (wrapper) (wrapper as HTMLElement).style.display = 'none'; }} />
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                            <label style={{ flex: 1, padding: '0.45rem 0.6rem', background: '#060b14', border: '1px dashed rgba(212,175,55,.15)', color: '#d4af37', borderRadius: '2px', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.background = 'rgba(212,175,55,.08)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,.15)'; e.currentTarget.style.background = '#060b14'; }}>
                              Upload
                              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={(e) => { const file = e.target.files?.[0]; if (file) { handleImageUpload(field.id, file); e.target.value = ''; } }} />
                            </label>
                          </div>
                        </div>
                      ) : field.type === 'textarea' ? (
                        <textarea value={formData[field.id] || ''} onChange={(e) => handleFieldChange(field.id, e.target.value)} style={{ width: '100%', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', color: '#fdf6e3', padding: '0.5rem 0.7rem', borderRadius: '2px', fontFamily: "'Jost', sans-serif", fontSize: '0.85rem', resize: 'vertical', minHeight: windowIsMobile ? '50px' : '60px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,.15)'; }} />
                      ) : field.type === 'select' ? (
                        <select value={formData[field.id] || ''} onChange={(e) => handleFieldChange(field.id, e.target.value)} style={{ width: '100%', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', color: '#fdf6e3', padding: '0.5rem 0.7rem', borderRadius: '2px', fontFamily: "'Jost', sans-serif", fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,.15)'; }}>
                          {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input type={field.type} value={formData[field.id] || ''} onChange={(e) => handleFieldChange(field.id, e.target.value)} style={{ width: '100%', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', color: '#fdf6e3', padding: '0.5rem 0.7rem', borderRadius: '2px', fontFamily: "'Jost', sans-serif", fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,.15)'; }} />
                      )}
                    </div>
                  ))}
                </div>
              </details>
            ))}

            {templateConfig.supportsVideo && (
              <details key="hero-video" style={{ marginBottom: '0.75rem', borderBottom: '1px solid rgba(212,175,55,.1)', paddingBottom: '0.5rem' }}>
                <summary style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.4em', cursor: 'pointer', outline: 'none', listStyle: 'none', padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                  Cover Video
                  <span style={{ fontFamily: "'Jost', sans-serif", fontStyle: 'normal', fontSize: '1rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </summary>
                <div style={{ padding: '0.5rem 0' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontFamily: "'Jost', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(253,246,227,.6)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                      Hero Cover Video URL
                    </label>
                    <div>
                      {formData['hero-video'] && (
                        <div style={{ width: '100%', height: windowIsMobile ? '80px' : '120px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="video-preview-wrapper">
                          <video muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <source src={formData['hero-video']} />
                          </video>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(212,175,55,.8)" stroke="#0a0807" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <input type="text" value={formData['hero-video'] || ''} onChange={(e) => handleFieldChange('hero-video', e.target.value)} placeholder="Paste video URL or upload..." style={{ flex: 1, padding: '0.5rem 0.7rem', background: '#060b14', border: '1px solid rgba(212,175,55,.15)', color: '#fdf6e3', borderRadius: '2px', fontFamily: "'Jost', sans-serif", fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,.15)'; }} />
                        <label style={{ flexShrink: 0, padding: '0.45rem 0.6rem', background: '#060b14', border: '1px dashed rgba(212,175,55,.15)', color: '#d4af37', borderRadius: '2px', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.background = 'rgba(212,175,55,.08)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,.15)'; e.currentTarget.style.background = '#060b14'; }}>
                          Upload Video
                          <input type="file" accept="video/mp4,video/webm,video/quicktime" style={{ display: 'none' }} onChange={(e) => { const file = e.target.files?.[0]; if (file) { handleImageUpload('hero-video', file); e.target.value = ''; } }} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            )}

            <div style={{ height: '2rem' }} />
          </>
        )}
      </div>

      {/* RIGHT PANEL: PREVIEW */}
      {!windowIsMobile && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#04070d', overflow: 'hidden', position: 'relative' }}>
          {/* Toolbar - sticky header */}
          <div style={{ position: 'sticky', top: 0, zIndex: 100, height: '56px', background: '#0a1424', borderBottom: '1px solid rgba(212,175,55,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.75rem', padding: '0 1.5rem', flexShrink: 0 }}>
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
          <div style={{ flex: 1, overflow: 'auto', padding: '2rem', background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #04070d 100%)', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
              <iframe
                ref={iframeRef}
                onLoad={handleIframeLoad}
                srcDoc={templateHtml}
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
      )}
    </div>
  );
}

export default function EditTemplatePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#04070d' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '2px solid rgba(212,175,55,.2)', borderTop: '2px solid #d4af37', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(253,246,227,.5)', fontSize: '.85rem' }}>Loading...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    }>
      <EditTemplateContent />
    </Suspense>
  );
}