import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Fragment_Mono, Caveat } from 'next/font/google';
import { getSiteContent } from '@/lib/site-content';
import { SiteCopyProvider } from '@/components/SiteCopyProvider';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import './globals.css';

/* Zodiak (Indian Type Foundry, Fontshare free license) — the high-contrast
   editorial serif whose italic carries the whole identity. */
const serif = localFont({
  src: [
    { path: './fonts/zodiak-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/zodiak-400i.woff2', weight: '400', style: 'italic' },
    { path: './fonts/zodiak-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/zodiak-700i.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--font-zodiak',
  display: 'swap',
});

/* General Sans (ITF/Fontshare) — warm, confident grotesk for body + UI. */
const sans = localFont({
  src: [
    { path: './fonts/gs-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/gs-400i.woff2', weight: '400', style: 'italic' },
    { path: './fonts/gs-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/gs-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-gs',
  display: 'swap',
});

const mono = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-frag',
});

const script = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: {
    default: 'Cherry Phan — Product & UX Designer',
    template: '%s — Cherry Phan',
  },
  description:
    'Design with empathy. Cherry Phan is a product & UX designer at SCAD who designs for slowness — memory, ritual, and the small moments we usually rush past.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { copy } = getSiteContent();

  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${script.variable}`}
    >
      <body>
        <SiteCopyProvider copy={copy}>
          <Nav />
          {/* Nav is fixed (h-16); pages start below it */}
          <div className="pt-16">{children}</div>
          <Footer />
        </SiteCopyProvider>
      </body>
    </html>
  );
}
