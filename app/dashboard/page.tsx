'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/user-context';

interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const ZERO: Countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };

function calcCountdown(target: number): Countdown {
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return ZERO;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
    minutes: Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0'),
    seconds: Math.floor((diff / 1000) % 60).toString().padStart(2, '0'),
  };
}

export default function DashboardPage() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [lastEdited, setLastEdited] = useState('');
  const [brideNick, setBrideNick] = useState('');
  const [groomNick, setGroomNick] = useState('');
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [weddingUrl, setWeddingUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const [previewTemplateId, setPreviewTemplateId] = useState('');

  useEffect(() => {
    setMounted(true);

    // Determine wedding URL
    const base = window.location.origin;
    setWeddingUrl(`${base}/`);

    let interval: NodeJS.Timeout | null = null;

    fetch('/api/customer')
      .then(res => res.json())
      .then(data => {
        const t = data.customer;
        const td = t?.templateData?.[0];
        if (t) {
          setTemplateName(td?.template?.name || t.name || '');
          setPreviewTemplateId(td?.templateId || '');
          setBrideNick(td?.brideNick || '');
          setGroomNick(td?.groomNick || '');
          setCreatedAt(
            t.createdAt
              ? new Date(t.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              : ''
          );
          setLastEdited(
            t.updatedAt
              ? new Date(t.updatedAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : ''
          );
          if (td?.countdownMaster) {
            const target = new Date(td.countdownMaster).getTime();
            setCountdown(calcCountdown(target));
            interval = setInterval(() => setCountdown(calcCountdown(target)), 1000);
          }

          // Fetch wish count
          fetch(`/api/wishes?templateDataId=${td?.id}`)
            .then(r => r.json())
            .then(d => { if (d.total !== undefined) setWishCount(d.total); })
            .catch(() => {});
        }
      })
      .catch(() => console.error('Error fetching template'));

    // Cleanup: clear interval on unmount (captured via closure)
    return () => { if (interval) clearInterval(interval); };
  }, []);

  const handleCopyLink = () => {
    if (weddingUrl) {
      navigator.clipboard.writeText(weddingUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!mounted) return null;

  const coupleName = brideNick && groomNick ? `${brideNick} & ${groomNick}` : '';
  const hasTemplate = !!templateName;

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
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 169, 97, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', left: '-5%',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 169, 97, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {hasTemplate && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.25rem 0.75rem', borderRadius: '100px',
              background: 'rgba(201, 169, 97, 0.1)',
              border: '1px solid rgba(201, 169, 97, 0.2)',
              fontSize: '0.75rem', color: 'var(--gold)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Template Aktif
            </div>
          )}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.2rem', fontWeight: 400,
            color: 'var(--cream)', marginBottom: '0.5rem', fontStyle: 'italic',
          }}>
            Selamat Datang{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h2>
          <p style={{ color: 'var(--cream-dim)', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.6 }}>
            {hasTemplate
              ? `Kelola undangan pernikahan Anda, edit konten, dan bagikan tautan undangan ke tamu.`
              : `Mulai dengan memilih template undangan untuk pernikahan Anda.`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {hasTemplate && (
              <a href="/dashboard/kelola-template"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.7rem 1.5rem', background: 'var(--gold)', color: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" />
                </svg>
                Kelola Template
              </a>
            )}
            {weddingUrl && hasTemplate && (
              <button onClick={handleCopyLink}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.7rem 1.5rem', background: 'transparent',
                  border: '1px solid var(--gold)', color: 'var(--gold)',
                  borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,97,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {copied ? 'Tersalin!' : 'Salin Tautan Undangan'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem', marginBottom: '2rem',
      }}>
        {/* Template */}
        <div className="animate-fadeIn" style={{
          background: 'var(--bg-2)', border: '1px solid var(--line)',
          borderRadius: 'var(--radius)', padding: '1.5rem',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Template
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 500, color: 'var(--cream)', marginBottom: '0.25rem', fontFamily: "'Cormorant Garamond', serif" }}>
            {hasTemplate ? '1' : '0'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>
            {hasTemplate ? templateName : 'Belum dipilih'}
          </div>
        </div>

        {/* Couple Names */}
        {coupleName && (
          <div className="animate-fadeIn" style={{
            background: 'var(--bg-2)', border: '1px solid var(--line)',
            borderRadius: 'var(--radius)', padding: '1.5rem',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Mempelai
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 500, color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif" }}>
              {coupleName}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', marginTop: '0.25rem' }}>
              {groomNick && brideNick ? `${groomNick} ❤️ ${brideNick}` : ''}
            </div>
          </div>
        )}

        {/* Countdown */}
        <div className="animate-fadeIn" style={{
          background: 'var(--bg-2)', border: '1px solid var(--line)',
          borderRadius: 'var(--radius)', padding: '1.5rem',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Menuju Hari H
          </div>
          {countdown ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
              {[
                { label: 'Hari', value: countdown.days },
                { label: 'Jam', value: countdown.hours },
                { label: 'Menit', value: countdown.minutes },
                { label: 'Detik', value: countdown.seconds },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.15rem' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '1.3rem', color: 'var(--cream-dim)', fontFamily: "'Cormorant Garamond', serif" }}>
              ---
            </div>
          )}
        </div>

        {/* Wedding Link */}
        {hasTemplate && (
          <div className="animate-fadeIn" style={{
            background: 'var(--bg-2)', border: '1px solid var(--line)',
            borderRadius: 'var(--radius)', padding: '1.5rem',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Tautan Undangan
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--cream)', wordBreak: 'break-all', lineHeight: 1.4, marginBottom: '0.5rem' }}>
              {weddingUrl || 'localhost'}
            </div>
            <button onClick={handleCopyLink}
              style={{
                padding: '0.3rem 0.75rem', background: 'transparent',
                border: '1px solid var(--line)', color: 'var(--cream-dim)',
                borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
            >
              {copied ? '✓ Tersalin' : '📋 Salin'}
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions & Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Quick Actions */}
        <div className="animate-fadeIn" style={{
          background: 'var(--bg-2)', border: '1px solid var(--line)',
          borderRadius: 'var(--radius)', padding: '1.5rem',
        }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--gold)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Edit Template Content', href: '/dashboard/kelola-template', icon: 'fas fa-pencil' },
              { label: weddingUrl && hasTemplate ? 'Salin Tautan Undangan' : null, action: 'copy', icon: 'fas fa-link' },
              { label: 'Customize Settings', href: '/dashboard/settings', icon: 'fas fa-gear' },
            ].filter(Boolean).map((action: any) => (
              action.href ? (
                <a key={action.label} href={action.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', background: 'var(--bg)',
                    border: '1px solid var(--line-light)', borderRadius: 'var(--radius-sm)',
                    color: 'var(--cream-dim)', fontSize: '0.9rem', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,97,0.2)'; e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.background = 'var(--bg-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-light)'; e.currentTarget.style.color = 'var(--cream-dim)'; e.currentTarget.style.background = 'var(--bg)'; }}
                >
                  <span><i className={action.icon}></i></span>
                  <span>{action.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.4 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              ) : action.action === 'copy' && weddingUrl && hasTemplate ? (
                <button key={action.label} onClick={handleCopyLink}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', background: 'var(--bg)',
                    border: '1px solid var(--line-light)', borderRadius: 'var(--radius-sm)',
                    color: 'var(--cream-dim)', fontSize: '0.9rem', cursor: 'pointer',
                    transition: 'all 0.2s', textAlign: 'left', width: '100%',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,97,0.2)'; e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.background = 'var(--bg-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-light)'; e.currentTarget.style.color = 'var(--cream-dim)'; e.currentTarget.style.background = 'var(--bg)'; }}
                >
                  <span><i className={action.icon}></i></span>
                  <span>{copied ? 'Tersalin!' : action.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.4 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : null
            ))}
          </div>
        </div>

        {/* Template Info */}
        <div className="animate-fadeIn" style={{
          background: 'var(--bg-2)', border: '1px solid var(--line)',
          borderRadius: 'var(--radius)', padding: '1.5rem',
        }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--gold)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
            Template Info
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Template', value: hasTemplate ? templateName : 'Belum dipilih' },
              { label: 'Status', value: hasTemplate ? '✅ Active & Published' : '⏳ Belum aktif' },
              ...(createdAt ? [{ label: 'Created', value: createdAt }] : []),
              ...(lastEdited ? [{ label: 'Last Edited', value: lastEdited }] : []),
            ].map((info) => (
              <div key={info.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0', borderBottom: '1px solid var(--line-light)',
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--cream-dim)' }}>{info.label}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--cream)' }}>{info.value}</span>
              </div>
            ))}
          </div>

          {hasTemplate && (
            <a href={`/detail/${previewTemplateId || ''}`} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem',
                padding: '0.75rem 1rem', background: 'rgba(201, 169, 97, 0.05)',
                border: '1px solid rgba(201, 169, 97, 0.15)', borderRadius: 'var(--radius-sm)',
                color: 'var(--gold)', fontSize: '0.85rem', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,97,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,169,97,0.05)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Preview Undangan</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.4 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
