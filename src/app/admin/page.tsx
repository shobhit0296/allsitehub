"use client";

import React from "react";
import Link from "next/link";

export default function ForbiddenAdmin() {
  return (
    <div className="min-h-screen bg-[#05050c] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-rose-600">
      {/* Ambient Red Glow */}
      <div className="absolute w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl bg-[#090717]/90 border border-rose-500/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(244,63,94,0.35)]">
        <div className="text-6xl sm:text-7xl animate-bounce">🚫</div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-rose-500 tracking-wider uppercase leading-tight drop-shadow-[0_0_25px_rgba(244,63,94,0.6)]">
          chala jaa B$DK
        </h1>

        <p className="text-sm sm:text-base text-slate-400 font-bold max-w-md">
          Access Denied. You do not have permission to view this restricted page.
        </p>

        <Link
          href="/"
          className="mt-4 px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(244,63,94,0.5)] cursor-pointer"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
