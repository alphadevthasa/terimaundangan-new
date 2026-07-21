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

export default function ListTemplatePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<StaticTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/static-templates');
      const data = await res.json();
      if (data.templates) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid var(--line)',
            borderTop: '2px solid var(--gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem' }}>Loading templates...</p>
        </div>
      </div>
    );
  }

  const priceColors: Record<string, string> = {
    Free: '#34d399',
    Premium: '#f59e0b',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        className="animate-fadeIn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <div>
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
              marginBottom: '0.75rem',
            }}
          >
            <i className="fas fa-list" style={{fontSize:'.7rem',marginRight:'.35rem'}}></i> {templates.length} Template{templates.length !== 1 ? 's' : ''} Registered
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.8rem',
              fontWeight: 400,
              color: 'var(--cream)',
              fontStyle: 'italic',
            }}
          >
            Your Templates
          </h2>
        </div>
      </div>

      {templates.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><i className="fas fa-inbox"></i></div>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem',
              color: 'var(--cream-dim)',
              marginBottom: '0.5rem',
              fontStyle: 'italic',
            }}
          >
            No Templates Yet
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Create your first template to get started.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {templates.map((template, index) => {
            const iconMap: Record<string, string> = {
              wedding: 'fas fa-heart',
              birthday: 'fas fa-cake-candles',
              corporate: 'fas fa-building',
            };
            const icon = iconMap[template.type] || 'fas fa-file';

            return (
              <div
                key={template.id}
                className="animate-fadeIn"
                style={{
                  background: 'var(--bg-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animationDelay: `${index * 0.08}s`,
                }}
                onClick={() => router.push(`/dashboard/list-template/${template.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Template Preview Area */}
                <div
                  style={{
                    height: '160px',
                    background: 'linear-gradient(135deg, #0a0807 0%, #1a1611 50%, #0a0807 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderBottom: '1px solid var(--line)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ fontSize: '3.5rem', opacity: 0.6 }}><i className={icon}></i></div>

                  {/* Price Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '100px',
                      background: `${priceColors[template.price] || '#6b7280'}15`,
                      border: `1px solid ${priceColors[template.price] || '#6b7280'}30`,
                      color: priceColors[template.price] || '#6b7280',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {template.price}
                  </div>

                  {template.isPopular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '100px',
                        background: 'rgba(201, 169, 97, 0.15)',
                        border: '1px solid rgba(201, 169, 97, 0.3)',
                        color: 'var(--gold)',
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      <i className="fas fa-star" style={{fontSize:'.6rem',marginRight:'.25rem'}}></i> Popular
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div style={{ padding: '1.25rem' }}>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.2rem',
                      color: 'var(--gold)',
                      marginBottom: '0.5rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {template.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--cream-dim)',
                      lineHeight: 1.5,
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {template.description || 'No description'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{template.type}</span>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--line-light)',
                    }}
                  >
                    <button
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'var(--gold)',
                        border: 'none',
                        color: 'var(--bg)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/list-template/${template.id}`);
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-light)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'transparent',
                        border: '1px solid var(--line)',
                        color: 'var(--cream-dim)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/kelola-template?id=${template.id}`);
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,169,97,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
