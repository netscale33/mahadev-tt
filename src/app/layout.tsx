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
    apple: "/logo.jpg",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0a2540" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mahadev Holidays" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="apple-touch-startup-image" href="/logo.jpg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
