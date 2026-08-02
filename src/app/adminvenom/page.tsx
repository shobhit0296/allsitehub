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
  const [activeTab, setActiveTab] = useState<"sites" | "add" | "requests" | "banner">("sites");
  const [adminSearch, setAdminSearch] = useState("");

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
            onClick={() => setActiveTab("banner")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "banner"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>✨ Edit Home Banner</span>
          </button>
        </div>

        {/* TAB 1: SITES MANAGER */}
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

              <button
                onClick={() => setActiveTab("add")}
                className="purple-btn-primary px-5 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shrink-0"
              >
                + Add Portal
              </button>
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
                .map((site) => (
                  <div
                    key={site.id}
                    className="p-5 rounded-2xl bg-[#090717]/95 border border-slate-800 flex flex-col justify-between gap-4 shadow-lg hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
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
                ))}
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
