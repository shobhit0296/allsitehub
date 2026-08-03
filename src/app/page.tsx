"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

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
  mode: "dark" | "light";
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
}

const THEME_STYLES: Record<string, ThemeConfig> = {
  // DARK THEMES
  midnight: {
    name: "Midnight Purple",
    mode: "dark",
    icon: "🌌",
    badge: "Dark",
    pageBg: "bg-[#05050c]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-slate-100",
    subtextColor: "text-slate-300",
    headingColor: "text-white",
    mutedText: "text-slate-400",
    headerBg: "bg-[#09061c]/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(168,85,247,0.25)]",
    headerBorder: "border-b-2 border-purple-500/60",
    brandText: "text-purple-400",
    activeNavBg: "bg-purple-600/30 border border-purple-500/60 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-white/10",
    cardBg: "bg-[#090717]/90 shadow-md",
    cardBorder: "border-purple-500/20",
    cardBorderHover: "hover:border-purple-400/80",
    cardGlow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    sidebarBg: "bg-[#090717]/95 shadow-lg",
    sidebarBorder: "border-purple-500/30",
    catBtnBg: "bg-[#0c091f]/80",
    catBtnText: "text-slate-300 hover:text-white",
    catBtnBorder: "border-slate-800/80",
    inputBg: "bg-[#090718]",
    inputBorder: "border-purple-500/30",
    inputText: "text-white",
    siteCardBg: "bg-gradient-to-b from-[#0e0b24]/90 to-[#080616]/95",
    siteCardBorder: "border-slate-800/80",
    sqIconBg: "bg-[#140e33]",
    sqIconBorder: "border-purple-500/30",
    footerBg: "bg-[#040409]",
    footerBorder: "border-slate-800/80",
    modalBg: "bg-[#0b081b]",
    modalBorder: "border-purple-500/40",
    modalText: "text-slate-200",
    aura1: "bg-purple-700/20",
    aura2: "bg-indigo-600/15",
    accentBadge: "bg-purple-950/80 text-purple-300 border-purple-500/30",
    categoryBar: "bg-purple-500 shadow-[0_0_12px_#a855f7]",
  },
  cyber: {
    name: "Cyberpunk Neon",
    mode: "dark",
    icon: "⚡",
    badge: "Dark",
    pageBg: "bg-[#030a16]",
    textureClass: "theme-texture-dots-dark",
    textColor: "text-cyan-100",
    subtextColor: "text-cyan-200/80",
    headingColor: "text-white",
    mutedText: "text-slate-400",
    headerBg: "bg-[#041224]/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(6,182,212,0.3)]",
    headerBorder: "border-b-2 border-cyan-400/60",
    brandText: "text-cyan-400",
    activeNavBg: "bg-cyan-500/30 border border-cyan-400/60 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]",
    inactiveNavText: "text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40",
    cardBg: "bg-[#05152a]/90 shadow-md",
    cardBorder: "border-cyan-500/30",
    cardBorderHover: "hover:border-cyan-400/90",
    cardGlow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.45)]",
    sidebarBg: "bg-[#05152a]/95 shadow-lg",
    sidebarBorder: "border-cyan-500/30",
    catBtnBg: "bg-[#071d38]/80",
    catBtnText: "text-cyan-200/90 hover:text-white",
    catBtnBorder: "border-cyan-900/80",
    inputBg: "bg-[#041124]",
    inputBorder: "border-cyan-500/40",
    inputText: "text-cyan-100",
    siteCardBg: "bg-gradient-to-b from-[#071c38]/90 to-[#030f21]/95",
    siteCardBorder: "border-cyan-900/80",
    sqIconBg: "bg-[#0a274c]",
    sqIconBorder: "border-cyan-500/40",
    footerBg: "bg-[#020710]",
    footerBorder: "border-cyan-950",
    modalBg: "bg-[#041226]",
    modalBorder: "border-cyan-500/50",
    modalText: "text-cyan-100",
    aura1: "bg-cyan-600/20",
    aura2: "bg-pink-600/15",
    accentBadge: "bg-cyan-950/90 text-cyan-300 border-cyan-500/40",
    categoryBar: "bg-cyan-400 shadow-[0_0_12px_#22d3ee]",
  },
  emerald: {
    name: "Emerald Matrix",
    mode: "dark",
    icon: "🟢",
    badge: "Dark",
    pageBg: "bg-[#02120b]",
    textureClass: "theme-texture-mesh-dark",
    textColor: "text-emerald-100",
    subtextColor: "text-emerald-200/80",
    headingColor: "text-white",
    mutedText: "text-emerald-400/60",
    headerBg: "bg-[#031c12]/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(16,185,129,0.3)]",
    headerBorder: "border-b-2 border-emerald-400/60",
    brandText: "text-emerald-400",
    activeNavBg: "bg-emerald-500/30 border border-emerald-400/60 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    inactiveNavText: "text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40",
    cardBg: "bg-[#031d13]/90 shadow-md",
    cardBorder: "border-emerald-500/30",
    cardBorderHover: "hover:border-emerald-400/90",
    cardGlow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.45)]",
    sidebarBg: "bg-[#031d13]/95 shadow-lg",
    sidebarBorder: "border-emerald-500/30",
    catBtnBg: "bg-[#05291b]/80",
    catBtnText: "text-emerald-200/90 hover:text-white",
    catBtnBorder: "border-emerald-900/80",
    inputBg: "bg-[#031a10]",
    inputBorder: "border-emerald-500/40",
    inputText: "text-emerald-100",
    siteCardBg: "bg-gradient-to-b from-[#052b1d]/90 to-[#02150e]/95",
    siteCardBorder: "border-emerald-900/80",
    sqIconBg: "bg-[#083a27]",
    sqIconBorder: "border-emerald-500/40",
    footerBg: "bg-[#010a06]",
    footerBorder: "border-emerald-950",
    modalBg: "bg-[#031d13]",
    modalBorder: "border-emerald-500/50",
    modalText: "text-emerald-100",
    aura1: "bg-emerald-600/20",
    aura2: "bg-teal-600/15",
    accentBadge: "bg-emerald-950/90 text-emerald-300 border-emerald-500/40",
    categoryBar: "bg-emerald-400 shadow-[0_0_12px_#34d399]",
  },
  ocean: {
    name: "Ocean Deep",
    mode: "dark",
    icon: "🌊",
    badge: "Dark",
    pageBg: "bg-[#030914]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-blue-100",
    subtextColor: "text-blue-200/80",
    headingColor: "text-white",
    mutedText: "text-slate-400",
    headerBg: "bg-[#06142a]/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(59,130,246,0.3)]",
    headerBorder: "border-b-2 border-blue-400/60",
    brandText: "text-blue-400",
    activeNavBg: "bg-blue-500/30 border border-blue-400/60 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)]",
    inactiveNavText: "text-slate-300 hover:text-blue-300 hover:bg-blue-950/40",
    cardBg: "bg-[#061730]/90 shadow-md",
    cardBorder: "border-blue-500/30",
    cardBorderHover: "hover:border-blue-400/90",
    cardGlow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]",
    sidebarBg: "bg-[#061730]/95 shadow-lg",
    sidebarBorder: "border-blue-500/30",
    catBtnBg: "bg-[#082247]/80",
    catBtnText: "text-blue-200/90 hover:text-white",
    catBtnBorder: "border-blue-900/80",
    inputBg: "bg-[#041328]",
    inputBorder: "border-blue-500/40",
    inputText: "text-blue-100",
    siteCardBg: "bg-gradient-to-b from-[#08244b]/90 to-[#031124]/95",
    siteCardBorder: "border-blue-900/80",
    sqIconBg: "bg-[#0b3368]",
    sqIconBorder: "border-blue-500/40",
    footerBg: "bg-[#01050d]",
    footerBorder: "border-blue-950",
    modalBg: "bg-[#061730]",
    modalBorder: "border-blue-500/50",
    modalText: "text-blue-100",
    aura1: "bg-blue-600/20",
    aura2: "bg-sky-600/15",
    accentBadge: "bg-blue-950/90 text-blue-300 border-blue-500/40",
    categoryBar: "bg-blue-400 shadow-[0_0_12px_#60a5fa]",
  },
  crimson: {
    name: "Crimson Red",
    mode: "dark",
    icon: "🔥",
    badge: "Dark",
    pageBg: "bg-[#0d0306]",
    textureClass: "theme-texture-dots-dark",
    textColor: "text-rose-100",
    subtextColor: "text-rose-200/80",
    headingColor: "text-white",
    mutedText: "text-slate-400",
    headerBg: "bg-[#1c050a]/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(244,63,94,0.3)]",
    headerBorder: "border-b-2 border-rose-500/60",
    brandText: "text-rose-400",
    activeNavBg: "bg-rose-500/30 border border-rose-400/60 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]",
    inactiveNavText: "text-slate-300 hover:text-rose-300 hover:bg-rose-950/40",
    cardBg: "bg-[#190509]/90 shadow-md",
    cardBorder: "border-rose-500/30",
    cardBorderHover: "hover:border-rose-400/90",
    cardGlow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.45)]",
    sidebarBg: "bg-[#190509]/95 shadow-lg",
    sidebarBorder: "border-rose-500/30",
    catBtnBg: "bg-[#28080f]/80",
    catBtnText: "text-rose-200/90 hover:text-white",
    catBtnBorder: "border-rose-900/80",
    inputBg: "bg-[#150407]",
    inputBorder: "border-rose-500/40",
    inputText: "text-rose-100",
    siteCardBg: "bg-gradient-to-b from-[#28080f]/90 to-[#120306]/95",
    siteCardBorder: "border-rose-900/80",
    sqIconBg: "bg-[#3d0b16]",
    sqIconBorder: "border-rose-500/40",
    footerBg: "bg-[#080103]",
    footerBorder: "border-rose-950",
    modalBg: "bg-[#180509]",
    modalBorder: "border-rose-500/50",
    modalText: "text-rose-100",
    aura1: "bg-rose-600/20",
    aura2: "bg-red-600/15",
    accentBadge: "bg-rose-950/90 text-rose-300 border-rose-500/40",
    categoryBar: "bg-rose-400 shadow-[0_0_12px_#fb7185]",
  },

  // BRIGHT / LIGHT THEMES
  sunburst: {
    name: "Sunburst Gold",
    mode: "light",
    icon: "☀️",
    badge: "Bright",
    pageBg: "bg-[#f8fafc]",
    textureClass: "theme-texture-grid-light",
    textColor: "text-slate-800",
    subtextColor: "text-slate-600",
    headingColor: "text-slate-900",
    mutedText: "text-slate-500",
    headerBg: "bg-white/95 backdrop-blur-2xl shadow-[0_4px_25px_rgba(245,158,11,0.18)]",
    headerBorder: "border-b-2 border-amber-400/80",
    brandText: "text-amber-600",
    activeNavBg: "bg-amber-500/20 border border-amber-500/60 text-amber-950 font-bold shadow-[0_2px_10px_rgba(245,158,11,0.25)]",
    inactiveNavText: "text-slate-700 hover:text-amber-900 hover:bg-amber-100/60",
    cardBg: "bg-white/90 shadow-sm",
    cardBorder: "border-amber-200/70",
    cardBorderHover: "hover:border-amber-400",
    cardGlow: "hover:shadow-[0_10px_30px_rgba(245,158,11,0.25)]",
    sidebarBg: "bg-white/95 shadow-sm",
    sidebarBorder: "border-amber-200/70",
    catBtnBg: "bg-slate-100/90",
    catBtnText: "text-slate-700 hover:text-amber-900",
    catBtnBorder: "border-slate-200",
    inputBg: "bg-amber-50/60",
    inputBorder: "border-amber-300",
    inputText: "text-slate-900",
    siteCardBg: "bg-gradient-to-b from-white to-amber-50/40",
    siteCardBorder: "border-amber-200/60",
    sqIconBg: "bg-amber-100/60",
    sqIconBorder: "border-amber-300/60",
    footerBg: "bg-slate-100",
    footerBorder: "border-slate-200",
    modalBg: "bg-white",
    modalBorder: "border-amber-300/60",
    modalText: "text-slate-800",
    aura1: "bg-amber-400/20",
    aura2: "bg-orange-400/15",
    accentBadge: "bg-amber-100 text-amber-800 border-amber-300/60",
    categoryBar: "bg-amber-500 shadow-[0_0_12px_#f59e0b]",
  },
  sakura: {
    name: "Sakura Bloom",
    mode: "light",
    icon: "🌸",
    badge: "Bright",
    pageBg: "bg-[#fff5f7]",
    textureClass: "theme-texture-dots-light",
    textColor: "text-slate-800",
    subtextColor: "text-slate-600",
    headingColor: "text-slate-900",
    mutedText: "text-slate-500",
    headerBg: "bg-white/95 backdrop-blur-2xl shadow-[0_4px_25px_rgba(236,72,153,0.18)]",
    headerBorder: "border-b-2 border-pink-400/80",
    brandText: "text-pink-600",
    activeNavBg: "bg-pink-500/20 border border-pink-500/60 text-pink-950 font-bold shadow-[0_2px_10px_rgba(236,72,153,0.25)]",
    inactiveNavText: "text-slate-700 hover:text-pink-900 hover:bg-pink-100/60",
    cardBg: "bg-white/90 shadow-sm",
    cardBorder: "border-pink-200/70",
    cardBorderHover: "hover:border-pink-400",
    cardGlow: "hover:shadow-[0_10px_30px_rgba(236,72,153,0.25)]",
    sidebarBg: "bg-white/95 shadow-sm",
    sidebarBorder: "border-pink-200/70",
    catBtnBg: "bg-slate-100/90",
    catBtnText: "text-slate-700 hover:text-pink-900",
    catBtnBorder: "border-slate-200",
    inputBg: "bg-pink-50/60",
    inputBorder: "border-pink-300",
    inputText: "text-slate-900",
    siteCardBg: "bg-gradient-to-b from-white to-pink-50/40",
    siteCardBorder: "border-pink-200/60",
    sqIconBg: "bg-pink-100/60",
    sqIconBorder: "border-pink-300/60",
    footerBg: "bg-pink-50/80",
    footerBorder: "border-pink-200",
    modalBg: "bg-white",
    modalBorder: "border-pink-300/60",
    modalText: "text-slate-800",
    aura1: "bg-pink-400/20",
    aura2: "bg-rose-400/15",
    accentBadge: "bg-pink-100 text-pink-800 border-pink-300/60",
    categoryBar: "bg-pink-500 shadow-[0_0_12px_#ec4899]",
  },
  arctic: {
    name: "Arctic Frost",
    mode: "light",
    icon: "🧊",
    badge: "Bright",
    pageBg: "bg-[#f0f9ff]",
    textureClass: "theme-texture-soft-light",
    textColor: "text-slate-800",
    subtextColor: "text-slate-600",
    headingColor: "text-slate-900",
    mutedText: "text-slate-500",
    headerBg: "bg-white/95 backdrop-blur-2xl shadow-[0_4px_25px_rgba(6,182,212,0.18)]",
    headerBorder: "border-b-2 border-cyan-400/80",
    brandText: "text-cyan-600",
    activeNavBg: "bg-cyan-500/20 border border-cyan-500/60 text-cyan-950 font-bold shadow-[0_2px_10px_rgba(6,182,212,0.25)]",
    inactiveNavText: "text-slate-700 hover:text-cyan-900 hover:bg-cyan-100/60",
    cardBg: "bg-white/90 shadow-sm",
    cardBorder: "border-cyan-200/70",
    cardBorderHover: "hover:border-cyan-400",
    cardGlow: "hover:shadow-[0_10px_30px_rgba(6,182,212,0.25)]",
    sidebarBg: "bg-white/95 shadow-sm",
    sidebarBorder: "border-cyan-200/70",
    catBtnBg: "bg-slate-100/90",
    catBtnText: "text-slate-700 hover:text-cyan-900",
    catBtnBorder: "border-slate-200",
    inputBg: "bg-cyan-50/60",
    inputBorder: "border-cyan-300",
    inputText: "text-slate-900",
    siteCardBg: "bg-gradient-to-b from-white to-cyan-50/40",
    siteCardBorder: "border-cyan-200/60",
    sqIconBg: "bg-cyan-100/60",
    sqIconBorder: "border-cyan-300/60",
    footerBg: "bg-cyan-50/80",
    footerBorder: "border-cyan-200",
    modalBg: "bg-white",
    modalBorder: "border-cyan-300/60",
    modalText: "text-slate-800",
    aura1: "bg-cyan-400/20",
    aura2: "bg-sky-400/15",
    accentBadge: "bg-cyan-100 text-cyan-800 border-cyan-300/60",
    categoryBar: "bg-cyan-500 shadow-[0_0_12px_#06b6d4]",
  },
  mint: {
    name: "Fresh Mint",
    mode: "light",
    icon: "🌿",
    badge: "Bright",
    pageBg: "bg-[#f0fdf4]",
    textureClass: "theme-texture-grid-light",
    textColor: "text-slate-800",
    subtextColor: "text-slate-600",
    headingColor: "text-slate-900",
    mutedText: "text-slate-500",
    headerBg: "bg-white/95 backdrop-blur-2xl shadow-[0_4px_25px_rgba(16,185,129,0.18)]",
    headerBorder: "border-b-2 border-emerald-400/80",
    brandText: "text-emerald-600",
    activeNavBg: "bg-emerald-500/20 border border-emerald-500/60 text-emerald-950 font-bold shadow-[0_2px_10px_rgba(16,185,129,0.25)]",
    inactiveNavText: "text-slate-700 hover:text-emerald-900 hover:bg-emerald-100/60",
    cardBg: "bg-white/90 shadow-sm",
    cardBorder: "border-emerald-200/70",
    cardBorderHover: "hover:border-emerald-400",
    cardGlow: "hover:shadow-[0_10px_30px_rgba(16,185,129,0.25)]",
    sidebarBg: "bg-white/95 shadow-sm",
    sidebarBorder: "border-emerald-200/70",
    catBtnBg: "bg-slate-100/90",
    catBtnText: "text-slate-700 hover:text-emerald-900",
    catBtnBorder: "border-slate-200",
    inputBg: "bg-emerald-50/60",
    inputBorder: "border-emerald-300",
    inputText: "text-slate-900",
    siteCardBg: "bg-gradient-to-b from-white to-emerald-50/40",
    siteCardBorder: "border-emerald-200/60",
    sqIconBg: "bg-emerald-100/60",
    sqIconBorder: "border-emerald-300/60",
    footerBg: "bg-emerald-50/80",
    footerBorder: "border-emerald-200",
    modalBg: "bg-white",
    modalBorder: "border-emerald-300/60",
    modalText: "text-slate-800",
    aura1: "bg-emerald-400/20",
    aura2: "bg-teal-400/15",
    accentBadge: "bg-emerald-100 text-emerald-800 border-emerald-300/60",
    categoryBar: "bg-emerald-500 shadow-[0_0_12px_#10b981]",
  },
  cyberday: {
    name: "Cyber Daylight",
    mode: "light",
    icon: "⚡",
    badge: "Bright",
    pageBg: "bg-[#fdf4ff]",
    textureClass: "theme-texture-dots-light",
    textColor: "text-slate-800",
    subtextColor: "text-slate-600",
    headingColor: "text-slate-900",
    mutedText: "text-slate-500",
    headerBg: "bg-white/95 backdrop-blur-2xl shadow-[0_4px_25px_rgba(168,85,247,0.18)]",
    headerBorder: "border-b-2 border-purple-400/80",
    brandText: "text-purple-600",
    activeNavBg: "bg-purple-500/20 border border-purple-500/60 text-purple-950 font-bold shadow-[0_2px_10px_rgba(168,85,247,0.25)]",
    inactiveNavText: "text-slate-700 hover:text-purple-900 hover:bg-purple-100/60",
    cardBg: "bg-white/90 shadow-sm",
    cardBorder: "border-purple-200/70",
    cardBorderHover: "hover:border-purple-400",
    cardGlow: "hover:shadow-[0_10px_30px_rgba(168,85,247,0.25)]",
    sidebarBg: "bg-white/95 shadow-sm",
    sidebarBorder: "border-purple-200/70",
    catBtnBg: "bg-slate-100/90",
    catBtnText: "text-slate-700 hover:text-purple-900",
    catBtnBorder: "border-slate-200",
    inputBg: "bg-purple-50/60",
    inputBorder: "border-purple-300",
    inputText: "text-slate-900",
    siteCardBg: "bg-gradient-to-b from-white to-purple-50/40",
    siteCardBorder: "border-purple-200/60",
    sqIconBg: "bg-purple-100/60",
    sqIconBorder: "border-purple-300/60",
    footerBg: "bg-purple-50/80",
    footerBorder: "border-purple-200",
    modalBg: "bg-white",
    modalBorder: "border-purple-300/60",
    modalText: "text-slate-800",
    aura1: "bg-purple-400/20",
    aura2: "bg-pink-400/15",
    accentBadge: "bg-purple-100 text-purple-800 border-purple-300/60",
    categoryBar: "bg-purple-500 shadow-[0_0_12px_#a855f7]",
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
    setCurrentTheme(themeKey);
    if (typeof window !== "undefined") {
      localStorage.setItem("allsitehub_theme", themeKey);
    }
  };

  const activeTheme = THEME_STYLES[currentTheme] || THEME_STYLES.midnight;

  const toggleLightDarkMode = () => {
    if (activeTheme.mode === "light") {
      handleThemeChange("midnight");
    } else {
      handleThemeChange("sunburst");
    }
  };

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

  
  // Scroll Spy: Automatically update active category highlight as user scrolls down page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observerOptions = {
      root: null,
      rootMargin: "-15% 0px -65% 0px",
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryName = entry.target.getAttribute("data-category");
          if (categoryName) {
            setSelectedCategory(categoryName);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    CATEGORIES.forEach((catName) => {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const el = document.getElementById(`cat-${slug}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [searchQuery, sitesList]);

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 3D Parallax Mouse Tilt State (Clean hover without scroll blur)
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  // Form states for Request Site Modal
  const [reqSiteName, setReqSiteName] = useState("");
  const [reqSiteUrl, setReqSiteUrl] = useState("");
  const [reqSiteCategory, setReqSiteCategory] = useState("MOVIES & TV SHOWS");
  const [reqFeatures, setReqFeatures] = useState("");
  const [reqRegion, setReqRegion] = useState("US");
  const [payMethod, setPayMethod] = useState<"free" | "upi" | "crypto" | "paypal">("free");
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

  // Banner CTA Click Handler
  const handleBannerCtaClick = (url: string) => {
    if (!url) return;
    const targetUrl = url.trim();
    if (targetUrl === "request-modal") {
      setShowModal("request");
      return;
    }
    if (targetUrl.startsWith("#")) {
      const elementId = targetUrl.replace("#", "");
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://") || targetUrl.startsWith("//")) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = targetUrl;
  };

  const handleCopyLink = (site: SiteItem) => {
    navigator.clipboard.writeText(site.url);
    setCopiedId(site.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Category counts helper
  const getCategoryCount = (catName: string) => {
    if (catName === "All") return sitesList.length;
    return sitesList.filter((s) => s.category === catName).length;
  };

  // Filtered sites for browsing section
  const filteredSites = useMemo(() => {
    return sitesList.filter((site) => {
      if (selectedCategory !== "All" && site.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        site.name.toLowerCase().includes(q) ||
        site.domain.toLowerCase().includes(q) ||
        site.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [sitesList, selectedCategory, searchQuery]);

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
    <div className={`min-h-screen flex flex-col ${activeTheme.pageBg} ${activeTheme.textureClass} ${activeTheme.textColor} font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden transition-colors duration-400`}>
      {/* Background Ambient Lighting Aura */}
      <div className={`absolute top-0 left-1/4 -mt-20 w-[400px] sm:w-[900px] h-[300px] sm:h-[600px] ${activeTheme.aura1} rounded-full blur-[100px] sm:blur-[180px] pointer-events-none transition-all duration-500`} />
      <div className={`absolute top-1/3 right-0 w-[350px] sm:w-[800px] h-[350px] sm:h-[700px] ${activeTheme.aura2} rounded-full blur-[100px] sm:blur-[190px] pointer-events-none transition-all duration-500`} />

      {/* HEADER NAVBAR - ULTRA WIDE MAX WIDTH */}
      <header className={`sticky top-0 z-50 ${activeTheme.headerBg} px-4 sm:px-8 xl:px-12 py-3.5 transition-all border-b ${activeTheme.headerBorder}`}>
        <div className="max-w-[1700px] w-full mx-auto flex items-center justify-between gap-4">
          {/* Left Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveNav("Home")}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090714] rounded-[10px] flex items-center justify-center font-black italic text-base sm:text-lg text-purple-400">
                AH
              </div>
            </div>
            <span className={`font-extrabold text-xl sm:text-2xl tracking-tight ${activeTheme.headingColor} flex items-center`}>
              Allsite<span className={`${activeTheme.brandText} group-hover:opacity-90 transition-colors`}>hub</span>
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

          {/* Right Header Items: Community Badges, Themes, Region, Live Counter */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* DISCORD NAVBAR BADGE */}
            <a
              href="https://discord.gg/QnTrWqwcJ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5865F2]/20 hover:bg-[#5865F2] border border-[#5865F2]/50 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(88,101,242,0.3)] hover:scale-105"
              title="Join Discord Community"
            >
              <span className="text-sm">💬</span>
              <span className="hidden xl:inline font-bold">Discord</span>
            </a>

            {/* REDDIT NAVBAR BADGE */}
            <a
              href="https://www.reddit.com/user/Ill_Committee7612/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF4500]/20 hover:bg-[#FF4500] border border-[#FF4500]/50 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(255,69,0,0.3)] hover:scale-105"
              title="Visit Reddit Profile"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#FF4500] group-hover:text-white" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.196-.491.961 0 1.741.78 1.741 1.742a1.737 1.737 0 0 1-1.144 1.637c.014.168.022.337.022.508 0 2.583-3.025 4.675-6.75 4.675-3.725 0-6.75-2.092-6.75-4.675 0-.166.007-.331.019-.496a1.734 1.734 0 0 1-1.127-1.63c0-.962.78-1.742 1.742-1.742.471 0 .897.187 1.206.502 1.187-.847 2.827-1.408 4.636-1.488l.943-4.417a.317.317 0 0 1 .374-.247l3.056.643c.123-.363.468-.627.876-.627zm-7.653 7.828c-.682 0-1.238.556-1.238 1.238 0 .681.556 1.237 1.238 1.237.681 0 1.237-.556 1.237-1.237 0-.682-.556-1.238-1.237-1.238zm5.284 0c-.682 0-1.237.556-1.237 1.238 0 .681.555 1.237 1.237 1.237.681 0 1.238-.556 1.238-1.237 0-.682-.557-1.238-1.238-1.238zm-5.467 3.498a.317.317 0 0 0-.225.541c.697.697 1.84.975 3.05.975 1.21 0 2.352-.278 3.05-.975a.317.317 0 0 0-.448-.448c-.536.536-1.487.77-2.602.77-1.115 0-2.066-.234-2.602-.77a.315.315 0 0 0-.223-.093z" />
              </svg>
              <span className="hidden xl:inline font-bold">Reddit</span>
            </a>

            {/* Unified Themes Button */}
            <button
              onClick={() => setShowModal("themes")}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border cursor-pointer hover:scale-105 ${activeTheme.inputBg} ${activeTheme.inputBorder} ${activeTheme.textColor}`}
              title="Explore Website Themes"
            >
              <span>🎨</span>
              <span>Themes</span>
              <span className="text-[10px] font-mono font-bold opacity-75">({activeTheme.name})</span>
            </button>

            {/* Region Selector */}
            <div className="relative hidden sm:block">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={`appearance-none ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.textColor} text-xs font-semibold px-3 py-1.5 pr-7 rounded-full cursor-pointer focus:outline-none transition-colors`}
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
            <div className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#081814] border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-extrabold text-emerald-300">
                {siteCount}
              </span>
              <span className="text-emerald-500/80 font-normal hidden 2xl:inline">Portals</span>
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

            {/* Mobile Theme Selector */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#120e29] border border-slate-700/80 my-1">
              <span className="text-xs font-bold text-slate-300">Theme:</span>
              <select
                value={currentTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="bg-[#0c0919] border border-slate-700 text-slate-200 text-xs font-bold px-2 py-1 rounded-lg focus:outline-none"
              >
                <option value="midnight">🎨 Midnight Purple</option>
                <option value="cyber">⚡ Cyberpunk Neon</option>
                <option value="emerald">🟢 Emerald Matrix</option>
                <option value="ocean">🌊 Ocean Deep</option>
                <option value="sunset">🌅 Sunset Amber</option>
                <option value="crimson">🔥 Crimson Red</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {["Home", "About", "DMCA", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item);
                    setIsMobileMenuOpen(false);
                    if (item === "DMCA") setShowModal("dmca");
                    else if (item === "Contact") setShowModal("contact");
                    else if (item === "About") setShowModal("about");
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                    activeNav === item
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

      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-4 sm:py-8 flex flex-col gap-4 sm:gap-6">
        {/* HERO SECTION WITH DYNAMIC BANNER & CLEAN CRISP VISUAL */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center relative">

          {/* Left Column Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 relative z-20 text-center lg:text-left items-center lg:items-start">
            
            {/* Top Glowing Badge */}
            <div className={`w-fit flex items-center gap-2 px-3.5 py-1 rounded-full ${activeTheme.accentBadge} text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md shadow-sm`}>
              <span className="text-sm sm:text-base">{bannerConfig.badgeIcon || "⚡"}</span>
              {bannerConfig.badgeText || "THE ULTIMATE STREAMING HUB"}
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-1 w-full drop-shadow-sm">
              <h1 className={`text-3xl xs:text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight ${activeTheme.headingColor} uppercase leading-[1.1]`}>
                {bannerConfig.line1Text}{" "}
                <span className={`brush-font ${activeTheme.brandText} font-bold tracking-wider italic text-4xl xs:text-5xl sm:text-7xl xl:text-8xl 2xl:text-9xl hover:scale-105 transition-transform inline-block ml-1 sm:ml-2 normal-case drop-shadow-md`}>
                  {bannerConfig.line1Highlight}
                </span>
              </h1>
              <h1 className={`text-3xl xs:text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight ${activeTheme.headingColor} uppercase leading-[1.1]`}>
                {bannerConfig.line2Text}{" "}
                <span className={`brush-font ${activeTheme.brandText} font-bold tracking-wider italic text-4xl xs:text-5xl sm:text-7xl xl:text-8xl 2xl:text-9xl hover:scale-105 transition-transform inline-block ml-1 sm:ml-2 normal-case drop-shadow-md`}>
                  {bannerConfig.line2Highlight}
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className={`text-sm sm:text-base lg:text-xl ${activeTheme.subtextColor} font-medium max-w-2xl leading-relaxed`}>
              {bannerConfig.description}
            </p>
          </div>

          {/* Right Column Promotional Banner Area (Clean, no 3D tilt effect) */}
          <div className="lg:col-span-5 relative flex justify-center items-center mt-2 lg:mt-0 z-10">
            {/* Ambient Lighting Aura */}
            <div className={`absolute inset-0 ${activeTheme.aura1} rounded-3xl blur-3xl -z-10`} />

            <a
              href={bannerConfig.promoTargetUrl || "https://flixtor.to"}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative w-full max-w-md xl:max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border ${activeTheme.cardBorder} shadow-2xl ${activeTheme.cardBg} cursor-pointer block transition-all duration-300 hover:scale-[1.02] hover:border-purple-400`}
            >
              {/* Poster Banner Image */}
              <Image
                src={bannerConfig.heroImageUrl || "/hero_banner.png"}
                alt={bannerConfig.promoSiteName || "Promotional Banner"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500"
                priority
              />

              {/* Top Right Promotional Badge */}
              <div className="absolute top-3.5 right-3.5 z-20">
                <span className="px-3 py-1 rounded-full bg-purple-950/90 text-purple-300 border border-purple-400/50 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  {bannerConfig.cardBadgeText || "FEATURED PROMO"}
                </span>
              </div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Bottom Promotional Info & Feature Hashtags (#) */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 flex flex-col gap-2 shadow-2xl transition-all group-hover:border-purple-400/60">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">🔥</span>
                    <h3 className="text-sm sm:text-base font-black text-white tracking-wide truncate">
                      {bannerConfig.promoSiteName || "Flixtor 4K Ultra"}
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/40 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all flex items-center gap-1">
                    <span>Visit</span>
                    <span className="text-xs">↗</span>
                  </span>
                </div>

                {/* Feature Hashtags containing # */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {(bannerConfig.promoHashtags || ["#4KHDR", "#NoAds", "#FastServer", "#FreeStreaming"]).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] sm:text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-200 border border-purple-500/30 uppercase tracking-wider"
                    >
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </div>

        </section>

        {/* 4 STATS CARDS ROW WITH ULTRA-WIDE FIT - TIGHT SLEEK ROW */}
        <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 perspective-1000">
          <div className={`tilt-card-3d rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 cursor-pointer ${activeTheme.cardBg} border ${activeTheme.cardBorder} ${activeTheme.cardBorderHover} ${activeTheme.cardGlow}`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs`}>
              🪐
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-black ${activeTheme.headingColor} tracking-tight font-mono`}>
                {siteCount}
              </h3>
              <p className={`text-xs font-bold ${activeTheme.brandText}`}>Sites Indexed</p>
              <p className={`text-[10px] sm:text-[11px] ${activeTheme.mutedText}`}>Verified active portals</p>
            </div>
          </div>

          <div className={`tilt-card-3d rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 cursor-pointer ${activeTheme.cardBg} border ${activeTheme.cardBorder} ${activeTheme.cardBorderHover} ${activeTheme.cardGlow}`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs`}>
              🎬
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-black ${activeTheme.headingColor} tracking-tight`}>25+</h3>
              <p className={`text-xs font-bold ${activeTheme.brandText}`}>Categories</p>
              <p className={`text-[10px] sm:text-[11px] ${activeTheme.mutedText}`}>All your favorites</p>
            </div>
          </div>

          <div className={`tilt-card-3d rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 cursor-pointer ${activeTheme.cardBg} border ${activeTheme.cardBorder} ${activeTheme.cardBorderHover} ${activeTheme.cardGlow}`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs`}>
              🌐
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-black ${activeTheme.headingColor} tracking-tight`}>190+</h3>
              <p className={`text-xs font-bold ${activeTheme.brandText}`}>Countries Supported</p>
              <p className={`text-[10px] sm:text-[11px] ${activeTheme.mutedText}`}>Worldwide access</p>
            </div>
          </div>

          <div className={`tilt-card-3d rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 cursor-pointer ${activeTheme.cardBg} border ${activeTheme.cardBorder} ${activeTheme.cardBorderHover} ${activeTheme.cardGlow}`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs`}>
              ⚡
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-black ${activeTheme.brandText} tracking-tight`}>100%</h3>
              <p className={`text-xs font-bold ${activeTheme.brandText}`}>Free Forever</p>
              <p className={`text-[10px] sm:text-[11px] ${activeTheme.mutedText}`}>Always will be</p>
            </div>
          </div>
        </section>

        {/* BOTTOM FEATURE HIGHLIGHTS STRIP - TIGHT SLEEK ROW */}
        <section className={`rounded-xl ${activeTheme.cardBg} border ${activeTheme.cardBorder} p-2 sm:p-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 shadow-xs`}>
          <div className="flex items-center gap-2">
            <div className={`w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-md ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-xs shrink-0`}>
              ⚡
            </div>
            <div>
              <h4 className={`text-[11px] sm:text-xs font-bold ${activeTheme.headingColor} uppercase tracking-wider`}>Blazing Fast Search</h4>
              <p className={`text-[10px] sm:text-[11px] ${activeTheme.mutedText}`}>Find any site in seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-md ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-xs shrink-0`}>
              🌐
            </div>
            <div>
              <h4 className={`text-[11px] sm:text-xs font-bold ${activeTheme.headingColor} uppercase tracking-wider`}>Multi-Region Access</h4>
              <p className={`text-[10px] sm:text-[11px] ${activeTheme.mutedText}`}>Unblock. Discover. Enjoy.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-md ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-xs shrink-0`}>
              🛡️
            </div>
            <div>
              <h4 className={`text-[11px] sm:text-xs font-bold ${activeTheme.headingColor} uppercase tracking-wider`}>No Registration</h4>
              <p className={`text-[10px] sm:text-[11px] ${activeTheme.mutedText}`}>Jump right in. No sign-up.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-md ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center text-xs shrink-0`}>
              🔄
            </div>
            <div>
              <h4 className={`text-[11px] sm:text-xs font-bold ${activeTheme.headingColor} uppercase tracking-wider`}>Always Updated</h4>
              <p className={`text-[10px] sm:text-[11px] ${activeTheme.mutedText}`}>We add new sites daily</p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DIRECTORY SECTION - LEFT SIDEBAR CATEGORY LAYOUT */}
        <section id="browse-directory" className="flex flex-col gap-4 pt-2 sm:pt-3">
          {/* Top Section Header */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b ${activeTheme.headerBorder}`}>
            <div>
              <h2 className={`text-xl sm:text-3xl font-black ${activeTheme.headingColor} flex items-center gap-2.5`}>
                <span>🔥</span> Verified Web & Streaming Directory
              </h2>
              <p className={`text-xs sm:text-sm ${activeTheme.mutedText}`}>Direct working portals with verified uptime and multi-server mirrors</p>
            </div>

            {/* Live Search Input Bar */}
            <div className="relative w-full sm:w-72 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sm opacity-70">
                🔍
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, anime, AI tools..."
                className={`w-full pl-10 pr-4 py-2.5 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-2xl text-xs sm:text-sm focus:outline-none transition-all shadow-inner`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs opacity-60 hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* MAIN DIRECTORY LAYOUT: LEFT SIDEBAR + RIGHT CARDS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* LEFT SIDEBAR CATEGORIES */}
            <aside className={`lg:col-span-3 flex flex-col gap-3 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar ${activeTheme.sidebarBg} border ${activeTheme.sidebarBorder} rounded-3xl p-4 sm:p-5 shadow-lg`}>
              <div className={`flex items-center justify-between px-2 pb-3 border-b ${activeTheme.headerBorder}`}>
                <span className={`text-xs font-black uppercase tracking-wider ${activeTheme.brandText}`}>
                  Categories ({CATEGORIES.length})
                </span>
                <span className={`text-[10px] font-mono font-bold ${activeTheme.accentBadge} px-2 py-0.5 rounded-full border`}>
                  {totalSitesCount} Portals
                </span>
              </div>

              {/* Desktop Category Buttons List */}
              <div className="hidden lg:flex flex-col gap-2">
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
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        const el = document.getElementById(`cat-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`group relative flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer ${
                        isSelected
                          ? activeTheme.activeNavBg
                          : `${activeTheme.catBtnBg} ${activeTheme.catBtnText} border ${activeTheme.catBtnBorder} hover:scale-[1.01]`
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute left-0 top-1/2 -translate-x-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full shadow-sm" />
                      )}

                      <span className="flex items-center gap-2.5 text-sm sm:text-base font-black tracking-wide truncate">
                        <span className="text-base sm:text-lg">{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </span>

                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                          isSelected
                            ? "bg-purple-400 text-black border-purple-300 font-extrabold"
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
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#5865F2]/25 via-[#404EED]/20 to-purple-900/30 border border-[#5865F2]/40 hover:border-[#5865F2] hover:shadow-md transition-all cursor-pointer overflow-hidden mt-3"
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
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FF4500]/25 via-[#e03d00]/20 to-amber-900/30 border border-[#FF4500]/40 hover:border-[#FF4500] hover:shadow-md transition-all cursor-pointer overflow-hidden mt-2.5"
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

            {/* RIGHT MAIN DIRECTORY CARDS GRID */}
            <div className="lg:col-span-9 flex flex-col gap-5">

              {/* MOBILE CATEGORY SCROLLBAR */}
              <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 mb-1 snap-x">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = getCategoryCount(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        const el = document.getElementById(`cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm md:text-base font-black transition-all border flex items-center gap-2 whitespace-nowrap active:scale-95 cursor-pointer ${
                        isSelected
                          ? activeTheme.activeNavBg
                          : `${activeTheme.catBtnBg} ${activeTheme.catBtnText} border ${activeTheme.catBtnBorder}`
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${activeTheme.accentBadge} border`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Prominent Category Title Header & Search Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 pb-1">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-6 sm:h-7 rounded-full ${activeTheme.categoryBar}`} />
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black ${activeTheme.headingColor} tracking-tight flex items-center gap-2.5`}>
                      <span>{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
                    </h2>
                    <span className={`text-xs sm:text-sm font-mono font-bold px-2.5 py-0.5 rounded-full border ${activeTheme.accentBadge}`}>
                      {filteredSites.length}
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm ${activeTheme.mutedText} font-medium pl-4.5`}>
                    Verified streaming and web portals directory.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* DIRECTORY SEARCH INPUT BAR */}
                  <div className="relative flex-1 sm:w-60 xl:w-68">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs opacity-60">
                      🔍
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search portals..."
                      className={`w-full pl-8 pr-7 py-2 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-full text-xs placeholder-slate-500 focus:outline-none transition-all shadow-inner`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs opacity-60 hover:opacity-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Square View Layout Toggle Switch */}
                  <div className={`flex items-center gap-1 ${activeTheme.inputBg} border ${activeTheme.inputBorder} p-1 rounded-xl shadow-inner shrink-0`}>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "grid"
                          ? activeTheme.activeNavBg
                          : `${activeTheme.mutedText} hover:bg-white/5`
                      }`}
                      title="Square Card Grid View"
                    >
                      <span className="w-3.5 h-3.5 border border-current rounded-xs flex items-center justify-center font-mono text-[9px] font-black">
                        ⊞
                      </span>
                      <span className="hidden sm:inline">Grid</span>
                    </button>

                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
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
                    className="flex flex-col gap-3 scroll-mt-24 mb-6"
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between px-1 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-6 rounded-full ${activeTheme.categoryBar}`} />
                        <span className="text-xl sm:text-2xl">{icon}</span>
                        <h2 className={`text-xl sm:text-2xl font-black ${activeTheme.headingColor} tracking-tight flex items-center gap-2.5`}>
                          <span>{catName}</span>
                        </h2>
                        <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${activeTheme.accentBadge}`}>
                          {catSites.length}
                        </span>
                      </div>
                    </div>

                    {/* Category Sites Grid or List View */}
                    {catSites.length === 0 ? (
                      <div className={`p-6 rounded-2xl ${activeTheme.cardBg} border ${activeTheme.cardBorder} text-center text-xs ${activeTheme.mutedText}`}>
                        No portals added yet in {catName}.
                      </div>
                    ) : viewMode === "grid" ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2.5 sm:gap-3">
                        {catSites.map((site) => (
                          <a
                            key={site.id}
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group card-square relative ${activeTheme.siteCardBg} border ${activeTheme.siteCardBorder} ${activeTheme.cardBorderHover} rounded-xl sm:rounded-2xl p-2.5 sm:p-3 aspect-square flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.98] shadow-sm ${activeTheme.cardGlow} cursor-pointer overflow-hidden backdrop-blur-md`}
                          >
                            <div className="absolute top-2 left-2 z-20">
                              {site.isTrusted ? (
                                <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider shadow-xs">
                                  TRUSTED
                                </span>
                              ) : site.isFeatured ? (
                                <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-400 border border-amber-500/40 uppercase tracking-wider shadow-xs">
                                  FEATURED
                                </span>
                              ) : site.isNew ? (
                                <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded bg-blue-950/90 text-blue-400 border border-blue-500/40 uppercase tracking-wider shadow-xs">
                                  NEW
                                </span>
                              ) : site.badge ? (
                                <span className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded ${activeTheme.accentBadge} uppercase tracking-wider shadow-xs`}>
                                  {site.badge}
                                </span>
                              ) : null}
                            </div>

                            <div className={`sq-icon-btn w-9 h-9 sm:w-11 sm:h-11 p-2 rounded-xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 shadow-sm my-auto`}>
                              <img
                                src={getFaviconUrl(site.domain || site.url)}
                                alt={site.name}
                                className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
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

                            <div className="w-full flex flex-col items-center gap-0.5 mt-auto z-10">
                              <h3 className={`font-black ${activeTheme.headingColor} text-[11px] sm:text-xs tracking-wide uppercase group-hover:${activeTheme.brandText} transition-colors truncate w-full`}>
                                {site.name}
                              </h3>
                              <span className={`text-[9px] sm:text-[10px] font-mono ${activeTheme.mutedText} flex items-center justify-center gap-0.5 truncate w-full`}>
                                <span className="text-[8px] opacity-70">🌐</span>
                                <span className="truncate">{site.domain}</span>
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                        {catSites.map((site) => (
                          <a
                            key={site.id}
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group card-square relative ${activeTheme.siteCardBg} border ${activeTheme.siteCardBorder} ${activeTheme.cardBorderHover} rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${activeTheme.cardGlow} cursor-pointer overflow-hidden`}
                          >
                            <div className={`absolute top-0 left-0 right-0 h-1 ${activeTheme.categoryBar} opacity-60 group-hover:opacity-100 transition-opacity`} />
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`sq-icon-btn w-9 h-9 sm:w-10 sm:h-10 p-1.5 ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300`}>
                                <img
                                  src={getFaviconUrl(site.domain || site.url)}
                                  alt={site.name}
                                  className="w-full h-full object-contain drop-shadow-xs group-hover:scale-110 transition-transform duration-300"
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
                              <div className="flex flex-col min-w-0 gap-0.5">
                                <h3 className={`font-black ${activeTheme.headingColor} text-xs sm:text-sm group-hover:${activeTheme.brandText} transition-colors truncate`}>
                                  {site.name}
                                </h3>
                                <span className={`text-[10px] sm:text-[11px] font-mono font-bold ${activeTheme.subtextColor} truncate`}>
                                  {site.domain}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                              {site.isTrusted && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-xs whitespace-nowrap">
                                  🛡️ Trusted
                                </span>
                              )}
                              {site.isFeatured && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-xs whitespace-nowrap">
                                  ⭐ Featured
                                </span>
                              )}
                              {site.isNew && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-300 border border-blue-500/40 shadow-xs whitespace-nowrap">
                                  🔥 New
                                </span>
                              )}
                              {site.badge && !site.isTrusted && !site.isFeatured && !site.isNew && (
                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${activeTheme.accentBadge} shadow-xs whitespace-nowrap`}>
                                  {site.badge}
                                </span>
                              )}
                            </div>
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

      {/* ALL MODALS DIALOGS INCLUDING THEME PALETTE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`${activeTheme.modalBg} border ${activeTheme.modalBorder} ${activeTheme.modalText} rounded-2xl sm:rounded-3xl p-5 sm:p-8 ${showModal === "themes" ? "max-w-2xl" : "max-w-md"} w-full flex flex-col gap-5 relative shadow-2xl my-auto max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg sm:text-xl font-extrabold ${activeTheme.headingColor} flex items-center gap-2`}>
                {showModal === "request" && <span>📝 Request a New Site</span>}
                {showModal === "themes" && <span>🎨 Themes & Appearance</span>}
                {showModal === "about" && <span>ℹ️ About Allsitehub</span>}
                {showModal === "dmca" && <span>🛡️ DMCA Disclaimer</span>}
                {showModal === "contact" && <span>💬 Contact Support</span>}
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="opacity-70 hover:opacity-100 p-1"
              >
                ✕
              </button>
            </div>

            {/* UNIFIED THEMES MODAL */}
            {showModal === "themes" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-medium ${activeTheme.subtextColor}`}>
                    Select from 10 dynamic color themes (Bright & Dark modes included)
                  </p>
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${activeTheme.accentBadge}`}>
                    {activeTheme.name} ({activeTheme.mode === "light" ? "Bright" : "Dark"})
                  </span>
                </div>

                {/* All 10 Themes Merged In One Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(THEME_STYLES).map(([key, t]) => {
                    const isSelected = currentTheme === key;
                    const isLight = t.mode === "light";

                    return (
                      <button
                        key={key}
                        onClick={() => {
                          handleThemeChange(key);
                          setShowModal(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer relative ${
                          isSelected
                            ? isLight
                              ? "border-amber-500 ring-2 ring-amber-500/40 bg-amber-500/15 scale-[1.02]"
                              : "border-purple-500 ring-2 ring-purple-500/40 bg-purple-600/20 scale-[1.02]"
                            : isLight
                            ? "border-slate-300/60 hover:border-amber-400 bg-white/70 hover:bg-white"
                            : "border-slate-700/50 hover:border-purple-400 bg-slate-900/60 hover:bg-slate-900/90"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs sm:text-sm font-extrabold flex items-center gap-1.5 ${isLight ? "text-slate-900" : "text-white"}`}>
                            <span>{t.icon}</span>
                            <span>{t.name}</span>
                          </span>
                          {isSelected && (
                            <span className={`text-[10px] font-black ${isLight ? "text-amber-600" : "text-purple-400"}`}>
                              ✓ Active
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-3.5 h-3.5 rounded-full border shadow-xs ${isLight ? "bg-slate-100 border-slate-300" : "bg-[#05050c] border-slate-700"}`} title="Background" />
                          <span className={`w-3.5 h-3.5 rounded-full shadow-xs ${isLight ? "bg-amber-500" : "bg-purple-500"}`} title="Accent" />
                          <span className={`w-3.5 h-3.5 rounded-full shadow-xs ${isLight ? "bg-slate-800" : "bg-white"}`} title="Text" />
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ml-auto ${isLight ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-purple-950 text-purple-300 border border-purple-800"}`}>
                            {isLight ? "☀️ Bright" : "🌙 Dark"}
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
                <div className={`p-4 rounded-2xl ${activeTheme.inputBg} border ${activeTheme.inputBorder} flex flex-col gap-3 shadow-md`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <h4 className={`text-sm font-black ${activeTheme.headingColor}`}>
                      To add your website fill this, and DM me on anyone of my supports to update
                    </h4>
                  </div>

                  {/* Direct DM Links Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    {/* DISCORD LINK */}
                    <a
                      href="https://discord.gg/QnTrWqwcJ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2] border border-[#5865F2]/50 text-white text-xs font-extrabold transition-all shadow-sm hover:scale-105"
                    >
                      <span className="text-sm">💬</span>
                      <span>Discord DM</span>
                    </a>

                    {/* REDDIT LINK */}
                    <a
                      href="https://www.reddit.com/user/Ill_Committee7612/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#FF4500]/20 hover:bg-[#FF4500] border border-[#FF4500]/50 text-white text-xs font-extrabold transition-all shadow-sm hover:scale-105"
                    >
                      <span className="text-sm">🔴</span>
                      <span>Reddit DM</span>
                    </a>

                    {/* TELEGRAM LINK */}
                    <a
                      href="https://t.me/allsitehub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc] border border-[#0088cc]/50 text-white text-xs font-extrabold transition-all shadow-sm hover:scale-105"
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
                      className={`w-full px-3.5 py-2 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-xl text-xs focus:outline-none transition-all`}
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
                      className={`w-full px-3.5 py-2 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-xl text-xs focus:outline-none transition-all`}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold ${activeTheme.headingColor}`}>Category</label>
                    <select
                      value={reqRegion}
                      onChange={(e) => setReqRegion(e.target.value)}
                      className={`w-full px-3.5 py-2 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-xl text-xs focus:outline-none transition-all`}
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
                      placeholder="Add any additional details or server features..."
                      className={`w-full px-3.5 py-2 ${activeTheme.inputBg} border ${activeTheme.inputBorder} ${activeTheme.inputText} rounded-xl text-xs focus:outline-none transition-all resize-none`}
                    />
                  </div>

                  {reqSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-bold text-center animate-bounce">
                      ✓ Request Submitted Successfully!
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`mt-1 py-2.5 rounded-xl ${activeTheme.activeNavBg} text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95`}
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
                <div className={`p-4 rounded-2xl ${activeTheme.inputBg} border ${activeTheme.inputBorder} flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg`}>
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
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                  >
                    Copy Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER - ULTRA WIDE MAX WIDTH */}
      <footer className={`mt-auto border-t ${activeTheme.footerBorder} py-6 sm:py-8 ${activeTheme.footerBg}`}>
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${activeTheme.headingColor} text-sm`}>Allsite<span className={activeTheme.brandText}>hub</span></span>
            <span className={activeTheme.mutedText}>— The Ultimate Streaming Hub.</span>
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

      {/* FLOATING STICKY MOBILE JUMP TO CATEGORIES BUTTON */}
      <div className="fixed bottom-5 right-5 z-40 lg:hidden">
        <button
          onClick={() => {
            const el = document.getElementById("browse-directory");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-4.5 py-3 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 border border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.7)] backdrop-blur-md active:scale-95 cursor-pointer"
        >
          <span>📁 Categories</span>
          <span className="text-sm font-bold animate-bounce">↓</span>
        </button>
      </div>
    </div>
  );
}




