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

    const domain = editUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
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
        {/* Simple Tab Buttons */}
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
                          <div className="w-10 h-10 rounded-xl bg-[#130e30] border border-purple-500/30 flex items-center justify-center p-1 shrink-0 shadow-inner">
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=128`}
                              alt={site.name}
                              className="w-full h-full object-contain rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
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
