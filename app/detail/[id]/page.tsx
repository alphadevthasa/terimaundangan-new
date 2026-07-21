'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '../../lib/templates-config';

interface StaticTemplate { id: string; name: string; description: string; type: string; thumbnail: string; price: string; isPopular: boolean; html?: string; defaultData?: string; }

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
  const [hasSession, setHasSession] = useState(false);

  const isMobile = useMediaQuery('(max-width: 1023px)');

  useEffect(() => { setHasSession(!!localStorage.getItem('session')); }, []);

  const [template, setTemplate] = useState<StaticTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Get template config based on template name
  const templateConfig = template ? (TEMPLATE_CONFIGS[template.name] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;
  const templateHtml = template?.html || templateConfig.html;

  useEffect(() => {
    setMounted(true);
    const id = params?.id as string;
    if (id) fetchTemplate(id);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
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

  // Broadcast demo data to both iframes - use template-specific demo data
  const broadcastToIframes = useCallback(() => {
    const config = template ? (TEMPLATE_CONFIGS[template.name] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;
    let data = config.demoData;
    try { const p = JSON.parse(template?.defaultData || '{}'); if (Object.keys(p).length) data = p; } catch {}
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
      {/* Navbar — same as homepage */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(10,8,7,.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,169,97,.1)' : '1px solid transparent',
        transition: 'all .3s ease', padding: isMobile ? '.75rem 1rem' : '.85rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: 'pointer', minWidth: 0 }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#c9a961,#8a6d2b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#0a0807', fontWeight: 600, fontSize: '1rem' }}>E</span>
          </div>
          <div style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: '.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Italiana', serif", fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#c9a961', fontWeight: 600 }}>Terima Undangan</span>
            {template && <span style={{ fontSize: isMobile ? '.75rem' : '.9rem', color: 'rgba(245,236,217,.5)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>/ {template.name}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '.5rem' : '1.5rem' }}>
          {isMobile ? (
            <>
              <button onClick={() => setMenuOpen(!menuOpen)}
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#c9a961', cursor: 'pointer', fontSize: '1.3rem', position: 'relative', zIndex: 110 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? (
                    <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>
                  ) : (
                    <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                  )}
                </svg>
              </button>
              {menuOpen && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.5)', zIndex: 100 }} onClick={() => setMenuOpen(false)} />}
              <div style={{ position: 'fixed', top: '64px', right: '1rem', zIndex: 110, background: '#14110d', border: '1px solid rgba(201,169,97,.15)', borderRadius: '8px', padding: '.5rem', minWidth: '180px', display: menuOpen ? 'flex' : 'none', flexDirection: 'column', gap: '.35rem', boxShadow: '0 16px 48px rgba(0,0,0,.5)' }}>
                <button onClick={() => { router.push('/login'); setMenuOpen(false); }} style={{ padding: '.65rem 1rem', background: 'transparent', border: 'none', color: 'rgba(245,236,217,.7)', borderRadius: '4px', fontSize: '.85rem', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,169,97,.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >Login</button>
                <button onClick={() => { router.push('/signup'); setMenuOpen(false); }} style={{ padding: '.65rem 1rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '.85rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >Sign Up</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/login')}
                style={{ padding: '.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(201,169,97,.4)', color: '#c9a961', borderRadius: '4px', fontSize: '.8rem', cursor: 'pointer', transition: 'all .2s', letterSpacing: '.1em' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,169,97,.1)'; e.currentTarget.style.borderColor = '#c9a961'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,169,97,.4)'; }}
              >Login</button>
              <button onClick={() => router.push('/signup')}
                style={{ padding: '.5rem 1.25rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all .2s', letterSpacing: '.1em' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(201,169,97,.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {status === 'failed' && (
        <div style={{ padding: '.75rem 2rem', background: 'rgba(239,68,68,.1)', borderBottom: '1px solid rgba(239,68,68,.2)', color: '#ef4444', fontSize: '.85rem', textAlign: 'center' }}>
          <i className="fas fa-triangle-exclamation" style={{marginRight:'.35rem'}}></i>Payment was cancelled or failed. Please try again.
          </div>
        )}

      {/* Main: Preview + Checkout */}
      <div style={{
        flex: 1, display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: isMobile ? 'auto' : 'hidden',
        minHeight: 0, paddingTop: isMobile ? '60px' : '72px',
      }}>
        {/* Desktop: side-by-side preview + sidebar. Mobile: stacked */}
        {!isMobile && (
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Mobile
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12" y2="20" stroke="currentColor" strokeWidth="2"/></svg>
                Desktop
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
                  /* Mobile notch/dynamic island */
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
                  /* macOS traffic light dots + title */
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
        )}

        {/* Mobile: stacked with tabs */}
        {isMobile && (
          <div style={{ padding: '1rem 1rem 0', background: 'radial-gradient(ellipse at center, #1a1611 0%, #0a0807 100%)' }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: '.35rem', marginBottom: '.75rem' }}>
              <button onClick={() => setPreviewMode('mobile')}
                style={{ padding: '.35rem .85rem', borderRadius: '6px', fontSize: '.7rem', fontFamily: "'Jost', sans-serif", cursor: 'pointer', transition: 'all .2s', background: previewMode === 'mobile' ? '#c9a961' : 'rgba(201,169,97,.08)', border: '1px solid rgba(201,169,97,.15)', color: previewMode === 'mobile' ? '#0a0807' : 'rgba(245,236,217,.5)', fontWeight: previewMode === 'mobile' ? 500 : 400, display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                📱 Mobile
              </button>
              <button onClick={() => setPreviewMode('desktop')}
                style={{ padding: '.35rem .85rem', borderRadius: '6px', fontSize: '.7rem', fontFamily: "'Jost', sans-serif", cursor: 'pointer', transition: 'all .2s', background: previewMode === 'desktop' ? '#c9a961' : 'rgba(201,169,97,.08)', border: '1px solid rgba(201,169,97,.15)', color: previewMode === 'desktop' ? '#0a0807' : 'rgba(245,236,217,.5)', fontWeight: previewMode === 'desktop' ? 500 : 400, display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                💻 Desktop
              </button>
            </div>
            {previewMode === 'mobile' ? (
              <div style={{
                width: '100%', background: '#1c1c1e', borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 0 0 1px #1a1a1a, 0 10px 40px rgba(0,0,0,.6)',
              }}>
                <div style={{
                  position: 'relative', height: '28px', background: '#2c2c2e',
                  borderBottom: '1px solid rgba(255,255,255,.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: '100px', height: '20px', background: '#111', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#333' }} />
                    <div style={{ width: '30px', height: '3px', borderRadius: '2px', background: '#222' }} />
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#333' }} />
                  </div>
                </div>
                <div style={{ height: '450px', background: '#0a0807' }}>
                  <iframe ref={desktopRef} srcDoc={templateHtml} onLoad={handleIframeLoad} style={{ width: '100%', height: '100%', border: 'none', background: '#0a0807' }} title="Mobile Preview" />
                </div>
              </div>
            ) : (
              <div style={{
                width: '100%', background: '#1c1c1e', borderRadius: '10px', overflow: 'hidden',
                boxShadow: '0 0 0 1px rgba(255,255,255,.06), 0 10px 40px rgba(0,0,0,.5)',
              }}>
                <div style={{ padding: '.5rem .85rem', background: '#2c2c2e', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <div style={{ display: 'flex', gap: '5px' }}><div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f56' }} /><div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffbd2e' }} /><div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#28c840' }} /></div>
                  <div style={{ flex: 1, textAlign: 'center', fontSize: '.65rem', color: 'rgba(255,255,255,.3)' }}>{template.name}</div>
                </div>
                <div style={{ height: '360px', background: '#0a0807' }}>
                  <iframe ref={desktopRef} srcDoc={templateHtml} onLoad={handleIframeLoad} style={{ width: '100%', height: '100%', border: 'none', background: '#0a0807' }} title="Desktop Preview" />
                </div>
              </div>
            )}
            </div>
        )}

        {/* Sidebar — always visible */}
        <div style={{
          width: isMobile ? '100%' : '400px',
          borderLeft: isMobile ? 'none' : '1px solid rgba(201,169,97,.1)',
          background: isMobile ? '#0a0807' : '#14110d',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
          overflowY: isMobile ? 'visible' : 'auto',
          height: isMobile ? 'auto' : '100%',
        }}>
          {/* Template info */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(201,169,97,.08)' }}>
            <div style={{ fontSize: isMobile ? '.7rem' : '.75rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(245,236,217,.35)', marginBottom: '.35rem' }}>{template.type}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.4rem' : '1.6rem', color: '#c9a961', fontStyle: 'italic', margin: '0 0 .75rem', lineHeight: 1.2 }}>{template.name}</h2>
            <p style={{ fontSize: isMobile ? '.82rem' : '.9rem', color: isMobile ? 'rgba(245,236,217,.6)' : 'rgba(245,236,217,.65)', lineHeight: 1.7, margin: '0 0 1rem' }}>{template.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '.75rem', borderTop: '1px solid rgba(201,169,97,.08)' }}>
              <span style={{ fontSize: isMobile ? '.75rem' : '.8rem', color: 'rgba(245,236,217,.4)' }}>Harga</span>
              <span style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', color: '#c9a961', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600 }}>Rp 150.000</span>
            </div>
          </div>

          {/* Features list */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(201,169,97,.08)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '.9rem' : '1rem', color: '#c9a961', marginBottom: '1rem', fontStyle: 'italic', letterSpacing: '.02em' }}><i className="fas fa-crown" style={{fontSize:isMobile ? '.8rem' : '.9rem',marginRight:'.35rem'}}></i> Features Included</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
              {[
                { icon: 'fas fa-clock', label: 'Countdown Timer' },
                { icon: 'fas fa-heart', label: 'Couple Profile' },
                { icon: 'fas fa-book', label: 'Holy Verse' },
                { icon: 'fas fa-scroll', label: 'Love Story Timeline' },
                { icon: 'fas fa-calendar-check', label: 'Wedding Events' },
                { icon: 'fas fa-camera', label: 'Photo Gallery' },
                { icon: 'fas fa-envelope', label: 'RSVP Form' },
                { icon: 'fas fa-gift', label: 'Wedding Gift Info' },
                { icon: 'fas fa-tv', label: 'Live Streaming' },
                { icon: 'fas fa-pen', label: 'Guest Book / Wishes' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: isMobile ? '.78rem' : '.82rem', color: 'rgba(245,236,217,.7)' }}>
                  <span style={{ width: '18px', textAlign: 'center', flexShrink: 0 }}><i className={f.icon}></i></span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Purchase button */}
          <div style={{ padding: '1.5rem', marginTop: 'auto' }}>
            {error && (
              <div style={{ fontSize: '.75rem', color: '#ef4444', marginBottom: '.75rem', background: 'rgba(239,68,68,.1)', padding: '.5rem .75rem', borderRadius: '4px', border: '1px solid rgba(239,68,68,.2)' }}>
                {error}
              </div>
            )}
              <button onClick={handleProceedToCheckout} style={{
              width: '100%', padding: isMobile ? '.85rem 2rem' : '.95rem 2rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)',
              border: 'none', color: '#0a0807', borderRadius: '6px',
              fontSize: isMobile ? '.9rem' : '1rem', fontWeight: 500, cursor: 'pointer',
              transition: 'all .2s', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,169,97,.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
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
