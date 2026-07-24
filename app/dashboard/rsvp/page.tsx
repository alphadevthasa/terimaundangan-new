'use client';

import { useState, useEffect } from 'react';

interface Rsvp {
  id: string;
  name: string;
  status: string;
  guestCount: number;
  message: string;
  createdAt: string;
}

interface FetchResponse {
  rsvps: Rsvp[];
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

const statusBadge = (s: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '.3rem',
  padding: '.2rem .55rem',
  borderRadius: '99px',
  fontSize: '.72rem',
  fontWeight: 500,
  background: s === 'hadir' ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.1)',
  color: s === 'hadir' ? '#34d399' : '#ef4444',
  border: '1px solid ' + (s === 'hadir' ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.15)'),
});

export default function DashboardRsvpPage() {
  const [templateDataId, setTemplateDataId] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

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

  const fetchRsvps = () => {
    if (!templateDataId) return;
    setLoading(true);
    const params = new URLSearchParams({ limit: String(LIMIT), page: String(page), templateDataId });
    if (search) params.set('search', search);
    if (filterStatus) params.set('status', filterStatus);
    fetch(`/api/rsvp?${params}`)
      .then(r => r.json())
      .then((d: FetchResponse) => {
        setRsvps(d.rsvps || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 0);
        setLoading(false);
      })
      .catch(() => { setError('Gagal memuat data RSVP'); setLoading(false); });
  };

  useEffect(() => {
    fetchRsvps();
  }, [templateDataId, page, search, filterStatus]);

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
    if (!confirm('Hapus data RSVP ini?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/rsvp/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Gagal menghapus');
        return;
      }
      fetchRsvps();
    } catch {
      alert('Gagal menghapus data RSVP');
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
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const hadirCount = rsvps.filter(r => r.status === 'hadir').reduce((s, r) => s + r.guestCount, 0);
  const tidakCount = rsvps.filter(r => r.status === 'tidak').length;

  const startItem = total > 0 ? (page - 1) * LIMIT + 1 : 0;
  const endItem = Math.min(page * LIMIT, total);

  if (!templateDataId && !error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'var(--cream-dim)', fontSize: '.85rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--muted)' }}><i className="fas fa-clipboard-list"></i></div>
          <p>Memuat data undangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.6rem', fontWeight: 400,
          color: 'var(--cream)', marginBottom: '0.3rem', fontStyle: 'italic',
        }}>
          Kelola RSVP
        </h2>
        <p style={{ fontSize: '.85rem', color: 'var(--cream-dim)' }}>
          {loading ? 'Memuat...' : `${total} konfirmasi`}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ ...card, padding: '1rem 1.25rem', flex: 1, minWidth: '120px' }}>
          <div style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', marginBottom: '.35rem' }}>Total</div>
          <div style={{ fontSize: '1.5rem', color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{total}</div>
        </div>
        <div style={{ ...card, padding: '1rem 1.25rem', flex: 1, minWidth: '120px' }}>
          <div style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', marginBottom: '.35rem' }}>Hadir</div>
          <div style={{ fontSize: '1.5rem', color: '#34d399', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{hadirCount}</div>
        </div>
        <div style={{ ...card, padding: '1rem 1.25rem', flex: 1, minWidth: '120px' }}>
          <div style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', marginBottom: '.35rem' }}>Tidak Hadir</div>
          <div style={{ fontSize: '1.5rem', color: '#ef4444', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{tidakCount}</div>
        </div>
      </div>

      {/* Filter + Search */}
      <div style={{ ...card, marginBottom: '1rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '.75rem' }}>
          <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Filter:</span>
          <button onClick={() => { setFilterStatus(''); setPage(1); }}
            style={{
              padding: '.35rem .65rem', borderRadius: '99px', fontSize: '.75rem', cursor: 'pointer',
              background: !filterStatus ? 'rgba(201,169,97,0.12)' : 'transparent',
              border: '1px solid ' + (!filterStatus ? 'rgba(201,169,97,0.3)' : 'var(--line)'),
              color: !filterStatus ? 'var(--gold)' : 'var(--cream-dim)',
              transition: 'all .15s',
            }}
          >Semua</button>
          <button onClick={() => { setFilterStatus('hadir'); setPage(1); }}
            style={{
              padding: '.35rem .65rem', borderRadius: '99px', fontSize: '.75rem', cursor: 'pointer',
              background: filterStatus === 'hadir' ? 'rgba(34,197,94,.12)' : 'transparent',
              border: '1px solid ' + (filterStatus === 'hadir' ? 'rgba(34,197,94,.2)' : 'var(--line)'),
              color: filterStatus === 'hadir' ? '#34d399' : 'var(--cream-dim)',
              transition: 'all .15s',
            }}
          >Hadir</button>
          <button onClick={() => { setFilterStatus('tidak'); setPage(1); }}
            style={{
              padding: '.35rem .65rem', borderRadius: '99px', fontSize: '.75rem', cursor: 'pointer',
              background: filterStatus === 'tidak' ? 'rgba(239,68,68,.1)' : 'transparent',
              border: '1px solid ' + (filterStatus === 'tidak' ? 'rgba(239,68,68,.15)' : 'var(--line)'),
              color: filterStatus === 'tidak' ? '#ef4444' : 'var(--cream-dim)',
              transition: 'all .15s',
            }}
          >Tidak Hadir</button>
        </div>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '.5rem' }}>
          <input type="text" placeholder="Cari nama..." value={searchInput} onChange={e => setSearchInput(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          {searchInput && (
            <button type="button" onClick={handleSearchClear}
              style={{
                background: 'var(--bg-3)', border: '1px solid var(--line)', color: 'var(--cream-dim)',
                padding: '.6rem .75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '.78rem',
              }}
            ><i className="fas fa-xmark"></i></button>
          )}
          <button type="submit"
            style={{
              background: 'var(--gold)', border: 'none', color: 'var(--bg)',
              padding: '.6rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '.78rem', fontWeight: 500,
            }}
          >Cari</button>
        </form>
      </div>

      {error ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>
      ) : loading ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'var(--cream-dim)', fontSize: '.85rem' }}>Loading...</div>
      ) : !rsvps.length ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: 'var(--cream-dim)', fontSize: '.85rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--muted)' }}><i className="fas fa-clipboard-list"></i></div>
          {search || filterStatus ? 'Tidak ada data yang cocok' : 'Belum ada konfirmasi kehadiran.'}
        </div>
      ) : (
        <>
          <div style={card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Nama</th>
                    <th style={th}>Status</th>
                    <th style={th}>Jumlah Tamu</th>
                    <th style={th}>Pesan</th>
                    <th style={th}>Tanggal</th>
                    <th style={{ ...th, textAlign: 'right', width: '80px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map(r => (
                    <tr key={r.id}>
                      <td style={{ ...td, fontWeight: 500, color: 'var(--gold)' }}>{r.name}</td>
                      <td style={td}><span style={statusBadge(r.status)}>{r.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}</span></td>
                      <td style={{ ...td, fontSize: '.85rem' }}>{r.guestCount} {r.guestCount > 1 ? 'orang' : 'orang'}</td>
                      <td style={{ ...td, maxWidth: '250px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '.78rem', color: 'var(--muted)' }}>
                        {r.message || '—'}
                      </td>
                      <td style={{ ...td, whiteSpace: 'nowrap', fontSize: '.75rem', color: 'var(--muted)' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td style={{ ...td, textAlign: 'right' }}>
                        <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id}
                          style={{
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                            color: '#ef4444', padding: '.4rem .75rem', borderRadius: 'var(--radius-sm)',
                            cursor: deleting === r.id ? 'not-allowed' : 'pointer', fontSize: '.75rem',
                            opacity: deleting === r.id ? 0.5 : 1, transition: 'all .15s',
                          }}
                          onMouseEnter={e => { if (deleting !== r.id) e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                        >{deleting === r.id ? '...' : 'Hapus'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div style={{ ...card, marginTop: '1rem', padding: '.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.75rem' }}>
              <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{startItem}–{endItem} dari {total}</span>
              <div style={{ display: 'flex', gap: '.35rem', alignItems: 'center' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  style={{ ...pageBtn, opacity: page <= 1 ? 0.35 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (page > 1) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
                >‹</button>
                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} style={{ color: 'var(--muted)', fontSize: '.78rem', padding: '0 .2rem' }}>…</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p)} style={p === page ? pageBtnActive : pageBtn}
                      onMouseEnter={e => { if (p !== page) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; } }}
                      onMouseLeave={e => { if (p !== page) { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; } }}
                    >{p}</button>
                  )
                )}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  style={{ ...pageBtn, opacity: page >= totalPages ? 0.35 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (page < totalPages) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
                >›</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
