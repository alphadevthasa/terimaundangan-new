'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '../../lib/templates-config';
import SessionNavbar from '@/components/SessionNavbar';

interface StaticTemplate { id: string; name: string; description: string; type: string; thumbnail: string; price: number; isPopular: boolean; html?: string; defaultData?: string; features?: string; }

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

function CheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const mobileRef = useRef<HTMLIFrameElement>(null);
  const desktopRef = useRef<HTMLIFrameElement>(null);

  const isMobile = useMediaQuery('(max-width: 1023px)');

  const [template, setTemplate] = useState<StaticTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [scrolled, setScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [owned, setOwned] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);

  useEffect(() => {
    if (!isMobile) setPreviewActive(false);
  }, [isMobile]);

  // Get template config based on template name
  const templateConfig = template ? (TEMPLATE_CONFIGS[template.name] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;
  const templateHtml = template?.html || templateConfig.html;

  useEffect(() => {
    setMounted(true);
    const id = params?.id as string;
    if (id) fetchTemplate(id);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    fetch('/api/auth/session', { credentials: 'include' }).then(r => r.json()).then(d => { if (d.session?.email) setIsLoggedIn(true); }).catch(() => {});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [params?.id]);

  const fetchTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/static-templates/${id}`);
      if (!res.ok) throw new Error('Template not found');
      const data = await res.json();
      if (data.template) setTemplate(data.template);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user already owns this template
  useEffect(() => {
    if (!template) return;
    let cancelled = false;
    (async () => {
      const sessionRes = await fetch('/api/auth/session', { credentials: 'include' });
      if (cancelled || !sessionRes.ok) return;
      const sessionData = await sessionRes.json();
      const email = sessionData.session?.email;
      if (!email) return;
      const custRes = await fetch(`/api/customer?email=${encodeURIComponent(email)}`);
      if (cancelled || !custRes.ok) return;
      const custData = await custRes.json();
      const hasIt = custData.customer?.templateData?.some((td: any) => td.templateId === template.id);
      if (!cancelled && hasIt) setOwned(true);
    })();
    return () => { cancelled = true; };
  }, [template]);

  // Broadcast demo data to both iframes - use template-specific demo data
  const broadcastToIframes = useCallback(() => {
    const config = template ? (TEMPLATE_CONFIGS[template.name] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;
    let data = { ...config.demoData };
    try { const p = JSON.parse(template?.defaultData || '{}'); if (Object.keys(p).length) data = { ...data, ...p }; } catch {}
    [mobileRef, desktopRef].forEach(ref => {
      if (ref.current?.contentWindow) {
        try { ref.current.contentWindow.postMessage({ type: 'UPDATE', payload: data }, '*'); } catch {}
      }
    });
  }, [template]);

  const handleIframeLoad = useCallback(() => {
    broadcastToIframes();
  }, [broadcastToIframes]);

  const handleProceedToCheckout = () => {
    if (!template) return;
    if (!isLoggedIn) { setShowLoginPrompt(true); return; }
    if (owned) { router.push(`/dashboard/kelola-template?id=${template.id}`); return; }
    router.push(`/checkout/${template.id}`);
  };


  if (!mounted || isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807', color: '#f5ecd9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(201,169,97,.15)', borderTop: '2px solid #c9a961', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(245,236,217,.5)', fontSize: '.9rem' }}>Loading template...</p>
        </div>
      </div>
    );
  }

  if (error && !template) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><i className="fas fa-circle-exclamation"></i></div>
          <p style={{ color: 'rgba(245,236,217,.6)' }}>{error}</p>
          <button onClick={() => router.push('/')} style={{ marginTop: '1rem', padding: '.5rem 1.5rem', background: 'transparent', border: '1px solid #c9a961', color: '#c9a961', borderRadius: '4px', cursor: 'pointer' }}>← Back</button>
        </div>
      </div>
    );
  }

  if (!template) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0807', color: '#f5ecd9', fontFamily: "'Jost', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <SessionNavbar scrolled={scrolled} isMobile={isMobile} subtitle={template?.name} hidden={isMobile && previewActive} />

      {status === 'failed' && (
        <div style={{ padding: '.75rem 2rem', background: 'rgba(239,68,68,.1)', borderBottom: '1px solid rgba(239,68,68,.2)', color: '#ef4444', fontSize: '.85rem', textAlign: 'center' }}>
          <i className="fas fa-triangle-exclamation" style={{marginRight:'.35rem'}}></i>Payment was cancelled or failed. Please try again.
        </div>
      )}

      {/* Main: Preview + Checkout */}
      <div style={{
        flex: 1, display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: isMobile ? (previewActive ? 'hidden' : 'auto') : 'hidden',
        minHeight: 0,
        paddingTop: isMobile ? '76px' : '72px',
        position: 'relative',
      }}>
        {/* Desktop: side-by-side preview + sidebar */}
        {!isMobile && (
          <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
            {/* Left: preview area */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              padding: '1.5rem', minHeight: 0, overflow: 'hidden',
              background: 'radial-gradient(ellipse at center, #1a1611 0%, #0a0807 100%)',
            }}>
              {/* Tab switcher */}
              <div style={{ display: 'flex', gap: '.35rem', marginBottom: '1rem', flexShrink: 0 }}>
                <button onClick={() => setPreviewMode('mobile')}
                  style={{
                    padding: '.4rem 1rem', borderRadius: '6px', fontSize: '.75rem',
                    fontFamily: "'Jost', sans-serif", cursor: 'pointer', transition: 'all .2s',
                    background: previewMode === 'mobile' ? '#c9a961' : 'rgba(201,169,97,.08)',
                    border: '1px solid rgba(201,169,97,.15)', color: previewMode === 'mobile' ? '#0a0807' : 'rgba(245,236,217,.5)',
                    fontWeight: previewMode === 'mobile' ? 500 : 400, letterSpacing: '.03em',
                    display: 'flex', alignItems: 'center', gap: '.4rem',
                  }}
                  onMouseEnter={(e) => { if (previewMode !== 'mobile') { e.currentTarget.style.background = 'rgba(201,169,97,.15)'; e.currentTarget.style.color = '#c9a961'; } }}
                  onMouseLeave={(e) => { if (previewMode !== 'mobile') { e.currentTarget.style.background = 'rgba(201,169,97,.08)'; e.currentTarget.style.color = 'rgba(245,236,217,.5)'; } }}
                >
                  <i className="fas fa-mobile-screen-button"></i> Mobile
                </button>
                <button onClick={() => setPreviewMode('desktop')}
                  style={{
                    padding: '.4rem 1rem', borderRadius: '6px', fontSize: '.75rem',
                    fontFamily: "'Jost', sans-serif", cursor: 'pointer', transition: 'all .2s',
                    background: previewMode === 'desktop' ? '#c9a961' : 'rgba(201,169,97,.08)',
                    border: '1px solid rgba(201,169,97,.15)', color: previewMode === 'desktop' ? '#0a0807' : 'rgba(245,236,217,.5)',
                    fontWeight: previewMode === 'desktop' ? 500 : 400, letterSpacing: '.03em',
                    display: 'flex', alignItems: 'center', gap: '.4rem',
                  }}
                  onMouseEnter={(e) => { if (previewMode !== 'desktop') { e.currentTarget.style.background = 'rgba(201,169,97,.15)'; e.currentTarget.style.color = '#c9a961'; } }}
                  onMouseLeave={(e) => { if (previewMode !== 'desktop') { e.currentTarget.style.background = 'rgba(201,169,97,.08)'; e.currentTarget.style.color = 'rgba(245,236,217,.5)'; } }}
                >
                  <i className="fas fa-desktop"></i> Desktop
                </button>
              </div>

              {/* Preview area — single iframe with smooth CSS transitions */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'auto', padding: '1rem 0' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', flex: 1,
                  width: previewMode === 'mobile' ? '340px' : '100%',
                  maxWidth: previewMode === 'mobile' ? '340px' : '1100px',
                  alignSelf: previewMode === 'mobile' ? 'center' : 'stretch',
                  background: '#1c1c1e',
                  borderRadius: previewMode === 'mobile' ? '30px' : '10px',
                  overflow: 'hidden',
                  boxShadow: previewMode === 'mobile'
                    ? '0 0 0 1px #1a1a1a, 0 20px 60px rgba(0,0,0,.6)'
                    : '0 0 0 1px rgba(255,255,255,.06), 0 20px 60px rgba(0,0,0,.5)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  {/* Top bar: macOS dots / mobile notch */}
                  {previewMode === 'mobile' ? (
                    <div style={{
                      position: 'relative', height: '32px', background: '#2c2c2e',
                      borderBottom: '1px solid rgba(255,255,255,.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'height 0.3s ease',
                    }}>
                      <div style={{
                        width: '120px', height: '24px', background: '#111',
                        borderRadius: '20px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '6px',
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
                        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#222' }} />
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '.6rem 1rem', background: '#2c2c2e',
                      borderBottom: '1px solid rgba(255,255,255,.06)',
                      display: 'flex', alignItems: 'center', gap: '.6rem',
                    }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56' }} />
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e' }} />
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', fontSize: '.72rem', color: 'rgba(255,255,255,.35)', fontFamily: "'-apple-system', 'Helvetica Neue', sans-serif", letterSpacing: '.02em', paddingRight: '42px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {template.name} — Terima Undangan
                      </div>
                    </div>
                  )}
                  <iframe ref={desktopRef} srcDoc={templateHtml} onLoad={handleIframeLoad}
                    style={{
                      width: '100%',
                      flex: 1,
                      minHeight: previewMode === 'mobile' ? '620px' : '400px',
                      border: previewMode === 'mobile' ? '3px solid #2a2a2a' : 'none',
                      borderRadius: previewMode === 'mobile' ? '0 0 28px 28px' : '0',
                      background: '#0a0807',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    title="Template Preview"
                  />
                </div>
              </div>
            </div>

            {/* Right: desktop sidebar */}
            <section style={{
              flex: '0 0 340px', borderLeft: '1px solid rgba(201,169,97,.08)',
              overflowY: 'auto', background: '#0a0807', paddingTop: '1.5rem',
            }}>
              {/* Template info */}
              <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(201,169,97,.08)' }}>
                <div style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(245,236,217,.35)', marginBottom: '.35rem' }}>{template.type}</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#c9a961', fontStyle: 'italic', margin: '0 0 .75rem', lineHeight: 1.2 }}>{template.name}</h2>
                <p style={{ fontSize: '.82rem', color: 'rgba(245,236,217,.6)', lineHeight: 1.7, margin: '0 0 1rem' }}>{template.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '.75rem', borderTop: '1px solid rgba(201,169,97,.08)' }}>
                  <span style={{ fontSize: '.75rem', color: 'rgba(245,236,217,.4)' }}>Harga</span>
                  <span style={{ fontSize: '1.1rem', color: '#c9a961', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600 }}>{template.price === 0 ? 'Gratis' : `Rp ${template.price.toLocaleString('id-ID')}`}</span>
                </div>
              </div>

              {/* Features */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(201,169,97,.08)' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '.9rem', color: '#c9a961', margin: '0 0 1rem', fontStyle: 'italic', letterSpacing: '.02em', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                  <i className="fas fa-crown" style={{fontSize:'.8rem'}}></i> Features Included
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
                  {(template.features ? JSON.parse(template.features) : []).map((f: any) => (
                    <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.78rem', color: 'rgba(245,236,217,.7)' }}>
                      <span style={{ width: '18px', textAlign: 'center', flexShrink: 0 }}><i className={f.icon}></i></span>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase button */}
              <div style={{ padding: '1.5rem' }}>
                {error && (
                  <div style={{ fontSize: '.75rem', color: '#ef4444', marginBottom: '.75rem', background: 'rgba(239,68,68,.1)', padding: '.5rem .75rem', borderRadius: '4px', border: '1px solid rgba(239,68,68,.2)' }}>
                    {error}
                  </div>
                )}
                <button onClick={handleProceedToCheckout} style={{
                  width: '100%', padding: '.85rem 2rem', background: owned ? 'transparent' : 'linear-gradient(135deg,#c9a961,#b8942e)',
                  border: owned ? '1px solid #c9a961' : 'none', color: owned ? '#c9a961' : '#0a0807', borderRadius: '6px',
                  fontSize: '.9rem', fontWeight: 500, cursor: 'pointer',
                  transition: 'all .2s', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
                }}
                  onMouseEnter={(e) => { if (!owned) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,169,97,.3)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {owned ? (
                    <><i className="fas fa-arrow-right"></i> Buka Template di Dashboard</>
                  ) : 'Proceed to Checkout'}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Mobile: stacked preview + sidebar */}
        {isMobile && (
          <div style={{
            ...(previewActive ? {
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 60,
              background: '#0a0807',
            } : {
              flex: 1,
            }),
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Preview area */}
            <div style={{
              flex: previewActive ? 1 : '0 0 50vh',
              minHeight: previewActive ? 0 : '320px',
              position: 'relative',
              background: '#0a0807',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <iframe ref={mobileRef} srcDoc={templateHtml} onLoad={handleIframeLoad} style={{ width: '100%', height: '100%', border: 'none', background: '#0a0807', display: 'block' }} title="Mobile Preview" />

              {/* Floating preview button */}
              <button
                onClick={() => setPreviewActive(!previewActive)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '.45rem 1.25rem',
                  background: 'rgba(201,169,97,0.95)',
                  border: 'none',
                  borderRadius: '20px',
                  color: '#0a0807',
                  fontSize: '.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  zIndex: 20,
                  backdropFilter: 'blur(6px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                {previewActive ? 'Kembali' : 'Preview'}
              </button>
            </div>

            {/* Sidebar sections below template */}
            <div style={{
              flex: !previewActive ? 1 : undefined,
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: previewActive ? 'translateY(100%)' : 'translateY(0)',
              opacity: previewActive ? 0 : 1,
              maxHeight: previewActive ? 0 : '1000px',
              background: '#0a0807',
            }}>
           {/* Template info */}
           <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(201,169,97,.08)' }}>
             <div style={{ fontSize: isMobile ? '.7rem' : '.75rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(245,236,217,.35)', marginBottom: '.35rem' }}>{template.type}</div>
             <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.4rem' : '1.6rem', color: '#c9a961', fontStyle: 'italic', margin: '0 0 .75rem', lineHeight: 1.2 }}>{template.name}</h2>
             <p style={{ fontSize: isMobile ? '.82rem' : '.9rem', color: isMobile ? 'rgba(245,236,217,.6)' : 'rgba(245,236,217,.65)', lineHeight: 1.7, margin: '0 0 1rem' }}>{template.description}</p>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '.75rem', borderTop: '1px solid rgba(201,169,97,.08)' }}>
               <span style={{ fontSize: isMobile ? '.75rem' : '.8rem', color: 'rgba(245,236,217,.4)' }}>Harga</span>
               <span style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', color: '#c9a961', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600 }}>{template.price === 0 ? 'Gratis' : `Rp ${template.price.toLocaleString('id-ID')}`}</span>
             </div>
           </div>
  
           {/* Features list */}
           <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(201,169,97,.08)' }}>
             {isMobile && (
               <button
                 onClick={() => setFeaturesOpen(!featuresOpen)}
                 style={{
                   width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   background: 'none', border: 'none', color: '#c9a961', cursor: 'pointer', padding: 0, marginBottom: isMobile && featuresOpen ? '1rem' : 0,
                 }}
               >
                 <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '.9rem' : '1rem', color: '#c9a961', margin: 0, fontStyle: 'italic', letterSpacing: '.02em', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                   <i className="fas fa-crown" style={{fontSize:isMobile ? '.8rem' : '.9rem'}}></i> Features Included
                 </h3>
                 <i className="fas fa-chevron-down" style={{ fontSize: '.65rem', transition: 'transform .2s', transform: featuresOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
               </button>
             )}
              {(!isMobile || featuresOpen) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
                  {(template.features ? JSON.parse(template.features) : []).map((f: any) => (
                    <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: isMobile ? '.78rem' : '.82rem', color: 'rgba(245,236,217,.7)' }}>
                      <span style={{ width: '18px', textAlign: 'center', flexShrink: 0 }}><i className={f.icon}></i></span>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              )}
           </div>


          {/* Purchase button */}
          <div style={{ padding: '1.5rem' }}>
            {error && (
              <div style={{ fontSize: '.75rem', color: '#ef4444', marginBottom: '.75rem', background: 'rgba(239,68,68,.1)', padding: '.5rem .75rem', borderRadius: '4px', border: '1px solid rgba(239,68,68,.2)' }}>
                {error}
              </div>
            )}
              <button onClick={handleProceedToCheckout} style={{
              width: '100%', padding: isMobile ? '.85rem 2rem' : '.95rem 2rem', background: owned ? 'transparent' : 'linear-gradient(135deg,#c9a961,#b8942e)',
              border: owned ? '1px solid #c9a961' : 'none', color: owned ? '#c9a961' : '#0a0807', borderRadius: '6px',
              fontSize: isMobile ? '.9rem' : '1rem', fontWeight: 500, cursor: 'pointer',
              transition: 'all .2s', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
            }}
              onMouseEnter={(e) => { if (!owned) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,169,97,.3)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {owned ? (
                <><i className="fas fa-arrow-right"></i> Buka Template di Dashboard</>
              ) : 'Proceed to Checkout'}
            </button>
          </div>
            </div>
            </div>
        )}
      </div>

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)',
        }} onClick={() => setShowLoginPrompt(false)}>
          <div style={{
            background: '#14110d', border: '1px solid rgba(201,169,97,.15)',
            borderRadius: '16px', padding: isMobile ? '2rem' : '2.5rem',
            maxWidth: '400px', width: '90%', textAlign: 'center',
            position: 'relative',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowLoginPrompt(false)} style={{
              position: 'absolute', top: '.75rem', right: '.75rem',
              background: 'none', border: 'none', color: 'rgba(245,236,217,.4)',
              fontSize: '1.2rem', cursor: 'pointer', padding: '.25rem',
            }}><i className="fas fa-xmark"></i></button>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#c9a961' }}>
              <i className="fas fa-circle-exclamation"></i>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#f5ecd9', fontStyle: 'italic', margin: '0 0 .5rem' }}>
              Login Diperlukan
            </h3>
            <p style={{ fontSize: '.9rem', color: 'rgba(245,236,217,.6)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
              Silakan login terlebih dahulu untuk melanjutkan ke pembelian atau membuka template di dashboard.
            </p>
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
              <button onClick={() => setShowLoginPrompt(false)} style={{
                padding: '.65rem 1.5rem', background: 'transparent',
                border: '1px solid rgba(201,169,97,.3)', color: '#c9a961',
                borderRadius: '6px', fontSize: '.85rem', cursor: 'pointer',
              }}>Batal</button>
              <button onClick={() => router.push('/login')} style={{
                padding: '.65rem 1.5rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)',
                border: 'none', color: '#0a0807', borderRadius: '6px',
                fontSize: '.85rem', fontWeight: 500, cursor: 'pointer',
              }}><i className="fas fa-arrow-right-to-bracket" style={{marginRight:'.35rem'}}></i> Login</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807', color: '#f5ecd9' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '2px solid rgba(201,169,97,.15)', borderTop: '2px solid #c9a961', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '.9rem', color: 'rgba(245,236,217,.5)' }}>Loading...</p>
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </>
  );
}
