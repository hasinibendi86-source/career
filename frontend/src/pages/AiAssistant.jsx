import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Award,
  Layers,
  FileText,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

export default function AiAssistant({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'bullets', 'interview', 'verbs', 'headlines'

  // Summary Tool State
  const [rawSummary, setRawSummary] = useState(
    'I am a 4th year computer science student looking for a software developer job. I know Python, React and SQL and I have done a few college projects.'
  );
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [summaryResults, setSummaryResults] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Bullet Point Tool State
  const [rawBullet, setRawBullet] = useState(
    'Worked on building the user login and registration API with python.'
  );
  const [bulletResults, setBulletResults] = useState(null);
  const [loadingBullet, setLoadingBullet] = useState(false);

  // Interview Questions State
  const [resumeSnippet, setResumeSnippet] = useState(
    'Python, React, SQL, Docker, FastAPI, Microservices, E-commerce project with stripe checkout.'
  );
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(false);

  // Headlines State
  const [headlines, setHeadlines] = useState([]);
  const [loadingHeadlines, setLoadingHeadlines] = useState(false);

  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    onShowToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Actions
  const handleRewriteSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await api.improveResume({
        action: 'rewrite_summary',
        summary: rawSummary,
        target_role: targetRole,
        skills: ['Python', 'React', 'SQL', 'System Design']
      });
      setSummaryResults(res);
      onShowToast('Generated 3 professional summary variations', 'success');
    } catch (err) {
      onShowToast('Failed to rewrite summary', 'error');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleImproveBullet = async () => {
    if (!rawBullet.trim()) return;
    setLoadingBullet(true);
    try {
      const res = await api.improveResume({
        action: 'improve_bullet',
        bullet: rawBullet,
        target_role: targetRole
      });
      setBulletResults(res);
      onShowToast('Transformed into STAR achievement bullets', 'success');
    } catch (err) {
      onShowToast('Failed to optimize bullet point', 'error');
    } finally {
      setLoadingBullet(false);
    }
  };

  const handleGenerateInterview = async () => {
    setLoadingInterview(true);
    try {
      const res = await api.getInterviewQuestions({
        resume_text: resumeSnippet,
        target_role: targetRole
      });
      setInterviewQuestions(res);
      onShowToast('Generated tailored technical and behavioral interview questions', 'success');
    } catch (err) {
      onShowToast('Failed to generate interview questions', 'error');
    } finally {
      setLoadingInterview(false);
    }
  };

  const handleGenerateHeadlines = async () => {
    setLoadingHeadlines(true);
    try {
      const res = await api.improveResume({
        action: 'headline_suggestions',
        target_role: targetRole,
        skills: ['Python', 'Cloud', 'System Architecture']
      });
      setHeadlines(res.headlines || []);
    } catch (err) {
      onShowToast('Failed to generate headlines', 'error');
    } finally {
      setLoadingHeadlines(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>AI Resume Optimization Suite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          AI Resume <span className="text-gradient-purple-pink">Improvement Assistant</span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Upgrade weak phrasing into punchy STAR-format achievements, craft recruiter-friendly summaries, and practice customized interview questions.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { id: 'summary', label: 'Summary Rewriter', icon: FileText },
          { id: 'bullets', label: 'STAR Bullet Booster', icon: Zap },
          { id: 'interview', label: 'Interview Preparation', icon: HelpCircle },
          { id: 'verbs', label: 'Action Verb Library', icon: Award },
          { id: 'headlines', label: 'Headline Suggester', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Summary Rewriter */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 rounded-3xl glass-panel p-7 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
              Input Your Current Summary
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e142c] focus:outline-none"
              >
                <option value="Software Developer">Software Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Full-Stack Developer">Full-Stack Developer</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Raw Draft / Bullet Notes</label>
              <textarea
                rows={5}
                value={rawSummary}
                onChange={(e) => setRawSummary(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleRewriteSummary}
              disabled={loadingSummary}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingSummary ? 'Polishing Summary...' : 'Rewrite with AI Assistant'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {summaryResults?.variations ? (
              summaryResults.variations.map((v, i) => (
                <div key={i} className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3 relative group">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      Style: {v.style}
                    </span>
                    <button
                      onClick={() => copyToClipboard(v.rewritten, `sum-${i}`)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Copy"
                    >
                      {copiedIndex === `sum-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{v.rewritten}"
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {v.highlights.map((h, j) => (
                      <span key={j} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full min-h-[300px] rounded-3xl glass-panel p-8 border border-white/5 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-slate-600 mb-3" />
                <h4 className="text-sm font-bold text-slate-300">No Summary Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Click "Rewrite with AI Assistant" to generate 3 tailored, professional summaries.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Bullet Point Booster */}
      {activeTab === 'bullets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 rounded-3xl glass-panel p-7 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-pink-300">
              STAR Bullet Point Enhancer
            </h3>
            <p className="text-xs text-slate-400">
              Paste a passive responsibility (e.g. "Worked on database") and convert it into a measured accomplishment.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Bullet Point</label>
              <textarea
                rows={4}
                value={rawBullet}
                onChange={(e) => setRawBullet(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleImproveBullet}
              disabled={loadingBullet}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{loadingBullet ? 'Enhancing Bullet...' : 'Upgrade with STAR Formula'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {bulletResults?.enhanced_variants ? (
              bulletResults.enhanced_variants.map((b, i) => (
                <div key={i} className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                      {b.version}
                    </span>
                    <button
                      onClick={() => copyToClipboard(b.text, `bul-${i}`)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Copy"
                    >
                      {copiedIndex === `bul-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    • {b.text}
                  </p>
                  <span className="text-[11px] text-slate-400 block pt-1">
                    💡 <em>{b.technique}</em>
                  </span>
                </div>
              ))
            ) : (
              <div className="h-full min-h-[300px] rounded-3xl glass-panel p-8 border border-white/5 flex flex-col items-center justify-center text-center">
                <Zap className="w-12 h-12 text-slate-600 mb-3" />
                <h4 className="text-sm font-bold text-slate-300">No Bullet Point Transformed</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Enter your task and click "Upgrade with STAR Formula" to generate metric-driven accomplishments.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Tailored Interview Questions */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="rounded-3xl glass-panel p-7 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Tailored Technical & Behavioral Interview Simulator
            </h3>
            <p className="text-xs text-slate-300">
              Generates realistic interview questions calibrated to the specific technologies and projects mentioned in your resume.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Key skills from resume (e.g., Python, SQL, React, Docker)..."
                value={resumeSnippet}
                onChange={(e) => setResumeSnippet(e.target.value)}
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white"
              />
              <button
                type="button"
                onClick={handleGenerateInterview}
                disabled={loadingInterview}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingInterview ? 'Generating...' : 'Generate Mock Questions'}</span>
              </button>
            </div>
          </div>

          {interviewQuestions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {/* Technical Questions */}
              <div className="rounded-3xl glass-panel p-7 border border-cyan-500/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Targeted Technical Questions
                </h4>
                <div className="space-y-4">
                  {interviewQuestions.technical_questions?.map((q, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        Topic: {q.topic}
                      </span>
                      <p className="text-xs font-semibold text-white">{q.question}</p>
                      <p className="text-[11px] text-slate-400">💡 <strong>Interviewer Tip:</strong> {q.tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavioral Questions */}
              <div className="rounded-3xl glass-panel p-7 border border-purple-500/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Behavioral & HR Questions (STAR Method)
                </h4>
                <div className="space-y-4">
                  {interviewQuestions.behavioral_questions?.map((q, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                        Topic: {q.topic}
                      </span>
                      <p className="text-xs font-semibold text-white">{q.question}</p>
                      <p className="text-[11px] text-slate-400">💡 <strong>Interviewer Tip:</strong> {q.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Action Verb Library */}
      {activeTab === 'verbs' && (
        <div className="rounded-3xl glass-panel p-8 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white">Power Action Verb Taxonomy</h3>
            <p className="text-xs text-slate-400 mt-1">
              Replace passive words like "helped" or "handled" with high-impact action verbs:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { cat: 'Engineering & Development', verbs: ['Architected', 'Engineered', 'Constructed', 'Developed', 'Deployed', 'Refactored', 'Automated'] },
              { cat: 'Optimization & Speed', verbs: ['Accelerated', 'Optimized', 'Streamlined', 'Minimized', 'Maximized', 'Revamped', 'Reduced'] },
              { cat: 'Leadership & Project Lead', verbs: ['Spearheaded', 'Orchestrated', 'Championed', 'Directed', 'Mentored', 'Empowered', 'Coordinated'] },
              { cat: 'Data & Analytics', verbs: ['Synthesized', 'Modeled', 'Evaluated', 'Analyzed', 'Uncovered', 'Quantified', 'Forecasted'] },
              { cat: 'Collaboration & Agile', verbs: ['Partnered', 'Negotiated', 'Presented', 'Aligned', 'Liaised', 'Facilitated', 'Advocated'] },
              { cat: 'Quality & Reliability', verbs: ['Benchmarked', 'Validated', 'Standardized', 'Hardened', 'Audited', 'Diagnosed', 'Resolved'] },
            ].map((col, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">{col.cat}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {col.verbs.map((v) => (
                    <button
                      key={v}
                      onClick={() => copyToClipboard(v, v)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-purple-600/30 text-slate-200 border border-white/5 transition-colors"
                      title="Click to copy"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Headline Suggester */}
      {activeTab === 'headlines' && (
        <div className="rounded-3xl glass-panel p-8 border border-white/10 space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-white">Professional Resume Headlines</h3>
            <p className="text-xs text-slate-400">
              First impression header tagline for your resume header and LinkedIn profile.
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleGenerateHeadlines}
              disabled={loadingHeadlines}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingHeadlines ? 'Generating...' : 'Generate Tailored Headlines'}</span>
            </button>
          </div>
          {headlines.length > 0 && (
            <div className="space-y-3 pt-3 animate-fadeIn">
              {headlines.map((hl, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-200">
                  <span className="font-medium">"{hl}"</span>
                  <button
                    onClick={() => copyToClipboard(hl, `hl-${i}`)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                  >
                    {copiedIndex === `hl-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
