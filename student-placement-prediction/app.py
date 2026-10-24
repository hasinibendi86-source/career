"""
app.py
-------
A simple Streamlit web application that lets a user enter a student's
academic details and predicts whether they are likely to be Placed
or Not Placed, using the Logistic Regression model trained in
train_model.py.

To run this app:
    streamlit run app.py
"""

import streamlit as st
import pandas as pd
import joblib
import os

# ---------- Page configuration ----------
st.set_page_config(
    page_title="Student Placement Prediction System",
    page_icon="🎓",
    layout="centered",
)


# ---------- Load the trained model ----------
# @st.cache_resource makes sure the model is loaded only once,
# not every time the user interacts with the app.
@st.cache_resource
def load_model():
    model_path = "placement_model.pkl"
    if not os.path.exists(model_path):
        return None
    model_data = joblib.load(model_path)
    return model_data


model_data = load_model()

# ---------- Title and description ----------
st.title("🎓 Student Placement Prediction System")
st.write(
    """
    This application uses a **Machine Learning (Logistic Regression)** model
    to predict whether a student is likely to be **Placed** or **Not Placed**,
    based on their academic performance, skill scores, and internship experience.

    Fill in the details below and click **Predict Placement** to see the result.
    """
)

# Stop early with a helpful message if the model file is missing
if model_data is None:
    st.error(
        "Model file 'placement_model.pkl' not found. "
        "Please run 'python train_model.py' first to train and save the model."
    )
    st.stop()

model = model_data["model"]
scaler = model_data["scaler"]
feature_columns = model_data["feature_columns"]

st.divider()

# ---------- Input fields ----------
st.subheader("📋 Enter Student Details")

col1, col2 = st.columns(2)

with col1:
    cgpa = st.number_input(
        "CGPA (0 - 10)", min_value=0.0, max_value=10.0, value=7.5, step=0.1
    )
    tenth = st.number_input(
        "10th Percentage (0 - 100)", min_value=0.0, max_value=100.0, value=75.0, step=0.5
    )
    twelfth = st.number_input(
        "12th Percentage (0 - 100)", min_value=0.0, max_value=100.0, value=70.0, step=0.5
    )
    technical = st.slider("Technical Skill Score (0 - 100)", 0, 100, 65)

with col2:
    aptitude = st.slider("Aptitude Score (0 - 100)", 0, 100, 60)
    communication = st.slider("Communication Score (0 - 100)", 0, 100, 65)
    internship_choice = st.radio("Internship Experience", ["Yes", "No"], horizontal=True)

# Convert Yes/No to 1/0, since the model was trained on numbers
internship = 1 if internship_choice == "Yes" else 0

st.divider()

# ---------- Prediction ----------
if st.button("🔮 Predict Placement", use_container_width=True):

    # Build a single-row DataFrame with the same column order used in training
    input_df = pd.DataFrame(
        [[cgpa, tenth, twelfth, technical, aptitude, communication, internship]],
        columns=feature_columns,
    )

    # Scale the input using the SAME scaler that was fit during training
    input_scaled = scaler.transform(input_df)

    # Get prediction (0 or 1) and probability
    prediction = model.predict(input_scaled)[0]
    probability = model.predict_proba(input_scaled)[0]  # [prob_not_placed, prob_placed]
    placed_probability = round(probability[1] * 100, 2)
    not_placed_probability = round(probability[0] * 100, 2)

    st.subheader("📊 Prediction Result")

    if prediction == 1:
        st.success(f"✅ Result: **Placed**")
        st.metric("Placement Probability", f"{placed_probability}%")
    else:
        st.error(f"❌ Result: **Not Placed**")
        st.metric("Placement Probability", f"{placed_probability}%")

    # Simple progress bar to visualize the probability
    st.progress(int(placed_probability))

    # ---------- Simple explanation ----------
    st.subheader("💡 Simple Explanation")

    explanation_points = []

    if cgpa >= 8:
        explanation_points.append("Your CGPA is strong, which positively impacts placement chances.")
    elif cgpa < 6.5:
        explanation_points.append("Your CGPA is relatively low, which may reduce placement chances.")

    if technical >= 70:
        explanation_points.append("Your Technical Skill Score is high, which is a strong positive factor.")
    elif technical < 50:
        explanation_points.append("Your Technical Skill Score is on the lower side; improving it can help.")

    if aptitude >= 70:
        explanation_points.append("A good Aptitude Score reflects strong problem-solving ability.")

    if communication >= 70:
        explanation_points.append("Good Communication Score improves your chances in interviews.")
    elif communication < 50:
        explanation_points.append("A lower Communication Score can sometimes affect interview rounds.")

    if internship == 1:
        explanation_points.append("Having internship experience gives you a practical advantage.")
    else:
        explanation_points.append("No internship experience may slightly lower your placement chances.")

    if not explanation_points:
        explanation_points.append(
            "Your overall profile is balanced across academics, skills, and experience."
        )

    for point in explanation_points:
        st.write(f"- {point}")

    st.caption(
        "Note: This prediction is based on a simple Logistic Regression model trained "
        "on sample data, and is meant for learning purposes only, not for real career decisions."
    )

st.divider()
st.caption("Built with Python, Scikit-learn, and Streamlit • Beginner ML Mini Project")
