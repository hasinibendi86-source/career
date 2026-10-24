import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  FileCheck2,
  Briefcase,
  LayoutDashboard,
  BrainCircuit,
  Compass,
  Menu,
  X,
  User,
  LogOut,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  backendOnline
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'predictor', label: 'Placement Predictor', icon: GraduationCap },
    { id: 'resume', label: 'ATS Resume Checker', icon: FileCheck2 },
    { id: 'ai-assistant', label: 'AI Assistant', icon: BrainCircuit },
    { id: 'jobs', label: 'Job Recommendations', icon: Briefcase },
    { id: 'roadmap', label: 'Skill Roadmap', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckChance = () => {
    setActiveTab('predictor');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('predictor-form') || document.getElementById('predictor-form-heading');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#070913]/80 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-[1.5px] shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all">
            <div className="w-full h-full bg-[#0a0d20] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Career<span className="text-gradient-purple-pink">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal hidden sm:block">
              Placement & Resume Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1.5 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Backend Status indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              backendOnline
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
            }`}
            title={backendOnline ? 'Flask REST API Connected' : 'Running in Offline Simulator Mode'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                backendOnline ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            {backendOnline ? 'API Active' : 'Demo Mode'}
          </div>

          {user ? (
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full pl-3 pr-1.5 py-1">
              <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate">
                {user.full_name?.split(' ')[0] || 'Student'}
              </span>
              <button
                onClick={onLogout}
                className="w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-purple-500/40 transition-all"
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              Sign In
            </button>
          )}

          {/* Direct CTA */}
          <button
            id="check-chance-nav-btn"
            onClick={handleCheckChance}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all active:scale-95 cursor-pointer"
            title="Calculate your placement likelihood"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Check Chance
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#070913]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Check Chance Banner CTA */}
          <button
            onClick={handleCheckChance}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-md mb-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Check Chance (Placement Predictor)</span>
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-4 h-4 text-purple-400" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                Log Out ({user.full_name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600"
              >
                <User className="w-4 h-4" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
