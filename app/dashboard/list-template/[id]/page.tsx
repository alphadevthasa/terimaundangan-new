'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '../../../lib/templates-config';

interface StaticTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  thumbnail: string;
  price: string;
  isPopular: boolean;
  html?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [staticTemplate, setStaticTemplate] = useState<StaticTemplate | null>(null);
  const templateConfig = staticTemplate ? (TEMPLATE_CONFIGS[staticTemplate.name] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;
  const templateHtml = staticTemplate?.html || templateConfig.html;
  const [previewData, setPreviewData] = useState<Record<string, string>>(templateConfig.demoData);
  const [isMobile, setIsMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const templateId = params?.id as string;
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = params?.id as string;
    if (id) fetchTemplate(id);
  }, [params?.id]);

  const fetchTemplate = async (id: string) => {
    try {
      setIsLoading(true);

      // Fetch static template info ONLY - never fetch customer data here!
      // List Template preview is always static/demo, never affected by customer edits
      const tmplRes = await fetch(`/api/static-templates/${id}`);
      if (!tmplRes.ok) throw new Error('Template not found');
      const tmplData = await tmplRes.json();
      if (tmplData.template) {
        setStaticTemplate(tmplData.template);
        const cfg = TEMPLATE_CONFIGS[tmplData.template.name] || DEFAULT_TEMPLATE_CONFIG;
        let data = cfg.demoData;
        try { const p = JSON.parse(tmplData.template.defaultData || '{}'); if (Object.keys(p).length) data = p; } catch {}
        setPreviewData(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  };

  // Broadcast data to iframe
  const broadcastToIframe = useCallback((data: Record<string, string>) => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE', payload: data }, '*');
      } catch { /* ignore */ }
    }
  }, []);

  const handleIframeLoad = useCallback(() => {
    if (Object.keys(previewData).length > 0) {
      broadcastToIframe(previewData);
    }
  }, [previewData, broadcastToIframe]);

  // Broadcast whenever previewData changes
  useEffect(() => {
    if (mounted && Object.keys(previewData).length > 0) {
      broadcastToIframe(previewData);
    }
  }, [previewData, broadcastToIframe, mounted]);



  const iconMap: Record<string, string> = { wedding: 'fas fa-heart', birthday: 'fas fa-cake-candles', corporate: 'fas fa-building' };
  const icon = staticTemplate ? iconMap[staticTemplate.type] || 'fas fa-file' : 'fas fa-file';

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid var(--line)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem' }}>Loading template...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !staticTemplate) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><i className="fas fa-circle-exclamation"></i></div>
          <p style={{ color: 'var(--cream-dim)', fontSize: '1rem' }}>{error || 'Template not found'}</p>
          <button onClick={() => router.back()} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer' }}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Top Control Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid var(--line)',
        background: 'var(--bg-2)',
        flexShrink: 0,
        gap: '1rem',
      }}>
        {/* Left: Back + Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem',
              padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,169,97,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--cream-dim)'; e.currentTarget.style.background = 'none'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
          <div style={{ width: '1px', height: '20px', background: 'var(--line)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}><i className={icon}></i></span>
            <div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--gold)' }}>{staticTemplate.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)', marginLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{staticTemplate.type}</span>
            </div>
          </div>
        </div>

        {/* Right: Mobile/Desktop Toggle + Install */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* View Toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setIsMobile(true)}
              style={{
                padding: '0.4rem 0.7rem',
                background: isMobile ? 'var(--gold)' : 'transparent',
                border: 'none',
                color: isMobile ? 'var(--bg)' : 'var(--cream-dim)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              onMouseEnter={(e) => { if (!isMobile) { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,169,97,0.1)'; } }}
              onMouseLeave={(e) => { if (!isMobile) { e.currentTarget.style.color = 'var(--cream-dim)'; e.currentTarget.style.background = 'transparent'; } }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /></svg>
              Mobile
            </button>
            <div style={{ width: '1px', background: 'var(--line)' }} />
            <button
              onClick={() => setIsMobile(false)}
              style={{
                padding: '0.4rem 0.7rem',
                background: !isMobile ? 'var(--gold)' : 'transparent',
                border: 'none',
                color: !isMobile ? 'var(--bg)' : 'var(--cream-dim)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              onMouseEnter={(e) => { if (isMobile) { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,169,97,0.1)'; } }}
              onMouseLeave={(e) => { if (isMobile) { e.currentTarget.style.color = 'var(--cream-dim)'; e.currentTarget.style.background = 'transparent'; } }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2" /><line x1="6" y1="7" x2="18" y2="7" /></svg>
              Desktop
            </button>
          </div>

          {/* Edit Button - navigates to kelola-template with template ID */}
          <button
            onClick={() => router.push(`/dashboard/kelola-template?id=${templateId}`)}
            style={{
              padding: '0.4rem 1rem', background: 'var(--gold)', border: 'none',
              color: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem',
              fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'auto',
        background: 'radial-gradient(ellipse at center, #1a1611 0%, var(--bg) 100%)',
      }}>
        {/* Device Frame */}
        <div
          className="animate-fadeIn"
          style={{
            width: isMobile ? '390px' : '100%',
            maxWidth: isMobile ? '390px' : '900px',
            height: isMobile ? '844px' : 'auto',
            minHeight: isMobile ? '844px' : '500px',
            background: '#0a0807',
            border: isMobile ? '3px solid #2a2a2a' : '1px solid var(--line)',
            borderRadius: isMobile ? '30px' : 'var(--radius)',
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isMobile
              ? '0 0 0 2px #1a1a1a, 0 20px 60px rgba(0,0,0,0.5)'
              : '0 10px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Mobile notch */}
          {isMobile && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '20px',
              background: '#2a2a2a',
              borderRadius: '0 0 12px 12px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a1a1a' }} />
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#1a1a1a' }} />
            </div>
          )}

          <iframe
            ref={iframeRef}
            srcDoc={templateHtml}
            onLoad={handleIframeLoad}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#0a0807',
            }}
            title="Template Preview"
          />
        </div>
      </div>
    </div>
  );
}
