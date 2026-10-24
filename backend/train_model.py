"""
train_model.py
==============
Trains and evaluates Machine Learning models for Student Placement Prediction:
1. Baseline: Logistic Regression
2. Comparison: Random Forest Classifier
Evaluates Accuracy, Precision, Recall, F1-Score, and Confusion Matrix.
Saves the trained models, scaler, and training metadata to models/placement_model.pkl.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report

def train_and_evaluate(data_path="data/student_placement.csv", output_dir="models"):
    print(f"[ML Pipeline] Loading dataset from: {data_path}")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    data = pd.read_csv(data_path)
    print(f"[ML Pipeline] Dataset shape: {data.shape[0]} rows, {data.shape[1]} columns")

    # Clean missing values
    missing_before = data.isnull().sum().sum()
    data = data.dropna()
    print(f"[ML Pipeline] Dropped {missing_before} missing values. Cleaned rows: {len(data)}")

    # Target & feature definition
    feature_columns = [
        "CGPA",
        "10th_Percentage",
        "12th_Percentage",
        "Technical_Score",
        "Aptitude_Score",
        "Communication_Score",
        "Internship"
    ]

    for col in feature_columns + ["Placement"]:
        if col not in data.columns:
            raise ValueError(f"Required column '{col}' is missing from dataset!")

    X = data[feature_columns]
    y = data["Placement"]

    # Train / Test split (80/20) with stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"[ML Pipeline] Split: {len(X_train)} training samples, {len(X_test)} testing samples")

    # Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 1. Baseline Model: Logistic Regression
    print("\n--- Training Model 1: Logistic Regression ---")
    lr_model = LogisticRegression(random_state=42, max_iter=1000)
    lr_model.fit(X_train_scaled, y_train)
    lr_preds = lr_model.predict(X_test_scaled)

    lr_acc = accuracy_score(y_test, lr_preds)
    lr_prec = precision_score(y_test, lr_preds, zero_division=0)
    lr_rec = recall_score(y_test, lr_preds, zero_division=0)
    lr_f1 = f1_score(y_test, lr_preds, zero_division=0)
    lr_cm = confusion_matrix(y_test, lr_preds).tolist()

    print(f"Logistic Regression Accuracy: {lr_acc*100:.2f}% | Precision: {lr_prec*100:.2f}% | Recall: {lr_rec*100:.2f}% | F1: {lr_f1*100:.2f}%")
    print(f"Confusion Matrix:\n{np.array(lr_cm)}")

    # 2. Comparison Model: Random Forest Classifier
    print("\n--- Training Model 2: Random Forest Classifier ---")
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    rf_model.fit(X_train, y_train)  # Random Forest on unscaled for tree splits
    rf_preds = rf_model.predict(X_test)

    rf_acc = accuracy_score(y_test, rf_preds)
    rf_prec = precision_score(y_test, rf_preds, zero_division=0)
    rf_rec = recall_score(y_test, rf_preds, zero_division=0)
    rf_f1 = f1_score(y_test, rf_preds, zero_division=0)
    rf_cm = confusion_matrix(y_test, rf_preds).tolist()

    print(f"Random Forest Accuracy:       {rf_acc*100:.2f}% | Precision: {rf_prec*100:.2f}% | Recall: {rf_rec*100:.2f}% | F1: {rf_f1*100:.2f}%")
    print(f"Confusion Matrix:\n{np.array(rf_cm)}")

    # Feature Importance from Random Forest
    rf_feature_importances = {
        col: round(float(imp), 4)
        for col, imp in zip(feature_columns, rf_model.feature_importances_)
    }

    # Logistic Regression feature coefficients
    lr_coefficients = {
        col: round(float(coef), 4)
        for col, coef in zip(feature_columns, lr_model.coef_[0])
    }

    # Choose primary model (default to Random Forest or Logistic Regression based on F1)
    best_model_name = "Random Forest" if rf_f1 >= lr_f1 else "Logistic Regression"
    print(f"\n[ML Pipeline] Primary model selected: {best_model_name}")

    os.makedirs(output_dir, exist_ok=True)
    save_path = os.path.join(output_dir, "placement_model.pkl")

    model_payload = {
        "primary_model_name": best_model_name,
        "lr_model": lr_model,
        "rf_model": rf_model,
        "scaler": scaler,
        "feature_columns": feature_columns,
        "metrics": {
            "logistic_regression": {
                "accuracy": round(lr_acc * 100, 2),
                "precision": round(lr_prec * 100, 2),
                "recall": round(lr_rec * 100, 2),
                "f1_score": round(lr_f1 * 100, 2),
                "confusion_matrix": lr_cm,
                "coefficients": lr_coefficients
            },
            "random_forest": {
                "accuracy": round(rf_acc * 100, 2),
                "precision": round(rf_prec * 100, 2),
                "recall": round(rf_rec * 100, 2),
                "f1_score": round(rf_f1 * 100, 2),
                "confusion_matrix": rf_cm,
                "feature_importances": rf_feature_importances
            }
        },
        "dataset_stats": {
            "total_samples": len(data),
            "placed_count": int(y.sum()),
            "unplaced_count": int(len(y) - y.sum()),
            "placement_rate": round(float(y.mean() * 100), 2)
        }
    }

    joblib.dump(model_payload, save_path)
    print(f"[ML Pipeline] Model bundle successfully saved to {save_path}")
    return model_payload

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_file = os.path.join(current_dir, "data", "student_placement.csv")
    out_dir = os.path.join(current_dir, "models")
    train_and_evaluate(data_file, out_dir)
