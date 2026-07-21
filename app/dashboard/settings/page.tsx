'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'domain', label: 'Domain' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div className="animate-fadeIn">
        {/* Settings Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--line)',
            paddingBottom: '0',
            marginBottom: '2rem',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--cream-dim)',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-1px',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--cream)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--cream-dim)';
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                marginBottom: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                }}
              >
                Profile Settings
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alexander Pierce"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="alexander@example.com"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Wedding Website URL
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="text"
                      defaultValue="undangan.example.com/wedding"
                      style={{
                        flex: 1,
                        maxWidth: '400px',
                        background: 'var(--bg)',
                        border: '1px solid var(--line)',
                        color: 'var(--cream)',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                    />
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
                        navigator.clipboard?.writeText('https://undangan.example.com/wedding');
                        alert('URL copied!');
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                }}
              >
                Plan & Billing
              </h3>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: 'rgba(201, 169, 97, 0.05)',
                  border: '1px solid rgba(201, 169, 97, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 500 }}>Premium Plan</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', marginTop: '0.25rem' }}>
                    Active until July 20, 2027
                  </div>
                </div>
                <div
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(52, 211, 153, 0.1)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    borderRadius: '100px',
                    color: '#34d399',
                    fontSize: '0.75rem',
                  }}
                >
                  Active
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                }}
              >
                Template Styling
              </h3>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Customize the look and feel of your wedding invitation website. 
                Changes will be reflected in real-time in the Kelola Template page.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--line-light)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>Primary Color</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>Gold accent for your template</div>
                  </div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      border: '2px solid var(--line)',
                      cursor: 'pointer',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--line-light)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>Background Theme</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>Dark elegant theme</div>
                  </div>
                  <select
                    style={{
                      background: 'var(--bg-2)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      outline: 'none',
                    }}
                  >
                    <option>Dark Elegance</option>
                    <option>Light Classic</option>
                    <option>Rustic Natural</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--line-light)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>Font Family</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>Cormorant Garamond + Jost</div>
                  </div>
                  <select
                    style={{
                      background: 'var(--bg-2)',
                      border: '1px solid var(--line)',
                      color: 'var(--cream)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      outline: 'none',
                    }}
                  >
                    <option>Classic Serif</option>
                    <option>Modern Minimal</option>
                    <option>Script Elegance</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Domain Tab */}
        {activeTab === 'domain' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                }}
              >
                Custom Domain
              </h3>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Connect your own domain to make your wedding website more personal.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                <input
                  type="text"
                  placeholder="yourdomain.com"
                  style={{
                    flex: 1,
                    maxWidth: '350px',
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    color: 'var(--cream)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                />
                <button
                  style={{
                    padding: '0.6rem 1.5rem',
                    background: 'var(--gold)',
                    border: 'none',
                    color: 'var(--bg)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-light)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
                  onClick={() => alert('Domain connection initiated! Check your email for DNS instructions.')}
                >
                  Connect
                </button>
              </div>

              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(96, 165, 250, 0.05)',
                  border: '1px solid rgba(96, 165, 250, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <p style={{ fontSize: '0.85rem', color: 'var(--cream-dim)', lineHeight: 1.5 }}>
                  <i className="fas fa-circle-info" style={{marginRight:'.35rem'}}></i> Your current URL: <strong style={{ color: 'var(--gold)' }}>undangan.example.com/wedding</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save Button (shown on all tabs) */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            style={{
              padding: '0.7rem 2rem',
              background: 'var(--gold)',
              border: 'none',
              color: 'var(--bg)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
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
            onClick={() => alert('Settings saved successfully!')}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
