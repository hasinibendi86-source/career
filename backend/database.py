"""
database.py
===========
SQLite database manager for CareerAI.
Stores users, prediction history, resume analyses, and skill roadmap progress.
Includes demo seed account.
"""

import sqlite3
import os
import json
import hashlib
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "careerai.db")

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        degree TEXT,
        department TEXT,
        cgpa REAL,
        target_role TEXT DEFAULT 'Software Developer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Prediction history table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        student_name TEXT,
        cgpa REAL,
        tenth_percentage REAL,
        twelfth_percentage REAL,
        technical_score REAL,
        aptitude_score REAL,
        communication_score REAL,
        internship INTEGER,
        prediction TEXT,
        probability REAL,
        full_result_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """)

    # Resume analyses table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resume_analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        filename TEXT NOT NULL,
        file_size INTEGER,
        target_role TEXT,
        ats_score INTEGER,
        summary TEXT,
        full_result_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """)

    # Skill roadmap progress
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS roadmap_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        target_role TEXT,
        completed_tasks_json TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """)

    # Seed Demo Student Account if not exists
    cursor.execute("SELECT id FROM users WHERE email = 'demo@careerai.com'")
    demo_user = cursor.fetchone()
    if not demo_user:
        demo_pass = hash_password("demo123")
        cursor.execute("""
            INSERT INTO users (email, password_hash, full_name, degree, department, cgpa, target_role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            "demo@careerai.com",
            demo_pass,
            "Alex Morgan (Sample Student)",
            "B.Tech Computer Science",
            "Computer Science & Engineering",
            8.4,
            "Software Developer"
        ))
        conn.commit()
        demo_id = cursor.lastrowid
        print(f"[DB] Initialized database and seeded demo user (ID: {demo_id})")
    else:
        conn.commit()

    conn.close()

def create_user(email, password, full_name, degree=None, department=None, cgpa=None, target_role='Software Developer'):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO users (email, password_hash, full_name, degree, department, cgpa, target_role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (email.lower().strip(), hash_password(password), full_name.strip(), degree, department, cgpa, target_role))
        conn.commit()
        user_id = cursor.lastrowid
        return {"id": user_id, "email": email, "full_name": full_name, "target_role": target_role}
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def authenticate_user(email, password):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
    user = cursor.fetchone()
    conn.close()
    if user and user["password_hash"] == hash_password(password):
        return {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "degree": user["degree"],
            "department": user["department"],
            "cgpa": user["cgpa"],
            "target_role": user["target_role"],
            "created_at": user["created_at"]
        }
    return None

def save_prediction(user_id, student_name, cgpa, tenth, twelfth, technical, aptitude, communication, internship, prediction, probability, full_result):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO predictions (user_id, student_name, cgpa, tenth_percentage, twelfth_percentage,
                                 technical_score, aptitude_score, communication_score, internship,
                                 prediction, probability, full_result_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id, student_name, cgpa, tenth, twelfth,
        technical, aptitude, communication, internship,
        prediction, probability, json.dumps(full_result)
    ))
    conn.commit()
    pred_id = cursor.lastrowid
    conn.close()
    return pred_id

def save_resume_analysis(user_id, filename, file_size, target_role, ats_score, summary, full_result):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO resume_analyses (user_id, filename, file_size, target_role, ats_score, summary, full_result_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id, filename, file_size, target_role, ats_score, summary, json.dumps(full_result)
    ))
    conn.commit()
    analysis_id = cursor.lastrowid
    conn.close()
    return analysis_id

def get_user_history(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, student_name, cgpa, technical_score, prediction, probability, created_at, full_result_json
        FROM predictions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    """, (user_id,))
    predictions_rows = cursor.fetchall()
    predictions = []
    for r in predictions_rows:
        pred_dict = dict(r)
        if pred_dict.get("full_result_json"):
            try:
                pred_dict["full_result"] = json.loads(pred_dict["full_result_json"])
            except Exception:
                pred_dict["full_result"] = {}
            del pred_dict["full_result_json"]
        predictions.append(pred_dict)

    cursor.execute("""
        SELECT id, filename, file_size, target_role, ats_score, summary, created_at, full_result_json
        FROM resume_analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    """, (user_id,))
    resumes_rows = cursor.fetchall()
    resumes = []
    for r in resumes_rows:
        res_dict = dict(r)
        if res_dict.get("full_result_json"):
            try:
                res_dict["full_result"] = json.loads(res_dict["full_result_json"])
            except Exception:
                res_dict["full_result"] = {}
            del res_dict["full_result_json"]
        resumes.append(res_dict)

    cursor.execute("SELECT * FROM roadmap_progress WHERE user_id = ?", (user_id,))
    roadmap_row = cursor.fetchone()
    roadmap = None
    if roadmap_row:
        roadmap = {
            "target_role": roadmap_row["target_role"],
            "completed_tasks": json.loads(roadmap_row["completed_tasks_json"] or "[]"),
            "updated_at": roadmap_row["updated_at"]
        }

    conn.close()
    return {
        "predictions": predictions,
        "resumes": resumes,
        "roadmap": roadmap
    }

def update_roadmap(user_id, target_role, completed_tasks):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO roadmap_progress (user_id, target_role, completed_tasks_json, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
            target_role = excluded.target_role,
            completed_tasks_json = excluded.completed_tasks_json,
            updated_at = CURRENT_TIMESTAMP
    """, (user_id, target_role, json.dumps(completed_tasks)))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialization complete.")
