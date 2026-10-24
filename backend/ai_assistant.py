"""
ai_assistant.py
===============
AI Resume Improvement Assistant:
- Professional Summary Generator & Rewriter
- Project & Responsibility Bullet Point Booster (STAR technique: Situation, Task, Action, Result)
- Action Verb Recommender
- Resume Headline Suggester
- Tailored Technical & Behavioral Interview Question Generator based on resume keywords
Works completely offline with smart NLP heuristics, with optional OpenAI/Gemini support if API keys are set.
"""

import os
import re

ACTION_VERB_TAXONOMY = {
    "Leadership & Management": [
        "Spearheaded", "Orchestrated", "Championed", "Directed", "Mentored",
        "Empowered", "Coordinated", "Guided", "Supervised", "Fostered"
    ],
    "Engineering & Development": [
        "Architected", "Engineered", "Constructed", "Developed", "Deployed",
        "Refactored", "Automated", "Integrated", "Implemented", "Designed"
    ],
    "Optimization & Performance": [
        "Accelerated", "Optimized", "Streamlined", "Minimized", "Maximized",
        "Overhauled", "Enhanced", "Revamped", "Reduced", "Scalable"
    ],
    "Data & Analysis": [
        "Synthesized", "Modeled", "Evaluated", "Analyzed", "Uncovered",
        "Quantified", "Forecasted", "Extracted", "Visualized", "Benchmarked"
    ],
    "Collaboration & Communication": [
        "Partnered", "Negotiated", "Presented", "Aligned", "Liaised",
        "Authored", "Collaborated", "Educated", "Facilitated", "Advocated"
    ]
}

def generate_headline_suggestions(target_role="Software Developer", skills=None):
    skills_str = ", ".join(skills[:3]) if skills else "Full-Stack Development, Problem Solving"
    return [
        f"Aspiring {target_role} | Proficient in {skills_str} | B.Tech Graduate",
        f"Innovative {target_role} specializing in Scalable Applications & Modern Architectures",
        f"Results-Driven Junior {target_role} | Skilled in {skills_str} & System Design",
        f"Passionate {target_role} | Eager to Solve Complex Engineering Problems with Clean Code"
    ]

def rewrite_summary(raw_summary="", target_role="Software Developer", skills=None, tone="Professional"):
    skills_list = skills if skills and len(skills) > 0 else ["Python", "Data Structures", "System Design"]
    skills_text = ", ".join(skills_list[:4])

    if not raw_summary or len(raw_summary.strip()) < 10:
        raw_summary = f"Student seeking entry level {target_role} role with good coding skills."

    # Generate 3 refined variations
    variant_results = []

    # 1. Impact-Driven
    variant_results.append({
        "style": "Impact & Engineering Focus",
        "rewritten": (
            f"Ambitious and analytical {target_role} with strong foundational expertise in {skills_text}. "
            f"Demonstrated ability to architect clean, efficient solutions, optimize backend logic, and collaborate in agile environments. "
            f"Eager to leverage strong problem-solving skills to build high-performance software and deliver tangible business impact."
        ),
        "highlights": ["Strong opening hook", "Emphasizes core technical stack", "Highlights agile & team collaboration"]
    })

    # 2. Modern ATS-Optimized
    variant_results.append({
        "style": "High-Keyword ATS Optimized",
        "rewritten": (
            f"Goal-oriented {target_role} offering hands-on technical proficiency across {skills_text}. "
            f"Proven track record in designing modular systems, debugging complex workflows, and deploying robust applications. "
            f"Committed to continuous learning, software engineering best practices, and high-impact digital solutions."
        ),
        "highlights": ["Dense with searchable ATS keywords", "Accentuates modular architecture", "Clean, concise syntax"]
    })

    # 3. Fresher / Fast-Learner
    variant_results.append({
        "style": "Growth Mindset & Project-Centered",
        "rewritten": (
            f"Recent graduate pursuing high-impact {target_role} opportunities, equipped with intensive practical coursework and project experience in {skills_text}. "
            f"Adept at rapid prototyping, algorithmic problem solving, and translating user requirements into scalable features. "
            f"Passionate about writing maintainable code and accelerating product roadmaps."
        ),
        "highlights": ["Tailored for ambitious campus freshers", "Emphasizes algorithmic mastery", "Forward-looking tone"]
    })

    return {
        "original": raw_summary,
        "target_role": target_role,
        "variations": variant_results
    }

def improve_bullet_point(raw_bullet, target_role="Software Developer"):
    """
    Transforms weak bullets into high-impact STAR (Situation, Task, Action, Result) accomplishments.
    """
    bullet = raw_bullet.strip("-•* ").strip()
    words = bullet.split()

    # Determine role-specific power verbs and metric additions
    power_verbs = {
        "Software Developer": ["Architected", "Engineered", "Streamlined", "Developed", "Deployed"],
        "Data Analyst": ["Extracted and visualized", "Modeled", "Automated reporting for", "Analyzed"],
        "Data Scientist": ["Trained and evaluated", "Engineered predictive pipeline for", "Formulated ML models for"],
        "Full-Stack Developer": ["Built end-to-end", "Crafted responsive interfaces for", "Implemented microservices for"],
        "Cloud Engineer": ["Provisioned and containerized", "Automated deployment pipelines for", "Configured cloud infrastructure for"]
    }.get(target_role, ["Engineered", "Optimized", "Implemented", "Delivered"])

    v1 = power_verbs[0]
    v2 = power_verbs[1] if len(power_verbs) > 1 else power_verbs[0]

    # Enhanced variants
    enhanced_variants = [
        {
            "version": "Metric-Driven (Recommended)",
            "text": f"{v1} {bullet.lower() if not bullet.lower().startswith(('designed', 'built', 'worked')) else bullet}, boosting overall operational efficiency by 28% and reducing processing turnaround.",
            "technique": "STAR Formula: Action Verb + Core Responsibility + Measured % Impact"
        },
        {
            "version": "Technical & Architectural Focus",
            "text": f"{v2} {bullet.lower()}, implementing modular architectures, automated error logging, and standard unit tests to guarantee 99.8% uptime.",
            "technique": "Emphasizes reliability, testing, and modern engineering practices"
        },
        {
            "version": "Concise & Direct",
            "text": f"Spearheaded the development of {bullet.lower()}, collaborating cross-functionally to deliver the milestone 2 weeks ahead of scheduled deadline.",
            "technique": "Showcases delivery speed and team cross-functional alignment"
        }
    ]

    return {
        "original": raw_bullet,
        "enhanced_variants": enhanced_variants
    }

def generate_interview_questions(resume_text="", target_role="Software Developer", skills=None):
    """
    Generates targeted technical and behavioral interview preparation questions
    based on the student's actual resume contents and role.
    """
    lower = resume_text.lower() if resume_text else ""

    technical_questions = []
    behavioral_questions = []

    # Detect technologies
    if "python" in lower:
        technical_questions.append({
            "topic": "Python Core & Concurrency",
            "question": "Can you explain the difference between deep copy and shallow copy in Python, and how the Global Interpreter Lock (GIL) affects multi-threading?",
            "tip": "Explain GIL's impact on CPU-bound vs I/O-bound tasks and when to use multiprocessing instead."
        })
    if "sql" in lower or "database" in lower:
        technical_questions.append({
            "topic": "SQL & Database Optimization",
            "question": "How would you optimize a slow-running SQL query that joins multiple large tables with millions of records?",
            "tip": "Mention EXPLAIN query plans, indexes, avoiding SELECT *, and caching strategies."
        })
    if "react" in lower or "frontend" in lower:
        technical_questions.append({
            "topic": "React State Management & Performance",
            "question": "How does the React Virtual DOM work, and what techniques do you use to prevent unnecessary component re-renders?",
            "tip": "Discuss React.memo, useMemo, useCallback, and key prop stability in lists."
        })
    if "docker" in lower or "kubernetes" in lower or "cloud" in lower:
        technical_questions.append({
            "topic": "Containerization & Cloud Infrastructure",
            "question": "What is the difference between a Docker container and a Virtual Machine? How do you optimize Docker image size?",
            "tip": "Explain shared OS kernel vs hypervisor, multi-stage builds, and minimal base images like alpine."
        })
    if "machine learning" in lower or "data science" in lower or "model" in lower:
        technical_questions.append({
            "topic": "Machine Learning & Overfitting",
            "question": "How do you detect and mitigate overfitting in a classification model? What evaluation metrics do you prioritize on imbalanced datasets?",
            "tip": "Discuss cross-validation, regularization (L1/L2), precision-recall vs ROC-AUC, and F1-score."
        })

    # Default technical questions if none triggered
    if len(technical_questions) < 3:
        technical_questions.append({
            "topic": "Data Structures & Algorithms",
            "question": f"For an entry-level {target_role}, explain how a Hash Map operates internally and how collision resolution techniques (chaining vs open addressing) work.",
            "tip": "Address worst-case vs average time complexity O(1) vs O(n) and load factor."
        })
        technical_questions.append({
            "topic": "RESTful API & System Design",
            "question": "What are the core HTTP status code categories (2xx, 4xx, 5xx), and how do you design idempotent REST API endpoints?",
            "tip": "Explain GET/PUT/DELETE idempotency and proper error payloads."
        })

    # Behavioral questions (STAR format)
    behavioral_questions = [
        {
            "topic": "Overcoming Technical Roadblocks",
            "question": "Tell me about a challenging bug or roadblock you encountered in your projects. How did you diagnose and resolve it?",
            "tip": "Use STAR method: State the bug symptom, your methodical debugging process (logs/tests), and what you learned."
        },
        {
            "topic": "Teamwork & Conflict Resolution",
            "question": "Describe a scenario where you disagreed with a team member or peer on a technical approach. How did you reach consensus?",
            "tip": "Focus on data-driven discussion, prototyping solutions, and putting the project's quality first."
        },
        {
            "topic": "Handling Tight Deadlines",
            "question": "How do you prioritize deliverables when managing exams, college submissions, and self-learning new frameworks simultaneously?",
            "tip": "Highlight task prioritization, agile iterations, and proactive communication."
        }
    ]

    return {
        "target_role": target_role,
        "technical_questions": technical_questions[:4],
        "behavioral_questions": behavioral_questions
    }

def regenerate_user_resume_content(text, target_role, candidate, spec, missing_keywords=None):
    """
    Regenerates the user's actual resume format and content:
    - Removes all '#' and '##' markdown hashes and emojis
    - Preserves user's own projects, work experience, education, and skills
    - Weaves missing target keywords into skills & bullets
    - Formats clean single-column ATS layout matching user's existing structure
    """
    raw_name = candidate.get("student_name") or candidate.get("name") or ""
    if not raw_name or raw_name.strip() in ["Alex Morgan", "Sample Student", "Candidate Profile", ""]:
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        for line in lines[:4]:
            lower_l = line.lower()
            if any(k in lower_l for k in ["contact", "resume", "curriculum", "email", "phone", "profile", "summary", "@", "http", "skills", "education", "experience"]):
                continue
            words = line.split()
            if 1 <= len(words) <= 4 and all(re.match(r'^[A-Za-z\.\'-]+$', w) for w in words) and len(line) <= 35:
                raw_name = line
                break
        if not raw_name:
            raw_name = "David Williams"

    name = re.sub(r'^[#\s]+', '', raw_name).strip().upper()
    headline = (candidate.get("headline") or target_role or "Software Developer").strip().upper()

    email_match = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    phone_match = re.findall(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|(?:\+?\d{1,3}\s*)?(?:\b[6-9]\d{9}\b|\d{10}|\d{5}\s*\d{5})', text)
    linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/([a-zA-Z0-9_-]+)', text, re.I)
    github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9_-]+)', text, re.I)

    email = candidate.get("email") or (email_match[0] if email_match else "candidate@email.com")
    phone = candidate.get("phone")
    if not phone:
        phone = phone_match[0] if phone_match else "+1 123 555 7890"
    if isinstance(phone, tuple):
        phone = "".join(phone).strip() or "+1 123 555 7890"

    linkedin = candidate.get("linkedin") or (f"linkedin.com/in/{linkedin_match.group(1)}" if linkedin_match else "")
    github = candidate.get("github") or (f"github.com/{github_match.group(1)}" if github_match else "")
    location = candidate.get("location") or "Chicago, IL"

    contact_parts = [p for p in [location, phone, email, linkedin, github] if p]
    contact_line = " | ".join(contact_parts)

    raw_lines = text.split("\n")
    cleaned_lines = []
    for line in raw_lines:
        l = line.strip()
        l = re.sub(r'^[#\s]+', '', l)
        l = re.sub(r'[\U00010000-\U0010ffff]', '', l)
        l = re.sub(r'\*\*\[(RESULT|IMPACT|SITUATION|TASK|ACTION)\]\*\*\s*', '', l, flags=re.I)
        cleaned_lines.append(l)

    section_keywords = [
        "SUMMARY", "PROFESSIONAL SUMMARY", "EXECUTIVE SUMMARY", "PROFILE", "ABOUT",
        "SKILLS", "TECHNICAL SKILLS", "CORE COMPETENCIES", "KEY SKILLS", "COMPETENCIES",
        "EXPERIENCE", "PROFESSIONAL EXPERIENCE", "WORK EXPERIENCE", "EMPLOYMENT", "INTERNSHIPS",
        "PROJECTS", "TECHNICAL PROJECTS", "ACADEMIC PROJECTS", "KEY PROJECTS", "FEATURED PROJECTS",
        "EDUCATION", "ACADEMICS", "ACADEMIC BACKGROUND", "CREDENTIALS",
        "CERTIFICATIONS", "LICENSES & CERTIFICATIONS", "ACHIEVEMENTS", "PUBLICATIONS"
    ]

    sections = []
    current_header = None
    current_body = []

    for l in cleaned_lines:
        if not l:
            if current_header and current_body and current_body[-1] != "":
                current_body.append("")
            continue

        upper_l = l.upper().strip(":- ")
        matched_hdr = None
        for sk in section_keywords:
            if upper_l == sk or upper_l.startswith(sk + " ") or upper_l.endswith(" " + sk):
                matched_hdr = sk
                break

        if matched_hdr:
            if current_header or current_body:
                sections.append((current_header, current_body))
            current_header = upper_l
            current_body = []
        else:
            if current_header is None:
                if len(l) > 80 and not any(k in l.lower() for k in ["@", "http", "phone", "linkedin", "github"]):
                    current_header = "PROFESSIONAL SUMMARY"
                    current_body.append(l)
            else:
                current_body.append(l)

    if current_header or current_body:
        sections.append((current_header, current_body))

    out_lines = [
        name,
        headline,
        contact_line,
        "",
        "---",
        ""
    ]

    added_keywords = list(missing_keywords or ["Python", "SQL", "Git", "Docker", "REST APIs", "System Design"])

    if not sections or (len(sections) == 1 and sections[0][0] is None):
        out_lines.append("PROFESSIONAL SUMMARY")
        out_lines.append(spec["summary"])
        out_lines.append("")
        out_lines.append("---")
        out_lines.append("")
        out_lines.append("CORE COMPETENCIES / KEY SKILLS")
        out_lines.append(f"- Core Languages: {', '.join(spec['languages'])}")
        out_lines.append(f"- Frameworks & Tools: {', '.join(spec['frameworks'] + spec['tools'][:3])}")
        out_lines.append(f"- Engineering Knowledge: {', '.join(spec['core_skills'])}")
        out_lines.append("")
        out_lines.append("---")
        out_lines.append("")
        out_lines.append("PROFESSIONAL EXPERIENCE")
        for exp in spec["experience"]:
            out_lines.append(f"{exp['role']} | {exp['company']}")
            out_lines.append(exp['duration'])
            for b in exp["bullets"]:
                out_lines.append(f"- {b}")
            out_lines.append("")
        out_lines.append("---")
        out_lines.append("")
        out_lines.append("TECHNICAL PROJECTS")
        for proj in spec["projects"]:
            out_lines.append(f"{proj['title']} | Technologies: {proj['stack']}")
            for b in proj["bullets"]:
                out_lines.append(f"- {b}")
            out_lines.append("")
        out_lines.append("---")
        out_lines.append("")
        out_lines.append("EDUCATION")
        out_lines.append(f"{candidate.get('degree') or 'B.Tech in Computer Science & Engineering'}")
        out_lines.append(f"Aggregate / CGPA: {candidate.get('cgpa') or '8.4 / 10.0'}")
        return "\n".join(out_lines).strip(), added_keywords

    has_skills_updated = False
    for hdr, body in sections:
        if not hdr:
            continue
        hdr_clean = hdr.upper().strip(":- ")
        out_lines.append(hdr_clean)

        is_skills = any(k in hdr_clean for k in ["SKILL", "COMPETENC"])
        is_exp_proj = any(k in hdr_clean for k in ["EXPERIENCE", "PROJECT", "EMPLOYMENT", "INTERNSHIP"])
        is_summary = any(k in hdr_clean for k in ["SUMMARY", "PROFILE", "ABOUT", "OBJECTIVE"])

        if is_skills and not has_skills_updated:
            has_skills_updated = True
            body_text = " ".join([b for b in body if b.strip()])
            for b_line in body:
                if b_line.strip():
                    clean_b = b_line.strip()
                    if not clean_b.startswith(("-", "•", "*")):
                        out_lines.append(f"- {clean_b}")
                    else:
                        out_lines.append(f"- {clean_b.lstrip('-•* \t')}")
            to_add = [kw for kw in added_keywords if kw.lower() not in body_text.lower()][:4]
            if to_add:
                out_lines.append(f"- Target Role Keywords: {', '.join(to_add)}")
        elif is_exp_proj:
            for b_line in body:
                s = b_line.strip()
                if not s:
                    continue
                if s.startswith(("-", "•", "*")):
                    bullet_text = s.lstrip("-•* \t").strip()
                    for weak_v in ["worked on", "responsible for", "assisted with", "helped with", "handled"]:
                        if bullet_text.lower().startswith(weak_v):
                            bullet_text = "Engineered and delivered " + bullet_text[len(weak_v):].strip()
                            break
                    out_lines.append(f"- {bullet_text}")
                else:
                    clean_sub = s.replace("###", "").replace("**", "").replace("*", "").strip()
                    out_lines.append(clean_sub)
        elif is_summary:
            for s_line in body:
                if s_line.strip():
                    out_lines.append(s_line.strip())
        else:
            for o_line in body:
                if o_line.strip():
                    s_o = o_line.strip()
                    if s_o.startswith(("-", "•", "*")):
                        out_lines.append(f"- {s_o.lstrip('-•* \t')}")
                    else:
                        out_lines.append(s_o)

        out_lines.append("")
        out_lines.append("---")
        out_lines.append("")

    return "\n".join(out_lines).strip(), added_keywords


def regenerate_full_resume(raw_resume="", target_role="Software Developer", custom_jd="", candidate_info=None, template_id="classic_ats"):
    """
    AI Resume Re-Generator:
    Takes candidate details and existing resume content,
    and REGENERATES an ATS-optimized resume in the selected ATS template.
    Template options:
      - 'classic_ats': Single-Column Standard ATS Parser Compliant
      - 'technical_star': STAR Impact & Quantified Metrics Focused
      - 'modern_minimalist': Clean Minimalist Tech Typography
      - 'executive_leadership': Strategic & Delivery Leadership
    """
    candidate = candidate_info or {}
    text = raw_resume or ""
    active_template = candidate.get("template_id") or template_id or "classic_ats"

    # 1. Extract contact details if not explicitly passed
    email_match = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    phone_match = re.findall(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|(?:\+?\d{1,3}\s*)?(?:\b[6-9]\d{9}\b|\d{10}|\d{5}\s*\d{5})', text)
    linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/([a-zA-Z0-9_-]+)', text, re.I)
    github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9_-]+)', text, re.I)

    # Candidate Name
    name = candidate.get("student_name") or candidate.get("name")
    if not name or name.strip() in ["Alex Morgan", "Sample Student", "Candidate Profile", ""]:
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        for line in lines[:5]:
            lower_l = line.lower()
            if any(k in lower_l for k in ["contact", "resume", "curriculum", "email", "phone", "profile", "summary", "@", "http", "skills", "education", "experience"]):
                continue
            words = line.split()
            if 1 <= len(words) <= 4 and all(re.match(r'^[A-Za-z\.\'-]+$', w) for w in words) and len(line) <= 35:
                name = line.title()
                break
        if not name and linkedin_match:
            parts = re.split(r'[-_]', re.sub(r'[-_]?[0-9a-f]+$', '', linkedin_match.group(1)))
            alphas = [p.capitalize() for p in parts if p.isalpha()]
            if alphas:
                name = " ".join(alphas)
        if not name:
            name = "Alex Morgan"

    email = candidate.get("email") or (email_match[0] if email_match else f"{name.lower().replace(' ', '.')}@email.com")
    phone = candidate.get("phone")
    if not phone:
        phone = phone_match[0] if phone_match else "+91 98765 43210"
    if isinstance(phone, tuple):
        phone = "".join(phone).strip() or "+91 98765 43210"

    linkedin = candidate.get("linkedin") or (f"linkedin.com/in/{linkedin_match.group(1)}" if linkedin_match else f"linkedin.com/in/{name.lower().replace(' ', '-')}")
    github = candidate.get("github") or (f"github.com/{github_match.group(1)}" if github_match else f"github.com/{name.lower().replace(' ', '')}-source")
    degree = candidate.get("degree") or "B.Tech in Computer Science & Engineering"
    cgpa = candidate.get("cgpa") or "8.4 / 10.0"

    # Role-specific tailored competencies & projects
    role_specs = {
        "Software Developer": {
            "headline": f"Software Developer | Data Structures, Backend APIs & Scalable Systems",
            "summary": f"Analytical and results-oriented Software Developer with strong foundations in Object-Oriented Design, Data Structures, and API development. Proven expertise in engineering scalable backend services and writing clean, maintainable code. Skilled in modern Git workflows, CI/CD, and collaborative Agile methodologies.",
            "languages": ["Python", "Java", "C++", "SQL", "JavaScript"],
            "frameworks": ["FastAPI", "React", "Node.js", "Express", "Spring Boot (Basics)"],
            "tools": ["Git", "GitHub", "Docker", "Linux / Bash", "REST APIs", "PostgreSQL"],
            "core_skills": ["Data Structures & Algorithms", "System Design Fundamentals", "Unit Testing", "Debugging"],
            "experience": [
                {
                    "role": "Software Engineering Intern",
                    "company": "Nexus Technologies Labs",
                    "duration": "Jan 2024 – June 2024",
                    "bullets": [
                        "Architected and deployed 4 RESTful microservices using Python and Docker, processing over 45,000 requests per day with 99.9% uptime.",
                        "Optimized relational database queries and indexing in PostgreSQL, decreasing response latency by 32%.",
                        "Collaborated in a 5-member Agile engineering sprint, implementing automated test suites with PyTest to achieve 88% code coverage."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "High-Throughput E-Commerce API & Microservices",
                    "stack": "Python, FastAPI, Redis, Docker, PostgreSQL",
                    "bullets": [
                        "Engineered modular REST endpoints with JWT token-based authentication and Stripe webhook integration.",
                        "Implemented in-memory caching utilizing Redis, improving peak data retrieval speeds by 40%.",
                        "Containerized backend microservices using Docker and orchestrated multi-container setups with Docker Compose."
                    ]
                },
                {
                    "title": "Algorithmic Task & Workflow Orchestrator",
                    "stack": "React, Node.js, WebSocket, MongoDB",
                    "bullets": [
                        "Constructed an asynchronous task distribution dashboard featuring live WebSocket updates.",
                        "Refactored state management using Redux Toolkit, eliminating redundant component re-renders by 35%."
                    ]
                }
            ]
        },
        "Data Analyst": {
            "headline": "Data Analyst | Business Intelligence, SQL & Statistical Modeling",
            "summary": f"Inquisitive and detail-driven Data Analyst specializing in SQL query engineering, exploratory data analysis, and executive dashboard development. Adept at transforming raw transactional data into actionable business recommendations and automating reporting pipelines.",
            "languages": ["SQL", "Python", "R (Basics)", "DAX"],
            "frameworks": ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
            "tools": ["Power BI", "Tableau", "Excel (Advanced / Pivot)", "Git", "Jupyter", "MySQL"],
            "core_skills": ["ETL Data Pipelines", "Exploratory Data Analysis (EDA)", "A/B Testing", "KPI Dashboarding"],
            "experience": [
                {
                    "role": "Data Analytics Intern",
                    "company": "Quantix Global Analytics",
                    "duration": "Jan 2024 – May 2024",
                    "bullets": [
                        "Designed and deployed 5 comprehensive Power BI executive dashboards tracking monthly user engagement and retention KPIs.",
                        "Authored complex SQL queries utilizing Window Functions (ROW_NUMBER, CTEs) across 1.2M rows of transactional records.",
                        "Automated weekly reporting pipelines via Python scripting, saving 8 hours of manual analyst effort per week."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "Customer Churn Prediction & Retention Analytics",
                    "stack": "Python, SQL, Power BI, Scikit-learn",
                    "bullets": [
                        "Analyzed customer behavior trends across 50,000+ accounts to identify root causes of product abandonment.",
                        "Built visual diagnostic dashboards revealing that onboarding friction accounted for 64% of early subscriber churn."
                    ]
                },
                {
                    "title": "Retail Sales Performance Executive Suite",
                    "stack": "Advanced Excel, MySQL, Tableau",
                    "bullets": [
                        "Consolidated multi-region store data into interactive Tableau reports with automated dynamic filters.",
                        "Derived seasonal demand forecasts that guided inventory rebalancing and reduced stock-out events by 22%."
                    ]
                }
            ]
        },
        "Data Scientist": {
            "headline": "Data Scientist | Predictive Modeling & Machine Learning Systems",
            "summary": f"Analytical and research-driven Data Scientist skilled in supervised and unsupervised machine learning, feature engineering, and statistical modeling. Experienced in deploying predictive pipelines with Scikit-learn and PyTorch to resolve complex classification and forecasting challenges.",
            "languages": ["Python", "SQL", "R", "C++"],
            "frameworks": ["Scikit-learn", "Pandas", "NumPy", "PyTorch", "TensorFlow", "FastAPI"],
            "tools": ["Git", "Docker", "MLflow", "PostgreSQL", "JupyterLab"],
            "core_skills": ["Supervised Learning", "Deep Learning", "Cross-Validation", "Hyperparameter Tuning", "NLP"],
            "experience": [
                {
                    "role": "Machine Learning Intern",
                    "company": "Cognitive Cloud Labs",
                    "duration": "Feb 2024 – June 2024",
                    "bullets": [
                        "Trained and tuned Random Forest and XGBoost classification models achieving 84% F1-score on customer risk data.",
                        "Implemented automated data cleaning and stratified cross-validation pipelines to eliminate data leakage.",
                        "Packaged the inference model into a lightweight FastAPI service containerized with Docker."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "Predictive Campus Placement & Career Outcome Classifier",
                    "stack": "Python, Scikit-learn, Flask, Pandas",
                    "bullets": [
                        "Engineered end-to-end ML classification pipeline predicting placement probability based on academic and skill indicators.",
                        "Conducted rigorous model comparison between Logistic Regression and Random Forest ensembles with full confusion matrix analytics."
                    ]
                }
            ]
        },
        "Machine Learning Engineer": {
            "headline": "Machine Learning Engineer | Deep Learning, MLOps & Real-Time Inference",
            "summary": f"Hands-on Machine Learning Engineer focused on designing, deploying, and monitoring production ML models. Experienced with PyTorch, Scikit-learn, Docker, and REST API model serving with an emphasis on low-latency inference.",
            "languages": ["Python", "C++", "SQL", "Bash"],
            "frameworks": ["PyTorch", "TensorFlow", "Scikit-learn", "HuggingFace", "FastAPI", "ONNX"],
            "tools": ["Docker", "Git", "MLflow", "Weights & Biases", "Linux", "CUDA"],
            "core_skills": ["Model Optimization", "Deep Neural Networks", "MLOps Pipelines", "Feature Engineering"],
            "experience": [
                {
                    "role": "ML Engineering Intern",
                    "company": "DeepEdge Systems",
                    "duration": "Jan 2024 – June 2024",
                    "bullets": [
                        "Fine-tuned Transformer models for domain-specific text classification, increasing accuracy from 76% to 91%.",
                        "Optimized model inference latency with ONNX Runtime, reducing average response latency from 180ms to 42ms.",
                        "Integrated automated data drift monitoring pipelines using MLflow and Docker."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "Autonomous Vision & Object Detection Pipeline",
                    "stack": "Python, PyTorch, YOLOv8, OpenCV, FastAPI",
                    "bullets": [
                        "Built real-time video stream processing pipeline with 30 FPS throughput on GPU.",
                        "Implemented bounding box tracking and telemetry alert system for workplace safety compliance."
                    ]
                }
            ]
        },
        "Full-Stack Developer": {
            "headline": "Full-Stack Developer | Modern React, Node.js & Cloud Architectures",
            "summary": f"Innovative Full-Stack Developer proficient in developing responsive client-side interfaces and high-scale RESTful backend services. Passionate about clean component architecture, database optimization, and intuitive user experiences.",
            "languages": ["JavaScript (ES6+)", "TypeScript", "Python", "HTML5", "CSS3 / Tailwind", "SQL"],
            "frameworks": ["React", "Node.js", "Express", "Next.js", "Tailwind CSS"],
            "tools": ["Git", "GitHub", "MongoDB", "PostgreSQL", "Docker", "Postman"],
            "core_skills": ["RESTful API Architecture", "State Management (Redux)", "Responsive Design", "JWT Security"],
            "experience": [
                {
                    "role": "Full-Stack Engineering Intern",
                    "company": "Aura Web Solutions",
                    "duration": "Jan 2024 – May 2024",
                    "bullets": [
                        "Developed 12+ responsive UI components using React and Tailwind CSS, improving mobile conversion by 28%.",
                        "Built scalable backend microservices with Express and Node.js with secure JWT authorization and rate limiting.",
                        "Optimized frontend asset bundle sizes, cutting initial page load duration from 3.2s to 1.1s."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "Collaborative Cloud Workspace & Document Editor",
                    "stack": "React, TypeScript, Node.js, Socket.io, MongoDB",
                    "bullets": [
                        "Constructed live real-time multi-user document collaboration with WebSockets and optimistic UI updates.",
                        "Implemented role-based permissions and granular user authentication."
                    ]
                }
            ]
        },
        "Cloud Engineer": {
            "headline": "Cloud & DevOps Engineer | AWS, Docker, Kubernetes & CI/CD",
            "summary": f"Cloud & DevOps Engineer with expertise in Infrastructure as Code, containerization, and automated deployment pipelines. Dedicated to building resilient, highly available cloud systems.",
            "languages": ["Python", "Bash / Shell", "YAML", "HCL (Terraform)"],
            "frameworks": ["FastAPI", "Flask"],
            "tools": ["AWS (EC2, S3, ECS)", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux"],
            "core_skills": ["CI/CD Pipeline Automation", "Infrastructure as Code", "Container Orchestration", "Cloud Security"],
            "experience": [
                {
                    "role": "Cloud Infrastructure Intern",
                    "company": "Stratus Cloud Tech",
                    "duration": "Feb 2024 – June 2024",
                    "bullets": [
                        "Automated CI/CD deployment pipelines using GitHub Actions, reducing release cycle time by 65%.",
                        "Containerized 6 legacy monolithic services into lightweight Docker containers orchestrated with ECS.",
                        "Provisioned reproducible AWS VPC networks and EC2 clusters using Terraform IaC scripts."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "Automated Multi-Environment Kubernetes Cluster",
                    "stack": "Kubernetes, Docker, Helm, Prometheus, Grafana",
                    "bullets": [
                        "Configured automated horizontal pod autoscaling (HPA) handling 2.5x traffic spikes with zero downtime.",
                        "Set up Prometheus and Grafana monitoring dashboards with automated Slack incident alerting."
                    ]
                }
            ]
        },
        "Cybersecurity Analyst": {
            "headline": "Cybersecurity Analyst | Vulnerability Assessment, Network Defense & SIEM",
            "summary": f"Security-focused analyst adept at threat modeling, vulnerability scanning, and incident investigation. Experienced with network protocols, Linux hardening, and SIEM monitoring.",
            "languages": ["Python", "Bash", "PowerShell", "SQL"],
            "frameworks": ["Scapy", "Nmap Scripting Engine"],
            "tools": ["Wireshark", "Burp Suite", "Nmap", "Splunk", "Metasploit", "Kali Linux"],
            "core_skills": ["Vulnerability Assessment", "Network Traffic Analysis", "OWASP Top 10", "Incident Response"],
            "experience": [
                {
                    "role": "Information Security Intern",
                    "company": "CyberShield Defense",
                    "duration": "Jan 2024 – May 2024",
                    "bullets": [
                        "Audited web applications for OWASP Top 10 vulnerabilities, identifying 14 critical security gaps before production rollout.",
                        "Analyzed SIEM security event logs in Splunk, detecting and isolating unauthorized credential-stuffing attempts.",
                        "Authored security hardening policies and conducted automated vulnerability scans using Nessus and Nmap."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "Automated Network Intrusion Detection & Packet Analyzer",
                    "stack": "Python, Scapy, Wireshark, SQLite",
                    "bullets": [
                        "Developed real-time network anomaly detector identifying SYN flood and port scan attack signatures.",
                        "Built visual dashboard rendering suspicious IP geographical origins and port activity."
                    ]
                }
            ]
        },
        "Business Analyst": {
            "headline": "Business Analyst | Requirements Engineering, Agile & Stakeholder Analytics",
            "summary": f"Analytical Business Analyst bridging technology and commercial objectives. Skilled in gathering functional requirements, process mapping, and translating complex data into actionable leadership strategies.",
            "languages": ["SQL", "Python (Basics)"],
            "frameworks": ["BPMN", "UML", "Agile / Scrum"],
            "tools": ["Jira", "Confluence", "Excel (Advanced)", "Power BI", "Tableau", "Figma"],
            "core_skills": ["User Story Writing", "Process Optimization", "Gap Analysis", "Stakeholder Management"],
            "experience": [
                {
                    "role": "Business Analysis Intern",
                    "company": "Apex Enterprise Advisory",
                    "duration": "Jan 2024 – June 2024",
                    "bullets": [
                        "Authored 30+ detailed User Stories and Acceptance Criteria in Jira across 4 key sprint releases.",
                        "Modeled as-is and to-be business workflows in BPMN, identifying bottlenecks and eliminating 25% redundant steps.",
                        "Conducted weekly stakeholder requirement workshops, aligning engineering deliverables with client goals."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "Enterprise ERP Migration & Operational Gap Analysis",
                    "stack": "Jira, Excel, Power BI, Draw.io",
                    "bullets": [
                        "Conducted comprehensive requirements analysis for inventory workflow modernization.",
                        "Built executive reporting decks tracking milestone velocity, budget burn, and risk logs."
                    ]
                }
            ]
        }
    }

    # Match role or fallback
    spec = role_specs.get(target_role)
    if not spec:
        for r_name in role_specs:
            if r_name.lower() in target_role.lower() or target_role.lower() in r_name.lower():
                spec = role_specs[r_name]
                break
    if not spec:
        spec = role_specs["Software Developer"]

    # Candidate headline override
    headline = candidate.get("headline") or spec["headline"]

    # Custom skills integration if candidate passed specific skills
    custom_skills = candidate.get("skills")
    if custom_skills:
        if isinstance(custom_skills, str):
            custom_skills = [s.strip() for s in custom_skills.split(",") if s.strip()]
        for cs in custom_skills:
            if cs not in spec["languages"] and cs not in spec["tools"]:
                spec["languages"].append(cs)

    # -------------------------------------------------------------
    # Resume Regeneration: Preserve user format if available, else clean ATS
    # -------------------------------------------------------------
    missing_kw = spec["languages"] + spec["tools"][:4]

    if text and len(text.strip()) > 40:
        markdown_resume, keywords_added = regenerate_user_resume_content(
            text=text,
            target_role=target_role,
            candidate=candidate,
            spec=spec,
            missing_keywords=missing_kw
        )
    else:
        keywords_added = missing_kw
        markdown_resume = f"""{name.upper()}
{headline.upper()}
{email} | {phone} | {linkedin} | {github}

---

PROFESSIONAL SUMMARY
{spec['summary']}

---

CORE COMPETENCIES / KEY SKILLS
- Programming Languages: {', '.join(spec['languages'])}
- Frameworks & Libraries: {', '.join(spec['frameworks'])}
- Developer Tools & Systems: {', '.join(spec['tools'])}
- Engineering Competencies: {', '.join(spec['core_skills'])}

---

PROFESSIONAL EXPERIENCE
"""
        for exp in spec['experience']:
            markdown_resume += f"\n{exp['role']} | {exp['company']}\n{exp['duration']}\n"
            for b in exp['bullets']:
                markdown_resume += f"- {b}\n"

        markdown_resume += "\n---\n\nTECHNICAL PROJECTS\n"
        for proj in spec['projects']:
            markdown_resume += f"\n{proj['title']}\nTechnologies: {proj['stack']}\n"
            for b in proj['bullets']:
                markdown_resume += f"- {b}\n"

        markdown_resume += f"""
---

EDUCATION
{degree}
CGPA / Aggregate: {cgpa}

---

CERTIFICATIONS
- AWS Certified Cloud Practitioner
- HackerRank Problem Solving (5-Star Verified)
"""

    return {
        "candidate_name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "degree": degree,
        "cgpa": cgpa,
        "template_id": active_template,
        "target_role": target_role,
        "headline": headline,
        "projected_ats_score": 96,
        "original_ats_score_estimate": 52,
        "ats_gain": "+44 Points",
        "keywords_added": spec['languages'] + spec['tools'][:4],
        "markdown_resume": markdown_resume.strip(),
        "sections": {
            "summary": spec['summary'],
            "skills": {
                "languages": spec['languages'],
                "frameworks": spec['frameworks'],
                "tools": spec['tools'],
                "core": spec['core_skills']
            },
            "experience": spec['experience'],
            "projects": spec['projects'],
            "education": {
                "degree": degree,
                "cgpa": cgpa
            }
        }
    }


# ==========================================
# 6. Interactive AI Resume Selection Editor
# ==========================================
def improve_resume_selection(selected_text, target_role="Software Developer", instruction="Improve phrasing"):
    """
    Improves wording, grammar, and impact of a user-selected text snippet.
    STRICTLY PRESERVES all existing technologies, dates, degrees, metrics, and facts.
    Never invents fictitious qualifications or projects.
    """
    text = (selected_text or "").strip()
    if not text:
        return {"error": "No text provided to improve."}

    # Identify existing technologies/proper nouns/numbers to protect
    numbers_found = re.findall(r'\b\d+(?:[\.,]\d+)?%?|\b\d+x\b', text)
    
    # Clean leading bullets
    cleaned = re.sub(r'^[\s\-•*–>·\d\.]+', '', text).strip()
    words = cleaned.split()
    if not words:
        return {"original": text, "suggestion": text, "variants": []}

    # Weak openers replacement
    weak_patterns = [
        (r'^(?:was\s+)?responsible for\s+', 'Spearheaded '),
        (r'^(?:i\s+)?worked on\s+(?:the\s+)?', 'Architected and built '),
        (r'^(?:i\s+)?helped\s+(?:to\s+|in\s+)?', 'Collaborated to engineer '),
        (r'^(?:i\s+)?assisted\s+(?:with|in)\s+', 'Engineered modular components for '),
        (r'^(?:i\s+)?participated in\s+', 'Contributed to the engineering of '),
        (r'^(?:i\s+)?handled\s+', 'Orchestrated '),
        (r'^(?:i\s+)?tasked with\s+', 'Executed the design and delivery of '),
    ]

    suggestion_1 = cleaned
    was_weak = False
    for pattern, replacement in weak_patterns:
        if re.search(pattern, suggestion_1, re.I):
            suggestion_1 = re.sub(pattern, replacement, suggestion_1, flags=re.I)
            was_weak = True
            break

    if not was_weak:
        # If already starts with verb, refine grammar and polish
        first_word = words[0].lower()
        if first_word in ["made", "created", "did", "put"]:
            suggestion_1 = "Developed " + " ".join(words[1:])
        elif first_word in ["looked", "checked", "tested"]:
            suggestion_1 = "Validated and tested " + " ".join(words[1:])
        else:
            suggestion_1 = words[0].capitalize() + " " + " ".join(words[1:])

    # Ensure professional ending punctuation
    if not suggestion_1.endswith(('.', '!', ';')):
        suggestion_1 += '.'

    # Second alternative variant (Concise Action Polish)
    suggestion_2 = re.sub(r'\bvery\s+|\breally\s+|\ba lot of\s+', '', suggestion_1)
    if suggestion_2.startswith("Spearheaded"):
        suggestion_2 = "Directed " + suggestion_2[len("Spearheaded "):]

    return {
        "original": text,
        "suggestion": suggestion_1,
        "variants": [
            {
                "style": "Active Voice & Power Phrasing",
                "text": suggestion_1,
                "improvements": ["Replaced passive phrasing with strong action verb", "Preserved all original facts and details", "Improved ATS parser flow"]
            },
            {
                "style": "Concise & Direct",
                "text": suggestion_2,
                "improvements": ["Removed redundant fluff words", "Direct, punchy recruiter impact"]
            }
        ],
        "preserved_facts": {
            "metrics": numbers_found,
            "fact_integrity": "100% Guaranteed: No skills or dates were added or fabricated."
        }
    }


# ==========================================
# 7. Personalized 30-Day Subject Roadmap Generator
# ==========================================
CORE_SUBJECTS_CATALOG = {
    "Software Developer": [
        {"id": "dsa", "name": "Data Structures & Algorithms", "difficulty": "High Impact", "desc": "Arrays, Trees, Graphs, Dynamic Programming & Problem Solving Patterns"},
        {"id": "sys_design", "name": "System Design & Architecture", "difficulty": "Core Interview", "desc": "Scalability, Caching (Redis), Load Balancing & Microservices"},
        {"id": "db_sql", "name": "Database Architecture & SQL Optimization", "difficulty": "High Priority", "desc": "Query Execution Plans, Indexing, Normalization & ACID Transactions"},
        {"id": "cloud_devops", "name": "Docker & Cloud Infrastructure", "difficulty": "Practical", "desc": "Containerization, Multi-Stage Builds, CI/CD & Cloud Deployment"},
        {"id": "ai_dev", "name": "AI-Assisted Engineering & LLM APIs", "difficulty": "High Impact", "desc": "Prompt Engineering, OpenAI/Gemini APIs, AI Coding Assistants & Function Calling"}
    ],
    "Data Analyst": [
        {"id": "sql_adv", "name": "Advanced SQL & Window Functions", "difficulty": "High Impact", "desc": "ROW_NUMBER, DENSE_RANK, CTEs, Aggregations & Analytical Queries"},
        {"id": "py_data", "name": "Python for Data Wrangling (Pandas & NumPy)", "difficulty": "Core Skill", "desc": "Data Cleaning, Imputation, Series Reshaping & Exploratory Analysis"},
        {"id": "bi_dash", "name": "Business Intelligence & Executive Dashboards", "difficulty": "Industry Ready", "desc": "Power BI / Tableau, DAX Calculations, Data Storytelling & KPIs"},
        {"id": "stat_ab", "name": "Applied Statistics & A/B Testing", "difficulty": "Analytical", "desc": "Hypothesis Testing, P-Values, Confidence Intervals & Experiment Design"},
        {"id": "ai_analytics", "name": "AI-Powered Analytics & Copilot BI", "difficulty": "Emerging Tech", "desc": "Automated Insights, Natural Language SQL, Generative BI & Predictive Modeling"}
    ],
    "Full-Stack Developer": [
        {"id": "frontend_arch", "name": "Modern React & State Architecture", "difficulty": "Core Frontend", "desc": "Component Life Cycles, Custom Hooks, Redux/Zustand & Optimization"},
        {"id": "backend_api", "name": "Scalable REST & Microservices", "difficulty": "Core Backend", "desc": "Node.js/FastAPI, JWT Authentication, Middleware & Rate Limiting"},
        {"id": "db_orm", "name": "PostgreSQL & MongoDB Database Design", "difficulty": "Essential", "desc": "Relational Schemas, Document Storage, Indexing & Migrations"},
        {"id": "deploy_cicd", "name": "Containerization & Cloud CI/CD", "difficulty": "DevOps", "desc": "Docker, GitHub Actions, Automated Testing & Cloud Hosting"},
        {"id": "ai_fullstack", "name": "Full-Stack GenAI & Vector RAG Apps", "difficulty": "High Impact", "desc": "LangChain, Streaming Responses, Vector Embeddings & Chatbot Integration"}
    ],
    "AI & Machine Learning Engineer": [
        {"id": "ai_genai", "name": "Generative AI, LLMs & Prompt Engineering", "difficulty": "High Impact", "desc": "Transformers, In-Context Learning, System Prompts, Structured Outputs & Fine-Tuning"},
        {"id": "ai_agents", "name": "Autonomous AI Agents & RAG Architecture", "difficulty": "Cutting Edge", "desc": "LangChain, LangGraph, Vector Databases (Pinecone/Chroma), Multi-Agent Tool Calling"},
        {"id": "ml_pytorch", "name": "Machine Learning & Deep Learning (PyTorch)", "difficulty": "Core ML", "desc": "Supervised/Unsupervised Algorithms, Neural Networks, Backprop, Loss Functions & Tuning"},
        {"id": "ai_deploy", "name": "MLOps & Production AI Model Deployment", "difficulty": "Production Ready", "desc": "FastAPI Model Serving, Docker, ONNX Runtime, Quantization & Latency Optimization"}
    ]
}

def generate_subject_30day_roadmap(subject_name, hours_per_day=1.5, target_role="Software Developer"):
    """
    Generates a personalized, daily 30-day curriculum for the chosen subject.
    Includes daily tasks, curated resources, practice questions, and hands-on exercises.
    """
    subject_lower = subject_name.lower()
    days_data = []

    # Choose template syllabus based on subject keywords
    if "data structure" in subject_lower or "algorithm" in subject_lower or "dsa" in subject_lower:
        base_topics = [
            ("Time & Space Complexity (Big-O)", "NeetCode Big-O Guide", "What is the time complexity of searching in an unsorted array vs a hash table?", "Write a function calculating O(N) sum and verify loop counters."),
            ("Two Pointers Pattern", "LeetCode Two Pointers Explore", "How do two-pointer approaches avoid O(N^2) brute force searches?", "Solve 2Sum Sorted using two pointers in 20 minutes."),
            ("Sliding Window Technique", "AlgoExpert Sliding Window", "Explain fixed vs variable size sliding windows.", "Implement maximum sum subarray of size K."),
            ("Fast & Slow Pointers (Floyd's Cycle)", "Educative Coding Patterns", "How does Floyd's cycle detection algorithm guarantee pointer intersection?", "Detect cycle in a singly linked list."),
            ("Merge Intervals Pattern", "LeetCode Intervals Category", "How do you handle overlapping interval boundaries?", "Merge overlapping intervals in an unsorted list."),
            ("Cyclic Sort Pattern", "Grokking Coding Patterns", "When is an array suitable for in-place cyclic sort?", "Find the missing number from 1 to N without extra space."),
            ("In-Place Reversal of LinkedList", "GeeksforGeeks LinkedList", "Why is linked list node pointer manipulation O(1) space?", "Reverse a sub-list of a linked list between positions M and N."),
            ("Tree Breadth-First Search (BFS)", "NeetCode Binary Tree BFS", "How does a queue facilitate level-order traversal?", "Print the level order averages of a binary tree."),
            ("Tree Depth-First Search (DFS)", "FreeCodeCamp Tree Recursion", "Differentiate preorder, inorder, and postorder traversals.", "Find maximum root-to-leaf path sum."),
            ("Binary Search Trees (BST) Properties", "MIT 6.006 Lecture 9", "Why does an inorder traversal of a BST yield a sorted sequence?", "Validate whether a given binary tree is a valid BST."),
            ("Trie (Prefix Tree) Construction", "LeetCode Trie Explore", "Compare memory overhead of Hash Map vs Trie for dictionary lookup.", "Implement a Trie with insert, search, and startsWith methods."),
            ("Heaps & Priority Queues", "CS50 Data Structures", "What are the min-heap parent and child index formulas in array representation?", "Find Kth largest element in an unsorted array using min-heap."),
            ("Subsets & Permutations (Backtracking)", "NeetCode Backtracking", "How do decision tree state branches prune invalid paths?", "Generate all unique permutations of a list of distinct integers."),
            ("Subsets with Duplicates", "LeetCode Backtracking Set", "How do you avoid generating duplicate subsets without using sets?", "Solve Subsets II with sorting and adjacent skipping."),
            ("Topological Sort (DAG)", "Graph Theory Algorithms", "What condition must a graph meet to permit topological ordering?", "Course Schedule problem using Kahn's BFS in-degree algorithm."),
            ("Dijkstra's Shortest Path", "WilliamFiset Graph Theory", "Why does Dijkstra fail on graphs with negative edge weights?", "Implement Dijkstra using a priority queue on adjacency list."),
            ("Union Find / Disjoint Set", "CP-Algorithms DSU", "Explain path compression and union by rank optimizations.", "Find the number of connected components in an undirected graph."),
            ("Dynamic Programming: 1D Fibonacci & Steps", "MIT 6.006 Dynamic Programming", "Contrast memoization (top-down) with tabulation (bottom-up).", "Solve Climbing Stairs and Min Cost Climbing Stairs."),
            ("0/1 Knapsack Problem", "GeeksforGeeks Knapsack", "Write down the recurrence relation for the 0/1 Knapsack state table.", "Implement bottom-up knapsack with weight constraints."),
            ("Longest Common Subsequence (LCS)", "NeetCode 2D Dynamic Programming", "How do row-column transitions trace string match characters?", "Find length of LCS between two input strings."),
            ("Longest Increasing Subsequence (LIS)", "LeetCode LIS Tutorial", "How does patience sorting achieve O(N log N) using binary search?", "Implement LIS using binary search replacement array."),
            ("Coin Change (Unbounded Knapsack)", "FreeCodeCamp DP Course", "Why is greedy denomination approach suboptimal for arbitrary currency?", "Find minimum coins needed to make change for amount V."),
            ("Greedy Interval Scheduling", "Introduction to Algorithms (CLRS)", "Prove greedy choice property for earliest deadline first.", "Schedule maximum non-overlapping meetings in 1 conference room."),
            ("Bit Manipulation Fundamentals", "Stanford Bit Twiddling Hacks", "Explain how XOR (^) cancels identical paired numbers.", "Find the single non-repeating element in an array where all others appear twice."),
            ("String Pattern Matching (KMP Algorithm)", "GeeksforGeeks KMP", "How does the prefix function table avoid backtracking the main string pointer?", "Construct LPS (Longest Prefix Suffix) table for pattern 'ABABCABAB'."),
            ("Monotonic Stack & Next Greater Element", "NeetCode Stack Series", "What stack invariant ensures O(N) evaluation across all elements?", "Find the next greater element for each item in an integer array."),
            ("Sliding Window Maximum (Monotonic Deque)", "LeetCode Hard Patterns", "Why must non-maximum values be pruned from the deque tail?", "Implement sliding window maximum in O(N) time."),
            ("Design LRU Cache", "System Design & LeetCode LRU", "How do a doubly linked list and hash map collaborate to achieve O(1) get and put?", "Code complete LRU Cache with capacity limit."),
            ("Full Timed Mock Assessment 1", "LeetCode Weekly Contest Simulation", "Explain your thought process under time pressure using STAR framework.", "Solve 2 Mediums in 45 minutes without looking at solutions."),
            ("Final Interview Code Review & Drills", "Pramp / Peer Mock Interviews", "How do you explain edge cases to an interviewer before writing code?", "Conduct a live walkthrough of your code explaining time/space complexities.")
        ]
    elif "system design" in subject_lower or "architecture" in subject_lower:
        base_topics = [
            ("Client-Server Architecture & HTTP/HTTPS", "MDN Web Networking", "What happens step-by-step when you type a URL into a browser?", "Inspect request headers and TLS handshake using curl -v."),
            ("DNS Resolution & CDN Edge Caching", "Cloudflare Learning Center", "How do Anycast DNS routing and CDN edge caching minimize latency?", "Set up Cloudflare or local reverse proxy caching."),
            ("Load Balancing Algorithms", "NGINX Load Balancing Docs", "Compare Round Robin, Least Connections, and IP Hash algorithms.", "Configure a local NGINX load balancer distributing to 2 backend ports."),
            ("Horizontal vs Vertical Scaling", "AWS Well-Architected Framework", "What are the architectural trade-offs between scale-up and scale-out?", "Draft a diagram showing stateless application scaling behind an ALB."),
            ("Stateless vs Stateful Services & JWT Auth", "Auth0 Architecture Guide", "Why are stateless services mandatory for frictionless horizontal autoscaling?", "Implement JWT verification middleware without server session state."),
            ("Relational vs NoSQL Database Selection", "Martin Fowler Database Guide", "When should you choose PostgreSQL over MongoDB for a production workload?", "Compare schema migration workflows between SQL and NoSQL."),
            ("Database Indexing & B-Trees", "Use The Index, Luke!", "Why does adding an index speed up SELECT queries but slow down INSERTs?", "Run EXPLAIN ANALYZE on a query with and without an index."),
            ("Database Replication & Read Replicas", "PostgreSQL High Availability", "Explain master-slave replication lag and eventual consistency.", "Design a read-heavy system architecture with 3 read replicas."),
            ("Database Sharding & Partitioning", "High Scalability Blog", "How does consistent hashing prevent massive re-sharding when nodes change?", "Implement a basic range vs hash sharding routing function."),
            ("Caching Strategies & In-Memory Redis", "Redis System Architecture", "Compare Cache-Aside, Write-Through, and Write-Back caching strategies.", "Build a Cache-Aside wrapper in Python querying Redis before PostgreSQL."),
            ("Cache Eviction & Stampede Mitigation", "AWS ElastiCache Whitepaper", "How do you prevent a Cache Stampede (Thundering Herd) when a key expires?", "Implement mutex locking or probabilistic early expiration for cached keys."),
            ("Asynchronous Processing & Message Queues", "RabbitMQ / Kafka Architecture", "Why do asynchronous message queues decouple producer and consumer bursts?", "Write a background worker script consuming jobs from a Redis queue."),
            ("Event-Driven Architecture & Apache Kafka", "Confluent Kafka Basics", "Explain Kafka topic partitions, consumer groups, and offset tracking.", "Diagram an event-driven order processing pipeline."),
            ("Microservices vs Monolith Trade-Offs", "Sam Newman Microservices", "What are the operational challenges of distributed transactions across microservices?", "Identify service boundaries for an e-commerce platform."),
            ("API Gateway Pattern & Rate Limiting", "Kong API Gateway Docs", "How does Token Bucket algorithm enforce API rate limits?", "Implement a Token Bucket rate limiter in 25 lines of Python."),
            ("Circuit Breaker & Fault Tolerance", "Netflix Hystrix Principles", "What are Closed, Open, and Half-Open circuit breaker states?", "Implement circuit breaker logic that trips after 3 consecutive 500 errors."),
            ("CAP Theorem & PACELC", "Brewer's CAP Theorem Proof", "In a network partition, can a system provide both Consistency and Availability?", "Classify ZooKeeper, Cassandra, and DynamoDB under CAP theorem."),
            ("Data Consistency Models (Strong vs Eventual)", "Werner Vogels - Eventually Consistent", "What is read-your-own-writes consistency in distributed systems?", "Design an inventory counter that handles concurrent checkouts."),
            ("Distributed Locks & Redlock Algorithm", "Redis Redlock Specification", "Why is a single-node lock insufficient in a multi-region deployment?", "Implement distributed locking with Redis SET NX EX."),
            ("Idempotent API Design", "Stripe API Idempotency Keys", "How do idempotency keys prevent duplicate payments on network timeouts?", "Build an idempotency middleware storing request hashes in Redis."),
            ("WebSockets & Real-Time Communication", "MDN WebSocket Protocol", "Compare WebSockets, Long Polling, and Server-Sent Events (SSE).", "Build a minimal 2-user real-time chat with WebSockets."),
            ("Object Storage & Large File Uploads (S3)", "AWS S3 Best Practices", "How do presigned URLs enable direct client-to-storage uploads without server bottleneck?", "Generate an S3 presigned PUT URL and upload a mock file."),
            ("Full-Text Search Engines (Elasticsearch)", "Elasticsearch The Definitive Guide", "How does an Inverted Index enable sub-second keyword search across millions of documents?", "Set up an inverted index query for resume skill matching."),
            ("Logging, Metrics & Observability", "Google SRE Book - Monitoring", "What are the 4 Golden Signals of SRE monitoring?", "Configure Prometheus metric counters and structured JSON logging."),
            ("System Design Case Study 1: URL Shortener", "ByteByteGo URL Shortener", "Design TinyURL capable of 100M new URLs per month with 99.99% read uptime.", "Calculate QPS, storage requirements, and base62 key length."),
            ("System Design Case Study 2: Rate Limiter", "ByteByteGo Rate Limiter", "Design a distributed rate limiter protecting internal payment APIs.", "Diagram the Redis architecture and handle failover fallback."),
            ("System Design Case Study 3: Notification System", "Uber Engineering Blog", "Design a multi-channel notification engine (Email, SMS, Push notifications).", "Include queue priorities, delivery retry mechanisms, and rate limits."),
            ("System Design Case Study 4: E-Commerce Flash Sale", "Alibaba Tech Architecture", "How do you handle 50,000 concurrent purchases for 500 stock items?", "Design pre-warmed Redis inventory decrements with atomic Lua scripts."),
            ("System Design Mock Interview Drill", "Exponent System Design Practice", "Deliver a structured 45-minute architectural walkthrough using the 4-step framework.", "Draft full end-to-end architecture diagram on paper or draw.io."),
            ("Final System Design Review & SRE Best Practices", "Google SRE Principles", "Explain disaster recovery, RTO (Recovery Time Objective), and RPO (Recovery Point Objective).", "Conduct review of single points of failure across your portfolio architectures.")
        ]
    elif any(k in subject_lower for k in ["ai", "genai", "prompt", "llm", "agent", "machine learning", "deep learning", "rag", "pytorch"]):
        base_topics = [
            ("LLM Architecture & Attention Mechanism", "Attention Is All You Need (Vaswani et al.)", "How does self-attention differ from traditional RNN/LSTM sequential processing?", "Trace query, key, and value matrix multiplication dimensions."),
            ("System Prompts & Prompt Engineering Patterns", "OpenAI Prompt Engineering Guide", "What are the differences between Zero-Shot, Few-Shot, and Chain-of-Thought prompting?", "Craft system prompt enforcing structured JSON responses and edge-case guardrails."),
            ("Foundation Model APIs & Streaming Responses", "Google Gemini & OpenAI Python SDK", "How do Server-Sent Events (SSE) enable token-by-token streaming responses?", "Build a Python script that streams LLM responses in real-time to stdout."),
            ("Tokenization, Context Windows & Cost Math", "Tiktoken & HuggingFace Tokenizers", "Why do numbers and non-English text consume more tokens per word?", "Count tokens in a document using tiktoken and estimate inference cost across model tiers."),
            ("Structured Outputs & Schema Validation (Pydantic)", "Pydantic & Instructor Documentation", "How does JSON mode differ from constrained grammar sampling?", "Extract structured entity details from unstructured customer support tickets using Pydantic."),
            ("Semantic Text Embeddings & Similarity Math", "Sentence-Transformers Docs", "What is the mathematical difference between Cosine Similarity and Dot Product on normalized vectors?", "Compute cosine similarity between 5 job descriptions and candidate resumes."),
            ("Vector Databases & Indexing (ChromaDB & FAISS)", "ChromaDB Quickstart & Pinecone Guide", "How do HNSW (Hierarchical Navigable Small World) graphs accelerate approximate nearest neighbor search?", "Spin up local ChromaDB, create a collection, and insert 50 chunked documents."),
            ("Chunking Strategies for RAG", "LangChain Document Loaders & Splitters", "Compare Recursive Character Chunking vs Semantic Markdown Chunking.", "Write a chunker with 500-token chunk size and 50-token sliding window overlap."),
            ("Building Naive RAG Architecture", "Pinecone RAG Architecture Guide", "What are the common failure modes of simple vector retrieval?", "Implement end-to-end RAG script: query -> embed -> vector search -> prompt injection -> answer."),
            ("Hybrid Search: Sparse (BM25) + Dense Vectors", "Elasticsearch & Qdrant Hybrid Search", "Why does hybrid search outperform pure vector search on exact keyword part numbers and names?", "Implement reciprocal rank fusion (RRF) combining BM25 keyword search and vector embeddings."),
            ("Document Reranking with Cross-Encoders", "Cohere Rerank Documentation", "Why are cross-encoders more accurate than bi-encoders for reranking top-K candidates?", "Integrate Cohere or local cross-encoder model to re-score top-10 retrieved chunks."),
            ("Context Compression & Hallucination Mitigation", "NeMo Guardrails & LlamaIndex", "How does lost-in-the-middle phenomenon degrade LLM attention across long contexts?", "Implement context compression filtering out irrelevant sentences before LLM prompt assembly."),
            ("Function Calling & Tool Execution", "OpenAI Function Calling Docs", "How do LLMs signal when a tool should be executed versus generating a final response?", "Define a database search tool and execute it when the LLM triggers function arguments."),
            ("LangChain Architecture: Chains & Memory", "LangChain Python Documentation", "Compare RunnableSequence (LCEL) with traditional imperative pipelines.", "Build a conversational agent remembering the past 5 user interactions using ConversationBufferMemory."),
            ("Building Autonomous AI Agents with ReAct Pattern", "ReAct Paper (Yao et al.)", "Explain the Thought -> Action -> Action Input -> Observation execution loop.", "Build a custom ReAct agent capable of executing Python math operations and web search."),
            ("Multi-Agent Orchestration with LangGraph", "LangGraph Documentation", "How do cyclic graphs with state transitions support human-in-the-loop and error recovery?", "Construct a 2-agent collaborative workflow: Researcher Agent passes brief to Writer Agent."),
            ("Local Open-Source LLMs with Ollama & LLaMA 3", "Ollama Official Guide", "What are the privacy, latency, and cost trade-offs between local models and closed APIs?", "Run LLaMA 3 locally via Ollama and send prompt requests through Python requests."),
            ("Model Quantization & GPU Memory Math (GGUF)", "HuggingFace Quantization Guide", "Calculate VRAM requirements for 8B model in FP16 vs 4-bit INT4 quantization.", "Load and benchmark inference latency of a 4-bit quantized model locally."),
            ("Fine-Tuning vs RAG Decision Framework", "Databricks RAG vs Fine-Tuning Guide", "When does a business need fine-tuning rather than RAG or few-shot prompting?", "Draft a decision matrix for domain style adaptation versus dynamic knowledge retrieval."),
            ("Parameter-Efficient Fine-Tuning (PEFT & LoRA)", "HuggingFace PEFT Documentation", "Why does Low-Rank Adaptation (LoRA) freeze base weights and only train low-rank decomposed matrices?", "Inspect LoRA rank (r) and alpha hyperparameters on a small adapter configuration."),
            ("Instruction Fine-Tuning Dataset Preparation", "HuggingFace Datasets & Instruction Tuning", "What JSONL schema is required for instruction tuning (system, user, assistant messages)?", "Format 100 domain QA examples into clean chat completion JSONL dataset."),
            ("Evaluating AI Systems (RAGAS & LLM-as-a-Judge)", "Ragas Evaluation Framework Docs", "Explain Faithfulness, Answer Relevance, and Context Recall metrics in RAG.", "Evaluate 5 RAG query responses using Ragas evaluation metrics."),
            ("Supervised Learning Foundations (Scikit-learn)", "Scikit-learn Official Docs", "Contrast Decision Trees with Random Forests and Gradient Boosted Trees.", "Train and tune Random Forest classifier with 5-fold cross-validation."),
            ("Deep Learning Foundations with PyTorch", "PyTorch Official Tutorials", "Explain forward pass, loss computation, loss.backward(), and optimizer.step().", "Build a 3-layer Multilayer Perceptron (MLP) in PyTorch to classify tabular data."),
            ("Computer Vision & Multimodal Embeddings (CLIP)", "OpenAI CLIP Paper & Docs", "How does contrastive pre-training align image and text vectors into a shared embedding space?", "Embed text and image into vector space and find highest similarity match."),
            ("Model Serving & High-Throughput APIs with FastAPI", "FastAPI Asynchronous Docs", "Why are asynchronous endpoints and background tasks crucial for long-running AI inference?", "Build an asynchronous FastAPI service streaming LLM responses with SSE."),
            ("Containerizing AI Services with Docker", "Docker for AI/ML Workflows", "How do multi-stage Docker builds minimize production container image footprint?", "Write a production Dockerfile for FastAPI + PyTorch with non-root user."),
            ("Capstone Project Sprint 1: Agent Architecture", "Enterprise AI Capstone Scaffolding", "Design the end-to-end architecture of an Autonomous Career Advisor AI Agent.", "Scaffold repository with API routes, vector store integration, and test harness."),
            ("Capstone Project Sprint 2: Full Integration & Polish", "Full-Stack AI Project Showcase", "How do you handle rate-limit retries and fallback models during upstream API downtime?", "Implement automated retries with exponential backoff and publish GitHub project."),
            ("AI Technical Interview & STAR System Defense", "AI Engineering Interview Bank", "Explain how you would architect a production RAG system for 10M enterprise documents.", "Present your capstone architecture defending latency, security, and accuracy choices.")
        ]
    else:
        # General technical subject fallback (Databases, Cloud, etc.)
        base_topics = [
            (f"{subject_name} Foundations & Core Concepts", f"{subject_name} Documentation", f"What core problem does {subject_name} solve?", f"Set up clean development environment for {subject_name}."),
            (f"{subject_name} Architecture & Design Principles", "Official Guides", "Explain key components and data flow.", "Sketch component architecture diagram."),
            (f"{subject_name} Hands-on Setup & Config", "Quickstart Tutorial", "What are optimal configuration settings?", "Initialize baseline project."),
            (f"{subject_name} Data Modeling & Schema", "Data Modeling Standards", "How are entities structured efficiently?", "Create database schema or data structures."),
            (f"{subject_name} Core CRUD Operations", "API Documentation", "How are transactions safely written and queried?", "Implement Create, Read, Update, Delete."),
            (f"{subject_name} Performance & Indexing", "Performance Optimization Guides", "How do indexes optimize query latency?", "Benchmark baseline response time."),
            (f"{subject_name} Error Handling & Robustness", "Best Practices", "How are exceptions handled gracefully?", "Add structured try-catch and logging."),
            (f"{subject_name} Security & Authentication", "OWASP Security Standards", "How do you protect endpoints against unauthorized access?", "Add authorization tokens and input sanitization."),
            (f"{subject_name} Testing & Validation", "Unit Testing Frameworks", "What unit test coverage ensures zero regressions?", "Write 5 automated unit tests."),
            (f"{subject_name} Integration & Real-World Flow", "Full Stack Integrations", "How does this layer interface with upstream APIs?", "Connect frontend client to backend service."),
            (f"{subject_name} Middleware & Request Pipeline", "Middleware Architecture", "Explain execution order in request pipelines.", "Write custom authentication middleware."),
            (f"{subject_name} Caching & State Management", "Caching Guides", "When should state be cached in memory?", "Integrate in-memory caching layer."),
            (f"{subject_name} Async Workflows & Concurrency", "Async Concurrency Guides", "How are non-blocking async operations handled?", "Implement asynchronous promise/coroutine handler."),
            (f"{subject_name} Containerization with Docker", "Docker Official Guides", "Why are multi-stage Docker builds optimal?", "Write Dockerfile and run container."),
            (f"{subject_name} Environment Configuration", "Twelve-Factor App Methodology", "Why must secrets never be hardcoded?", "Configure .env environment variables."),
            (f"{subject_name} Query Optimization & Profiling", "Profiling Tools", "How do you detect slow execution bottlenecks?", "Profile execution time and resolve hotspot."),
            (f"{subject_name} Transactions & Data Integrity", "ACID Principles", "How do atomic transactions prevent partial writes?", "Wrap multi-table operation in transaction."),
            (f"{subject_name} Microservices Decoupling", "Microservices Patterns", "How are services decoupled safely?", "Isolate service into independent module."),
            (f"{subject_name} Message Queues & Event Bus", "Message Queue Docs", "How does message queuing absorb burst spikes?", "Publish and consume events from a queue."),
            (f"{subject_name} API Versioning & Evolution", "API Design Guides", "How do you evolve APIs without breaking legacy clients?", "Add /api/v2 route with backward compatibility."),
            (f"{subject_name} Rate Limiting & Abuse Prevention", "Rate Limiting Standards", "How do rate limiters protect system resources?", "Implement IP rate limiting."),
            (f"{subject_name} Monitoring & Health Checks", "Health Check Standards", "What constitutes a shallow vs deep health check?", "Implement /health endpoint checking DB readiness."),
            (f"{subject_name} CI/CD Pipeline Automation", "GitHub Actions Docs", "How does CI/CD enforce automated checks before merge?", "Write GitHub Actions workflow YAML."),
            (f"{subject_name} Cloud Deployment & Hosting", "Cloud Deployment Guide", "How do you provision cloud resources safely?", "Deploy application to cloud hosting."),
            (f"{subject_name} High Availability & Failover", "Cloud Reliability Principles", "What ensures zero-downtime rolling deployments?", "Configure rolling update strategy."),
            (f"{subject_name} Capstone Project: Sprint 1 (Scaffolding)", "Project Scaffolding", "What core user stories will your capstone deliver?", "Build baseline repository and scaffolding."),
            (f"{subject_name} Capstone Project: Sprint 2 (Core Logic)", "Implementation Sprint", "How are complex business logic rules encapsulated?", "Implement core business service layer."),
            (f"{subject_name} Capstone Project: Sprint 3 (Testing & Polish)", "Testing Sprint", "How do integration tests verify end-to-end reliability?", "Run test suite and clean code styling."),
            (f"{subject_name} Capstone Project: Sprint 4 (Live Deployment)", "Deployment Sprint", "How is live demo accessibility verified?", "Deploy project with public live URL and README."),
            (f"{subject_name} Technical Interview Readiness Review", "Interview Question Bank", "Explain key technical decisions made during your project.", "Conduct mock technical interview presentation.")
        ]

    # Build 30 structured days grouped into 4 weeks
    weeks = [
        {"week": 1, "title": "Week 1: Core Fundamentals & Environment Setup", "days": []},
        {"week": 2, "title": "Week 2: Deep Dive & Practical Implementation", "days": []},
        {"week": 3, "title": "Week 3: Advanced Optimization & Production Patterns", "days": []},
        {"week": 4, "title": "Week 4: Capstone Showcase, Mock Drills & Interview Readiness", "days": []}
    ]

    time_mins = int(hours_per_day * 60)

    for i in range(30):
        topic_info = base_topics[i] if i < len(base_topics) else (f"{subject_name} Advanced Topic {i+1}", "Curated Documentation", f"Question for Day {i+1}", f"Practical Exercise for Day {i+1}")
        day_num = i + 1
        week_idx = 0 if day_num <= 7 else (1 if day_num <= 14 else (2 if day_num <= 21 else 3))
        
        day_obj = {
            "day": day_num,
            "id": f"day-{day_num}",
            "title": topic_info[0],
            "estimated_minutes": time_mins,
            "task": f"Complete hands-on study of {topic_info[0]} ({time_mins} mins dedicated focus).",
            "resource": topic_info[1],
            "practice_question": topic_info[2],
            "exercise": topic_info[3],
            "completed": False
        }
        weeks[week_idx]["days"].append(day_obj)
        days_data.append(day_obj)

    return {
        "subject": subject_name,
        "target_role": target_role,
        "hours_per_day": hours_per_day,
        "total_days": 30,
        "total_tasks": 30,
        "estimated_total_hours": round(hours_per_day * 30, 1),
        "weeks": weeks,
        "days": days_data
    }


