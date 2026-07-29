"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { STREAMING_SITES, SiteItem } from "../page";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Portal Management State
  const [sitesList, setSitesList] = useState<SiteItem[]>(STREAMING_SITES);
  const [activeTab, setActiveTab] = useState<"sites" | "add" | "requests">("sites");
  const [adminSearch, setAdminSearch] = useState("");

  // Add Site Form State
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteDomain, setNewSiteDomain] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSiteCategory, setNewSiteCategory] = useState("Movies");
  const [newSiteIcon, setNewSiteIcon] = useState("🍿");
  const [newSiteTags, setNewSiteTags] = useState("");
  const [newSiteRating, setNewSiteRating] = useState("4.9 ★");
  const [newSiteDesc, setNewSiteDesc] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Simulated User Requests Inbox
  const [userRequests, setUserRequests] = useState([
    {
      id: "req-1",
      name: "AniStream HD",
      url: "https://anistream.live",
      category: "Anime",
      tags: "4K, Dubbed, Fast",
      region: "Global",
      date: "Just now",
    },
    {
      id: "req-2",
      name: "SportsLive 24",
      url: "https://sportslive24.com",
      category: "Sports",
      tags: "HD, No-Ads, Football",
      region: "US",
      date: "10 mins ago",
    },
  ]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123" || passcode === "admin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Passcode. Enter 'admin123'");
    }
  };

  // Add New Site Handler
  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteUrl.trim()) return;

    const newSite: SiteItem = {
      id: `site-${Date.now()}`,
      name: newSiteName,
      domain: newSiteDomain || newSiteName.toLowerCase().replace(/\s+/g, "") + ".to",
      url: newSiteUrl,
      category: newSiteCategory,
      icon: newSiteIcon,
      tags: newSiteTags.split(",").map((t) => t.trim()).filter(Boolean),
      uptime: "99.9%",
      rating: newSiteRating,
      description: newSiteDesc || "Verified high-speed streaming portal.",
    };

    setSitesList([newSite, ...sitesList]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab("sites");
      setNewSiteName("");
      setNewSiteDomain("");
      setNewSiteUrl("");
      setNewSiteTags("");
      setNewSiteDesc("");
    }, 1500);
  };

  // Delete Site Handler
  const handleDeleteSite = (id: string) => {
    if (confirm("Are you sure you want to remove this site from directory?")) {
      setSitesList(sitesList.filter((s) => s.id !== id));
    }
  };

  // Approve Request Handler
  const handleApproveRequest = (req: typeof userRequests[0]) => {
    const approvedSite: SiteItem = {
      id: `approved-${Date.now()}`,
      name: req.name,
      domain: req.name.toLowerCase().replace(/\s+/g, "") + ".to",
      url: req.url,
      category: req.category,
      icon: req.category === "Anime" ? "🍥" : req.category === "Sports" ? "⚽" : "🍿",
      tags: req.tags.split(",").map((t) => t.trim()),
      uptime: "99.9%",
      rating: "4.8 ★",
      description: `User-requested verified portal for ${req.category}.`,
    };

    setSitesList([approvedSite, ...sitesList]);
    setUserRequests(userRequests.filter((r) => r.id !== req.id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05050c] text-white flex items-center justify-center p-4">
        {/* Background Ambient Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#0c091f] border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-[0_0_50px_rgba(168,85,247,0.35)]">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-3xl shadow-inner mb-1">
              🔐
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Admin Access Portal</h1>
            <p className="text-xs text-slate-400">Enter administrator passcode to manage AllSiteHub directory.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Admin Passcode</label>
              <input
                type="password"
                required
                placeholder="Enter passcode (Default: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-[#120e2e] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-sm focus:outline-none transition-all"
              />
              {authError && <p className="text-xs text-rose-400 font-semibold mt-1.5">{authError}</p>}
            </div>

            <button
              type="submit"
              className="purple-btn-primary py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              Authenticate & Unlock 🚀
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <Link href="/" className="text-xs text-slate-400 hover:text-purple-300 font-medium">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050c] text-white flex flex-col">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-50 glass-nav-dark px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              <span>Allsitehub Admin Control</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-400 text-purple-300">
                PRO v2.0
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all"
          >
            🌐 View Live Site
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
          >
            Logout 🔒
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0b081b] border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs font-bold text-slate-400">Total Directory Portals</span>
              <h2 className="text-3xl font-black text-white mt-1 font-mono">{sitesList.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-2xl">
              🪐
            </div>
          </div>

          <div className="bg-[#0b081b] border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs font-bold text-slate-400">User Site Requests Inbox</span>
              <h2 className="text-3xl font-black text-amber-400 mt-1 font-mono">{userRequests.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-2xl">
              💬
            </div>
          </div>

          <div className="bg-[#0b081b] border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs font-bold text-slate-400">System Network Status</span>
              <h2 className="text-xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                100% Operational
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-2xl">
              ⚡
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("sites")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === "sites"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-[#0d091f] text-slate-400 hover:text-white"
            }`}
          >
            📚 Manage Portals ({sitesList.length})
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === "add"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-[#0d091f] text-slate-400 hover:text-white"
            }`}
          >
            ➕ Add New Site
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer relative ${
              activeTab === "requests"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-[#0d091f] text-slate-400 hover:text-white"
            }`}
          >
            📥 User Requests ({userRequests.length})
          </button>
        </div>

        {/* TAB 1: MANAGE PORTALS LIST */}
        {activeTab === "sites" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search portals by name or tag..."
                className="max-w-md w-full px-4 py-2.5 bg-[#0b081b] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <span className="text-xs text-slate-400 font-mono">Showing {sitesList.length} Portals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sitesList
                .filter((s) => s.name.toLowerCase().includes(adminSearch.toLowerCase()))
                .map((site) => (
                  <div
                    key={site.id}
                    className="p-4 rounded-2xl bg-[#0c091f] border border-purple-500/20 flex flex-col justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{site.icon}</span>
                        <div>
                          <h4 className="font-extrabold text-white text-sm">{site.name}</h4>
                          <span className="text-[10px] font-mono text-purple-300">{site.domain}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                        {site.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">{site.url}</p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400">● {site.uptime} Online</span>

                      <div className="flex items-center gap-2">
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold hover:text-white"
                        >
                          Visit ↗
                        </a>
                        <button
                          onClick={() => handleDeleteSite(site.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-500/30"
                        >
                          Delete 🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW SITE FORM */}
        {activeTab === "add" && (
          <div className="max-w-2xl w-full bg-[#0b081b] border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl mx-auto">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>➕</span> Add New Portal to AllSiteHub Directory
            </h3>

            {formSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center text-emerald-300 font-bold text-sm">
                ✓ Portal successfully added to live directory!
              </div>
            ) : (
              <form onSubmit={handleAddSite} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Site Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FlixTor Pro"
                      value={newSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#120e2e] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Domain Name</label>
                    <input
                      type="text"
                      placeholder="e.g. flixtor.to"
                      value={newSiteDomain}
                      onChange={(e) => setNewSiteDomain(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#120e2e] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Direct Target URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://flixtor.to"
                    value={newSiteUrl}
                    onChange={(e) => setNewSiteUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#120e2e] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                    <select
                      value={newSiteCategory}
                      onChange={(e) => setNewSiteCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#120e2e] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
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
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Icon Emoji</label>
                    <input
                      type="text"
                      placeholder="🍿, 🍥, ⚽..."
                      value={newSiteIcon}
                      onChange={(e) => setNewSiteIcon(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#120e2e] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Rating</label>
                    <input
                      type="text"
                      placeholder="4.9 ★"
                      value={newSiteRating}
                      onChange={(e) => setNewSiteRating(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#120e2e] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Feature Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="4K, No-Ads, Subbed, Fast Player"
                    value={newSiteTags}
                    onChange={(e) => setNewSiteTags(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#120e2e] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of streaming features..."
                    value={newSiteDesc}
                    onChange={(e) => setNewSiteDesc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#120e2e] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="purple-btn-primary py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider mt-2"
                >
                  Publish New Portal Live 🚀
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: USER REQUESTS INBOX */}
        {activeTab === "requests" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-300">Pending User Submissions</h3>

            {userRequests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0c091f] border border-slate-800 text-center text-slate-400 text-xs font-semibold">
                ✓ No pending user requests. All submissions have been processed!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-[#0c091f] border border-amber-500/30 flex flex-col gap-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-white text-base">{req.name}</h4>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                        {req.category}
                      </span>
                    </div>

                    <a
                      href={req.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-purple-300 underline"
                    >
                      {req.url}
                    </a>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Tags: {req.tags}</span> • <span>Region: {req.region}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
                      <button
                        onClick={() => setUserRequests(userRequests.filter((r) => r.id !== req.id))}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                      >
                        Approve & Publish Live 🚀
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
