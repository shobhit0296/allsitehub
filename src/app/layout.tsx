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
  metadataBase: new URL("https://allsitehub.online"),
  title: {
    default: "AllSiteHub — Discover 50,000+ Free Streaming, Anime, Movies & Web Portals",
    template: "%s | AllSiteHub",
  },
  description:
    "AllSiteHub is the ultimate curated web directory for free streaming sites, anime portals, 4K movies, live TV & sports, AI tools, developer utilities, and ad blockers.",
  keywords: [
    "streaming sites",
    "free movie sites",
    "anime streaming",
    "free anime watch",
    "live sports streams",
    "4K movie sites",
    "manga online",
    "AI tools directory",
    "best ad blockers",
    "allsitehub",
    "allsitehub.online",
    "web directory",
    "streaming hub",
    "free streaming portal",
  ],
  authors: [{ name: "AllSiteHub Team", url: "https://allsitehub.online" }],
  creator: "AllSiteHub",
  publisher: "AllSiteHub",
  category: "technology",
  alternates: {
    canonical: "https://allsitehub.online",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://allsitehub.online",
    siteName: "AllSiteHub",
    title: "AllSiteHub — Discover 50,000+ Free Streaming, Anime, Movies & Web Portals",
    description:
      "Explore the ultimate directory of verified streaming portals, anime hubs, 4K movies, live sports, AI tools & developer utilities.",
    images: [
      {
        url: "https://allsitehub.online/hero_banner.png",
        width: 1200,
        height: 630,
        alt: "AllSiteHub - The Ultimate Web & Streaming Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AllSiteHub — Discover 50,000+ Free Streaming, Anime, Movies & Web Portals",
    description:
      "Explore the ultimate directory of verified streaming portals, anime hubs, 4K movies, live sports, AI tools & developer utilities.",
    images: ["https://allsitehub.online/hero_banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#05050c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
