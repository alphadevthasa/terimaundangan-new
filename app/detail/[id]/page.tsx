'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '../../lib/templates-config';

interface StaticTemplate { id: string; name: string; description: string; type: string; thumbnail: string; price: string; isPopular: boolean; }

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

  // Get template config based on template name
  const templateConfig = template ? (TEMPLATE_CONFIGS[template.name] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;

  useEffect(() => {
    setMounted(true);
    const id = params?.id as string;
    if (id) fetchTemplate(id);
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
    const data = config.demoData;
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
      {/* Navbar */}
      <nav style={{ padding: '.75rem 2rem', borderBottom: '1px solid rgba(201,169,97,.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#c9a961,#8a6d2b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0a0807', fontWeight: 600, fontSize: '.85rem' }}>E</span>
          </div>
          <div>
            <span style={{ fontFamily: "'Italiana', serif", fontSize: '1.2rem', color: '#c9a961', marginRight: '.75rem' }}>Terima Undangan</span>
            <span style={{ fontSize: '.85rem', color: 'rgba(245,236,217,.6)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>/ {template.name}</span>
          </div>
        </div>
        {hasSession && <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: '1px solid rgba(201,169,97,.3)', color: '#c9a961', padding: '.4rem 1rem', borderRadius: '4px', fontSize: '.8rem', cursor: 'pointer' }}>Dashboard</button>}
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
        minHeight: 0,
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

            {/* Preview area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 0, overflow: 'auto', padding: '1rem 0' }}>
              {previewMode === 'mobile' ? (
                /* Mobile phone mockup */
                <div className="preview-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', flexShrink: 0 }}>
                  <div style={{
                    width: '330px', height: '620px', background: '#0a0807',
                    border: '3px solid #2a2a2a', borderRadius: '24px', overflow: 'hidden',
                    position: 'relative', boxShadow: '0 0 0 1px #1a1a1a, 0 20px 60px rgba(0,0,0,.6)',
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100px', height: '16px', background: '#2a2a2a', borderRadius: '0 0 10px 10px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1a1a1a' }} />
                      <div style={{ width: '30px', height: '3px', borderRadius: '2px', background: '#1a1a1a' }} />
                    </div>
                    <iframe ref={mobileRef} srcDoc={templateConfig.html} onLoad={handleIframeLoad} style={{ width: '100%', height: '100%', border: 'none', background: '#0a0807' }} title="Mobile Preview" />
                  </div>
                </div>
              ) : (
                /* Desktop macOS window mockup */
                <div className="preview-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', width: '100%', maxWidth: '1100px' }}>
                  <div style={{
                    width: '100%', background: '#1c1c1e', borderRadius: '10px', overflow: 'hidden',
                    boxShadow: '0 0 0 1px rgba(255,255,255,.06), 0 20px 60px rgba(0,0,0,.5)',
                  }}>
                    {/* macOS title bar */}
                    <div style={{
                      padding: '.6rem 1rem', background: '#2c2c2e', borderBottom: '1px solid rgba(255,255,255,.06)',
                      display: 'flex', alignItems: 'center', gap: '.6rem',
                    }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56' }} />
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e' }} />
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', fontSize: '.72rem', color: 'rgba(255,255,255,.35)', fontFamily: "'-apple-system', 'Helvetica Neue', sans-serif", letterSpacing: '.02em', paddingRight: '42px' }}>
                        {template.name} — Terima Undangan
                      </div>
                    </div>
                    {/* Desktop iframe */}
                    <div style={{ height: '70vh', minHeight: '500px', maxHeight: '800px', background: '#0a0807' }}>
                      <iframe ref={desktopRef} srcDoc={templateConfig.html} onLoad={handleIframeLoad} style={{ width: '100%', height: '100%', border: 'none', background: '#0a0807' }} title="Desktop Preview" />
                    </div>
                  </div>
                </div>
            )}
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
              <div className="preview-fade-in" style={{ width: '100%', height: '480px', background: '#0a0807', border: '1px solid rgba(201,169,97,.15)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,.4)' }}>
                <iframe ref={mobileRef} srcDoc={templateConfig.html} onLoad={handleIframeLoad} style={{ width: '100%', height: '100%', border: 'none', background: '#0a0807' }} title="Mobile Preview" />
              </div>
            ) : (
              <div className="preview-fade-in" style={{ width: '100%', background: '#1c1c1e', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,255,255,.06), 0 10px 40px rgba(0,0,0,.5)' }}>
                <div style={{ padding: '.5rem .85rem', background: '#2c2c2e', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <div style={{ display: 'flex', gap: '5px' }}><div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f56' }} /><div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffbd2e' }} /><div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#28c840' }} /></div>
                  <div style={{ flex: 1, textAlign: 'center', fontSize: '.65rem', color: 'rgba(255,255,255,.3)' }}>{template.name}</div>
                </div>
                <div style={{ height: '400px', background: '#0a0807' }}>
                  <iframe ref={desktopRef} srcDoc={templateConfig.html} onLoad={handleIframeLoad} style={{ width: '100%', height: '100%', border: 'none', background: '#0a0807' }} title="Desktop Preview" />
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
          {/* Features list */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(201,169,97,.08)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '.95rem', color: '#c9a961', marginBottom: '1rem', fontStyle: 'italic', letterSpacing: '.02em' }}><i className="fas fa-crown" style={{fontSize:'.8rem',marginRight:'.35rem'}}></i> Features Included</h3>
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
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.78rem', color: 'rgba(245,236,217,.7)' }}>
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
              width: '100%', padding: '.85rem 2rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)',
              border: 'none', color: '#0a0807', borderRadius: '6px',
              fontSize: '.9rem', fontWeight: 500, cursor: 'pointer',
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }
        .preview-fade-in { animation: fadeScale .45s cubic-bezier(.16,1,.3,1); }
        @keyframes fadeScale { from { opacity: 0; transform: scale(.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
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
