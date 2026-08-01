"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";

interface SiteItem {
    id: string;
    name: string;
    domain: string;
    url: string;
    category: "Movies" | "Anime" | "Series" | "Sports" | "AI & Tools" | "Live Streams";
    description: string;
    rating: string;
    icon: string;
    badge?: string;
    uptime: string;
    tags: string[];
}

const STREAMING_SITES: SiteItem[] = [
    // MOVIES
    {
        id: "1",
        name: "Flixtor HD",
        domain: "flixtor.to",
        url: "https://flixtor.to",
        category: "Movies",
        description: "Stream thousands of 4K & HD movies and TV series with high-speed playback.",
        rating: "4.9 ★",
        icon: "🍿",
        badge: "FEATURED",
        uptime: "99.9%",
        tags: ["4K Ultra", "Movies", "Fast Player"],
    },
    {
        id: "2",
        name: "FMovies Official",
        domain: "fmovies.to",
        url: "https://fmovies.to",
        category: "Movies",
        description: "Popular movie index with multi-language subtitles and daily releases.",
        rating: "4.8 ★",
        icon: "🎬",
        badge: "POPULAR",
        uptime: "99.8%",
        tags: ["Subtitles", "Cinema", "HD"],
    },
    {
        id: "3",
        name: "YTS YIFY Movies",
        domain: "yts.mx",
        url: "https://yts.mx",
        category: "Movies",
        description: "Official torrent library for small-size 720p, 1080p and 4K movie downloads.",
        rating: "4.9 ★",
        icon: "📽️",
        uptime: "100%",
        tags: ["Torrent", "YIFY", "Bluray"],
    },
    {
        id: "4",
        name: "IMDb Pro Hub",
        domain: "imdb.com",
        url: "https://imdb.com",
        category: "Movies",
        description: "The world's most authoritative source for movie ratings, reviews & cast trivia.",
        rating: "5.0 ★",
        icon: "⭐",
        badge: "OFFICIAL",
        uptime: "100%",
        tags: ["Ratings", "Reviews", "Cast"],
    },

    // ANIME
    {
        id: "5",
        name: "AniWave Anime",
        domain: "aniwave.to",
        url: "https://aniwave.to",
        category: "Anime",
        description: "Largest English dubbed & subbed anime streaming portal with zero buffering.",
        rating: "4.9 ★",
        icon: "🍥",
        badge: "TOP ANIME",
        uptime: "99.9%",
        tags: ["Subbed", "Dubbed", "Simulcast"],
    },
    {
        id: "6",
        name: "HiAnime Portal",
        domain: "hianime.to",
        url: "https://hianime.to",
        category: "Anime",
        description: "High-speed 1080p anime streaming featuring active community chat rooms.",
        rating: "4.8 ★",
        icon: "⛩️",
        badge: "HD PLAYER",
        uptime: "99.7%",
        tags: ["1080p", "Community", "No-Ads"],
    },
    {
        id: "7",
        name: "Crunchyroll Hub",
        domain: "crunchyroll.com",
        url: "https://crunchyroll.com",
        category: "Anime",
        description: "Official licensed anime series, simulcast episodes direct from Japan & manga.",
        rating: "4.9 ★",
        icon: "🧡",
        badge: "OFFICIAL",
        uptime: "100%",
        tags: ["Official", "Simulcast", "Manga"],
    },
    {
        id: "8",
        name: "MangaDex",
        domain: "mangadex.org",
        url: "https://mangadex.org",
        category: "Anime",
        description: "Community-driven open-source manga reader supporting 30+ languages.",
        rating: "4.9 ★",
        icon: "📚",
        uptime: "99.9%",
        tags: ["Manga", "Open-Source", "Reader"],
    },

    // SPORTS
    {
        id: "9",
        name: "StreamEast Sports",
        domain: "streameast.app",
        url: "https://streameast.app",
        category: "Sports",
        description: "Live Football, NBA, UFC, Formula 1, Boxing and NFL streams in 60FPS.",
        rating: "4.9 ★",
        icon: "⚽",
        badge: "LIVE SPORTS",
        uptime: "99.8%",
        tags: ["NBA", "UFC", "F1", "60FPS"],
    },
    {
        id: "10",
        name: "CricHD Live",
        domain: "crichd.vip",
        url: "https://crichd.vip",
        category: "Sports",
        description: "Live Cricket, T20 World Cup, IPL, Premier League & Sky Sports feeds.",
        rating: "4.7 ★",
        icon: "🏏",
        uptime: "99.5%",
        tags: ["Cricket", "Soccer", "Sky Sports"],
    },
    {
        id: "11",
        name: "BuffStreams",
        domain: "buffstreams.app",
        url: "https://buffstreams.app",
        category: "Sports",
        description: "Free HD live sports streaming for NFL, NBA, MLB, Hockey & MMA events.",
        rating: "4.6 ★",
        icon: "🥊",
        uptime: "99.6%",
        tags: ["NFL", "MLB", "MMA", "HD"],
    },

    // SERIES
    {
        id: "12",
        name: "SeriesFlix",
        domain: "seriesflix.com",
        url: "https://seriesflix.com",
        category: "Series",
        description: "Binge latest Netflix, HBO Max, Apple TV+ and Amazon Prime original series.",
        rating: "4.8 ★",
        icon: "📺",
        badge: "BINGE",
        uptime: "99.8%",
        tags: ["Binge", "Originals", "HD"],
    },
    {
        id: "13",
        name: "Netflix Online",
        domain: "netflix.com",
        url: "https://netflix.com",
        category: "Series",
        description: "Global leader in original streaming television series, movies and documentaries.",
        rating: "5.0 ★",
        icon: "🔴",
        badge: "OFFICIAL",
        uptime: "100%",
        tags: ["Originals", "4K HDR", "TV"],
    },

    // AI & TOOLS
    {
        id: "14",
        name: "ChatGPT AI",
        domain: "chatgpt.com",
        url: "https://chatgpt.com",
        category: "AI & Tools",
        description: "Next-gen AI conversational model for reasoning, coding, writing & research.",
        rating: "5.0 ★",
        icon: "🤖",
        badge: "AI HUB",
        uptime: "100%",
        tags: ["AI", "GPT-4o", "Coding"],
    },
    {
        id: "15",
        name: "Claude AI",
        domain: "claude.ai",
        url: "https://claude.ai",
        category: "AI & Tools",
        description: "Anthropic's frontier AI assistant built for deep reasoning and artifact generation.",
        rating: "4.9 ★",
        icon: "🧠",
        badge: "TOP AI",
        uptime: "99.9%",
        tags: ["Anthropic", "Reasoning", "AI"],
    },
    {
        id: "16",
        name: "Perplexity AI",
        domain: "perplexity.ai",
        url: "https://perplexity.ai",
        category: "AI & Tools",
        description: "AI-powered real-time search engine with citations and live web sources.",
        rating: "4.9 ★",
        icon: "🔍",
        uptime: "100%",
        tags: ["Search", "AI", "Citations"],
    },
    {
        id: "17",
        name: "Vercel Platform",
        domain: "vercel.com",
        url: "https://vercel.com",
        category: "AI & Tools",
        description: "Frontend cloud platform for building and deploying Next.js web applications.",
        rating: "4.9 ★",
        icon: "▲",
        uptime: "100%",
        tags: ["Hosting", "Nextjs", "Deploy"],
    },
    {
        id: "18",
        name: "GitHub Cloud",
        domain: "github.com",
        url: "https://github.com",
        category: "AI & Tools",
        description: "World's largest code hosting platform for version control & collaboration.",
        rating: "5.0 ★",
        icon: "🐙",
        uptime: "100%",
        tags: ["Git", "Code", "Open-Source"],
    },

    // LIVE STREAMS
    {
        id: "19",
        name: "Twitch Live",
        domain: "twitch.tv",
        url: "https://twitch.tv",
        category: "Live Streams",
        description: "Leading live streaming platform for gaming, esports, music and IRL broadcasts.",
        rating: "4.9 ★",
        icon: "👾",
        badge: "LIVE 24/7",
        uptime: "100%",
        tags: ["Gaming", "Esports", "IRL"],
    },
    {
        id: "20",
        name: "Kick Streaming",
        domain: "kick.com",
        url: "https://kick.com",
        category: "Live Streams",
        description: "Creator-first live streaming platform with uncensored gaming and chat streams.",
        rating: "4.7 ★",
        icon: "🟩",
        uptime: "99.8%",
        tags: ["Gaming", "Live", "Chat"],
    },
];

export default function Home() {
    const [activeNav, setActiveNav] = useState("Home");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedRegion, setSelectedRegion] = useState("US");
    const [showModal, setShowModal] = useState<string | null>(null);

    // Mobile Menu Drawer State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Live Site Counter State - Strictly bound to STREAMING_SITES.length
    const totalSitesCount = STREAMING_SITES.length;
    const [siteCount, setSiteCount] = useState(0);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // 3D Parallax Tilt State
    const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

    // Scroll Parallax State
    const [scrollY, setScrollY] = useState(0);

    // Lightweight Throttled Scroll Parallax Handler (120FPS smooth)
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll Parallax calculations for 3D picture depth
    const heroParallaxY = Math.min(scrollY * 0.3, 160);
    const heroParallaxRotateX = tiltStyle.rotateX + Math.min(scrollY * 0.04, 12);
    const heroDepthBlur = Math.min(scrollY * 0.012, 5);
    const heroScale = 1 + Math.min(scrollY * 0.0003, 0.05);

    // Form states for Request Site Modal
    const [reqSiteName, setReqSiteName] = useState("");
    const [reqSiteUrl, setReqSiteUrl] = useState("");
    const [reqSiteCategory, setReqSiteCategory] = useState("Movies");
    const [reqFeatures, setReqFeatures] = useState("");
    const [reqRegion, setReqRegion] = useState("US");
    const [reqSuccess, setReqSuccess] = useState(false);

    // Smooth count-up animation on mount to exact STREAMING_SITES.length
    useEffect(() => {
        let start = 0;
        const end = totalSitesCount;
        if (start === end) return;

        const duration = 1000;
        const stepTime = Math.abs(Math.floor(duration / end));

        const timer = setInterval(() => {
            start += 1;
            setSiteCount(start);
            if (start >= end) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, [totalSitesCount]);

    // 3D Mouse Parallax Tilt Handler for Hero Image Card
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        setTiltStyle({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
        setTiltStyle({ rotateX: 0, rotateY: 0 });
    };

    // Copy site URL helper
    const handleCopyLink = (site: SiteItem) => {
        navigator.clipboard.writeText(site.url);
        setCopiedId(site.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filtered sites for browsing section
    const filteredSites = useMemo(() => {
        return STREAMING_SITES.filter((site) => {
            if (selectedCategory !== "All" && site.category !== selectedCategory) return false;
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                site.name.toLowerCase().includes(q) ||
                site.domain.toLowerCase().includes(q) ||
                site.description.toLowerCase().includes(q) ||
                site.tags.some((t) => t.toLowerCase().includes(q))
            );
        });
    }, [selectedCategory, searchQuery]);

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reqSiteName.trim() || !reqSiteUrl.trim()) return;
        setReqSuccess(true);
        setTimeout(() => {
            setReqSuccess(false);
            setShowModal(null);
            setReqSiteName("");
            setReqSiteUrl("");
            setReqFeatures("");
            setReqRegion("US");
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#05050c] text-slate-100 font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
            {/* Background Ambient Lighting Aura */}
            <div className="absolute top-0 left-1/4 -mt-20 w-[400px] sm:w-[900px] h-[300px] sm:h-[600px] bg-purple-700/20 rounded-full blur-[100px] sm:blur-[180px] pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-[350px] sm:w-[800px] h-[350px] sm:h-[700px] bg-indigo-600/15 rounded-full blur-[100px] sm:blur-[190px] pointer-events-none" />

            {/* HEADER NAVBAR - ULTRA WIDE MAX WIDTH */}
            <header className="sticky top-0 z-50 glass-nav-dark px-4 sm:px-8 xl:px-12 py-3.5 transition-all">
                <div className="max-w-[1700px] w-full mx-auto flex items-center justify-between gap-4">
                    {/* Left Brand Logo */}
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveNav("Home")}>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center group-hover:scale-105 transition-transform">
                            <div className="w-full h-full bg-[#090714] rounded-[10px] flex items-center justify-center font-black italic text-base sm:text-lg text-purple-400">
                                AH
                            </div>
                        </div>
                        <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center">
                            Allsite<span className="text-purple-400 group-hover:text-purple-300 transition-colors">hub</span>
                        </span>
                    </div>

                    {/* Desktop Center Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-[#0d0b1a]/80 p-1.5 rounded-full border border-purple-500/10">
                        {["Home", "About", "Request Site", "DMCA", "Contact"].map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    setActiveNav(item);
                                    if (item === "Request Site") setShowModal("request");
                                    else if (item === "DMCA") setShowModal("dmca");
                                    else if (item === "Contact") setShowModal("contact");
                                    else if (item === "About") setShowModal("about");
                                }}
                                className={`px-4 lg:px-6 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all relative cursor-pointer ${activeNav === item
                                    ? "text-white bg-purple-600/30 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-105"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {item}
                                {activeNav === item && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-purple-400 rounded-full" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Right Header Items: Search Bar, Live Counter Pill, Region */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Desktop Search Input Bar */}
                        <div className="relative hidden lg:block w-64 xl:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs">
                                🔍
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search thousands of sites..."
                                className="w-full pl-8 pr-3 py-2 bg-[#0c0919] border border-slate-800 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/80 transition-all"
                            />
                        </div>

                        {/* DISCORD NAVBAR BADGE */}
                        <a
                            href="https://discord.gg/QnTrWqwcJ"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5865F2]/20 hover:bg-[#5865F2] border border-[#5865F2]/50 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(88,101,242,0.3)] hover:scale-105"
                            title="Join Discord Community"
                        >
                            <span className="text-sm">💬</span>
                            <span className="hidden sm:inline font-bold">Discord</span>
                        </a>

                        {/* LIVE ANIMATED COUNTER BADGE */}
                        <div className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#081814] border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="font-mono text-xs sm:text-sm font-extrabold text-emerald-300">
                                {siteCount}
                            </span>
                            <span className="text-emerald-500/80 font-normal hidden xl:inline">Sites Listed</span>
                        </div>

                        {/* Region Selector */}
                        <div className="relative hidden sm:block">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="appearance-none bg-[#0c0919] border border-slate-800 hover:border-purple-500/40 text-slate-200 text-xs font-semibold px-3 py-2 pr-7 rounded-full cursor-pointer focus:outline-none transition-colors"
                            >
                                <option value="US">🌐 US</option>
                                <option value="UK">🌐 UK</option>
                                <option value="EU">🌐 EU</option>
                                <option value="IN">🌐 IN</option>
                                <option value="GLOBAL">🌐 Global</option>
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 pointer-events-none">
                                ▼
                            </span>
                        </div>

                        {/* Mobile Hamburger Toggle Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-[#0c0919] border border-slate-800 text-slate-300 hover:text-white"
                        >
                            {isMobileMenuOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-3 pt-3 border-t border-purple-500/20 flex flex-col gap-2 bg-[#090717]/95 p-4 rounded-2xl border">
                        <div className="relative mb-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs">
                                🔍
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search sites, anime, movies..."
                                className="w-full pl-8 pr-3 py-2 bg-[#120e29] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {["Home", "About", "Request Site", "DMCA", "Contact"].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setActiveNav(item);
                                        setIsMobileMenuOpen(false);
                                        if (item === "Request Site") setShowModal("request");
                                        else if (item === "DMCA") setShowModal("dmca");
                                        else if (item === "Contact") setShowModal("contact");
                                        else if (item === "About") setShowModal("about");
                                    }}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${activeNav === item
                                        ? "bg-purple-600 text-white"
                                        : "bg-[#120e29] text-slate-300 hover:text-white"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN CONTAINER - EXPANDED TO ULTRA WIDE 1700px */}
            <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-6 sm:py-12 flex flex-col gap-8 sm:gap-14">

                {/* HERO SECTION WITH RESPONSIVE BREAKPOINTS & 3D SCROLL PARALLAX */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center relative perspective-1000">

                    {/* Left Column Text Content - ULTRA CLEAR & HIGH CONTRAST */}
                    <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-7 relative z-20 text-center lg:text-left items-center lg:items-start">
                        {/* Top Glowing Purple Badge */}
                        <div className="w-fit flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-pulse backdrop-blur-md">
                            <span className="text-purple-400 text-sm sm:text-base">⚡</span>
                            THE ULTIMATE STREAMING HUB
                        </div>

                        {/* Main Headline - High contrast with drop-shadow */}
                        <div className="flex flex-col gap-1 w-full drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
                            <h1 className="text-3xl xs:text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight text-white uppercase leading-[1.1]">
                                STREAM{" "}
                                <span className="brush-font text-purple-400 font-bold tracking-wider italic text-4xl xs:text-5xl sm:text-7xl xl:text-8xl 2xl:text-9xl hover:scale-105 transition-transform inline-block ml-1 sm:ml-2 normal-case drop-shadow-[0_0_35px_rgba(168,85,247,0.9)]">
                                    Limitless.
                                </span>
                            </h1>
                            <h1 className="text-3xl xs:text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight text-white uppercase leading-[1.1]">
                                DISCOVER{" "}
                                <span className="brush-font text-purple-400 font-bold tracking-wider italic text-4xl xs:text-5xl sm:text-7xl xl:text-8xl 2xl:text-9xl hover:scale-105 transition-transform inline-block ml-1 sm:ml-2 normal-case drop-shadow-[0_0_35px_rgba(168,85,247,0.9)]">
                                    Endless.
                                </span>
                            </h1>
                        </div>

                        {/* Subtext */}
                        <p className="text-sm sm:text-base lg:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                            One search. Infinite entertainment. Explore the best movies, anime, series, sports and more — all in one place. No sign-up. No nonsense.{" "}
                            <span className="text-purple-400 font-bold text-shadow-purple">Just endless vibes.</span>
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto pt-2">
                            <button
                                onClick={() => {
                                    const el = document.getElementById("browse-directory");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="purple-btn-primary w-full sm:w-auto px-9 py-4 rounded-full text-white font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                            >
                                <span>🚀</span>
                                <span>EXPLORE NOW</span>
                                <span className="text-lg">→</span>
                            </button>

                            <button
                                onClick={() => setShowModal("request")}
                                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#0d091e]/90 hover:bg-[#15102e] border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg hover:scale-105"
                            >
                                <span>💬</span>
                                <span>REQUEST A SITE</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column Character 3D Dynamic Parallax Picture Card */}
                    <div
                        className="lg:col-span-5 relative flex justify-center items-center perspective-1000 mt-4 lg:mt-0 z-10"
                        style={{
                            transform: `translateY(${heroParallaxY}px)`,
                            transition: "transform 0.1s linear",
                        }}
                    >
                        {/* Ambient Lighting Aura with Dynamic Depth Blur */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-indigo-600/30 to-purple-900/40 rounded-3xl blur-3xl -z-10 transition-all duration-300"
                            style={{
                                filter: `blur(${16 + heroDepthBlur * 2}px)`,
                                opacity: Math.max(0.3, 1 - scrollY * 0.002),
                            }}
                        />

                        <div
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                transform: `rotateX(${heroParallaxRotateX}deg) rotateY(${tiltStyle.rotateY}deg) scale(${heroScale})`,
                                filter: `blur(${heroDepthBlur}px)`,
                                transition: "transform 0.15s ease-out, filter 0.2s ease-out",
                            }}
                            className="relative w-full max-w-md xl:max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border border-purple-500/50 shadow-[0_0_60px_rgba(168,85,247,0.4)] bg-[#090716] preserve-3d cursor-pointer"
                        >
                            <Image
                                src="/hero_banner.png"
                                alt="Allsitehub Character Visual"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover object-center scale-105 transition-all duration-300"
                                priority
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#05050c] via-transparent to-transparent opacity-60" />

                            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-purple-500/40 flex items-center justify-between translate-z-10 shadow-2xl">
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                                    <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">Live Stream Hub</span>
                                </div>
                                <span className="text-xs sm:text-sm text-purple-300 font-mono font-bold bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30">
                                    ⚡ {siteCount} Sites
                                </span>
                            </div>
                        </div>
                    </div>

                </section>

                {/* 4 STATS CARDS ROW WITH ULTRA-WIDE FIT */}
                <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 perspective-1000">
                    <div className="card-purple-glow tilt-card-3d rounded-2xl p-5 sm:p-7 flex items-center gap-4 sm:gap-5 cursor-pointer">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-2xl sm:text-3xl text-purple-300 shadow-inner translate-z-10 shrink-0">
                            🪐
                        </div>
                        <div className="translate-z-10">
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                                {siteCount}
                            </h3>
                            <p className="text-xs sm:text-sm font-bold text-purple-300">Sites Indexed</p>
                            <p className="text-[11px] sm:text-xs text-slate-400">Verified active portals</p>
                        </div>
                    </div>

                    <div className="card-blue-glow tilt-card-3d rounded-2xl p-5 sm:p-7 flex items-center gap-4 sm:gap-5 cursor-pointer">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-2xl sm:text-3xl text-blue-300 shadow-inner translate-z-10 shrink-0">
                            🎬
                        </div>
                        <div className="translate-z-10">
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">25+</h3>
                            <p className="text-xs sm:text-sm font-bold text-blue-300">Categories</p>
                            <p className="text-[11px] sm:text-xs text-slate-400">All your favorites</p>
                        </div>
                    </div>

                    <div className="card-green-glow tilt-card-3d rounded-2xl p-5 sm:p-7 flex items-center gap-4 sm:gap-5 cursor-pointer">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-2xl sm:text-3xl text-emerald-300 shadow-inner translate-z-10 shrink-0">
                            🌐
                        </div>
                        <div className="translate-z-10">
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">190+</h3>
                            <p className="text-xs sm:text-sm font-bold text-emerald-300">Countries Supported</p>
                            <p className="text-[11px] sm:text-xs text-slate-400">Worldwide access</p>
                        </div>
                    </div>

                    <div className="card-yellow-glow tilt-card-3d rounded-2xl p-5 sm:p-7 flex items-center gap-4 sm:gap-5 cursor-pointer">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-2xl sm:text-3xl text-amber-300 shadow-inner translate-z-10 shrink-0">
                            ⚡
                        </div>
                        <div className="translate-z-10">
                            <h3 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">100%</h3>
                            <p className="text-xs sm:text-sm font-bold text-amber-300">Free Forever</p>
                            <p className="text-[11px] sm:text-xs text-slate-400">Always will be</p>
                        </div>
                    </div>
                </section>

                {/* BOTTOM FEATURE HIGHLIGHTS STRIP */}
                <section className="rounded-2xl bg-[#090717]/90 border border-purple-500/20 p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-lg sm:text-xl shrink-0">
                            ⚡
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Blazing Fast Search</h4>
                            <p className="text-[11px] sm:text-xs text-slate-400">Find any site in seconds</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-lg sm:text-xl shrink-0">
                            🌐
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Multi-Region Access</h4>
                            <p className="text-[11px] sm:text-xs text-slate-400">Unblock. Discover. Enjoy.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg sm:text-xl shrink-0">
                            🛡️
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">No Registration</h4>
                            <p className="text-[11px] sm:text-xs text-slate-400">Jump right in. No sign-up.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg sm:text-xl shrink-0">
                            🔄
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Always Updated</h4>
                            <p className="text-[11px] sm:text-xs text-slate-400">We add new sites daily</p>
                        </div>
                    </div>
                </section>

                {/* INTERACTIVE DIRECTORY SECTION - LEFT SIDEBAR CATEGORY LAYOUT */}
                <section id="browse-directory" className="flex flex-col gap-6 pt-4 sm:pt-6">
                    {/* Top Section Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                        <div>
                            <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                                <span>🔥</span> Verified Web & Streaming Directory
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400">Direct working portals with verified uptime and multi-server mirrors</p>
                        </div>

                        {/* Live Search Input Bar */}
                        <div className="relative w-full sm:w-72 md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400 text-sm">
                                🔍
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search movies, anime, AI tools..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[#090718] border border-purple-500/30 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* MAIN DIRECTORY LAYOUT: LEFT SIDEBAR + RIGHT CARDS GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* LEFT SIDEBAR CATEGORIES WITH HIGHLIGHTED ICONS */}
                        <aside className="lg:col-span-3 flex flex-col gap-3 sticky top-20 bg-[#090717]/95 border border-purple-500/30 rounded-3xl p-4 sm:p-5 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                            <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-800/80">
                                <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-2">
                                    <span>📁</span> Categories
                                </span>
                                <span className="text-[10px] font-mono font-bold bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                                    {totalSitesCount} Portals
                                </span>
                            </div>

                            {/* Category Buttons List */}
                            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
                                {[
                                    { name: "All", icon: "⚡", label: "All Categories" },
                                    { name: "Movies", icon: "🍿", label: "Movies & Cinema" },
                                    { name: "Anime", icon: "🍥", label: "Anime & Manga" },
                                    { name: "Sports", icon: "⚽", label: "Live Sports" },
                                    { name: "Series", icon: "📺", label: "Series & Shows" },
                                    { name: "AI & Tools", icon: "🤖", label: "AI & Web Tools" },
                                    { name: "Live Streams", icon: "👾", label: "Live Streams 24/7" },
                                ].map((cat) => {
                                    const isSelected = selectedCategory === cat.name;
                                    const catCount =
                                        cat.name === "All"
                                            ? STREAMING_SITES.length
                                            : STREAMING_SITES.filter((s) => s.category === cat.name).length;

                                    return (
                                        <button
                                            key={cat.name}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`group relative flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal ${isSelected
                                                ? "bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-purple-950/90 border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.35)] scale-[1.02]"
                                                : "bg-[#0c091f]/80 hover:bg-[#130f30] border border-slate-800/80 hover:border-purple-500/30 text-slate-400 hover:text-white"
                                                }`}
                                        >
                                            {/* Left Active Line Accent */}
                                            {isSelected && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-purple-400 rounded-r-full shadow-[0_0_10px_#a855f7]" />
                                            )}

                                            {/* Highlighted Icon & Category Label */}
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all shrink-0 ${isSelected
                                                        ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] scale-110"
                                                        : "bg-[#140e33] border border-purple-500/20 text-purple-400 group-hover:scale-105 group-hover:border-purple-500/40"
                                                        }`}
                                                >
                                                    {cat.icon}
                                                </div>

                                                <div className="flex flex-col text-left">
                                                    <span
                                                        className={`text-xs sm:text-sm font-extrabold tracking-wide ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                                                            }`}
                                                    >
                                                        {cat.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right Count Badge */}
                                            <span
                                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${isSelected
                                                    ? "bg-purple-400 text-black border-purple-300 font-extrabold"
                                                    : "bg-[#120e2e] text-slate-400 border-slate-800 group-hover:text-purple-300"
                                                    }`}
                                            >
                                                {catCount}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* DISCORD COMMUNITY SERVER BANNER */}
                            <a
                                href="https://discord.gg/QnTrWqwcJ"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#5865F2]/25 via-[#404EED]/20 to-purple-900/30 border border-[#5865F2]/40 hover:border-[#5865F2] hover:shadow-[0_0_25px_rgba(88,101,242,0.4)] transition-all cursor-pointer overflow-hidden mt-3"
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-xl text-white shadow-[0_0_15px_rgba(88,101,242,0.6)] group-hover:scale-110 transition-transform shrink-0">
                                        💬
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-white group-hover:text-purple-200 flex items-center gap-1.5">
                                            <span>JOIN DISCORD</span>
                                            <span className="text-[9px] text-emerald-400 font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">● LIVE</span>
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-300">
                                            Chat, Suggest & Get Updates
                                        </span>
                                    </div>
                                </div>

                                <span className="text-[#5865F2] font-black text-xs group-hover:translate-x-1 group-hover:text-white transition-all flex items-center gap-0.5 shrink-0">
                                    <span>Join</span>
                                    <span className="text-sm">↗</span>
                                </span>
                            </a>
                        </aside>

                        {/* RIGHT MAIN DIRECTORY CARDS GRID */}
                        <div className="lg:col-span-9 flex flex-col gap-5">

                            {/* Directory Active Category & Results Header */}
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 font-semibold">Showing:</span>
                                    <span className="text-xs font-bold text-purple-300 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
                                        {selectedCategory} ({filteredSites.length})
                                    </span>
                                </div>

                                {searchQuery && (
                                    <span className="text-xs text-slate-400">
                                        Found <strong className="text-white">{filteredSites.length}</strong> matches for &quot;{searchQuery}&quot;
                                    </span>
                                )}
                            </div>

                            {/* Cards Grid - Compact Rhombus-Shaped Clickable Cards */}
                            {filteredSites.length === 0 ? (
                                <div className="p-10 rounded-3xl bg-[#090717]/80 border border-purple-500/20 text-center flex flex-col items-center justify-center gap-3">
                                    <span className="text-3xl">🔍</span>
                                    <h3 className="text-base font-bold text-white">No portals found</h3>
                                    <p className="text-xs text-slate-400 max-w-sm">
                                        No sites match your search query or category filter.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory("All");
                                        }}
                                        className="mt-2 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-white text-xs font-bold border border-purple-500/50"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                    {filteredSites.map((site) => (
                                        <a
                                            key={site.id}
                                            href={site.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative -skew-x-3 hover:-skew-x-1 bg-[#090717]/95 border border-purple-500/25 hover:border-purple-500/70 rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] cursor-pointer overflow-hidden"
                                        >
                                            {/* Top Glowing Accent Line */}
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />

                                            {/* Deskewed Inner Content for Perfect Text Legibility */}
                                            <div className="skew-x-3 flex flex-col gap-2.5">
                                                {/* Header: Logo Icon, Name, Domain & Rating */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-9 h-9 rounded-xl bg-[#120d2b] border border-purple-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
                                                            {site.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1">
                                                                <h3 className="font-extrabold text-white text-xs sm:text-sm group-hover:text-purple-300 transition-colors line-clamp-1">
                                                                    {site.name}
                                                                </h3>
                                                                <span className="text-emerald-400 text-[10px]" title="Verified Site">✓</span>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-purple-300/80">
                                                                {site.domain}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/20 whitespace-nowrap shrink-0">
                                                        {site.rating}
                                                    </span>
                                                </div>

                                                {/* Minimal Feature Tags */}
                                                <div className="flex flex-wrap gap-1">
                                                    {site.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#130f30] text-purple-200 border border-purple-500/20"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Footer: Uptime & Click-Anywhere Launch Cue */}
                                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] mt-1">
                                                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        {site.uptime} Online
                                                    </span>

                                                    <span className="text-purple-400 font-extrabold group-hover:text-purple-200 group-hover:translate-x-1 transition-all flex items-center gap-1">
                                                        <span>Open</span>
                                                        <span className="text-xs">↗</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}

                        </div>

                    </div>
                </section>

            </main>

            {/* REQUEST SITE / MODAL DIALOG */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                    <div className="bg-[#0b081b] border border-purple-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full flex flex-col gap-5 relative shadow-[0_0_50px_rgba(168,85,247,0.3)] my-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                                <span>💬</span>
                                {showModal === "request" && "Request A New Site"}
                                {showModal === "about" && "About Allsitehub"}
                                {showModal === "dmca" && "DMCA Disclaimer"}
                                {showModal === "contact" && "Contact Support"}
                            </h3>
                            <button
                                onClick={() => setShowModal(null)}
                                className="text-slate-400 hover:text-white p-1"
                            >
                                ✕
                            </button>
                        </div>

                        {showModal === "request" && (
                            <div className="flex flex-col gap-5 py-2 text-center items-center">
                                <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200 text-base sm:text-lg font-black uppercase tracking-wider leading-snug drop-shadow-sm">
                                    WANNA ADD YOUR WEBSITE? JUST JOIN DISCORD AND MESSAGE ME
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
                                    <a
                                        href="https://discord.gg/QnTrWqwcJ"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#404EED] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 cursor-pointer"
                                    >
                                        <span>💬 Join Discord</span>
                                        <span className="text-xs">↗</span>
                                    </a>

                                    <a
                                        href="https://t.me/+7SjX1pMek4c1ZDA1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1d87b9] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-sky-500/25 active:scale-95 cursor-pointer"
                                    >
                                        <span>✈️ Join Telegram</span>
                                        <span className="text-xs">↗</span>
                                    </a>
                                </div>
                            </div>
                        )}

                        {showModal === "about" && (
                            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed flex flex-col gap-3">
                                <p>
                                    <strong>Allsitehub</strong> is your centralized portal for discovering verified streaming links, anime portals, live sports hubs, and productivity tools.
                                </p>
                                <p>
                                    We catalog over 50,000+ sites across 190+ countries with no registration required.
                                </p>
                            </div>
                        )}

                        {showModal === "dmca" && (
                            <div className="text-xs text-slate-300 leading-relaxed flex flex-col gap-3">
                                <p>
                                    Allsitehub does not host any media files or copyright-protected content on its servers. All links point to external third-party services.
                                </p>
                                <p>
                                    For copyright inquiries, please contact the respective hosting platforms directly.
                                </p>
                            </div>
                        )}

                        {showModal === "contact" && (
                            <div className="text-xs sm:text-sm text-slate-300 flex flex-col gap-3">
                                <p>Have questions or want to partner with us?</p>
                                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono">
                                    support@allsitehub.com
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FOOTER - ULTRA WIDE MAX WIDTH */}
            <footer className="mt-auto border-t border-slate-800/80 py-6 sm:py-8 bg-[#040409]">
                <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Allsite<span className="text-purple-400">hub</span></span>
                        <span>— The Ultimate Streaming Hub.</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px] sm:text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            All Systems Operational
                        </span>
                        <span>•</span>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="hover:text-purple-400 transition-colors font-semibold cursor-pointer"
                        >
                            Back to Top ↑
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}




