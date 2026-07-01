import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mahadev Holidays | Travel Itinerary Builder",
  description: "Luxury Travel Package & Itinerary Document Generator - Premium Edition",
  appleWebApp: {
    capable: true,
    title: "Mahadev Holidays",
    statusBarStyle: "default",
 },
  icons: {
    apple: "/icons/icon-512.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="theme-color" content="#0a2540" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mahadev Holidays" />
        <link rel="apple-touch-icon" href="/icons/icon-512.svg" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" sizes="192x192" />
        <link rel="apple-touch-startup-image" href="/logo.jpg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
