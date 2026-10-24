import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Printer,
  RotateCcw,
  Sliders,
  TrendingUp,
  Cpu,
  HelpCircle
} from 'lucide-react';
import ScoreRing from '../components/ScoreRing';
import PerformanceRadar from '../components/PerformanceRadar';
import PageSuggestionBox from '../components/PageSuggestionBox';
import { RoleAvatar, RoleBadge } from '../components/RoleVisuals';
import { api } from '../services/api';

export default function PlacementPredictor({ user, onShowToast, onNavigate }) {
  const [formData, setFormData] = useState({
    student_name: user?.full_name || '',
    degree: user?.degree || 'B.Tech',
    department: user?.department || 'Computer Science & Engineering',
    cgpa: 7.8,
    tenth_percentage: 82.0,
    twelfth_percentage: 78.5,
    current_semester: '7th Semester',
    technical_score: 72,
    aptitude_score: 68,
    communication_score: 74,
    internship: 1,
    projects_count: 2,
    certifications_count: 1,
    backlogs_count: 0,
    programming_languages: ['Python', 'SQL', 'JavaScript']
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Available skills for tagging
  const skillOptions = [
    'Python', 'Java', 'C++', 'JavaScript', 'SQL', 'React',
    'Node.js', 'Git', 'Docker', 'Machine Learning', 'Data Structures'
  ];

  const handleSkillToggle = (skill) => {
    setFormData((prev) => {
      const exists = prev.programming_languages.includes(skill);
      return {
        ...prev,
        programming_languages: exists
          ? prev.programming_languages.filter((s) => s !== skill)
          : [...prev.programming_languages, skill]
      };
    });
  };

  // Quick Preset Fillers
  const loadPreset = (presetName) => {
    if (presetName === 'high') {
      setFormData({
        student_name: 'Sophia Patel',
        degree: 'B.Tech',
        department: 'Computer Science',
        cgpa: 8.8,
        tenth_percentage: 89.0,
        twelfth_percentage: 86.5,
        current_semester: '7th Semester',
        technical_score: 86,
        aptitude_score: 80,
        communication_score: 85,
        internship: 1,
        projects_count: 4,
        certifications_count: 2,
        backlogs_count: 0,
        programming_languages: ['Python', 'Java', 'React', 'SQL', 'Data Structures', 'Docker']
      });
      onShowToast('Loaded "High-Achiever Profile" preset', 'info');
    } else if (presetName === 'balanced') {
      setFormData({
        student_name: 'Alex Morgan',
        degree: 'B.Tech',
        department: 'Information Technology',
        cgpa: 7.6,
        tenth_percentage: 76.0,
        twelfth_percentage: 73.0,
        current_semester: '7th Semester',
        technical_score: 68,
        aptitude_score: 62,
        communication_score: 70,
        internship: 1,
        projects_count: 2,
        certifications_count: 1,
        backlogs_count: 0,
        programming_languages: ['Python', 'SQL', 'Git']
      });
      onShowToast('Loaded "Balanced All-Rounder" preset', 'info');
    } else if (presetName === 'upskill') {
      setFormData({
        student_name: 'Jordan Lee',
        degree: 'B.Tech',
        department: 'Electronics',
        cgpa: 6.2,
        tenth_percentage: 65.0,
        twelfth_percentage: 62.0,
        current_semester: '6th Semester',
        technical_score: 52,
        aptitude_score: 48,
        communication_score: 55,
        internship: 0,
        projects_count: 1,
        certifications_count: 0,
        backlogs_count: 1,
        programming_languages: ['C++', 'Python']
      });
      onShowToast('Loaded "Needs Upskilling" preset', 'info');
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        user_id: user?.id || null
      };
      const res = await api.predictPlacement(payload);
      setResult(res);
      onShowToast(`Prediction generated: ${res.probability}% Placement Probability`, 'success');
      // Scroll to result smoothly
      setTimeout(() => {
        const el = document.getElementById('prediction-result-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      onShowToast(err.message || 'Error running prediction model', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Scikit-Learn Machine Learning Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Student Placement <span className="text-gradient-purple-pink">Predictor</span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Evaluate your campus placement probability based on academic grades, technical assessments, aptitude testing, and internship credentials.
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          <span className="text-xs text-slate-400 font-medium">Test Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset('high')}
            className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 transition-all"
          >
            🌟 High Achiever (CGPA 8.8)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('balanced')}
            className="px-3 py-1 rounded-full text-xs font-medium bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 transition-all"
          >
            ⚖️ Balanced Profile (CGPA 7.6)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('upskill')}
            className="px-3 py-1 rounded-full text-xs font-medium bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 transition-all"
          >
            ⚠️ Needs Upskilling (CGPA 6.2)
          </button>
        </div>
      </div>

      {/* Non-intrusive Page Suggestion Box */}
      <PageSuggestionBox
        title="Placement Model Guidance"
        suggestion="The predictive pipeline weights Technical Assessment (26%) and CGPA (32%) highest for campus interview shortlisting. Practical internship experience provides an additional +12% employability boost."
      />

      {/* Main Grid: Form Left, Quick Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container (8 Cols) */}
        <div id="predictor-form" className="lg:col-span-8 rounded-3xl glass-panel p-6 sm:p-9 border border-white/10 space-y-8 scroll-mt-28">
          <form onSubmit={handlePredict} className="space-y-7">
            {/* 1. Basic Student Info */}
            <div className="space-y-4">
              <h3 id="predictor-form-heading" className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2 pb-2 border-b border-white/10">
                <BookOpen className="w-4 h-4" />
                1. Academic & Student Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hasini, Alex Morgan"
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Degree / Course Program
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e142c]"
                  >
                    <option value="B.Tech">B.Tech / B.E. (4-Year Engineering)</option>
                    <option value="B.Tech Lateral Entry">B.Tech / B.E. (Lateral Entry via Diploma)</option>
                    <option value="Diploma in Engineering">Diploma / Polytechnic (3-Year)</option>
                    <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                    <option value="MCA">MCA (Master of Computer Applications)</option>
                    <option value="B.Sc CS">B.Sc Computer Science</option>
                    <option value="B.Sc IT">B.Sc Information Technology</option>
                    <option value="B.Sc Data Science">B.Sc Data Science & AI</option>
                    <option value="M.Sc CS / IT">M.Sc Computer Science / IT</option>
                    <option value="B.Com Computers">B.Com (Computer Applications / Analytics)</option>
                    <option value="BBA Analytics">BBA (Business Analytics / IT)</option>
                    <option value="MBA Tech">MBA (Technology & Data Analytics)</option>
                    <option value="M.Tech">M.Tech / M.E. (Postgraduate)</option>
                    <option value="BS / MS">BS / MS (Integrated Program)</option>
                    <option value="Other Degree">Other Bachelor's / Master's Program</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department / Branch
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e142c]"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning (AIML)</option>
                    <option value="Data Science & Engineering">Data Science & Engineering</option>
                    <option value="Cyber Security & Forensics">Cyber Security & Forensics</option>
                    <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                    <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Robotics & Automation">Robotics & Automation</option>
                    <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Computer Applications">Computer Applications / BCA / MCA</option>
                    <option value="Mathematics & Computing">Mathematics & Computing</option>
                    <option value="Mechatronics">Mechatronics Engineering</option>
                    <option value="Chemical / Biotech">Chemical / Biotechnology</option>
                    <option value="Other Specialization">Other Branch / Specialization</option>
                  </select>
                </div>
              </div>

              {/* Academic Marks with 12th vs Diploma Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">CGPA (0 - 10)</label>
                    <span className="text-xs font-bold text-purple-400">{formData.cgpa}</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="10.0"
                    required
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">College CGPA (out of 10.0 scale)</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">10th Marks (%)</label>
                    <span className="text-xs font-bold text-cyan-400">{formData.tenth_percentage}%</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="100"
                    required
                    value={formData.tenth_percentage}
                    onChange={(e) => setFormData({ ...formData, tenth_percentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Secondary school board aggregate</span>
                </div>

                {/* 12th Standard OR Diploma Option */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_diploma: false })}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-all ${
                          !formData.is_diploma ? 'bg-pink-600 text-white' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        12th
                      </button>
                      <span className="text-[10px] text-slate-500">or</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_diploma: true })}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-all ${
                          formData.is_diploma ? 'bg-pink-600 text-white' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        Diploma
                      </button>
                    </div>
                    <span className="text-xs font-bold text-pink-400">{formData.twelfth_percentage}%</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="100"
                    required
                    placeholder={formData.is_diploma ? 'Diploma Aggregate %' : '12th Board %'}
                    value={formData.twelfth_percentage}
                    onChange={(e) => setFormData({ ...formData, twelfth_percentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {formData.is_diploma ? 'Polytechnic / Diploma percentage' : '12th Higher secondary score'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Skill & Aptitude Ratings */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-pink-300 flex items-center gap-2 pb-2 border-b border-white/10">
                <Sliders className="w-4 h-4" />
                2. Technical & Skill Assessments
              </h3>

              <div className="space-y-4">
                {/* Technical Score Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Technical Skill Assessment (0 - 100)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.technical_score}
                        onChange={(e) => setFormData({ ...formData, technical_score: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-14 px-1.5 py-0.5 rounded text-center text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-500/40 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.technical_score}
                    onChange={(e) => setFormData({ ...formData, technical_score: parseInt(e.target.value) })}
                    className="w-full h-2 rounded-lg bg-slate-800 accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Beginner (0-40)</span>
                    <span>Intermediate (41-70)</span>
                    <span>Advanced (71-100)</span>
                  </div>
                </div>

                {/* Aptitude Score Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Aptitude & Problem Solving Score (0 - 100)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.aptitude_score}
                        onChange={(e) => setFormData({ ...formData, aptitude_score: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-14 px-1.5 py-0.5 rounded text-center text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.aptitude_score}
                    onChange={(e) => setFormData({ ...formData, aptitude_score: parseInt(e.target.value) })}
                    className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Quantitative & Logic Reasoning (Scale: 0 to 100%)</span>
                    {formData.aptitude_score <= 15 && (
                      <span className="text-amber-400">💡 Hint: Enter score as % (e.g., 7/10 is 70%)</span>
                    )}
                  </div>
                </div>

                {/* Communication Rating Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Communication & Interview Rating (0 - 100)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.communication_score}
                        onChange={(e) => setFormData({ ...formData, communication_score: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-14 px-1.5 py-0.5 rounded text-center text-xs font-bold text-pink-300 bg-pink-950/60 border border-pink-500/40 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.communication_score}
                    onChange={(e) => setFormData({ ...formData, communication_score: parseInt(e.target.value) })}
                    className="w-full h-2 rounded-lg bg-slate-800 accent-pink-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Verbal articulation & HR interview mock score</span>
                  </div>
                </div>
              </div>

              {/* Programming Skills Tag Picker */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Key Technical Competencies (Select applicable)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => {
                    const selected = formData.programming_languages.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selected
                            ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)] border border-purple-400'
                            : 'bg-white/[0.04] text-slate-400 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Practical Experience & Projects */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2 pb-2 border-b border-white/10">
                <Briefcase className="w-4 h-4" />
                3. Industry Experience & Backlogs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Internship Completed?
                  </label>
                  <div className="flex rounded-xl p-1 bg-[#090d22] border border-white/10">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, internship: 1 })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.internship === 1
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Yes (1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, internship: 0 })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.internship === 0
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      No (0)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Projects Done
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={formData.projects_count}
                    onChange={(e) => setFormData({ ...formData, projects_count: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Major & mini projects</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Certifications
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.certifications_count}
                    onChange={(e) => setFormData({ ...formData, certifications_count: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">AWS, Coursera, etc.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Active Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.backlogs_count}
                    onChange={(e) => setFormData({ ...formData, backlogs_count: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Current standing arrears</span>
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_25px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Predict My Placement Chance</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Model Intelligence Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                ML Pipeline Architecture
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              CareerAI employs a multi-model classification pipeline using Scikit-learn with standard normalization and stratified cross-validation.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-300">Random Forest (Primary)</span>
                  <span className="font-bold text-emerald-400">80.00% Acc</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ensemble of 100 decision trees to handle non-linear skill interactions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-indigo-300">Logistic Regression (Baseline)</span>
                  <span className="font-bold text-cyan-400">78.33% Acc</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Standardized Z-score probability calibrated across 7 core metrics.
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-white/10 leading-relaxed">
              <strong className="text-slate-300">Historical Benchmarks:</strong> Top hiring drivers observed are high Technical Skill Score, consistent CGPA (&gt;7.5), and prior Internship experience.
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Results Section (Displays after form submission) */}
      {result && (
        <div id="prediction-result-section" className="mt-14 space-y-8 animate-fadeIn">
          {/* Main Results Banner */}
          <div className="rounded-3xl glass-panel-glow p-8 sm:p-12 border border-purple-500/40 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Circular Gauge */}
              <div className="md:col-span-4 flex flex-col items-center justify-center">
                <ScoreRing
                  score={result.probability}
                  size={190}
                  strokeWidth={14}
                  label="Placement Chance"
                  sublabel={result.is_placed_likely ? 'Strong Hiring Signal' : 'Needs Targeted Preparation'}
                  gradientId="predMainGauge"
                />
              </div>

              {/* Prediction details */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                      result.is_placed_likely
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    Outcome: {result.prediction}
                  </span>
                  <span className="text-xs text-slate-400">
                    Evaluated for <strong>{result.student_name || 'Candidate'}</strong>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {result.is_placed_likely
                    ? 'Placement Likely – Excellent Profile!'
                    : 'Targeted Skill Upskilling Recommended'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {result.is_placed_likely
                    ? 'Your academic consistency, technical performance, and profile place you firmly in the competitive hiring range for corporate campus recruitment drives.'
                    : 'Your baseline profile has clear potential. Focusing on targeted aptitude drills, project complexity, and core technical skills will significantly elevate your placement probability.'}
                </p>

                {/* Print button */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5 text-purple-400" />
                    Export / Print Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Radar & Component Score Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Component Radar Visualizer (5 Cols) */}
            <div className="lg:col-span-5 rounded-3xl glass-panel p-7 border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-2">
                  5-Axis Student Skill Radar
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Multi-dimensional profile breakdown across academics, technical, aptitude, and experience.
                </p>
              </div>
              <PerformanceRadar scores={result.component_scores} size={280} />
            </div>

            {/* Strengths & Weaknesses (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Strengths */}
              <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-emerald-500/30 space-y-3">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Key Competitive Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-200 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-amber-500/30 space-y-3">
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  High-Priority Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((wk, idx) => (
                    <li key={idx} className="text-xs text-slate-200 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Suggested Roles & Recommended Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl glass-panel p-7 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                Suggested Job Roles for Your Profile
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {result.suggested_roles.map((role, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onNavigate && onNavigate('roadmap', { role })}
                    className="p-2 pr-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/40 flex items-center gap-2 text-xs font-semibold text-white transition-all group text-left cursor-pointer shadow-sm hover:scale-[1.02]"
                    title={`Click to open 30-Day Skill Roadmap Tab for ${role}`}
                  >
                    <RoleAvatar role={role} size="xs" />
                    <span>{role}</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform ml-auto" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl glass-panel p-7 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Recommended High-Impact Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.recommended_skills.map((skill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onNavigate && onNavigate('roadmap', { subject: skill, targetKeyword: skill })}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-950/40 border border-purple-500/30 text-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-400 flex items-center gap-1.5 transition-all cursor-pointer group hover:scale-105"
                    title={`Click to generate 30-Day curriculum for ${skill} in Skill Roadmap Tab`}
                  >
                    <span>⚡ {skill}</span>
                    <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Personalized 8-Week Action Plan */}
          <div className="rounded-3xl glass-panel p-8 border border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-400" />
                Personalized 8-Week Employability Action Plan
              </h3>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('roadmap', { role: result.suggested_roles?.[0] || 'Software Developer' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-200" />
                <span>Open Skill Roadmap Tab 🗺️</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.action_plan.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate && onNavigate('roadmap', { targetKeyword: step.goal })}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all cursor-pointer group"
                  title="Click to jump to Skill Roadmap Tab"
                >
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{step.phase}</span>
                    <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-sm font-bold text-white">{step.goal}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.task}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model Evaluation & Honest Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#090d20] border border-white/[0.08] text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>
                Evaluated with <strong>{result.model_evaluation?.primary_model}</strong> (Accuracy: {result.model_evaluation?.rf_accuracy}%).
              </span>
            </div>
            <p className="text-[11px] text-slate-400 text-center sm:text-right max-w-xl">
              {result.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
