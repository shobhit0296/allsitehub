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
  "APPS",
  "AI TOOLS",
  "DOWNLOADS",
  "AD BLOCKERS",
] as const;

export interface FeaturedPromo {
  id: string;
  enabled: boolean;
  siteName: string;
  tagline?: string;
  targetUrl: string;
  heroImageUrl: string;
  badgeText: string;
  buttonText: string;
  buttonIcon?: string;
  hashtags: string[];
  createdAt?: number;
}

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
  promoEnabled?: boolean;
  promoSiteName?: string;
  promoTagline?: string;
  promoTargetUrl?: string;
  promoHashtags?: string[];
  promoHashtagsString?: string;
  promoButtonText?: string;
  promoButtonIcon?: string;
  // Scalable future-proofing multi-promo storage
  promosList?: FeaturedPromo[];
  activePromoId?: string;
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
  promoEnabled: true,
  promoSiteName: "PantyFlix Ultra",
  promoTagline: "Anime • Series • Movies & More. Endless Entertainment, Limitless Stories.",
  promoTargetUrl: "https://pantyflix.org",
  promoHashtags: ["#Anime", "#Series", "#Movies", "#HDQuality", "#FastStreaming"],
  promoHashtagsString: "#Anime, #Series, #Movies, #HDQuality, #FastStreaming",
  promoButtonText: "Visit",
  promoButtonIcon: "↗",
  promosList: [
    {
      id: "promo-default-1",
      enabled: true,
      siteName: "PantyFlix Ultra",
      tagline: "Anime • Series • Movies & More. Endless Entertainment, Limitless Stories.",
      targetUrl: "https://pantyflix.org",
      heroImageUrl: "/hero_banner.png",
      badgeText: "FEATURED PROMO",
      buttonText: "Visit",
      buttonIcon: "↗",
      hashtags: ["#Anime", "#Series", "#Movies", "#HDQuality", "#FastStreaming"],
      createdAt: 1700000000000,
    },
  ],
  activePromoId: "promo-default-1",
};

export const BANNER_STORAGE_KEY = "allsitehub_banner_config_v3";
export const SITES_STORAGE_KEY = "allsitehub_sites_list_v3";

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
      if (Array.isArray(parsed) && parsed.length > 0) {
        const savedDomainMap = new Map(parsed.map((s: SiteItem) => [s.domain ? s.domain.toLowerCase() : '', s]));
        const merged = [...parsed];
        for (const defaultSite of STREAMING_SITES) {
          if (defaultSite.domain && !savedDomainMap.has(defaultSite.domain.toLowerCase())) {
            merged.push(defaultSite);
          }
        }
        return merged;
      }
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
    "id": "flixtor",
    "name": "Flixtor HD",
    "domain": "flixtor.to",
    "url": "https://flixtor.to",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "4K",
      "No-Ads",
      "Fast Player"
    ],
    "uptime": "99.9%",
    "badge": "POPULAR",
    "isTrusted": true,
    "isFeatured": true
  },
  {
    "id": "cineby4k",
    "name": "Cineby 4K Ultra",
    "domain": "cineby.app",
    "url": "https://cineby.app",
    "category": "ONLY 4K",
    "tags": [
      "4K HDR",
      "60FPS",
      "Dolby Atmos"
    ],
    "uptime": "99.9%",
    "badge": "ULTRA 4K",
    "isTrusted": true,
    "isFeatured": true
  },
  {
    "id": "fbox4k",
    "name": "FBox 4K Cinema",
    "domain": "fbox.to",
    "url": "https://fbox.to",
    "category": "ONLY 4K",
    "tags": [
      "4K UHD",
      "No-Ads",
      "Multi-Audio"
    ],
    "uptime": "99.8%",
    "badge": "4K PRO",
    "isTrusted": true,
    "isNew": true
  },
  {
    "id": "braflix4k",
    "name": "Braflix 4K Ultra",
    "domain": "braflix.video",
    "url": "https://braflix.video",
    "category": "ONLY 4K",
    "tags": [
      "4K HDR",
      "Subbed",
      "Fast Server"
    ],
    "uptime": "99.9%",
    "badge": "4K HD",
    "isTrusted": true
  },
  {
    "id": "aniwave",
    "name": "AniWave Anime",
    "domain": "aniwave.to",
    "url": "https://aniwave.to",
    "category": "ANIME",
    "tags": [
      "Dubbed",
      "Subbed",
      "HD"
    ],
    "uptime": "99.8%",
    "badge": "TOP ANIME",
    "isTrusted": true,
    "isNew": true
  },
  {
    "id": "mangadex",
    "name": "MangaDex Portal",
    "domain": "mangadex.org",
    "url": "https://mangadex.org",
    "category": "MANGA",
    "tags": [
      "Manga",
      "Multi-Lang",
      "Free"
    ],
    "uptime": "99.9%",
    "badge": "TOP MANGA",
    "isTrusted": true,
    "isFeatured": true
  },
  {
    "id": "hdtoday",
    "name": "HDToday TV",
    "domain": "hdtoday.tv",
    "url": "https://hdtoday.tv",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Series",
      "1080p",
      "Auto-Next"
    ],
    "uptime": "99.7%",
    "isTrusted": true
  },
  {
    "id": "streameast",
    "name": "StreamEast Sports",
    "domain": "streameast.app",
    "url": "https://streameast.app",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "Live Sports",
      "Football",
      "NBA"
    ],
    "uptime": "99.9%",
    "badge": "LIVE 24/7",
    "isFeatured": true
  },
  {
    "id": "netflix",
    "name": "Netflix Premium",
    "domain": "netflix.com",
    "url": "https://netflix.com",
    "category": "PAID",
    "tags": [
      "4K HDR",
      "Originals",
      "Paid"
    ],
    "uptime": "100%",
    "badge": "PREMIUM",
    "isTrusted": true
  },
  {
    "id": "chatgpt",
    "name": "ChatGPT AI Hub",
    "domain": "chatgpt.com",
    "url": "https://chatgpt.com",
    "category": "AI TOOLS",
    "tags": [
      "GPT-4o",
      "AI Tool",
      "Free"
    ],
    "uptime": "99.9%",
    "badge": "HOT AI",
    "isTrusted": true,
    "isFeatured": true
  },
  {
    "id": "fitgirl",
    "name": "FitGirl Repacks",
    "domain": "fitgirl-repacks.site",
    "url": "https://fitgirl-repacks.site",
    "category": "DOWNLOADS",
    "tags": [
      "Games",
      "Repacks",
      "Direct"
    ],
    "uptime": "99.9%",
    "isTrusted": true
  },
  {
    "id": "ublock",
    "name": "uBlock Origin",
    "domain": "ublockorigin.com",
    "url": "https://ublockorigin.com",
    "category": "AD BLOCKERS",
    "tags": [
      "AdBlocker",
      "Privacy",
      "Open Source"
    ],
    "uptime": "100%",
    "badge": "ESSENTIAL",
    "isTrusted": true,
    "isFeatured": true
  },
  {
    "id": "fmovies",
    "name": "FMovies Official",
    "domain": "fmovies.to",
    "url": "https://fmovies.to",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "HD",
      "Multi-Server"
    ],
    "uptime": "99.6%",
    "isNew": true
  },
  {
    "id": "hianime",
    "name": "HiAnime Stream",
    "domain": "hianime.to",
    "url": "https://hianime.to",
    "category": "ANIME",
    "tags": [
      "Uncensored",
      "60FPS",
      "Anime"
    ],
    "uptime": "99.9%",
    "badge": "TRENDING",
    "isNew": true
  },
  {
    "id": "viprow",
    "name": "VipRow Sports",
    "domain": "viprow.nu",
    "url": "https://viprow.nu",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "WWE",
      "Boxing",
      "Football"
    ],
    "uptime": "99.8%",
    "isTrusted": true
  },
  {
    "id": "claudeai",
    "name": "Claude AI Studio",
    "domain": "claude.ai",
    "url": "https://claude.ai",
    "category": "AI TOOLS",
    "tags": [
      "Sonnet 3.5",
      "AI Assistant"
    ],
    "uptime": "99.9%",
    "badge": "PRO AI",
    "isFeatured": true
  },
  {
    "id": "adguard",
    "name": "AdGuard Protection",
    "domain": "adguard.com",
    "url": "https://adguard.com",
    "category": "AD BLOCKERS",
    "tags": [
      "AdBlock",
      "DNS",
      "Security"
    ],
    "uptime": "99.9%",
    "isTrusted": true
  },
  {
    "id": "1flex",
    "name": "1FLEX",
    "domain": "1flex.org",
    "url": "https://1flex.org",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "HD",
      "Fast Server"
    ],
    "uptime": "99.5%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "pantyflix",
    "name": "PANTYFLIX",
    "domain": "pantyflix.org",
    "url": "https://pantyflix.org",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "HD",
      "Fast Server"
    ],
    "uptime": "99.6%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "1tube",
    "name": "1TUBE",
    "domain": "1tube.org",
    "url": "https://1tube.org",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "Series",
      "HD Streaming"
    ],
    "uptime": "99.7%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "1shows",
    "name": "1 SHOWS",
    "domain": "1shows.org",
    "url": "https://1shows.org",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "TV Shows",
      "1080p",
      "Auto-Next"
    ],
    "uptime": "99.8%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "cinezo",
    "name": "CINEZO",
    "domain": "cinezo.net",
    "url": "https://cinezo.net",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "Series",
      "HD Streaming"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "arrowtv",
    "name": "ARROW TV",
    "domain": "arrowtv.net",
    "url": "https://arrowtv.net",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "TV Shows",
      "1080p",
      "Auto-Next"
    ],
    "uptime": "99.5%",
    "badge": "FEATURED",
    "isFeatured": true
  },
  {
    "id": "redflix",
    "name": "REDFLIX",
    "domain": "redflix.club",
    "url": "https://redflix.club",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "HD",
      "Fast Server"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "shuttletv",
    "name": "SHUTTLE TV",
    "domain": "shuttletv.su",
    "url": "https://shuttletv.su",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "TV Shows",
      "1080p",
      "Auto-Next"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "flixeo",
    "name": "FLIXEO",
    "domain": "flixeo.tv",
    "url": "https://flixeo.tv",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "HD",
      "Fast Server"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "youshows",
    "name": "YOU SHOWS",
    "domain": "youshows.org",
    "url": "https://youshows.org",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "TV Shows",
      "1080p",
      "Auto-Next"
    ],
    "uptime": "99.9%",
    "badge": "NEW",
    "isNew": true
  },
  {
    "id": "flixhub",
    "name": "FLIXHUB",
    "domain": "flixhub.studio",
    "url": "https://flixhub.studio",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "HD",
      "Fast Server"
    ],
    "uptime": "99.5%"
  },
  {
    "id": "streammovies",
    "name": "STREAMMOVIES",
    "domain": "streammovies.live",
    "url": "https://streammovies.live",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "Series",
      "HD Streaming"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "dulo",
    "name": "DULO",
    "domain": "dulo.cx",
    "url": "https://dulo.cx",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "Series",
      "HD Streaming"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "stigstream",
    "name": "STIGSTREAM",
    "domain": "stigstream.ru",
    "url": "https://stigstream.ru",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "Series",
      "HD Streaming"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "primeshows",
    "name": "PRIME MOVIES",
    "domain": "primeshows.org",
    "url": "https://primeshows.org",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "Series",
      "HD Streaming"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "willow",
    "name": "WILLOW",
    "domain": "willow.arlen.icu",
    "url": "https://willow.arlen.icu",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "Series",
      "HD Streaming"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "cinrift",
    "name": "CINRIFT",
    "domain": "cinrift.me",
    "url": "https://cinrift.me",
    "category": "MOVIES & TV SHOWS",
    "tags": [
      "Movies",
      "Series",
      "HD Streaming"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "enma",
    "name": "ENMA",
    "domain": "enma.lol",
    "url": "https://enma.lol",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.9%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "yenime",
    "name": "YENIME",
    "domain": "yenime.net",
    "url": "https://yenime.net",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.5%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "anishows",
    "name": "ANY SHOWS",
    "domain": "anishows.org",
    "url": "https://anishows.org",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "reanime",
    "name": "REANIME",
    "domain": "reanime.to",
    "url": "https://reanime.to",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "anikototv",
    "name": "ANIKOTO TV",
    "domain": "anikototv.to",
    "url": "https://anikototv.to",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "1anime",
    "name": "1ANIME",
    "domain": "1anime.app",
    "url": "https://1anime.app",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "anistream",
    "name": "ANISTREAM",
    "domain": "anistream.one",
    "url": "https://anistream.one",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.5%"
  },
  {
    "id": "kaa",
    "name": "KAA",
    "domain": "kaa.lt",
    "url": "https://kaa.lt",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "justanime",
    "name": "JUST ANIME",
    "domain": "justanime.to",
    "url": "https://justanime.to",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "animesalt",
    "name": "ANIME SALT",
    "domain": "animesalt.link",
    "url": "https://animesalt.link",
    "category": "ANIME",
    "tags": [
      "Anime",
      "Subbed",
      "Dubbed"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "mangaball",
    "name": "MANGABALL",
    "domain": "mangaball.net",
    "url": "https://mangaball.net",
    "category": "MANGA",
    "tags": [
      "Manga",
      "Reader",
      "Free"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "comick",
    "name": "COMICK",
    "domain": "comick.dev",
    "url": "https://comick.dev",
    "category": "MANGA",
    "tags": [
      "Manga",
      "Reader",
      "Free"
    ],
    "uptime": "99.5%"
  },
  {
    "id": "qtoon",
    "name": "Q TOON",
    "domain": "qtoon.org",
    "url": "https://qtoon.org",
    "category": "MANGA",
    "tags": [
      "Webtoons",
      "Color",
      "Daily"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "weebcentral",
    "name": "WEEB CENTRAL",
    "domain": "weebcentral.com",
    "url": "https://weebcentral.com",
    "category": "MANGA",
    "tags": [
      "Manga",
      "Reader",
      "Free"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "kingofshojo",
    "name": "KING OF SHOJO",
    "domain": "kingofshojo.com",
    "url": "https://kingofshojo.com",
    "category": "MANGA",
    "tags": [
      "Manga",
      "Reader",
      "Free"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "webtoons",
    "name": "WEBTOON",
    "domain": "webtoons.com",
    "url": "https://webtoons.com",
    "category": "MANGA",
    "tags": [
      "Webtoons",
      "Color",
      "Daily"
    ],
    "uptime": "99.9%",
    "badge": "FEATURED",
    "isFeatured": true
  },
  {
    "id": "ondemand",
    "name": "ONDEMAND",
    "domain": "ondemand.st",
    "url": "https://ondemand.st",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "Live TV",
      "IPTV",
      "24/7"
    ],
    "uptime": "99.5%"
  },
  {
    "id": "thestreameast",
    "name": "STREAM EAST",
    "domain": "thestreameast.top",
    "url": "https://thestreameast.top",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "Live TV",
      "IPTV",
      "24/7"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "stmify",
    "name": "STMIFY",
    "domain": "stmify.com",
    "url": "https://stmify.com",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "Live TV",
      "IPTV",
      "24/7"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "famelack",
    "name": "FAMELACK",
    "domain": "famelack.com",
    "url": "https://famelack.com",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "Live TV",
      "IPTV",
      "24/7"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "publiciptv",
    "name": "PUBLIC IPTV",
    "domain": "publiciptv.com",
    "url": "https://publiciptv.com",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "Live TV",
      "IPTV",
      "24/7"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "en97",
    "name": "SPORTPLUS",
    "domain": "en97.sportplus.watch",
    "url": "https://en97.sportplus.watch",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "Live Sports",
      "HD",
      "Football"
    ],
    "uptime": "99.5%"
  },
  {
    "id": "streameastnow",
    "name": "STREAM EAST",
    "domain": "streameastnow.net",
    "url": "https://streameastnow.net",
    "category": "LIVE TV & SPORTS",
    "tags": [
      "Live TV",
      "IPTV",
      "24/7"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "hotstar",
    "name": "HOTSTAR",
    "domain": "hotstar.com",
    "url": "https://hotstar.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "hbomax",
    "name": "HBO MAX",
    "domain": "hbomax.com",
    "url": "https://hbomax.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "tv",
    "name": "APPLE TV",
    "domain": "tv.apple.com",
    "url": "https://tv.apple.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.5%"
  },
  {
    "id": "primevideo",
    "name": "PRIME VIDEO",
    "domain": "primevideo.com",
    "url": "https://primevideo.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "sso",
    "name": "CRUNCHUROLL",
    "domain": "sso.crunchyroll.com",
    "url": "https://sso.crunchyroll.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "peacocktv",
    "name": "PEACOCK",
    "domain": "peacocktv.com",
    "url": "https://peacocktv.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "shudder",
    "name": "SHUDDER",
    "domain": "shudder.com",
    "url": "https://shudder.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "auth",
    "name": "HULU",
    "domain": "auth.hulu.com",
    "url": "https://auth.hulu.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.5%"
  },
  {
    "id": "viki",
    "name": "VIKI",
    "domain": "viki.com",
    "url": "https://viki.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.6%"
  },
  {
    "id": "paramountplus",
    "name": "PARAMOUNT",
    "domain": "paramountplus.com",
    "url": "https://paramountplus.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.7%"
  },
  {
    "id": "mgmplus",
    "name": "MGM",
    "domain": "mgmplus.com",
    "url": "https://mgmplus.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "amcplus",
    "name": "AMC",
    "domain": "amcplus.com",
    "url": "https://amcplus.com",
    "category": "PAID",
    "tags": [
      "Subscription",
      "4K Ultra",
      "Official"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "netmirror",
    "name": "NET MIRROR",
    "domain": "netmirror.gg",
    "url": "https://netmirror.gg",
    "category": "APPS",
    "tags": [
      "APK",
      "Mobile App",
      "Android"
    ],
    "uptime": "99.5%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "moviesbox",
    "name": "MOVIES BOX",
    "domain": "moviesbox.com.co",
    "url": "https://moviesbox.com.co",
    "category": "APPS",
    "tags": [
      "APK",
      "Mobile App",
      "Android"
    ],
    "uptime": "99.6%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "pikashowtv",
    "name": "PIKASHOWS",
    "domain": "pikashowtv.in",
    "url": "https://pikashowtv.in",
    "category": "APPS",
    "tags": [
      "APK",
      "Mobile App",
      "Android"
    ],
    "uptime": "99.7%",
    "badge": "TRUSTED",
    "isTrusted": true
  },
  {
    "id": "playtorrio",
    "name": "PLAY TORRIO",
    "domain": "playtorrio.pages.dev",
    "url": "https://playtorrio.pages.dev",
    "category": "APPS",
    "tags": [
      "APK",
      "Mobile App",
      "Android"
    ],
    "uptime": "99.8%"
  },
  {
    "id": "youcineapkpro",
    "name": "YOU CINE",
    "domain": "youcineapkpro.com",
    "url": "https://youcineapkpro.com",
    "category": "APPS",
    "tags": [
      "APK",
      "Mobile App",
      "Android"
    ],
    "uptime": "99.9%"
  },
  {
    "id": "onstreamapks",
    "name": "ONSTREAM",
    "domain": "onstreamapks.app",
    "url": "https://onstreamapks.app",
    "category": "APPS",
    "tags": [
      "APK",
      "Mobile App",
      "Android"
    ],
    "uptime": "99.5%"
  }
];
