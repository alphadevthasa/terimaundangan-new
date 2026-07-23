export interface EditorField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'datetime-local' | 'number' | 'select' | 'image';
  defaultValue: string;
  options?: { value: string; label: string }[];
}

export interface EditorSection {
  id: string;
  title: string;
  defaultOpen?: boolean;
  fields: EditorField[];
}

export const birthdayKidsSchema: EditorSection[] = [
  {
    id: 'cover',
    title: '1. Cover',
    defaultOpen: true,
    fields: [
      { id: 'child-nick', label: 'Nama Panggilan Anak', type: 'text', defaultValue: 'Leo' },
      { id: 'child-age', label: 'Usia (Tahun ke-)', type: 'text', defaultValue: '5' },
      { id: 'invite-text', label: 'Teks Undangan', type: 'text', defaultValue: 'Kamu Diundang!' },
      { id: 'hero-bg', label: 'Background Cover', type: 'image', defaultValue: '' },
    ],
  },
  {
    id: 'profile',
    title: '2. Profile & Pesan',
    defaultOpen: true,
    fields: [
      { id: 'child-photo', label: 'Foto Anak', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop' },
      { id: 'child-full', label: 'Nama Lengkap', type: 'text', defaultValue: 'Leonard (Leo)' },
      { id: 'opening-title', label: 'Judul Pembuka', type: 'text', defaultValue: 'Halo Teman-teman!' },
      { id: 'opening-message', label: 'Pesan Pembuka', type: 'textarea', defaultValue: 'Leo akan berulang tahun yang ke-5!<br>Kehadiran teman-teman semua akan membuat hari spesial Leo menjadi semakin bahagia.' },
    ],
  },
  {
    id: 'countdown',
    title: '3. Countdown',
    fields: [
      { id: 'party-date', label: 'Tanggal Pesta', type: 'datetime-local', defaultValue: '2026-08-15T15:00' },
    ],
  },
  {
    id: 'event',
    title: '4. Detail Acara',
    fields: [
      { id: 'event-date', label: 'Tanggal', type: 'text', defaultValue: 'Minggu, 15 Agustus 2026' },
      { id: 'event-time', label: 'Waktu', type: 'text', defaultValue: 'Pukul 15.00 WIB - Selesai' },
      { id: 'event-place', label: 'Tempat', type: 'text', defaultValue: 'Taman Bermain Ceria' },
      { id: 'event-address', label: 'Alamat', type: 'text', defaultValue: 'Jl. Pelangi Indah No. 12, Jakarta' },
      { id: 'event-maps', label: 'Link Google Maps', type: 'url', defaultValue: 'https://goo.gl/maps/contoh' },
    ],
  },
  {
    id: 'gallery',
    title: '5. Galeri',
    fields: [
      { id: 'gal-1', label: 'Foto 1', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop' },
      { id: 'gal-2', label: 'Foto 2', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1602083995893-6b71350a4d04?q=80&w=400&auto=format&fit=crop' },
      { id: 'gal-3', label: 'Foto 3', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1545042745-f092040ce2ec?q=80&w=400&auto=format&fit=crop' },
      { id: 'gal-4', label: 'Foto 4', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1628043644026-62111818f99f?q=80&w=400&auto=format&fit=crop' },
    ],
  },
  {
    id: 'gifts',
    title: '6. Tanda Kasih',
    fields: [
      { id: 'bank-name', label: 'Nama Bank', type: 'text', defaultValue: 'BCA' },
      { id: 'bank-acc', label: 'No. Rekening', type: 'text', defaultValue: '1234567890' },
      { id: 'bank-holder', label: 'Atas Nama', type: 'text', defaultValue: 'Orang Tua Leo' },
    ],
  },
  {
    id: 'closing',
    title: '7. Penutup',
    fields: [
      { id: 'closing-thanks', label: 'Teks Terima Kasih', type: 'text', defaultValue: 'Terima Kasih!' },
      { id: 'closing-fam', label: 'Tanda Tangan', type: 'text', defaultValue: 'Leo & Keluarga' },
    ],
  },
];
