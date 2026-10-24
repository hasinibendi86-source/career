import React from 'react';
import {
  Code2,
  Database,
  BrainCircuit,
  Cpu,
  Layers,
  Cloud,
  ShieldCheck,
  TrendingUp,
  CheckCircle,
  Smartphone,
  Sparkles,
  Briefcase,
  Terminal,
  Activity,
  Binary,
  Compass
} from 'lucide-react';

/**
 * Standard Role Catalog with Color Palettes, Icons, and Visual Badges
 */
export const ROLE_CATALOG = {
  'Software Developer': {
    id: 'software-developer',
    title: 'Software Developer',
    shortTitle: 'Software Dev',
    category: 'Core Engineering',
    color: 'cyan',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    border: 'border-cyan-500/40',
    bgLight: 'bg-cyan-500/10',
    textColor: 'text-cyan-300',
    glow: 'rgba(6, 182, 212, 0.35)',
    icon: Code2,
    symbol: '< / >',
    summary: 'Data Structures, RESTful APIs, OOP & Distributed Architectures'
  },
  'Data Analyst': {
    id: 'data-analyst',
    title: 'Data Analyst',
    shortTitle: 'Data Analyst',
    category: 'Business Intelligence',
    color: 'emerald',
    gradient: 'from-emerald-400 via-teal-600 to-cyan-700',
    border: 'border-emerald-500/40',
    bgLight: 'bg-emerald-500/10',
    textColor: 'text-emerald-300',
    glow: 'rgba(16, 185, 129, 0.35)',
    icon: Database,
    symbol: 'SQL',
    summary: 'SQL Queries, Power BI, Statistical EDA & KPI Reporting'
  },
  'Data Scientist': {
    id: 'data-scientist',
    title: 'Data Scientist',
    shortTitle: 'Data Scientist',
    category: 'Predictive Analytics',
    color: 'violet',
    gradient: 'from-violet-500 via-purple-600 to-indigo-800',
    border: 'border-violet-500/40',
    bgLight: 'bg-violet-500/10',
    textColor: 'text-violet-300',
    glow: 'rgba(139, 92, 246, 0.35)',
    icon: Activity,
    symbol: 'Σ',
    summary: 'Predictive Models, Scikit-learn, Feature Engineering & Statistics'
  },
  'Machine Learning Engineer': {
    id: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    shortTitle: 'ML Engineer',
    category: 'Artificial Intelligence',
    color: 'purple',
    gradient: 'from-purple-500 via-fuchsia-600 to-pink-700',
    border: 'border-purple-500/40',
    bgLight: 'bg-purple-500/10',
    textColor: 'text-purple-300',
    glow: 'rgba(168, 85, 247, 0.35)',
    icon: BrainCircuit,
    symbol: 'AI',
    summary: 'Deep Learning, PyTorch, Model Serving & MLOps Infrastructure'
  },
  'Full-Stack Developer': {
    id: 'full-stack-developer',
    title: 'Full-Stack Developer',
    shortTitle: 'Full-Stack Dev',
    category: 'End-to-End Web',
    color: 'pink',
    gradient: 'from-pink-500 via-rose-600 to-purple-700',
    border: 'border-pink-500/40',
    bgLight: 'bg-pink-500/10',
    textColor: 'text-pink-300',
    glow: 'rgba(236, 72, 153, 0.35)',
    icon: Layers,
    symbol: '{ }',
    summary: 'React Client, Node.js Microservices, MongoDB & Responsive UI'
  },
  'Cloud Engineer': {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    shortTitle: 'Cloud / DevOps',
    category: 'Cloud & Infrastructure',
    color: 'sky',
    gradient: 'from-sky-400 via-blue-600 to-indigo-800',
    border: 'border-sky-500/40',
    bgLight: 'bg-sky-500/10',
    textColor: 'text-sky-300',
    glow: 'rgba(14, 165, 233, 0.35)',
    icon: Cloud,
    symbol: 'AWS',
    summary: 'AWS Cloud Services, Docker Containerization, CI/CD & Terraform'
  },
  'Cloud DevOps': {
    id: 'cloud-devops',
    title: 'Cloud DevOps',
    shortTitle: 'DevOps Eng',
    category: 'Platform Automation',
    color: 'sky',
    gradient: 'from-sky-400 via-blue-600 to-indigo-800',
    border: 'border-sky-500/40',
    bgLight: 'bg-sky-500/10',
    textColor: 'text-sky-300',
    glow: 'rgba(14, 165, 233, 0.35)',
    icon: Cloud,
    symbol: 'CI/CD',
    summary: 'Automated Deployments, Kubernetes, Monitoring & Docker'
  },
  'Cybersecurity Analyst': {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    shortTitle: 'Cyber Security',
    category: 'Information Security',
    color: 'teal',
    gradient: 'from-teal-400 via-emerald-600 to-cyan-800',
    border: 'border-teal-500/40',
    bgLight: 'bg-teal-500/10',
    textColor: 'text-teal-300',
    glow: 'rgba(20, 184, 166, 0.35)',
    icon: ShieldCheck,
    symbol: '🔒',
    summary: 'Threat Hunting, Network Defense, OWASP Audits & SIEM Splunk'
  },
  'Cyber Security': {
    id: 'cyber-security',
    title: 'Cyber Security',
    shortTitle: 'Cyber Security',
    category: 'Information Security',
    color: 'teal',
    gradient: 'from-teal-400 via-emerald-600 to-cyan-800',
    border: 'border-teal-500/40',
    bgLight: 'bg-teal-500/10',
    textColor: 'text-teal-300',
    glow: 'rgba(20, 184, 166, 0.35)',
    icon: ShieldCheck,
    symbol: '🔒',
    summary: 'Vulnerability Assessment, Firewall Security & Penetration Testing'
  },
  'Business Analyst': {
    id: 'business-analyst',
    title: 'Business Analyst',
    shortTitle: 'Business Analyst',
    category: 'Strategy & Analytics',
    color: 'amber',
    gradient: 'from-amber-400 via-orange-500 to-rose-700',
    border: 'border-amber-500/40',
    bgLight: 'bg-amber-500/10',
    textColor: 'text-amber-300',
    glow: 'rgba(245, 158, 11, 0.35)',
    icon: TrendingUp,
    symbol: 'KPI',
    summary: 'Agile Stories, User Journeys, Process Mapping & Stakeholder Roadmaps'
  },
  'QA Automation Engineer': {
    id: 'qa-engineer',
    title: 'QA Automation Engineer',
    shortTitle: 'QA Automation',
    category: 'Quality Engineering',
    color: 'lime',
    gradient: 'from-lime-400 via-green-600 to-emerald-800',
    border: 'border-lime-500/40',
    bgLight: 'bg-lime-500/10',
    textColor: 'text-lime-300',
    glow: 'rgba(132, 204, 22, 0.35)',
    icon: CheckCircle,
    symbol: 'TEST',
    summary: 'Selenium, Cypress, PyTest Suites, Regression & Performance Testing'
  },
  'Mobile App Developer': {
    id: 'mobile-developer',
    title: 'Mobile App Developer',
    shortTitle: 'Mobile App Dev',
    category: 'Mobile Engineering',
    color: 'indigo',
    gradient: 'from-indigo-400 via-purple-600 to-pink-700',
    border: 'border-indigo-500/40',
    bgLight: 'bg-indigo-500/10',
    textColor: 'text-indigo-300',
    glow: 'rgba(99, 102, 241, 0.35)',
    icon: Smartphone,
    symbol: 'APP',
    summary: 'React Native, Flutter, iOS / Android UI & Mobile APIs'
  },
  'All': {
    id: 'all-roles',
    title: 'All Job Roles',
    shortTitle: 'All Roles',
    category: 'Full Catalog',
    color: 'slate',
    gradient: 'from-purple-500 via-indigo-600 to-pink-600',
    border: 'border-white/20',
    bgLight: 'bg-white/5',
    textColor: 'text-white',
    glow: 'rgba(255, 255, 255, 0.2)',
    icon: Compass,
    symbol: '★',
    summary: 'Comprehensive view across all collegiate career pathways'
  }
};

/**
 * Fuzzy matches a role string against the catalog
 */
export function getRoleMeta(roleName) {
  if (!roleName) return ROLE_CATALOG['Software Developer'];
  if (ROLE_CATALOG[roleName]) return ROLE_CATALOG[roleName];

  const lower = roleName.toLowerCase();
  for (const [key, meta] of Object.entries(ROLE_CATALOG)) {
    if (
      lower.includes(key.toLowerCase()) ||
      lower.includes(meta.shortTitle.toLowerCase()) ||
      key.toLowerCase().includes(lower)
    ) {
      return meta;
    }
  }

  // Fallback defaults
  if (lower.includes('data') || lower.includes('analytics')) return ROLE_CATALOG['Data Analyst'];
  if (lower.includes('learn') || lower.includes('ai') || lower.includes('intelligence')) return ROLE_CATALOG['Machine Learning Engineer'];
  if (lower.includes('cloud') || lower.includes('devops')) return ROLE_CATALOG['Cloud Engineer'];
  if (lower.includes('security') || lower.includes('cyber')) return ROLE_CATALOG['Cybersecurity Analyst'];
  if (lower.includes('business') || lower.includes('product')) return ROLE_CATALOG['Business Analyst'];

  return ROLE_CATALOG['Software Developer'];
}

/**
 * RoleAvatar Component - Visual Role Badge with Neon Gradient
 */
export function RoleAvatar({ role, size = 'md', className = '' }) {
  const meta = getRoleMeta(role);
  const Icon = meta.icon || Code2;

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg text-[9px]',
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
    xl: 'w-16 h-16 rounded-3xl text-lg'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 bg-gradient-to-tr ${meta.gradient} shadow-md border ${meta.border} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      style={{ boxShadow: `0 0 16px ${meta.glow}` }}
      title={`${meta.title} (${meta.category})`}
    >
      <Icon className={`${iconSizes[size] || iconSizes.md} text-white drop-shadow`} />
    </div>
  );
}

/**
 * RoleBadge Component - Pill badge with visual role icon and label
 */
export function RoleBadge({ role, size = 'sm', withCategory = false, className = '' }) {
  const meta = getRoleMeta(role);
  const Icon = meta.icon || Code2;

  const textSizes = {
    xs: 'text-[10px] py-0.5 px-2 gap-1',
    sm: 'text-xs py-1 px-2.5 gap-1.5',
    md: 'text-sm py-1.5 px-3.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border ${meta.border} ${meta.bgLight} ${meta.textColor} ${textSizes[size] || textSizes.sm} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{meta.title}</span>
      {withCategory && (
        <span className="text-[10px] font-normal opacity-75 border-l border-white/20 pl-1.5 ml-0.5">
          {meta.category}
        </span>
      )}
    </span>
  );
}

/**
 * Interactive Role Selection Card with Visual Role Image / Badge
 */
export function RoleSelectorCard({ role, isSelected, onSelect }) {
  const meta = getRoleMeta(role);
  const Icon = meta.icon || Code2;

  return (
    <button
      type="button"
      onClick={() => onSelect(meta.title)}
      className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex items-center gap-3.5 group ${
        isSelected
          ? `bg-[#0e142c] ${meta.border} shadow-[0_0_20px_${meta.glow}] ring-1 ring-purple-500`
          : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-tr ${meta.gradient} shadow transition-transform group-hover:scale-105`}
        style={{ boxShadow: `0 0 14px ${meta.glow}` }}
      >
        <Icon className="w-5 h-5 text-white drop-shadow" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-200">
            {meta.title}
          </h4>
          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${meta.bgLight} ${meta.textColor}`}>
            {meta.symbol}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">
          {meta.summary}
        </p>
      </div>
    </button>
  );
}
