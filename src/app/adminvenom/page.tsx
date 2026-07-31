"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  STREAMING_SITES,
  SiteItem,
  getCleanDomain,
  getFaviconUrl,
  BannerConfig,
  DEFAULT_BANNER_CONFIG,
  getBannerConfig,
  saveBannerConfig,
} from "../data";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Directory & Requests State
  const [sitesList, setSitesList] = useState<SiteItem[]>(STREAMING_SITES);
  const [activeTab, setActiveTab] = useState<"sites" | "add" | "requests" | "banner">("sites");
  const [adminSearch, setAdminSearch] = useState("");

  // Banner Customization State
  const [bannerConfig, setBannerConfigState] = useState<BannerConfig>(DEFAULT_BANNER_CONFIG);
  const [bannerSuccess, setBannerSuccess] = useState(false);

  useEffect(() => {
    setBannerConfigState(getBannerConfig());
  }, []);


  // Big Add Site Form State
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSiteCategory, setNewSiteCategory] = useState("Movies");
  const [newSiteTags, setNewSiteTags] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Edit Site State
  const [editingSite, setEditingSite] = useState<SiteItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState("Movies");
  const [editTags, setEditTags] = useState("");

  // User Requests Queue
  const [userRequests, setUserRequests] = useState([
    {
      id: "req-1",
      name: "AniStream HD",
      url: "https://anistream.live",
      category: "Anime",
      tags: "4K, Dubbed",
    },
    {
      id: "req-2",
      name: "SportsLive 24",
      url: "https://sportslive24.com",
      category: "Sports",
      tags: "Football, HD",
    },
  ]);

  // Passcode Auth with New Secret Password
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
    };

    setSitesList([newSite, ...sitesList]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab("sites");
      setNewSiteName("");
      setNewSiteUrl("");
      setNewSiteTags("");
    }, 1200);
  };

  // Start Edit Site
  const handleStartEdit = (site: SiteItem) => {
    setEditingSite(site);
    setEditName(site.name);
    setEditUrl(site.url);
    setEditCategory(site.category);
    setEditTags(site.tags.join(", "));
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
        };
      }
      return s;
    });

    setSitesList(updated);
    setEditingSite(null);
  };

  // Delete Site
  const handleDeleteSite = (id: string) => {
    if (confirm("Are you sure you want to remove this portal?")) {
      setSitesList(sitesList.filter((s) => s.id !== id));
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
    };

    setSitesList([approvedSite, ...sitesList]);
    setUserRequests(userRequests.filter((r) => r.id !== req.id));
  };

  // Banner Customization Handlers
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    saveBannerConfig(bannerConfig);
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
            Live Site
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-7">
        {/* Tab Buttons */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <button
            onClick={() => setActiveTab("sites")}
            className={`px-6 py-3.5 rounded-2xl text-sm sm:text-base font-black tracking-wide transition-all cursor-pointer ${
              activeTab === "sites"
                ? "bg-purple-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.45)] scale-105"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            Portals ({sitesList.length})
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-3.5 rounded-2xl text-sm sm:text-base font-black tracking-wide transition-all cursor-pointer ${
              activeTab === "add"
                ? "bg-purple-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.45)] scale-105"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            Add Portal
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3.5 rounded-2xl text-sm sm:text-base font-black tracking-wide transition-all cursor-pointer ${
              activeTab === "requests"
                ? "bg-purple-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.45)] scale-105"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            Requests ({userRequests.length})
          </button>

          <button
            onClick={() => setActiveTab("banner")}
            className={`px-6 py-3.5 rounded-2xl text-sm sm:text-base font-black tracking-wide transition-all cursor-pointer ${
              activeTab === "banner"
                ? "bg-purple-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.45)] scale-105"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            Banner Customization 🎨
          </button>
        </div>


        {/* TAB 1: ENLARGED PORTALS LIST WITH EDIT OPTION */}
        {activeTab === "sites" && (
          <div className="flex flex-col gap-5">
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search portal name or domain..."
              className="w-full max-w-md px-5 py-3.5 bg-[#090717] border border-slate-800 focus:border-purple-500 rounded-2xl text-sm text-white focus:outline-none shadow-inner"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sitesList
                .filter(
                  (s) =>
                    s.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                    s.domain.toLowerCase().includes(adminSearch.toLowerCase())
                )
                .map((site) => (
                  <div
                    key={site.id}
                    className="p-6 rounded-3xl bg-[#090717] border border-purple-500/30 flex flex-col justify-between gap-4 shadow-xl hover:border-purple-500/70 transition-all hover:scale-[1.02]"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-11 h-11 rounded-2xl bg-[#130e30] border border-purple-500/40 flex items-center justify-center p-1 shrink-0 shadow-inner overflow-hidden">
                            <img
                              src={getFaviconUrl(site.domain || site.url)}
                              alt={site.name}
                              className="w-full h-full object-contain rounded-xl"
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

                      <div className="flex flex-wrap gap-1 mt-1">
                        {site.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-500/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons: Open, Edit, Delete */}
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

        {/* TAB 2: BIG ELEVATED ADD PORTAL PANEL */}
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
                      <option value="Movies">Movies & Cinema</option>
                      <option value="Anime">Anime & Manga</option>
                      <option value="Series">Series & Shows</option>
                      <option value="Sports">Live Sports</option>
                      <option value="AI & Tools">AI & Web Tools</option>
                      <option value="Live Streams">Live Streams 24/7</option>
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
          <div className="flex flex-col gap-4">
            {userRequests.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#090717] border border-slate-800 text-center text-slate-400 text-sm font-semibold">
                ✓ No pending user site requests.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-3xl bg-[#090717] border border-purple-500/30 flex items-center justify-between gap-4 shadow-lg"
                  >
                    <div className="flex flex-col truncate gap-0.5">
                      <span className="font-black text-sm sm:text-base text-white truncate">{req.name}</span>
                      <span className="text-xs text-purple-300 font-mono truncate">{req.url}</span>
                      <span className="text-xs text-slate-400 font-bold mt-1">{req.category} • #{req.tags}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setUserRequests(userRequests.filter((r) => r.id !== req.id))}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
                      >
                        Approve 🚀
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BANNER CUSTOMIZATION PANEL */}
        {activeTab === "banner" && (
          <div className="flex flex-col gap-8">
            <div className="bg-[#090717]/95 border border-purple-500/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-[0_0_50px_rgba(168,85,247,0.35)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>🎨</span>
                    <span>Home Page Banner Customization</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Update headlines, subtext, badge tags, CTA button links (with website URLs & # feature hashes), and hero visual.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetBanner}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Reset Defaults 🔄
                  </button>
                </div>
              </div>

              {bannerSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-center text-emerald-300 font-bold text-sm shadow-lg animate-in fade-in duration-200">
                  ✓ Home Page Banner updated successfully! Changes are live.
                </div>
              )}

              <form onSubmit={handleSaveBanner} className="flex flex-col gap-6">
                {/* Section 1: Badge Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Badge Icon
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.badgeIcon}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, badgeIcon: e.target.value })}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                      placeholder="e.g. ⚡"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-extrabold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Badge Label Text
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.badgeText}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, badgeText: e.target.value })}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                      placeholder="e.g. THE ULTIMATE STREAMING HUB"
                    />
                  </div>
                </div>

                {/* Section 2: Headline Lines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Line 1 Prefix Text
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.line1Text}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, line1Text: e.target.value })}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none font-bold"
                      placeholder="e.g. STREAM"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-purple-300 block mb-1.5 uppercase tracking-wider">
                      Line 1 Brush Highlight Keyword
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.line1Highlight}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, line1Highlight: e.target.value })}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-purple-500/50 focus:border-purple-400 rounded-xl text-purple-300 text-sm focus:outline-none font-bold"
                      placeholder="e.g. Limitless."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Line 2 Prefix Text
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.line2Text}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, line2Text: e.target.value })}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none font-bold"
                      placeholder="e.g. DISCOVER"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-purple-300 block mb-1.5 uppercase tracking-wider">
                      Line 2 Brush Highlight Keyword
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.line2Highlight}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, line2Highlight: e.target.value })}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-purple-500/50 focus:border-purple-400 rounded-xl text-purple-300 text-sm focus:outline-none font-bold"
                      placeholder="e.g. Endless."
                    />
                  </div>
                </div>

                {/* Section 3: Subtitle / Description */}
                <div>
                  <label className="text-xs font-extrabold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Banner Subtext / Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bannerConfig.description}
                    onChange={(e) => setBannerConfigState({ ...bannerConfig, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                    placeholder="Enter hero banner subtitle text..."
                  />
                </div>

                {/* Section 4: Primary CTA Button (Text & Feature Hash URL) */}
                <div className="p-4 rounded-2xl bg-[#0e0a24] border border-purple-500/30 flex flex-col gap-4">
                  <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🚀</span> Primary Action Button (Target URL / Feature Hash)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Button Label</label>
                      <input
                        type="text"
                        required
                        value={bannerConfig.primaryBtnText}
                        onChange={(e) => setBannerConfigState({ ...bannerConfig, primaryBtnText: e.target.value })}
                        className="w-full px-4 py-3 bg-[#161138] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                        placeholder="e.g. EXPLORE CATEGORIES"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Target URL / Feature Link (with #)
                      </label>
                      <input
                        type="text"
                        required
                        value={bannerConfig.primaryBtnUrl}
                        onChange={(e) => setBannerConfigState({ ...bannerConfig, primaryBtnUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-[#161138] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none font-mono text-xs"
                        placeholder="e.g. #browse-directory OR https://example.com/app#feature"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        💡 Enter <code className="text-purple-300">#browse-directory</code> or any website URL with feature hash like <code className="text-purple-300">https://mywebsite.com#feature</code>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 5: Secondary CTA Button (Text & Feature Hash URL) */}
                <div className="p-4 rounded-2xl bg-[#0e0a24] border border-purple-500/30 flex flex-col gap-4">
                  <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💬</span> Secondary Action Button (Target URL / Feature Hash)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Button Label</label>
                      <input
                        type="text"
                        required
                        value={bannerConfig.secondaryBtnText}
                        onChange={(e) => setBannerConfigState({ ...bannerConfig, secondaryBtnText: e.target.value })}
                        className="w-full px-4 py-3 bg-[#161138] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                        placeholder="e.g. REQUEST A SITE"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Target URL / Feature Link (with #)
                      </label>
                      <input
                        type="text"
                        required
                        value={bannerConfig.secondaryBtnUrl}
                        onChange={(e) => setBannerConfigState({ ...bannerConfig, secondaryBtnUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-[#161138] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none font-mono text-xs"
                        placeholder="e.g. request-modal OR https://example.com/site#feature-key"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        💡 Enter <code className="text-purple-300">request-modal</code> or direct URL followed by hash <code className="text-purple-300">https://website.com/page#feature</code>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 6: Image & Card Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Hero Image URL / Path
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.heroImageUrl}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, heroImageUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none font-mono text-xs"
                      placeholder="e.g. /hero_banner.png or https://..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Hero Card Footer Status Label
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerConfig.cardBadgeText}
                      onChange={(e) => setBannerConfigState({ ...bannerConfig, cardBadgeText: e.target.value })}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none"
                      placeholder="e.g. Live Stream Hub"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="purple-btn-primary py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wider cursor-pointer shadow-xl mt-2"
                >
                  Save Banner Changes 💾
                </button>
              </form>
            </div>

            {/* Real-time Banner Preview Box */}
            <div className="bg-[#090717]/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <span>👁️</span> Real-time Home Banner Preview
              </h3>
              
              <div className="p-6 rounded-2xl bg-[#05050c] border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-3 max-w-xl text-center lg:text-left items-center lg:items-start">
                  <div className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold tracking-wider uppercase">
                    <span>{bannerConfig.badgeIcon}</span> {bannerConfig.badgeText}
                  </div>
                  
                  <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                    {bannerConfig.line1Text}{" "}
                    <span className="brush-font text-purple-400 italic font-bold ml-1">{bannerConfig.line1Highlight}</span>
                    <br />
                    {bannerConfig.line2Text}{" "}
                    <span className="brush-font text-purple-400 italic font-bold ml-1">{bannerConfig.line2Highlight}</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3">{bannerConfig.description}</p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs uppercase shadow-md">
                      🚀 {bannerConfig.primaryBtnText}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs uppercase">
                      💬 {bannerConfig.secondaryBtnText}
                    </span>
                  </div>
                </div>

                <div className="relative w-48 aspect-[4/3] rounded-2xl overflow-hidden border border-purple-500/40 shrink-0 bg-[#090716]">
                  <img
                    src={bannerConfig.heroImageUrl}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/hero_banner.png";
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/80 text-[10px] text-white font-bold text-center border border-purple-500/30">
                    {bannerConfig.cardBadgeText}
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
                  <option value="Movies">Movies & Cinema</option>
                  <option value="Anime">Anime & Manga</option>
                  <option value="Series">Series & Shows</option>
                  <option value="Sports">Live Sports</option>
                  <option value="AI & Tools">AI & Web Tools</option>
                  <option value="Live Streams">Live Streams 24/7</option>
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
