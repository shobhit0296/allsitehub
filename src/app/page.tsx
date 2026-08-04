"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import GalaxyBackground, { GalaxyThemeConfig } from "./GalaxyBackground";

import {
  STREAMING_SITES,
  CATEGORIES,
  SiteItem,
  getCleanDomain,
  getFaviconUrl,
  BannerConfig,
  DEFAULT_BANNER_CONFIG,
  getBannerConfig,
  getSavedSites,
} from "./data";

interface ThemeConfig {
  name: string;
  mode: "dark";
  icon: string;
  badge: string;
  pageBg: string;
  textureClass: string;
  textColor: string;
  subtextColor: string;
  headingColor: string;
  mutedText: string;
  headerBg: string;
  headerBorder: string;
  brandText: string;
  activeNavBg: string;
  inactiveNavText: string;
  cardBg: string;
  cardBorder: string;
  cardBorderHover: string;
  cardGlow: string;
  sidebarBg: string;
  sidebarBorder: string;
  catBtnBg: string;
  catBtnText: string;
  catBtnBorder: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  siteCardBg: string;
  siteCardBorder: string;
  sqIconBg: string;
  sqIconBorder: string;
  footerBg: string;
  footerBorder: string;
  modalBg: string;
  modalBorder: string;
  modalText: string;
  aura1: string;
  aura2: string;
  accentBadge: string;
  categoryBar: string;
  galaxyConfig: GalaxyThemeConfig;
}

const THEME_STYLES: Record<string, ThemeConfig> = {
  // 1. MIDNIGHT PURPLE GALAXY
  midnight: {
    name: "Midnight Purple",
    mode: "dark",
    icon: "🌌",
    badge: "Dark Galaxy",
    pageBg: "bg-[#05050c]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-slate-100",
    subtextColor: "text-slate-300",
    headingColor: "text-white",
    mutedText: "text-purple-200/60",
    headerBg: "bg-[#09061c]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(168,85,247,0.25)] border-b border-purple-500/40",
    headerBorder: "border-b border-purple-500/50",
    brandText: "text-purple-400",
    activeNavBg: "bg-purple-600/35 border border-purple-400/70 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-white/10",
    cardBg: "bg-[#090717]/70 backdrop-blur-xl shadow-lg border border-purple-500/25",
    cardBorder: "border-purple-500/25",
    cardBorderHover: "hover:border-purple-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(168,85,247,0.45)]",
    sidebarBg: "bg-[#090717]/75 backdrop-blur-2xl shadow-xl border border-purple-500/30",
    sidebarBorder: "border-purple-500/30",
    catBtnBg: "bg-[#0c091f]/60 backdrop-blur-md",
    catBtnText: "text-slate-200 hover:text-white",
    catBtnBorder: "border-purple-500/20",
    inputBg: "bg-[#090718]/70 backdrop-blur-md",
    inputBorder: "border-purple-500/40",
    inputText: "text-white",
    siteCardBg: "bg-gradient-to-b from-[#0e0b24]/85 to-[#080616]/95 backdrop-blur-xl",
    siteCardBorder: "border-purple-500/30",
    sqIconBg: "bg-[#140e33]/90 border border-purple-400/40",
    sqIconBorder: "border-purple-400/40",
    footerBg: "bg-[#040409]/90 backdrop-blur-xl",
    footerBorder: "border-purple-900/40",
    modalBg: "bg-[#0b081b]/90 backdrop-blur-2xl",
    modalBorder: "border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.3)]",
    modalText: "text-slate-200",
    aura1: "bg-purple-700/20",
    aura2: "bg-indigo-600/15",
    accentBadge: "bg-purple-950/80 text-purple-300 border-purple-500/40 backdrop-blur-md",
    categoryBar: "bg-purple-500 shadow-[0_0_15px_#a855f7]",
    galaxyConfig: {
      spaceBg: "#05050c",
      nebula1: "rgba(168, 85, 247, 0.25)",
      nebula2: "rgba(99, 102, 241, 0.22)",
      nebula3: "rgba(236, 72, 153, 0.15)",
      starColor: "#ffffff",
      accentGlow: "#a855f7",
    },
  },

  // 2. CYBERPUNK NEON GALAXY
  cyber: {
    name: "Cyberpunk Neon",
    mode: "dark",
    icon: "⚡",
    badge: "Dark Cyber",
    pageBg: "bg-[#030a16]",
    textureClass: "theme-texture-dots-dark",
    textColor: "text-cyan-100",
    subtextColor: "text-cyan-200/80",
    headingColor: "text-white",
    mutedText: "text-cyan-300/60",
    headerBg: "bg-[#041224]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(6,182,212,0.3)] border-b border-cyan-400/50",
    headerBorder: "border-b border-cyan-400/50",
    brandText: "text-cyan-400",
    activeNavBg: "bg-cyan-500/35 border border-cyan-400/70 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.45)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40",
    cardBg: "bg-[#05152a]/70 backdrop-blur-xl shadow-lg border border-cyan-500/30",
    cardBorder: "border-cyan-500/30",
    cardBorderHover: "hover:border-cyan-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]",
    sidebarBg: "bg-[#05152a]/75 backdrop-blur-2xl shadow-xl border border-cyan-500/35",
    sidebarBorder: "border-cyan-500/35",
    catBtnBg: "bg-[#071d38]/60 backdrop-blur-md",
    catBtnText: "text-cyan-200/90 hover:text-white",
    catBtnBorder: "border-cyan-500/25",
    inputBg: "bg-[#041124]/70 backdrop-blur-md",
    inputBorder: "border-cyan-500/40",
    inputText: "text-cyan-100",
    siteCardBg: "bg-gradient-to-b from-[#071c38]/85 to-[#030f21]/95 backdrop-blur-xl",
    siteCardBorder: "border-cyan-500/30",
    sqIconBg: "bg-[#0a274c]/90 border border-cyan-400/40",
    sqIconBorder: "border-cyan-400/40",
    footerBg: "bg-[#020710]/90 backdrop-blur-xl",
    footerBorder: "border-cyan-950",
    modalBg: "bg-[#041226]/90 backdrop-blur-2xl",
    modalBorder: "border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]",
    modalText: "text-cyan-100",
    aura1: "bg-cyan-600/20",
    aura2: "bg-pink-600/15",
    accentBadge: "bg-cyan-950/90 text-cyan-300 border-cyan-500/40 backdrop-blur-md",
    categoryBar: "bg-cyan-400 shadow-[0_0_15px_#22d3ee]",
    galaxyConfig: {
      spaceBg: "#030a16",
      nebula1: "rgba(6, 182, 212, 0.25)",
      nebula2: "rgba(236, 72, 153, 0.20)",
      nebula3: "rgba(59, 130, 246, 0.18)",
      starColor: "#cffafe",
      accentGlow: "#22d3ee",
    },
  },

  // 3. EMERALD MATRIX GALAXY
  emerald: {
    name: "Emerald Matrix",
    mode: "dark",
    icon: "🟢",
    badge: "Dark Emerald",
    pageBg: "bg-[#02120b]",
    textureClass: "theme-texture-mesh-dark",
    textColor: "text-emerald-100",
    subtextColor: "text-emerald-200/80",
    headingColor: "text-white",
    mutedText: "text-emerald-300/60",
    headerBg: "bg-[#031c12]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(16,185,129,0.3)] border-b border-emerald-400/50",
    headerBorder: "border-b border-emerald-400/50",
    brandText: "text-emerald-400",
    activeNavBg: "bg-emerald-500/35 border border-emerald-400/70 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.45)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40",
    cardBg: "bg-[#031d13]/70 backdrop-blur-xl shadow-lg border border-emerald-500/30",
    cardBorder: "border-emerald-500/30",
    cardBorderHover: "hover:border-emerald-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(16,185,129,0.45)]",
    sidebarBg: "bg-[#031d13]/75 backdrop-blur-2xl shadow-xl border border-emerald-500/35",
    sidebarBorder: "border-emerald-500/35",
    catBtnBg: "bg-[#05291b]/60 backdrop-blur-md",
    catBtnText: "text-emerald-200/90 hover:text-white",
    catBtnBorder: "border-emerald-500/25",
    inputBg: "bg-[#031a10]/70 backdrop-blur-md",
    inputBorder: "border-emerald-500/40",
    inputText: "text-emerald-100",
    siteCardBg: "bg-gradient-to-b from-[#052b1d]/85 to-[#02150e]/95 backdrop-blur-xl",
    siteCardBorder: "border-emerald-500/30",
    sqIconBg: "bg-[#083a27]/90 border border-emerald-400/40",
    sqIconBorder: "border-emerald-400/40",
    footerBg: "bg-[#010a06]/90 backdrop-blur-xl",
    footerBorder: "border-emerald-950",
    modalBg: "bg-[#031d13]/90 backdrop-blur-2xl",
    modalBorder: "border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]",
    modalText: "text-emerald-100",
    aura1: "bg-emerald-600/20",
    aura2: "bg-teal-600/15",
    accentBadge: "bg-emerald-950/90 text-emerald-300 border-emerald-500/40 backdrop-blur-md",
    categoryBar: "bg-emerald-400 shadow-[0_0_15px_#34d399]",
    galaxyConfig: {
      spaceBg: "#02120b",
      nebula1: "rgba(16, 185, 129, 0.25)",
      nebula2: "rgba(20, 184, 166, 0.20)",
      nebula3: "rgba(59, 130, 246, 0.15)",
      starColor: "#d1fae5",
      accentGlow: "#34d399",
    },
  },

  // 4. OCEAN DEEP GALAXY
  ocean: {
    name: "Ocean Deep",
    mode: "dark",
    icon: "🌊",
    badge: "Dark Abyss",
    pageBg: "bg-[#030914]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-blue-100",
    subtextColor: "text-blue-200/80",
    headingColor: "text-white",
    mutedText: "text-blue-300/60",
    headerBg: "bg-[#06142a]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(59,130,246,0.3)] border-b border-blue-400/50",
    headerBorder: "border-b border-blue-400/50",
    brandText: "text-blue-400",
    activeNavBg: "bg-blue-500/35 border border-blue-400/70 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.45)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-blue-300 hover:bg-blue-950/40",
    cardBg: "bg-[#061730]/70 backdrop-blur-xl shadow-lg border border-blue-500/30",
    cardBorder: "border-blue-500/30",
    cardBorderHover: "hover:border-blue-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(59,130,246,0.45)]",
    sidebarBg: "bg-[#061730]/75 backdrop-blur-2xl shadow-xl border border-blue-500/35",
    sidebarBorder: "border-blue-500/35",
    catBtnBg: "bg-[#082247]/60 backdrop-blur-md",
    catBtnText: "text-blue-200/90 hover:text-white",
    catBtnBorder: "border-blue-500/25",
    inputBg: "bg-[#041328]/70 backdrop-blur-md",
    inputBorder: "border-blue-500/40",
    inputText: "text-blue-100",
    siteCardBg: "bg-gradient-to-b from-[#08244b]/85 to-[#031124]/95 backdrop-blur-xl",
    siteCardBorder: "border-blue-500/30",
    sqIconBg: "bg-[#0b3368]/90 border border-blue-400/40",
    sqIconBorder: "border-blue-400/40",
    footerBg: "bg-[#01050d]/90 backdrop-blur-xl",
    footerBorder: "border-blue-950",
    modalBg: "bg-[#061730]/90 backdrop-blur-2xl",
    modalBorder: "border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)]",
    modalText: "text-blue-100",
    aura1: "bg-blue-600/20",
    aura2: "bg-sky-600/15",
    accentBadge: "bg-blue-950/90 text-blue-300 border-blue-500/40 backdrop-blur-md",
    categoryBar: "bg-blue-400 shadow-[0_0_15px_#60a5fa]",
    galaxyConfig: {
      spaceBg: "#030914",
      nebula1: "rgba(59, 130, 246, 0.25)",
      nebula2: "rgba(14, 165, 233, 0.20)",
      nebula3: "rgba(99, 102, 241, 0.18)",
      starColor: "#dbeafe",
      accentGlow: "#60a5fa",
    },
  },

  // 5. CRIMSON SUPERNOVA GALAXY
  crimson: {
    name: "Crimson Supernova",
    mode: "dark",
    icon: "🔥",
    badge: "Dark Supernova",
    pageBg: "bg-[#0d0306]",
    textureClass: "theme-texture-dots-dark",
    textColor: "text-rose-100",
    subtextColor: "text-rose-200/80",
    headingColor: "text-white",
    mutedText: "text-rose-300/60",
    headerBg: "bg-[#1c050a]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(244,63,94,0.3)] border-b border-rose-500/50",
    headerBorder: "border-b border-rose-500/50",
    brandText: "text-rose-400",
    activeNavBg: "bg-rose-500/35 border border-rose-400/70 text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.45)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-rose-300 hover:bg-rose-950/40",
    cardBg: "bg-[#190509]/70 backdrop-blur-xl shadow-lg border border-rose-500/30",
    cardBorder: "border-rose-500/30",
    cardBorderHover: "hover:border-rose-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(244,63,94,0.45)]",
    sidebarBg: "bg-[#190509]/75 backdrop-blur-2xl shadow-xl border border-rose-500/35",
    sidebarBorder: "border-rose-500/35",
    catBtnBg: "bg-[#28080f]/60 backdrop-blur-md",
    catBtnText: "text-rose-200/90 hover:text-white",
    catBtnBorder: "border-rose-500/25",
    inputBg: "bg-[#150407]/70 backdrop-blur-md",
    inputBorder: "border-rose-500/40",
    inputText: "text-rose-100",
    siteCardBg: "bg-gradient-to-b from-[#28080f]/85 to-[#120306]/95 backdrop-blur-xl",
    siteCardBorder: "border-rose-500/30",
    sqIconBg: "bg-[#3d0b16]/90 border border-rose-400/40",
    sqIconBorder: "border-rose-400/40",
    footerBg: "bg-[#080103]/90 backdrop-blur-xl",
    footerBorder: "border-rose-950",
    modalBg: "bg-[#180509]/90 backdrop-blur-2xl",
    modalBorder: "border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.3)]",
    modalText: "text-rose-100",
    aura1: "bg-rose-600/20",
    aura2: "bg-red-600/15",
    accentBadge: "bg-rose-950/90 text-rose-300 border-rose-500/40 backdrop-blur-md",
    categoryBar: "bg-rose-400 shadow-[0_0_15px_#fb7185]",
    galaxyConfig: {
      spaceBg: "#0d0306",
      nebula1: "rgba(244, 63, 94, 0.25)",
      nebula2: "rgba(239, 68, 68, 0.20)",
      nebula3: "rgba(245, 158, 11, 0.16)",
      starColor: "#ffe4e6",
      accentGlow: "#fb7185",
    },
  },

  // 6. SOLAR AMBER GALAXY
  sunset: {
    name: "Solar Amber",
    mode: "dark",
    icon: "☀️",
    badge: "Dark Solar",
    pageBg: "bg-[#0f0a02]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-amber-100",
    subtextColor: "text-amber-200/80",
    headingColor: "text-white",
    mutedText: "text-amber-300/60",
    headerBg: "bg-[#1c1204]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(245,158,11,0.3)] border-b border-amber-400/50",
    headerBorder: "border-b border-amber-400/50",
    brandText: "text-amber-400",
    activeNavBg: "bg-amber-500/35 border border-amber-400/70 text-white font-bold shadow-[0_0_20px_rgba(245,158,11,0.45)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-amber-300 hover:bg-amber-950/40",
    cardBg: "bg-[#1f1405]/70 backdrop-blur-xl shadow-lg border border-amber-500/30",
    cardBorder: "border-amber-500/30",
    cardBorderHover: "hover:border-amber-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(245,158,11,0.45)]",
    sidebarBg: "bg-[#1f1405]/75 backdrop-blur-2xl shadow-xl border border-amber-500/35",
    sidebarBorder: "border-amber-500/35",
    catBtnBg: "bg-[#2b1b07]/60 backdrop-blur-md",
    catBtnText: "text-amber-200/90 hover:text-white",
    catBtnBorder: "border-amber-500/25",
    inputBg: "bg-[#180f04]/70 backdrop-blur-md",
    inputBorder: "border-amber-500/40",
    inputText: "text-amber-100",
    siteCardBg: "bg-gradient-to-b from-[#2d1d08]/85 to-[#140c03]/95 backdrop-blur-xl",
    siteCardBorder: "border-amber-500/30",
    sqIconBg: "bg-[#422a0b]/90 border border-amber-400/40",
    sqIconBorder: "border-amber-400/40",
    footerBg: "bg-[#0a0601]/90 backdrop-blur-xl",
    footerBorder: "border-amber-950",
    modalBg: "bg-[#1c1204]/90 backdrop-blur-2xl",
    modalBorder: "border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)]",
    modalText: "text-amber-100",
    aura1: "bg-amber-600/20",
    aura2: "bg-orange-600/15",
    accentBadge: "bg-amber-950/90 text-amber-300 border-amber-500/40 backdrop-blur-md",
    categoryBar: "bg-amber-400 shadow-[0_0_15px_#fbbf24]",
    galaxyConfig: {
      spaceBg: "#0f0a02",
      nebula1: "rgba(245, 158, 11, 0.25)",
      nebula2: "rgba(234, 88, 12, 0.20)",
      nebula3: "rgba(217, 119, 6, 0.16)",
      starColor: "#fef3c7",
      accentGlow: "#fbbf24",
    },
  },

  // 7. SAKURA VOID GALAXY
  sakura: {
    name: "Sakura Void",
    mode: "dark",
    icon: "🌸",
    badge: "Dark Sakura",
    pageBg: "bg-[#0e030a]",
    textureClass: "theme-texture-dots-dark",
    textColor: "text-pink-100",
    subtextColor: "text-pink-200/80",
    headingColor: "text-white",
    mutedText: "text-pink-300/60",
    headerBg: "bg-[#1c0615]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(236,72,153,0.3)] border-b border-pink-400/50",
    headerBorder: "border-b border-pink-400/50",
    brandText: "text-pink-400",
    activeNavBg: "bg-pink-500/35 border border-pink-400/70 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.45)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-pink-300 hover:bg-pink-950/40",
    cardBg: "bg-[#1c0616]/70 backdrop-blur-xl shadow-lg border border-pink-500/30",
    cardBorder: "border-pink-500/30",
    cardBorderHover: "hover:border-pink-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(236,72,153,0.45)]",
    sidebarBg: "bg-[#1c0616]/75 backdrop-blur-2xl shadow-xl border border-pink-500/35",
    sidebarBorder: "border-pink-500/35",
    catBtnBg: "bg-[#280920]/60 backdrop-blur-md",
    catBtnText: "text-pink-200/90 hover:text-white",
    catBtnBorder: "border-pink-500/25",
    inputBg: "bg-[#160511]/70 backdrop-blur-md",
    inputBorder: "border-pink-500/40",
    inputText: "text-pink-100",
    siteCardBg: "bg-gradient-to-b from-[#2b0922]/85 to-[#12030e]/95 backdrop-blur-xl",
    siteCardBorder: "border-pink-500/30",
    sqIconBg: "bg-[#3e0d32]/90 border border-pink-400/40",
    sqIconBorder: "border-pink-400/40",
    footerBg: "bg-[#090107]/90 backdrop-blur-xl",
    footerBorder: "border-pink-950",
    modalBg: "bg-[#1c0615]/90 backdrop-blur-2xl",
    modalBorder: "border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.3)]",
    modalText: "text-pink-100",
    aura1: "bg-pink-600/20",
    aura2: "bg-rose-600/15",
    accentBadge: "bg-pink-950/90 text-pink-300 border-pink-500/40 backdrop-blur-md",
    categoryBar: "bg-pink-400 shadow-[0_0_15px_#f472b6]",
    galaxyConfig: {
      spaceBg: "#0e030a",
      nebula1: "rgba(236, 72, 153, 0.25)",
      nebula2: "rgba(168, 85, 247, 0.20)",
      nebula3: "rgba(244, 114, 182, 0.16)",
      starColor: "#fce7f3",
      accentGlow: "#f472b6",
    },
  },

  // 8. ARCTIC FROST GALAXY
  arctic: {
    name: "Arctic Frost",
    mode: "dark",
    icon: "🧊",
    badge: "Dark Frost",
    pageBg: "bg-[#020b12]",
    textureClass: "theme-texture-mesh-dark",
    textColor: "text-sky-100",
    subtextColor: "text-sky-200/80",
    headingColor: "text-white",
    mutedText: "text-sky-300/60",
    headerBg: "bg-[#041726]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(56,189,248,0.3)] border-b border-sky-400/50",
    headerBorder: "border-b border-sky-400/50",
    brandText: "text-sky-400",
    activeNavBg: "bg-sky-500/35 border border-sky-400/70 text-white font-bold shadow-[0_0_20px_rgba(56,189,248,0.45)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-sky-300 hover:bg-sky-950/40",
    cardBg: "bg-[#051c2e]/70 backdrop-blur-xl shadow-lg border border-sky-500/30",
    cardBorder: "border-sky-500/30",
    cardBorderHover: "hover:border-sky-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(56,189,248,0.45)]",
    sidebarBg: "bg-[#051c2e]/75 backdrop-blur-2xl shadow-xl border border-sky-500/35",
    sidebarBorder: "border-sky-500/35",
    catBtnBg: "bg-[#07253d]/60 backdrop-blur-md",
    catBtnText: "text-sky-200/90 hover:text-white",
    catBtnBorder: "border-sky-500/25",
    inputBg: "bg-[#031524]/70 backdrop-blur-md",
    inputBorder: "border-sky-500/40",
    inputText: "text-sky-100",
    siteCardBg: "bg-gradient-to-b from-[#082945]/85 to-[#02111c]/95 backdrop-blur-xl",
    siteCardBorder: "border-sky-500/30",
    sqIconBg: "bg-[#0a385e]/90 border border-sky-400/40",
    sqIconBorder: "border-sky-400/40",
    footerBg: "bg-[#01070d]/90 backdrop-blur-xl",
    footerBorder: "border-sky-950",
    modalBg: "bg-[#041726]/90 backdrop-blur-2xl",
    modalBorder: "border-sky-500/50 shadow-[0_0_50px_rgba(56,189,248,0.3)]",
    modalText: "text-sky-100",
    aura1: "bg-sky-600/20",
    aura2: "bg-teal-600/15",
    accentBadge: "bg-sky-950/90 text-sky-300 border-sky-500/40 backdrop-blur-md",
    categoryBar: "bg-sky-400 shadow-[0_0_15px_#38bdf8]",
    galaxyConfig: {
      spaceBg: "#020b12",
      nebula1: "rgba(56, 189, 248, 0.25)",
      nebula2: "rgba(45, 212, 191, 0.20)",
      nebula3: "rgba(99, 102, 241, 0.16)",
      starColor: "#e0f2fe",
      accentGlow: "#38bdf8",
    },
  },

  // 9. STARLIGHT OBSIDIAN GALAXY
  obsidian: {
    name: "Starlight Obsidian",
    mode: "dark",
    icon: "⭐",
    badge: "Dark Obsidian",
    pageBg: "bg-[#040407]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-slate-100",
    subtextColor: "text-slate-300",
    headingColor: "text-white",
    mutedText: "text-slate-400",
    headerBg: "bg-[#0b0b12]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(255,255,255,0.15)] border-b border-slate-700/50",
    headerBorder: "border-b border-slate-700/50",
    brandText: "text-slate-200",
    activeNavBg: "bg-slate-700/40 border border-slate-400/60 text-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-white/10",
    cardBg: "bg-[#0e0e18]/70 backdrop-blur-xl shadow-lg border border-slate-700/40",
    cardBorder: "border-slate-700/40",
    cardBorderHover: "hover:border-slate-400/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(255,255,255,0.25)]",
    sidebarBg: "bg-[#0e0e18]/75 backdrop-blur-2xl shadow-xl border border-slate-700/40",
    sidebarBorder: "border-slate-700/40",
    catBtnBg: "bg-[#141421]/60 backdrop-blur-md",
    catBtnText: "text-slate-200 hover:text-white",
    catBtnBorder: "border-slate-700/30",
    inputBg: "bg-[#0a0a12]/70 backdrop-blur-md",
    inputBorder: "border-slate-700/50",
    inputText: "text-white",
    siteCardBg: "bg-gradient-to-b from-[#141424]/85 to-[#08080f]/95 backdrop-blur-xl",
    siteCardBorder: "border-slate-700/40",
    sqIconBg: "bg-[#1c1c30]/90 border border-slate-500/40",
    sqIconBorder: "border-slate-500/40",
    footerBg: "bg-[#020204]/90 backdrop-blur-xl",
    footerBorder: "border-slate-800",
    modalBg: "bg-[#0d0d16]/90 backdrop-blur-2xl",
    modalBorder: "border-slate-600/50 shadow-[0_0_50px_rgba(255,255,255,0.15)]",
    modalText: "text-slate-100",
    aura1: "bg-slate-500/20",
    aura2: "bg-indigo-500/15",
    accentBadge: "bg-slate-900/90 text-slate-200 border-slate-700/50 backdrop-blur-md",
    categoryBar: "bg-slate-300 shadow-[0_0_15px_#cbd5e1]",
    galaxyConfig: {
      spaceBg: "#040407",
      nebula1: "rgba(148, 163, 184, 0.20)",
      nebula2: "rgba(99, 102, 241, 0.18)",
      nebula3: "rgba(203, 213, 225, 0.15)",
      starColor: "#ffffff",
      accentGlow: "#e2e8f0",
    },
  },

  // 10. AETHER GOLD GALAXY
  aether: {
    name: "Aether Gold",
    mode: "dark",
    icon: "👑",
    badge: "Dark Imperial",
    pageBg: "bg-[#0b0802]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-amber-100",
    subtextColor: "text-amber-200/80",
    headingColor: "text-white",
    mutedText: "text-amber-300/60",
    headerBg: "bg-[#171104]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(251,191,36,0.3)] border-b border-amber-400/50",
    headerBorder: "border-b border-amber-400/50",
    brandText: "text-amber-300",
    activeNavBg: "bg-amber-500/35 border border-amber-300/70 text-white font-bold shadow-[0_0_20px_rgba(251,191,36,0.45)] backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-amber-200 hover:bg-amber-950/40",
    cardBg: "bg-[#1c1405]/70 backdrop-blur-xl shadow-lg border border-amber-500/30",
    cardBorder: "border-amber-500/30",
    cardBorderHover: "hover:border-amber-300/90",
    cardGlow: "hover:shadow-[0_0_35px_rgba(251,191,36,0.45)]",
    sidebarBg: "bg-[#1c1405]/75 backdrop-blur-2xl shadow-xl border border-amber-500/35",
    sidebarBorder: "border-amber-500/35",
    catBtnBg: "bg-[#291e07]/60 backdrop-blur-md",
    catBtnText: "text-amber-200/90 hover:text-white",
    catBtnBorder: "border-amber-500/25",
    inputBg: "bg-[#140e03]/70 backdrop-blur-md",
    inputBorder: "border-amber-500/40",
    inputText: "text-amber-100",
    siteCardBg: "bg-gradient-to-b from-[#2b1f07]/85 to-[#120c02]/95 backdrop-blur-xl",
    siteCardBorder: "border-amber-500/30",
    sqIconBg: "bg-[#3f2e0b]/90 border border-amber-300/40",
    sqIconBorder: "border-amber-300/40",
    footerBg: "bg-[#070501]/90 backdrop-blur-xl",
    footerBorder: "border-amber-950",
    modalBg: "bg-[#171104]/90 backdrop-blur-2xl",
    modalBorder: "border-amber-500/50 shadow-[0_0_50px_rgba(251,191,36,0.3)]",
    modalText: "text-amber-100",
    aura1: "bg-amber-500/20",
    aura2: "bg-yellow-600/15",
    accentBadge: "bg-amber-950/90 text-amber-200 border-amber-400/40 backdrop-blur-md",
    categoryBar: "bg-amber-300 shadow-[0_0_15px_#fde047]",
    galaxyConfig: {
      spaceBg: "#0b0802",
      nebula1: "rgba(251, 191, 36, 0.25)",
      nebula2: "rgba(245, 158, 11, 0.20)",
      nebula3: "rgba(202, 138, 4, 0.16)",
      starColor: "#fef08a",
      accentGlow: "#fde047",
    },
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  "MOVIES & TV SHOWS": "🎬",
  "ONLY 4K": "💎",
  "ANIME": "⚡",
  "MANGA": "📖",
  "LIVE TV & SPORTS": "📺",
  "PAID": "⭐",
  "APPS": "📱",
  "AI TOOLS": "🤖",
  "DOWNLOADS": "⬇️",
  "AD BLOCKERS": "🛡️",
};

export default function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("MOVIES & TV SHOWS");
  const [selectedRegion, setSelectedRegion] = useState("US");
  const [showModal, setShowModal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Theme State
  const [currentTheme, setCurrentTheme] = useState<string>("midnight");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("allsitehub_theme");
      if (savedTheme && THEME_STYLES[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    }
  }, []);

  const handleThemeChange = (themeKey: string) => {
    if (THEME_STYLES[themeKey]) {
      setCurrentTheme(themeKey);
      if (typeof window !== "undefined") {
        localStorage.setItem("allsitehub_theme", themeKey);
      }
    }
  };

  const activeTheme = THEME_STYLES[currentTheme] || THEME_STYLES.midnight;

  // Dynamic Sites List State
  const [sitesList, setSitesList] = useState<SiteItem[]>(STREAMING_SITES);

  useEffect(() => {
    setSitesList(getSavedSites());
    const handleSitesUpdate = () => setSitesList(getSavedSites());
    window.addEventListener("allsitehub_sites_updated", handleSitesUpdate);
    window.addEventListener("storage", handleSitesUpdate);
    return () => {
      window.removeEventListener("allsitehub_sites_updated", handleSitesUpdate);
      window.removeEventListener("storage", handleSitesUpdate);
    };
  }, []);

  const isManualClickRef = useRef(false);
  const manualClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    isManualClickRef.current = true;
    if (manualClickTimeoutRef.current) clearTimeout(manualClickTimeoutRef.current);
    manualClickTimeoutRef.current = setTimeout(() => {
      isManualClickRef.current = false;
    }, 1000);

    const slug = catName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const el = document.getElementById(`cat-${slug}`);
    if (el) {
      const yOffset = -100; // Header offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scroll Spy: Automatically switch active category as user scrolls down the page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (isManualClickRef.current) return;

      const categoryItems = CATEGORIES.map((catName) => {
        const slug = catName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const el = document.getElementById(`cat-${slug}`);
        return { name: catName, el };
      }).filter((item) => item.el !== null);

      const scrollPosition = window.scrollY + 160; // Offset for sticky navbar

      let currentCat = selectedCategory;
      for (let i = categoryItems.length - 1; i >= 0; i--) {
        const item = categoryItems[i];
        if (item.el && item.el.offsetTop <= scrollPosition) {
          currentCat = item.name;
          break;
        }
      }

      if (currentCat && currentCat !== selectedCategory) {
        setSelectedCategory(currentCat);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchQuery, sitesList, selectedCategory]);

  // Dynamic Home Banner State
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(DEFAULT_BANNER_CONFIG);

  useEffect(() => {
    setBannerConfig(getBannerConfig());
    const handleUpdate = () => setBannerConfig(getBannerConfig());
    window.addEventListener("allsitehub_banner_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("allsitehub_banner_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Mobile Menu Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live Site Counter State - bound to sitesList.length
  const totalSitesCount = sitesList.length;
  const [siteCount, setSiteCount] = useState(0);

  // Form states for Request Site Modal
  const [reqSiteName, setReqSiteName] = useState("");
  const [reqSiteUrl, setReqSiteUrl] = useState("");
  const [reqSiteCategory, setReqSiteCategory] = useState("MOVIES & TV SHOWS");
  const [reqFeatures, setReqFeatures] = useState("");
  const [reqRegion, setReqRegion] = useState("US");
  const [reqSuccess, setReqSuccess] = useState(false);

  // Smooth count-up animation on mount
  useEffect(() => {
    let start = 0;
    const end = totalSitesCount;
    if (start === end) {
      setSiteCount(end);
      return;
    }

    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / Math.max(end, 1)));

    const timer = setInterval(() => {
      start += 1;
      setSiteCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 20));

    return () => clearInterval(timer);
  }, [totalSitesCount]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReqSuccess(true);
    setTimeout(() => {
      setReqSuccess(false);
      setShowModal(null);
      setReqSiteName("");
      setReqSiteUrl("");
      setReqFeatures("");
    }, 2000);
  };

  // Utility to calculate real-time category counts
  const getCategoryCount = (categoryName: string) => {
    return sitesList.filter((site) => site.category === categoryName).length;
  };

  return (
    <div className={`min-h-screen flex flex-col relative ${activeTheme.pageBg} ${activeTheme.textColor} ${activeTheme.textureClass} selection:bg-purple-500 selection:text-white transition-colors duration-500`}>
      {/* JSON-LD STRUCTURED DATA SCHEMA FOR GOOGLE SEARCH & RICH SNIPPETS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://allsitehub.online/#website",
                "url": "https://allsitehub.online",
                "name": "AllSiteHub",
                "description": "Discover verified streaming portals, anime hubs, 4K movies, live sports, AI tools & developer utilities.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://allsitehub.online/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "Organization",
                "@id": "https://allsitehub.online/#organization",
                "name": "AllSiteHub",
                "url": "https://allsitehub.online",
                "logo": "https://allsitehub.online/favicon.ico",
                "sameAs": [
                  "https://discord.gg/QnTrWqwcJ",
                  "https://www.reddit.com/user/Ill_Committee7612/",
                  "https://t.me/allsitehub"
                ]
              },
              {
                "@type": "FAQPage",
                "@id": "https://allsitehub.online/#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Is Allsitehub completely free to use?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, Allsitehub is a 100% free open web directory. No sign-up or registration is required to access verified portal mirrors."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What categories of sites are listed on Allsitehub?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Allsitehub catalogs sites across Movies & TV Shows, Only 4K, Anime, Manga, Live TV & Sports, Paid services, Mobile Apps, AI Tools, Downloads, and Ad Blockers."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does Allsitehub host media files on its servers?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No, Allsitehub does not host any media files or copyrighted content. It serves purely as an indexed gateway pointing to external web services."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* 1. LIVE GALAXY BACKGROUND EFFECT CANVAS */}
      <GalaxyBackground themeConfig={activeTheme.galaxyConfig} />

      {/* TOP BACKGROUND AURAS */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px] opacity-40 z-0 animate-pulse-glow" style={{ background: activeTheme.galaxyConfig.nebula1 }} />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px] opacity-35 z-0 animate-pulse-glow" style={{ background: activeTheme.galaxyConfig.nebula2 }} />

      {/* GLASS HEADER / NAVBAR */}
      <header className={`sticky top-0 z-40 w-full ${activeTheme.headerBg} transition-all duration-300`}>
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-3 flex items-center justify-between gap-4">
          
          {/* Left Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveNav("Home")}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090714] rounded-[10px] flex items-center justify-center font-black italic text-base sm:text-lg text-purple-400">
                AH
              </div>
            </div>
            <span className={`font-extrabold text-xl sm:text-2xl tracking-tight ${activeTheme.headingColor} flex items-center`}>
              Allsite<span className={`${activeTheme.brandText} group-hover:opacity-90 transition-colors ml-0.5`}>hub</span>
            </span>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className={`hidden md:flex items-center gap-1 ${activeTheme.inputBg} p-1.5 rounded-full border ${activeTheme.inputBorder} shadow-inner`}>
            {["Home", "Request Site", "About", "DMCA", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  if (item === "Request Site") setShowModal("request");
                  else if (item === "DMCA") setShowModal("dmca");
                  else if (item === "Contact") setShowModal("contact");
                  else if (item === "About") setShowModal("about");
                }}
                className={`px-3 lg:px-4.5 py-2 rounded-full text-xs lg:text-sm font-bold transition-all relative cursor-pointer ${
                  activeNav === item
                    ? activeTheme.activeNavBg
                    : activeTheme.inactiveNavText
                }`}
              >
                {item}
                {activeNav === item && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-purple-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Header Items: Themes, Region, Live Counter */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Theme Button */}
            <button
              onClick={() => setShowModal("themes")}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border cursor-pointer hover:scale-105 backdrop-blur-md ${activeTheme.inputBg} ${activeTheme.inputBorder} ${activeTheme.textColor}`}
              title="Explore Live Galaxy Themes"
            >
              <span className="text-sm">🎨</span>
              <span>Themes</span>
              <span className="text-[10px] font-mono font-bold opacity-80">({activeTheme.name})</span>
            </button>

            {/* Region Selector */}
            <div className="relative hidden sm:block">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={`appearance-none ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.textColor} text-xs font-semibold px-3 py-1.5 pr-7 rounded-full cursor-pointer focus:outline-none transition-colors backdrop-blur-md`}
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

            {/* LIVE ANIMATED COUNTER BADGE */}
            <div className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#081814]/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-extrabold text-emerald-300">
                {siteCount}
              </span>
              <span className="text-emerald-500/80 font-normal hidden 2xl:inline">Portals</span>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#0c0919]/80 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-purple-500/20 flex flex-col gap-2.5 bg-[#090717]/95 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="relative mb-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                🔍
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sites, anime, movies..."
                className="w-full pl-8 pr-8 py-2.5 bg-[#120e29]/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs opacity-70 hover:opacity-100 text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Theme & Region Controls */}
            <div className="grid grid-cols-2 gap-2 my-1">
              <button
                onClick={() => {
                  setShowModal("themes");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl bg-[#120e29]/90 border border-purple-500/30 text-xs font-extrabold text-white backdrop-blur-md active:scale-95 transition-all"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span>🎨</span>
                  <span className="truncate">Themes</span>
                </span>
                <span className="text-[10px] font-mono text-purple-300 font-bold px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40">
                  {activeTheme.icon}
                </span>
              </button>

              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full appearance-none bg-[#120e29]/90 border border-slate-700 text-white text-xs font-semibold px-3 py-2 pr-6 rounded-xl cursor-pointer focus:outline-none backdrop-blur-md"
                >
                  <option value="US">🌐 US</option>
                  <option value="UK">🌐 UK</option>
                  <option value="EU">🌐 EU</option>
                  <option value="IN">🌐 IN</option>
                  <option value="GLOBAL">🌐 Global</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* Navigation Links Grid (Includes Request Site) */}
            <div className="grid grid-cols-2 gap-2">
              {["Home", "Request Site", "About", "DMCA", "Contact"].map((item) => (
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
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                    activeNav === item
                      ? "bg-purple-600 text-white shadow-md font-extrabold"
                      : "bg-[#120e29]/70 text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{item}</span>
                  {activeNav === item && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>

            {/* Quick Community DM Links */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[11px] font-bold">
              <a
                href="https://discord.gg/QnTrWqwcJ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2] border border-[#5865F2]/40 text-purple-200 hover:text-white transition-all"
              >
                💬 Discord
              </a>
              <a
                href="https://www.reddit.com/user/Ill_Committee7612/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center rounded-xl bg-[#FF4500]/20 hover:bg-[#FF4500] border border-[#FF4500]/40 text-orange-200 hover:text-white transition-all"
              >
                🔴 Reddit
              </a>
              <a
                href="https://t.me/allsitehub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc] border border-[#0088cc]/40 text-sky-200 hover:text-white transition-all"
              >
                ✈️ Telegram
              </a>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-4 sm:py-8 flex flex-col gap-6 sm:gap-8 relative z-10">
        
        {/* HERO SECTION WITH DYNAMIC BANNER & FEATURED PROMO CARD */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center relative">

          {/* Left Column Text Content */}
          <div className={`${bannerConfig.promoEnabled !== false ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col gap-4 sm:gap-5 relative z-20 text-center lg:text-left items-center lg:items-start transition-all duration-300`}>
            
            {/* Top Glowing Badge */}
            <div className={`w-fit flex items-center gap-2 px-3.5 py-1 rounded-full ${activeTheme.accentBadge} text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md shadow-sm`}>
              <span className="text-sm sm:text-base">{bannerConfig.badgeIcon || "⚡"}</span>
              {bannerConfig.badgeText || "THE ULTIMATE STREAMING HUB"}
            </div>

            {/* Main Headline (Single H1 for Strict SEO Compliance) */}
            <div className="flex flex-col gap-1 w-full drop-shadow-sm">
              <h1 className={`text-3xl xs:text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight ${activeTheme.headingColor} uppercase leading-[1.1]`}>
                <span>
                  {bannerConfig.line1Text}{" "}
                  <span className={`brush-font ${activeTheme.brandText} font-bold tracking-wider italic text-4xl xs:text-5xl sm:text-7xl xl:text-8xl 2xl:text-9xl hover:scale-105 transition-transform inline-block ml-1 sm:ml-2 normal-case drop-shadow-md`}>
                    {bannerConfig.line1Highlight}
                  </span>
                </span>
                <span className="block mt-1">
                  {bannerConfig.line2Text}{" "}
                  <span className={`brush-font ${activeTheme.brandText} font-bold tracking-wider italic text-4xl xs:text-5xl sm:text-7xl xl:text-8xl 2xl:text-9xl hover:scale-105 transition-transform inline-block ml-1 sm:ml-2 normal-case drop-shadow-md`}>
                    {bannerConfig.line2Highlight}
                  </span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className={`text-sm sm:text-base xl:text-lg ${activeTheme.subtextColor} font-medium max-w-2xl leading-relaxed`}>
              {bannerConfig.description}
            </p>

            {/* Action Buttons & Community Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("browse-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3.5 rounded-full purple-btn-primary text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Directory</span>
                <span className="text-base font-bold">↓</span>
              </button>

              <a
                href="https://discord.gg/QnTrWqwcJ"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-[#5865F2]/25 hover:bg-[#5865F2] border border-[#5865F2]/60 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:scale-105 cursor-pointer backdrop-blur-md"
              >
                <span>💬 Join Discord</span>
              </a>

              <a
                href="https://www.reddit.com/user/Ill_Committee7612/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-[#FF4500]/25 hover:bg-[#FF4500] border border-[#FF4500]/60 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,69,0,0.3)] hover:scale-105 cursor-pointer backdrop-blur-md"
              >
                <span>🔴 Reddit Profile</span>
              </a>
            </div>
          </div>

          {/* Right Column Featured Rectangle Promo Banner (Clear Graphic & Small Corner Visit Button) */}
          {bannerConfig.promoEnabled !== false && (
            <div className="lg:col-span-5 flex justify-center lg:justify-end z-20 w-full">
              <a
                href={bannerConfig.promoTargetUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full ${activeTheme.cardBg} border ${activeTheme.cardBorder} hover:${activeTheme.cardBorderHover} rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 relative group overflow-hidden flex flex-col justify-between min-h-[200px] sm:min-h-[230px] cursor-pointer`}
              >
                {/* Background Hero Banner Graphic (Clear & Prominent) */}
                {bannerConfig.heroImageUrl && bannerConfig.heroImageUrl !== "/hero_banner.png" ? (
                  <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none overflow-hidden">
                    <img
                      src={bannerConfig.heroImageUrl}
                      alt={bannerConfig.promoSiteName || "Banner"}
                      className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-indigo-950/30 to-black/60 pointer-events-none" />
                )}

                {/* Glowing Aura Accent */}
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/35 transition-all pointer-events-none z-0" />

                {/* Top Row: Small Badge Tag & Small Corner Visit Button */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-xs">
                      <span>⭐</span>
                      <span>{bannerConfig.cardBadgeText || "FEATURED"}</span>
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                      ● LIVE
                    </span>
                  </div>

                  {/* SMALL CORNER VISIT BUTTON */}
                  <span className="px-3 py-1 rounded-full bg-purple-600/90 group-hover:bg-purple-500 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all group-hover:scale-105 shrink-0 backdrop-blur-md">
                    <span>{bannerConfig.promoButtonText || "Visit"}</span>
                    <span className="text-xs font-bold">{bannerConfig.promoButtonIcon || "↗"}</span>
                  </span>
                </div>

                {/* Bottom Row: Compact Title, Tagline & Small Hashtags */}
                <div className="flex flex-col gap-1 relative z-10 mt-auto pt-4">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-md group-hover:text-purple-300 transition-colors">
                    {bannerConfig.promoSiteName || "Featured Portal"}
                  </h3>
                  
                  {bannerConfig.promoTagline && (
                    <p className="text-xs text-slate-200/90 leading-snug line-clamp-1 drop-shadow-sm font-medium">
                      {bannerConfig.promoTagline}
                    </p>
                  )}

                  {/* Compact Interactive Hashtags Chips */}
                  {bannerConfig.promoHashtags && bannerConfig.promoHashtags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {bannerConfig.promoHashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] sm:text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-black/70 text-purple-300 border border-purple-500/30 backdrop-blur-md shadow-xs"
                        >
                          {tag.startsWith("#") ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </div>
          )}
        </section>

        {/* FEATURE STATS STRIP */}
        <section className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-3xl ${activeTheme.cardBg} border ${activeTheme.cardBorder} shadow-lg backdrop-blur-2xl`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-lg sm:text-xl shrink-0 backdrop-blur-md`}>
              ⚡
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-black ${activeTheme.headingColor} uppercase tracking-wider`}>Lightning Fast</h4>
              <p className={`text-[10px] sm:text-xs ${activeTheme.mutedText}`}>Instant zero-lag links</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-lg sm:text-xl shrink-0 backdrop-blur-md`}>
              🎯
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-black ${activeTheme.headingColor} uppercase tracking-wider`}>Verified Portals</h4>
              <p className={`text-[10px] sm:text-xs ${activeTheme.mutedText}`}>100% clean & secure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-lg sm:text-xl shrink-0 backdrop-blur-md`}>
              🛡️
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-black ${activeTheme.headingColor} uppercase tracking-wider`}>No Sign-up</h4>
              <p className={`text-[10px] sm:text-xs ${activeTheme.mutedText}`}>Free open directory</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-lg sm:text-xl shrink-0 backdrop-blur-md`}>
              🔄
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-black ${activeTheme.headingColor} uppercase tracking-wider`}>Daily Updates</h4>
              <p className={`text-[10px] sm:text-xs ${activeTheme.mutedText}`}>Fresh mirrors added</p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DIRECTORY SECTION - LEFT SIDEBAR CATEGORY LAYOUT */}
        <section id="browse-directory" className="flex flex-col gap-5 pt-2 sm:pt-4">
          
          {/* MAIN DIRECTORY LAYOUT: LEFT SIDEBAR + RIGHT CARDS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* LEFT SIDEBAR CATEGORIES - DESKTOP ONLY (hidden lg:flex) */}
            <aside
              className={`hidden lg:flex lg:col-span-3 sticky top-24 self-start z-30 flex-col gap-2.5 ${activeTheme.sidebarBg} border ${activeTheme.sidebarBorder} rounded-3xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-2xl transition-all`}
            >
              <div className={`flex items-center justify-between px-1 pb-3 border-b ${activeTheme.headerBorder}`}>
                <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${activeTheme.brandText} flex items-center gap-2`}>
                  <span>📂</span>
                  <span>Categories ({CATEGORIES.length})</span>
                </span>
                <span className={`text-xs font-mono font-extrabold ${activeTheme.accentBadge} px-2.5 py-0.5 rounded-full border`}>
                  {totalSitesCount} Portals
                </span>
              </div>

              {/* Category Buttons List */}
              <div className="flex flex-col gap-2">
                {[
                  { name: "MOVIES & TV SHOWS", label: "MOVIES & TV SHOWS", icon: "🎬" },
                  { name: "ONLY 4K", label: "ONLY 4K", icon: "💎" },
                  { name: "ANIME", label: "ANIME", icon: "⚡" },
                  { name: "MANGA", label: "MANGA", icon: "📖" },
                  { name: "LIVE TV & SPORTS", label: "LIVE TV & SPORTS", icon: "📺" },
                  { name: "PAID", label: "PAID", icon: "⭐" },
                  { name: "APPS", label: "APPS", icon: "📱" },
                  { name: "AI TOOLS", label: "AI TOOLS", icon: "🤖" },
                  { name: "DOWNLOADS", label: "DOWNLOADS", icon: "⬇️" },
                  { name: "AD BLOCKERS", label: "AD BLOCKERS", icon: "🛡️" },
                ].map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  const catCount = getCategoryCount(cat.name);

                  return (
                    <button
                      key={cat.name}
                      data-active={isSelected}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`group relative flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer ${
                        isSelected
                          ? activeTheme.activeNavBg
                          : `${activeTheme.catBtnBg} ${activeTheme.catBtnText} border ${activeTheme.catBtnBorder} hover:scale-[1.02]`
                      }`}
                    >
                      {isSelected && (
                        <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-r-full shadow-md ${activeTheme.categoryBar}`} />
                      )}

                      <span className="flex items-center gap-3 text-xs sm:text-sm font-black tracking-wide truncate">
                        <span className="text-base sm:text-lg">{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </span>

                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                          isSelected
                            ? `${activeTheme.accentBadge} font-black`
                            : `${activeTheme.inputBg} ${activeTheme.mutedText} border-slate-700`
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
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#5865F2]/25 via-[#404EED]/20 to-purple-900/30 border border-[#5865F2]/40 hover:border-[#5865F2] hover:shadow-md transition-all cursor-pointer overflow-hidden mt-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 relative z-10">
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

              {/* REDDIT COMMUNITY BANNER */}
              <a
                href="https://www.reddit.com/user/Ill_Committee7612/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FF4500]/25 via-[#e03d00]/20 to-amber-900/30 border border-[#FF4500]/40 hover:border-[#FF4500] hover:shadow-md transition-all cursor-pointer overflow-hidden mt-2.5 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white group-hover:text-orange-200 flex items-center gap-1.5">
                      <span>REDDIT PROFILE</span>
                      <span className="text-[9px] text-orange-400 font-bold font-mono px-1.5 py-0.5 rounded bg-orange-950/80 border border-orange-500/30">● ACTIVE</span>
                    </span>
                    <span className="text-[10px] font-medium text-slate-300">
                      Follow & Discuss Updates
                    </span>
                  </div>
                </div>

                <span className="text-[#FF4500] font-black text-xs group-hover:translate-x-1 group-hover:text-white transition-all flex items-center gap-0.5 shrink-0">
                  <span>Visit</span>
                  <span className="text-sm">↗</span>
                </span>
              </a>
            </aside>

            {/* RIGHT MAIN DIRECTORY CARDS GRID & MOBILE HORIZONTAL CATEGORY BAR */}
            <div className="lg:col-span-9 flex flex-col gap-5 w-full">

              {/* MOBILE HORIZONTAL GLASS CATEGORIES BAR (lg:hidden) */}
              <div className="lg:hidden sticky top-14 sm:top-16 z-30 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-3 rounded-2xl ${activeTheme.headerBg} border ${activeTheme.headerBorder} shadow-xl backdrop-blur-2xl my-1">
                {[
                  { name: "MOVIES & TV SHOWS", label: "MOVIES & TV SHOWS", icon: "🎬" },
                  { name: "ONLY 4K", label: "ONLY 4K", icon: "💎" },
                  { name: "ANIME", label: "ANIME", icon: "⚡" },
                  { name: "MANGA", label: "MANGA", icon: "📖" },
                  { name: "LIVE TV & SPORTS", label: "LIVE TV & SPORTS", icon: "📺" },
                  { name: "PAID", label: "PAID", icon: "⭐" },
                  { name: "APPS", label: "APPS", icon: "📱" },
                  { name: "AI TOOLS", label: "AI TOOLS", icon: "🤖" },
                  { name: "DOWNLOADS", label: "DOWNLOADS", icon: "⬇️" },
                  { name: "AD BLOCKERS", label: "AD BLOCKERS", icon: "🛡️" },
                ].map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  const catCount = getCategoryCount(cat.name);

                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all shrink-0 active:scale-95 cursor-pointer ${
                        isSelected
                          ? activeTheme.activeNavBg
                          : `${activeTheme.catBtnBg} ${activeTheme.catBtnText} border ${activeTheme.catBtnBorder}`
                      }`}
                    >
                      <span className="text-sm">{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/25 text-white font-bold" : "bg-black/40 text-slate-300"}`}>
                        {catCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* DIRECTORY SEARCH & VIEW TOGGLE ROW */}
              <div className="flex items-center justify-between gap-4 px-2 pb-4 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs sm:text-sm font-mono font-black px-3.5 py-1.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 backdrop-blur-md shadow-sm">
                    {totalSitesCount} Verified Portals
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* DIRECTORY SEARCH INPUT BAR */}
                  <div className="relative flex-1 sm:w-64 xl:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs opacity-70">
                      🔍
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search portals, streaming, anime..."
                      className={`w-full pl-9 pr-8 py-2.5 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-full text-xs sm:text-sm placeholder-slate-400 focus:outline-none transition-all shadow-inner backdrop-blur-md`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs opacity-70 hover:opacity-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* View Layout Toggle Switch */}
                  <div className={`flex items-center gap-1 ${activeTheme.inputBg} border ${activeTheme.inputBorder} p-1 rounded-2xl shadow-inner shrink-0 backdrop-blur-md`}>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "grid"
                          ? activeTheme.activeNavBg
                          : `${activeTheme.mutedText} hover:bg-white/5`
                      }`}
                      title="Large Square Card Grid View"
                    >
                      <span className="text-xs font-black">⊞</span>
                      <span className="hidden sm:inline">Grid</span>
                    </button>

                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "list"
                          ? activeTheme.activeNavBg
                          : `${activeTheme.mutedText} hover:bg-white/5`
                      }`}
                      title="Compact List View"
                    >
                      <span className="text-xs font-black">☰</span>
                      <span className="hidden sm:inline">List</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Directory Sites Rendering: Grouped by Proper Category Sections */}
              {CATEGORIES.map((catName) => {
                const catSites = sitesList.filter((site) => {
                  if (site.category !== catName) return false;
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    site.name.toLowerCase().includes(q) ||
                    site.domain.toLowerCase().includes(q) ||
                    site.tags.some((t) => t.toLowerCase().includes(q))
                  );
                });

                if (catSites.length === 0 && searchQuery.trim()) return null;

                const catSlug = catName.toLowerCase().replace(/[^a-z0-9]/g, "-");
                const icon = CATEGORY_ICONS[catName] || "🎬";

                return (
                  <section
                    key={catName}
                    id={`cat-${catSlug}`}
                    data-category={catName}
                    className="flex flex-col gap-4 scroll-mt-28 lg:scroll-mt-24 mb-8"
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between px-2 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-7 rounded-full ${activeTheme.categoryBar}`} />
                        <span className="text-2xl sm:text-3xl">{icon}</span>
                        <h2 className={`text-xl sm:text-2xl font-black ${activeTheme.headingColor} tracking-tight flex items-center gap-3 uppercase`}>
                          <span>{catName}</span>
                        </h2>
                        <span className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full border ${activeTheme.accentBadge}`}>
                          {catSites.length}
                        </span>
                      </div>
                    </div>

                    {/* Category Sites Grid or List View - SLIGHTLY BIGGER CARDS */}
                    {catSites.length === 0 ? (
                      <div className={`p-8 rounded-3xl ${activeTheme.cardBg} border ${activeTheme.cardBorder} text-center text-xs sm:text-sm ${activeTheme.mutedText} backdrop-blur-xl`}>
                        No portals added yet in {catName}.
                      </div>
                    ) : viewMode === "grid" ? (
                      /* SLIGHTLY BIGGER CARDS GRID - 2 to 6 columns with spacious gaps & padding */
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
                        {catSites.map((site) => (
                          <a
                            key={site.id}
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group card-square relative ${activeTheme.siteCardBg} border ${activeTheme.siteCardBorder} ${activeTheme.cardBorderHover} rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.03] active:scale-[0.98] shadow-md ${activeTheme.cardGlow} cursor-pointer overflow-hidden backdrop-blur-xl min-h-[170px] sm:min-h-[190px]`}
                          >
                            {/* Top Badge Tag */}
                            <div className="absolute top-2.5 left-2.5 z-20">
                              {site.isTrusted ? (
                                <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider shadow-sm backdrop-blur-md">
                                  TRUSTED
                                </span>
                              ) : site.isFeatured ? (
                                <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-950/90 text-amber-400 border border-amber-500/40 uppercase tracking-wider shadow-sm backdrop-blur-md">
                                  FEATURED
                                </span>
                              ) : site.isNew ? (
                                <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-950/90 text-blue-400 border border-blue-500/40 uppercase tracking-wider shadow-sm backdrop-blur-md">
                                  NEW
                                </span>
                              ) : site.badge ? (
                                <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md ${activeTheme.accentBadge} uppercase tracking-wider shadow-sm backdrop-blur-md`}>
                                  {site.badge}
                                </span>
                              ) : null}
                            </div>

                            {/* Slightly Bigger Icon Squircle Box */}
                            <div className={`sq-icon-btn w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 p-2.5 sm:p-3 rounded-2xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 shadow-md my-auto backdrop-blur-md mt-4 sm:mt-5`}>
                              <img
                                src={getFaviconUrl(site.domain || site.url)}
                                alt={site.name}
                                className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const domain = getCleanDomain(site.domain || site.url);
                                  if (!target.dataset.triedFallback) {
                                    target.dataset.triedFallback = "true";
                                    target.src = `https://icon.horse/icon/${domain}`;
                                  }
                                }}
                              />
                            </div>

                            {/* Card Details - Enlarged Typography */}
                            <div className="w-full flex flex-col items-center gap-1 mt-auto pt-3 z-10">
                              <h3 className={`font-black ${activeTheme.headingColor} text-xs sm:text-sm tracking-wide uppercase group-hover:${activeTheme.brandText} transition-colors truncate w-full`}>
                                {site.name}
                              </h3>
                              <span className={`text-[10px] sm:text-xs font-mono ${activeTheme.mutedText} flex items-center justify-center gap-1 truncate w-full`}>
                                <span className="text-[9px] opacity-70">🌐</span>
                                <span className="truncate">{site.domain}</span>
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      /* LIST VIEW - ENLARGED CARDS */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                        {catSites.map((site) => (
                          <a
                            key={site.id}
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group card-square relative ${activeTheme.siteCardBg} border ${activeTheme.siteCardBorder} ${activeTheme.cardBorderHover} rounded-2xl p-4 sm:p-4.5 flex items-center justify-between gap-3.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md ${activeTheme.cardGlow} cursor-pointer overflow-hidden backdrop-blur-xl`}
                          >
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${activeTheme.categoryBar} opacity-70 group-hover:opacity-100 transition-opacity`} />
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className={`sq-icon-btn w-12 h-12 p-2 sm:p-2.5 ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300 shadow-md backdrop-blur-md`}>
                                <img
                                  src={getFaviconUrl(site.domain || site.url)}
                                  alt={site.name}
                                  className="w-full h-full object-contain drop-shadow-md"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    const domain = getCleanDomain(site.domain || site.url);
                                    if (!target.dataset.triedFallback) {
                                      target.dataset.triedFallback = "true";
                                      target.src = `https://icon.horse/icon/${domain}`;
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <h3 className={`font-black ${activeTheme.headingColor} text-xs sm:text-sm tracking-wide uppercase group-hover:${activeTheme.brandText} transition-colors truncate`}>
                                  {site.name}
                                </h3>
                                <span className={`text-[10px] sm:text-xs font-mono ${activeTheme.mutedText} truncate`}>
                                  {site.domain}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-black opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0">
                              ↗
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* MODALS OVERHAUL - THEMES & DIALOGS */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`${activeTheme.modalBg} border ${activeTheme.modalBorder} ${activeTheme.modalText} rounded-3xl p-6 sm:p-8 ${showModal === "themes" ? "max-w-3xl" : "max-w-md"} w-full flex flex-col gap-6 relative shadow-2xl my-auto max-h-[90vh] overflow-y-auto backdrop-blur-2xl`}>
            
            {/* Modal Title Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className={`text-lg sm:text-xl font-extrabold ${activeTheme.headingColor} flex items-center gap-2.5`}>
                {showModal === "request" && <span>📝 Request a New Site</span>}
                {showModal === "themes" && <span>🎨 Live Dark Themes Palette</span>}
                {showModal === "about" && <span>ℹ️ About Allsitehub</span>}
                {showModal === "dmca" && <span>🛡️ DMCA Disclaimer</span>}
                {showModal === "contact" && <span>💬 Contact Support</span>}
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="opacity-70 hover:opacity-100 p-1.5 rounded-full hover:bg-white/10 transition-colors text-base"
              >
                ✕
              </button>
            </div>

            {/* UNIFIED LIVE DARK THEMES MODAL */}
            {showModal === "themes" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <p className={`text-xs sm:text-sm font-medium ${activeTheme.subtextColor}`}>
                    Select from 10 live dark cosmic themes. Each theme features live background particle colors and glass accents.
                  </p>
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${activeTheme.accentBadge} backdrop-blur-md`}>
                    Active: {activeTheme.name}
                  </span>
                </div>

                {/* 10 Dark Live Themes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {Object.entries(THEME_STYLES).map(([key, t]) => {
                    const isSelected = currentTheme === key;

                    return (
                      <button
                        key={key}
                        onClick={() => {
                          handleThemeChange(key);
                          setShowModal(null);
                        }}
                        className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                          isSelected
                            ? "border-purple-400 ring-2 ring-purple-400/50 bg-purple-600/30 scale-[1.02] shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                            : "border-slate-700/60 hover:border-purple-400/70 bg-slate-900/60 hover:bg-slate-900/90"
                        }`}
                      >
                        {/* Live Color Accent Backdrop */}
                        <div
                          className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
                          style={{ background: t.galaxyConfig.accentGlow }}
                        />

                        <div className="flex items-center justify-between relative z-10">
                          <span className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                            <span className="text-base">{t.icon}</span>
                            <span>{t.name}</span>
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-black text-purple-300 bg-purple-950/90 px-2 py-0.5 rounded-full border border-purple-500/40">
                              ✓ Active
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 relative z-10">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                            style={{ background: t.galaxyConfig.spaceBg }}
                            title="Space Bg"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                            style={{ background: t.galaxyConfig.accentGlow }}
                            title="Accent Glow"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                            style={{ background: t.galaxyConfig.starColor }}
                            title="Star Color"
                          />
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ml-auto bg-slate-950/80 text-purple-300 border border-slate-700/80 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                            Live
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* REQUEST A SITE MODAL WITH DIRECT DM LINKS */}
            {showModal === "request" && (
              <div className="flex flex-col gap-4">
                <div className={`p-4 rounded-2xl ${activeTheme.inputBg} border ${activeTheme.inputBorder} flex flex-col gap-3 shadow-md backdrop-blur-md`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <h4 className={`text-xs sm:text-sm font-black ${activeTheme.headingColor}`}>
                      To add your website fill this, and DM me on anyone of my supports to update
                    </h4>
                  </div>

                  {/* Direct DM Links Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    <a
                      href="https://discord.gg/QnTrWqwcJ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#5865F2]/30 hover:bg-[#5865F2] border border-[#5865F2]/60 text-white text-xs font-extrabold transition-all shadow-sm hover:scale-105 backdrop-blur-md"
                    >
                      <span className="text-sm">💬</span>
                      <span>Discord DM</span>
                    </a>

                    <a
                      href="https://www.reddit.com/user/Ill_Committee7612/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#FF4500]/30 hover:bg-[#FF4500] border border-[#FF4500]/60 text-white text-xs font-extrabold transition-all shadow-sm hover:scale-105 backdrop-blur-md"
                    >
                      <span className="text-sm">🔴</span>
                      <span>Reddit DM</span>
                    </a>

                    <a
                      href="https://t.me/allsitehub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#0088cc]/30 hover:bg-[#0088cc] border border-[#0088cc]/60 text-white text-xs font-extrabold transition-all shadow-sm hover:scale-105 backdrop-blur-md"
                    >
                      <span className="text-sm">✈️</span>
                      <span>Telegram DM</span>
                    </a>
                  </div>
                </div>

                {/* Interactive Site Submission Form */}
                <form onSubmit={handleRequestSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold ${activeTheme.headingColor}`}>
                      Website Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={reqSiteName}
                      onChange={(e) => setReqSiteName(e.target.value)}
                      placeholder="e.g. MyAnimeStream"
                      className={`w-full px-3.5 py-2.5 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-xl text-xs sm:text-sm focus:outline-none transition-all backdrop-blur-md`}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold ${activeTheme.headingColor}`}>
                      Website URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={reqSiteUrl}
                      onChange={(e) => setReqSiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className={`w-full px-3.5 py-2.5 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-xl text-xs sm:text-sm focus:outline-none transition-all backdrop-blur-md`}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold ${activeTheme.headingColor}`}>Category</label>
                    <select
                      value={reqSiteCategory}
                      onChange={(e) => setReqSiteCategory(e.target.value)}
                      className={`w-full px-3.5 py-2.5 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-xl text-xs sm:text-sm focus:outline-none transition-all backdrop-blur-md`}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold ${activeTheme.headingColor}`}>Features / Description</label>
                    <textarea
                      rows={2}
                      value={reqFeatures}
                      onChange={(e) => setReqFeatures(e.target.value)}
                      placeholder="Add any additional details..."
                      className={`w-full px-3.5 py-2.5 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-xl text-xs sm:text-sm focus:outline-none transition-all resize-none backdrop-blur-md`}
                    />
                  </div>

                  {reqSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-bold text-center animate-bounce">
                      ✓ Request Submitted Successfully!
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`mt-1 py-3 rounded-xl ${activeTheme.activeNavBg} text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95`}
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            )}

            {showModal === "about" && (
              <div className={`text-xs sm:text-sm ${activeTheme.subtextColor} leading-relaxed flex flex-col gap-3`}>
                <p>
                  <strong>Allsitehub</strong> is your centralized portal for discovering verified streaming links, anime portals, live sports hubs, and productivity tools.
                </p>
                <p>
                  We catalog over 50,000+ sites across 190+ countries with no registration required.
                </p>
              </div>
            )}

            {showModal === "dmca" && (
              <div className={`text-xs ${activeTheme.subtextColor} leading-relaxed flex flex-col gap-3`}>
                <p>
                  Allsitehub does not host any media files or copyright-protected content on its servers. All links point to external third-party services.
                </p>
                <p>
                  For copyright inquiries, please contact the respective hosting platforms directly.
                </p>
              </div>
            )}

            {showModal === "contact" && (
              <div className={`text-xs sm:text-sm ${activeTheme.subtextColor} flex flex-col gap-4 py-1`}>
                <p className="font-medium">
                  Have questions, partnership inquiries, or need support? Reach out to us directly:
                </p>
                <div className={`p-4 rounded-2xl ${activeTheme.inputBg} border ${activeTheme.inputBorder} flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg backdrop-blur-md`}>
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-lg">✉️</span>
                    <a
                      href="mailto:allsitehubsupport@gmail.com"
                      className={`${activeTheme.brandText} font-mono font-bold text-xs sm:text-sm tracking-wide transition-colors truncate`}
                    >
                      allsitehubsupport@gmail.com
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText("allsitehubsupport@gmail.com")}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                  >
                    Copy Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER - ULTRA WIDE GLASS BAR */}
      <footer className={`mt-auto border-t ${activeTheme.footerBorder} py-6 sm:py-8 ${activeTheme.footerBg} relative z-10 backdrop-blur-2xl`}>
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${activeTheme.headingColor} text-sm`}>Allsite<span className={activeTheme.brandText}>hub</span></span>
            <span className={activeTheme.mutedText}>— The Ultimate Web & Streaming Hub.</span>
          </div>

          <div className={`flex items-center gap-3 sm:gap-4 ${activeTheme.mutedText}`}>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              All Systems Operational
            </span>
            <span>•</span>
            <a
              href="https://discord.gg/QnTrWqwcJ"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#5865F2] transition-colors font-semibold"
            >
              Discord
            </a>
            <span>•</span>
            <a
              href="https://www.reddit.com/user/Ill_Committee7612/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF4500] transition-colors font-semibold"
            >
              Reddit
            </a>
            <span>•</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`hover:${activeTheme.brandText} transition-colors font-semibold cursor-pointer`}
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* FLOATING STICKY MOBILE BOTTOM BAR (MOBILE ONLY: lg:hidden) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden w-[92%] max-w-sm">
        <div className="flex items-center justify-around gap-1 px-3 py-2 rounded-full glass-header border border-purple-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <button
            onClick={() => {
              const el = document.getElementById("browse-directory");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md active:scale-95 cursor-pointer"
          >
            <span>📁</span>
            <span>Portals</span>
          </button>

          <button
            onClick={() => setShowModal("themes")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-extrabold text-[11px] backdrop-blur-md active:scale-95 cursor-pointer"
          >
            <span>🎨</span>
            <span>Themes</span>
          </button>

          <button
            onClick={() => setShowModal("request")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-extrabold text-[11px] backdrop-blur-md active:scale-95 cursor-pointer"
          >
            <span>📝</span>
            <span>Request</span>
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-black text-xs flex items-center justify-center backdrop-blur-md active:scale-95 cursor-pointer"
            title="Back to top"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
