import { Sparkles, ShieldCheck, Cpu, Code2, Award, Globe } from 'lucide-react';

export default function Footer({ onNavClick }) {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#05070e] pt-16 pb-12 overflow-hidden">
      {/* Ambient glow in footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-purple-900/10 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-[1.5px] shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                <div className="w-full h-full bg-[#0a0d20] rounded-[9px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Career<span className="text-gradient-purple-pink">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering students and job-seekers through Machine Learning predictive modeling and deep ATS resume optimization. Transform academic marks into quantifiable career outcomes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Scikit-Learn Ensemble</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy First</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavClick('predictor')} className="hover:text-purple-400 transition-colors">
                  Placement Predictor
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('resume')} className="hover:text-purple-400 transition-colors">
                  ATS Resume Verifier
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('ai-assistant')} className="hover:text-purple-400 transition-colors">
                  AI Summary & Bullets
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('jobs')} className="hover:text-purple-400 transition-colors">
                  Job Matcher
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('roadmap')} className="hover:text-purple-400 transition-colors">
                  30-Day Skill Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Technology</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Python 3.13 & Flask API
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                React 19 & Vite 8
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                Tailwind CSS 3
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                PyMuPDF & python-docx
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                SQLite3 Engine
              </li>
            </ul>
          </div>

          {/* Col 4: Benchmarks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">ML Benchmarks</h4>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Random Forest</span>
                <span className="font-bold text-emerald-400">80.0% Acc</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Logistic Regression</span>
                <span className="font-bold text-cyan-400">78.3% Acc</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>F1-Score</span>
                <span className="font-bold text-purple-400">82.35%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left max-w-2xl text-[11px] leading-relaxed">
            <strong className="text-slate-300 font-semibold">Important Disclaimer:</strong> CareerAI placement predictions and ATS scores are statistical estimations designed for student learning and career preparation. They do not constitute formal employment guarantees or official representations of individual corporate hiring applicant tracking systems.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>© 2026 CareerAI Platform. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
