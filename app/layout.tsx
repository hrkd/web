import '../styles/globals.scss';
import ParticleBackground from '@/components/ParticleBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ParticleBackground />
        {children}
      </body>
    </html>
  );
}
