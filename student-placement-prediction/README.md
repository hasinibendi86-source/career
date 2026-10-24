# 🎓 Student Placement Prediction System Using Machine Learning

A beginner-friendly Machine Learning mini project that predicts whether a
student is likely to be **Placed** or **Not Placed** based on their
academic performance, skill scores, and internship experience.

---

## 📌 Problem Statement

Every year, colleges want to understand which students are likely to get
placed in campus recruitment drives, so that they can guide students early
and offer extra support (training, mock interviews, etc.) to those who need
it. Manually judging this is difficult and subjective. This project builds
a Machine Learning model that predicts placement outcomes using measurable
data like CGPA, percentages, and skill scores.

## 🎯 Objective

- Build a Logistic Regression model that predicts placement (Placed / Not Placed).
- Provide a probability score showing how confident the model is.
- Create a simple, interactive Streamlit web app so anyone can enter a
  student's details and instantly see the prediction.

## ✨ Features

- Clean, simple Streamlit user interface
- Predicts Placed / Not Placed with a probability percentage
- Gives a simple, human-readable explanation of the result
- Trained on a sample dataset of 300 student records
- Model and scaler saved using `joblib` for reuse

## 🛠️ Technologies Used

- **Python 3** — programming language
- **Pandas** — data loading and manipulation
- **NumPy** — numerical operations
- **Scikit-learn** — machine learning (Logistic Regression, scaling, metrics)
- **Streamlit** — web application interface
- **Joblib** — saving/loading the trained model

## 🤖 ML Algorithm — Logistic Regression

Logistic Regression is used because:
- The problem is a **binary classification** problem (Placed = 1, Not Placed = 0).
- It is simple, fast, and easy to understand — ideal for beginners.
- It gives not just a Yes/No answer, but also a **probability**, which is
  perfect for showing "placement chances" in the app.

## 📊 Dataset Description

File: `student_placement.csv` (300 sample student records)

| Column                | Description                                  | Type            |
|------------------------|----------------------------------------------|-----------------|
| CGPA                  | Student's overall CGPA (0–10)                | Numeric         |
| 10th_Percentage       | 10th grade marks (%)                          | Numeric         |
| 12th_Percentage       | 12th grade marks (%)                          | Numeric         |
| Technical_Score       | Technical skill score (0–100)                 | Numeric         |
| Aptitude_Score        | Aptitude test score (0–100)                   | Numeric         |
| Communication_Score   | Communication skill score (0–100)             | Numeric         |
| Internship            | 0 = No Internship, 1 = Internship             | Binary (0/1)    |
| Placement             | 0 = Not Placed, 1 = Placed (target column)    | Binary (0/1)    |

> The dataset was generated synthetically for learning purposes, with
> realistic relationships between the features and placement outcome
> (higher CGPA, skill scores, and internship experience increase the
> chance of placement), plus some random noise so it behaves like
> real-world data.

## ⚙️ How the ML Model Works

1. **Input features** (CGPA, percentages, scores, internship) are read from the CSV file.
2. **Feature scaling** is applied using `StandardScaler` so all values are on a comparable scale.
3. **Logistic Regression** learns the relationship between these features and the `Placement` column.
4. The model calculates a **probability** between 0 and 1 for each student, using the logistic (sigmoid) function.
5. If the probability is greater than 0.5, the model predicts **Placed (1)**; otherwise **Not Placed (0)**.

## 📁 Project Structure

```text
student-placement-prediction/
│
├── student_placement.csv   # Sample dataset (300 records)
├── train_model.py          # Script to train and save the ML model
├── app.py                  # Streamlit web application
├── placement_model.pkl     # Saved trained model + scaler (created after training)
├── requirements.txt        # Required Python libraries
└── README.md                # Project documentation
```

---

## 💻 Installation Steps

1. **Install Python** (3.8 or above) from [python.org](https://www.python.org/) if not already installed.

2. **Open Command Prompt / VS Code terminal** and navigate to the project folder:
   ```bash
   cd student-placement-prediction
   ```

3. **(Optional but recommended) Create a virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate      # On Windows
   ```

4. **Install the required libraries:**
   ```bash
   pip install -r requirements.txt
   ```

---

## 🏋️ How to Train the Model

Run the training script. This reads `student_placement.csv`, trains the
Logistic Regression model, prints the accuracy, and saves
`placement_model.pkl`.

```bash
python train_model.py
```

You should see output similar to:
```
Model Accuracy: 90.00%
Model saved successfully as 'placement_model.pkl'
```

---

## 🚀 How to Run the Streamlit Application

Once the model is trained (i.e., `placement_model.pkl` exists in the folder), run:

```bash
streamlit run app.py
```

This will open the app automatically in your web browser
(usually at `http://localhost:8501`).

---

## 🧪 Example Input and Output

**Example Input:**
| Field                | Value |
|-----------------------|-------|
| CGPA                  | 8.2   |
| 10th Percentage       | 85    |
| 12th Percentage       | 80    |
| Technical Score       | 75    |
| Aptitude Score        | 70    |
| Communication Score   | 68    |
| Internship             | Yes   |

**Example Output:**
```
Result: Placed
Placement Probability: 96.5%

Explanation:
- Your CGPA is strong, which positively impacts placement chances.
- Your Technical Skill Score is high, which is a strong positive factor.
- Having internship experience gives you a practical advantage.
```

---

## 🔮 Future Enhancements

- Use a larger, real-world placement dataset for better accuracy.
- Try other algorithms (Random Forest, XGBoost) and compare performance.
- Add more features like number of backlogs, extracurricular activities, or certifications.
- Deploy the app online (Streamlit Community Cloud / Render / Heroku).
- Add a feature importance chart to show which factors matter most.
- Store user predictions in a database for tracking and analytics.

---

## 👨‍🎓 Note

This is a beginner-friendly educational mini project. The dataset is
synthetically generated, and the model is meant for learning ML concepts
(data preprocessing, training, evaluation, and deployment with Streamlit) —
not for making real placement decisions.
