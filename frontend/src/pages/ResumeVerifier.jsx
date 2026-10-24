import React, { useState, useRef, useEffect } from 'react';
import {
  FileCheck2,
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Printer,
  Search,
  Layers,
  Briefcase,
  HelpCircle,
  ChevronDown,
  Info,
  Copy,
  Check,
  Edit3,
  Eye,
  RefreshCw,
  Zap,
  Download,
  User,
  Mail,
  Phone,
  Layout,
  Sliders,
  Settings2,
  RotateCcw,
  Compass
} from 'lucide-react';
import ScoreRing from '../components/ScoreRing';
import PageSuggestionBox from '../components/PageSuggestionBox';
import { RoleAvatar, RoleBadge, getRoleMeta } from '../components/RoleVisuals';
import { api } from '../services/api';

export const DEFAULT_RESUME_DOC = `Bendi Hasini
Email: hasini515019@gmail.com | Phone: +91 92810 18026
LinkedIn: linkedin.com/in/hasini-bendi-a86989312 | GitHub: github.com/hasinibendi86-source

PROFESSIONAL SUMMARY
Ambitious Computer Science undergraduate with hands-on proficiency in Python, React, and SQL database design. Experienced in designing modular RESTful APIs and full-stack solutions.

EDUCATION
Bachelor of Technology in Computer Science & Engineering (2021 – 2025)
ABC University of Technology — CGPA: 8.4 / 10.0

TECHNICAL SKILLS
- Programming Languages: Python, JavaScript, Java, SQL, C++
- Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, FastAPI
- Developer Tools & Systems: Git, GitHub, Docker, Linux, REST APIs

WORK EXPERIENCE / INTERNSHIPS
Software Engineering Intern | Nexus Cloud Systems (Jan 2024 – June 2024)
- Worked on backend API development using Python and Flask.
- Maintained SQL database indexing and assisted in optimizing query latency.
- Collaborated in a 5-member Agile engineering sprint to test microservices.

PROJECTS
E-Commerce Platform with Microservices (React, Node.js, PostgreSQL)
- Architected a responsive web application with JWT authentication and payment flow.
- Integrated Redis caching, improving system response throughput by 40%.

Automated ATS Resume Analyzer (Python, Flask, PyMuPDF)
- Developed text parsing algorithms to benchmark candidate resumes against target role keywords.

CERTIFICATIONS
- AWS Certified Cloud Practitioner
- HackerRank Problem Solving (5-Star Verified)`;

export const RESUME_TEMPLATES = [
  {
    id: 'classic_ats',
    name: 'Classic ATS Standard',
    badge: '98% ATS Pass Rate',
    tag: 'Single-Column Standard',
    desc: 'Clean single-column layout, traditional section headers, high scanner parseability.',
    color: 'purple',
    themeGradient: 'from-purple-600 to-indigo-600',
    icon: FileCheck2
  },
  {
    id: 'technical_star',
    name: 'STAR Impact & Metrics',
    badge: 'Engineering Favorite',
    tag: 'STAR & Quantified',
    desc: 'Explicit STAR format with bold metrics callouts, tech stacks, and quantified results.',
    color: 'cyan',
    themeGradient: 'from-cyan-500 to-blue-600',
    icon: Zap
  },
  {
    id: 'modern_minimalist',
    name: 'Modern Minimalist Tech',
    badge: 'Clean Tech Design',
    tag: 'Modern Typography',
    desc: 'Sleek typography, compact skill pills, modern dividers, and clean project links.',
    color: 'pink',
    themeGradient: 'from-pink-500 to-rose-600',
    icon: Sparkles
  },
  {
    id: 'executive_leadership',
    name: 'Executive & Delivery Focus',
    badge: 'Leadership Ready',
    tag: 'Competency Matrix',
    desc: 'Executive summary, 4-tier skill matrix, initiative leadership, and delivery milestones.',
    color: 'amber',
    themeGradient: 'from-amber-500 to-orange-600',
    icon: Briefcase
  }
];

export default function ResumeVerifier({ user, onShowToast, onNavigate }) {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'paste'

  // AI Resume Re-Generator Template & Details state
  const [selectedTemplate, setSelectedTemplate] = useState('classic_ats');
  const [candidateDetails, setCandidateDetails] = useState({
    name: user?.full_name || 'Bendi Hasini',
    email: user?.email || 'hasini515019@gmail.com',
    phone: '9281018026',
    linkedin: 'linkedin.com/in/hasini-bendi-a86989312',
    github: 'github.com/hasinibendi86-source',
    degree: user?.degree || 'B.Tech in Computer Science & Engineering',
    cgpa: user?.cgpa ? `${user.cgpa} / 10.0` : '8.4 / 10.0',
    targetRole: 'Software Developer',
    skillsToInclude: 'Python, Java, React, SQL, Git, Docker'
  });
  const [rawParsedDetails, setRawParsedDetails] = useState(null);

  const [regeneratedResume, setRegeneratedResume] = useState(null);
  const [loadingRegenerate, setLoadingRegenerate] = useState(false);
  const [editableResumeMarkdown, setEditableResumeMarkdown] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);

  // Interactive AI Resume Editor state (Fact-Preserving)
  const [liveResumeContent, setLiveResumeContent] = useState('');
  const [initialResumeContent, setInitialResumeContent] = useState('');
  const [editorViewMode, setEditorViewMode] = useState('interactive'); // 'interactive' or 'direct_text'
  const [lastUpdatedLineIdx, setLastUpdatedLineIdx] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [improvingText, setImprovingText] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [editAcceptedCount, setEditAcceptedCount] = useState(0);
  const [copiedLiveResume, setCopiedLiveResume] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const fileInputRef = useRef(null);

  const jobRoles = [
    'Software Developer',
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Engineer',
    'Full-Stack Developer',
    'Cloud Engineer',
    'Cybersecurity Analyst',
    'Business Analyst'
  ];

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext)) {
      onShowToast('Please upload a PDF or Word (.docx) document.', 'error');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      onShowToast('File size exceeds the 10MB limit.', 'error');
      return;
    }
    setFile(selectedFile);
    onShowToast(`Selected "${selectedFile.name}" (${(selectedFile.size / 1024).toFixed(1)} KB)`, 'info');
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sample Resume Quick Loader
  const loadSampleResume = () => {
    const sample = `John Doe
Email: john.doe@email.com | Phone: +91 98765 43210
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Analytical Computer Science undergraduate with hands-on proficiency in Python, React, and SQL database architecture. Experienced in designing REST APIs and modular full-stack solutions.

EDUCATION
Bachelor of Technology in Computer Science & Engineering (2021 – 2025)
ABC University of Technology — CGPA: 8.4 / 10.0

TECHNICAL SKILLS
- Programming Languages: Python, JavaScript, Java, SQL, C++
- Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, FastAPI
- Developer Tools & Systems: Git, GitHub, Docker, Linux, RESTful APIs

WORK EXPERIENCE / INTERNSHIPS
Software Engineering Intern | Nexus Cloud Systems (Jan 2024 – June 2024)
- Developed and deployed RESTful microservices using Python and Docker, serving 50,000+ daily API requests.
- Optimized SQL database indexing, reducing query response latency by 34%.
- Collaborated in a 5-member Agile engineering sprint to build asynchronous data processing pipelines.

PROJECTS
E-Commerce Platform with Microservices (React, Node.js, MongoDB)
- Architected a responsive e-commerce web platform with stripe payment gateway and JWT authentication.
- Implemented caching with Redis, boosting page load speeds by 40%.

Automated Resume Keyword Extractor (Python, NLP, Flask)
- Built an NLP text parser in Python that extracts technical skill keywords and evaluates similarity scores.

CERTIFICATIONS
- AWS Certified Cloud Practitioner
- HackerRank Problem Solving (5-Star Verified)`;

    setPastedText(sample);
    setInputMode('paste');
    onShowToast('Loaded Sample CS Graduate Resume into text parser', 'info');
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (inputMode === 'upload' && !file) {
      onShowToast('Please select or drag-and-drop a resume file first.', 'error');
      return;
    }
    if (inputMode === 'paste' && (!pastedText || pastedText.trim().length < 40)) {
      onShowToast('Please paste at least 40 characters of resume content.', 'error');
      return;
    }

    setLoading(true);
    try {
      let payload;
      if (inputMode === 'upload' && file) {
        payload = new FormData();
        payload.append('file', file);
        payload.append('target_role', targetRole);
        payload.append('job_description', jobDescription);
        if (user?.id) payload.append('user_id', user.id);
      } else {
        payload = {
          resume_text: pastedText,
          target_role: targetRole,
          job_description: jobDescription,
          user_id: user?.id || null
        };
      }

      const res = await api.analyzeResume(payload);
      setResult(res);
      const textToLoad = res.raw_text || pastedText || res.extracted_preview || DEFAULT_RESUME_DOC;
      setLiveResumeContent(textToLoad);
      setInitialResumeContent(textToLoad);

      // Automatically populate candidate details from parsed document
      if (res.candidate_details) {
        const cd = res.candidate_details;
        const detailsObj = {
          name: cd.name || file?.name?.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') || user?.full_name || 'Bendi Hasini',
          email: cd.email || user?.email || 'hasini515019@gmail.com',
          phone: cd.phone || '9281018026',
          linkedin: cd.linkedin || 'linkedin.com/in/hasini-bendi-a86989312',
          github: cd.github || 'github.com/hasinibendi86-source',
          degree: cd.degree || user?.degree || 'B.Tech in Computer Science & Engineering',
          cgpa: cd.cgpa || (user?.cgpa ? `${user.cgpa} / 10.0` : '8.4 / 10.0'),
          targetRole: targetRole,
          skillsToInclude: res.keywords?.matched_keywords?.length > 0
            ? res.keywords.matched_keywords.join(', ')
            : 'Python, Java, React, SQL, Git, Docker'
        };
        setCandidateDetails(detailsObj);
        setRawParsedDetails(detailsObj);
      }

      onShowToast(`ATS Scan Complete: ${res.ats_score}/100 Score`, 'success');

      setTimeout(() => {
        const el = document.getElementById('ats-results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      onShowToast(err.message || 'Failed to analyze resume.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithRole = async (overrideRole) => {
    setLoading(true);
    try {
      let payload;
      if (inputMode === 'upload' && file) {
        payload = new FormData();
        payload.append('file', file);
        payload.append('target_role', overrideRole);
        payload.append('job_description', jobDescription);
        if (user?.id) payload.append('user_id', user.id);
      } else {
        payload = {
          resume_text: liveResumeContent || pastedText || DEFAULT_RESUME_DOC,
          target_role: overrideRole,
          job_description: jobDescription,
          user_id: user?.id || null
        };
      }
      const res = await api.analyzeResume(payload);
      setResult(res);
      const textToLoad = res.raw_text || liveResumeContent || pastedText || DEFAULT_RESUME_DOC;
      setLiveResumeContent(textToLoad);
      if (!initialResumeContent) setInitialResumeContent(textToLoad);
      setTargetRole(overrideRole);
      setCandidateDetails((prev) => ({ ...prev, targetRole: overrideRole }));
      onShowToast(`Personalized for ${overrideRole}: ${res.ats_score}/100 Score`, 'success');
    } catch (e) {
      onShowToast('Could not re-analyze with preferred role.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Interactive AI Editor Handlers
  const handleImproveSelection = async (textOverride = null) => {
    const textToImprove = (textOverride || selectedText || '').trim();
    if (!textToImprove) {
      onShowToast('Please highlight text from your resume or click a sentence below.', 'info');
      return;
    }
    if (textOverride) setSelectedText(textOverride);
    setImprovingText(true);
    setSelectedVariantIdx(0);
    try {
      const res = await api.improveSelection({
        selected_text: textToImprove,
        target_role: targetRole,
        instruction: 'Improve wording and grammar without changing facts or layout'
      });
      setAiSuggestion(res);
      onShowToast('Generated fact-preserving wording improvement!', 'success');
    } catch (err) {
      onShowToast('Failed to improve selected text', 'error');
    } finally {
      setImprovingText(false);
    }
  };

  const handleApplySuggestion = (chosenReplacement = null) => {
    if (!aiSuggestion) return;
    const orig = (aiSuggestion.original || '').trim();
    let rep = (chosenReplacement || (aiSuggestion.variants && aiSuggestion.variants[selectedVariantIdx]?.text) || aiSuggestion.suggestion || '').trim();
    if (!rep) return;

    const currentDoc = liveResumeContent || '';
    let updatedContent = '';
    let foundLineIndex = -1;

    // 1. Direct substring match
    if (orig && currentDoc.includes(orig)) {
      updatedContent = currentDoc.replace(orig, rep);
      const lines = updatedContent.split('\n');
      foundLineIndex = lines.findIndex(l => l.includes(rep));
    } else {
      // 2. Line-by-line fuzzy match ignoring leading bullets/symbols (- • * >) and whitespace
      const lines = currentDoc.split('\n');
      const cleanOrig = orig.replace(/^[-•*>\s]+/, '').trim().toLowerCase();

      foundLineIndex = lines.findIndex(l => {
        const cleanLine = l.replace(/^[-•*>\s]+/, '').trim().toLowerCase();
        return cleanLine === cleanOrig || cleanLine.includes(cleanOrig) || (cleanOrig.length > 15 && cleanOrig.includes(cleanLine));
      });

      if (foundLineIndex !== -1) {
        const prefixMatch = lines[foundLineIndex].match(/^(\s*[-•*>]?\s*)/);
        const prefix = prefixMatch ? prefixMatch[1] : '';
        lines[foundLineIndex] = prefix + rep.replace(/^[-•*>\s]+/, '');
        updatedContent = lines.join('\n');
      } else {
        // Fallback: append replacement
        updatedContent = currentDoc ? `${currentDoc}\n${rep}` : rep;
      }
    }

    setLiveResumeContent(updatedContent);
    if (foundLineIndex !== -1) {
      setLastUpdatedLineIdx(foundLineIndex);
      setTimeout(() => setLastUpdatedLineIdx(null), 3500);
    }
    setEditAcceptedCount((prev) => prev + 1);
    setAiSuggestion(null);
    setSelectedText('');
    onShowToast('Applied accepted improvement directly to resume document!', 'success');
  };

  const copyLiveResume = () => {
    navigator.clipboard.writeText(liveResumeContent || '');
    setCopiedLiveResume(true);
    onShowToast('Copied edited resume text to clipboard!', 'success');
    setTimeout(() => setCopiedLiveResume(false), 2500);
  };

  const handleDownloadPdf = async (overrideText = null, overrideDetails = null) => {
    setDownloadingPdf(true);
    try {
      const textToUse = overrideText || liveResumeContent || pastedText || (result?.raw_text) || (regeneratedResume?.markdown_resume) || DEFAULT_RESUME_DOC;
      const detailsToUse = overrideDetails || {
        name: candidateDetails.name || regeneratedResume?.candidate_name || 'David Williams',
        targetRole: candidateDetails.targetRole || targetRole || regeneratedResume?.headline || 'Accountant',
        email: candidateDetails.email || regeneratedResume?.email || 'david.williams@email.com',
        phone: candidateDetails.phone || regeneratedResume?.phone || '+1 123 555 7890',
        linkedin: candidateDetails.linkedin || regeneratedResume?.linkedin || 'linkedin.com/in/davidwilliams',
        github: candidateDetails.github || regeneratedResume?.github || '',
        location: 'Chicago, IL'
      };

      const payload = {
        resume_text: textToUse,
        candidate_details: detailsToUse,
        template_id: selectedTemplate || 'classic_ats'
      };
      const res = await api.downloadResumePdf(payload);
      if (res.method === 'direct_download') {
        onShowToast('Downloaded ATS Resume PDF successfully!', 'success');
      } else {
        onShowToast('Opened ATS Print / Save as PDF dialog!', 'info');
      }
    } catch (e) {
      onShowToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const downloadResumeTxt = () => {
    const blob = new Blob([liveResumeContent || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(candidateDetails.name || 'Resume').replace(/\s+/g, '_')}_Edited.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded edited resume document (.txt)!', 'success');
  };

  const downloadResumeMd = () => {
    const blob = new Blob([liveResumeContent || ''], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(candidateDetails.name || 'Resume').replace(/\s+/g, '_')}_Edited.md`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded edited resume document (.md)!', 'success');
  };

  const handleResetToOriginal = () => {
    const textToReset = initialResumeContent || DEFAULT_RESUME_DOC;
    setLiveResumeContent(textToReset);
    setSelectedText('');
    setAiSuggestion(null);
    setEditAcceptedCount(0);
    onShowToast('Reset resume document to original scan state.', 'info');
  };

  const handleRegenerateResume = async (overrideTemplateId = null) => {
    const tpl = (typeof overrideTemplateId === 'string' && overrideTemplateId) ? overrideTemplateId : selectedTemplate;
    setLoadingRegenerate(true);
    try {
      const resumeContent = liveResumeContent || pastedText || (result?.extracted_preview || '');
      const res = await api.regenerateResume({
        resume_text: resumeContent,
        target_role: candidateDetails.targetRole || targetRole,
        job_description: jobDescription,
        template_id: tpl,
        student_name: candidateDetails.name,
        name: candidateDetails.name,
        email: candidateDetails.email,
        phone: candidateDetails.phone,
        linkedin: candidateDetails.linkedin,
        github: candidateDetails.github,
        degree: candidateDetails.degree,
        cgpa: candidateDetails.cgpa,
        skills: candidateDetails.skillsToInclude
      });
      setRegeneratedResume(res);
      const cleanResumeText = (res.markdown_resume || '')
        .replace(/^#+\s+/gm, '')
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\*\*\[(RESULT|IMPACT|SITUATION|TASK|ACTION)\]\*\*\s*/gi, '');
      setEditableResumeMarkdown(cleanResumeText);
      const tplName = RESUME_TEMPLATES.find((t) => t.id === tpl)?.name || tpl;
      onShowToast(`Re-generated ATS resume in "${tplName}" for ${candidateDetails.name}!`, 'success');
      setTimeout(() => {
        const el = document.getElementById('regenerated-resume-dashboard');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      onShowToast('Failed to regenerate resume', 'error');
    } finally {
      setLoadingRegenerate(false);
    }
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    if (regeneratedResume) {
      handleRegenerateResume(templateId);
    }
  };

  const resetDetailsToParsed = () => {
    if (rawParsedDetails) {
      setCandidateDetails(rawParsedDetails);
      onShowToast('Reset details to original values extracted from your document!', 'info');
    } else {
      onShowToast('No parsed document details to restore.', 'info');
    }
  };

  const handlePrintResume = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const textToDownload = editableResumeMarkdown || regeneratedResume?.markdown_resume || '';
    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(candidateDetails.name || 'ATS_Resume').replace(/\s+/g, '_')}_Resume.md`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded resume markdown file!', 'info');
  };

  const copyRegeneratedResume = () => {
    navigator.clipboard.writeText(editableResumeMarkdown || regeneratedResume?.markdown_resume || '');
    setCopiedResume(true);
    onShowToast('Copied full regenerated resume to clipboard! Ready to paste into Word.', 'success');
    setTimeout(() => setCopiedResume(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-300">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>ATS Parsing & Keyword Matcher</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          AI-Powered <span className="text-gradient-purple-pink">ATS Resume Verifier</span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Screen your resume before recruiters do. Identify missing keywords, parseability risks, weak bullet points, and check alignment against specific job vacancies.
        </p>

        {/* Quick sample button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={loadSampleResume}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-purple-200 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Load Sample CS Resume (1-Click Instant Scan)</span>
          </button>
        </div>
      </div>

      {/* Non-intrusive Page Suggestion Box */}
      <PageSuggestionBox
        title="ATS Scoring Guidance"
        suggestion="ATS screeners prioritize standard single-column layouts, clean section headings, and quantifiable impact metrics (e.g., % improvement, latency reduction, user count). Use the Fact-Preserving Editor below to polish weak phrasing."
      />

      {/* Main Upload Box */}
      <div className="max-w-4xl mx-auto rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 space-y-7">
        {/* Step 1: Target Role & Optional Custom Job Description */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Target Job Role
                </label>
                <span className="text-[10px] text-purple-400 font-semibold">
                  {getRoleMeta(targetRole).category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RoleAvatar role={targetRole} size="sm" />
                <select
                  value={targetRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setTargetRole(newRole);
                    setCandidateDetails((prev) => ({ ...prev, targetRole: newRole }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium text-white bg-[#0e142c] focus:outline-none"
                >
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setShowJdInput(!showJdInput)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between"
              >
                <span>{showJdInput ? 'Hide Specific Job Description' : '+ Compare Against Specific Job Vacancy'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showJdInput ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Role Selection Chips with Visual Icons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {jobRoles.map((r) => {
              const isSelected = targetRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setTargetRole(r);
                    setCandidateDetails((prev) => ({ ...prev, targetRole: r }));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600/30 text-white border border-purple-400 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5 hover:border-white/15'
                  }`}
                >
                  <RoleAvatar role={r} size="xs" />
                  <span>{r}</span>
                </button>
              );
            })}
          </div>

          {/* Collapsible JD Input */}
          {showJdInput && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 animate-fadeIn">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-purple-300">Paste Target Job Description (Optional)</span>
                <span className="text-slate-400">Matches custom keywords & qualifications</span>
              </div>
              <textarea
                rows={3}
                placeholder="Paste the requirements / job description from LinkedIn, Indeed, or company careers page..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Input Mode Toggle: File Upload vs Direct Text */}
        <div className="flex border-b border-white/10 pb-4 gap-4">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`pb-1 text-xs font-bold tracking-wide transition-all border-b-2 ${
              inputMode === 'upload'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Upload Document (PDF / DOCX)
          </button>
          <button
            type="button"
            onClick={() => setInputMode('paste')}
            className={`pb-1 text-xs font-bold tracking-wide transition-all border-b-2 ${
              inputMode === 'paste'
                ? 'border-pink-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Paste Resume Plain Text
          </button>
        </div>

        {/* Upload Mode UI */}
        {inputMode === 'upload' ? (
          <div>
            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-purple-400 bg-purple-950/30 scale-[1.01]'
                    : 'border-white/15 hover:border-purple-500/50 hover:bg-white/[0.02]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-pink-600/20 border border-white/10 flex items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-purple-400 animate-bounce" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Drag and drop your resume file here
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Supports native <strong className="text-slate-300">PDF</strong> or <strong className="text-slate-300">DOCX</strong> formats (up to 10MB)
                </p>
                <button
                  type="button"
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB • Ready for ATS parsing
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              rows={8}
              placeholder="Paste your raw resume text here including Education, Skills, and Experience..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full p-4 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none leading-relaxed"
            />
          </div>
        )}

        {/* Scan Button */}
        <div>
          <button
            onClick={handleAnalyze}
            disabled={loading || (inputMode === 'upload' && !file && !pastedText)}
            className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FileCheck2 className="w-5 h-5" />
                <span>Verify Resume with ATS Engine</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ATS Scan Results Section */}
      {result && (
        <div id="ats-results-section" className="mt-14 space-y-8 animate-fadeIn">
          {/* Main Score Card */}
          <div className="rounded-3xl glass-panel-glow p-8 sm:p-12 border border-pink-500/40">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* ATS Progress Ring */}
              <div className="md:col-span-4 flex flex-col items-center justify-center">
                <ScoreRing
                  score={result.ats_score}
                  size={190}
                  strokeWidth={14}
                  label="ATS Score"
                  sublabel={result.score_rating}
                  gradientId="atsResultGauge"
                />
              </div>

              {/* Score summary & breakdown */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      result.ats_score >= 75
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : result.ats_score >= 60
                        ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                        : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    Rating: {result.score_rating}
                  </span>
                  <span className="text-xs text-slate-400">
                    Target Role: <strong>{result.target_role}</strong>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {result.ats_score >= 75
                    ? 'High ATS Compatibility Score!'
                    : 'Resume Requires Optimization for ATS Parsing'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {result.ats_score >= 75
                    ? 'Your resume contains well-structured sections, essential contact credentials, and strong keyword alignment with standard ATS scanner patterns.'
                    : 'Several high-impact improvements were identified, including missing core role keywords and under-quantified project bullet points.'}
                </p>

                {/* Score component breakdown bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400">Contact & Links</span>
                    <div className="text-sm font-bold text-white">
                      {result.score_breakdown.contact_score.points}
                      <span className="text-[10px] text-slate-400 font-normal"> / {result.score_breakdown.contact_score.max}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400">Sections Detected</span>
                    <div className="text-sm font-bold text-white">
                      {result.score_breakdown.sections_score.points}
                      <span className="text-[10px] text-slate-400 font-normal"> / {result.score_breakdown.sections_score.max}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400">Keyword Density</span>
                    <div className="text-sm font-bold text-white">
                      {result.score_breakdown.keyword_score.points}
                      <span className="text-[10px] text-slate-400 font-normal"> / {result.score_breakdown.keyword_score.max}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400">Metrics & Verbs</span>
                    <div className="text-sm font-bold text-white">
                      {result.score_breakdown.metrics_verbs_score.points}
                      <span className="text-[10px] text-slate-400 font-normal"> / {result.score_breakdown.metrics_verbs_score.max}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5 text-pink-400" />
                    Download / Print ATS Report
                  </button>

                  <button
                    onClick={() => handleRegenerateResume()}
                    disabled={loadingRegenerate}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{loadingRegenerate ? 'Re-Generating...' : `⚡ Re-Generate Resume for ${result.target_role}`}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Points Lost & Score Deductions Breakdown */}
          {result.points_lost && result.points_lost.length > 0 && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-rose-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ATS Score Deductions & Points Lost Breakdown
                </h3>
                <span className="text-xs text-slate-400">
                  Total Points Deducted: <strong className="text-rose-400">{100 - result.ats_score} pts</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Here is why points were subtracted from your resume based on standard ATS parsing rules and requirements for <strong>{result.target_role}</strong>:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {result.points_lost.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{pt.category}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-[11px] border border-rose-500/30">
                        -{pt.points_lost} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{pt.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personalized Job Preferences Detected from Resume */}
          {result.recommended_roles && result.recommended_roles.length > 0 && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  Suitable Job Roles Detected from Your Resume
                </h3>
                <span className="text-[11px] text-slate-400">
                  Based on detected skills, education, and keywords
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our algorithm analyzed the skills and projects in your uploaded resume against industry profiles. You can change your preferred job role below to instantly personalize your ATS scoring and learning roadmap:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                {result.recommended_roles.slice(0, 4).map((rec, idx) => {
                  const isCurrent = targetRole === rec.role;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isCurrent
                          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <RoleAvatar role={rec.role} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-white text-xs truncate">{rec.role}</span>
                              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                                rec.match_percentage >= 70 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                              }`}>
                                {rec.match_percentage}%
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">{getRoleMeta(rec.role).category}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {rec.matched_sample.slice(0, 3).map((s, si) => (
                            <span key={si} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => analyzeWithRole(rec.role)}
                          disabled={loading}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                            isCurrent
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-default'
                              : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
                          }`}
                        >
                          {isCurrent ? '✓ Active Preference' : 'Select as Preferred Role'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate('roadmap', { role: rec.role });
                              onShowToast(`Connected to Skill Roadmap Tab for ${rec.role}!`, 'info');
                            }
                          }}
                          className="w-full py-1.5 px-3 rounded-xl text-[11px] font-semibold bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <Compass className="w-3.5 h-3.5 text-purple-400" />
                          <span>Open Skill Roadmap Tab 🗺️</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Quality Checklist & Keyword Matching */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Quality Checklist (5 Cols) */}
            <div className="lg:col-span-5 rounded-3xl glass-panel p-7 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-pink-300 flex items-center gap-2 pb-2 border-b border-white/10">
                <CheckCircle2 className="w-4 h-4" />
                ATS Quality Audit Checklist
              </h3>
              <div className="space-y-2.5">
                {result.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                  >
                    <span className="text-slate-200">{item.item}</span>
                    {item.passed ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Passed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-rose-400">
                        <XCircle className="w-4 h-4" /> Missing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Matcher (7 Cols) */}
            <div className="lg:col-span-7 rounded-3xl glass-panel p-7 border border-white/10 space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Target Role Keyword Analysis
                </h3>
                <span className="text-xs font-extrabold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  {result.keywords.match_percentage}% Matched
                </span>
              </div>

              {/* Matched Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-emerald-300 block">
                  ✓ Matched Keywords ({result.keywords.matched_keywords.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.matched_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-rose-300 block">
                  ✗ Missing High-Priority Keywords ({result.keywords.missing_keywords.length})
                </span>
                <p className="text-[11px] text-slate-400">
                  Consider incorporating these skills or master them in the 30-day curriculum:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.missing_keywords.slice(0, 10).map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('roadmap', { role: targetRole, targetKeyword: kw });
                          onShowToast(`Connected to Skill Roadmap Tab for ${kw}!`, 'info');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-950/30 hover:bg-purple-900/40 border border-rose-500/30 hover:border-purple-500/50 text-rose-300 hover:text-purple-200 transition-all flex items-center gap-1 group cursor-pointer"
                      title="Click to jump directly to this topic in the Skill Roadmap Tab"
                    >
                      <span>+ {kw}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/5">
                  <span className="text-[11px] text-slate-400">Master these skills with structured daily tasks:</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('roadmap', { role: targetRole });
                        onShowToast(`Connected to Skill Roadmap Tab for ${targetRole}!`, 'info');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Master in Skill Roadmap Tab →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bullet Point Weakness Feedback */}
          {result.bullet_analysis?.weak_bullets?.length > 0 && (
            <div className="rounded-3xl glass-panel p-7 border border-amber-500/30 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 pb-2 border-b border-white/10">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Actionable Bullet Point Improvements Detected
              </h3>
              <p className="text-xs text-slate-400">
                Applicant Tracking Systems and technical screeners score action verbs and quantifiable results significantly higher:
              </p>
              <div className="space-y-3">
                {result.bullet_analysis.weak_bullets.map((b, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="text-slate-300">
                          <strong className="text-rose-400">Original:</strong> "{b.original}"
                        </div>
                        <div className="text-amber-200">
                          <strong>Issue:</strong> {b.issue}
                        </div>
                        <div className="text-emerald-300">
                          <strong>Recommendation:</strong> {b.suggestion}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedText(b.original);
                          setAiSuggestion({
                            original: b.original,
                            suggestion: b.suggestion,
                            variants: [
                              {
                                style: 'ATS Recommendation',
                                text: b.suggestion,
                                improvements: ['Replaced weak opener with strong action verb', 'Added quantifiable metrics']
                              }
                            ]
                          });
                          const el = document.getElementById('ai-resume-editor-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                          onShowToast('Loaded into AI Resume Editor! Review and click Accept.', 'info');
                        }}
                        className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Fix in AI Editor ✍️</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Resume Editor (Fact-Preserving, In-Place Sentence/Bullet Selection) */}
          <div id="ai-resume-editor-section" className="rounded-3xl glass-panel p-6 sm:p-9 border border-indigo-500/40 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  Fact-Preserving AI Resume Editor
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Refine Wording & Grammar of Your Uploaded Resume
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Select or click any sentence/bullet point in your uploaded resume to improve its professional impact and grammar.
                  All existing degrees, dates, institutions, skills, and numbers are <strong>100% strictly preserved</strong>. Changes are only applied when you click Accept.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {editAcceptedCount > 0 && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {editAcceptedCount} In-Place Edit{editAcceptedCount > 1 ? 's' : ''} Applied
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(liveResumeContent)}
                  disabled={downloadingPdf}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition-all disabled:opacity-50"
                  title="Download clean single-column ATS Resume PDF matching standard template format"
                >
                  <Download className={`w-3.5 h-3.5 ${downloadingPdf ? 'animate-bounce' : 'text-emerald-200'}`} />
                  <span>{downloadingPdf ? 'Generating PDF...' : 'Download ATS PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={copyLiveResume}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow flex items-center gap-1.5 transition-all"
                  title="Copy full edited resume to clipboard"
                >
                  {copiedLiveResume ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLiveResume ? 'Copied!' : 'Copy Resume'}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadResumeTxt}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-all"
                  title="Download edited resume as plain text (.txt)"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>.TXT</span>
                </button>
                <button
                  type="button"
                  onClick={downloadResumeMd}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-all"
                  title="Download edited resume as Markdown (.md)"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>.MD</span>
                </button>
                {initialResumeContent && liveResumeContent !== initialResumeContent && (
                  <button
                    type="button"
                    onClick={handleResetToOriginal}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 transition-all"
                    title="Reset back to initial scanned resume content"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Document View with Click & Highlight-to-Select */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      Your Resume Document
                    </span>
                    {liveResumeContent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                        {liveResumeContent.split('\n').filter(Boolean).length} lines · {liveResumeContent.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    )}
                  </div>
                  
                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditorViewMode('interactive')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        editorViewMode === 'interactive'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Line Selector ✍️
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorViewMode('direct_text')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        editorViewMode === 'direct_text'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Direct Edit 📝
                    </button>
                  </div>
                </div>

                {/* Empty State Fallback if no resume text loaded */}
                {(!liveResumeContent || !liveResumeContent.trim()) ? (
                  <div className="p-8 rounded-2xl bg-[#090d22] border border-white/10 text-center space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">No Document Text Currently Loaded</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        The resume document text is empty. You can instantly load the standard ATS resume template or paste your resume content directly.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLiveResumeContent(DEFAULT_RESUME_DOC);
                          setInitialResumeContent(DEFAULT_RESUME_DOC);
                          onShowToast('Loaded standard resume document into editor!', 'success');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow flex items-center gap-2 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                        <span>Load Standard Resume Document</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorViewMode('direct_text')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        Switch to Direct Paste ✍️
                      </button>
                    </div>
                  </div>
                ) : editorViewMode === 'direct_text' ? (
                  /* Direct Textarea Full-Document Editor */
                  <div className="space-y-2">
                    <textarea
                      rows={18}
                      value={liveResumeContent}
                      onChange={(e) => setLiveResumeContent(e.target.value)}
                      placeholder="Paste or write your full resume text here..."
                      className="w-full p-4 rounded-2xl bg-[#090d22] border border-white/10 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500/50 leading-relaxed resize-y selection:bg-purple-600 selection:text-white"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>Edits here update your active document in real time.</span>
                      <button
                        type="button"
                        onClick={() => setEditorViewMode('interactive')}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Done Editing → Switch to Line Selector
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Interactive Line-by-Line & Highlight View */
                  <div
                    onMouseUp={() => {
                      const selection = window.getSelection();
                      const text = selection ? selection.toString().trim() : '';
                      if (text && text.length >= 4) {
                        setSelectedText(text);
                        onShowToast(`Selected "${text.slice(0, 32)}${text.length > 32 ? '...' : ''}" for AI improvement`, 'info');
                      }
                    }}
                    className="p-4 sm:p-6 rounded-2xl bg-[#090d22] border border-white/10 max-h-[500px] overflow-y-auto space-y-1.5 text-xs text-slate-200 font-sans leading-relaxed selection:bg-purple-600 selection:text-white"
                  >
                    {liveResumeContent.split('\n').map((line, lineIdx) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <div key={lineIdx} className="h-2" />;
                      const isSelected = selectedText && selectedText.trim() === trimmed;
                      const isJustUpdated = lastUpdatedLineIdx === lineIdx;
                      const isHeading = /^(education|technical skills|skills|experience|projects|certifications|professional summary|summary|work experience|featured technical projects)/i.test(trimmed);

                      return (
                        <div
                          key={lineIdx}
                          onClick={() => setSelectedText(trimmed)}
                          className={`group p-2 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-2 ${
                            isJustUpdated
                              ? 'bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                              : isSelected
                              ? 'bg-purple-600/30 border border-purple-500/60 text-white font-medium shadow-sm'
                              : 'hover:bg-white/[0.04] text-slate-300 hover:text-white border border-transparent'
                          }`}
                          title="Click to select this sentence for AI improvement (or highlight any text)"
                        >
                          <span className={isHeading ? 'font-bold text-purple-300 uppercase tracking-wider text-[11px]' : ''}>
                            {line}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isJustUpdated && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                ✓ Updated!
                              </span>
                            )}
                            {!isHeading && !isJustUpdated && (
                              <span className="opacity-0 group-hover:opacity-100 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap transition-opacity">
                                Select ✍️
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column (5 cols): AI Improvement & Comparison Panel */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Selected Text to Improve
                    </span>
                    {selectedText && (
                      <button
                        type="button"
                        onClick={() => { setSelectedText(''); setAiSuggestion(null); }}
                        className="text-[11px] text-slate-400 hover:text-rose-400"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Click any sentence on the left or type/paste text here to improve wording and grammar..."
                    value={selectedText}
                    onChange={(e) => setSelectedText(e.target.value)}
                    className="w-full p-3 rounded-xl glass-input text-xs text-slate-100 placeholder-slate-500 focus:outline-none leading-relaxed"
                  />

                  {/* Quick-try chips if no text is selected */}
                  {!selectedText.trim() && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        💡 Or try polishing one of these weak sentences:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {[
                          'Worked on backend API development using Python and Flask.',
                          'Maintained SQL database indexing and assisted in optimizing query latency.',
                          'Helped team build React user interfaces and web pages.'
                        ].map((chip, ci) => (
                          <button
                            key={ci}
                            type="button"
                            onClick={() => {
                              setSelectedText(chip);
                              handleImproveSelection(chip);
                            }}
                            className="text-left text-[11px] p-2 rounded-lg bg-white/[0.03] hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 transition-all flex items-center justify-between gap-1 group"
                          >
                            <span className="truncate">"{chip}"</span>
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-indigo-300 whitespace-nowrap">
                              Polish ⚡
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleImproveSelection()}
                    disabled={improvingText || !selectedText.trim()}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${improvingText ? 'animate-spin' : ''}`} />
                    <span>{improvingText ? 'Polishing Wording & Grammar...' : 'Improve Selected Text with AI'}</span>
                  </button>

                  {/* AI Suggestion Box */}
                  {aiSuggestion && (
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wide">
                          AI-Generated Suggestion
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          100% Fact-Preserved
                        </span>
                      </div>

                      {/* Style Variants Selector if multiple styles available */}
                      {aiSuggestion.variants && aiSuggestion.variants.length > 1 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Select Style:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {aiSuggestion.variants.map((v, vi) => (
                              <button
                                key={vi}
                                type="button"
                                onClick={() => setSelectedVariantIdx(vi)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                  selectedVariantIdx === vi
                                    ? 'bg-purple-600 text-white shadow'
                                    : 'bg-white/5 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {v.style || `Option ${vi + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Original vs Suggestion */}
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Original:</span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">"{aiSuggestion.original}"</p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-400">
                            Improved Wording {aiSuggestion.variants && aiSuggestion.variants[selectedVariantIdx]?.style ? `(${aiSuggestion.variants[selectedVariantIdx].style})` : ''}:
                          </span>
                          <p className="text-emerald-200 text-xs font-semibold leading-relaxed">
                            "{aiSuggestion.variants && aiSuggestion.variants[selectedVariantIdx]?.text ? aiSuggestion.variants[selectedVariantIdx].text : aiSuggestion.suggestion}"
                          </p>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 italic">
                        Tip: Replaced passive phrasing with strong action verb while preserving all technical details and metrics.
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const chosen = aiSuggestion.variants && aiSuggestion.variants[selectedVariantIdx]?.text
                              ? aiSuggestion.variants[selectedVariantIdx].text
                              : aiSuggestion.suggestion;
                            handleApplySuggestion(chosen);
                          }}
                          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Apply</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiSuggestion(null)}
                          className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Resume Re-Generator Dashboard with Template Selection & Details Customizer */}
          <div id="regenerated-resume-dashboard" className="rounded-3xl glass-panel-glow p-6 sm:p-9 border border-purple-500/50 space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  AI Resume Re-Generator Dashboard
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Regenerate ATS Resume for {candidateDetails.targetRole || result.target_role}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Select your preferred ATS template and customize your candidate details on the left. Our AI regenerates an ATS-compliant, single-column resume with STAR bullet points and job keywords.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleRegenerateResume()}
                  disabled={loadingRegenerate}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingRegenerate ? 'animate-spin' : ''}`} />
                  <span>{loadingRegenerate ? 'Re-Generating...' : '⚡ Re-Generate Resume'}</span>
                </button>
              </div>
            </div>

            {/* Split View: Left Customization Controls vs Right Formatted Resume */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              {/* LEFT COLUMN (5 Cols): Template Selector & Candidate Details Form */}
              <div className="lg:col-span-5 space-y-5">
                {/* 1. Choose Resume Template */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-purple-400" />
                      1. Select ATS Resume Template
                    </span>
                    <span className="text-[10px] text-purple-300 font-semibold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30">
                      {RESUME_TEMPLATES.find((t) => t.id === selectedTemplate)?.name.split(' ')[0]} Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {RESUME_TEMPLATES.map((tpl) => {
                      const isSel = selectedTemplate === tpl.id;
                      const TplIcon = tpl.icon;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tpl.id)}
                          className={`p-3 rounded-2xl text-left transition-all border flex items-start gap-3 group ${
                            isSel
                              ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-tr ${tpl.themeGradient} text-white shadow`}
                          >
                            <TplIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className="text-xs font-bold text-white truncate group-hover:text-purple-200">
                                {tpl.name}
                              </h5>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                                {tpl.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {tpl.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Candidate Details Customizer (Pre-Filled & Editable) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      2. Candidate Details Form
                    </span>
                    <button
                      type="button"
                      onClick={resetDetailsToParsed}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      title="Reload details extracted from uploaded document"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sync Extracted</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Pre-filled with your verified document details. Customize any field to tailor the regenerated resume:
                  </p>

                  <div className="space-y-3 text-xs">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Candidate Full Name
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={candidateDetails.name}
                          onChange={(e) => setCandidateDetails({ ...candidateDetails, name: e.target.value })}
                          placeholder="e.g. Bendi Hasini"
                          className="w-full pl-8 pr-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            value={candidateDetails.email}
                            onChange={(e) => setCandidateDetails({ ...candidateDetails, email: e.target.value })}
                            placeholder="hasini515019@gmail.com"
                            className="w-full pl-8 pr-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={candidateDetails.phone}
                            onChange={(e) => setCandidateDetails({ ...candidateDetails, phone: e.target.value })}
                            placeholder="9281018026"
                            className="w-full pl-8 pr-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* LinkedIn & GitHub */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          LinkedIn Profile / Handle
                        </label>
                        <input
                          type="text"
                          value={candidateDetails.linkedin}
                          onChange={(e) => setCandidateDetails({ ...candidateDetails, linkedin: e.target.value })}
                          placeholder="linkedin.com/in/hasini-bendi"
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          GitHub / Portfolio URL
                        </label>
                        <input
                          type="text"
                          value={candidateDetails.github}
                          onChange={(e) => setCandidateDetails({ ...candidateDetails, github: e.target.value })}
                          placeholder="github.com/hasinibendi86-source"
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Degree & CGPA */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Degree & Major
                        </label>
                        <input
                          type="text"
                          value={candidateDetails.degree}
                          onChange={(e) => setCandidateDetails({ ...candidateDetails, degree: e.target.value })}
                          placeholder="B.Tech Computer Science"
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          CGPA / Aggregate
                        </label>
                        <input
                          type="text"
                          value={candidateDetails.cgpa}
                          onChange={(e) => setCandidateDetails({ ...candidateDetails, cgpa: e.target.value })}
                          placeholder="8.4 / 10.0"
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Target Role */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Target Job Role Alignment
                      </label>
                      <select
                        value={candidateDetails.targetRole}
                        onChange={(e) => setCandidateDetails({ ...candidateDetails, targetRole: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e142c] focus:outline-none"
                      >
                        {jobRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Skills to emphasize */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        High-Priority Skills to Prioritize
                      </label>
                      <input
                        type="text"
                        value={candidateDetails.skillsToInclude}
                        onChange={(e) => setCandidateDetails({ ...candidateDetails, skillsToInclude: e.target.value })}
                        placeholder="Python, Java, React, SQL, Docker, Git"
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Re-Generate Trigger Button */}
                  <button
                    type="button"
                    onClick={() => handleRegenerateResume()}
                    disabled={loadingRegenerate}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingRegenerate ? 'animate-spin' : ''}`} />
                    <span>{loadingRegenerate ? 'Building ATS Resume...' : '⚡ Re-Generate Resume with My Details'}</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN (7 Cols): Live Formatted Resume Output */}
              <div className="lg:col-span-7 space-y-4">
                {regeneratedResume ? (
                  <div className="space-y-4">
                    {/* Score Projection & Delta Banner */}
                    <div className="p-4 rounded-2xl bg-[#090d22] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-lg">
                          {regeneratedResume.projected_ats_score}%
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Projected ATS Score</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                              {regeneratedResume.ats_gain}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Template: <strong className="text-purple-300">{RESUME_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(editableResumeMarkdown || regeneratedResume?.markdown_resume)}
                          disabled={downloadingPdf}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition-all disabled:opacity-50"
                          title="Download clean single-column ATS Resume PDF file"
                        >
                          <Download className={`w-3.5 h-3.5 ${downloadingPdf ? 'animate-bounce' : 'text-emerald-200'}`} />
                          <span>{downloadingPdf ? 'Generating PDF...' : 'Download ATS PDF'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={copyRegeneratedResume}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow flex items-center gap-1.5 transition-all"
                          title="Copy formatted resume text to clipboard"
                        >
                          {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedResume ? 'Copied!' : 'Copy Text'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(!isEditing)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5"
                          title="Edit markdown text in-place"
                        >
                          {isEditing ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <Edit3 className="w-3.5 h-3.5 text-purple-400" />}
                          <span>{isEditing ? 'Preview' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePrintResume}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5"
                          title="Print or save as clean single-column PDF"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Print Preview</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadMarkdown}
                          className="p-1.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                          title="Download Markdown file"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Keywords Incorporated Pills */}
                    {regeneratedResume.keywords_added?.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                          ✓ Job-Required Keywords Incorporated:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {regeneratedResume.keywords_added.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                            >
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formatted Resume Preview / Editor */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <span className="text-xs text-slate-400">Edit your regenerated ATS resume (clean single-column standard format):</span>
                        <textarea
                          rows={20}
                          value={editableResumeMarkdown}
                          onChange={(e) => setEditableResumeMarkdown(e.target.value)}
                          className="w-full p-4 rounded-2xl glass-input text-xs font-mono text-slate-200 focus:outline-none leading-relaxed"
                        />
                      </div>
                    ) : (
                      <div className="printable-resume-sheet p-6 sm:p-8 rounded-2xl bg-[#080b18] border border-white/10 text-slate-200 text-xs space-y-5 leading-relaxed font-sans shadow-inner">
                        {/* Candidate Identity Header */}
                        <div className="border-b border-white/10 pb-4">
                          <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            {candidateDetails.name || regeneratedResume.candidate_name}
                          </h4>
                          <p className="text-purple-300 font-bold mt-0.5">
                            {regeneratedResume.headline}
                          </p>
                          <p className="text-slate-400 text-[11px] mt-1.5 flex flex-wrap items-center gap-2">
                            <span>{candidateDetails.email || regeneratedResume.email}</span>
                            <span>•</span>
                            <span>{candidateDetails.phone || regeneratedResume.phone}</span>
                            <span>•</span>
                            <span>{candidateDetails.linkedin || regeneratedResume.linkedin}</span>
                            <span>•</span>
                            <span>{candidateDetails.github || regeneratedResume.github}</span>
                          </p>
                        </div>

                        {/* Professional Summary */}
                        <div>
                          <h5 className="font-bold uppercase tracking-wider text-[11px] text-pink-400 mb-1 border-b border-white/5 pb-1">
                            {selectedTemplate === 'executive_leadership' ? 'Executive Profile & Leadership' : 'Professional Summary'}
                          </h5>
                          <p className="text-slate-300 leading-relaxed">
                            {regeneratedResume.sections?.summary}
                          </p>
                        </div>

                        {/* Technical Competencies */}
                        <div>
                          <h5 className="font-bold uppercase tracking-wider text-[11px] text-purple-400 mb-1.5 border-b border-white/5 pb-1">
                            {selectedTemplate === 'technical_star' ? 'Technical Competencies & Tooling' : 'Technical Skills'}
                          </h5>
                          <div className="space-y-1 text-slate-300">
                            <p><strong>Programming Languages:</strong> {regeneratedResume.sections?.skills?.languages?.join(', ')}</p>
                            <p><strong>Frameworks & Libraries:</strong> {regeneratedResume.sections?.skills?.frameworks?.join(', ')}</p>
                            <p><strong>Developer Tools & Cloud:</strong> {regeneratedResume.sections?.skills?.tools?.join(', ')}</p>
                            <p><strong>Core Engineering:</strong> {regeneratedResume.sections?.skills?.core?.join(', ')}</p>
                          </div>
                        </div>

                        {/* Work Experience */}
                        <div>
                          <h5 className="font-bold uppercase tracking-wider text-[11px] text-cyan-400 mb-1.5 border-b border-white/5 pb-1">
                            Work Experience & Internships
                          </h5>
                          {regeneratedResume.sections?.experience?.map((exp, idx) => (
                            <div key={idx} className="space-y-1 mb-3">
                              <div className="flex justify-between font-bold text-white">
                                <span>{exp.role} | {exp.company}</span>
                                <span className="text-slate-400 font-normal text-[11px]">{exp.duration}</span>
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-slate-300">
                                {exp.bullets.map((b, bi) => (
                                  <li key={bi}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Key Projects */}
                        <div>
                          <h5 className="font-bold uppercase tracking-wider text-[11px] text-amber-400 mb-1.5 border-b border-white/5 pb-1">
                            Featured Technical Projects
                          </h5>
                          {regeneratedResume.sections?.projects?.map((proj, idx) => (
                            <div key={idx} className="space-y-1 mb-3">
                              <div className="flex justify-between font-bold text-white">
                                <span>{proj.title}</span>
                                <span className="text-purple-300 font-medium text-[11px]">Stack: {proj.stack}</span>
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-slate-300">
                                {proj.bullets.map((b, bi) => (
                                  <li key={bi}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Education & Certifications */}
                        <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row justify-between sm:items-center text-slate-400 text-[11px] gap-2">
                          <span>
                            <strong>Education:</strong> {candidateDetails.degree || regeneratedResume.sections?.education?.degree} (Aggregate: {candidateDetails.cgpa || regeneratedResume.sections?.education?.cgpa})
                          </span>
                          <span>
                            <strong>Certifications:</strong> AWS Certified Cloud Practitioner • HackerRank 5-Star
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
                    <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
                    <h4 className="text-sm font-bold text-white">
                      Ready to Re-Generate an ATS-Optimized Resume
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Choose your template and review your details on the left, then click the button below to generate a tailored 96%+ ATS-compliant resume for <strong>{candidateDetails.name}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRegenerateResume()}
                      disabled={loadingRegenerate}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{loadingRegenerate ? 'Re-Generating...' : `Re-Generate Resume for ${candidateDetails.name}`}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#090d20] border border-white/[0.08] text-xs text-slate-400 flex items-center gap-3">
            <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              {result.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
