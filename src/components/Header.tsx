import React, { useState } from 'react';
import {
  Sprout,
  History,
  Menu,
  X,
  BookOpen,
  Calculator,
  CloudRain,
  Home,
  Sparkles,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';

export type AppTab = 'diagnosis' | 'history' | 'encyclopedia' | 'calculator' | 'weather';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  historyCount: number;
  onReplaySplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  onReplaySplash,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToUpload = () => {
    setActiveTab('diagnosis');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById('upload-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleTabSwitch = (tab: AppTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { id: AppTab; label: string; fullLabel: string; icon: React.ReactNode }[] = [
    { id: 'diagnosis', label: 'Beranda', fullLabel: 'Beranda & Diagnosis', icon: <Home className="w-4 h-4 shrink-0" /> },
    { id: 'encyclopedia', label: 'Ensiklopedia', fullLabel: 'Ensiklopedia Hama', icon: <BookOpen className="w-4 h-4 shrink-0" /> },
    { id: 'calculator', label: 'Kalkulator', fullLabel: 'Kalkulator Dosis', icon: <Calculator className="w-4 h-4 shrink-0" /> },
    { id: 'weather', label: 'Cuaca', fullLabel: 'Cuaca & Semprot', icon: <CloudRain className="w-4 h-4 shrink-0" /> },
    { id: 'history', label: 'Riwayat', fullLabel: 'Riwayat Analisis', icon: <History className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo MataTani */}
          <div
            onClick={() => handleTabSwitch('diagnosis')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none mr-6"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#143823] to-[#0B2215] flex items-center justify-center text-white shadow-sm shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#0B2215] leading-tight">
                Mata<span className="text-emerald-600">Tani</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-emerald-700 leading-none">
                Smart AI Agriculture
              </span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION BAR (Compact, single-line, clean spacing) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSwitch(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#143823] text-white shadow-sm shadow-emerald-950/20 font-bold'
                      : 'text-slate-600 hover:text-[#143823] hover:bg-emerald-50/80'
                  }`}
                >
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-emerald-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>

                  {item.id === 'history' && historyCount > 0 && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200'
                      }`}
                    >
                      {historyCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0 ml-4">
            {onReplaySplash && (
              <button
                onClick={onReplaySplash}
                title="Tampilkan Animasi Splash Pembuka"
                aria-label="Tampilkan Animasi Splash"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-200/60"
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xl:inline">Animasi Splash</span>
              </button>
            )}
            <button
              onClick={scrollToUpload}
              className="flex items-center gap-2 py-2 px-4 rounded-full font-bold text-xs sm:text-sm text-white bg-[#143823] hover:bg-[#0B2215] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Mulai Diagnosis AI</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka Menu"
              className="p-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 focus:outline-none cursor-pointer transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white/98 backdrop-blur-xl animate-fadeIn shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSwitch(item.id)}
                  className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-[#143823] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-emerald-600' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold">{item.fullLabel}</span>
                  </div>
                  {item.id === 'history' && historyCount > 0 && (
                    <span className="bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {historyCount}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 pb-1 border-t border-slate-100 mt-2 space-y-2">
              {onReplaySplash && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onReplaySplash();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <PlayCircle className="w-4 h-4 text-emerald-600" />
                  <span>Putar Ulang Animasi Splash</span>
                </button>
              )}
              <button
                onClick={scrollToUpload}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#143823] hover:bg-[#0B2215] shadow-md cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Mulai Diagnosis AI</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};