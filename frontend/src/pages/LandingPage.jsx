import React from 'react';
import {
  Sparkles,
  GraduationCap,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
  Code2,
  Database,
  Search,
  BookOpen,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import ScoreRing from '../components/ScoreRing';

export default function LandingPage({ onNavigate }) {
  const stats = [
    { label: 'Ensemble ML Accuracy', value: '80.0%', detail: 'Trained on Random Forest & Logistic Reg' },
    { label: 'ATS Factors Evaluated', value: '25+', detail: 'Headings, Metrics, Keywords & Formats' },
    { label: 'Job Career Tracks', value: '8 Tracks', detail: 'From Full-Stack to ML & Cloud DevOps' },
    { label: 'Placement Benchmarks', value: '300+ Rows', detail: 'Collegiate academic & skill dataset' }
  ];

  const features = [
    {
      icon: GraduationCap,
      title: 'Marks-Based Placement ML',
      description: 'Scikit-learn algorithms weigh CGPA, 10th/12th percentages, technical ratings, aptitude, and internships to evaluate placement probability.'
    },
    {
      icon: FileCheck2,
      title: 'Deep ATS Resume Parser',
      description: 'Parses PDF & DOCX resumes with PyMuPDF, checking section presence, contact formatting, keywords, and action verb strength.'
    },
    {
      icon: Zap,
      title: 'AI Resume Enhancer',
      description: 'Rewrites generic summaries, upgrades bullet points using the STAR method, and suggests high-impact verbs to catch recruiters.'
    },
    {
      icon: TrendingUp,
      title: 'Skill Gap & 30-Day Roadmap',
      description: 'Identifies missing skills required for your target job role and generates a weekly step-by-step roadmap with interactive checkoffs.'
    },
    {
      icon: Briefcase,
      title: 'Personalized Job Matching',
      description: 'Matches your student profile and resume against simulated job vacancies, showing required vs missing skills and match percentages.'
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Evaluation',
      description: 'No black-box guesses. View exact academic, technical, and experience breakdowns with clear model evaluation metrics.'
    }
  ];

  const faqs = [
    {
      q: 'How does the Student Placement Predictor calculate probabilities?',
      a: 'The placement predictor utilizes trained Scikit-learn models (Random Forest and Logistic Regression) evaluated on collegiate campus placement records. It balances academic consistency (CGPA, 10th, 12th) with employability skills (technical score, aptitude, communication) and hands-on internship experience.'
    },
    {
      q: 'Does an ATS score guarantee I will pass an employer’s screening?',
      a: 'No score can guarantee a corporate hiring decision. CareerAI calculates an estimated ATS compatibility score by analyzing industry-standard ATS parsing heuristics: contact readability, section detection, keyword density, and quantifiable metrics.'
    },
    {
      q: 'Can I upload both PDF and Word (.DOCX) resumes?',
      a: 'Yes! CareerAI supports both native PDF and Microsoft Word DOCX formats with backend text extraction powered by PyMuPDF and python-docx.'
    },
    {
      q: 'How does the AI Assistant improve my resume without fabricating facts?',
      a: 'The assistant never fabricates qualifications or fake numbers. It helps rephrase your existing projects using strong action verbs, standard formatting, and the STAR framework (Situation, Task, Action, Result).'
    }
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden pb-16">
      {/* Immersive Hero Section inspired by Curated.Media */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow backdrop orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-pink-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-12 left-10 w-72 h-72 bg-purple-900/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-900/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="text-center relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span className="text-xs font-semibold tracking-wide text-purple-300">
              Next-Gen ML Placement Intelligence & ATS Parser
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 ml-1">
              v2.0
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
            Your Career. Your Potential.{' '}
            <span className="block mt-1 text-gradient-purple-pink">
              Your Future.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Predict your placement chances, verify your resume against ATS requirements, and discover the skills that will help you get hired.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('predictor')}
              className="px-7 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.7)] flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Check Placement Chance</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('resume')}
              className="px-7 py-3.5 rounded-full text-sm font-bold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-purple-500/50 shadow-lg flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95"
            >
              <FileCheck2 className="w-4 h-4 text-pink-400" />
              <span>Analyze My Resume</span>
            </button>
          </div>
        </div>

        {/* 2 Main Interactive Feature Cards (Curated.Media style showcase) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16 sm:mt-24 relative z-10">
          {/* Card 1: Student Placement Predictor */}
          <div className="relative group rounded-3xl glass-panel-glow p-8 sm:p-10 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/30 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  <GraduationCap className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  ML Powered • 80% Acc
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Student Placement Predictor
              </h2>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                Estimate your campus recruitment likelihood using machine learning. Enter your CGPA, 10th & 12th marks, technical scores, and internship experience for an instant statistical prediction.
              </p>

              {/* Mini visual preview */}
              <div className="my-6 p-4 rounded-2xl bg-[#090d22]/90 border border-white/[0.08] flex items-center justify-around gap-4">
                <ScoreRing score={85} size={110} strokeWidth={9} label="Probability" gradientId="card1Grad" />
                <div className="space-y-2 text-xs flex-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Academic Score</span>
                    <span className="font-bold text-white">88/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-[88%] h-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Technical Proficiency</span>
                    <span className="font-bold text-white">82/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-[82%] h-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('predictor')}
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Predict My Placement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: ATS Resume Verifier */}
          <div className="relative group rounded-3xl glass-panel-glow p-8 sm:p-10 border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-pink-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-600/30 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <FileCheck2 className="w-6 h-6 text-pink-400" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  PDF & DOCX Parser
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI-Powered ATS Resume Verifier
              </h2>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                Scan your resume against modern Applicant Tracking System standards. Check keyword matches against job vacancies, detect missing sections, and fix weak phrasing.
              </p>

              {/* Mini visual preview */}
              <div className="my-6 p-4 rounded-2xl bg-[#090d22]/90 border border-white/[0.08] flex items-center justify-around gap-4">
                <ScoreRing score={78} size={110} strokeWidth={9} label="ATS Score" gradientId="card2Grad" />
                <div className="space-y-1.5 text-xs flex-1">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Contact Info & Profiles Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Skills Section Detected</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Action Verbs & Metrics: 68% Match</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('resume')}
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Check My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Placement Statistics Bar */}
      <section className="border-y border-white/[0.08] bg-white/[0.02] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl my-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                {s.value}
              </div>
              <div className="text-sm font-bold text-white">{s.label}</div>
              <div className="text-xs text-slate-400">{s.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (3-step visual flow) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-purple-400">Seamless Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How CareerAI Operates</h2>
          <p className="text-sm text-slate-400">
            A three-step intelligent pipeline combining Machine Learning classification and resume NLP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="rounded-2xl glass-panel p-8 relative space-y-4 hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-base border border-purple-500/30">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Input Marks & Skill Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your CGPA, 10th & 12th percentages, programming skills, communication, and aptitude test ratings.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-8 relative space-y-4 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-base border border-indigo-500/30">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Upload Your Resume</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your PDF or Word DOCX resume. CareerAI extracts content and runs ATS formatting, section, and keyword audits.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-8 relative space-y-4 hover:border-pink-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-base border border-pink-500/30">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Receive Actionable Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock your placement probability, resume score, radar charts, tailored job recommendations, and 30-day skill roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-pink-400">Core Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Designed for College Employability</h2>
          <p className="text-sm text-slate-400">
            Everything college students need to bridge the gap between academic marks and dream placements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-2xl glass-panel p-7 space-y-3.5 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600/30 to-pink-600/30 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">FAQ</span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-2xl glass-panel p-6 border border-white/[0.08]">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-purple-400" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-300 mt-2.5 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl glass-panel-glow p-10 sm:p-14 text-center relative overflow-hidden border border-purple-500/40">
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Accelerate Your Career Preparation?
            </h2>
            <p className="text-sm text-slate-300">
              Test your profile in under 2 minutes. No credit card required. Free for all students and colleges.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('predictor')}
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all hover:scale-[1.02]"
              >
                Start Placement Prediction
              </button>
              <button
                onClick={() => onNavigate('resume')}
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all hover:scale-[1.02]"
              >
                Scan Resume for ATS
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
