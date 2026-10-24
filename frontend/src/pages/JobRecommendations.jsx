import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Building,
  GraduationCap,
  Sparkles,
  Info,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import PageSuggestionBox from '../components/PageSuggestionBox';
import { RoleAvatar, RoleBadge, getRoleMeta } from '../components/RoleVisuals';

export default function JobRecommendations({ user, onShowToast, onNavigate }) {
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const roles = [
    'All',
    'Software Developer',
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Engineer',
    'Full-Stack Developer',
    'Cloud DevOps',
    'Cyber Security',
    'Business Analyst'
  ];

  useEffect(() => {
    fetchJobs();
  }, [roleFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.getRecommendations({
        role: roleFilter === 'All' ? 'Software Developer' : roleFilter,
        cgpa: user?.cgpa || 7.8
      });
      setJobs(res.jobs || []);
    } catch (e) {
      onShowToast('Could not fetch updated job recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.required_skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      roleFilter === 'All' || job.title.toLowerCase().includes(roleFilter.toLowerCase());

    return matchesSearch && (roleFilter === 'All' || matchesRole);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Role Matching & Vacancy Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Personalized <span className="text-gradient-cyan-indigo">Job Recommendations</span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Opportunities aligned with your academic CGPA, verified skill proficiencies, and resume keywords.
        </p>
      </div>

      {/* Non-intrusive Page Suggestion Box */}
      <PageSuggestionBox
        title="Job Market Opportunity Tip"
        suggestion="Direct LinkedIn and GitHub links below automatically search real openings and active repositories matching your filtered keywords, without leaving your CareerAI session."
      />

      {/* Filter and Search Bar */}
      <div className="rounded-2xl glass-panel p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by job title, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Role Pills with Visual Icons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {roles.map((r) => {
            const isSelected = roleFilter === r;
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-1 ring-purple-400'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                <RoleAvatar role={r} size="xs" />
                <span>{r}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Live Portal Launchers */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 w-full text-xs">
          <span className="text-slate-400 font-medium">Direct Live Portals:</span>
          <a
            href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery || (roleFilter !== 'All' ? roleFilter : 'Software Developer'))}&location=India`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg bg-[#0077b5]/20 hover:bg-[#0077b5]/40 border border-[#0077b5]/50 text-white font-bold inline-flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            title="Open real live LinkedIn jobs matching your filter"
          >
            <span>🔗 Live LinkedIn Jobs</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
          <a
            href={`https://github.com/search?q=${encodeURIComponent(searchQuery || (roleFilter !== 'All' ? roleFilter : 'Python React project'))}&type=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-bold inline-flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            title="Open real GitHub repositories to learn and showcase projects"
          >
            <span>🐙 Live GitHub Repos</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent((searchQuery || roleFilter) + ' jobs entry level freshers')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 font-bold inline-flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <span>🌐 Google Jobs</span>
            <ExternalLink className="w-3 h-3 text-purple-400" />
          </a>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="mb-8 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
        <Info className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Benchmark Mode:</strong> Listings below are curated sample vacancies based on campus hiring patterns and eligibility requirements.
        </span>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-all flex flex-col justify-between group space-y-5"
          >
            <div>
              {/* Top row: Match badge + eligibility */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                  {job.match_percentage}% Match
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    job.is_eligible
                      ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/50 border-amber-500/30 text-amber-300'
                  }`}
                >
                  {job.is_eligible ? 'Eligible (CGPA Met)' : 'CGPA Restricted'}
                </span>
              </div>

              {/* Title & Company with Visual Role Avatar */}
              <div className="flex items-start gap-3">
                <RoleAvatar role={job.title} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Building className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{job.company}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>

              {/* Salary & Details */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 flex justify-between items-center">
                <span>{job.salary_range}</span>
                <span className="text-[11px] text-slate-400">Min CGPA: {job.min_cgpa}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {job.description}
              </p>

              {/* Skills */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Required Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onNavigate && onNavigate('roadmap', { role: job.title, subject: s, targetKeyword: s })}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.05] border border-white/5 text-slate-200 hover:border-purple-400 hover:text-purple-300 hover:bg-purple-950/30 transition-all cursor-pointer"
                      title={`Click to learn ${s} in Skill Roadmap Tab`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Action Links (LinkedIn, Roadmap Tab, GitHub) */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('roadmap', { role: job.title })}
                  className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer"
                  title="Open 30-Day Guided Curriculum for this role in Skill Roadmap Tab"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-200" />
                  <span>Roadmap Tab 🗺️</span>
                </button>

                <a
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}&location=India`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#0077b5] hover:bg-[#005e93] shadow-[0_0_15px_rgba(0,119,181,0.3)] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
                  title="Search real live openings on LinkedIn"
                >
                  <span>Apply on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://github.com/search?q=${encodeURIComponent(job.required_skills.slice(0, 2).join(' ') + ' showcase project')}&type=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                  title="Explore related open-source projects on GitHub to build your portfolio"
                >
                  <span>GitHub</span>
                </a>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                <span>Direct portal search</span>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(job.title + ' jobs entry level freshers')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Search on Google Jobs ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
