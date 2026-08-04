import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
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
    "allsitehub",
    "all site hub",
    "all site",
    "all sitehub",
    "sithub",
    "allsite",
    "allsite hub",
    "allsitehub.online",
    "all site hub online",
    "sitehub",
    "site hub",
    "all sites hub",
    "allsiteshub",
    "all-site-hub",
    "all-sitehub",
    "all sites",
    "allsites",
    "sithub.online",
    "allsite.online",
    "all-site",
    "allsitehub website",
    "allsitehub link",
    "allsitehub official",
    "allsitehub app",
    "all site directory",
    "allsite streaming",
    "all site hub streaming",
    "all site hub movies",
    "all site hub anime",
    "all site hub website",
    "sithub streaming",
    "sithub movies",
    "sithub anime",
    "sithub link",
    "streaming sites",
    "free movie sites",
    "anime streaming",
    "free anime watch",
    "live sports streams",
    "4K movie sites",
    "manga online",
    "AI tools directory",
    "best ad blockers",
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-Y9YK97MC2L";

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
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}
