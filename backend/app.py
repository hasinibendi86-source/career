"""
app.py
======
Flask REST API for CareerAI – Smart Placement & Resume Analyzer.
Exposes endpoints for:
- /health
- /predict (Placement Prediction via ML pipeline)
- /analyze-resume (ATS Resume Verifier for PDF and DOCX)
- /match-job (Resume vs Job Description comparison)
- /improve-resume (AI summary and bullet point rewriter)
- /interview-prep (Interview question generator)
- /recommendations (Personalized job roles)
- /auth/register & /auth/login
- /history (User prediction and resume analysis history)
- /roadmap/update (30-day learning roadmap progress)
"""

import os
import sys
import tempfile
import joblib
import pandas as pd
import numpy as np
import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

import database
import resume_analyzer
import ai_assistant

app = Flask(__name__)
# Enable CORS for frontend dev and production servers
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
UPLOAD_MAX_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}

# Initialize database
database.init_db()

# Load Trained Model Pipeline
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "placement_model.pkl")
model_bundle = None

def get_model():
    global model_bundle
    if model_bundle is None:
        if os.path.exists(MODEL_PATH):
            try:
                model_bundle = joblib.load(MODEL_PATH)
                print(f"[Backend] Successfully loaded ML model bundle from {MODEL_PATH}")
            except Exception as e:
                print(f"[Backend Error] Failed to load model: {e}")
        else:
            print(f"[Backend Warning] Model file not found at {MODEL_PATH}. Attempting to train...")
            try:
                import train_model
                data_file = os.path.join(BASE_DIR, "data", "student_placement.csv")
                out_dir = os.path.join(BASE_DIR, "models")
                model_bundle = train_model.train_and_evaluate(data_file, out_dir)
            except Exception as train_err:
                print(f"[Backend Error] Auto-training failed: {train_err}")
    return model_bundle

# Pre-load model
get_model()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ==========================================
# 1. Health Endpoint
# ==========================================
@app.route("/health", methods=["GET"])
def health_check():
    bundle = get_model()
    is_loaded = bundle is not None
    primary_model = bundle.get("primary_model_name", "None") if is_loaded else "None"
    return jsonify({
        "status": "healthy",
        "service": "CareerAI Backend API",
        "version": "2.0.0",
        "ml_model_loaded": is_loaded,
        "primary_model": primary_model,
        "supported_upload_formats": ["pdf", "docx"]
    }), 200

# ==========================================
# 2. Placement Prediction Endpoint
# ==========================================
@app.route("/predict", methods=["POST"])
def predict_placement():
    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"error": "Invalid JSON payload"}), 400

    # Extract required inputs
    try:
        cgpa = float(data.get("cgpa", 7.5))
        tenth = float(data.get("tenth_percentage", 75.0))
        twelfth = float(data.get("twelfth_percentage", 70.0))
        technical = float(data.get("technical_score", 65.0))
        aptitude = float(data.get("aptitude_score", 60.0))
        communication = float(data.get("communication_score", 65.0))
        internship = 1 if int(data.get("internship", 0)) in [1, True] else 0

        # Optional qualitative fields
        student_name = data.get("student_name", "Student").strip()
        degree = data.get("degree", "B.Tech").strip()
        department = data.get("department", "Computer Science").strip()
        current_semester = data.get("current_semester", "7th Semester")
        num_projects = int(data.get("projects_count", 2))
        num_certifications = int(data.get("certifications_count", 1))
        backlogs = int(data.get("backlogs_count", 0))
        programming_languages = data.get("programming_languages", ["Python", "JavaScript"])
        user_id = data.get("user_id")
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid numerical inputs: {str(e)}"}), 400

    bundle = get_model()
    if not bundle:
        return jsonify({"error": "ML model is not available on server."}), 503

    scaler = bundle["scaler"]
    feature_cols = bundle["feature_columns"]
    rf_model = bundle.get("rf_model")
    lr_model = bundle.get("lr_model")
    metrics = bundle.get("metrics", {})

    # Construct feature frame matching exact training order
    input_df = pd.DataFrame([[
        cgpa, tenth, twelfth, technical, aptitude, communication, internship
    ]], columns=feature_cols)

    # Scale for Logistic Regression
    input_scaled = scaler.transform(input_df)

    # Logistic Regression inference
    lr_prob = float(lr_model.predict_proba(input_scaled)[0][1])

    # Random Forest inference (tree splits on unscaled values)
    rf_prob = float(rf_model.predict_proba(input_df)[0][1]) if rf_model else lr_prob

    # Weighted ensemble with slight adjustment for projects, certifications, and backlogs penalty
    composite_prob = (0.60 * rf_prob) + (0.40 * lr_prob)

    # Project and certification positive bonus (up to +5%)
    exp_bonus = min(0.06, (num_projects * 0.015) + (num_certifications * 0.01))
    composite_prob += exp_bonus

    # Backlogs penalty (-4% per active backlog)
    if backlogs > 0:
        backlog_penalty = min(0.20, backlogs * 0.04)
        composite_prob -= backlog_penalty

    # Clamp between 5% and 98%
    final_prob = max(5.0, min(98.0, round(composite_prob * 100, 1)))
    prediction_outcome = "Placement Likely" if final_prob >= 50.0 else "Needs Improvement"

    # Component Scores (0-100 normalized)
    academic_score = round(min(100.0, ((cgpa / 10.0) * 0.5 + (tenth / 100.0) * 0.25 + (twelfth / 100.0) * 0.25) * 100), 1)
    tech_score = round(technical, 1)
    comm_score = round(communication, 1)
    exp_score = min(100.0, (internship * 45) + (num_projects * 18) + (num_certifications * 12))

    # Identify strengths & areas for improvement
    strengths = []
    weaknesses = []

    if cgpa >= 8.0:
        strengths.append(f"Strong CGPA ({cgpa}/10.0) places you above standard campus eligibility cutoffs.")
    elif cgpa < 6.5:
        weaknesses.append(f"CGPA ({cgpa}) is close to cutoff thresholds (6.0 - 6.5). Focus on high technical scores to compensate.")

    if technical >= 75:
        strengths.append("High technical proficiency is your strongest competitive differentiator.")
    elif technical < 60:
        weaknesses.append("Technical test score is below average; practice core DSA and system design.")

    if aptitude >= 70:
        strengths.append("High aptitude score guarantees high clearing rates in initial screening rounds.")
    elif aptitude < 55:
        weaknesses.append("Aptitude score requires daily speed drills on quantitative reasoning and logic.")

    if communication >= 75:
        strengths.append("Strong communication rating will give you a decisive advantage in HR and managerial interviews.")
    elif communication < 60:
        weaknesses.append("Interview communication needs polish; practice mock interviews and STAR-method articulation.")

    if internship == 1:
        strengths.append("Hands-on internship experience demonstrates corporate readiness.")
    else:
        weaknesses.append("No recorded internship experience; build end-to-end deployed portfolio projects to stand out.")

    if backlogs > 0:
        weaknesses.append(f"Active backlogs ({backlogs}) may temporarily restrict eligibility in Tier-1 recruiters. Prioritize clearing them.")

    if not strengths:
        strengths.append("Well-rounded balanced foundation across academics and skill evaluations.")

    # Recommended skills and job roles
    role_suggestions = []
    recommended_skills = []

    if technical >= 70 and cgpa >= 7.0:
        role_suggestions.extend(["Full-Stack Software Engineer", "Backend Developer", "Cloud Solutions Associate"])
        recommended_skills.extend(["System Design", "Docker & Kubernetes", "Distributed Systems", "Redis"])
    elif aptitude >= 70:
        role_suggestions.extend(["Data Analyst", "Business Technology Consultant", "Product Analyst"])
        recommended_skills.extend(["Advanced SQL", "Tableau / Power BI", "Python for Data Analysis", "A/B Testing"])
    else:
        role_suggestions.extend(["Associate Software Developer", "QA Automation Engineer", "Technical Support Specialist"])
        recommended_skills.extend(["Data Structures & Algorithms", "Git & CI/CD", "REST API Development", "Unit Testing"])

    # Action plan steps
    action_plan = [
        {"phase": "Week 1 - 2", "goal": "DSA & Coding Drills", "task": "Solve 2 LeetCode Medium problems daily on Arrays, Hash Maps, and Trees."},
        {"phase": "Week 3 - 4", "goal": "Aptitude & Speed", "task": "Take 3 timed mock aptitude tests focusing on Time & Work, Permutations, and Syllogisms."},
        {"phase": "Week 5 - 6", "goal": "Full-Stack Project", "task": "Build and deploy 1 comprehensive full-stack project with clean documentation and live demo URL."},
        {"phase": "Week 7 - 8", "goal": "Mock Interviews", "task": "Conduct 2 mock technical and 2 behavioral interviews; refine STAR answer frameworks."}
    ]

    result_payload = {
        "student_name": student_name,
        "prediction": prediction_outcome,
        "probability": final_prob,
        "is_placed_likely": bool(final_prob >= 50.0),
        "component_scores": {
            "academic_score": academic_score,
            "technical_score": tech_score,
            "communication_score": comm_score,
            "experience_score": exp_score,
            "aptitude_score": aptitude
        },
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggested_roles": role_suggestions,
        "recommended_skills": recommended_skills,
        "action_plan": action_plan,
        "model_evaluation": {
            "primary_model": bundle.get("primary_model_name", "Random Forest"),
            "rf_accuracy": metrics.get("random_forest", {}).get("accuracy", 80.0),
            "lr_accuracy": metrics.get("logistic_regression", {}).get("accuracy", 78.33),
            "f1_score": metrics.get("random_forest", {}).get("f1_score", 82.35)
        },
        "disclaimer": "This prediction is generated by Scikit-learn statistical classification models trained on collegiate placement benchmarks. It is intended for employability guidance and does not guarantee employer hiring decisions."
    }

    # Save to database if user_id or demo
    if user_id:
        try:
            database.save_prediction(
                user_id, student_name, cgpa, tenth, twelfth, technical,
                aptitude, communication, internship, prediction_outcome, final_prob, result_payload
            )
        except Exception as e:
            print(f"[DB Save Prediction Error] {e}")

    return jsonify(result_payload), 200

# ==========================================
# 3. Resume ATS Verifier Endpoint
# ==========================================
@app.route("/analyze-resume", methods=["POST"])
def analyze_resume():
    json_data = request.get_json(silent=True) or {}
    target_role = request.form.get("target_role") or json_data.get("target_role") or "Software Developer"
    custom_jd = (request.form.get("job_description") or json_data.get("job_description") or "").strip()
    user_id = request.form.get("user_id") or json_data.get("user_id")

    extracted_text = ""
    filename = "pasted_resume.txt"
    file_size = 0

    # 1. File Upload Mode
    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            if not allowed_file(file.filename):
                return jsonify({"error": "Unsupported file format. Please upload a PDF or DOCX file."}), 400

            filename = secure_filename(file.filename)
            ext = os.path.splitext(filename)[1].lower()

            # Write to secure temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_f:
                file.save(temp_f.name)
                temp_path = temp_f.name

            try:
                file_size = os.path.getsize(temp_path)
                if file_size > UPLOAD_MAX_SIZE:
                    os.remove(temp_path)
                    return jsonify({"error": "File size exceeds 10MB limit."}), 400

                extracted_text = resume_analyzer.extract_text(temp_path)
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)

    # 2. Raw Text Mode (fallback / direct text)
    if not extracted_text:
        text_from_json = request.form.get("resume_text") or (request.get_json(silent=True) or {}).get("resume_text")
        if text_from_json and len(text_from_json.strip()) > 30:
            extracted_text = text_from_json
            file_size = len(extracted_text.encode('utf-8'))
            filename = "Pasted_Resume.txt"

    if not extracted_text or len(extracted_text.strip()) < 30:
        return jsonify({"error": "Please provide a valid PDF/DOCX file or paste your resume content with at least 30 characters."}), 400

    try:
        analysis_result = resume_analyzer.analyze_resume_text(
            extracted_text, filename=filename, target_role=target_role, custom_jd=custom_jd
        )
        analysis_result["file_size_bytes"] = file_size
        analysis_result["extracted_preview"] = extracted_text[:350] + ("..." if len(extracted_text) > 350 else "")

        # Save to database if user authenticated
        if user_id:
            try:
                database.save_resume_analysis(
                    int(user_id), filename, file_size, target_role,
                    analysis_result["ats_score"], analysis_result["score_rating"], analysis_result
                )
            except Exception as dberr:
                print(f"[DB Save Resume Error] {dberr}")

        return jsonify(analysis_result), 200
    except Exception as e:
        return jsonify({"error": f"Failed to analyze resume: {str(e)}"}), 500

# ==========================================
# 4. Job Match / Comparison Endpoint
# ==========================================
@app.route("/match-job", methods=["POST"])
def match_job():
    data = request.get_json(force=True) or {}
    resume_text = data.get("resume_text", "")
    job_description = data.get("job_description", "")
    target_role = data.get("target_role", "Software Developer")

    if not job_description or len(job_description.strip()) < 20:
        return jsonify({"error": "Please provide a meaningful job description of at least 20 characters."}), 400

    kw_res = resume_analyzer.analyze_keywords(resume_text, target_role=target_role, custom_jd=job_description)
    return jsonify({
        "target_role": target_role,
        "match_percentage": kw_res["match_percentage"],
        "matched_skills": kw_res["matched_keywords"],
        "missing_skills": kw_res["missing_keywords"],
        "total_analyzed": kw_res["total_expected"]
    }), 200

# ==========================================
# 5. AI Resume Improvement Endpoint
# ==========================================
@app.route("/improve-resume", methods=["POST"])
def improve_resume():
    data = request.get_json(force=True) or {}
    action = data.get("action", "rewrite_summary")
    target_role = data.get("target_role", "Software Developer")
    skills = data.get("skills", [])

    if action == "rewrite_summary":
        summary = data.get("summary", "")
        res = ai_assistant.rewrite_summary(summary, target_role=target_role, skills=skills)
        return jsonify(res), 200

    elif action == "improve_bullet":
        bullet = data.get("bullet", "")
        if not bullet:
            return jsonify({"error": "Bullet point text is required."}), 400
        res = ai_assistant.improve_bullet_point(bullet, target_role=target_role)
        return jsonify(res), 200

    elif action == "action_verbs":
        return jsonify({"categories": ai_assistant.ACTION_VERB_TAXONOMY}), 200

    elif action == "headline_suggestions":
        headlines = ai_assistant.generate_headline_suggestions(target_role=target_role, skills=skills)
        return jsonify({"headlines": headlines}), 200

    return jsonify({"error": f"Unknown action: {action}"}), 400

# ==========================================
# 5b. AI Resume Re-Generator Endpoint
# ==========================================
@app.route("/regenerate-resume", methods=["POST"])
def regenerate_resume():
    data = request.get_json(force=True) or {}
    raw_resume = data.get("resume_text") or data.get("raw_resume") or ""
    target_role = data.get("target_role", "Software Developer")
    custom_jd = data.get("job_description", "")
    candidate_info = {
        "student_name": data.get("student_name") or data.get("name", ""),
        "name": data.get("student_name") or data.get("name", ""),
        "degree": data.get("degree", ""),
        "cgpa": data.get("cgpa", ""),
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "linkedin": data.get("linkedin", ""),
        "github": data.get("github", ""),
        "headline": data.get("headline", ""),
        "skills": data.get("skills", []),
        "template_id": data.get("template_id", "classic_ats")
    }
    res = ai_assistant.regenerate_full_resume(
        raw_resume=raw_resume,
        target_role=target_role,
        custom_jd=custom_jd,
        candidate_info=candidate_info,
        template_id=data.get("template_id", "classic_ats")
    )
    return jsonify(res), 200

# ==========================================
# 5c. AI Resume Selection Editor Endpoint
# ==========================================
@app.route("/improve-selection", methods=["POST"])
def improve_selection():
    data = request.get_json(force=True) or {}
    selected_text = data.get("selected_text", "")
    target_role = data.get("target_role", "Software Developer")
    instruction = data.get("instruction", "Improve wording and grammar")
    
    if not selected_text or not selected_text.strip():
        return jsonify({"error": "No text provided to improve."}), 400

    result = ai_assistant.improve_resume_selection(
        selected_text=selected_text,
        target_role=target_role,
        instruction=instruction
    )
    return jsonify(result), 200

# ==========================================
# 5d. ATS Resume PDF Generation Endpoint (Clean Single-Column Format)
# ==========================================
def generate_ats_resume_pdf(resume_text, candidate_details=None, template_id="classic_ats"):
    import pymupdf as fitz
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)  # Standard Letter 8.5 x 11 in
    
    left_m = 36
    right_m = 576
    y = 42

    details = candidate_details or {}
    name = (details.get("name") or "CANDIDATE NAME").strip()
    role = (details.get("targetRole") or details.get("role") or details.get("target_role") or "PROFESSIONAL").strip()
    email = details.get("email") or ""
    phone = details.get("phone") or ""
    linkedin = details.get("linkedin") or ""
    github = details.get("github") or ""
    location = details.get("location") or "India"

    # 1. Header (Matching ATS Resume Template: Name uppercase bold 18pt, Title uppercase 10pt, Contact line with pipes)
    page.insert_text((left_m, y), name.upper(), fontsize=18, fontname="helv", color=(0.05, 0.05, 0.05))
    y += 18
    page.insert_text((left_m, y), role.upper(), fontsize=10, fontname="helv", color=(0.15, 0.15, 0.15))
    y += 14

    contact_parts = []
    if location: contact_parts.append(location)
    if phone: contact_parts.append(phone)
    if email: contact_parts.append(email)
    if linkedin: contact_parts.append(linkedin)
    if github: contact_parts.append(github)
    
    contact_str = " | ".join(contact_parts) if contact_parts else "Email: candidate@example.com | Phone: +91 90000 00000"
    page.insert_text((left_m, y), contact_str, fontsize=8.5, fontname="helv", color=(0.25, 0.25, 0.25))
    y += 8

    # Heavy divider rule matching standard ATS format
    page.draw_line((left_m, y), (right_m, y), color=(0.1, 0.1, 0.1), width=1.0)
    y += 16

    raw_lines = (resume_text or "").split("\n")
    if not any(l.strip() for l in raw_lines):
        raw_lines = [
            "PROFESSIONAL SUMMARY",
            f"Ambitious and analytical {role} with proven hands-on technical proficiency in designing scalable software solutions, optimizing database architectures, and collaborating in fast-paced engineering sprints.",
            "",
            "CORE COMPETENCIES / KEY SKILLS",
            "- Languages: Python, JavaScript, Java, SQL, C++",
            "- Frameworks & Web: React, Node.js, FastAPI, Express, Tailwind CSS",
            "- Tools & Cloud: Git, GitHub, Docker, Linux, RESTful APIs, CI/CD",
            "- Core Fundamentals: Data Structures, Object-Oriented Design, Database Optimization",
            "",
            "PROFESSIONAL EXPERIENCE",
            f"Software Engineering Trainee / Intern | Nexus Cloud Systems (Jan 2024 – June 2024)",
            "- Architected and deployed 4 RESTful microservices with Python and Docker serving 45,000+ daily API requests.",
            "- Optimized relational SQL queries and database indexes, decreasing average latency by 32%.",
            "- Collaborated in a 5-member Agile engineering team using Git and automated testing pipelines.",
            "",
            "FEATURED TECHNICAL PROJECTS",
            "Full-Stack E-Commerce Platform with Microservices (React, Node.js, PostgreSQL)",
            "- Engineered responsive client-side UI with JWT authentication and secure payment gateway.",
            "- Integrated Redis caching layer, boosting peak throughput and reducing query response times by 40%.",
            "Automated ATS Resume Analyzer & Parser (Python, Flask, NLP)",
            "- Built parsing algorithms to benchmark candidate resumes against target role keywords and ATS formats.",
            "",
            "EDUCATION",
            "Bachelor of Technology in Computer Science & Engineering (Class of 2025)",
            "University Institute of Technology — CGPA: 8.4 / 10.0",
            "",
            "CERTIFICATIONS",
            "- AWS Certified Cloud Practitioner",
            "- HackerRank Problem Solving (5-Star Verified)"
        ]

    for raw in raw_lines:
        line = raw.strip()
        if not line:
            y += 5
            continue

        clean_upper = line.upper().lstrip("# -*•").strip()
        is_section_header = (
            clean_upper in [
                "PROFESSIONAL SUMMARY", "SUMMARY", "CORE COMPETENCIES", "CORE COMPETENCIES / KEY SKILLS",
                "KEY SKILLS", "TECHNICAL SKILLS", "SKILLS", "PROFESSIONAL EXPERIENCE", "WORK EXPERIENCE",
                "EXPERIENCE", "PROJECTS", "FEATURED PROJECTS", "FEATURED TECHNICAL PROJECTS",
                "EDUCATION", "CERTIFICATIONS", "ACADEMIC BACKGROUND"
            ] or (
                len(clean_upper) < 36 and any(clean_upper.startswith(h) for h in [
                    "PROFESSIONAL SUMMARY", "SUMMARY", "EDUCATION", "TECHNICAL SKILLS", "SKILLS",
                    "WORK EXPERIENCE", "EXPERIENCE", "PROJECTS", "CERTIFICATIONS"
                ])
            )
        )

        if is_section_header:
            y += 8
            if y > 730:
                page = doc.new_page(width=612, height=792)
                y = 42
            page.insert_text((left_m, y), clean_upper, fontsize=10.5, fontname="helv", color=(0.05, 0.05, 0.05))
            y += 3
            page.draw_line((left_m, y), (right_m, y), color=(0.7, 0.7, 0.7), width=0.5)
            y += 13
        elif line.startswith(("-", "•", "*")):
            bullet_content = line.lstrip("-•* \t").strip()
            if y > 745:
                page = doc.new_page(width=612, height=792)
                y = 42
            page.insert_text((left_m + 3, y + 8), "•", fontsize=10, fontname="helv", color=(0.1, 0.1, 0.1))
            tb_rect = fitz.Rect(left_m + 14, y, right_m, y + 42)
            page.insert_textbox(tb_rect, bullet_content, fontsize=9, fontname="helv", color=(0.12, 0.12, 0.12))
            lines_est = max(1, len(bullet_content) // 95 + 1)
            y += lines_est * 12 + 3
        else:
            if y > 745:
                page = doc.new_page(width=612, height=792)
                y = 42
            is_subhdr = any(kw in line.lower() for kw in ["bachelor", "master", "intern", "developer", "engineer", "lead", "analyst", "university", "college", "202", "201", "cgpa"]) and len(line) < 120
            font_size = 9.5 if is_subhdr else 9
            font_color = (0.05, 0.05, 0.05) if is_subhdr else (0.15, 0.15, 0.15)
            
            tb_rect = fitz.Rect(left_m, y, right_m, y + 60)
            page.insert_textbox(tb_rect, line, fontsize=font_size, fontname="helv", color=font_color)
            lines_est = max(1, len(line) // 100 + 1)
            y += lines_est * 12 + (3 if is_subhdr else 2)

    return doc.tobytes()

@app.route("/download-resume-pdf", methods=["POST"])
def download_resume_pdf():
    try:
        data = request.get_json(force=True) or {}
        resume_text = data.get("resume_text", "")
        candidate_details = data.get("candidate_details", {})
        template_id = data.get("template_id", "classic_ats")

        pdf_bytes = generate_ats_resume_pdf(
            resume_text=resume_text,
            candidate_details=candidate_details,
            template_id=template_id
        )

        name_clean = (candidate_details.get("name") or "ATS_Resume").replace(" ", "_")
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"{name_clean}_Resume.pdf"
        )
    except Exception as e:
        print(f"[PDF Generation Error] {e}")
        return jsonify({"error": f"Failed to generate ATS PDF: {str(e)}"}), 500

# ==========================================
# 5e. Core Subjects & 30-Day Subject Roadmap Endpoints
# ==========================================
@app.route("/core-subjects", methods=["GET"])
def get_core_subjects():
    role = request.args.get("role", "Software Developer")
    subjects = ai_assistant.CORE_SUBJECTS_CATALOG.get(role, ai_assistant.CORE_SUBJECTS_CATALOG.get("Software Developer", []))
    return jsonify({"target_role": role, "subjects": subjects}), 200

@app.route("/generate-subject-roadmap", methods=["POST"])
def generate_subject_roadmap():
    data = request.get_json(force=True) or {}
    subject = data.get("subject", "Data Structures & Algorithms")
    hours_per_day = float(data.get("hours_per_day", 1.5))
    target_role = data.get("target_role", "Software Developer")

    roadmap_data = ai_assistant.generate_subject_30day_roadmap(
        subject_name=subject,
        hours_per_day=hours_per_day,
        target_role=target_role
    )
    return jsonify(roadmap_data), 200

# ==========================================
# 5e. Recommend Job Roles from Resume
# ==========================================
@app.route("/recommend-roles-from-resume", methods=["POST"])
def recommend_roles_from_resume():
    data = request.get_json(force=True) or {}
    text = data.get("resume_text", "")
    if not text or len(text.strip()) < 30:
        return jsonify({"error": "Please provide resume content with at least 30 characters."}), 400
    roles = resume_analyzer.recommend_job_roles_from_resume(text)
    return jsonify({"recommended_roles": roles}), 200

# ==========================================
# 6. Interview Preparation Endpoint
# ==========================================
@app.route("/interview-prep", methods=["POST"])
def interview_prep():
    data = request.get_json(force=True) or {}
    resume_text = data.get("resume_text", "")
    target_role = data.get("target_role", "Software Developer")
    questions = ai_assistant.generate_interview_questions(resume_text=resume_text, target_role=target_role)
    return jsonify(questions), 200

# ==========================================
# 7. Job Recommendations Endpoint
# ==========================================
@app.route("/recommendations", methods=["GET"])
def get_recommendations():
    role = request.args.get("role", "Software Developer")
    cgpa = float(request.args.get("cgpa", 7.5))

    jobs_catalog = [
        {
            "id": "job-1",
            "title": "Graduate Software Engineer (Full-Stack)",
            "company": "Nexus Technologies",
            "location": "Bengaluru / Remote",
            "type": "Full-Time",
            "salary_range": "₹8.5 LPA – ₹14 LPA",
            "min_cgpa": 7.0,
            "experience_level": "Fresh Graduate / 0-1 yr",
            "required_skills": ["Python", "React", "SQL", "Git", "REST APIs"],
            "description": "Develop client-facing web applications and microservices in an agile team.",
            "verified_posting": True,
            "is_sample": True
        },
        {
            "id": "job-2",
            "title": "Junior Data Analyst",
            "company": "Quantix Global Analytics",
            "location": "Hyderabad / Hybrid",
            "type": "Full-Time",
            "salary_range": "₹6.5 LPA – ₹10 LPA",
            "min_cgpa": 6.5,
            "experience_level": "Fresh Graduate / 0-2 yrs",
            "required_skills": ["SQL", "Power BI", "Excel", "Python", "Data Visualization"],
            "description": "Design KPI executive dashboards and conduct automated ETL analytics pipelines.",
            "verified_posting": True,
            "is_sample": True
        },
        {
            "id": "job-3",
            "title": "Associate AI / ML Engineer",
            "company": "Cognitive Cloud Labs",
            "location": "Pune / Remote",
            "type": "Full-Time",
            "salary_range": "₹10 LPA – ₹16 LPA",
            "min_cgpa": 7.5,
            "experience_level": "Entry Level (0-1 yr)",
            "required_skills": ["Python", "PyTorch", "Scikit-Learn", "FastAPI", "Docker"],
            "description": "Deploy machine learning classification and inference APIs on cloud infrastructure.",
            "verified_posting": True,
            "is_sample": True
        },
        {
            "id": "job-4",
            "title": "Cloud DevOps Trainee",
            "company": "Aura Cloud Systems",
            "location": "Chennai / On-Site",
            "type": "Full-Time",
            "salary_range": "₹7 LPA – ₹11.5 LPA",
            "min_cgpa": 6.8,
            "experience_level": "Fresh Graduate",
            "required_skills": ["AWS", "Docker", "Linux", "CI/CD", "Terraform"],
            "description": "Assist in automated container orchestration and cloud networking setup.",
            "verified_posting": True,
            "is_sample": True
        },
        {
            "id": "job-5",
            "title": "Junior Cyber Security Analyst",
            "company": "ShieldSec Operations",
            "location": "Delhi NCR / Hybrid",
            "type": "Full-Time",
            "salary_range": "₹7.5 LPA – ₹12 LPA",
            "min_cgpa": 6.5,
            "experience_level": "Entry Level",
            "required_skills": ["Network Security", "Wireshark", "Linux", "Python", "Vulnerability Assessment"],
            "description": "Monitor security event logs, analyze traffic anomalies, and prepare risk assessments.",
            "verified_posting": True,
            "is_sample": True
        },
        {
            "id": "job-6",
            "title": "Business Technology Analyst",
            "company": "Apex Advisory Partners",
            "location": "Mumbai / On-site",
            "type": "Full-Time",
            "salary_range": "₹8 LPA – ₹13 LPA",
            "min_cgpa": 7.0,
            "experience_level": "Fresh Graduate",
            "required_skills": ["Agile", "SQL", "Excel", "User Stories", "Stakeholder Management"],
            "description": "Bridge business user requirements with tech engineering deliverables.",
            "verified_posting": True,
            "is_sample": True
        }
    ]

    # Calculate match scores
    results = []
    for job in jobs_catalog:
        eligibility_met = cgpa >= job["min_cgpa"]
        # Basic match heuristic
        match_score = 85 if eligibility_met else 55
        if role.lower() in job["title"].lower():
            match_score = min(96, match_score + 10)

        results.append({
            **job,
            "is_eligible": eligibility_met,
            "match_percentage": match_score
        })

    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return jsonify({
        "filter_role": role,
        "sample_jobs_notice": "Note: Listings displayed are curated sample opportunities for campus benchmark simulation.",
        "jobs": results
    }), 200

# ==========================================
# 8. Authentication & Profile Endpoints
# ==========================================
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json(force=True) or {}
    email = data.get("email", "").strip()
    password = data.get("password", "")
    full_name = data.get("full_name", "").strip()

    if not email or not password or not full_name:
        return jsonify({"error": "Full name, email, and password are required."}), 400

    user = database.create_user(
        email, password, full_name,
        degree=data.get("degree"),
        department=data.get("department"),
        cgpa=data.get("cgpa"),
        target_role=data.get("target_role", "Software Developer")
    )
    if not user:
        return jsonify({"error": "An account with this email address already exists."}), 409

    return jsonify({"message": "Registration successful", "user": user}), 201

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json(force=True) or {}
    email = data.get("email", "").strip()
    password = data.get("password", "")

    user = database.authenticate_user(email, password)
    if not user:
        return jsonify({"error": "Invalid email or password."}), 401

    return jsonify({
        "message": "Login successful",
        "user": user,
        "token": f"careerai_jwt_{user['id']}_{int(pd.Timestamp.now().timestamp())}"
    }), 200

# ==========================================
# 9. User History & Dashboard
# ==========================================
@app.route("/history", methods=["GET"])
def get_history():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "User ID parameter required"}), 400

    history = database.get_user_history(user_id)
    return jsonify(history), 200

# ==========================================
# 10. Roadmap Update Endpoint
# ==========================================
@app.route("/roadmap/update", methods=["POST"])
def update_roadmap():
    data = request.get_json(force=True) or {}
    user_id = data.get("user_id", 1)
    target_role = data.get("target_role", "Software Developer")
    completed_tasks = data.get("completed_tasks", [])

    database.update_roadmap(user_id, target_role, completed_tasks)
    return jsonify({"message": "Roadmap progress synchronized successfully."}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"\n==========================================================")
    print(f" CareerAI Backend REST API Server is running on port {port}")
    print(f" Endpoints: /health, /predict, /analyze-resume, /recommendations")
    print(f"==========================================================\n")
    app.run(host="127.0.0.1", port=port, debug=False)
