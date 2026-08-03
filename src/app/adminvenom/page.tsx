"use client";

import React, { useState, useEffect } from "react";
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
  saveBannerConfig,
  getSavedSites,
  saveSitesToStorage,
} from "../data";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Directory & Requests State
  const [sitesList, setSitesList] = useState<SiteItem[]>(STREAMING_SITES);
  const [activeTab, setActiveTab] = useState<"sites" | "add" | "requests" | "promo" | "banner">("promo");
  const [adminSearch, setAdminSearch] = useState("");

  // Featured Promo Specific Form & Tag State
  const [promoTagInput, setPromoTagInput] = useState("");
  const [promoUploadError, setPromoUploadError] = useState("");

  // Drag & Reorder State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleReorderDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const updated = [...sitesList];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);
    updateSites(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveSite = (index: number, direction: "up" | "down" | "top") => {
    const updated = [...sitesList];
    if (direction === "up" && index > 0) {
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    } else if (direction === "down" && index < updated.length - 1) {
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    } else if (direction === "top" && index > 0) {
      const [movedItem] = updated.splice(index, 1);
      updated.unshift(movedItem);
    }
    updateSites(updated);
  };

  // Load saved sites on mount
  useEffect(() => {
    setSitesList(getSavedSites());
  }, []);

  // Helper to update sites & sync localStorage
  const updateSites = (newSites: SiteItem[]) => {
    setSitesList(newSites);
    saveSitesToStorage(newSites);
  };

  // Banner Customization State
  const [bannerConfig, setBannerConfigState] = useState<BannerConfig>(DEFAULT_BANNER_CONFIG);
  const [bannerSuccess, setBannerSuccess] = useState(false);

  useEffect(() => {
    setBannerConfigState(getBannerConfig());
  }, []);

  // Big Add Site Form State
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSiteCategory, setNewSiteCategory] = useState<string>(CATEGORIES[0]);
  const [newSiteTags, setNewSiteTags] = useState("");
  const [newIsTrusted, setNewIsTrusted] = useState(false);
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [newIsNew, setNewIsNew] = useState(false);
  const [newBadge, setNewBadge] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Edit Site State
  const [editingSite, setEditingSite] = useState<SiteItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState<string>(CATEGORIES[0]);
  const [editTags, setEditTags] = useState("");
  const [editIsTrusted, setEditIsTrusted] = useState(false);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsNew, setEditIsNew] = useState(false);
  const [editBadge, setEditBadge] = useState("");

  // User Requests Queue
  const [userRequests, setUserRequests] = useState([
    {
      id: "req-1",
      name: "AniStream HD",
      url: "https://anistream.live",
      category: "ANIME",
      tags: "4K, Dubbed",
    },
    {
      id: "req-2",
      name: "SportsLive 24",
      url: "https://sportslive24.com",
      category: "LIVE TV & SPORTS",
      tags: "Football, HD",
    },
  ]);

  // Passcode Auth with Secret Password
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "shobhitallsitehubadmin8115591448") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect Administrator Secret Passcode");
    }
  };

  // Add Site
  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteUrl.trim()) return;

    const domain = getCleanDomain(newSiteUrl);

    const newSite: SiteItem = {
      id: `site-${Date.now()}`,
      name: newSiteName,
      domain: domain || newSiteName.toLowerCase() + ".com",
      url: newSiteUrl,
      category: newSiteCategory,
      tags: newSiteTags ? newSiteTags.split(",").map((t) => t.trim()) : ["HD", "Fast"],
      uptime: "99.9%",
      badge: newBadge.trim() || undefined,
      isTrusted: newIsTrusted,
      isFeatured: newIsFeatured,
      isNew: newIsNew,
    };

    updateSites([newSite, ...sitesList]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab("sites");
      setNewSiteName("");
      setNewSiteUrl("");
      setNewSiteTags("");
      setNewIsTrusted(false);
      setNewIsFeatured(false);
      setNewIsNew(false);
      setNewBadge("");
    }, 1200);
  };

  // Start Edit Site
  const handleStartEdit = (site: SiteItem) => {
    setEditingSite(site);
    setEditName(site.name);
    setEditUrl(site.url);
    setEditCategory(site.category);
    setEditTags(site.tags.join(", "));
    setEditIsTrusted(!!site.isTrusted);
    setEditIsFeatured(!!site.isFeatured);
    setEditIsNew(!!site.isNew);
    setEditBadge(site.badge || "");
  };

  // Save Edit Site Changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite || !editName.trim() || !editUrl.trim()) return;

    const domain = getCleanDomain(editUrl);
    const updated = sitesList.map((s) => {
      if (s.id === editingSite.id) {
        return {
          ...s,
          name: editName,
          domain: domain || editName.toLowerCase() + ".com",
          url: editUrl,
          category: editCategory,
          tags: editTags ? editTags.split(",").map((t) => t.trim()) : ["HD"],
          badge: editBadge.trim() || undefined,
          isTrusted: editIsTrusted,
          isFeatured: editIsFeatured,
          isNew: editIsNew,
        };
      }
      return s;
    });

    updateSites(updated);
    setEditingSite(null);
  };

  // Delete Site
  const handleDeleteSite = (id: string) => {
    if (confirm("Are you sure you want to remove this portal?")) {
      updateSites(sitesList.filter((s) => s.id !== id));
    }
  };

  // Approve Request
  const handleApproveRequest = (req: typeof userRequests[0]) => {
    const domain = getCleanDomain(req.url);
    const approvedSite: SiteItem = {
      id: `approved-${Date.now()}`,
      name: req.name,
      domain: domain || req.name.toLowerCase() + ".com",
      url: req.url,
      category: req.category,
      tags: req.tags.split(",").map((t) => t.trim()),
      uptime: "99.9%",
      isTrusted: true,
    };

    updateSites([approvedSite, ...sitesList]);
    setUserRequests(userRequests.filter((r) => r.id !== req.id));
  };

  // Banner Customization Handlers
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const hashtagsArray = bannerConfig.promoHashtagsString
      ? bannerConfig.promoHashtagsString.split(",").map((s) => {
          const trimmed = s.trim();
          return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
        }).filter(Boolean)
      : bannerConfig.promoHashtags || ["#4KHDR", "#NoAds", "#FastServer", "#FreeStreaming"];

    const updatedConfig: BannerConfig = {
      ...bannerConfig,
      promoHashtags: hashtagsArray,
    };
    setBannerConfigState(updatedConfig);
    saveBannerConfig(updatedConfig);
    setBannerSuccess(true);
    setTimeout(() => setBannerSuccess(false), 2500);
  };

  const handleResetBanner = () => {
    if (confirm("Are you sure you want to reset the home page banner to defaults?")) {
      setBannerConfigState(DEFAULT_BANNER_CONFIG);
      saveBannerConfig(DEFAULT_BANNER_CONFIG);
      setBannerSuccess(true);
      setTimeout(() => setBannerSuccess(false), 2500);
    }
  };

  // Poster Image Upload & Automatic WebP/JPEG Canvas Optimization Handler
  const handlePosterFileUpload = (file: File) => {
    setPromoUploadError("");
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type.toLowerCase())) {
      setPromoUploadError("Unsupported image format. Please select a JPG, PNG, or WebP file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL("image/webp", 0.85);
          setBannerConfigState((prev) => ({ ...prev, heroImageUrl: optimizedDataUrl }));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Feature Tag Handlers: Add, Remove, Reorder
  const handleAddPromoTag = () => {
    if (!promoTagInput.trim()) return;
    const formatted = promoTagInput.trim().startsWith("#") ? promoTagInput.trim() : `#${promoTagInput.trim()}`;
    const currentTags = bannerConfig.promoHashtags || [];
    if (!currentTags.includes(formatted)) {
      const updated = [...currentTags, formatted];
      setBannerConfigState((prev) => ({
        ...prev,
        promoHashtags: updated,
        promoHashtagsString: updated.join(", "),
      }));
    }
    setPromoTagInput("");
  };

  const handleRemovePromoTag = (indexToRemove: number) => {
    const currentTags = bannerConfig.promoHashtags || [];
    const updated = currentTags.filter((_, idx) => idx !== indexToRemove);
    setBannerConfigState((prev) => ({
      ...prev,
      promoHashtags: updated,
      promoHashtagsString: updated.join(", "),
    }));
  };

  const handleMovePromoTag = (index: number, direction: "up" | "down") => {
    const currentTags = [...(bannerConfig.promoHashtags || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentTags.length) return;
    const temp = currentTags[index];
    currentTags[index] = currentTags[targetIndex];
    currentTags[targetIndex] = temp;
    setBannerConfigState((prev) => ({
      ...prev,
      promoHashtags: currentTags,
      promoHashtagsString: currentTags.join(", "),
    }));
  };

  // Save Promo Settings
  const handleSavePromoSystem = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: BannerConfig = {
      ...bannerConfig,
      promoEnabled: bannerConfig.promoEnabled !== false,
      promoHashtagsString: (bannerConfig.promoHashtags || []).join(", "),
    };
    setBannerConfigState(updatedConfig);
    saveBannerConfig(updatedConfig);
    setBannerSuccess(true);
    setTimeout(() => setBannerSuccess(false), 2500);
  };

  // 1. Passcode Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05050c] text-white flex items-center justify-center p-4 sm:p-6 selection:bg-purple-600 relative overflow-hidden">
        {/* Background Ambient Lighting Aura */}
        <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[180px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg bg-[#090717]/95 border border-purple-500/40 rounded-3xl p-8 sm:p-10 flex flex-col gap-7 shadow-[0_0_60px_rgba(168,85,247,0.35)] transition-all">
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-3xl shadow-inner mb-2">
              👑
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome Back, Shobhit! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold">
              Enter your master secret passcode to unlock your admin control panel.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs sm:text-sm font-extrabold text-slate-300 block mb-2">
                Master Administrator Key
              </label>
              <input
                type="password"
                required
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-5 py-4 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-2xl text-white text-sm sm:text-base focus:outline-none transition-all shadow-inner font-mono tracking-wider"
              />
              {authError && <p className="text-xs sm:text-sm text-rose-400 font-extrabold mt-2 text-center">{authError}</p>}
            </div>

            <button
              type="submit"
              className="purple-btn-primary py-4 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-xl mt-1"
            >
              Unlock Shobhit&apos;s Control Panel 🚀
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-800/80">
            <Link href="/" className="text-xs sm:text-sm text-slate-400 hover:text-white font-bold transition-colors">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Secret Admin Panel
  return (
    <div className="min-h-screen bg-[#05050c] text-white flex flex-col selection:bg-purple-600">
      {/* Sleek Top Header */}
      <header className="sticky top-0 z-50 glass-nav-dark px-4 sm:px-8 py-3.5 border-b border-purple-500/20 flex items-center justify-between">
        <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
          <span>🛡️</span>
          <span>Admin Portal (/adminvenom)</span>
        </h1>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition-all"
          >
            Live Site ↗
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold transition-all"
          >
            Lock Dashboard 🔒
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab("sites")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "sites"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>📁 Live Directory</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-500/30">
              {sitesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "add"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>➕ Add New Portal</span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "requests"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>📥 Requests Inbox</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-500/30">
              {userRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("promo")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "promo"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>🔥 Featured Promo System</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${bannerConfig.promoEnabled !== false ? "bg-emerald-950 text-emerald-300 border-emerald-500/40" : "bg-rose-950 text-rose-300 border-rose-500/40"}`}>
              {bannerConfig.promoEnabled !== false ? "ACTIVE" : "OFF"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("banner")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "banner"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>✨ Edit Hero Text</span>
          </button>
        </div>

        {/* TAB 1: SITES MANAGER WITH DRAG & DROP REORDERING */}
        {activeTab === "sites" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Filter sites by name, category or domain..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="px-4 py-3 bg-[#090717] border border-slate-800 focus:border-purple-500 rounded-2xl text-xs sm:text-sm text-white focus:outline-none w-full sm:w-80"
              />

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                  💡 Drag cards or use position buttons to reorder
                </span>
                <button
                  onClick={() => setActiveTab("add")}
                  className="purple-btn-primary px-5 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shrink-0"
                >
                  + Add Portal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sitesList
                .filter((s) => {
                  if (!adminSearch.trim()) return true;
                  const q = adminSearch.toLowerCase();
                  return (
                    s.name.toLowerCase().includes(q) ||
                    s.domain.toLowerCase().includes(q) ||
                    s.category.toLowerCase().includes(q)
                  );
                })
                .map((site) => {
                  const realIndex = sitesList.findIndex((s) => s.id === site.id);
                  const isDragging = draggedIndex === realIndex;
                  const isDragOver = dragOverIndex === realIndex;

                  return (
                    <div
                      key={site.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedIndex(realIndex);
                        e.dataTransfer.setData("text/plain", realIndex.toString());
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverIndex !== realIndex) {
                          setDragOverIndex(realIndex);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleReorderDrop(realIndex);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      className={`p-5 rounded-2xl bg-[#090717]/95 border flex flex-col justify-between gap-4 shadow-lg transition-all cursor-grab active:cursor-grabbing ${
                        isDragging
                          ? "opacity-30 border-purple-500 scale-95"
                          : isDragOver
                          ? "border-purple-400 bg-purple-950/40 shadow-[0_0_30px_rgba(168,85,247,0.35)] scale-[1.02]"
                          : "border-slate-800 hover:border-purple-500/50"
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        {/* Drag Handle & Quick Position Control Bar */}
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 text-xs">
                          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5 cursor-grab">
                            <span className="text-purple-400 font-black text-sm">⋮⋮</span> Position #{realIndex + 1}
                          </span>

                          <div className="flex items-center gap-1">
                            {realIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveSite(realIndex, "top")}
                                className="px-2 py-0.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[10px] font-bold cursor-pointer transition-all"
                                title="Move to Top (#1)"
                              >
                                🔝 Top
                              </button>
                            )}
                            {realIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveSite(realIndex, "up")}
                                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer transition-all"
                                title="Move Up"
                              >
                                ▲ Up
                              </button>
                            )}
                            {realIndex < sitesList.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveSite(realIndex, "down")}
                                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer transition-all"
                                title="Move Down"
                              >
                                ▼ Down
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start justify-between gap-2 pt-1">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="sq-icon-btn w-11 h-11 p-2 flex items-center justify-center shrink-0">
                              <img
                                src={getFaviconUrl(site.domain || site.url)}
                                alt={site.name}
                                className="w-full h-full object-contain drop-shadow-sm"
                              />
                            </div>
                            <div className="flex flex-col truncate">
                              <h3 className="font-black text-base sm:text-lg text-white truncate">{site.name}</h3>
                              <span className="text-xs font-mono font-bold text-purple-300 truncate">
                                {site.domain}
                              </span>
                            </div>
                          </div>

                          <span className="text-xs font-bold text-slate-400 px-2.5 py-1 rounded-lg bg-[#140f36] border border-purple-500/20 shrink-0">
                            {site.category}
                          </span>
                        </div>

                        {/* Marks Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {site.isTrusted && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              🛡️ Trusted
                            </span>
                          )}
                          {site.isFeatured && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                              ⭐ Featured
                            </span>
                          )}
                          {site.isNew && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                              🔥 New
                            </span>
                          )}
                          {site.badge && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-500/40">
                              {site.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800"
                          title="Visit Site"
                        >
                          Open ↗
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEdit(site)}
                            className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-black cursor-pointer shadow-md"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSite(site.id)}
                            className="px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 2: ADD PORTAL PANEL */}
        {activeTab === "add" && (
          <div className="max-w-2xl w-full bg-[#090717]/95 border border-purple-500/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 mx-auto shadow-[0_0_50px_rgba(168,85,247,0.35)] transition-all">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Add New Portal</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Publish a new streaming or web portal directly to the live directory.</p>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                Live Form
              </span>
            </div>

            {formSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-center text-emerald-300 font-bold text-sm shadow-lg">
                ✓ Portal successfully added to live directory!
              </div>
            ) : (
              <form onSubmit={handleAddSite} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">Site Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FlixTor Pro"
                      value={newSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">Category *</label>
                    <select
                      value={newSiteCategory}
                      onChange={(e) => setNewSiteCategory(e.target.value)}
                      className="w-full px-4 py-3.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none transition-all shadow-inner"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">Direct Target URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://flixtor.to"
                    value={newSiteUrl}
                    onChange={(e) => setNewSiteUrl(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">Feature Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 4K, Subbed, No-Ads, Fast Player"
                    value={newSiteTags}
                    onChange={(e) => setNewSiteTags(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Editable Marks Checkboxes */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-bold text-purple-300">Editable Site Marks / Badges</label>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-white font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsTrusted}
                        onChange={(e) => setNewIsTrusted(e.target.checked)}
                        className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span>🛡️ Trusted</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-white font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsFeatured}
                        onChange={(e) => setNewIsFeatured(e.target.checked)}
                        className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span>⭐ Featured</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-white font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsNew}
                        onChange={(e) => setNewIsNew(e.target.checked)}
                        className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span>🔥 New</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Custom Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. POPULAR, TOP MANGA"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="purple-btn-primary py-4 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer mt-2 shadow-lg"
                >
                  Publish Portal Live 🚀
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: REQUESTS INBOX */}
        {activeTab === "requests" && (
          <div className="max-w-3xl w-full flex flex-col gap-4 mx-auto">
            {userRequests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#090717] border border-slate-800 text-center text-slate-400 text-sm">
                ✓ No pending user site requests.
              </div>
            ) : (
              userRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-[#090717]/95 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-base">{req.name}</h3>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                        {req.category}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{req.url}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUserRequests(userRequests.filter((r) => r.id !== req.id))}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleApproveRequest(req)}
                      className="purple-btn-primary px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-wider"
                    >
                      Approve & Publish 🚀
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: BANNER CUSTOMIZATION */}
        {activeTab === "banner" && (
          <div className="max-w-2xl w-full bg-[#090717]/95 border border-purple-500/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 mx-auto shadow-[0_0_50px_rgba(168,85,247,0.35)]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Edit Home Banner</h2>
                <p className="text-xs text-slate-400 mt-0.5">Customize headline text, hero image, and CTA button links live on home page.</p>
              </div>
              <button
                type="button"
                onClick={handleResetBanner}
                className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-bold"
              >
                Reset Defaults
              </button>
            </div>

            {bannerSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-center text-emerald-300 font-bold text-xs shadow-md">
                ✓ Home Banner updated live!
              </div>
            )}

            <form onSubmit={handleSaveBanner} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Top Badge Text</label>
                <input
                  type="text"
                  value={bannerConfig.badgeText}
                  onChange={(e) => setBannerConfigState({ ...bannerConfig, badgeText: e.target.value })}
                  className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Headline Line 1</label>
                  <input
                    type="text"
                    value={bannerConfig.line1Text}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, line1Text: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-300 block mb-1">Line 1 Highlighted</label>
                  <input
                    type="text"
                    value={bannerConfig.line1Highlight}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, line1Highlight: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Headline Line 2</label>
                  <input
                    type="text"
                    value={bannerConfig.line2Text}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, line2Text: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-300 block mb-1">Line 2 Highlighted</label>
                  <input
                    type="text"
                    value={bannerConfig.line2Highlight}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, line2Highlight: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description Paragraph</label>
                <textarea
                  rows={2}
                  value={bannerConfig.description}
                  onChange={(e) => setBannerConfigState({ ...bannerConfig, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={bannerConfig.primaryBtnText}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, primaryBtnText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Primary Button Target URL</label>
                  <input
                    type="text"
                    value={bannerConfig.primaryBtnUrl}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, primaryBtnUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={bannerConfig.secondaryBtnText}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, secondaryBtnText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Secondary Button Target URL</label>
                  <input
                    type="text"
                    value={bannerConfig.secondaryBtnUrl}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, secondaryBtnUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* PROMOTIONAL BANNER AREA CONTROLS */}
              <div className="flex flex-col gap-3 pt-3 border-t border-purple-500/30">
                <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎨</span> Promotional Poster Banner Settings
                </h3>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Poster Banner Image URL</label>
                  <input
                    type="text"
                    value={bannerConfig.heroImageUrl || ""}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, heroImageUrl: e.target.value })}
                    placeholder="/hero_banner.png or https://example.com/banner.png"
                    className="w-full px-4 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Promotional Badge Label</label>
                    <input
                      type="text"
                      value={bannerConfig.cardBadgeText || ""}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, cardBadgeText: e.target.value })}
                      placeholder="e.g. FEATURED PROMO"
                      className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-300 block mb-1">Promotional Website Name *</label>
                    <input
                      type="text"
                      value={bannerConfig.promoSiteName || ""}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, promoSiteName: e.target.value })}
                      placeholder="e.g. Flixtor 4K Ultra"
                      className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-purple-500/50 rounded-xl text-white text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-300 block mb-1">Click Redirection Target URL *</label>
                  <input
                    type="url"
                    value={bannerConfig.promoTargetUrl || ""}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, promoTargetUrl: e.target.value })}
                    placeholder="https://flixtor.to"
                    className="w-full px-4 py-2.5 bg-[#120e2b] border border-purple-500/50 rounded-xl text-white text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Feature Hashtags (comma-separated, contain #)
                  </label>
                  <input
                    type="text"
                    value={bannerConfig.promoHashtagsString !== undefined ? bannerConfig.promoHashtagsString : (bannerConfig.promoHashtags ? bannerConfig.promoHashtags.join(", ") : "#4KHDR, #NoAds, #FastServer, #FreeStreaming")}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, promoHashtagsString: e.target.value })}
                    placeholder="#4KHDR, #NoAds, #FastServer, #FreeStreaming"
                    className="w-full px-4 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="purple-btn-primary py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg mt-2"
              >
                Save Banner Settings 💾
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: FEATURED PROMO SYSTEM MANAGER */}
        {activeTab === "promo" && (
          <div className="flex flex-col gap-6">
            
            {/* Header Title & Enable/Disable Toggle Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090717]/95 border border-purple-500/30 shadow-lg">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Featured Promo Manager
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Fully customizable promotional card displayed on the live home page hero section.
                </p>
              </div>

              {/* Enable / Disable Toggle Switch */}
              <div className="flex items-center gap-3 bg-[#120e2b] p-2.5 px-4 rounded-2xl border border-purple-500/30">
                <span className="text-xs font-black uppercase text-slate-300">
                  Card Visibility:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setBannerConfigState((prev) => ({
                      ...prev,
                      promoEnabled: prev.promoEnabled === false ? true : false,
                    }))
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    bannerConfig.promoEnabled !== false
                      ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      : "bg-rose-950 text-rose-300 border border-rose-500/40"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${bannerConfig.promoEnabled !== false ? "bg-black animate-ping" : "bg-rose-400"}`} />
                  {bannerConfig.promoEnabled !== false ? "ENABLED (VISIBLE)" : "DISABLED (HIDDEN)"}
                </button>
              </div>
            </div>

            {/* Notification Alert */}
            {bannerSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
                <span>✅</span> Featured Promo settings saved successfully! Live site updated in real-time.
              </div>
            )}

            {/* Grid Layout: Form Controls (Left 7 Cols) + Live Interactive Preview (Right 5 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Form Controls Column */}
              <form onSubmit={handleSavePromoSystem} className="lg:col-span-7 flex flex-col gap-5 p-6 rounded-3xl bg-[#090717]/95 border border-purple-500/30 shadow-lg">
                
                {/* 1. Poster Image Upload & URL */}
                <div className="flex flex-col gap-3 pb-4 border-b border-slate-800">
                  <label className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <span>🖼️</span> Poster Image (JPG, PNG, WebP Supported)
                  </label>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <label className="flex-1 px-4 py-3 bg-[#120e2b] border border-purple-500/40 hover:border-purple-400 rounded-2xl text-xs text-purple-200 font-bold cursor-pointer transition-all flex items-center justify-center gap-2 hover:scale-[1.01]">
                        <span>📤 Upload Poster Image File</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handlePosterFileUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>

                      {bannerConfig.heroImageUrl && (
                        <button
                          type="button"
                          onClick={() => setBannerConfigState((prev) => ({ ...prev, heroImageUrl: "" }))}
                          className="px-3.5 py-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all"
                          title="Remove Poster Image"
                        >
                          Remove ✕
                        </button>
                      )}
                    </div>

                    {promoUploadError && (
                      <p className="text-xs font-bold text-rose-400">{promoUploadError}</p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-slate-500">OR</span>
                      <input
                        type="text"
                        value={bannerConfig.heroImageUrl || ""}
                        onChange={(e) => setBannerConfigState({ ...bannerConfig, heroImageUrl: e.target.value })}
                        placeholder="Paste Image URL (e.g. /hero_banner.png or https://...)"
                        className="w-full px-4 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Website Name & Short Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-300 block mb-1">
                      Website Title Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.promoSiteName || ""}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, promoSiteName: e.target.value })}
                      placeholder="e.g. Flixtor 4K Ultra"
                      className="w-full px-4 py-3 bg-[#120e2b] border border-purple-500/50 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-300 block mb-1">
                      Short Tagline (Subtitle)
                    </label>
                    <input
                      type="text"
                      value={bannerConfig.promoTagline || ""}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, promoTagline: e.target.value })}
                      placeholder="e.g. Stream thousands of 4K movies free"
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Redirect Destination Target URL */}
                <div>
                  <label className="text-xs font-extrabold text-purple-300 block mb-1">
                    Click Destination Target URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={bannerConfig.promoTargetUrl || ""}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, promoTargetUrl: e.target.value })}
                    placeholder="https://flixtor.to"
                    className="w-full px-4 py-3 bg-[#120e2b] border border-purple-500/50 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* 4. Badge, Button Text & Button Icon Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Badge Label</label>
                    <input
                      type="text"
                      value={bannerConfig.cardBadgeText || ""}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, cardBadgeText: e.target.value })}
                      placeholder="FEATURED PROMO"
                      className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Button Text</label>
                    <input
                      type="text"
                      value={bannerConfig.promoButtonText || "Visit"}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, promoButtonText: e.target.value })}
                      placeholder="Visit"
                      className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Button Icon</label>
                    <select
                      value={bannerConfig.promoButtonIcon || "↗"}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, promoButtonIcon: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                    >
                      <option value="↗">↗ Arrow</option>
                      <option value="⚡">⚡ Lightning</option>
                      <option value="🔥">🔥 Fire</option>
                      <option value="🍿">🍿 Popcorn</option>
                      <option value="⭐">⭐ Star</option>
                      <option value="🚀">🚀 Rocket</option>
                      <option value="🎬">🎬 Cinema</option>
                    </select>
                  </div>
                </div>

                {/* 5. Feature Tags Manager */}
                <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
                  <label className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center justify-between">
                    <span>🏷️ Feature Badges Management</span>
                    <span className="text-[10px] font-mono text-slate-400 font-normal">
                      ({bannerConfig.promoHashtags?.length || 0} badges)
                    </span>
                  </label>

                  {/* Add Tag Input Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={promoTagInput}
                      onChange={(e) => setPromoTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPromoTag();
                        }
                      }}
                      placeholder="Type hashtag (e.g. 4KHDR, NoAds, Anime)..."
                      className="flex-1 px-4 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddPromoTag}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      + Add Tag
                    </button>
                  </div>

                  {/* Interactive Tags List with Reorder & Delete */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {(bannerConfig.promoHashtags || []).map((tag, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold shadow-sm"
                      >
                        <span>{tag.startsWith("#") ? tag : `#${tag}`}</span>

                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-0.5 ml-1 border-l border-purple-500/30 pl-1.5">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMovePromoTag(idx, "up")}
                              className="text-[10px] text-purple-400 hover:text-white px-0.5 cursor-pointer"
                              title="Move left"
                            >
                              ◀
                            </button>
                          )}
                          {idx < (bannerConfig.promoHashtags?.length || 0) - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMovePromoTag(idx, "down")}
                              className="text-[10px] text-purple-400 hover:text-white px-0.5 cursor-pointer"
                              title="Move right"
                            >
                              ▶
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePromoTag(idx)}
                            className="text-[11px] text-rose-400 hover:text-rose-200 font-black ml-1 cursor-pointer"
                            title="Remove tag"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="purple-btn-primary py-4 rounded-2xl text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-xl mt-2"
                >
                  Save & Apply Featured Promo Live 🚀
                </button>
              </form>

              {/* Right Column Live Interactive Preview */}
              <div className="lg:col-span-5 flex flex-col gap-4 sticky top-24">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span>👁️</span> Live Card Preview
                  </h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${bannerConfig.promoEnabled !== false ? "bg-emerald-950 text-emerald-300 border-emerald-500/40" : "bg-rose-950 text-rose-300 border-rose-500/40"}`}>
                    {bannerConfig.promoEnabled !== false ? "● Visible on Homepage" : "○ Hidden"}
                  </span>
                </div>

                {/* Promo Card Replica */}
                <div className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl bg-[#090717] transition-all ${bannerConfig.promoEnabled === false ? "opacity-40 grayscale" : ""}`}>
                  <img
                    src={bannerConfig.heroImageUrl || "/hero_banner.png"}
                    alt={bannerConfig.promoSiteName || "Preview"}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/hero_banner.png";
                    }}
                  />

                  <div className="absolute top-3.5 right-3.5 z-20">
                    <span className="px-3 py-1 rounded-full bg-purple-950/90 text-purple-300 border border-purple-400/50 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                      {bannerConfig.cardBadgeText || "FEATURED PROMO"}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 flex flex-col gap-2 shadow-2xl">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base shrink-0">🔥</span>
                          <h3 className="text-sm font-black text-white tracking-wide truncate">
                            {bannerConfig.promoSiteName || "Flixtor 4K Ultra"}
                          </h3>
                        </div>
                        {bannerConfig.promoTagline && (
                          <p className="text-[10px] font-medium text-slate-300 truncate pl-6">
                            {bannerConfig.promoTagline}
                          </p>
                        )}
                      </div>

                      <span className="text-[10px] font-extrabold text-purple-300 bg-purple-950/80 px-2.5 py-1.5 rounded-full border border-purple-500/40 shrink-0 flex items-center gap-1">
                        <span>{bannerConfig.promoButtonText || "Visit"}</span>
                        <span className="text-xs">{bannerConfig.promoButtonIcon || "↗"}</span>
                      </span>
                    </div>

                    {(bannerConfig.promoHashtags && bannerConfig.promoHashtags.length > 0) && (
                      <div className="flex flex-wrap items-wrap gap-1.5 pt-0.5">
                        {bannerConfig.promoHashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-200 border border-purple-500/30 uppercase tracking-wider"
                          >
                            {tag.startsWith("#") ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* EDIT PORTAL MODAL OVERLAY */}
      {editingSite && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090717] border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col gap-5 shadow-[0_0_60px_rgba(168,85,247,0.4)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="text-lg font-black text-white">✏️ Edit Portal: {editingSite.name}</h3>
              <button
                onClick={() => setEditingSite(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1">Site Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1">Category *</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1">Direct URL *</label>
                <input
                  type="url"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                />
              </div>

              {/* Editable Marks Checkboxes */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-purple-300">Editable Marks / Badges</label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-white font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsTrusted}
                      onChange={(e) => setEditIsTrusted(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span>🛡️ Trusted</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsFeatured}
                      onChange={(e) => setEditIsFeatured(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span>⭐ Featured</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsNew}
                      onChange={(e) => setEditIsNew(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span>🔥 New</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Custom Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. POPULAR, TOP ANIME"
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSite(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="purple-btn-primary px-6 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Save Changes 💾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
