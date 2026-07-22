'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '@/app/lib/templates-config';

export default function TemplateViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobile, setMobile] = useState(false);

  const broadcast = useCallback((html: string, defaultData: any) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    let parsed: any;
    try {
      parsed = typeof defaultData === 'string' ? JSON.parse(defaultData) : (defaultData || {});
    } catch {
      parsed = {};
    }
    iframe.contentWindow.postMessage({ type: 'UPDATE', payload: parsed }, '*');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/templates/${id}`);
        if (!res.ok) throw new Error('Failed to load template');
        const d = await res.json();
        setTemplate(d.template);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleIframeLoad = useCallback(() => {
    if (!template) return;
    broadcast(template.html, template.defaultData);
  }, [template, broadcast]);

  useEffect(() => {
    if (!template || !iframeRef.current?.contentWindow) return;
    broadcast(template.html, template.defaultData);
  }, [template, mobile, broadcast]);

  const backBtn: React.CSSProperties = {
    background: 'none', border: 'none', color: 'rgba(253,246,227,.5)', cursor: 'pointer',
    fontSize: '1rem', padding: '.35rem', display: 'flex', alignItems: 'center', borderRadius: '4px',
  };

  const toggleBtn = (active: boolean): React.CSSProperties => ({
    padding: '.4rem .85rem', fontSize: '.75rem', border: 'none', cursor: 'pointer',
    background: active ? '#d4af37' : 'rgba(253,246,227,.06)',
    color: active ? '#0a0807' : 'rgba(253,246,227,.5)',
    borderRadius: active ? '4px' : '4px',
  });

  const badge: React.CSSProperties = {
    padding: '.2rem .55rem', borderRadius: '99px', fontSize: '.7rem', display: 'inline-block',
    background: 'rgba(212,175,55,.15)', color: '#d4af37', textTransform: 'capitalize',
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(253,246,227,.5)', fontSize: '.9rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>;
  if (!template) return null;

  const config = TEMPLATE_CONFIGS[template.name] || DEFAULT_TEMPLATE_CONFIG;
  const html = template.html || config.html;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem 1.5rem', borderBottom: '1px solid rgba(212,175,55,.1)' }}>
        <button onClick={() => router.back()} style={backBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ width: '1px', height: '20px', background: 'rgba(212,175,55,.15)' }} />
        <span style={{ fontSize: '.95rem', color: '#fdf6e3', fontWeight: 500 }}>{template.name}</span>
        <span style={badge}>{template.type || 'template'}</span>
        {template.theme && <span style={{ ...badge, background: 'rgba(52,211,153,.12)', color: '#34d399', marginLeft: '.5rem' }}>{template.theme}</span>}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '.25rem', background: 'rgba(253,246,227,.04)', borderRadius: '4px', padding: '2px' }}>
          <button onClick={() => setMobile(false)} style={toggleBtn(!mobile)}>Desktop</button>
          <button onClick={() => setMobile(true)} style={toggleBtn(mobile)}>Mobile</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '2rem', background: 'radial-gradient(ellipse at center, rgba(212,175,55,.06) 0%, #04070d 70%)', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mobile ? (
            <iframe
              ref={iframeRef}
              onLoad={handleIframeLoad}
              srcDoc={html}
              title="Template Preview"
              style={{ width: 375, height: 812, borderRadius: 30, border: '8px solid #222', boxShadow: '0 25px 60px rgba(0,0,0,.5)', background: '#0a0807', flexShrink: 0 }}
            />
          ) : (
            <iframe
              ref={iframeRef}
              onLoad={handleIframeLoad}
              srcDoc={html}
              title="Template Preview"
              style={{ width: '100%', height: '100%', maxWidth: 900, border: 'none', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,.4)', background: '#0a0807' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
