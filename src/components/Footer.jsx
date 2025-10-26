import React from 'react';

export default function Footer() {
  return (
    <footer id="footer" className="py-10 border-t border-black/5">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} ColorCraft — Made for kids, teachers, and parents.</p>
        <div className="text-sm text-slate-500 flex items-center gap-4">
          <a className="hover:text-slate-700" href="#how">How it works</a>
          <a className="hover:text-slate-700" href="#generator">Create</a>
          <a className="hover:text-slate-700" href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
