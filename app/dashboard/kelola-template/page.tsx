'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '../../lib/templates-config';
import { getTemplateSections, BACKGROUND_DEFAULTS, kebabToCamel } from '../../lib/editor-sections';

// Type for API response
interface TemplateData {
  id: string;
  [key: string]: string | number | boolean | Date;
}

// ponytail: kebabToCamel, BACKGROUND_DEFAULTS imported from shared lib

function KelolaTemplateContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState<'editor' | 'preview'>('editor');
  const [isMobile, setIsMobile] = useState(true);
  const [windowIsMobile, setWindowIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [templateDataId, setTemplateDataId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [staticTemplate, setStaticTemplate] = useState<{ name: string; html?: string } | null>(null);
  const [myTemplates, setMyTemplates] = useState<any[] | null>(null);
  const [allTemplates, setAllTemplates] = useState<any[] | null>(null);
  const [browseMode, setBrowseMode] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [installing, setInstalling] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<{
    url: string;
    slug: string;
    loading: boolean;
    error: string;
    copied: boolean;
  }>({
    url: '',
    slug: '',
    loading: false,
    error: '',
    copied: false,
  });
  const templateConfig = staticTemplate ? (TEMPLATE_CONFIGS[staticTemplate.name] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;
  const templateHtml = staticTemplate?.html || templateConfig.html;

  // Publish handler
  const handlePublish = async () => {
    if (!templateDataId) return;
    setPublishState(prev => ({ ...prev, loading: true, error: '' }));

    const groomNick = formData['groom-nick'] || '';
    const brideNick = formData['bride-nick'] || '';

    if (!groomNick || !brideNick) {
      setPublishState(prev => ({ ...prev, loading: false, error: 'Isi nama pengantin (Bride & Groom) terlebih dahulu' }));
      return;
    }

    try {
      const res = await fetch('/api/template-data/publish', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: templateDataId, groomNick, brideNick }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishState(prev => ({ ...prev, loading: false, error: data.error || 'Gagal publish' }));
        return;
      }

      // If API returns relative URL, prepend origin
      let publishUrl = data.url;
      if (publishUrl && publishUrl.startsWith('/')) {
        publishUrl = window.location.origin + publishUrl;
      }

      setPublishState(prev => ({
        ...prev,
        url: publishUrl,
        slug: data.slug,
        loading: false,
        error: '',
      }));
    } catch {
      setPublishState(prev => ({ ...prev, loading: false, error: 'Terjadi kesalahan. Silakan coba lagi.' }));
    }
  };

  // Copy publish URL
  const handleCopyPublishUrl = () => {
    if (publishState.url) {
      navigator.clipboard.writeText(publishState.url).then(() => {
        setPublishState(prev => ({ ...prev, copied: true }));
        setTimeout(() => setPublishState(prev => ({ ...prev, copied: false })), 2000);
      });
    }
  };

  // Unpublish handler
  const handleUnpublish = async () => {
    if (!templateDataId) return;
    if (!confirm('Unpublish undangan ini? Tamu tidak akan bisa mengakses halaman undangan.')) return;

    setPublishState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const res = await fetch('/api/template-data/unpublish', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: templateDataId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishState(prev => ({ ...prev, loading: false, error: data.error || 'Gagal unpublish' }));
        return;
      }

      setPublishState(prev => ({
        ...prev,
        url: '',
        slug: '',
        loading: false,
        error: '',
      }));
    } catch {
      setPublishState(prev => ({ ...prev, loading: false, error: 'Terjadi kesalahan. Silakan coba lagi.' }));
    }
  };

  // Regenerate URL handler
  const handleRegenerateUrl = async () => {
    if (!confirm('Regenerate URL? URL lama akan tidak bisa diakses. Lanjutkan?')) return;
    await handlePublish();
  };

  // Filter sections: use per-template filter + hide backgrounds for unsupported templates
  const tmplName = staticTemplate?.name || '';
  const templateSections = getTemplateSections(tmplName);
  const hasBackgrounds = !!BACKGROUND_DEFAULTS[tmplName];
  const visibleSections = !hasBackgrounds
    ? templateSections.filter(s => s.id !== 'backgrounds')
    : templateSections;

  // Fetch template from API on mount
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setWindowIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);

      // Fetch static template info first (to get the right HTML)
      let fetchedTmplName = '';
      if (templateId) {
        const tmplRes = await fetch(`/api/static-templates/${templateId}`);
        if (tmplRes.ok) {
          const tmplData = await tmplRes.json();
          if (tmplData.template) {
            setStaticTemplate(tmplData.template);
            fetchedTmplName = tmplData.template.name;
          }
        }
      }

      // Dapetin customerId dari localStorage atau /api/customer
      let customerId = localStorage.getItem('customerId');
      if (!customerId) {
        const sessionEmail = localStorage.getItem('sessionEmail');
        if (sessionEmail) {
          try {
            const custRes = await fetch(`/api/customer?email=${encodeURIComponent(sessionEmail)}`);
            const custData = await custRes.json();
            customerId = custData.customer?.id;
            if (customerId) localStorage.setItem('customerId', customerId);
          } catch {}
        }
      }
      const params = new URLSearchParams();
      if (customerId) params.set('customerId', customerId);
      if (templateId) params.set('templateId', templateId);
      const res = await fetch(`/api/template-data?${params.toString()}`);
      const data = await res.json();
      
      const templateData = data.templateData;
      if (templateData) {
        setTemplateDataId(templateData.id);

        // Get template name for background defaults (use local var, not state)
        const tmplName = fetchedTmplName;
        const bgDefaults = BACKGROUND_DEFAULTS[tmplName] || {};

        // Map database fields to form fields
        const formFields: Record<string, string> = {};
        const loadSections = getTemplateSections(fetchedTmplName);
        loadSections.forEach(section => {
          section.fields.forEach(field => {
            const camelKey = kebabToCamel(field.id);
            // Try DB value first, then template background default, then field default
            formFields[field.id] = templateData[camelKey] || bgDefaults[field.id] || field.defaultValue;
          });
        });
        setFormData(formFields);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      // Fallback to defaults
      const initial: Record<string, string> = {};
      const fallbackSections = getTemplateSections('');
      fallbackSections.forEach(section => {
        section.fields.forEach(field => {
          initial[field.id] = field.defaultValue;
        });
      });
      setFormData(initial);
    } finally {
      setIsLoading(false);
    }
  };

  // Save template to API
  const saveTemplate = async () => {
    try {
      setSaveStatus('saving');
      
      // Convert form kebab-case keys to camelCase for Prisma
      const dbData: Record<string, string> = {};
      Object.entries(formData).forEach(([key, value]) => {
        dbData[kebabToCamel(key)] = value;
      });

      const res = await fetch('/api/template-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: templateDataId, ...dbData }),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving template:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Transform form data keys using the template's keyMap before sending to iframe
  const buildIframePayload = useCallback((data: Record<string, string>): Record<string, string> => {
    const km = templateConfig.keyMap;
    if (!km) return data; // No mapping needed (Elite Wedding)
    const payload: Record<string, string> = {};
    for (const [key, val] of Object.entries(data)) {
      payload[km[key] || key] = val;
    }
    return payload;
  }, [templateConfig]);

  // Broadcast data to iframe
  const broadcastToIframe = useCallback((data: Record<string, string>) => {
    if (iframeRef.current?.contentWindow) {
      try {
        const payload = buildIframePayload(data);
        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE', payload }, '*');
      } catch (e) {
        // Ignore cross-origin errors
      }
    }
  }, [buildIframePayload]);

  // When iframe loads, send current data
  const handleIframeLoad = useCallback(() => {
    if (Object.keys(formData).length > 0) {
      broadcastToIframe(formData);
    }
  }, [formData, broadcastToIframe]);

  // Handle form field changes with live preview
  const handleFieldChange = (id: string, value: string) => {
    const newData = { ...formData, [id]: value };
    setFormData(newData);
    broadcastToIframe(newData);
  };

  // Handle image upload
  const handleImageUpload = async (fieldId: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    if (formData[fieldId]) fd.append('oldUrl', formData[fieldId]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });

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

  // ---- TEMPLATE LIST / BROWSE VIEW (when no ?id=) ----
  useEffect(() => {
    if (templateId) return;
    const loadMyTemplates = async () => {
      setListLoading(true);
      try {
        let templateData: any[] = [];
        const sessionEmail = localStorage.getItem('sessionEmail');
        if (sessionEmail) {
          const custRes = await fetch(`/api/customer?email=${encodeURIComponent(sessionEmail)}`);
          const custData = await custRes.json();
          templateData = custData.customer?.templateData || [];
        } else {
          const custRes = await fetch('/api/customer');
          const custData = await custRes.json();
          templateData = custData.customer?.templateData || [];
        }
        setMyTemplates(templateData);
      } catch {
        // ignore
      } finally {
        setListLoading(false);
      }
    };
    loadMyTemplates();
  }, [templateId]);

  if (!templateId) {
    const priceColors: Record<string, string> = { Free: '#34d399', Premium: '#f59e0b' };
    const iconMap: Record<string, string> = { wedding: 'fas fa-heart', birthday: 'fas fa-cake-candles', corporate: 'fas fa-building' };
    const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

    useEffect(() => {
      if (!myTemplates?.length) return;
      let cancelled = false;
      (async () => {
        const map: Record<string, string> = {};
        for (const td of myTemplates) {
          try {
            const r = await fetch(`/api/static-templates/${td.templateId}`);
            if (r.ok) {
              const d = await r.json();
              if (d.template?.thumbnail) map[td.templateId] = d.template.thumbnail;
            }
          } catch {}
        }
        if (!cancelled) setThumbnails(map);
      })();
      return () => { cancelled = true; };
    }, [myTemplates]);

    if (browseMode) {
      if (!allTemplates) {
        fetch('/api/static-templates').then(r => r.json()).then(d => setAllTemplates(d.templates || [])).catch(() => {});
        return (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
            <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem' }}>Loading templates...</p>
          </div>
        );
      }
      return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <button onClick={() => setBrowseMode(false)}
                style={{ background: 'none', border: 'none', color: 'var(--cream-dim)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                Kembali ke Template Saya
              </button>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', fontStyle: 'italic' }}>
                Pilih Template Baru
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {allTemplates.map((template: any, index: number) => {
              const icon = iconMap[template.type] || 'fas fa-file';
              const hasIt = myTemplates?.some((mt: any) => mt.templateId === template.id);
              return (
                <div key={template.id} style={{ background: 'var(--bg-2)', border: hasIt ? '1px solid var(--gold)' : '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', opacity: hasIt ? 0.7 : 1 }}>
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, #0a0807 0%, #1a1611 50%, #0a0807 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ fontSize: '3.5rem', opacity: 0.6 }}><i className={icon}></i></div>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '100px', background: `${priceColors[template.price] || '#6b7280'}15`, border: `1px solid ${priceColors[template.price] || '#6b7280'}30`, color: priceColors[template.price] || '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{template.price}</div>
                    {template.isPopular && <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '100px', background: 'rgba(201, 169, 97, 0.15)', border: '1px solid rgba(201, 169, 97, 0.3)', color: 'var(--gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}><i className="fas fa-star" style={{fontSize:'.6rem',marginRight:'.25rem'}}></i> Popular</div>}
                    {hasIt && <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '100px', background: 'rgba(34,197,94,.15)', border: '1px solid rgba(34,197,94,.3)', color: '#34d399', fontSize: '0.65rem' }}>✓ Dimiliki</div>}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '0.5rem', fontStyle: 'italic' }}>{template.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--cream-dim)', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{template.description || 'No description'}</p>
                    <button disabled={hasIt || installing === template.id} onClick={async () => {
                      setInstalling(template.id);
                      try {
                        const r = await fetch('/api/customer/install', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ templateId: template.id }),
                        });
                        if (r.ok) {
                          const sessionEmail = localStorage.getItem('sessionEmail');
                          if (sessionEmail) {
                            const d = await fetch(`/api/customer?email=${encodeURIComponent(sessionEmail)}`).then(r => r.json());
                            setMyTemplates(d.customer?.templateData || []);
                          }
                          setBrowseMode(false);
                        } else {
                          const e = await r.json();
                          alert(e.error || 'Gagal menginstal template');
                        }
                      } catch { alert('Gagal menginstal template'); }
                      setInstalling(null);
                    }} style={{
                      width: '100%', padding: '0.6rem', background: hasIt ? 'var(--bg-3)' : 'var(--gold)', border: 'none', color: hasIt ? 'var(--cream-dim)' : 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 500, cursor: hasIt ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                      {installing === template.id ? 'Menginstal...' : hasIt ? 'Sudah Dimiliki' : 'Pilih Template'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', fontStyle: 'italic' }}>Template Saya</h2>
          <button onClick={() => setBrowseMode(true)} style={{
            padding: '0.6rem 1.2rem', background: 'var(--gold)', border: 'none', color: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Beli Template Baru
          </button>
        </div>
        {listLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}><p style={{ color: 'var(--cream-dim)' }}>Memuat template...</p></div>
        ) : !myTemplates?.length ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}><i className="fas fa-inbox"></i></div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: 'var(--cream-dim)', marginBottom: '0.5rem', fontStyle: 'italic' }}>Belum Ada Template</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Beli template pertama Anda untuk memulai.</p>
            <button onClick={() => { window.location.href = '/#templates'; }} style={{ padding: '0.7rem 1.5rem', background: 'var(--gold)', border: 'none', color: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer' }}>Lihat Template Tersedia</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {myTemplates.map((td: any) => {
              const tmplName = td.template?.name || 'Template';
              return (
                <div key={td.id} style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => { const p = new URLSearchParams(window.location.search); p.set('id', td.templateId || ''); window.location.search = p.toString(); }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,97,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ height: '120px', background: 'linear-gradient(135deg, #0a0807 0%, #1a1611 50%, #0a0807 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
                    {thumbnails[td.templateId] ? (
                      <img src={thumbnails[td.templateId]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                    ) : (
                      <div style={{ fontSize: '2.5rem', opacity: 0.4 }}><i className="fas fa-heart"></i></div>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'var(--gold)', fontStyle: 'italic' }}>{tmplName}</h3>
                      <span style={{
                        fontSize: '0.6rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '99px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: td.published ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.12)',
                        border: td.published ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(107,114,128,0.2)',
                        color: td.published ? '#34d399' : 'rgba(253,246,227,0.35)',
                      }}>
                        {td.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', marginBottom: '0.5rem' }}>{td.brideNick || ''} & {td.groomNick || ''}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--muted)' }}>
                      <span>Dibuat {new Date(td.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>

                    {/* Published link */}
                    {td.published && td.slug ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginTop: '0.5rem',
                        padding: '0.3rem 0.5rem',
                        background: 'rgba(34,197,94,0.04)',
                        border: '1px solid rgba(34,197,94,0.1)',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        color: 'var(--cream-dim)',
                      }}>
                        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          /{td.slug}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = window.location.origin + '/' + td.slug;
                            navigator.clipboard.writeText(url);
                            alert('Link copied!');
                          }}
                          style={{
                            flexShrink: 0,
                            padding: '0.15rem 0.4rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--gold)',
                            fontSize: '0.6rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    ) : null}

                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--line-light)' }}>
                      <button onClick={(e) => { e.stopPropagation(); window.location.href = `/dashboard/kelola-template?id=${td.templateId}`; }} style={{
                        width: '100%', padding: '0.5rem', background: 'var(--gold)', border: 'none', color: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em',
                      }}>Edit Template</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (!mounted || isLoading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid var(--line)',
            borderTop: '2px solid var(--gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem' }}>Loading template...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Render mobile preview mode (full screen iframe, no frame, no switch, with back button)
  if (windowIsMobile && previewMode === 'preview') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
        {/* Back button */}
        <header
          style={{
            height: '48px',
            background: 'var(--bg-2)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setPreviewMode('editor')}
            style={{
              background: 'none', border: 'none', color: 'var(--cream-dim)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.85rem', padding: '0.4rem 0.5rem', borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: 'var(--gold)', fontSize: '1rem' }}>
            Preview
          </div>
          <div style={{ width: '60px' }} />
        </header>

        {/* Full iframe without mobile frame/switch */}
        <div style={{ flex: 1, display: 'flex', background: 'var(--bg)' }}>
          <iframe
            ref={iframeRef}
            onLoad={handleIframeLoad}
            srcDoc={templateHtml}
            title="Wedding Preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'var(--bg)',
            }}
          />
        </div>
      </div>
    );
  }

  // Desktop layout: show editor + preview side by side
  // Mobile layout (editor mode): show only editor full width
  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)' }}>
      {/* LEFT PANE: EDITOR */}
      <div
        style={{
          width: windowIsMobile ? '100%' : '400px',
          minWidth: windowIsMobile ? '100%' : '400px',
          background: 'var(--bg)',
          borderRight: windowIsMobile ? 'none' : '1px solid var(--line)',
          overflowY: 'auto',
          padding: windowIsMobile ? '1rem 0.75rem' : '1.5rem 1.25rem',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: windowIsMobile ? '1.4rem' : '1.8rem',
            color: 'var(--gold)',
            borderBottom: '1px solid var(--line)',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          Editor Undangan
        </div>

        {/* Save & Share - Mobile: 50% each + Preview button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                background: saveStatus === 'saved' ? '#34d399' : saveStatus === 'error' ? '#ef4444' : 'var(--gold)',
                border: 'none',
                color: 'var(--bg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: windowIsMobile ? '0.75rem' : '0.8rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: saveStatus === 'saving' ? 0.7 : 1,
              }}
              disabled={saveStatus === 'saving'}
              onMouseEnter={(e) => {
                if (saveStatus === 'idle') { e.currentTarget.style.background = 'var(--gold-light)'; }
              }}
              onMouseLeave={(e) => {
                if (saveStatus === 'idle') { e.currentTarget.style.background = 'var(--gold)'; }
              }}
              onClick={saveTemplate}
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : windowIsMobile ? 'Save' : 'Save Changes'}
            </button>
            <button
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                background: 'transparent',
                border: '1px solid var(--line)',
                color: 'var(--cream-dim)',
                borderRadius: 'var(--radius-sm)',
                fontSize: windowIsMobile ? '0.75rem' : '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
              onClick={() => {
                const link = publishState.url || window.location.origin + '/' + (publishState.slug || '');
                if (link && link !== window.location.origin + '/') {
                  navigator.clipboard?.writeText(link);
                  alert('Link copied! Share with your guests');
                } else {
                  // Generate dulu jika belum publish
                  handlePublish();
                }
              }}
            >
              Share
            </button>
          </div>

          {/* Publish URL Section */}
          <div style={{
            background: publishState.url ? 'rgba(34,197,94,0.05)' : 'var(--bg)',
            border: publishState.url ? '1px solid rgba(34,197,94,0.2)' : '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem',
          }}>
            {publishState.url ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Published
                  </span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.35rem 0.5rem', background: 'var(--bg-2)',
                  borderRadius: '2px', fontSize: '0.7rem', color: 'var(--cream)',
                  wordBreak: 'break-all', lineHeight: 1.4,
                }}>
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {publishState.url}
                  </span>
                  <button
                    onClick={handleCopyPublishUrl}
                    style={{
                      flexShrink: 0,
                      padding: '0.25rem 0.5rem',
                      background: 'transparent',
                      border: '1px solid var(--line)',
                      color: publishState.copied ? '#34d399' : 'var(--gold)',
                      borderRadius: '2px',
                      fontSize: '0.65rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {publishState.copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                {/* Action buttons: Unpublish & Regenerate */}
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={handleUnpublish}
                    disabled={publishState.loading}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.5rem',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444',
                      borderRadius: '2px',
                      fontSize: '0.62rem',
                      cursor: publishState.loading ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 500,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!publishState.loading) e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      if (!publishState.loading) e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                    }}
                  >
                    Unpublish
                  </button>
                  <button
                    onClick={handleRegenerateUrl}
                    disabled={publishState.loading}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.5rem',
                      background: 'rgba(201,169,97,0.08)',
                      border: '1px solid rgba(201,169,97,0.2)',
                      color: 'var(--gold)',
                      borderRadius: '2px',
                      fontSize: '0.62rem',
                      cursor: publishState.loading ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 500,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!publishState.loading) e.currentTarget.style.background = 'rgba(201,169,97,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      if (!publishState.loading) e.currentTarget.style.background = 'rgba(201,169,97,0.08)';
                    }}
                  >
                    Regenerate URL
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handlePublish}
                  disabled={publishState.loading}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: publishState.loading ? 'var(--bg-3)' : 'rgba(34,197,94,0.1)',
                    border: publishState.loading ? '1px solid var(--line)' : '1px solid rgba(34,197,94,0.25)',
                    color: publishState.loading ? 'var(--cream-dim)' : '#34d399',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.72rem',
                    cursor: publishState.loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!publishState.loading) {
                      e.currentTarget.style.background = 'rgba(34,197,94,0.18)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!publishState.loading) {
                      e.currentTarget.style.background = 'rgba(34,197,94,0.1)';
                    }
                  }}
                >
                  {publishState.loading ? (
                    <>
                      <span style={{
                        width: '12px', height: '12px',
                        border: '2px solid rgba(52,211,153,0.3)',
                        borderTopColor: '#34d399', borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'pubSpin 0.6s linear infinite',
                        marginRight: '0.3rem', verticalAlign: 'middle',
                      }} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.3rem', verticalAlign: 'middle' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Generate Publish URL
                    </>
                  )}
                </button>
                {publishState.error && (
                  <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: '0.4rem', padding: '0.3rem 0.4rem', background: 'rgba(239,68,68,0.08)', borderRadius: '2px' }}>
                    {publishState.error}
                  </div>
                )}
              </>
            )}
          </div>

          <style>{`@keyframes pubSpin { to { transform: rotate(360deg); } }`}</style>

          {/* Preview button - mobile only */}
          {windowIsMobile && (
            <button
              onClick={() => setPreviewMode('preview')}
              style={{
                width: '100%',
                padding: '0.6rem 1rem',
                background: 'transparent',
                border: '1px solid var(--gold)',
                color: 'var(--gold)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,169,97,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Preview
            </button>
          )}
        </div>

        {visibleSections.map((section) => (
          <details
            key={section.id}
            open={section.defaultOpen}
            style={{
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '0.5rem',
            }}
          >
            <summary
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: '1rem',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                cursor: 'pointer',
                outline: 'none',
                listStyle: 'none',
                padding: '0.5rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                userSelect: 'none',
              }}
            >
              {section.title}
              <span style={{ fontFamily: "'Jost', sans-serif", fontStyle: 'normal', fontSize: '1rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>
            <div style={{ padding: '0.5rem 0' }}>
              {section.fields.map((field) => (
                <div key={field.id} style={{ marginBottom: '0.75rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      color: 'var(--cream-dim)',
                      marginBottom: '0.3rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    {field.label}
                  </label>
                  {field.type === 'image' ? (
                    <div>
                      {formData[field.id] && (
                        <div style={{
                          width: '100%',
                          height: windowIsMobile ? '80px' : '120px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginBottom: '0.5rem',
                          background: 'var(--bg-2)',
                          border: '1px solid var(--line)',
                          position: 'relative',
                        }} className="image-preview-wrapper">
                          <img
                            src={formData[field.id]}
                            alt={field.label}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              const wrapper = (e.target as HTMLImageElement).closest('.image-preview-wrapper');
                              if (wrapper) (wrapper as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <label style={{
                          flex: 1,
                          padding: '0.45rem 0.6rem',
                          background: 'var(--bg-2)',
                          border: '1px dashed var(--line)',
                          color: 'var(--gold)',
                          borderRadius: '2px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          transition: 'all 0.2s',
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,169,97,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: 'middle', marginRight: '0.3rem' }}>
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Upload
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) { handleImageUpload(field.id, file); e.target.value = ''; }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-2)',
                        border: '1px solid var(--line)',
                        color: 'var(--cream)',
                        padding: '0.5rem 0.7rem',
                        borderRadius: '2px',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '0.85rem',
                        resize: 'vertical',
                        minHeight: windowIsMobile ? '50px' : '60px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-2)',
                        border: '1px solid var(--line)',
                        color: 'var(--cream)',
                        padding: '0.5rem 0.7rem',
                        borderRadius: '2px',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '0.85rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                    />
                  )}
                </div>
              ))}
            </div>
          </details>
        ))}

        {templateConfig.supportsVideo && (
          <details key="hero-video" style={{ marginBottom: '0.75rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>
            <summary style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.4em', cursor: 'pointer', outline: 'none', listStyle: 'none', padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
              Cover Video
              <span style={{ fontFamily: "'Jost', sans-serif", fontStyle: 'normal', fontSize: '1rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </span>
            </summary>
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontFamily: "'Jost', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--cream-dim)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                  Hero Cover Video URL
                </label>
                <div>
                  {formData['hero-video'] && (
                    <div style={{ width: '100%', height: windowIsMobile ? '80px' : '120px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem', background: 'var(--bg-2)', border: '1px solid var(--line)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="video-preview-wrapper">
                      <video muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src={formData['hero-video']} />
                      </video>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(201,169,97,.8)" stroke="#0a0807" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <input type="text" value={formData['hero-video'] || ''} onChange={(e) => handleFieldChange('hero-video', e.target.value)} placeholder="Paste video URL or upload..." style={{ flex: 1, padding: '0.5rem 0.7rem', background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--cream)', borderRadius: '2px', fontFamily: "'Jost', sans-serif", fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }} />
                    <label style={{ flexShrink: 0, padding: '0.45rem 0.6rem', background: 'var(--bg-2)', border: '1px dashed var(--line)', color: 'var(--gold)', borderRadius: '2px', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,169,97,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--bg-2)'; }}>
                      Upload Video
                      <input type="file" accept="video/mp4,video/webm,video/quicktime" style={{ display: 'none' }} onChange={(e) => { const file = e.target.files?.[0]; if (file) { handleImageUpload('hero-video', file); e.target.value = ''; } }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </details>
        )}
      </div>

      {/* RIGHT PANE: PREVIEW - Desktop only, hidden on mobile */}
      {!windowIsMobile && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#111',
            position: 'relative',
          }}
        >
          {/* Toolbar with Mobile/Desktop switch */}
          <div
            style={{
              height: '56px',
              background: 'var(--bg)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0 1.5rem',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                background: 'var(--bg-2)',
                padding: '3px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--line)',
              }}
            >
              <button
                onClick={() => setIsMobile(true)}
                style={{
                  padding: '0.4rem 1rem',
                  background: isMobile ? 'var(--gold)' : 'transparent',
                  border: 'none',
                  color: isMobile ? 'var(--bg)' : 'var(--cream-dim)',
                  borderRadius: '2px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                Mobile
              </button>
              <button
                onClick={() => setIsMobile(false)}
                style={{
                  padding: '0.4rem 1rem',
                  background: !isMobile ? 'var(--gold)' : 'transparent',
                  border: 'none',
                  color: !isMobile ? 'var(--bg)' : 'var(--cream-dim)',
                  borderRadius: '2px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                Desktop
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              overflow: 'hidden',
              background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0d0d0d 100%)',
            }}
          >
            <iframe
              ref={iframeRef}
              onLoad={handleIframeLoad}
              srcDoc={templateHtml}
              title="Wedding Preview"
              style={{
                background: 'var(--bg)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isMobile
                  ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,97,0.1)'
                  : '0 20px 50px rgba(0,0,0,0.5)',
                width: isMobile ? '375px' : '100%',
                height: isMobile ? '812px' : '100%',
                borderRadius: isMobile ? '30px' : '4px',
                border: isMobile ? '8px solid #222' : '1px solid var(--line)',
                maxWidth: isMobile ? '375px' : '1100px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function KelolaTemplatePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid var(--line)',
            borderTop: '2px solid var(--gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem' }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    }>
      <KelolaTemplateContent />
    </Suspense>
  );
}
