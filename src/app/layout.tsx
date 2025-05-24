import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://innowood.vercel.app'),
  title: {
    default: 'Innowood - Custom Keychains & Accessories',
    template: '%s | Innowood'
  },
  description: 'Discover unique and personalized keychains at Innowood. Custom designs, high-quality materials, and exceptional craftsmanship.',
  keywords: ['keychains', 'custom keychains', 'personalized accessories', 'gifts', 'Innowood'],
  openGraph: {
    title: 'Innowood - Custom Keychains & Accessories',
    description: 'Discover unique and personalized keychains at Innowood. Custom designs, high-quality materials, and exceptional craftsmanship.',
    url: 'https://innowood.vercel.app',
    siteName: 'Innowood',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innowood - Custom Keychains & Accessories',
    description: 'Discover unique and personalized keychains at Innowood. Custom designs, high-quality materials, and exceptional craftsmanship.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
