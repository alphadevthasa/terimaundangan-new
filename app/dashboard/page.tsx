'use client';

import { useState, useEffect } from 'react';

// Stats card data
const statsCards = [
  {
    title: 'Template Active',
    value: '1',
    subtitle: 'Wedding Invitation',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    color: 'var(--gold)',
  },
  {
    title: 'Visitors',
    value: '0',
    subtitle: 'Today',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: '#60a5fa',
  },
  {
    title: 'Guest Messages',
    value: '0',
    subtitle: 'Total Received',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: '#f59e0b',
  },
  {
    title: 'Days to Wedding',
    value: '--',
    subtitle: 'Countdown',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: '#a78bfa',
  },
];

interface TemplateInfo {
  id: string;
  name: string;
  countdownMaster: string;
  brideNick: string;
  groomNick: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [daysLeft, setDaysLeft] = useState('--');
  const [mounted, setMounted] = useState(false);
  const [templateInfo, setTemplateInfo] = useState<TemplateInfo | null>(null);
  const [templateName, setTemplateName] = useState('Wedding Invitation - Elite');
  const [createdAt, setCreatedAt] = useState('July 20, 2026');
  const [lastEdited, setLastEdited] = useState('Just now');
  const [countdownDate, setCountdownDate] = useState('2026-10-24T10:00');

  useEffect(() => {
    setMounted(true);
    
    // Fetch template from API
    fetch('/api/customer')
      .then(res => res.json())
      .then(data => {
        const t = data.customer || data.template;
        if (t) {
          setTemplateName(t.name || 'Wedding Invitation - Elite');
          setCreatedAt(new Date(t.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
          setLastEdited(new Date(t.updatedAt).toLocaleString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }));
          if (t.countdownMaster) {
            setCountdownDate(t.countdownMaster);
          }
        }
      })
      .catch(err => console.error('Error fetching template:', err));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!countdownDate) return;
    const target = new Date(countdownDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        setDaysLeft('00');
        clearInterval(interval);
      } else {
        setDaysLeft(Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownDate]);

  if (!mounted) return null;

  const updatedStats = statsCards.map(card =>
    card.title === 'Days to Wedding' ? { ...card, value: daysLeft } : card
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div
        className="animate-fadeIn"
        style={{
          background: 'linear-gradient(135deg, rgba(201, 169, 97, 0.08) 0%, rgba(201, 169, 97, 0.02) 100%)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius)',
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201, 169, 97, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201, 169, 97, 0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '100px',
              background: 'rgba(201, 169, 97, 0.1)',
              border: '1px solid rgba(201, 169, 97, 0.2)',
              fontSize: '0.75rem',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem',
            }}
          >
            <i className="fas fa-circle-check" style={{marginRight:'.5rem'}}></i> Selamat! Template Aktif
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.2rem',
              fontWeight: 400,
              color: 'var(--cream)',
              marginBottom: '0.5rem',
              fontStyle: 'italic',
            }}
          >
            Selamat Datang di Dashboard Anda
          </h2>
          <p style={{ color: 'var(--cream-dim)', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Website undangan pernikahan Anda sudah aktif! Mulai kelola template, 
            edit konten, dan bagikan ke tamu undangan Anda.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <a
              href="/dashboard/kelola-template"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.5rem',
                background: 'var(--gold)',
                color: 'var(--bg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--gold-light)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--gold)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              Kelola Template
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {updatedStats.map((stat, index) => (
          <div
            key={stat.title}
            className="animate-fadeIn"
            style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              cursor: 'default',
              animationDelay: `${index * 0.1}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  background: `${stat.color}10`,
                  border: `1px solid ${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 500, color: 'var(--cream)', marginBottom: '0.25rem', fontFamily: "'Cormorant Garamond', serif" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--cream-dim)' }}>{stat.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}
      >
        {/* Quick Actions */}
        <div
          className="animate-fadeIn"
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem',
              color: 'var(--gold)',
              marginBottom: '1.25rem',
              fontStyle: 'italic',
            }}
          >
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Edit Template Content', href: '/dashboard/kelola-template', icon: 'fas fa-pencil' },
              { label: 'Share Wedding Link', href: '#', icon: 'fas fa-link' },
              { label: 'View Guest Messages', href: '#', icon: 'fas fa-envelope' },
              { label: 'Customize Settings', href: '/dashboard/settings', icon: 'fas fa-gear' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--line-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--cream-dim)',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.2)';
                  e.currentTarget.style.color = 'var(--cream)';
                  e.currentTarget.style.background = 'var(--bg-3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line-light)';
                  e.currentTarget.style.color = 'var(--cream-dim)';
                  e.currentTarget.style.background = 'var(--bg)';
                }}
              >
                <span><i className={action.icon}></i></span>
                <span>{action.label}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: 'auto', opacity: 0.4 }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Template Info */}
        <div
          className="animate-fadeIn"
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem',
              color: 'var(--gold)',
              marginBottom: '1.25rem',
              fontStyle: 'italic',
            }}
          >
            Template Info
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Template Type', value: templateName },
              { label: 'Status', value: (<><i className="fas fa-check-circle" style={{marginRight:'.35rem'}}></i> Active & Published</>) },
              { label: 'Created', value: createdAt },
              { label: 'Last Edited', value: lastEdited },
            ].map((info) => (
              <div
                key={info.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--line-light)',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--cream-dim)' }}>{info.label}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--cream)' }}>{info.value}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(201, 169, 97, 0.05)',
              border: '1px solid rgba(201, 169, 97, 0.15)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--cream-dim)', lineHeight: 1.5 }}>
              <i className="fas fa-lightbulb" style={{marginRight:'.35rem'}}></i> <strong style={{ color: 'var(--gold)' }}>Tips:</strong> Anda bisa mengedit semua konten undangan 
              melalui menu <strong style={{ color: 'var(--cream)' }}>Kelola Template</strong>. 
              Preview akan langsung terupdate secara real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
