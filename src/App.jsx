import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ColoringConverter from './components/ColoringConverter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <ColoringConverter />
      <Footer />
    </div>
  );
}

export default App;
