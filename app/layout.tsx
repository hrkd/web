import '../styles/globals.scss';
import ParticleBackground from '@/components/ParticleBackground';
import { PT_Sans } from 'next/font/google';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HRKD.NET',
  description: 'HRKD.NET - Portfolio',
  openGraph: {
    title: 'HRKD.NET',
    description: 'HRKD.NET - Portfolio',
    url: 'https://hrkd.net',
    siteName: 'HRKD.NET',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HRKD.NET',
    description: 'HRKD.NET - Portfolio',
  },
};

const ptSans = PT_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={ptSans.variable}>
      <body>
        <ParticleBackground />
        {children}
      </body>
    </html>
  );
}
