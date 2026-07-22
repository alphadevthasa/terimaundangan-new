'use client';

import { useState, useEffect } from 'react';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface FetchResponse {
  wishes: Wish[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 25;

const card: React.CSSProperties = {
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius)',
  padding: '1.5rem',
};

const th: React.CSSProperties = {
  padding: '.7rem .85rem',
  textAlign: 'left',
  fontSize: '.72rem',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  color: 'var(--muted)',
  borderBottom: '1px solid var(--line)',
};

const td: React.CSSProperties = {
  padding: '.7rem .85rem',
  fontSize: '.82rem',
  borderBottom: '1px solid var(--line-light)',
  color: 'var(--cream-dim)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '.6rem .75rem',
  background: 'var(--bg)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--cream)',
  fontSize: '.82rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const pageBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--line)',
  color: 'var(--cream-dim)',
  padding: '.45rem .75rem',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  fontSize: '.78rem',
  transition: 'all .15s',
  minWidth: '34px',
  textAlign: 'center',
};

const pageBtnActive: React.CSSProperties = {
  ...pageBtn,
  background: 'rgba(201,169,97,0.12)',
  borderColor: 'rgba(201,169,97,0.3)',
  color: 'var(--gold)',
};

export default function DashboardWishesPage() {
  const [templateDataId, setTemplateDataId] = useState<string | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch template data ID from customer
  useEffect(() => {
    fetch('/api/customer')
      .then(r => r.json())
      .then(data => {
        const c = data.customer;
        if (c?.templateData?.[0]?.id) {
          setTemplateDataId(c.templateData[0].id);
        }
      })
      .catch(() => setError('Gagal memuat data undangan'));
  }, []);

  const fetchWishes = () => {
    if (!templateDataId) return;
    setLoading(true);
    const params = new URLSearchParams({ limit: String(LIMIT), page: String(page), templateDataId });
    if (search) params.set('search', search);
    fetch(`/api/wishes?${params}`)
      .then(r => r.json())
      .then((d: FetchResponse) => {
        setWishes(d.wishes || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 0);
        setLoading(false);
      })
      .catch(() => { setError('Gagal memuat ucapan'); setLoading(false); });
  };

  // Fetch wishes when templateDataId, page, or search changes
  useEffect(() => {
    fetchWishes();
  }, [templateDataId, page, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus ucapan ini? Tindakan ini tidak bisa dibatalkan.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/wishes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Gagal menghapus');
        return;
      }
      fetchWishes();
    } catch {
      alert('Gagal menghapus ucapan');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = total > 0 ? (page - 1) * LIMIT + 1 : 0;
  const endItem = Math.min(page * LIMIT, total);

  if (!templateDataId && !error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'var(--cream-dim)', fontSize: '.85rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🫶</div>
          <p>Memuat data undangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.6rem', fontWeight: 400,
          color: 'var(--cream)', marginBottom: '0.3rem', fontStyle: 'italic',
        }}>
          Guest Wishes
        </h2>
        <p style={{ fontSize: '.85rem', color: 'var(--cream-dim)' }}>
          {loading ? 'Memuat...' : `${total} ucapan dari tamu`}
        </p>
      </div>

      {/* Search */}
      <div style={{ ...card, marginBottom: '1rem', padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '.5rem' }}>
          <input
            type="text"
            placeholder="Cari nama atau pesan..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          {searchInput && (
            <button type="button" onClick={handleSearchClear}
              style={{
                background: 'var(--bg-3)',
                border: '1px solid var(--line)',
                color: 'var(--cream-dim)',
                padding: '.6rem .75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '.78rem',
              }}
            >
              ✕
            </button>
          )}
          <button type="submit"
            style={{
              background: 'var(--gold)',
              border: 'none',
              color: 'var(--bg)',
              padding: '.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '.78rem',
              fontWeight: 500,
            }}
          >
            Cari
          </button>
        </form>
      </div>

      {/* Content */}
      {error ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
      ) : loading ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'var(--cream-dim)', fontSize: '.85rem' }}>Loading...</div>
      ) : !wishes.length ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'var(--cream-dim)', fontSize: '.85rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🫶</div>
          {search ? 'Tidak ada ucapan yang cocok' : 'Belum ada ucapan dari tamu. Bagikan tautan undangan untuk mulai menerima ucapan!'}
        </div>
      ) : (
        <>
          <div style={card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Nama</th>
                    <th style={th}>Pesan</th>
                    <th style={th}>Tanggal</th>
                    <th style={{ ...th, textAlign: 'right', width: '80px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {wishes.map(w => (
                    <tr key={w.id}>
                      <td style={{ ...td, fontWeight: 500, color: 'var(--gold)' }}>{w.name}</td>
                      <td style={{ ...td, maxWidth: '400px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {w.message.length > 120 ? w.message.slice(0, 120) + '...' : w.message}
                      </td>
                      <td style={{ ...td, whiteSpace: 'nowrap', fontSize: '.75rem', color: 'var(--muted)' }}>
                        {formatDate(w.createdAt)}
                      </td>
                      <td style={{ ...td, textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(w.id)}
                          disabled={deleting === w.id}
                          style={{
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.15)',
                            color: '#ef4444',
                            padding: '.4rem .75rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: deleting === w.id ? 'not-allowed' : 'pointer',
                            fontSize: '.75rem',
                            opacity: deleting === w.id ? 0.5 : 1,
                            transition: 'all .15s',
                          }}
                          onMouseEnter={e => {
                            if (deleting !== w.id) {
                              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                            }
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                          }}
                        >
                          {deleting === w.id ? '...' : 'Hapus'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              ...card,
              marginTop: '1rem',
              padding: '.85rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '.75rem',
            }}>
              <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                {startItem}–{endItem} dari {total}
              </span>
              <div style={{ display: 'flex', gap: '.35rem', alignItems: 'center' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{
                    ...pageBtn,
                    opacity: page <= 1 ? 0.35 : 1,
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => { if (page > 1) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
                >
                  ‹
                </button>
                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} style={{ color: 'var(--muted)', fontSize: '.78rem', padding: '0 .2rem' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={p === page ? pageBtnActive : pageBtn}
                      onMouseEnter={e => {
                        if (p !== page) {
                          e.currentTarget.style.borderColor = 'var(--gold)';
                          e.currentTarget.style.color = 'var(--gold)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (p !== page) {
                          e.currentTarget.style.borderColor = 'var(--line)';
                          e.currentTarget.style.color = 'var(--cream-dim)';
                        }
                      }}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={{
                    ...pageBtn,
                    opacity: page >= totalPages ? 0.35 : 1,
                    cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => { if (page < totalPages) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
