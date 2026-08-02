export interface SiteItem {
  id: string;
  name: string;
  domain: string;
  url: string;
  category: string;
  tags: string[];
  uptime: string;
  badge?: string;
  isTrusted?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
}

export const CATEGORIES = [
  "MOVIES & TV SHOWS",
  "ONLY 4K",
  "ANIME",
  "MANGA",
  "LIVE TV & SPORTS",
  "PAID",
  "AI TOOLS",
  "DOWNLOADS",
  "AD BLOCKERS",
] as const;

export interface BannerConfig {
  badgeIcon: string;
  badgeText: string;
  line1Text: string;
  line1Highlight: string;
  line2Text: string;
  line2Highlight: string;
  description: string;
  primaryBtnText: string;
  primaryBtnUrl: string;
  secondaryBtnText: string;
  secondaryBtnUrl: string;
  heroImageUrl: string;
  cardBadgeText: string;
  // PROMOTIONAL BANNER AREA FIELDS
  promoSiteName?: string;
  promoTargetUrl?: string;
  promoHashtags?: string[];
  promoHashtagsString?: string;
}

export const DEFAULT_BANNER_CONFIG: BannerConfig = {
  badgeIcon: "⚡",
  badgeText: "THE ULTIMATE STREAMING HUB",
  line1Text: "STREAM",
  line1Highlight: "Limitless.",
  line2Text: "DISCOVER",
  line2Highlight: "Endless.",
  description: "One search. Infinite entertainment. Explore the best movies, anime, series, sports and more — all in one place. No sign-up. No nonsense.",
  primaryBtnText: "EXPLORE CATEGORIES",
  primaryBtnUrl: "#browse-directory",
  secondaryBtnText: "REQUEST A SITE",
  secondaryBtnUrl: "request-modal",
  heroImageUrl: "/hero_banner.png",
  cardBadgeText: "FEATURED PROMO",
  promoSiteName: "Flixtor 4K Ultra",
  promoTargetUrl: "https://flixtor.to",
  promoHashtags: ["#4KHDR", "#NoAds", "#FastServer", "#FreeStreaming"],
  promoHashtagsString: "#4KHDR, #NoAds, #FastServer, #FreeStreaming",
};

export const BANNER_STORAGE_KEY = "allsitehub_banner_config";
export const SITES_STORAGE_KEY = "allsitehub_sites_list";

export const getBannerConfig = (): BannerConfig => {
  if (typeof window === "undefined") return DEFAULT_BANNER_CONFIG;
  try {
    const saved = localStorage.getItem(BANNER_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_BANNER_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to parse banner config", e);
  }
  return DEFAULT_BANNER_CONFIG;
};

export const saveBannerConfig = (config: BannerConfig): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("allsitehub_banner_updated"));
  } catch (e) {
    console.error("Failed to save banner config", e);
  }
};

export const getSavedSites = (): SiteItem[] => {
  if (typeof window === "undefined") return STREAMING_SITES;
  try {
    const saved = localStorage.getItem(SITES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse saved sites", e);
  }
  return STREAMING_SITES;
};

export const saveSitesToStorage = (sites: SiteItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
    window.dispatchEvent(new Event("allsitehub_sites_updated"));
  } catch (e) {
    console.error("Failed to save sites", e);
  }
};

export const getCleanDomain = (rawUrl: string): string => {
  if (!rawUrl) return "";
  return rawUrl.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
};

export const getFaviconUrl = (domainOrUrl: string): string => {
  const domain = getCleanDomain(domainOrUrl);
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

export const STREAMING_SITES: SiteItem[] = [
  {
    id: "flixtor",
    name: "Flixtor HD",
    domain: "flixtor.to",
    url: "https://flixtor.to",
    category: "MOVIES & TV SHOWS",
    tags: ["4K", "No-Ads", "Fast Player"],
    uptime: "99.9%",
    badge: "POPULAR",
    isTrusted: true,
    isFeatured: true,
  },
  {
    id: "cineby4k",
    name: "Cineby 4K Ultra",
    domain: "cineby.app",
    url: "https://cineby.app",
    category: "ONLY 4K",
    tags: ["4K HDR", "60FPS", "Dolby Atmos"],
    uptime: "99.9%",
    badge: "ULTRA 4K",
    isTrusted: true,
    isFeatured: true,
  },
  {
    id: "fbox4k",
    name: "FBox 4K Cinema",
    domain: "fbox.to",
    url: "https://fbox.to",
    category: "ONLY 4K",
    tags: ["4K UHD", "No-Ads", "Multi-Audio"],
    uptime: "99.8%",
    badge: "4K PRO",
    isTrusted: true,
    isNew: true,
  },
  {
    id: "braflix4k",
    name: "Braflix 4K Ultra",
    domain: "braflix.video",
    url: "https://braflix.video",
    category: "ONLY 4K",
    tags: ["4K HDR", "Subbed", "Fast Server"],
    uptime: "99.9%",
    badge: "4K HD",
    isTrusted: true,
  },
  {
    id: "aniwave",
    name: "AniWave Anime",
    domain: "aniwave.to",
    url: "https://aniwave.to",
    category: "ANIME",
    tags: ["Dubbed", "Subbed", "HD"],
    uptime: "99.8%",
    badge: "TOP ANIME",
    isTrusted: true,
    isNew: true,
  },
  {
    id: "mangadex",
    name: "MangaDex Portal",
    domain: "mangadex.org",
    url: "https://mangadex.org",
    category: "MANGA",
    tags: ["Manga", "Multi-Lang", "Free"],
    uptime: "99.9%",
    badge: "TOP MANGA",
    isTrusted: true,
    isFeatured: true,
  },
  {
    id: "hdtoday",
    name: "HDToday TV",
    domain: "hdtoday.tv",
    url: "https://hdtoday.tv",
    category: "MOVIES & TV SHOWS",
    tags: ["Series", "1080p", "Auto-Next"],
    uptime: "99.7%",
    isTrusted: true,
  },
  {
    id: "streameast",
    name: "StreamEast Sports",
    domain: "streameast.app",
    url: "https://streameast.app",
    category: "LIVE TV & SPORTS",
    tags: ["Live Sports", "Football", "NBA"],
    uptime: "99.9%",
    badge: "LIVE 24/7",
    isFeatured: true,
  },
  {
    id: "netflix",
    name: "Netflix Premium",
    domain: "netflix.com",
    url: "https://netflix.com",
    category: "PAID",
    tags: ["4K HDR", "Originals", "Paid"],
    uptime: "100%",
    badge: "PREMIUM",
    isTrusted: true,
  },
  {
    id: "chatgpt",
    name: "ChatGPT AI Hub",
    domain: "chatgpt.com",
    url: "https://chatgpt.com",
    category: "AI TOOLS",
    tags: ["GPT-4o", "AI Tool", "Free"],
    uptime: "99.9%",
    badge: "HOT AI",
    isTrusted: true,
    isFeatured: true,
  },
  {
    id: "fitgirl",
    name: "FitGirl Repacks",
    domain: "fitgirl-repacks.site",
    url: "https://fitgirl-repacks.site",
    category: "DOWNLOADS",
    tags: ["Games", "Repacks", "Direct"],
    uptime: "99.9%",
    isTrusted: true,
  },
  {
    id: "ublock",
    name: "uBlock Origin",
    domain: "ublockorigin.com",
    url: "https://ublockorigin.com",
    category: "AD BLOCKERS",
    tags: ["AdBlocker", "Privacy", "Open Source"],
    uptime: "100%",
    badge: "ESSENTIAL",
    isTrusted: true,
    isFeatured: true,
  },
  {
    id: "fmovies",
    name: "FMovies Official",
    domain: "fmovies.to",
    url: "https://fmovies.to",
    category: "MOVIES & TV SHOWS",
    tags: ["Movies", "HD", "Multi-Server"],
    uptime: "99.6%",
    isNew: true,
  },
  {
    id: "hianime",
    name: "HiAnime Stream",
    domain: "hianime.to",
    url: "https://hianime.to",
    category: "ANIME",
    tags: ["Uncensored", "60FPS", "Anime"],
    uptime: "99.9%",
    badge: "TRENDING",
    isNew: true,
  },
  {
    id: "viprow",
    name: "VipRow Sports",
    domain: "viprow.nu",
    url: "https://viprow.nu",
    category: "LIVE TV & SPORTS",
    tags: ["WWE", "Boxing", "Football"],
    uptime: "99.8%",
    isTrusted: true,
  },
  {
    id: "claudeai",
    name: "Claude AI Studio",
    domain: "claude.ai",
    url: "https://claude.ai",
    category: "AI TOOLS",
    tags: ["Sonnet 3.5", "AI Assistant"],
    uptime: "99.9%",
    badge: "PRO AI",
    isFeatured: true,
  },
  {
    id: "adguard",
    name: "AdGuard Protection",
    domain: "adguard.com",
    url: "https://adguard.com",
    category: "AD BLOCKERS",
    tags: ["AdBlock", "DNS", "Security"],
    uptime: "99.9%",
    isTrusted: true,
  },
];
