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
  syncWithServer,
  getSavedUserRequests,
  saveUserRequests,
  UserRequestItem,
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
  // 1. MIDNIGHT SLATE
  midnight: {
    name: "Midnight Slate",
    mode: "dark",
    icon: "🌌",
    badge: "Dark Slate",
    pageBg: "bg-[#090a0f]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-slate-100",
    subtextColor: "text-slate-300",
    headingColor: "text-white",
    mutedText: "text-slate-400",
    headerBg: "bg-[#0f111a]/85 backdrop-blur-2xl border-b border-white/10 shadow-md",
    headerBorder: "border-b border-white/10",
    brandText: "text-indigo-400",
    activeNavBg: "bg-indigo-600/30 border border-indigo-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-white/5",
    cardBg: "bg-[#131520]/75 backdrop-blur-xl border border-white/10 shadow-md",
    cardBorder: "border-white/10",
    cardBorderHover: "hover:border-indigo-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#10121c]/85 backdrop-blur-2xl border border-white/10 shadow-xl",
    sidebarBorder: "border-white/10",
    catBtnBg: "bg-[#171926]/70 backdrop-blur-md",
    catBtnText: "text-slate-200 hover:text-white",
    catBtnBorder: "border-white/10",
    inputBg: "bg-[#141622]/80 backdrop-blur-md",
    inputBorder: "border-white/15",
    inputText: "text-white",
    siteCardBg: "bg-gradient-to-b from-[#181b2a]/85 to-[#0e1019]/95 backdrop-blur-xl",
    siteCardBorder: "border-white/10",
    sqIconBg: "bg-[#1d2032]/90 border border-white/15",
    sqIconBorder: "border-white/15",
    footerBg: "bg-[#08090d]/95 backdrop-blur-xl",
    footerBorder: "border-white/10",
    modalBg: "bg-[#11131d]/95 backdrop-blur-2xl",
    modalBorder: "border-white/15 shadow-2xl",
    modalText: "text-slate-200",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 backdrop-blur-md",
    categoryBar: "bg-indigo-500 shadow-sm",
    galaxyConfig: {
      spaceBg: "#090a0f",
      nebula1: "rgba(99, 102, 241, 0.08)",
      nebula2: "rgba(79, 70, 229, 0.06)",
      nebula3: "rgba(59, 130, 246, 0.05)",
      starColor: "#ffffff",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 2. DEEP SLATE
  cyber: {
    name: "Deep Slate",
    mode: "dark",
    icon: "🏢",
    badge: "Dark Charcoal",
    pageBg: "bg-[#0b0f19]",
    textureClass: "theme-texture-dots-dark",
    textColor: "text-slate-100",
    subtextColor: "text-slate-300",
    headingColor: "text-white",
    mutedText: "text-slate-400",
    headerBg: "bg-[#0f172a]/85 backdrop-blur-2xl border-b border-slate-700/60 shadow-md",
    headerBorder: "border-b border-slate-700/60",
    brandText: "text-sky-400",
    activeNavBg: "bg-sky-600/30 border border-sky-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-slate-800/40",
    cardBg: "bg-[#111827]/75 backdrop-blur-xl border border-slate-700/50 shadow-md",
    cardBorder: "border-slate-700/50",
    cardBorderHover: "hover:border-sky-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#0f172a]/85 backdrop-blur-2xl border border-slate-700/60 shadow-xl",
    sidebarBorder: "border-slate-700/60",
    catBtnBg: "bg-[#1e293b]/70 backdrop-blur-md",
    catBtnText: "text-slate-200 hover:text-white",
    catBtnBorder: "border-slate-700/50",
    inputBg: "bg-[#1e293b]/80 backdrop-blur-md",
    inputBorder: "border-slate-700/60",
    inputText: "text-slate-100",
    siteCardBg: "bg-gradient-to-b from-[#1e293b]/85 to-[#0f172a]/95 backdrop-blur-xl",
    siteCardBorder: "border-slate-700/50",
    sqIconBg: "bg-[#1e293b]/90 border border-slate-600/50",
    sqIconBorder: "border-slate-600/50",
    footerBg: "bg-[#090d16]/95 backdrop-blur-xl",
    footerBorder: "border-slate-800",
    modalBg: "bg-[#0f172a]/95 backdrop-blur-2xl",
    modalBorder: "border-slate-700/60 shadow-2xl",
    modalText: "text-slate-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-sky-950/70 text-sky-300 border border-sky-500/30 backdrop-blur-md",
    categoryBar: "bg-sky-500 shadow-sm",
    galaxyConfig: {
      spaceBg: "#0b0f19",
      nebula1: "rgba(56, 189, 248, 0.07)",
      nebula2: "rgba(30, 58, 138, 0.06)",
      nebula3: "rgba(15, 23, 42, 0.05)",
      starColor: "#e0f2fe",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 3. EMERALD DARK
  emerald: {
    name: "Emerald Dark",
    mode: "dark",
    icon: "🟢",
    badge: "Dark Emerald",
    pageBg: "bg-[#06140e]",
    textureClass: "theme-texture-mesh-dark",
    textColor: "text-emerald-100",
    subtextColor: "text-emerald-200/80",
    headingColor: "text-white",
    mutedText: "text-emerald-400/60",
    headerBg: "bg-[#0b2118]/85 backdrop-blur-2xl border-b border-emerald-800/60 shadow-md",
    headerBorder: "border-b border-emerald-800/60",
    brandText: "text-emerald-400",
    activeNavBg: "bg-emerald-600/30 border border-emerald-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-emerald-950/40",
    cardBg: "bg-[#0c241b]/75 backdrop-blur-xl border border-emerald-800/40 shadow-md",
    cardBorder: "border-emerald-800/40",
    cardBorderHover: "hover:border-emerald-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#0b2118]/85 backdrop-blur-2xl border border-emerald-800/50 shadow-xl",
    sidebarBorder: "border-emerald-800/50",
    catBtnBg: "bg-[#113125]/70 backdrop-blur-md",
    catBtnText: "text-emerald-200 hover:text-white",
    catBtnBorder: "border-emerald-800/40",
    inputBg: "bg-[#0e2a1f]/80 backdrop-blur-md",
    inputBorder: "border-emerald-800/50",
    inputText: "text-emerald-100",
    siteCardBg: "bg-gradient-to-b from-[#113226]/85 to-[#081a13]/95 backdrop-blur-xl",
    siteCardBorder: "border-emerald-800/40",
    sqIconBg: "bg-[#143d2e]/90 border border-emerald-700/50",
    sqIconBorder: "border-emerald-700/50",
    footerBg: "bg-[#040e0a]/95 backdrop-blur-xl",
    footerBorder: "border-emerald-950",
    modalBg: "bg-[#0b2118]/95 backdrop-blur-2xl",
    modalBorder: "border-emerald-800/60 shadow-2xl",
    modalText: "text-emerald-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 backdrop-blur-md",
    categoryBar: "bg-emerald-500 shadow-sm",
    galaxyConfig: {
      spaceBg: "#06140e",
      nebula1: "rgba(16, 185, 129, 0.07)",
      nebula2: "rgba(6, 78, 59, 0.06)",
      nebula3: "rgba(4, 120, 87, 0.05)",
      starColor: "#d1fae5",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 4. OCEANIC NAVY
  ocean: {
    name: "Oceanic Navy",
    mode: "dark",
    icon: "🌊",
    badge: "Dark Navy",
    pageBg: "bg-[#080d1a]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-blue-100",
    subtextColor: "text-blue-200/80",
    headingColor: "text-white",
    mutedText: "text-blue-300/60",
    headerBg: "bg-[#0d162a]/85 backdrop-blur-2xl border-b border-blue-900/60 shadow-md",
    headerBorder: "border-b border-blue-900/60",
    brandText: "text-blue-400",
    activeNavBg: "bg-blue-600/30 border border-blue-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-blue-950/40",
    cardBg: "bg-[#0f1b33]/75 backdrop-blur-xl border border-blue-900/40 shadow-md",
    cardBorder: "border-blue-900/40",
    cardBorderHover: "hover:border-blue-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#0d162a]/85 backdrop-blur-2xl border border-blue-900/50 shadow-xl",
    sidebarBorder: "border-blue-900/50",
    catBtnBg: "bg-[#142343]/70 backdrop-blur-md",
    catBtnText: "text-blue-200 hover:text-white",
    catBtnBorder: "border-blue-900/40",
    inputBg: "bg-[#111e3b]/80 backdrop-blur-md",
    inputBorder: "border-blue-900/50",
    inputText: "text-blue-100",
    siteCardBg: "bg-gradient-to-b from-[#152547]/85 to-[#0b1224]/95 backdrop-blur-xl",
    siteCardBorder: "border-blue-900/40",
    sqIconBg: "bg-[#182d57]/90 border border-blue-800/50",
    sqIconBorder: "border-blue-800/50",
    footerBg: "bg-[#050912]/95 backdrop-blur-xl",
    footerBorder: "border-blue-950",
    modalBg: "bg-[#0d162a]/95 backdrop-blur-2xl",
    modalBorder: "border-blue-900/60 shadow-2xl",
    modalText: "text-blue-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-blue-950/70 text-blue-300 border border-blue-500/30 backdrop-blur-md",
    categoryBar: "bg-blue-500 shadow-sm",
    galaxyConfig: {
      spaceBg: "#080d1a",
      nebula1: "rgba(59, 130, 246, 0.07)",
      nebula2: "rgba(30, 58, 138, 0.06)",
      nebula3: "rgba(29, 78, 216, 0.05)",
      starColor: "#dbeafe",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 5. CRIMSON DARK
  crimson: {
    name: "Crimson Dark",
    mode: "dark",
    icon: "🔥",
    badge: "Dark Ruby",
    pageBg: "bg-[#12080a]",
    textureClass: "theme-texture-dots-dark",
    textColor: "text-rose-100",
    subtextColor: "text-rose-200/80",
    headingColor: "text-white",
    mutedText: "text-rose-300/60",
    headerBg: "bg-[#1f0d11]/85 backdrop-blur-2xl border-b border-rose-900/60 shadow-md",
    headerBorder: "border-b border-rose-900/60",
    brandText: "text-rose-400",
    activeNavBg: "bg-rose-600/30 border border-rose-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-rose-950/40",
    cardBg: "bg-[#220f13]/75 backdrop-blur-xl border border-rose-900/40 shadow-md",
    cardBorder: "border-rose-900/40",
    cardBorderHover: "hover:border-rose-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#1f0d11]/85 backdrop-blur-2xl border border-rose-900/50 shadow-xl",
    sidebarBorder: "border-rose-900/50",
    catBtnBg: "bg-[#2c141a]/70 backdrop-blur-md",
    catBtnText: "text-rose-200 hover:text-white",
    catBtnBorder: "border-rose-900/40",
    inputBg: "bg-[#261116]/80 backdrop-blur-md",
    inputBorder: "border-rose-900/50",
    inputText: "text-rose-100",
    siteCardBg: "bg-gradient-to-b from-[#2f151c]/85 to-[#160a0d]/95 backdrop-blur-xl",
    siteCardBorder: "border-rose-900/40",
    sqIconBg: "bg-[#391a22]/90 border border-rose-800/50",
    sqIconBorder: "border-rose-800/50",
    footerBg: "bg-[#0b0506]/95 backdrop-blur-xl",
    footerBorder: "border-rose-950",
    modalBg: "bg-[#1f0d11]/95 backdrop-blur-2xl",
    modalBorder: "border-rose-900/60 shadow-2xl",
    modalText: "text-rose-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-rose-950/70 text-rose-300 border border-rose-500/30 backdrop-blur-md",
    categoryBar: "bg-rose-500 shadow-sm",
    galaxyConfig: {
      spaceBg: "#12080a",
      nebula1: "rgba(244, 63, 94, 0.07)",
      nebula2: "rgba(159, 18, 57, 0.06)",
      nebula3: "rgba(136, 19, 55, 0.05)",
      starColor: "#ffe4e6",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 6. AMBER DARK
  sunset: {
    name: "Amber Dark",
    mode: "dark",
    icon: "☀️",
    badge: "Dark Amber",
    pageBg: "bg-[#120e06]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-amber-100",
    subtextColor: "text-amber-200/80",
    headingColor: "text-white",
    mutedText: "text-amber-300/60",
    headerBg: "bg-[#1f170a]/85 backdrop-blur-2xl border-b border-amber-900/60 shadow-md",
    headerBorder: "border-b border-amber-900/60",
    brandText: "text-amber-400",
    activeNavBg: "bg-amber-600/30 border border-amber-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-amber-950/40",
    cardBg: "bg-[#231a0c]/75 backdrop-blur-xl border border-amber-900/40 shadow-md",
    cardBorder: "border-amber-900/40",
    cardBorderHover: "hover:border-amber-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#1f170a]/85 backdrop-blur-2xl border border-amber-900/50 shadow-xl",
    sidebarBorder: "border-amber-900/50",
    catBtnBg: "bg-[#2e220f]/70 backdrop-blur-md",
    catBtnText: "text-amber-200 hover:text-white",
    catBtnBorder: "border-amber-900/40",
    inputBg: "bg-[#271d0e]/80 backdrop-blur-md",
    inputBorder: "border-amber-900/50",
    inputText: "text-amber-100",
    siteCardBg: "bg-gradient-to-b from-[#312410]/85 to-[#171107]/95 backdrop-blur-xl",
    siteCardBorder: "border-amber-900/40",
    sqIconBg: "bg-[#382b18]/90 border border-amber-800/50",
    sqIconBorder: "border-amber-800/50",
    footerBg: "bg-[#0b0804]/95 backdrop-blur-xl",
    footerBorder: "border-amber-950",
    modalBg: "bg-[#1f170a]/95 backdrop-blur-2xl",
    modalBorder: "border-amber-900/60 shadow-2xl",
    modalText: "text-amber-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-amber-950/70 text-amber-300 border border-amber-500/30 backdrop-blur-md",
    categoryBar: "bg-amber-500 shadow-sm",
    galaxyConfig: {
      spaceBg: "#120e06",
      nebula1: "rgba(245, 158, 11, 0.07)",
      nebula2: "rgba(180, 83, 9, 0.06)",
      nebula3: "rgba(146, 64, 14, 0.05)",
      starColor: "#fef3c7",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 7. MAUVE DARK
  sakura: {
    name: "Mauve Dark",
    mode: "dark",
    icon: "🌸",
    badge: "Dark Mauve",
    pageBg: "bg-[#12080f]",
    textureClass: "theme-texture-dots-dark",
    textColor: "text-pink-100",
    subtextColor: "text-pink-200/80",
    headingColor: "text-white",
    mutedText: "text-pink-300/60",
    headerBg: "bg-[#1f0d19]/85 backdrop-blur-2xl border-b border-pink-900/60 shadow-md",
    headerBorder: "border-b border-pink-900/60",
    brandText: "text-pink-400",
    activeNavBg: "bg-pink-600/30 border border-pink-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-pink-950/40",
    cardBg: "bg-[#230f1d]/75 backdrop-blur-xl border border-pink-900/40 shadow-md",
    cardBorder: "border-pink-900/40",
    cardBorderHover: "hover:border-pink-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#1f0d19]/85 backdrop-blur-2xl border border-pink-900/50 shadow-xl",
    sidebarBorder: "border-pink-900/50",
    catBtnBg: "bg-[#2d1225]/70 backdrop-blur-md",
    catBtnText: "text-pink-200 hover:text-white",
    catBtnBorder: "border-pink-900/40",
    inputBg: "bg-[#270f20]/80 backdrop-blur-md",
    inputBorder: "border-pink-900/50",
    inputText: "text-pink-100",
    siteCardBg: "bg-gradient-to-b from-[#301328]/85 to-[#160913]/95 backdrop-blur-xl",
    siteCardBorder: "border-pink-900/40",
    sqIconBg: "bg-[#3c1832]/90 border border-pink-800/50",
    sqIconBorder: "border-pink-800/50",
    footerBg: "bg-[#0b0509]/95 backdrop-blur-xl",
    footerBorder: "border-pink-950",
    modalBg: "bg-[#1f0d19]/95 backdrop-blur-2xl",
    modalBorder: "border-pink-900/60 shadow-2xl",
    modalText: "text-pink-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-pink-950/70 text-pink-300 border border-pink-500/30 backdrop-blur-md",
    categoryBar: "bg-pink-500 shadow-sm",
    galaxyConfig: {
      spaceBg: "#12080f",
      nebula1: "rgba(236, 72, 153, 0.07)",
      nebula2: "rgba(157, 23, 77, 0.06)",
      nebula3: "rgba(131, 24, 67, 0.05)",
      starColor: "#fce7f3",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 8. ARCTIC SLATE
  arctic: {
    name: "Arctic Slate",
    mode: "dark",
    icon: "🧊",
    badge: "Dark Ice",
    pageBg: "bg-[#080e14]",
    textureClass: "theme-texture-mesh-dark",
    textColor: "text-sky-100",
    subtextColor: "text-sky-200/80",
    headingColor: "text-white",
    mutedText: "text-sky-300/60",
    headerBg: "bg-[#0d1822]/85 backdrop-blur-2xl border-b border-sky-900/60 shadow-md",
    headerBorder: "border-b border-sky-900/60",
    brandText: "text-sky-400",
    activeNavBg: "bg-sky-600/30 border border-sky-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-sky-950/40",
    cardBg: "bg-[#0f1d2b]/75 backdrop-blur-xl border border-sky-900/40 shadow-md",
    cardBorder: "border-sky-900/40",
    cardBorderHover: "hover:border-sky-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#0d1822]/85 backdrop-blur-2xl border border-sky-900/50 shadow-xl",
    sidebarBorder: "border-sky-900/50",
    catBtnBg: "bg-[#142638]/70 backdrop-blur-md",
    catBtnText: "text-sky-200 hover:text-white",
    catBtnBorder: "border-sky-900/40",
    inputBg: "bg-[#112131]/80 backdrop-blur-md",
    inputBorder: "border-sky-900/50",
    inputText: "text-sky-100",
    siteCardBg: "bg-gradient-to-b from-[#15293d]/85 to-[#0a141e]/95 backdrop-blur-xl",
    siteCardBorder: "border-sky-900/40",
    sqIconBg: "bg-[#19324b]/90 border border-sky-800/50",
    sqIconBorder: "border-sky-800/50",
    footerBg: "bg-[#05090d]/95 backdrop-blur-xl",
    footerBorder: "border-sky-950",
    modalBg: "bg-[#0d1822]/95 backdrop-blur-2xl",
    modalBorder: "border-sky-900/60 shadow-2xl",
    modalText: "text-sky-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-sky-950/70 text-sky-300 border border-sky-500/30 backdrop-blur-md",
    categoryBar: "bg-sky-500 shadow-sm",
    galaxyConfig: {
      spaceBg: "#080e14",
      nebula1: "rgba(56, 189, 248, 0.07)",
      nebula2: "rgba(12, 74, 110, 0.06)",
      nebula3: "rgba(3, 105, 161, 0.05)",
      starColor: "#e0f2fe",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 9. PURE OBSIDIAN
  obsidian: {
    name: "Pure Obsidian",
    mode: "dark",
    icon: "⭐",
    badge: "Monochrome Dark",
    pageBg: "bg-[#09090b]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-zinc-100",
    subtextColor: "text-zinc-300",
    headingColor: "text-white",
    mutedText: "text-zinc-400",
    headerBg: "bg-[#121215]/85 backdrop-blur-2xl border-b border-zinc-800 shadow-md",
    headerBorder: "border-b border-zinc-800",
    brandText: "text-zinc-200",
    activeNavBg: "bg-zinc-700/40 border border-zinc-600/60 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-zinc-300 hover:text-white hover:bg-zinc-800/40",
    cardBg: "bg-[#18181b]/75 backdrop-blur-xl border border-zinc-800 shadow-md",
    cardBorder: "border-zinc-800",
    cardBorderHover: "hover:border-zinc-600",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#121215]/85 backdrop-blur-2xl border border-zinc-800 shadow-xl",
    sidebarBorder: "border-zinc-800",
    catBtnBg: "bg-[#202024]/70 backdrop-blur-md",
    catBtnText: "text-zinc-200 hover:text-white",
    catBtnBorder: "border-zinc-800",
    inputBg: "bg-[#1e1e22]/80 backdrop-blur-md",
    inputBorder: "border-zinc-800",
    inputText: "text-white",
    siteCardBg: "bg-gradient-to-b from-[#202025]/85 to-[#101012]/95 backdrop-blur-xl",
    siteCardBorder: "border-zinc-800",
    sqIconBg: "bg-[#27272a]/90 border border-zinc-700/60",
    sqIconBorder: "border-zinc-700/60",
    footerBg: "bg-[#060607]/95 backdrop-blur-xl",
    footerBorder: "border-zinc-900",
    modalBg: "bg-[#121215]/95 backdrop-blur-2xl",
    modalBorder: "border-zinc-700 shadow-2xl",
    modalText: "text-zinc-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-zinc-900/80 text-zinc-200 border border-zinc-700/60 backdrop-blur-md",
    categoryBar: "bg-zinc-400 shadow-sm",
    galaxyConfig: {
      spaceBg: "#09090b",
      nebula1: "rgba(113, 113, 122, 0.06)",
      nebula2: "rgba(63, 63, 70, 0.05)",
      nebula3: "rgba(39, 39, 42, 0.04)",
      starColor: "#ffffff",
      accentGlow: "rgba(255, 255, 255, 0.2)",
    },
  },

  // 10. IMPERIAL DARK
  aether: {
    name: "Imperial Dark",
    mode: "dark",
    icon: "👑",
    badge: "Dark Gold",
    pageBg: "bg-[#100c06]",
    textureClass: "theme-texture-grid-dark",
    textColor: "text-amber-100",
    subtextColor: "text-amber-200/80",
    headingColor: "text-white",
    mutedText: "text-amber-300/60",
    headerBg: "bg-[#1c150b]/85 backdrop-blur-2xl border-b border-amber-900/60 shadow-md",
    headerBorder: "border-b border-amber-900/60",
    brandText: "text-amber-300",
    activeNavBg: "bg-amber-600/30 border border-amber-500/50 text-white font-bold backdrop-blur-md",
    inactiveNavText: "text-slate-300 hover:text-white hover:bg-amber-950/40",
    cardBg: "bg-[#20180d]/75 backdrop-blur-xl border border-amber-900/40 shadow-md",
    cardBorder: "border-amber-900/40",
    cardBorderHover: "hover:border-amber-500/50",
    cardGlow: "hover:shadow-lg",
    sidebarBg: "bg-[#1c150b]/85 backdrop-blur-2xl border border-amber-900/50 shadow-xl",
    sidebarBorder: "border-amber-900/50",
    catBtnBg: "bg-[#2a2012]/70 backdrop-blur-md",
    catBtnText: "text-amber-200 hover:text-white",
    catBtnBorder: "border-amber-900/40",
    inputBg: "bg-[#241b0f]/80 backdrop-blur-md",
    inputBorder: "border-amber-900/50",
    inputText: "text-amber-100",
    siteCardBg: "bg-gradient-to-b from-[#2d2213]/85 to-[#150f08]/95 backdrop-blur-xl",
    siteCardBorder: "border-amber-900/40",
    sqIconBg: "bg-[#382b18]/90 border border-amber-800/50",
    sqIconBorder: "border-amber-800/50",
    footerBg: "bg-[#090703]/95 backdrop-blur-xl",
    footerBorder: "border-amber-950",
    modalBg: "bg-[#1c150b]/95 backdrop-blur-2xl",
    modalBorder: "border-amber-900/60 shadow-2xl",
    modalText: "text-amber-100",
    aura1: "bg-transparent",
    aura2: "bg-transparent",
    accentBadge: "bg-amber-950/70 text-amber-200 border border-amber-500/30 backdrop-blur-md",
    categoryBar: "bg-amber-400 shadow-sm",
    galaxyConfig: {
      spaceBg: "#100c06",
      nebula1: "rgba(251, 191, 36, 0.07)",
      nebula2: "rgba(180, 83, 9, 0.06)",
      nebula3: "rgba(146, 64, 14, 0.05)",
      starColor: "#fef08a",
      accentGlow: "rgba(255, 255, 255, 0.2)",
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
    syncWithServer().then(() => setSitesList(getSavedSites()));

    const handleSitesUpdate = () => setSitesList(getSavedSites());
    const handleSync = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        syncWithServer().then(() => setSitesList(getSavedSites()));
      }
    };

    window.addEventListener("allsitehub_sites_updated", handleSitesUpdate);
    window.addEventListener("storage", handleSitesUpdate);
    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    // Live instant auto-sync polling every 10 seconds across all devices
    const syncTimer = setInterval(() => {
      syncWithServer().then(() => setSitesList(getSavedSites()));
    }, 10000);

    return () => {
      window.removeEventListener("allsitehub_sites_updated", handleSitesUpdate);
      window.removeEventListener("storage", handleSitesUpdate);
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
      clearInterval(syncTimer);
    };
  }, []);

  // Mobile Touch Pull-to-Refresh Handler
  useEffect(() => {
    let startY = 0;
    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || window.scrollY > 0) return;
      const currentY = e.touches[0].clientY;
      const diffY = currentY - startY;
      if (diffY > 150) {
        isPulling = false;
        window.location.reload();
      }
    };

    const handleTouchEnd = () => {
      isPulling = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
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
    if (!reqSiteName.trim() || !reqSiteUrl.trim()) return;

    const newRequest: UserRequestItem = {
      id: `req-${Date.now()}`,
      name: reqSiteName.trim(),
      url: reqSiteUrl.trim(),
      category: reqSiteCategory,
      tags: reqFeatures.trim() || "Community",
      status: "pending",
      submittedAt: Date.now(),
    };

    const existingRequests = getSavedUserRequests();
    saveUserRequests([newRequest, ...existingRequests]);

    setReqSuccess(true);
    setTimeout(() => {
      setReqSuccess(false);
      setShowModal(null);
      setReqSiteName("");
      setReqSiteUrl("");
      setReqFeatures("");
    }, 1800);
  };

  // High-Performance Single-Pass Category Site Filtering Memoization
  const filteredSitesByCategory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const map: Record<string, SiteItem[]> = {};
    for (let i = 0; i < CATEGORIES.length; i++) {
      map[CATEGORIES[i]] = [];
    }

    for (let i = 0; i < sitesList.length; i++) {
      const site = sitesList[i];
      if (!site || !map[site.category]) continue;

      if (q) {
        const matchesName = site.name.toLowerCase().includes(q);
        const matchesDomain = site.domain.toLowerCase().includes(q);
        const matchesTags = site.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDomain && !matchesTags) continue;
      }

      map[site.category].push(site);
    }
    return map;
  }, [sitesList, searchQuery]);

  // Utility to calculate real-time category counts
  const getCategoryCount = (categoryName: string) => {
    return filteredSitesByCategory[categoryName]?.length || 0;
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
                "alternateName": [
                  "All Site",
                  "All Site Hub",
                  "All SiteHub",
                  "SiteHub",
                  "AllSite",
                  "AllSite Hub",
                  "All Sites Hub",
                  "AllSiteHub Online",
                  "sithub",
                  "allsitehub.online",
                  "all-site-hub",
                  "all-sitehub",
                  "allsite",
                  "allsites",
                  "sithub.online",
                  "all site directory"
                ],
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
                "alternateName": [
                  "All Site",
                  "All Site Hub",
                  "All SiteHub",
                  "SiteHub",
                  "AllSite",
                  "AllSite Hub",
                  "All Sites Hub",
                  "AllSiteHub Online",
                  "sithub",
                  "allsitehub.online",
                  "all-site-hub",
                  "all-sitehub",
                  "allsite",
                  "allsites",
                  "sithub.online",
                  "all site directory"
                ],
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

      {/* TOP BACKGROUND AURAS (GPU Optimized) */}
      <div className="fixed top-0 left-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] rounded-full pointer-events-none blur-[70px] sm:blur-[120px] opacity-30 sm:opacity-40 z-0 transform-gpu will-change-transform" style={{ background: activeTheme.galaxyConfig.nebula1 }} />
      <div className="fixed bottom-0 right-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] rounded-full pointer-events-none blur-[70px] sm:blur-[120px] opacity-25 sm:opacity-35 z-0 transform-gpu will-change-transform" style={{ background: activeTheme.galaxyConfig.nebula2 }} />

      {/* GLASS HEADER / NAVBAR */}
      <header className={`sticky top-0 z-40 w-full ${activeTheme.headerBg} transition-all duration-300`}>
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-3 flex items-center justify-between gap-4">
          
          {/* Left Brand Logo (Click to Reload & Refresh) */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => {
              setActiveNav("Home");
              window.location.reload();
            }}
            title="Click to Reload & Refresh AllSiteHub"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-slate-700 to-indigo-500 p-[2px] shadow-md border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0c0d14] rounded-[10px] flex items-center justify-center font-black italic text-base sm:text-lg text-indigo-300">
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
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-indigo-400 rounded-full" />
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
              title="Explore Live Themes"
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
            <div className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#081410]/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
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
            <div className="flex flex-col gap-1.5 w-full drop-shadow-sm">
              <h1 className={`text-2xl xs:text-3xl sm:text-5xl xl:text-7xl 2xl:text-8xl font-black tracking-tight ${activeTheme.headingColor} uppercase leading-[1.15]`}>
                <span>
                  {bannerConfig.line1Text}{" "}
                  <span className={`brush-font ${activeTheme.brandText} font-bold tracking-wider italic text-3xl xs:text-4xl sm:text-6xl xl:text-8xl 2xl:text-9xl hover:scale-105 transition-transform inline-block ml-1 sm:ml-2 normal-case drop-shadow-md`}>
                    {bannerConfig.line1Highlight}
                  </span>
                </span>
                <span className="block mt-1">
                  {bannerConfig.line2Text}{" "}
                  <span className={`brush-font ${activeTheme.brandText} font-bold tracking-wider italic text-3xl xs:text-4xl sm:text-6xl xl:text-8xl 2xl:text-9xl hover:scale-105 transition-transform inline-block ml-1 sm:ml-2 normal-case drop-shadow-md`}>
                    {bannerConfig.line2Highlight}
                  </span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className={`text-xs sm:text-base xl:text-lg ${activeTheme.subtextColor} font-medium max-w-2xl leading-relaxed`}>
              {bannerConfig.description}
            </p>

            {/* Action Buttons & Community Badges */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2 w-full">
              <button
                onClick={() => {
                  const el = document.getElementById("browse-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full purple-btn-primary text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all min-h-[42px]"
              >
                <span>Browse Directory</span>
                <span className="text-base font-bold">↓</span>
              </button>

              {/* Compact & Ultra-Attractive Discord & Reddit Row (Single Row Container) */}
              <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
                <a
                  href="https://discord.gg/QnTrWqwcJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#5865F2]/20 hover:bg-[#5865F2] border border-[#5865F2]/40 hover:border-[#5865F2] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer backdrop-blur-md min-h-[42px]"
                >
                  <span className="text-sm">💬</span>
                  <span>Discord</span>
                </a>

                <a
                  href="https://www.reddit.com/user/Ill_Committee7612/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#FF4500]/20 hover:bg-[#FF4500] border border-[#FF4500]/40 hover:border-[#FF4500] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer backdrop-blur-md min-h-[42px]"
                >
                  <span className="text-sm">🔴</span>
                  <span>Reddit</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column Featured Rectangle Promo Banner (Optimized for Mobile Phones & Desktops) */}
          {bannerConfig.promoEnabled !== false && (
            <div className="lg:col-span-5 flex justify-center lg:justify-end z-20 w-full mt-2 lg:mt-0">
              <a
                href={
                  bannerConfig.promoTargetUrl && bannerConfig.promoTargetUrl !== "https://allsitehub.online"
                    ? bannerConfig.promoTargetUrl
                    : "https://pantyflix.org"
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full ${activeTheme.cardBg} border ${activeTheme.cardBorder} hover:${activeTheme.cardBorderHover} rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-2xl transition-all duration-300 relative group overflow-hidden flex flex-col justify-between aspect-auto sm:aspect-[2.5/1] min-h-[200px] sm:min-h-[220px] cursor-pointer`}
              >
                {/* Background Hero Banner Graphic */}
                <div className="absolute inset-0 z-0 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden rounded-3xl">
                  <img
                    src={bannerConfig.heroImageUrl || "/hero_banner.png"}
                    alt={bannerConfig.promoSiteName || "PantyFlix Banner"}
                    loading="eager"
                    className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                </div>

                {/* Subtle Backdrop Gradient Accent */}
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-slate-500/10 blur-3xl transition-all pointer-events-none z-0" />

                {/* Top Row: Small Badge Tag & Small Corner Visit Button */}
                <div className="flex items-center justify-between relative z-10 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md shadow-xs">
                      <span>⭐</span>
                      <span>{bannerConfig.cardBadgeText || "FEATURED"}</span>
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                      ● LIVE
                    </span>
                  </div>

                  {/* SMALL CORNER VISIT BUTTON */}
                  <span className="px-3.5 py-1.5 rounded-full bg-purple-600/90 group-hover:bg-purple-500 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all group-hover:scale-105 shrink-0 backdrop-blur-md">
                    <span>{bannerConfig.promoButtonText || "Visit"}</span>
                    <span className="text-xs font-bold">{bannerConfig.promoButtonIcon || "↗"}</span>
                  </span>
                </div>

                {/* Bottom Row: Compact Title, Tagline & Small Hashtags */}
                <div className="flex flex-col gap-1 relative z-10 mt-auto pt-6">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-md group-hover:text-purple-300 transition-colors">
                    {bannerConfig.promoSiteName || "Featured Portal"}
                  </h3>
                  
                  {bannerConfig.promoTagline && (
                    <p className="text-xs text-slate-200/90 leading-snug line-clamp-2 sm:line-clamp-1 drop-shadow-sm font-medium">
                      {bannerConfig.promoTagline}
                    </p>
                  )}

                  {/* Compact Interactive Hashtags Chips */}
                  {bannerConfig.promoHashtags && bannerConfig.promoHashtags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {bannerConfig.promoHashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] sm:text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-black/80 text-purple-300 border border-purple-500/30 backdrop-blur-md shadow-xs"
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
                const catSites = filteredSitesByCategory[catName] || [];

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

                    {/* Category Sites Grid or List View - COMPACT & ULTRA-SMOOTH CARDS */}
                    {catSites.length === 0 ? (
                      <div className={`p-6 rounded-2xl ${activeTheme.cardBg} border ${activeTheme.cardBorder} text-center text-xs sm:text-sm ${activeTheme.mutedText} backdrop-blur-xl`}>
                        No portals added yet in {catName}.
                      </div>
                    ) : viewMode === "grid" ? (
                      /* COMPACT CARDS GRID - 2 to 7 columns with ultra-smooth transitions */
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2.5 sm:gap-3">
                        {catSites.map((site) => (
                          <a
                            key={site.id}
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative ${activeTheme.siteCardBg} border ${activeTheme.siteCardBorder} ${activeTheme.cardBorderHover} rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-between text-center transition-all duration-300 ease-out will-change-transform transform-gpu hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-xl ${activeTheme.cardGlow} cursor-pointer overflow-hidden backdrop-blur-xl min-h-[130px] sm:min-h-[145px]`}
                          >
                            {/* Top Badge Tag */}
                            <div className="absolute top-2 left-2 z-20">
                              {site.isTrusted ? (
                                <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider shadow-xs backdrop-blur-md">
                                  TRUSTED
                                </span>
                              ) : site.isFeatured ? (
                                <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-400 border border-amber-500/40 uppercase tracking-wider shadow-xs backdrop-blur-md">
                                  FEATURED
                                </span>
                              ) : site.isNew ? (
                                <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-950/90 text-blue-400 border border-blue-500/40 uppercase tracking-wider shadow-xs backdrop-blur-md">
                                  NEW
                                </span>
                              ) : site.badge ? (
                                <span className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded ${activeTheme.accentBadge} uppercase tracking-wider shadow-xs backdrop-blur-md`}>
                                  {site.badge}
                                </span>
                              ) : null}
                            </div>

                            {/* Compact Icon Box */}
                            <div className={`sq-icon-btn w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 p-2 rounded-xl ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 ease-out shadow-xs my-auto backdrop-blur-md mt-3.5 sm:mt-4`}>
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

                            {/* Card Details */}
                            <div className="w-full flex flex-col items-center gap-0.5 mt-auto pt-2 z-10">
                              <h3 className={`font-black ${activeTheme.headingColor} text-[11px] sm:text-xs tracking-wide uppercase group-hover:${activeTheme.brandText} transition-colors truncate w-full`}>
                                {site.name}
                              </h3>
                              <span className={`text-[9px] sm:text-[10px] font-mono ${activeTheme.mutedText} flex items-center justify-center gap-1 truncate w-full opacity-80`}>
                                <span className="text-[8px] opacity-60">🌐</span>
                                <span className="truncate">{site.domain}</span>
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      /* COMPACT LIST VIEW */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                        {catSites.map((site) => (
                          <a
                            key={site.id}
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative ${activeTheme.siteCardBg} border ${activeTheme.siteCardBorder} ${activeTheme.cardBorderHover} rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-all duration-300 ease-out will-change-transform transform-gpu hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.98] shadow-sm hover:shadow-lg ${activeTheme.cardGlow} cursor-pointer overflow-hidden backdrop-blur-xl`}
                          >
                            <div className={`absolute top-0 left-0 right-0 h-1 ${activeTheme.categoryBar} opacity-70 group-hover:opacity-100 transition-opacity`} />
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`sq-icon-btn w-9 h-9 sm:w-10 sm:h-10 p-2 ${activeTheme.sqIconBg} border ${activeTheme.sqIconBorder} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-xs backdrop-blur-md`}>
                                <img
                                  src={getFaviconUrl(site.domain || site.url)}
                                  alt={site.name}
                                  className="w-full h-full object-contain drop-shadow-sm"
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
                                <h3 className={`font-black ${activeTheme.headingColor} text-[11px] sm:text-xs tracking-wide uppercase group-hover:${activeTheme.brandText} transition-colors truncate`}>
                                  {site.name}
                                </h3>
                                <span className={`text-[9px] sm:text-[10px] font-mono ${activeTheme.mutedText} truncate opacity-80`}>
                                  {site.domain}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-black opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
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
                            ? "border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-950/40 scale-[1.02] shadow-lg"
                            : "border-slate-700/60 hover:border-slate-500/70 bg-slate-900/60 hover:bg-slate-900/90"
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
