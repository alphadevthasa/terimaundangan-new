import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Terima Undangan - Undangan Digital Premium',
  description: 'Template undangan pernikahan digital elegan dengan desain premium. Edit, kelola, dan bagikan undangan online Anda.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {children}
      </body>
    </html>
  );
}
