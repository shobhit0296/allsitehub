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

  // Big Add Site Form State
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
      tags: req.tags.split(",").map((t) => t.trim()),
      uptime: "99.9%",
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
              Unlock Dashboard
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
        <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
          Admin Panel
        </h1>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            Live Site
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
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Simple Tab Buttons */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <button
            onClick={() => setActiveTab("sites")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-wide transition-all cursor-pointer ${
              activeTab === "sites"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            Portals ({sitesList.length})
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-wide transition-all cursor-pointer ${
              activeTab === "add"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            Add Portal
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-wide transition-all cursor-pointer ${
              activeTab === "requests"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105"
                : "bg-[#090717] text-slate-400 hover:text-white"
            }`}
          >
            Requests ({userRequests.length})
          </button>
        </div>

        {/* TAB 1: SITES LIST */}
        {activeTab === "sites" && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search portal name..."
              className="w-full max-w-md px-4 py-3 bg-[#090717] border border-slate-800 focus:border-purple-500 rounded-2xl text-xs sm:text-sm text-white focus:outline-none shadow-inner"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sitesList
                .filter((s) => s.name.toLowerCase().includes(adminSearch.toLowerCase()))
                .map((site) => (
                  <div
                    key={site.id}
                    className="p-5 rounded-3xl bg-[#090717] border border-purple-500/30 flex items-center justify-between gap-4 shadow-lg hover:border-purple-500/60 transition-all"
                  >
                    <div className="flex flex-col truncate gap-0.5">
                      <span className="font-black text-sm sm:text-base text-white truncate">{site.name}</span>
                      <span className="text-xs font-mono font-bold text-purple-300 truncate">{site.domain}</span>
                      <span className="text-xs font-bold text-slate-400 mt-1 px-2 py-0.5 rounded-md bg-[#120e2e] w-max">{site.category}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-extrabold"
                        title="Visit Site"
                      >
                        Open ↗
                      </a>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-extrabold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: BIG ELEVATED ADD PORTAL PANEL */}
        {activeTab === "add" && (
          <div className="max-w-2xl w-full bg-[#090717]/95 border border-purple-500/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 mx-auto shadow-[0_0_50px_rgba(168,85,247,0.3)] transition-all">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">Add New Portal</h2>
                <p className="text-xs text-slate-400 mt-0.5">Publish a new streaming or web portal directly to the live directory.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                Live Directory Form
              </span>
            </div>

            {formSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-center text-emerald-300 font-bold text-sm shadow-lg">
                ✓ Portal successfully added to live directory!
              </div>
            ) : (
              <form onSubmit={handleAddSite} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Site Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FlixTor Pro"
                      value={newSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs sm:text-sm focus:outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Category *</label>
                    <select
                      value={newSiteCategory}
                      onChange={(e) => setNewSiteCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs sm:text-sm focus:outline-none transition-all shadow-inner"
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
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Direct Target URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://flixtor.to"
                    value={newSiteUrl}
                    onChange={(e) => setNewSiteUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs sm:text-sm focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Feature Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 4K, Subbed, No-Ads, Fast Player"
                    value={newSiteTags}
                    onChange={(e) => setNewSiteTags(e.target.value)}
                    className="w-full px-4 py-3 bg-[#120e2b] border border-slate-700 focus:border-purple-500 rounded-xl text-white text-xs sm:text-sm focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="purple-btn-primary py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider cursor-pointer mt-2 shadow-lg"
                >
                  Publish Portal Live 🚀
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
                        Approve
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
