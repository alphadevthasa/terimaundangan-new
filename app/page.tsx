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

export default function HomePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<StaticTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

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
        transition: 'all .3s ease', padding: '.85rem 2rem',
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
          <span style={{ fontFamily: "'Italiana', serif", fontSize: '1.4rem', color: '#c9a961' }}>
            Terima Undangan
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#templates" style={{ color: 'rgba(245,236,217,.6)', fontSize: '.85rem', textDecoration: 'none', transition: 'color .2s', letterSpacing: '.05em' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,236,217,.6)'}
          >Templates</a>
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
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '300px', height: '300px', border: '1px solid rgba(201,169,97,.05)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '200px', height: '200px', border: '1px solid rgba(201,169,97,.08)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', right: '25%', width: '120px', height: '120px', border: '1px solid rgba(201,169,97,.04)', borderRadius: '50%', animation: 'float 10s ease-in-out infinite 2s' }} />

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
        @keyframes float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(5deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .template-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        @media (max-width: 1023px) { .template-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) {
          .template-grid { display: flex; gap: 1rem; overflow-x: auto; overflow-y: hidden; padding-bottom: 1rem; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
          .template-grid > div { min-width: 290px; scroll-snap-align: start; flex-shrink: 0; }
        }
      `}} />
    </div>
  );
}
