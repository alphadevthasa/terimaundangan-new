'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '../../lib/templates-config';

// Editor sections configuration
const editorSections = [
  {
    id: 'cover',
    title: '1. Cover',
    defaultOpen: true,
    fields: [
      { id: 'bride-nick', label: 'Bride Nickname', type: 'text', defaultValue: 'Sophia' },
      { id: 'groom-nick', label: 'Groom Nickname', type: 'text', defaultValue: 'Alexander' },
      { id: 'date-text', label: 'Wedding Date (Text)', type: 'text', defaultValue: 'Saturday, October 24th, 2026' },
    ],
  },
  {
    id: 'countdown',
    title: '2. Countdown',
    fields: [
      { id: 'countdown-master', label: 'Master Wedding Date', type: 'datetime-local', defaultValue: '2026-10-24T10:00' },
    ],
  },
  {
    id: 'couple',
    title: '3. The Couple',
    fields: [
      { id: 'couple-title', label: 'Intro Title', type: 'text', defaultValue: 'Two Souls, One Heart' },
      { id: 'couple-sub', label: 'Intro Subtitle', type: 'textarea', defaultValue: 'We invite you to share in our joy as we exchange our vows and begin our new life together.' },
    ],
  },
  {
    id: 'groom',
    title: '4. The Groom',
    fields: [
      { id: 'groom-full', label: 'Full Name', type: 'text', defaultValue: 'Alexander Pierce' },
      { id: 'groom-role', label: 'Role', type: 'text', defaultValue: 'The Groom' },
      { id: 'groom-photo', label: 'Photo URL', type: 'url', defaultValue: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
      { id: 'groom-dad', label: "Father's Name", type: 'text', defaultValue: 'Mr. Robert Pierce' },
      { id: 'groom-mom', label: "Mother's Name", type: 'text', defaultValue: 'Mrs. Elena Pierce' },
    ],
  },
  {
    id: 'bride',
    title: '5. The Bride',
    fields: [
      { id: 'bride-full', label: 'Full Name', type: 'text', defaultValue: 'Sophia Laurent' },
      { id: 'bride-role', label: 'Role', type: 'text', defaultValue: 'The Bride' },
      { id: 'bride-photo', label: 'Photo URL', type: 'url', defaultValue: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
      { id: 'bride-dad', label: "Father's Name", type: 'text', defaultValue: 'Mr. Arthur Laurent' },
      { id: 'bride-mom', label: "Mother's Name", type: 'text', defaultValue: 'Mrs. Clara Laurent' },
    ],
  },
  {
    id: 'verse',
    title: '6. Holy Verse',
    fields: [
      { id: 'verse-text', label: 'Verse Text', type: 'textarea', defaultValue: '"And above all these put on love, which binds everything together in perfect harmony."' },
      { id: 'verse-source', label: 'Source', type: 'text', defaultValue: 'Colossians 3:14' },
    ],
  },
  {
    id: 'story',
    title: '7. Love Story',
    fields: [
      { id: 'story-date-1', label: 'Date 1', type: 'text', defaultValue: 'June 2018' },
      { id: 'story-title-1', label: 'Title 1', type: 'text', defaultValue: 'First Meeting' },
      { id: 'story-desc-1', label: 'Desc 1', type: 'textarea', defaultValue: 'We met at a small coffee shop in the city.' },
      { id: 'story-date-2', label: 'Date 2', type: 'text', defaultValue: 'Dec 2024' },
      { id: 'story-title-2', label: 'Title 2', type: 'text', defaultValue: 'The Proposal' },
      { id: 'story-desc-2', label: 'Desc 2', type: 'textarea', defaultValue: 'Under the stars, a promise was made to last forever.' },
    ],
  },
  {
    id: 'events',
    title: '8. Events',
    fields: [
      { id: 'akad-date', label: 'Akad Date', type: 'text', defaultValue: 'Saturday, October 24, 2026' },
      { id: 'akad-time', label: 'Akad Time', type: 'text', defaultValue: '08:00 AM - 10:00 AM' },
      { id: 'akad-place', label: 'Akad Place', type: 'text', defaultValue: 'Grand Heritage Mosque' },
      { id: 'resepsi-date', label: 'Resepsi Date', type: 'text', defaultValue: 'Saturday, October 24, 2026' },
      { id: 'resepsi-time', label: 'Resepsi Time', type: 'text', defaultValue: '07:00 PM - End' },
      { id: 'resepsi-place', label: 'Resepsi Place', type: 'text', defaultValue: 'The Ritz-Carlton Ballroom' },
    ],
  },
  {
    id: 'gallery',
    title: '9. Gallery',
    fields: [
      { id: 'gal-1', label: 'Photo 1 URL', type: 'url', defaultValue: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-2', label: 'Photo 2 URL', type: 'url', defaultValue: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-3', label: 'Photo 3 URL', type: 'url', defaultValue: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-4', label: 'Photo 4 URL', type: 'url', defaultValue: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-5', label: 'Photo 5 URL', type: 'url', defaultValue: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-6', label: 'Photo 6 URL', type: 'url', defaultValue: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  {
    id: 'rsvp',
    title: '10. RSVP',
    fields: [
      { id: 'rsvp-title', label: 'RSVP Title', type: 'text', defaultValue: 'Will You Join Us?' },
      { id: 'rsvp-desc', label: 'RSVP Description', type: 'textarea', defaultValue: 'Please kindly confirm your attendance by October 1st, 2026.' },
    ],
  },
  {
    id: 'gifts',
    title: '11. Gifts',
    fields: [
      { id: 'bank-name', label: 'Bank Name', type: 'text', defaultValue: 'BCA' },
      { id: 'bank-acc', label: 'Account Number', type: 'text', defaultValue: '1234567890' },
      { id: 'bank-holder', label: 'Account Holder', type: 'text', defaultValue: 'Alexander Pierce' },
    ],
  },
  {
    id: 'stream',
    title: '12. Live Stream',
    fields: [
      { id: 'stream-title', label: 'Stream Title', type: 'text', defaultValue: 'Virtual Wedding' },
      { id: 'stream-desc', label: 'Stream Description', type: 'textarea', defaultValue: 'For friends and family who cannot attend physically.' },
    ],
  },
  {
    id: 'wishes',
    title: '13. Wishes',
    fields: [
      { id: 'wishes-title', label: 'Wishes Title', type: 'text', defaultValue: 'Guest Book' },
      { id: 'wishes-desc', label: 'Wishes Description', type: 'textarea', defaultValue: 'Leave your warmest wishes and blessings for our marriage.' },
    ],
  },
  {
    id: 'closing',
    title: '14. Closing',
    fields: [
      { id: 'closing-thanks', label: 'Thank You Text', type: 'text', defaultValue: 'Terima Kasih' },
      { id: 'closing-fam', label: 'Family Signatures', type: 'text', defaultValue: 'The Pierce & Laurent Families' },
    ],
  },
];

// Type for API response
interface TemplateData {
  id: string;
  [key: string]: string | number | boolean | Date;
}

// Convert kebab-case to camelCase (e.g., "bride-nick" -> "brideNick", "story-date-1" -> "storyDate1")
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function KelolaTemplateContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [staticTemplate, setStaticTemplate] = useState<{ name: string; html?: string } | null>(null);
  const templateConfig = staticTemplate ? (TEMPLATE_CONFIGS[staticTemplate.name] || DEFAULT_TEMPLATE_CONFIG) : DEFAULT_TEMPLATE_CONFIG;
  const templateHtml = staticTemplate?.html || templateConfig.html;

  // Fetch template from API on mount
  useEffect(() => {
    setMounted(true);
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);

      // Fetch static template info first (to get the right HTML)
      if (templateId) {
        const tmplRes = await fetch(`/api/static-templates/${templateId}`);
        if (tmplRes.ok) {
          const tmplData = await tmplRes.json();
          if (tmplData.template) setStaticTemplate(tmplData.template);
        }
      }

      // Fetch customer data by templateId
      const res = await fetch(`/api/customer${templateId ? `?templateId=${templateId}` : ''}`);
      const data = await res.json();
      
      const customer = data.customer || data.template;
      if (customer) {
        // Map database fields to form fields
        const formFields: Record<string, string> = {};
        editorSections.forEach(section => {
          section.fields.forEach(field => {
            const camelKey = kebabToCamel(field.id);
            formFields[field.id] = customer[camelKey] || field.defaultValue;
          });
        });
        setFormData(formFields);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      // Fallback to defaults
      const initial: Record<string, string> = {};
      editorSections.forEach(section => {
        section.fields.forEach(field => {
          initial[field.id] = field.defaultValue;
        });
      });
      setFormData(initial);
    } finally {
      setIsLoading(false);
    }
  };

  // Save template to API
  const saveTemplate = async () => {
    try {
      setSaveStatus('saving');
      
      // Convert form kebab-case keys to camelCase for Prisma
      const dbData: Record<string, string> = {};
      Object.entries(formData).forEach(([key, value]) => {
        dbData[kebabToCamel(key)] = value;
      });

      // Include templateId so API can find/create the right customer record
      const res = await fetch('/api/customer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dbData, templateId }),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving template:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Transform form data keys using the template's keyMap before sending to iframe
  const buildIframePayload = useCallback((data: Record<string, string>): Record<string, string> => {
    const km = templateConfig.keyMap;
    if (!km) return data; // No mapping needed (Elite Wedding)
    const payload: Record<string, string> = {};
    for (const [key, val] of Object.entries(data)) {
      payload[km[key] || key] = val;
    }
    return payload;
  }, [templateConfig]);

  // Broadcast data to iframe
  const broadcastToIframe = useCallback((data: Record<string, string>) => {
    if (iframeRef.current?.contentWindow) {
      try {
        const payload = buildIframePayload(data);
        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE', payload }, '*');
      } catch (e) {
        // Ignore cross-origin errors
      }
    }
  }, [buildIframePayload]);

  // When iframe loads, send current data
  const handleIframeLoad = useCallback(() => {
    if (Object.keys(formData).length > 0) {
      broadcastToIframe(formData);
    }
  }, [formData, broadcastToIframe]);

  // Handle form field changes with live preview
  const handleFieldChange = (id: string, value: string) => {
    const newData = { ...formData, [id]: value };
    setFormData(newData);
    broadcastToIframe(newData);
  };

  if (!mounted || isLoading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid var(--line)',
            borderTop: '2px solid var(--gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem' }}>Loading template...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)' }}>
      {/* LEFT PANE: EDITOR */}
      <div
        style={{
          width: '400px',
          minWidth: '400px',
          background: 'var(--bg)',
          borderRight: '1px solid var(--line)',
          overflowY: 'auto',
          padding: '1.5rem 1.25rem',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: '1.8rem',
            color: 'var(--gold)',
            borderBottom: '1px solid var(--line)',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          Editor Undangan
        </div>

        {/* Save & Publish */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <button
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              background: saveStatus === 'saved' ? '#34d399' : saveStatus === 'error' ? '#ef4444' : 'var(--gold)',
              border: 'none',
              color: 'var(--bg)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: saveStatus === 'saving' ? 0.7 : 1,
            }}
            disabled={saveStatus === 'saving'}
            onMouseEnter={(e) => {
              if (saveStatus === 'idle') { e.currentTarget.style.background = 'var(--gold-light)'; }
            }}
            onMouseLeave={(e) => {
              if (saveStatus === 'idle') { e.currentTarget.style.background = 'var(--gold)'; }
            }}
            onClick={saveTemplate}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved to DB!' : saveStatus === 'error' ? 'Error Saving' : 'Save Changes'}
          </button>
          <button
            style={{
              padding: '0.6rem 1rem',
              background: 'transparent',
              border: '1px solid var(--line)',
              color: 'var(--cream-dim)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
            onClick={() => {
              const link = 'https://undangan.example.com/wedding';
              navigator.clipboard?.writeText(link);
              alert('Link copied! Share with your guests');
            }}
          >
            Share
          </button>
        </div>

        {editorSections.map((section) => (
          <details
            key={section.id}
            open={section.defaultOpen}
            style={{
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '0.5rem',
            }}
          >
            <summary
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: '1rem',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                cursor: 'pointer',
                outline: 'none',
                listStyle: 'none',
                padding: '0.5rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                userSelect: 'none',
              }}
            >
              {section.title}
              <span style={{ fontFamily: "'Jost', sans-serif", fontStyle: 'normal', fontSize: '1rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>
            <div style={{ padding: '0.5rem 0' }}>
              {section.fields.map((field) => (
                <div key={field.id} style={{ marginBottom: '0.75rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      color: 'var(--cream-dim)',
                      marginBottom: '0.3rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-2)',
                        border: '1px solid var(--line)',
                        color: 'var(--cream)',
                        padding: '0.5rem 0.7rem',
                        borderRadius: '2px',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '0.85rem',
                        resize: 'vertical',
                        minHeight: '60px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-2)',
                        border: '1px solid var(--line)',
                        color: 'var(--cream)',
                        padding: '0.5rem 0.7rem',
                        borderRadius: '2px',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '0.85rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                    />
                  )}
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* RIGHT PANE: PREVIEW */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#111',
          position: 'relative',
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            height: '56px',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0 1.5rem',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'var(--bg-2)',
              padding: '3px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--line)',
            }}
          >
            <button
              onClick={() => setIsMobile(true)}
              style={{
                padding: '0.4rem 1rem',
                background: isMobile ? 'var(--gold)' : 'transparent',
                border: 'none',
                color: isMobile ? 'var(--bg)' : 'var(--cream-dim)',
                borderRadius: '2px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              Mobile
            </button>
            <button
              onClick={() => setIsMobile(false)}
              style={{
                padding: '0.4rem 1rem',
                background: !isMobile ? 'var(--gold)' : 'transparent',
                border: 'none',
                color: !isMobile ? 'var(--bg)' : 'var(--cream-dim)',
                borderRadius: '2px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Desktop
            </button>
          </div>
        </div>

        {/* Iframe Container */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0d0d0d 100%)',
          }}
        >
          <iframe
            ref={iframeRef}
            onLoad={handleIframeLoad}
            srcDoc={templateHtml}
            title="Wedding Preview"              style={{
              background: 'var(--bg)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isMobile
                ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,97,0.1)'
                : '0 20px 50px rgba(0,0,0,0.5)',
              width: isMobile ? '375px' : '100%',
              height: isMobile ? '812px' : '100%',
              borderRadius: isMobile ? '30px' : '4px',
              border: isMobile ? '8px solid #222' : '1px solid var(--line)',
              maxWidth: isMobile ? '375px' : '1100px',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function KelolaTemplatePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid var(--line)',
            borderTop: '2px solid var(--gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem' }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    }>
      <KelolaTemplateContent />
    </Suspense>
  );
}
