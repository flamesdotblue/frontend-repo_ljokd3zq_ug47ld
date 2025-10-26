import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 grid place-items-center text-white shadow-lg shadow-fuchsia-500/20">
            <Sparkles size={20} />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">ColorCraft</p>
            <p className="text-xs text-slate-500 -mt-0.5">AI Coloring Page Generator</p>
          </div>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
          <a href="#generator" className="hover:text-slate-900 transition">Create</a>
          <a href="#how" className="hover:text-slate-900 transition">How it works</a>
          <a href="#footer" className="hover:text-slate-900 transition">Contact</a>
        </nav>
      </div>
    </header>
  );
}
