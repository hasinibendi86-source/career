import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertCircle,
  Code2,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FolderGit2,
  BookOpen,
  Calendar,
  ExternalLink,
  Printer,
  Download,
  Check,
  Zap,
  HelpCircle,
  BrainCircuit,
  Plus,
  Search
} from 'lucide-react';
import { api } from '../services/api';
import PageSuggestionBox from '../components/PageSuggestionBox';

export default function SkillRoadmap({ user, onShowToast, initialParams }) {
  const [targetRole, setTargetRole] = useState(initialParams?.role || user?.target_role || 'Software Developer');
  const [coreSubjects, setCoreSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [hoursPerDay, setHoursPerDay] = useState(1.5);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const quickAiTopics = [
    { name: 'Generative AI & LLMs', icon: '🤖', desc: 'Transformers, Context Windows & Structured Output' },
    { name: 'Prompt Engineering & In-Context Learning', icon: '🎯', desc: 'System Prompts, Few-Shot & Chain-of-Thought' },
    { name: 'Autonomous AI Agents & LangGraph', icon: '⚡', desc: 'ReAct Loops, Tool Calling & Multi-Agent Teams' },
    { name: 'Vector Databases & RAG Architecture', icon: '🔍', desc: 'Embeddings, ChromaDB, Hybrid BM25 & Rerankers' },
    { name: 'Deep Learning with PyTorch', icon: '🧠', desc: 'Tensors, Neural Networks, Backprop & Optimization' },
    { name: 'MLOps & Production AI Deployment', icon: '📊', desc: 'FastAPI Serving, Docker, ONNX & Latency Tuning' }
  ];

  const handleLearnCustomSkill = (skillName = null) => {
    const name = (skillName || customSkillInput).trim();
    if (!name) {
      onShowToast('Please enter a skill or select an AI topic to learn.', 'info');
      return;
    }
    const customSubj = {
      id: `custom_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: name,
      difficulty: 'Self-Paced AI',
      desc: `Comprehensive 30-Day curriculum designed for self-directed mastery of ${name}`
    };
    setSelectedSubject(customSubj);
    generateRoadmapForSubject(name, hoursPerDay);
    setCustomSkillInput('');
  };

  // Sync when initialParams changes
  useEffect(() => {
    if (initialParams?.role && initialParams.role !== targetRole) {
      setTargetRole(initialParams.role);
    }
  }, [initialParams]);

  // Load user saved roadmap progress and core subjects on mount
  useEffect(() => {
    loadSubjects();
    if (user?.id) {
      loadSavedProgress();
    }
  }, [targetRole, user]);

  const loadSubjects = async () => {
    try {
      const res = await api.getCoreSubjects(targetRole);
      const subjects = res.subjects || [];
      setCoreSubjects(subjects);

      let subjectToSelect = null;
      if (initialParams?.subject) {
        const query = initialParams.subject.toLowerCase();
        subjectToSelect = subjects.find(s => s.name.toLowerCase().includes(query) || query.includes(s.name.toLowerCase()));
      } else if (initialParams?.targetKeyword) {
        const kw = initialParams.targetKeyword.toLowerCase();
        subjectToSelect = subjects.find(s => 
          s.name.toLowerCase().includes(kw) || 
          (s.desc && s.desc.toLowerCase().includes(kw))
        );
      }

      if (!subjectToSelect && subjects.length > 0) {
        subjectToSelect = selectedSubject || subjects[0];
      }

      if (subjectToSelect) {
        setSelectedSubject(subjectToSelect);
        generateRoadmapForSubject(subjectToSelect.name, hoursPerDay);
      }
    } catch (e) {
      console.warn('Error loading core subjects:', e);
    }
  };

  const loadSavedProgress = async () => {
    try {
      const history = await api.getUserHistory(user.id);
      if (history.roadmap && history.roadmap.completed_tasks) {
        setCompletedTasks(history.roadmap.completed_tasks);
      }
    } catch (e) {}
  };

  const generateRoadmapForSubject = async (subjectName, hours) => {
    setLoadingRoadmap(true);
    try {
      const res = await api.generateSubjectRoadmap({
        subject: subjectName,
        hours_per_day: hours,
        target_role: targetRole
      });
      setRoadmapData(res);
      onShowToast(`Generated 30-Day Personalized Roadmap for ${subjectName}!`, 'success');
    } catch (e) {
      onShowToast('Failed to load roadmap curriculum', 'error');
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleSelectSubject = (subj) => {
    setSelectedSubject(subj);
    generateRoadmapForSubject(subj.name, hoursPerDay);
  };

  const handleHoursChange = (newHours) => {
    setHoursPerDay(newHours);
    if (selectedSubject) {
      generateRoadmapForSubject(selectedSubject.name, newHours);
    }
  };

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => {
      const exists = prev.includes(taskId);
      const updated = exists ? prev.filter((id) => id !== taskId) : [...prev, taskId];
      if (user?.id) {
        api.updateRoadmap(user.id, targetRole, updated);
      }
      return updated;
    });
  };

  // Weekly and overall stats
  const totalTasks = roadmapData?.days?.length || 30;
  const completedCount = roadmapData?.days?.filter((d) => completedTasks.includes(d.id)).length || 0;
  const pendingCount = totalTasks - completedCount;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const isJobReady = progressPct >= 75 || completedCount >= 22;

  // Print/Download Certificate as PDF
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
          <Compass className="w-3.5 h-3.5" />
          <span>Personalized Learning & Weekly Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          30-Day <span className="text-gradient-purple-pink">Learning Roadmap</span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Targeted subject-by-subject curriculum tailored to your resume skill gaps and preferred career path.
        </p>

        {/* Role Selector */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/10 flex-wrap justify-center gap-1">
            {['Software Developer', 'Data Analyst', 'Full-Stack Developer', 'AI & Machine Learning Engineer'].map((r) => (
              <button
                key={r}
                onClick={() => setTargetRole(r)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  targetRole === r
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Non-intrusive Page Suggestion Box */}
      <PageSuggestionBox
        title="Roadmap Milestone Tip"
        suggestion="Consistency is key: 1 to 2 hours of daily problem solving and hands-on exercises ensures steady progress. Once you achieve 75% completion across your curriculum, your verified Job Readiness Certificate is automatically generated!"
      />

      {/* Self-Paced AI & Custom Skill Section */}
      <div className="mb-8 rounded-2xl glass-panel p-5 sm:p-6 border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-slate-900/40 to-blue-950/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Learn on Your Own: Self-Paced AI Skills
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Recommended AI
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Explore in-demand Artificial Intelligence topics or add any custom skill to generate a tailored 30-day curriculum.
              </p>
            </div>
          </div>
        </div>

        {/* Quick AI Topic Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {quickAiTopics.map((topic) => {
            const isSelected = selectedSubject?.name === topic.name;
            return (
              <button
                key={topic.name}
                type="button"
                onClick={() => handleLearnCustomSkill(topic.name)}
                className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-purple-900/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-white/[0.03] border-white/5 hover:border-purple-500/30 hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-base select-none mt-0.5">{topic.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{topic.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{topic.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Skill Input Form */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleLearnCustomSkill();
                }
              }}
              placeholder="Or type any skill to master (e.g., LangChain, Reinforcement Learning, Cloud Architecture)..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => handleLearnCustomSkill()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate 30-Day Plan</span>
          </button>
        </div>
      </div>

      {/* Core Subjects Selector */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            1. Select Core Track Subject
          </h3>
          <span className="text-[11px] text-slate-400">Click any subject to generate a 30-day curriculum</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreSubjects.map((subj) => {
            const isSelected = selectedSubject?.id === subj.id;
            return (
              <div
                key={subj.id}
                onClick={() => handleSelectSubject(subj)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.01]'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{subj.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {subj.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{subj.desc}</p>
                </div>
                <div className="text-[11px] font-semibold text-purple-300 flex items-center justify-between pt-1 border-t border-white/5">
                  <span>{isSelected ? '✓ Active Subject' : 'Generate 30-Day Plan'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Time Preference Control */}
      <div className="max-w-4xl mx-auto rounded-2xl glass-panel p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-xs font-bold text-white">Daily Study Commitment</span>
            <span className="text-[11px] text-slate-400 block">Personalizes task time estimates</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleHoursChange(1.0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              hoursPerDay === 1.0 ? 'bg-cyan-600 text-white shadow' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            1 Hour / Day (30 hrs total)
          </button>
          <button
            type="button"
            onClick={() => handleHoursChange(2.0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              hoursPerDay === 2.0 ? 'bg-cyan-600 text-white shadow' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            2 Hours / Day (60 hrs total)
          </button>
        </div>
      </div>

      {/* Weekly Progress Tracking Dashboard (Requirement 5) */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 mb-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              Weekly Progress Tracking Dashboard
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {selectedSubject?.name || 'Subject'} Mastery
            </h2>
          </div>

          {/* Certificate Trigger Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isJobReady
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02]'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isJobReady ? '🎓 View Job Readiness Certificate' : 'Preview Certificate Criteria'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards: Completed, Pending, Completion % */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wide">Tasks Completed</span>
            <div className="text-2xl font-black text-white">{completedCount} <span className="text-xs font-normal text-slate-400">/ {totalTasks} Days</span></div>
            <span className="text-[10px] text-emerald-400">Saved persistently to SQLite database</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1">
            <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wide">Tasks Pending</span>
            <div className="text-2xl font-black text-white">{pendingCount} <span className="text-xs font-normal text-slate-400">Days Remaining</span></div>
            <span className="text-[10px] text-slate-400">Estimated ~{Math.round(pendingCount * hoursPerDay)} study hours</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-1">
            <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wide">Overall Completion</span>
            <div className="text-2xl font-black text-white">{progressPct}%</div>
            <span className="text-[10px] text-cyan-400">75% required for Job Readiness Certificate</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Overall Roadmap Completion</span>
            <span className="text-purple-400">{progressPct}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 4-Week Breakdown Cards */}
        {roadmapData?.weeks && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {roadmapData.weeks.map((wk, wi) => {
              const weekDays = wk.days || [];
              const weekDone = weekDays.filter((d) => completedTasks.includes(d.id)).length;
              const weekTotal = weekDays.length || 7;
              const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
              return (
                <div key={wi} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-white">
                    <span>Week {wk.week}</span>
                    <span className="text-[10px] text-purple-300">{weekDone}/{weekTotal}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${weekPct}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">{wk.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Daily 30-Day Tasks Breakdown (Grouped by Weeks) */}
      <div className="space-y-8 mb-12">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Daily Learning Tasks, Practice & Small Exercises
          </h2>
          <span className="text-xs text-slate-400">Click checkboxes to mark daily milestones</span>
        </div>

        {roadmapData?.weeks ? (
          roadmapData.weeks.map((wk, wIdx) => (
            <div key={wIdx} className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs">
                    {wk.week}
                  </span>
                  <span>{wk.title}</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {wk.days.filter((d) => completedTasks.includes(d.id)).length} / {wk.days.length} Days Done
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wk.days.map((dayItem) => {
                  const isChecked = completedTasks.includes(dayItem.id);
                  return (
                    <div
                      key={dayItem.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isChecked
                          ? 'bg-purple-950/30 border-purple-500/40 opacity-95'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTask(dayItem.id)}
                            className="mt-1 w-4 h-4 rounded text-purple-600 accent-purple-500 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                                Day {dayItem.day}
                              </span>
                              <h4 className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                                {dayItem.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{dayItem.task}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{dayItem.estimated_minutes}m</span>
                      </div>

                      {/* Resource, Question & Exercise */}
                      <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px]">
                        <div className="text-cyan-300 flex items-center gap-1.5">
                          <strong>📚 Resource:</strong>
                          <span className="text-slate-300">{dayItem.resource}</span>
                        </div>
                        <div className="text-amber-300">
                          <strong>❓ Practice Question:</strong>
                          <span className="text-slate-300 block">{dayItem.practice_question}</span>
                        </div>
                        <div className="text-emerald-300">
                          <strong>⚡ Mini Exercise:</strong>
                          <span className="text-slate-300 block">{dayItem.exercise}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">Loading personalized syllabus...</div>
        )}
      </div>

      {/* AI-Generated Job Readiness Certificate Modal (Requirement 6) */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl glass-panel-glow p-6 sm:p-10 text-white overflow-hidden border border-amber-500/40">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">AI-Generated Job Readiness Certificate</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            {/* Printable Certificate Frame */}
            <div id="job-readiness-certificate" className="my-6 p-6 sm:p-8 rounded-2xl bg-[#090d22] border-2 border-amber-500/50 text-center space-y-5 shadow-2xl relative">
              <div className="flex justify-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 block mb-1">
                  CareerAI Employability Milestone
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  AI-Generated Job Readiness Certificate
                </h2>
              </div>

              <p className="text-xs text-slate-400">This credential certifies that</p>
              
              <h3 className="text-xl sm:text-2xl font-black text-gradient-purple-pink">
                {user?.full_name || 'Alex Morgan (Candidate)'}
              </h3>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully demonstrated progressive mastery of the 30-day curriculum in{' '}
                <strong className="text-white">{selectedSubject?.name || 'Core Engineering'}</strong> for the{' '}
                <strong className="text-white">{targetRole}</strong> career track with verified completion of{' '}
                <strong className="text-emerald-400">{progressPct}% of daily assignments</strong>.
              </p>

              <div className="pt-4 border-t border-white/10 flex flex-wrap justify-around items-center text-xs text-slate-400 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Issue Date</span>
                  <span className="font-semibold text-white">
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Credential ID</span>
                  <span className="font-mono text-xs text-amber-300">CAI-CERT-{user?.id || 1}-9842</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Readiness Status</span>
                  <span className="font-bold text-emerald-400">{isJobReady ? 'Verified Job-Ready' : `${progressPct}% In Progress`}</span>
                </div>
              </div>

              {/* Required Non-Accreditation Disclaimer */}
              <div className="pt-2 text-[10px] text-slate-500 italic max-w-lg mx-auto">
                Disclaimer: This is an AI-generated learning milestone credential based on self-paced study tasks. It is not an officially accredited university degree, academic qualification, or guarantee of employment.
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 shadow flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Download / Print as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
