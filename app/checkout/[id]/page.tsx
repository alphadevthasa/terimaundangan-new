'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface StaticTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  thumbnail: string;
  price: string;
  isPopular: boolean;
}

const PRICE_MAP: Record<string, number> = {
  Premium: 150000,
};

const FEATURES = [
  { icon: 'fas fa-clock', label: 'Countdown Timer', color: '#e74c3c' },
  { icon: 'fas fa-heart', label: 'Couple Profile', color: '#e84393' },
  { icon: 'fas fa-book', label: 'Holy Verse', color: '#8e44ad' },
  { icon: 'fas fa-scroll', label: 'Love Story Timeline', color: '#3498db' },
  { icon: 'fas fa-calendar-check', label: 'Wedding Events', color: '#16a085' },
  { icon: 'fas fa-camera', label: 'Photo Gallery', color: '#f39c12' },
  { icon: 'fas fa-envelope', label: 'RSVP Form', color: '#2ecc71' },
  { icon: 'fas fa-gift', label: 'Wedding Gift Info', color: '#d4af37' },
  { icon: 'fas fa-tv', label: 'Live Streaming', color: '#e67e22' },
  { icon: 'fas fa-pen', label: 'Guest Book / Wishes', color: '#1abc9c' },
];

const iconMap: Record<string, string> = {
  wedding: 'fas fa-heart',
  birthday: 'fas fa-cake-candles',
  corporate: 'fas fa-building',
};

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return isMobile;
}

function CheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile(900);
  const [template, setTemplate] = useState<StaticTemplate | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeError, setIframeError] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{name?: string; email?: string}>({});
  const nameRef = useRef<HTMLInputElement>(null);

  const templateId = params?.id as string;

  const price = template ? PRICE_MAP[template.price] ?? 150000 : 0;
  const fee = Math.round(price * 0.11);
  const total = price + fee;
  const icon = template ? iconMap[template.type] || 'fas fa-file' : 'fas fa-file';

  useEffect(() => {
    if (templateId) fetchTemplate(templateId);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [templateId]);

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

  const validateForm = () => {
    const errors: {name?: string; email?: string} = {};
    if (!customerName.trim()) errors.name = 'Name is required';
    if (!customerEmail.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) errors.email = 'Invalid email format';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createInvoice = async (tmpl: StaticTemplate) => {
    if (!validateForm()) return;
    try {
      setIsCreating(true);
      setError(null);
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: tmpl.id,
          templateName: tmpl.name,
          templatePrice: tmpl.price,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create invoice');
      if (data.invoiceUrl) setInvoiceUrl(data.invoiceUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment initiation failed');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(201,169,97,.15)', borderTop: '2px solid #c9a961', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(245,236,217,.5)', fontSize: '.9rem' }}>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !template) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807' }}>
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
    <div style={{ height: '100vh', background: '#0a0807', color: '#f5ecd9', fontFamily: "'Jost', sans-serif", display: 'flex', flexDirection: 'column' }}>
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
            <span style={{ fontSize: isMobile ? '.75rem' : '.9rem', color: 'rgba(245,236,217,.5)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Checkout</span>
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

      <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 0, paddingTop: isMobile ? '60px' : '72px' }}>
        {/* LEFT: Template info */}
        <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <div style={{ padding: isMobile ? '1rem' : '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '.85rem', maxWidth: '860px' }}>
              <div style={{ background: '#14110d', border: '1px solid rgba(201,169,97,.12)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', background: '#0a0807' }}>
                  {template.thumbnail ? (
                    <img src={template.thumbnail} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(201,169,97,.12), rgba(138,109,43,.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                      <i className={icon}></i>
                    </div>
                  )}
                </div>
                <div style={{ padding: isMobile ? '1.25rem' : '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.35rem' }}>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: isMobile ? '1.2rem' : '1.6rem', color: '#c9a961', margin: 0, lineHeight: 1.2 }}>{template.name}</h1>
                  </div>
                  <p style={{ fontSize: isMobile ? '.8rem' : '.9rem', color: isMobile ? 'rgba(245,236,217,.55)' : 'rgba(245,236,217,.6)', lineHeight: 1.6, margin: 0 }}>{template.description || 'Wedding invitation template'}</p>
                </div>
                <div style={{ borderTop: '1px solid rgba(201,169,97,.08)', padding: isMobile ? '1.25rem' : '1.5rem' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '.85rem' : '.9rem', color: '#c9a961', fontStyle: 'italic', marginBottom: '1rem', letterSpacing: '.02em' }}><i className="fas fa-crown" style={{fontSize:'.8rem',marginRight:'.35rem'}}></i> What&apos;s Included</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '.6rem' }}>
                    {FEATURES.map(f => (
                      <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: isMobile ? '.78rem' : '.82rem', color: 'rgba(245,236,217,.7)' }}>
                        <span style={{ width: '18px', textAlign: 'center', flexShrink: 0 }}><i className={f.icon} style={{ color: f.color }}></i></span>
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Price + Form + Bayar + Xendit */}
        <div style={{
          width: isMobile ? '100%' : '540px',
          flexShrink: 0,
          borderLeft: isMobile ? 'none' : '1px solid rgba(201,169,97,.1)',
          borderTop: isMobile ? '1px solid rgba(201,169,97,.1)' : 'none',
          background: '#14110d', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: isMobile ? '1rem 1.25rem' : '1.25rem 1.5rem', borderBottom: '1px solid rgba(201,169,97,.08)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#c9a961', fontStyle: 'italic', margin: 0 }}><i className="fas fa-credit-card" style={{fontSize:'.8rem',marginRight:'.35rem'}}></i> Pembayaran</h3>
          </div>

          {isCreating && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807', gap: '1rem', flexDirection: 'column' }}>
              <div style={{ width: '40px', height: '40px', border: '2px solid rgba(201,169,97,.15)', borderTop: '2px solid #c9a961', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
              <p style={{ color: 'rgba(245,236,217,.5)', fontSize: '.85rem' }}>Membuat invoice...</p>
            </div>
          )}

          {!isCreating && invoiceUrl && !iframeError && (
            <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
              <iframe src={invoiceUrl} style={{ width: '100%', height: '100%', border: 'none', display: 'block', position: 'absolute', inset: 0 }} title="Xendit Payment" onError={() => setIframeError(true)} allow="payment" />
              {invoiceUrl && (
                <a href={invoiceUrl} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '.72rem', color: '#666', textDecoration: 'none', background: '#fff', padding: '.3rem .6rem', borderRadius: '4px', border: '1px solid #ddd', zIndex: 5 }}>
                  Buka di tab baru ↗
                </a>
              )}
            </div>
          )}

          {!isCreating && (!invoiceUrl || iframeError) && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', padding: isMobile ? '1rem' : '1.5rem' }}>
                <div style={{ background: '#1a1611', border: '1px solid rgba(201,169,97,.12)', borderRadius: '12px', padding: isMobile ? '1.25rem' : '1.5rem' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '.85rem' : '.9rem', color: '#c9a961', fontStyle: 'italic', marginBottom: '.75rem' }}><i className="fas fa-calculator" style={{fontSize:'.75rem',marginRight:'.35rem'}}></i> Price Breakdown</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '.85rem' : '.9rem', color: 'rgba(245,236,217,.7)' }}>
                      <span>Template Price</span>
                      <span>Rp {price.toLocaleString('id-ID')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '.85rem' : '.9rem', color: 'rgba(245,236,217,.7)' }}>
                      <span>PPN 11%</span>
                      <span>Rp {fee.toLocaleString('id-ID')}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(201,169,97,.15)', paddingTop: '.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: isMobile ? '1rem' : '1.1rem', color: '#c9a961', fontWeight: 500 }}>
                      <span>Total</span>
                      <span style={{ fontSize: isMobile ? '1.1rem' : '1.2rem' }}>Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#1a1611', border: '1px solid rgba(201,169,97,.12)', borderRadius: '12px', padding: isMobile ? '1.25rem' : '1.5rem', marginTop: '1rem' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '.85rem' : '.9rem', color: '#c9a961', fontStyle: 'italic', marginBottom: '.75rem', letterSpacing: '.02em' }}><i className="fas fa-user" style={{fontSize:'.75rem',marginRight:'.35rem'}}></i> Your Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: isMobile ? '.72rem' : '.75rem', color: 'rgba(245,236,217,.5)', marginBottom: '.3rem', letterSpacing: '.05em', textTransform: 'uppercase' }}>Name</label>
                      <input ref={nameRef} type="text" value={customerName}
                        onChange={(e) => { setCustomerName(e.target.value); if (formErrors.name) setFormErrors(prev => ({...prev, name: undefined})); }}
                        placeholder="Your full name"
                        style={{ width: '100%', padding: '.7rem .85rem', boxSizing: 'border-box', background: '#0a0807', border: `1px solid ${formErrors.name ? '#ef4444' : 'rgba(201,169,97,.15)'}`, color: '#f5ecd9', borderRadius: '6px', fontSize: isMobile ? '.9rem' : '.95rem', fontFamily: "'Jost', sans-serif", outline: 'none', transition: 'border-color .2s' }}
                        onFocus={(e) => { if (!formErrors.name) e.target.style.borderColor = 'rgba(201,169,97,.5)'; }}
                        onBlur={(e) => { if (!formErrors.name) e.target.style.borderColor = 'rgba(201,169,97,.15)'; }} />
                      {formErrors.name && <span style={{ fontSize: '.7rem', color: '#ef4444', marginTop: '.2rem', display: 'block' }}>{formErrors.name}</span>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: isMobile ? '.72rem' : '.75rem', color: 'rgba(245,236,217,.5)', marginBottom: '.3rem', letterSpacing: '.05em', textTransform: 'uppercase' }}>Email</label>
                      <input type="email" value={customerEmail}
                        onChange={(e) => { setCustomerEmail(e.target.value); if (formErrors.email) setFormErrors(prev => ({...prev, email: undefined})); }}
                        placeholder="your@email.com"
                        style={{ width: '100%', padding: '.7rem .85rem', boxSizing: 'border-box', background: '#0a0807', border: `1px solid ${formErrors.email ? '#ef4444' : 'rgba(201,169,97,.15)'}`, color: '#f5ecd9', borderRadius: '6px', fontSize: isMobile ? '.9rem' : '.95rem', fontFamily: "'Jost', sans-serif", outline: 'none', transition: 'border-color .2s' }}
                        onFocus={(e) => { if (!formErrors.email) e.target.style.borderColor = 'rgba(201,169,97,.5)'; }}
                        onBlur={(e) => { if (!formErrors.email) e.target.style.borderColor = 'rgba(201,169,97,.15)'; }} />
                      {formErrors.email && <span style={{ fontSize: '.7rem', color: '#ef4444', marginTop: '.2rem', display: 'block' }}>{formErrors.email}</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flexShrink: 0, padding: isMobile ? '0 1rem 1rem' : '0 1.5rem 1.5rem', background: '#14110d' }}>
                <button onClick={() => createInvoice(template)} disabled={isCreating}
                  style={{ marginTop: '0', padding: isMobile ? '.85rem 2rem' : '.95rem 2rem', width: '100%', boxSizing: 'border-box', background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', borderRadius: '6px', fontSize: isMobile ? '1rem' : '1.05rem', fontWeight: 500, cursor: isCreating ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '.5rem', transition: 'all .2s', justifyContent: 'center', opacity: isCreating ? 0.7 : 1 }}
                  onMouseEnter={(e) => { if (!isCreating) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,169,97,.3)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {isCreating ? 'Memproses...' : 'Bayar Sekarang'}
                </button>
                {error && (
                  <div style={{ marginTop: '.75rem', padding: '.75rem 1rem', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '6px', color: '#ef4444', fontSize: '.8rem' }}>
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807', color: '#f5ecd9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(201,169,97,.15)', borderTop: '2px solid #c9a961', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(245,236,217,.5)', fontSize: '.9rem' }}>Loading...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
