'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SessionNavbar from '@/components/SessionNavbar';

interface StaticTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category?: string;
  theme?: string;
  thumbnail: string;
  price: number;
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

const CATEGORY_LABEL: Record<string, string> = {
  wedding: 'Wedding',
  birthday: 'Birthday',
  corporate: 'Corporate',
  graduation: 'Graduation',
  baby: 'Baby Shower',
  other: 'Other',
};

const THEME_LABEL: Record<string, string> = {
  elegant: 'Elegant',
  modern: 'Modern',
  romantic: 'Romantic',
  traditional: 'Traditional',
  nature: 'Nature',
  minimal: 'Minimal',
};

export default function HomePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<StaticTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<string>('all');
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const isMobile = useMediaQuery('(max-width: 767px)');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveTheme('all');
  };

  const grouped = templates.reduce<Record<string, Record<string, StaticTemplate[]>>>((acc, t) => {
    const category = (t.category || t.type || 'other').toLowerCase();
    const theme = (t.theme || 'all').toLowerCase();
    if (!acc[category]) acc[category] = {};
    if (!acc[category][theme]) acc[category][theme] = [];
    acc[category][theme].push(t);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const labelA = CATEGORY_LABEL[a] || a;
    const labelB = CATEGORY_LABEL[b] || b;
    return labelA.localeCompare(labelB);
  });

  useEffect(() => {
    if (!activeCategory && sortedCategories.length > 0) {
      setActiveCategory(sortedCategories[0]);
    }
  }, [sortedCategories]);

  useEffect(() => {
    if (!activeCategory || !tabRefs.current[activeCategory] || !containerRef.current) return;
    const tab = tabRefs.current[activeCategory];
    const container = containerRef.current;
    if (!tab) return;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const left = tabRect.left - containerRect.left;
    const width = tabRect.width;
    setIndicator({ left, width, opacity: 1 });
    tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeCategory]);

  const activeThemes = activeCategory ? Object.keys(grouped[activeCategory] || {}) : [];
  const activeTemplates = activeCategory && grouped[activeCategory] && activeTheme !== 'all'
    ? grouped[activeCategory][activeTheme] || []
    : activeCategory
      ? (grouped[activeCategory]['all'] || Object.values(grouped[activeCategory] || {}).flat())
      : [];

  const showCategoryTabs = sortedCategories.length > 1;
  const showThemeTabs = activeThemes.length > 1;

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0807', color: '#f5ecd9',
      fontFamily: "'Jost', sans-serif", overflowX: 'hidden',
    }}>
      <SessionNavbar scrolled={scrolled} isMobile={isMobile} />

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '6rem 2rem 4rem', position: 'relative',
        background: 'radial-gradient(ellipse at 50% 30%, #1a1611 0%, #0a0807 60%)',
        overflow: 'hidden',
      }}>
        {[
          { size: 400, left: '5%', top: '60%', delay: '0s', dur: '12s', variant: 1 },
          { size: 280, left: '20%', top: '50%', delay: '2.5s', dur: '10s', variant: 2 },
          { size: 180, right: '10%', top: '55%', delay: '5s', dur: '9s', variant: 3 },
          { size: 120, right: '30%', top: '45%', delay: '1.5s', dur: '7s', variant: 4 },
          { size: 250, left: '60%', top: '65%', delay: '3.5s', dur: '11s', variant: 1 },
          { size: 90,  left: '40%', top: '40%', delay: '6s', dur: '6s', variant: 2 },
          { size: 60,  right: '20%', top: '35%', delay: '2s', dur: '5s', variant: 3 },
          { size: 150, left: '75%', top: '55%', delay: '4s', dur: '10s', variant: 4 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.size, height: b.size,
            left: b.left, right: b.right, top: b.top,
            borderRadius: '50%',
            border: '1px solid rgba(201,169,97,.15)',
            background: `radial-gradient(circle at 30% 30%, rgba(201,169,97,.04), rgba(201,169,97,.008) 60%, transparent)`,
            boxShadow: `inset 0 -20px 40px rgba(201,169,97,.02), 0 0 60px rgba(201,169,97,.01)`,
            animation: `surface${b.variant} ${b.dur} ease-out infinite ${b.delay}`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ display: 'inline-block', padding: '.35rem 1rem', borderRadius: '100px', background: 'rgba(201,169,97,.1)', border: '1px solid rgba(201,169,97,.2)', fontSize: isMobile ? '.75rem' : '.8rem', color: '#c9a961', textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: '2rem' }}>
          Premium Wedding Invitations
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem,8vw,6rem)', fontStyle: 'italic', color: '#f5ecd9', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '900px' }}>
          Create Your Perfect{' '}
          <span style={{ background: 'linear-gradient(135deg,#c9a961,#dfc47a,#c9a961)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Wedding Invitation
          </span>
        </h1>

        <p style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', color: isMobile ? 'rgba(245,236,217,.6)' : 'rgba(245,236,217,.7)', maxWidth: '680px', lineHeight: 1.8, marginBottom: '2.5rem' }}>
          Choose from our collection of elegant templates. Customize every detail, share with guests, and manage everything from one dashboard.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '.85rem 2rem', background: 'linear-gradient(135deg,#c9a961,#b8942e)', border: 'none', color: '#0a0807', borderRadius: '4px', fontSize: isMobile ? '.9rem' : '1rem', fontWeight: 500, cursor: 'pointer', transition: 'all .2s', letterSpacing: '.05em' }}
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
            <div style={{ display: 'inline-block', padding: '.25rem .75rem', borderRadius: '100px', background: 'rgba(201,169,97,.1)', border: '1px solid rgba(201,169,97,.2)', fontSize: isMobile ? '.75rem' : '.8rem', color: '#c9a961', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>
              {isLoading ? '...' : templates.length} Template{templates.length !== 1 ? 's' : ''} Available
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(1.5rem,3vw,2rem)' : 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 400, color: '#f5ecd9', fontStyle: 'italic', margin: '0 0 .5rem' }}>
              Choose Your Template
            </h2>
            <p style={{ fontSize: isMobile ? '.85rem' : '.9rem', color: isMobile ? 'rgba(245,236,217,.4)' : 'rgba(245,236,217,.55)', margin: 0 }}>
              Select a template to begin customizing your invitation
            </p>
          </div>

          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: '#14110d', border: '1px solid rgba(201,169,97,.08)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ height: '200px', background: 'linear-gradient(90deg, rgba(201,169,97,.04) 25%, rgba(201,169,97,.1) 50%, rgba(201,169,97,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    <div style={{ height: '20px', width: '60%', borderRadius: '4px', background: 'linear-gradient(90deg, rgba(201,169,97,.06) 25%, rgba(201,169,97,.14) 50%, rgba(201,169,97,.06) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite .2s' }} />
                    <div style={{ height: '14px', width: '90%', borderRadius: '4px', background: 'linear-gradient(90deg, rgba(201,169,97,.04) 25%, rgba(201,169,97,.1) 50%, rgba(201,169,97,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite .4s' }} />
                    <div style={{ height: '14px', width: '70%', borderRadius: '4px', background: 'linear-gradient(90deg, rgba(201,169,97,.04) 25%, rgba(201,169,97,.1) 50%, rgba(201,169,97,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite .6s' }} />
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
            <div>
              {/* Category tabs */}
              {showCategoryTabs && (
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <div ref={containerRef} style={{ display: 'flex', gap: '.5rem', overflowX: 'auto', paddingBottom: '.5rem' }} className="hide-scrollbar">
                    {sortedCategories.map((category) => {
                      const label = CATEGORY_LABEL[category] || category;
                      const isActive = activeCategory === category;
                      return (
                        <button key={category} ref={(el) => { tabRefs.current[category] = el; }} onClick={() => handleCategoryClick(category)}
                          style={{
                            padding: '.45rem 1rem', borderRadius: '100px', border: '1px solid ' + (isActive ? 'rgba(201,169,97,.4)' : 'rgba(201,169,97,.15)'),
                            background: isActive ? 'rgba(201,169,97,.12)' : 'transparent',
                            color: isActive ? '#c9a961' : 'rgba(245,236,217,.6)',
                            fontSize: '.8rem', cursor: 'pointer', transition: 'all .2s',
                            fontFamily: "'Jost', sans-serif", letterSpacing: '.04em', whiteSpace: 'nowrap',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, height: '2px',
                    background: '#c9a961', borderRadius: '2px',
                    transition: 'left .25s ease, width .25s ease, opacity .25s ease',
                    pointerEvents: 'none',
                  }} />
                </div>
              )}

              {/* Active category title */}
              {activeCategory && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.25rem,2.5vw,1.6rem)', color: '#f5ecd9', fontStyle: 'italic', margin: '0 0 .25rem' }}>
                    {CATEGORY_LABEL[activeCategory] || activeCategory}
                  </h3>
                  <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, rgba(201,169,97,.35), transparent)' }} />
                </div>
              )}

              {/* Theme tabs */}
              {showThemeTabs && activeCategory && (
                <div style={{
                  display: 'flex', gap: '.5rem', marginBottom: '1.25rem', overflowX: 'auto',
                  paddingBottom: '.25rem',
                }}
                className="hide-scrollbar"
                >
                  <button onClick={() => setActiveTheme('all')}
                    style={{
                      padding: '.4rem .9rem', borderRadius: '100px', border: '1px solid ' + (activeTheme === 'all' ? 'rgba(201,169,97,.4)' : 'rgba(201,169,97,.15)'),
                      background: activeTheme === 'all' ? 'rgba(201,169,97,.12)' : 'transparent',
                      color: activeTheme === 'all' ? '#c9a961' : 'rgba(245,236,217,.6)',
                      fontSize: '.78rem', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
                      fontFamily: "'Jost', sans-serif", letterSpacing: '.04em',
                    }}
                  >
                    All
                  </button>
                  {activeThemes.map((theme) => {
                    const label = THEME_LABEL[theme] || theme;
                    const isActive = activeTheme === theme;
                    return (
                      <button key={theme} onClick={() => setActiveTheme(theme)}
                        style={{
                          padding: '.4rem .9rem', borderRadius: '100px', border: '1px solid ' + (isActive ? 'rgba(201,169,97,.4)' : 'rgba(201,169,97,.15)'),
                          background: isActive ? 'rgba(201,169,97,.12)' : 'transparent',
                          color: isActive ? '#c9a961' : 'rgba(245,236,217,.6)',
                          fontSize: '.78rem', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
                          fontFamily: "'Jost', sans-serif", letterSpacing: '.04em',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Template grid */}
              {activeTemplates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#14110d', border: '1px solid rgba(201,169,97,.1)', borderRadius: '12px' }}>
                  <p style={{ color: 'rgba(245,236,217,.4)', fontSize: '.9rem' }}>No templates found for this theme.</p>
                </div>
              ) : (
                <div className="template-grid">
                  {activeTemplates.map((template, index) => (
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
                          fontSize: isMobile ? '.7rem' : '.75rem', fontWeight: 500, letterSpacing: '.05em',
                        }}>
                          {template.price > 0 ? `Rp ${template.price.toLocaleString('id-ID')}` : 'Gratis'}
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
                          <span style={{ fontSize: isMobile ? '.7rem' : '.75rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(245,236,217,.35)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
                            {template.type}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.25rem' : '1.35rem', color: '#c9a961', margin: '0 0 .35rem', fontStyle: 'italic', lineHeight: 1.2 }}>
                          {template.name}
                        </h3>
                        <p style={{
                          fontSize: isMobile ? '.8rem' : '.85rem', color: isMobile ? 'rgba(245,236,217,.55)' : 'rgba(245,236,217,.65)',
                          lineHeight: 1.5, margin: '0 0 1rem', flex: 1,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {template.description || 'No description'}
                        </p>

                        <button
                          style={{
                            width: '100%', padding: isMobile ? '.6rem' : '.7rem', marginTop: 'auto',
                            background: 'linear-gradient(135deg,#c9a961,#b8942e)',
                            border: 'none', color: '#0a0807', borderRadius: '6px',
                            fontSize: isMobile ? '.78rem' : '.85rem', fontWeight: 500, cursor: 'pointer',
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
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(201,169,97,.08)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(245,236,217,.3)', fontSize: isMobile ? '.8rem' : '.85rem' }}>
          © 2026 terimaundangan.com
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes surface1 { 0% { transform: scale(.15) translateY(80px); opacity: 0; filter: blur(12px); } 25% { transform: scale(.4) translateY(40px) translateX(-20px); opacity: .15; filter: blur(8px); } 50% { transform: scale(.7) translateY(15px) translateX(10px); opacity: .35; filter: blur(4px); } 75% { transform: scale(.9) translateY(5px) translateX(-5px); opacity: .55; filter: blur(1px); } 100% { transform: scale(1) translateY(0) translateX(0); opacity: .65; filter: blur(0); } }
        @keyframes surface2 { 0% { transform: scale(.15) translateY(80px); opacity: 0; filter: blur(12px); } 25% { transform: scale(.4) translateY(40px) translateX(25px); opacity: .15; filter: blur(8px); } 50% { transform: scale(.7) translateY(15px) translateX(-15px); opacity: .35; filter: blur(4px); } 75% { transform: scale(.9) translateY(3px) translateX(8px); opacity: .55; filter: blur(1px); } 100% { transform: scale(1) translateY(0) translateX(0); opacity: .65; filter: blur(0); } }
        @keyframes surface3 { 0% { transform: scale(.15) translateY(80px); opacity: 0; filter: blur(12px); } 25% { transform: scale(.4) translateY(35px) translateX(15px); opacity: .15; filter: blur(8px); } 50% { transform: scale(.7) translateY(10px) translateX(-25px); opacity: .35; filter: blur(4px); } 75% { transform: scale(.9) translateY(3px) translateX(12px); opacity: .55; filter: blur(1px); } 100% { transform: scale(1) translateY(0) translateX(0); opacity: .65; filter: blur(0); } }
        @keyframes surface4 { 0% { transform: scale(.15) translateY(80px); opacity: 0; filter: blur(12px); } 25% { transform: scale(.4) translateY(45px) translateX(-10px); opacity: .15; filter: blur(8px); } 50% { transform: scale(.7) translateY(20px) translateX(20px); opacity: .35; filter: blur(4px); } 75% { transform: scale(.9) translateY(8px) translateX(-12px); opacity: .55; filter: blur(1px); } 100% { transform: scale(1) translateY(0) translateX(0); opacity: .65; filter: blur(0); } }
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
