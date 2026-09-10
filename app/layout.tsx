import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import CursorEffect from '@/components/CursorEffect';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mahsan.dev'),
  title: {
    default: 'M.Ahsan — Web Development · AI Chatbots · AI Voice Agents',
    template: '%s | M.Ahsan',
  },
  description:
    'M.Ahsan is a developer specialising in web development, AI chatbots, and AI voice agents. Available for client work.',
  keywords: ['web development', 'AI chatbots', 'AI voice agents', 'M.Ahsan', 'portfolio'],
  authors: [{ name: 'M.Ahsan', url: 'https://mahsan.dev' }],
  creator: 'M.Ahsan',
  openGraph: {
    title: 'M.Ahsan — Web Development · AI Chatbots · AI Voice Agents',
    description: 'M.Ahsan — developer specialising in web development, AI chatbots, and AI voice agents.',
    type: 'website',
    url: 'https://mahsan.dev',
    siteName: 'M.Ahsan Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M.Ahsan — Web Development · AI Chatbots · AI Voice Agents',
    description: 'M.Ahsan — developer specialising in web development, AI chatbots, and AI voice agents.',
    creator: '@mahsan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Global ambient components */}
        <GrainOverlay />
        <CursorEffect />

        {/* Sticky navigation (hidden on /admin routes) */}
        <Navbar />

        {/* Page content with transition wrapper */}
        <PageTransition>
          <div style={{ minHeight: '100vh' }}>
            {children}
          </div>
        </PageTransition>

        {/* Footer (hidden on /admin routes) */}
        <Footer />
      </body>
    </html>
  );
}