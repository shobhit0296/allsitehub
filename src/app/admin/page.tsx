"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STREAMING_SITES, SiteItem } from "../data";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Directory & Requests State
  const [sitesList, setSitesList] = useState<SiteItem[]>(STREAMING_SITES);
  const [activeTab, setActiveTab] = useState<"sites" | "add" | "requests">("sites");
  const [adminSearch, setAdminSearch] = useState("");

  // Add Site Minimal Form
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSiteCategory, setNewSiteCategory] = useState("Movies");
  const [newSiteTags, setNewSiteTags] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

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

  // Passcode Auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123" || passcode === "admin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode (Default: admin123)");
    }
  };

  // Add Site
  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteUrl.trim()) return;

    const domain = newSiteUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const iconMap: Record<string, string> = {
      Movies: "🍿",
      Anime: "🍥",
      Series: "📺",
      Sports: "⚽",
      "AI & Tools": "🤖",
      "Live Streams": "👾",
    };

    const newSite: SiteItem = {
      id: `site-${Date.now()}`,
      name: newSiteName,
      domain: domain || newSiteName.toLowerCase() + ".com",
      url: newSiteUrl,
      category: newSiteCategory,
      icon: iconMap[newSiteCategory] || "🌐",
      tags: newSiteTags ? newSiteTags.split(",").map((t) => t.trim()) : ["HD", "Fast"],
      uptime: "99.9%",
      rating: "4.9 ★",
      description: "Admin verified high-speed portal.",
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

  // Delete Site
  const handleDeleteSite = (id: string) => {
    setSitesList(sitesList.filter((s) => s.id !== id));
  };

  // Approve Request
  const handleApproveRequest = (req: typeof userRequests[0]) => {
    const domain = req.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const approvedSite: SiteItem = {
      id: `approved-${Date.now()}`,
      name: req.name,
      domain: domain || req.name.toLowerCase() + ".com",
      url: req.url,
      category: req.category,
      icon: req.category === "Anime" ? "🍥" : req.category === "Sports" ? "⚽" : "🍿",
      tags: req.tags.split(",").map((t) => t.trim()),
      uptime: "99.9%",
      rating: "4.8 ★",
      description: "User requested verified portal.",
    };

    setSitesList([approvedSite, ...sitesList]);
    setUserRequests(userRequests.filter((r) => r.id !== req.id));
  };

  // 1. Passcode Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05050c] text-white flex items-center justify-center p-4 selection:bg-purple-600">
        <div className="w-full max-w-sm bg-[#090717] border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <div className="text-center flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-2xl shadow-inner mb-1">
              🔐
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Admin Control</h1>
            <p className="text-xs text-slate-400">Enter passcode to manage directory</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            <input
              type="password"
              required
              placeholder="Passcode (Default: admin123)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 bg-[#120e2b] border border-slate-800 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none transition-all"
            />
            {authError && <p className="text-xs text-rose-400 font-medium text-center">{authError}</p>}

            <button
              type="submit"
              className="purple-btn-primary py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Unlock Dashboard 🚀
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <Link href="/" className="text-xs text-slate-400 hover:text-white font-medium transition-colors">
              ← Return to Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Simple Admin Panel
  return (
    <div className="min-h-screen bg-[#05050c] text-white flex flex-col selection:bg-purple-600">
      {/* Sleek Top Header */}
      <header className="sticky top-0 z-50 glass-nav-dark px-4 sm:px-8 py-3.5 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-lg shadow-[0_0_12px_rgba(168,85,247,0.5)]">
            ⚡
          </span>
          <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
            Admin Panel
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            🌐 Live Site
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
        {/* Simple Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setActiveTab("sites")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "sites"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            📚 Portals ({sitesList.length})
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "add"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            ➕ Add Portal
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "requests"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            📥 Requests ({userRequests.length})
          </button>
        </div>

        {/* TAB 1: SITES LIST */}
        {activeTab === "sites" && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search portal name..."
              className="w-full max-w-sm px-3.5 py-2 bg-[#090717] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sitesList
                .filter((s) => s.name.toLowerCase().includes(adminSearch.toLowerCase()))
                .map((site) => (
                  <div
                    key={site.id}
                    className="p-3.5 rounded-2xl bg-[#090717] border border-purple-500/20 flex items-center justify-between gap-3 shadow-md hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-xl shrink-0">{site.icon}</span>
                      <div className="flex flex-col truncate">
                        <span className="font-extrabold text-xs text-white truncate">{site.name}</span>
                        <span className="text-[10px] text-purple-300 font-mono truncate">{site.domain}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
                        title="Visit Site"
                      >
                        ↗
                      </a>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-[10px] font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: ADD PORTAL FORM */}
        {activeTab === "add" && (
          <div className="max-w-md w-full bg-[#090717] border border-purple-500/30 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 mx-auto shadow-xl">
            <h3 className="text-sm font-extrabold text-white">Add New Portal</h3>

            {formSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-center text-emerald-300 text-xs font-bold">
                ✓ Portal added to live directory!
              </div>
            ) : (
              <form onSubmit={handleAddSite} className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Site Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FlixTor Pro"
                    value={newSiteName}
                    onChange={(e) => setNewSiteName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#120e2b] border border-slate-800 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Site URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://flixtor.to"
                    value={newSiteUrl}
                    onChange={(e) => setNewSiteUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#120e2b] border border-slate-800 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={newSiteCategory}
                    onChange={(e) => setNewSiteCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#120e2b] border border-slate-800 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
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
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tags (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 4K, Subbed, No-Ads"
                    value={newSiteTags}
                    onChange={(e) => setNewSiteTags(e.target.value)}
                    className="w-full px-3 py-2 bg-[#120e2b] border border-slate-800 focus:border-purple-500 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="purple-btn-primary py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider cursor-pointer mt-1"
                >
                  Publish Portal 🚀
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: REQUESTS INBOX */}
        {activeTab === "requests" && (
          <div className="flex flex-col gap-3">
            {userRequests.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#090717] border border-slate-800 text-center text-slate-400 text-xs font-semibold">
                ✓ No pending user site requests.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-[#090717] border border-purple-500/30 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex flex-col truncate">
                      <span className="font-extrabold text-xs text-white truncate">{req.name}</span>
                      <span className="text-[10px] text-purple-300 font-mono truncate">{req.url}</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{req.category} • #{req.tags}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setUserRequests(userRequests.filter((r) => r.id !== req.id))}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-md cursor-pointer"
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
      </main>
    </div>
  );
}
