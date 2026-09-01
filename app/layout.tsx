import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Titan Garage Door Repairs',
  description: 'Scaffold. Prompt 5 owns the real shell and metadata.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
