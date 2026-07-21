'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StaticTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  thumbnail: string;
  price: string;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default function HomePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<StaticTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    fetchTemplates();
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/static-templates');
      const data = await res.json();
      if (data.templates) setTemplates(data.templates);
    } catch (e) {
      console.error('Failed to load templates:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0807', color: '#f5ecd9',
      fontFamily: "'Jost', sans-serif", overflowX: 'hidden',
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(10,8,7,.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,169,97,.1)' : '1px solid transparent',
        transition: 'all .3s ease', padding: isMobile ? '.75rem 1rem' : '.85rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#c9a961,#8a6d2b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#0a0807', fontWeight: 600, fontSize: '1rem' }}>E</span>
          </div>
          <span style={{ fontFamily: "'Italiana', serif", fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#c9a961', fontWeight: 600 }}>
            Terima Undangan
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '.5rem' : '1.5rem' }}>
          {isMobile ? (
            <>
              <button onClick={() => setMenuOpen(!menuOpen)}
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#c9a961', cursor: 'pointer', fontSize: '1.3rem', position: 'relative', zIndex: 110 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? (
                    <>
                      <line x1="6" y1="6" x2="18" y2="18" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>

              {/* Mobile dropdown overlay */}
              {menuOpen && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,.5)', zIndex: 100,
                }} onClick={() => setMenuOpen(false)} />
              )}
              <div style={{
                position: 'fixed', top: '64px', right: '1rem', zIndex: 110,
                background: '#14110d', border: '1px solid rgba(201,169,97,.15)',
                borderRadius: '8px', padding: '.5rem', minWidth: '180px',
                display: menuOpen ? 'flex' : 'none',
                flexDirection: 'column', gap: '.35rem',
                boxShadow: '0 16px 48px rgba(0,0,0,.5)',
              }}>
                <button onClick={() => { router.push('/login'); setMenuOpen(false); }}
                  style={{ padding: '.65rem 1rem', background: 'transparent', border: 'none', color: 'rgba(245,236,217,.7)', borderRadius: '4px', fontSize: '.85rem', cursor: 'pointer', textAlign: 'left', transition: 'background .15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,169,97,.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >Login</button>
                <button onClick={() => { router.push('/signup'); setMenuOpen(false); }}
                  style={{ padding: '.65rem 1rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '.85rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'opacity .15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '6rem 2rem 4rem', position: 'relative',
        background: 'radial-gradient(ellipse at 50% 30%, #1a1611 0%, #0a0807 60%)',
        overflow: 'hidden',
      }}>
        {[
          { size: 400, left: '5%', bottom: '-10%', delay: '0s', dur: '14s', opacity: .06 },
          { size: 280, left: '20%', bottom: '-8%', delay: '2s', dur: '11s', opacity: .08 },
          { size: 180, right: '10%', bottom: '-5%', delay: '4s', dur: '9s', opacity: .1 },
          { size: 120, right: '30%', bottom: '-3%', delay: '1s', dur: '7s', opacity: .12 },
          { size: 250, left: '60%', bottom: '-15%', delay: '3s', dur: '12s', opacity: .07 },
          { size: 90,  left: '40%', bottom: '-20%', delay: '5s', dur: '6s', opacity: .15 },
          { size: 60,  right: '20%', bottom: '-10%', delay: '1.5s', dur: '5s', opacity: .2 },
          { size: 150, left: '75%', bottom: '-12%', delay: '6s', dur: '10s', opacity: .09 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.size, height: b.size,
            left: b.left, right: b.right, bottom: b.bottom,
            borderRadius: '50%',
            border: '1px solid rgba(201,169,97,.15)',
            background: `radial-gradient(circle at 30% 30%, rgba(201,169,97,${b.opacity * .3}), rgba(201,169,97,${b.opacity * .05}) 60%, transparent)`,
            boxShadow: `inset 0 -20px 40px rgba(201,169,97,${b.opacity * .1}), 0 0 60px rgba(201,169,97,${b.opacity * .05})`,
            animation: `bubble ${b.dur} ease-in-out infinite ${b.delay}`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ display: 'inline-block', padding: '.35rem 1rem', borderRadius: '100px', background: 'rgba(201,169,97,.1)', border: '1px solid rgba(201,169,97,.2)', fontSize: '.75rem', color: '#c9a961', textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: '2rem' }}>
          Premium Wedding Invitations
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem,8vw,6rem)', fontStyle: 'italic', color: '#f5ecd9', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '800px' }}>
          Create Your Perfect{' '}
          <span style={{ background: 'linear-gradient(135deg,#c9a961,#dfc47a,#c9a961)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Wedding Invitation
          </span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'rgba(245,236,217,.6)', maxWidth: '600px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Choose from our collection of elegant templates. Customize every detail, share with guests, and manage everything from one dashboard.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '.85rem 2rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: '.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all .2s', letterSpacing: '.05em' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(201,169,97,.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Browse Templates ↓</button>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" style={{
        padding: '4rem 2rem 6rem', borderTop: '1px solid rgba(201,169,97,.08)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-block', padding: '.25rem .75rem', borderRadius: '100px', background: 'rgba(201,169,97,.1)', border: '1px solid rgba(201,169,97,.2)', fontSize: '.75rem', color: '#c9a961', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>
              {isLoading ? '...' : templates.length} Template{templates.length !== 1 ? 's' : ''} Available
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 400, color: '#f5ecd9', fontStyle: 'italic', margin: '0 0 .5rem' }}>
              Choose Your Template
            </h2>
            <p style={{ fontSize: '.85rem', color: 'rgba(245,236,217,.4)', margin: 0 }}>
              Select a template to begin customizing your invitation
            </p>
          </div>

          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: '#14110d', border: '1px solid rgba(201,169,97,.08)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ height: '200px', background: 'linear-gradient(90deg, rgba(201,169,97,.04) 25%, rgba(201,169,97,.1) 50%, rgba(201,169,97,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    <div style={{ height: '20px', width: '60%', borderRadius: '4px', background: 'linear-gradient(90deg, rgba(201,169,97,.06) 25%, rgba(201,169,97,.14) 50%, rgba(201,169,97,.06) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div style={{ height: '14px', width: '90%', borderRadius: '4px', background: 'linear-gradient(90deg, rgba(201,169,97,.04) 25%, rgba(201,169,97,.1) 50%, rgba(201,169,97,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite .2s' }} />
                    <div style={{ height: '14px', width: '70%', borderRadius: '4px', background: 'linear-gradient(90deg, rgba(201,169,97,.04) 25%, rgba(201,169,97,.1) 50%, rgba(201,169,97,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite .4s' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#14110d', border: '1px solid rgba(201,169,97,.1)', borderRadius: '12px' }}>
               <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: 'rgba(245,236,217,.6)', marginBottom: '.5rem', fontStyle: 'italic' }}>
                 No Templates Yet
               </h3>
              <p style={{ color: 'rgba(245,236,217,.4)', fontSize: '.9rem' }}>
                Check back later.
              </p>
            </div>
          ) : (
            <div className="template-grid">
              {templates.map((template, index) => {
                return (
                  <div key={template.id}
                    style={{
                      background: '#14110d', border: '1px solid rgba(201,169,97,.1)',
                      borderRadius: '12px', overflow: 'hidden',
                      transition: 'all .4s cubic-bezier(.23,1,.32,1)', cursor: 'pointer',
                      animation: 'fadeUp .5s ease-out backwards',
                      animationDelay: `${index * 0.08}s`,
                      display: 'flex', flexDirection: 'column',
                    }}
                    onClick={() => router.push(`/detail/${template.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201,169,97,.35)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,.4), 0 0 0 1px rgba(201,169,97,.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201,169,97,.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Cover / Thumbnail */}
                    <div style={{
                      height: '200px', position: 'relative', overflow: 'hidden',
                      background: template.thumbnail ? 'none' : 'linear-gradient(135deg, #0a0807 0%, #1a1611 50%, #0a0807 100%)',
                    }}>
                      {template.thumbnail ? (
                        <img src={template.thumbnail} alt={template.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
                          onMouseEnter={(e) => { if (e.currentTarget.tagName === 'IMG') e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(e) => { if (e.currentTarget.tagName === 'IMG') e.currentTarget.style.transform = 'scale(1)'; }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                         <div style={{ fontSize: '3.5rem', opacity: .6, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: "'Italiana', serif", color: '#c9a961' }}>
                           {template.name.charAt(0).toUpperCase()}
                         </div>
                      )}
                      {/* Price badge */}
                      <div style={{
                        position: 'absolute', top: '.75rem', right: '.75rem',
                        padding: '.25rem .7rem', borderRadius: '100px',
                        background: 'rgba(10,8,7,.7)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(201,169,97,.2)', color: '#c9a961',
                        fontSize: '.7rem', fontWeight: 500, letterSpacing: '.05em',
                      }}>
                        Rp 150.000
                      </div>
                      {template.isPopular && (
                        <div style={{
                          position: 'absolute', top: '.75rem', left: '.75rem',
                          padding: '.25rem .6rem', borderRadius: '100px',
                          background: 'rgba(201,169,97,.15)', backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(201,169,97,.3)', color: '#c9a961',
                          fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.08em',
                        }}>
                           Popular
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.35rem' }}>
                        <span style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(245,236,217,.35)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
                          {template.type}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#c9a961', margin: '0 0 .35rem', fontStyle: 'italic', lineHeight: 1.2 }}>
                        {template.name}
                      </h3>
                      <p style={{
                        fontSize: '.8rem', color: 'rgba(245,236,217,.55)',
                        lineHeight: 1.5, margin: '0 0 1rem', flex: 1,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {template.description || 'No description'}
                      </p>

                      <button
                        style={{
                          width: '100%', padding: '.6rem', marginTop: 'auto',
                          background: 'linear-gradient(135deg,#c9a961,#b8942e)',
                          border: 'none', color: '#0a0807', borderRadius: '6px',
                          fontSize: '.78rem', fontWeight: 500, cursor: 'pointer',
                          transition: 'all .2s', letterSpacing: '.03em',
                        }}
                        onClick={(e) => { e.stopPropagation(); router.push(`/detail/${template.id}`); }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                         Pilih Template Ini
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(201,169,97,.08)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(245,236,217,.3)', fontSize: '.8rem' }}>
          © 2026 terimaundangan.com
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bubble { 0%,100% { transform: translateY(0) translateX(0) scale(1); } 25% { transform: translateY(-25vh) translateX(10px) scale(1.04); } 50% { transform: translateY(-45vh) translateX(-8px) scale(.96); } 75% { transform: translateY(-65vh) translateX(15px) scale(1.02); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .template-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        @media (max-width: 1023px) { .template-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) {
          .template-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
}
