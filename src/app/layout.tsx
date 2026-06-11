import type { Metadata } from 'next';
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-primary' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-secondary' });
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '700', variable: '--font-dancing' });
export const metadata: Metadata = {
  title: 'Happy Birthday! 🎂❤️',
  description: 'A personalized digital scrapbook and birthday gift crafted with love.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${dancingScript.variable}`}>{children}</body>
    </html>
  );
}
