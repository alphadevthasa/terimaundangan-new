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

export const weddingEliteSchema: EditorSection[] = [
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
      { id: 'groom-photo', label: 'Photo URL', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
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
      { id: 'bride-photo', label: 'Photo URL', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
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
      { id: 'story-count', label: 'Jumlah Cerita', type: 'number', defaultValue: '2' },
      {
        id: 'story-slide-effect',
        label: 'Efek Slide',
        type: 'select',
        defaultValue: 'timeline',
        options: [
          { value: 'timeline', label: 'Timeline' },
          { value: 'fade', label: 'Fade In/Out' },
          { value: 'slide', label: 'Horizontal Slide' },
        ],
      },
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
      { id: 'gal-1', label: 'Photo 1 URL', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-2', label: 'Photo 2 URL', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-3', label: 'Photo 3 URL', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-4', label: 'Photo 4 URL', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-5', label: 'Photo 5 URL', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80' },
      { id: 'gal-6', label: 'Photo 6 URL', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80' },
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
    id: 'backgrounds',
    title: '12. Backgrounds',
    fields: [
      { id: 'hero-bg', label: 'Hero / Cover Background', type: 'image', defaultValue: '' },
      { id: 'couple-bg', label: 'Couple Section Background', type: 'image', defaultValue: '' },
      { id: 'story-bg', label: 'Story Section Background', type: 'image', defaultValue: '' },
      { id: 'gallery-bg', label: 'Gallery Section Background', type: 'image', defaultValue: '' },
      { id: 'gifts-bg', label: 'Gifts Section Background', type: 'image', defaultValue: '' },
      { id: 'wishes-bg', label: 'Wishes Section Background', type: 'image', defaultValue: '' },
    ],
  },
  {
    id: 'stream',
    title: '13. Live Stream',
    fields: [
      { id: 'stream-title', label: 'Stream Title', type: 'text', defaultValue: 'Virtual Wedding' },
      { id: 'stream-desc', label: 'Stream Description', type: 'textarea', defaultValue: 'For friends and family who cannot attend physically.' },
    ],
  },
  {
    id: 'wishes',
    title: '14. Wishes',
    fields: [
      { id: 'wishes-title', label: 'Wishes Title', type: 'text', defaultValue: 'Guest Book' },
      { id: 'wishes-desc', label: 'Wishes Description', type: 'textarea', defaultValue: 'Leave your warmest wishes and blessings for our marriage.' },
    ],
  },
  {
    id: 'closing',
    title: '15. Closing',
    fields: [
      { id: 'closing-thanks', label: 'Thank You Text', type: 'text', defaultValue: 'Terima Kasih' },
      { id: 'closing-fam', label: 'Family Signatures', type: 'text', defaultValue: 'The Pierce & Laurent Families' },
    ],
  },
];
