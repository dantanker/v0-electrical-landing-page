import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://voltguard.com'),
  title: 'VoltGuard Electrical | Power Done Right | Chicago Suburbs',
  description: 'Safely powering Chicagoland homes and businesses for 20+ years. Serving Arlington Heights, Schaumburg, Palatine & Hoffman Estates. Call (555) 019-2834.',
  generator: 'v0.app',
  keywords: ['emergency electrician', 'Chicago electrician', 'Arlington Heights electrician', 'Schaumburg electrician', '24/7 electrical service'],
  openGraph: {
    title: 'VoltGuard Electrical | Power Done Right',
    description: 'Safely powering Chicagoland homes and businesses for 20+ years.',
    type: 'website',
    images: [
      {
        url: '/voltguard-logo-white-no-tagline.png',
        width: 1280,
        height: 384,
        alt: 'VoltGuard Electrical',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoltGuard Electrical | Power Done Right',
    description: 'Keeping Chicagoland Powered Safely—Trusted by Thousands for Over 20 Years.',
    images: ['/voltguard-logo-white-no-tagline.png'],
  },
  icons: {
    icon: [
      {
        url: '/voltguard-logo-white-no-tagline.png',
        type: 'image/png',
      },
    ],
    apple: '/voltguard-logo-white-no-tagline.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body className="font-sans antialiased bg-[#0f172a]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
