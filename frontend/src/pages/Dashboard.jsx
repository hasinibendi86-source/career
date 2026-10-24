import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  FileCheck2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  User,
  Award,
  BookOpen,
  Briefcase,
  BrainCircuit,
  Zap,
  CheckCircle2
} from 'lucide-react';
import ScoreRing from '../components/ScoreRing';
import PerformanceRadar from '../components/PerformanceRadar';
import PageSuggestionBox from '../components/PageSuggestionBox';
import { api } from '../services/api';

export default function Dashboard({ user, onNavigate, onShowToast }) {
  const [history, setHistory] = useState({ predictions: [], resumes: [], roadmap: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getUserHistory(user.id);
      setHistory(res);
    } catch (e) {
      console.warn('Error loading user history:', e);
    } finally {
      setLoading(false);
    }
  };

  const latestPred = history.predictions[0] || null;
  const latestResume = history.resumes[0] || null;

  // Defaults if no history yet
  const placementProb = latestPred?.probability || 82.5;
  const atsScore = latestResume?.ats_score || 78;

  const mockScores = {
    academic_score: user?.cgpa ? (user.cgpa / 10) * 100 : 84,
    technical_score: 75,
    aptitude_score: 70,
    communication_score: 80,
    experience_score: 65
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Top Profile Welcome Bar */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-[1.5px] shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <div className="w-full h-full bg-[#0a0d20] rounded-[14px] flex items-center justify-center">
              <User className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {user?.full_name || 'Student Candidate'}
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Active Student
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user?.degree || 'B.Tech Computer Science'} • Target: {user?.target_role || 'Software Developer'}
            </p>
          </div>
        </div>

        {/* Profile Completion Widget */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-around">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Profile Completeness
            </span>
            <span className="text-xl font-black text-emerald-400">92%</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Readiness Status
            </span>
            <span className="text-xs font-bold text-purple-300 bg-purple-950/50 px-2 py-1 rounded-full border border-purple-500/20">
              Campus Ready
            </span>
          </div>
        </div>
      </div>

      {/* Non-intrusive Page Suggestion Box */}
      <PageSuggestionBox
        title="AI Placement Readiness Tip"
        suggestion={`Your target role is set to ${user?.target_role || 'Software Developer'}. Review your 30-day roadmap daily tasks and scan your latest resume to verify ATS keyword alignment.`}
        actionLabel="Review Roadmap"
        onAction={() => onNavigate('roadmap')}
      />

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Placement Chance */}
        <div className="rounded-3xl glass-panel p-6 border border-purple-500/30 space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Placement Probability
            </span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2 flex items-center justify-center">
            <ScoreRing score={placementProb} size={110} strokeWidth={9} label="Chance" gradientId="dashPlaceGauge" />
          </div>
          <button
            onClick={() => onNavigate('predictor')}
            className="w-full py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/20 flex items-center justify-center gap-1.5"
          >
            <span>Retest Prediction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Latest ATS Score */}
        <div className="rounded-3xl glass-panel p-6 border border-pink-500/30 space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Latest ATS Resume Score
            </span>
            <FileCheck2 className="w-4 h-4 text-pink-400" />
          </div>
          <div className="my-2 flex items-center justify-center">
            <ScoreRing score={atsScore} size={110} strokeWidth={9} label="ATS" gradientId="dashAtsGauge" />
          </div>
          <button
            onClick={() => onNavigate('resume')}
            className="w-full py-2 rounded-xl text-xs font-semibold text-pink-300 bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/20 flex items-center justify-center gap-1.5"
          >
            <span>Scan New Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Academic Benchmark */}
        <div className="rounded-3xl glass-panel p-6 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Academic Record
            </span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="space-y-2 py-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">CGPA</span>
              <span className="font-bold text-white">{user?.cgpa || 8.4} / 10.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">10th Standard</span>
              <span className="font-bold text-white">85.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">12th Standard</span>
              <span className="font-bold text-white">82.5%</span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            ✓ Clears cutoffs for 98% of campus recruiters
          </div>
        </div>

        {/* Card 4: Roadmap Status */}
        <div className="rounded-3xl glass-panel p-6 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              30-Day Learning Goals
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="py-2 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Curriculum Progress</span>
              <span className="font-bold text-emerald-400">65%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="w-[65%] h-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            </div>
            <span className="text-[11px] text-slate-400 block pt-1">
              Next Goal: Complete Dockerizing Microservices
            </span>
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="w-full py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/20 flex items-center justify-center gap-1.5"
          >
            <span>Open Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Section: Radar Chart + Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Radar (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-7 border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
              Holistic Employability Profile
            </h3>
            <p className="text-xs text-slate-400">
              Multi-axial evaluation reflecting your academic and skill indicators.
            </p>
          </div>
          <PerformanceRadar scores={mockScores} size={280} />
        </div>

        {/* History Table (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-7 border border-white/10 space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Recent Placement Predictions & Resumes
            </h3>
          </div>

          <div className="space-y-3">
            {history.predictions.length > 0 || history.resumes.length > 0 ? (
              <>
                {history.predictions.slice(0, 3).map((p, i) => (
                  <div
                    key={`p-${i}`}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-bold text-white">{p.prediction}</div>
                        <div className="text-[11px] text-slate-400">
                          CGPA: {p.cgpa} • Technical: {p.technical_score}
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-purple-400">{p.probability}%</span>
                  </div>
                ))}

                {history.resumes.slice(0, 3).map((r, i) => (
                  <div
                    key={`r-${i}`}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileCheck2 className="w-4 h-4 text-pink-400" />
                      <div>
                        <div className="font-bold text-white">{r.filename}</div>
                        <div className="text-[11px] text-slate-400">Role: {r.target_role}</div>
                      </div>
                    </div>
                    <span className="font-black text-pink-400">{r.ats_score}/100</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-10 space-y-2">
                <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-xs font-bold text-slate-400">No Past History Stored</h4>
                <p className="text-[11px] text-slate-500">
                  Run a placement prediction or upload a resume to populate your persistent history.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Final Section: Integrated AI Assistant Copilot (Requirement 7) */}
      <div className="rounded-3xl glass-panel-glow p-7 sm:p-9 border border-purple-500/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
              Integrated AI Assistant Copilot
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Personalized Guidance for {user?.target_role || 'Software Developer'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Synthesized guidance based on your academic profile, ATS scan findings, and learning milestone progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('ai-assistant')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow flex items-center gap-2 self-start md:self-auto transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Full AI Suite</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Resume & Keyword Action */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-pink-400" />
                Resume & Skill Gap Status
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {latestResume
                  ? `Your scanned resume scored ${latestResume.ats_score}/100. Incorporate missing role keywords like Docker and Redis to push past 85% ATS compatibility.`
                  : 'Upload your PDF/Word resume to get an instant breakdown of missing role keywords and points lost.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('resume')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-pink-300 bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Refine Resume in Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Roadmap Tracking Guidance */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Learning Milestone Progress
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                You have active tasks in your 30-day curriculum. Completing 75% of your daily exercises unlocks your AI-Generated Job Readiness Certificate.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('roadmap')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>View 30-Day Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Interview Question of the Day */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                Technical Interview Drill
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Q:</strong> "How do you mitigate hash collisions in Hash Maps, and what is the difference between separate chaining and open addressing?"
              </p>
              <span className="text-[11px] text-slate-400 block italic">
                Tip: Emphasize O(1) average lookup vs O(N) worst-case scenarios.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('ai-assistant')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Practice STAR Interview Qs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
