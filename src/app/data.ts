export interface SiteItem {
  id: string;
  name: string;
  domain: string;
  url: string;
  category: string;
  tags: string[];
  uptime: string;
  badge?: string;
}

export const STREAMING_SITES: SiteItem[] = [
  {
    id: "flixtor",
    name: "Flixtor HD",
    domain: "flixtor.to",
    url: "https://flixtor.to",
    category: "Movies",
    tags: ["4K", "No-Ads", "Fast Player"],
    uptime: "99.9%",
    badge: "POPULAR",
  },
  {
    id: "aniwave",
    name: "AniWave Anime",
    domain: "aniwave.to",
    url: "https://aniwave.to",
    category: "Anime",
    tags: ["Dubbed", "Subbed", "HD"],
    uptime: "99.8%",
    badge: "TOP ANIME",
  },
  {
    id: "hdtoday",
    name: "HDToday TV",
    domain: "hdtoday.tv",
    url: "https://hdtoday.tv",
    category: "Series",
    tags: ["Series", "1080p", "Auto-Next"],
    uptime: "99.7%",
  },
  {
    id: "streameast",
    name: "StreamEast Sports",
    domain: "streameast.app",
    url: "https://streameast.app",
    category: "Sports",
    tags: ["Live Sports", "Football", "NBA"],
    uptime: "99.9%",
    badge: "LIVE 24/7",
  },
  {
    id: "chatgpt",
    name: "ChatGPT AI Hub",
    domain: "chatgpt.com",
    url: "https://chatgpt.com",
    category: "AI & Tools",
    tags: ["GPT-4o", "AI Tool", "Free"],
    uptime: "99.9%",
    badge: "HOT AI",
  },
  {
    id: "fmovies",
    name: "FMovies Official",
    domain: "fmovies.to",
    url: "https://fmovies.to",
    category: "Movies",
    tags: ["Movies", "HD", "Multi-Server"],
    uptime: "99.6%",
  },
  {
    id: "hianime",
    name: "HiAnime Stream",
    domain: "hianime.to",
    url: "https://hianime.to",
    category: "Anime",
    tags: ["Uncensored", "60FPS", "Anime"],
    uptime: "99.9%",
    badge: "TRENDING",
  },
  {
    id: "soap2day",
    name: "Soap2Day HD",
    domain: "soap2day.rs",
    url: "https://soap2day.rs",
    category: "Movies",
    tags: ["Free", "Cinema", "Subtitles"],
    uptime: "99.5%",
  },
  {
    id: "viprow",
    name: "VipRow Sports",
    domain: "viprow.nu",
    url: "https://viprow.nu",
    category: "Sports",
    tags: ["WWE", "Boxing", "Football"],
    uptime: "99.8%",
  },
  {
    id: "claudeai",
    name: "Claude AI Studio",
    domain: "claude.ai",
    url: "https://claude.ai",
    category: "AI & Tools",
    tags: ["Sonnet 3.5", "AI Assistant"],
    uptime: "99.9%",
    badge: "PRO AI",
  },
  {
    id: "twitch",
    name: "Twitch 24/7 Live",
    domain: "twitch.tv",
    url: "https://twitch.tv",
    category: "Live Streams",
    tags: ["Live", "Gaming", "IRL"],
    uptime: "100%",
    badge: "LIVE 24/7",
  },
  {
    id: "9anime",
    name: "9Anime Portal",
    domain: "9anime.se",
    url: "https://9anime.se",
    category: "Anime",
    tags: ["Fast", "Full-HD", "Dubbed"],
    uptime: "99.7%",
  },
];
