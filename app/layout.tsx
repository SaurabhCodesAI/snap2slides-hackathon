// app/layout.tsx
// This file defines the main HTML structure and integrates the Auth0 provider.

import './globals.css'; // Importing global styles.
import AuthProvider from './auth-provider'; // Import our custom Auth0 Provider component.
import { Inter, JetBrains_Mono } from "next/font/google"; // For typography.
import { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import StructuredData from '@/components/seo/StructuredData';

// Initialize fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Enhanced metadata for SEO and social sharing
export const metadata: Metadata = {
  title: {
    default: 'Snap2Slides: AI-Powered Presentation Generator',
    template: '%s | Snap2Slides'
  },
  description: 'Transform your notes, screenshots, and ideas into professional presentations using advanced AI. Create PowerPoint slides or interactive web presentations in seconds.',
  keywords: [
    'AI presentation generator',
    'PowerPoint creator',
    'slide generator',
    'presentation maker',
    'AI slides',
    'automated presentations',
    'screenshot to slides',
    'notes to presentation'
  ],
  authors: [{ name: 'Snap2Slides Team' }],
  creator: 'Snap2Slides',
  publisher: 'Snap2Slides',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://snap2slides.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Snap2Slides: AI-Powered Presentation Generator',
    description: 'Transform your notes, screenshots, and ideas into professional presentations using advanced AI.',
    siteName: 'Snap2Slides',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Snap2Slides - AI Presentation Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snap2Slides: AI-Powered Presentation Generator',
    description: 'Transform your notes, screenshots, and ideas into professional presentations using advanced AI.',
    images: ['/og-image.png'],
    creator: '@snap2slides',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// The root layout component wraps all page content and provides Auth0 context.
export default function RootLayout({
  children, // Content from child components (like app/page.tsx)
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="antialiased font-sans">
        <StructuredData />
        <ErrorBoundary>
          {/* AuthProvider makes user authentication state available throughout the app. */}
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
            },
          }}
        />
      </body>
    </html>
  );
}