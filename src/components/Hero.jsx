import React from 'react';
import { Download, Upload, Wand2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.15),transparent)]" />
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Turn any photo or idea into printable coloring pages
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Perfect for kids, classrooms, and creative play. Upload a picture and get a clean, ink-friendly outline ready to print.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#generator" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white shadow hover:shadow-md transition">
                <Wand2 size={18} /> Generate coloring page
              </a>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700">
                <Upload size={18} /> Upload a photo
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700">
                <Download size={18} /> Print-ready output
              </div>
            </div>
            <div className="mt-6 text-sm text-slate-500">
              Works entirely in your browser — your images never leave your device.
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-fuchsia-200 via-indigo-200 to-cyan-200 opacity-60 blur-3xl rounded-3xl" />
            <div className="relative rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1503342394122-6d48bf9f99ea?q=80&w=1280&auto=format&fit=crop"
                alt="Sample"
                className="rounded-lg object-cover aspect-[4/3] w-full"
              />
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">Kids friendly</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">Print ready</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">No signup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
