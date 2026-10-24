# 🎓 CareerAI – Smart Placement & Resume Analyzer

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.1-black?logo=flask)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.9-orange?logo=scikit-learn)](https://scikit-learn.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, full-stack AI platform built to help college students and early-career software engineers estimate campus placement probability, audit resume compatibility against modern Applicant Tracking Systems (ATS), identify skill gaps, and accelerate employability.

---

## 🎨 Visual Design & Theme (Inspired by Curated.Media)
- **Deep Obsidian Backdrop**: Rich `#070913` dark canvas with subtle radial light blooms.
- **Vibrant Accent Palette**: Electric Purple (`#8b5cf6`), Indigo (`#6366f1`), Radiant Pink (`#ec4899`), and Cyan (`#06b6d4`).
- **Glassmorphism Panels**: Frosted backdrop-blur panels with soft border illumination and glowing radial highlights.
- **Interactive Canvas Mesh**: Dynamic, responsive particle constellation field.
- **Animated SVG Visualizers**: Circular gauges with gradient progress strokes and HTML5 canvas 5-axis polar radar charts.

---

## 🚀 Key Features

### 1. 🎓 Student Placement Prediction Based on Marks
- **Dual ML Engine**: Baseline Logistic Regression (78.33% accuracy) compared against an ensemble Random Forest classifier (80.00% accuracy, 82.35% F1-score) trained on real collegiate student marks.
- **Multifaceted Inputs**: CGPA, 10th & 12th board percentages, programming skill badges, technical assessment score, aptitude score, communication rating, internships, projects count, certifications, and active backlogs.
- **Instant Testing Presets**:
  - 🌟 **High Achiever Profile** (CGPA 8.8, 86 Tech Score, 1 Internship)
  - ⚖️ **Balanced Profile** (CGPA 7.6, 68 Tech Score, 1 Internship)
  - ⚠️ **Needs Upskilling Profile** (CGPA 6.2, 52 Tech Score, 0 Internships, 1 Backlog)
- **Comprehensive Outputs**:
  - Circular probability gauge (`ScoreRing`)
  - 5-Axis Student Skill Radar Chart (`PerformanceRadar`)
  - Key strengths & areas for improvement
  - Tailored job tracks & recommended high-impact skills
  - Personalized 8-week structured action plan.

### 2. 📄 AI-Powered ATS Resume Verifier
- **Multi-Format Extraction**: Backend text parsing supporting both **PDF** (`PyMuPDF`) and **Word DOCX** (`python-docx`).
- **ATS Compatibility Score (0 - 100)**: Evaluates contact information, essential section presence (Education, Skills, Experience, Projects, Certifications), keyword alignment, quantifiable numerical metrics, and formatting cleanliness.
- **Job Vacancy Comparison**: Match against target career tracks (*Software Developer, Data Analyst, Data Scientist, ML Engineer, Full-Stack, Cloud, Cyber Security, Business Analyst*) or paste custom job descriptions.
- **Resume Quality Checklist**: Instant visual audit with pass/fail indicators.
- **Actionable Bullet Point Improvements**: Flags passive openers (`"Worked on"`, `"Responsible for"`) and suggests STAR-method metrics.
- **1-Click Sample Resume**: Built-in sample CS student resume for immediate testing without having to find a local file.

### 3. 🤖 AI Resume Improvement Assistant
- **Summary Rewriter**: 3 variations (*Impact-Driven*, *High-ATS Optimized*, *Fresher Growth Mindset*).
- **STAR Bullet Booster**: Converts plain responsibilities into quantifiable accomplishments.
- **Action Verb Library**: Categorized power verbs (*Engineering, Optimization, Leadership, Data, Collaboration*).
- **Interview Preparation Simulator**: Generates tailored technical and behavioral questions derived directly from the candidate's resume keywords.
- **Resume Headline Suggester**: Professional LinkedIn / resume header tags.

### 4. 💼 Personalized Job Recommendations
- Curated sample entry-level vacancies matching student profile CGPA cutoffs and skills.
- Direct comparison showing matched competencies vs missing requirements.

### 5. 🗺️ Skill Gap Analysis & 30-Day Learning Roadmap
- Categorized skill status: *Learned*, *In Progress*, and *Missing High-Priority Skills*.
- Interactive week-by-week curriculum with checkoffs persisted to the user profile.
- Practical fresher project recommendations.

### 6. 📊 Student Success Dashboard & Authentication
- Unified analytics overview, profile completeness widget, past prediction logs, and ATS history.
- Built-in **1-Click Demo Student Login** (`demo@careerai.com` / `demo123` - Alex Morgan) for instant testing.

---

## 🛠️ Project Structure

```
student-placement-prediction/
├── backend/
│   ├── app.py                     # Flask REST API server (port 5000)
│   ├── train_model.py             # ML training pipeline (LR & Random Forest)
│   ├── resume_analyzer.py         # PyMuPDF & python-docx ATS parser & scoring
│   ├── ai_assistant.py            # Summary, STAR bullet & interview generator
│   ├── database.py                # SQLite database manager & demo seeding
│   ├── requirements.txt           # Python library dependencies
│   ├── data/
│   │   ├── student_placement.csv  # 300-row placement benchmark dataset
│   │   └── careerai.db            # SQLite database
│   └── models/
│       └── placement_model.pkl    # Serialized model bundle & metrics
├── frontend/
│   ├── index.html                 # Google Fonts (Outfit & Inter) & metadata
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Curated dark theme tokens & keyframes
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx                # Main layout, router & global state
│       ├── index.css              # Glassmorphism panels & text gradients
│       ├── components/
│       │   ├── Navbar.jsx         # Glass header, nav items, status pill
│       │   ├── Footer.jsx         # Footer with tech stack & disclaimers
│       │   ├── ParticleBackground.jsx # Ambient constellation canvas
│       │   ├── ScoreRing.jsx      # Animated SVG circular gauge
│       │   ├── PerformanceRadar.jsx # HTML5 canvas 5-axis polar chart
│       │   ├── AuthModal.jsx      # Sign in, register & 1-click demo login
│       │   └── Toast.jsx          # Feedback notification pill
│       ├── pages/
│       │   ├── LandingPage.jsx    # Hero, 2 gateway cards, stats, FAQs
│       │   ├── PlacementPredictor.jsx # Interactive form, presets & ML results
│       │   ├── ResumeVerifier.jsx # Drag-and-drop parser & ATS audit
│       │   ├── AiAssistant.jsx    # AI summary, bullets & interview tools
│       │   ├── JobRecommendations.jsx # Job matches & eligibility
│       │   ├── SkillRoadmap.jsx   # 30-day interactive curriculum
│       │   └── Dashboard.jsx      # Student dashboard & persistent logs
│       └── services/
│           └── api.js             # Flask API client with offline fallback
├── run_all.bat                    # 1-Click Windows launch script
├── .env.example                   # Environment configuration template
└── README.md
```

---

## ⚡ Quick Start Instructions (Windows)

### Option 1: 1-Click Batch Launcher
Double-click `run_all.bat` in the project root. This opens both the Flask API server and the Vite React development server automatically in separate terminal windows.

### Option 2: Manual Terminal Execution

#### 1. Start the Flask Backend Server
```powershell
cd d:\downloads\student-placement-prediction\backend
python -m pip install -r requirements.txt
python app.py
```
*Backend API will be running on `http://127.0.0.1:5000`.*

#### 2. Start the Vite React Frontend
In a new terminal window:
```powershell
cd d:\downloads\student-placement-prediction\frontend
npm install
npm run dev
```
*Frontend will be live at `http://localhost:5173`.*

---

## 🧪 Retraining the Machine Learning Model
To train the models from scratch and regenerate the metrics:
```powershell
cd d:\downloads\student-placement-prediction\backend
python train_model.py
```
**Output Highlights:**
- **Random Forest Accuracy**: `80.00%` | Precision: `80.00%` | Recall: `84.85%` | F1: `82.35%`
- **Logistic Regression Accuracy**: `78.33%` | Precision: `77.78%` | Recall: `84.85%` | F1: `81.16%`

---

## 🔒 Security & Honest Disclosure
- **Statistical Guidance**: Prediction probabilities and ATS scores are algorithmic estimates calculated from sample collegiate benchmarks. They are intended for student career guidance and do not guarantee corporate hiring decisions.
- **Privacy First**: Uploaded resumes are processed in-memory / temporary files and are immediately purged after text parsing. Resumes are not shared with external third-party models without user configuration.
