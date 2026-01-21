import '../styles/globals.scss';
import ParticleBackground from '@/components/ParticleBackground';
import { PT_Sans } from 'next/font/google';

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
