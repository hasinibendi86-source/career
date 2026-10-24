"""
train_model.py
----------------
This script trains a Logistic Regression model to predict whether a
student will be Placed or Not Placed, based on their academic and
skill-related data.

Steps performed:
1. Load the dataset (student_placement.csv)
2. Clean and preprocess the data
3. Split data into training and testing sets
4. Train a Logistic Regression model
5. Test the model and print accuracy
6. Save the trained model (and the scaler) using joblib
"""

# ---------- 1. Import required libraries ----------
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import joblib


# ---------- 2. Load the dataset ----------
print("Loading dataset...")
data = pd.read_csv("student_placement.csv")

print("First 5 rows of the dataset:")
print(data.head())
print("\nDataset shape (rows, columns):", data.shape)


# ---------- 3. Clean and preprocess the data ----------
# Check for missing values and remove them if any exist
print("\nMissing values in each column:")
print(data.isnull().sum())
data = data.dropna()  # simple beginner-friendly way to handle missing data

# Note: In this dataset, "Internship" and "Placement" are already
# stored as 0/1 numbers, so there is no need to convert Yes/No text.
# If your own dataset has "Yes"/"No" text instead, you can convert it like this:
# data["Internship"] = data["Internship"].map({"Yes": 1, "No": 0})


# ---------- 4. Split features (X) and target (y) ----------
# Features = the input columns used to make the prediction
# Target   = the column we want to predict (Placement)
feature_columns = [
    "CGPA",
    "10th_Percentage",
    "12th_Percentage",
    "Technical_Score",
    "Aptitude_Score",
    "Communication_Score",
    "Internship",
]

X = data[feature_columns]
y = data["Placement"]

# ---------- 5. Split the dataset into training and testing data ----------
# 80% of the data is used for training, 20% is used for testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")


# ---------- 6. Feature Scaling ----------
# Logistic Regression works best when all features are on a similar scale.
# StandardScaler converts each feature to have mean=0 and standard deviation=1.
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


# ---------- 7. Train the Logistic Regression model ----------
print("\nTraining the Logistic Regression model...")
model = LogisticRegression()
model.fit(X_train_scaled, y_train)


# ---------- 8. Test the model ----------
y_pred = model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# ---------- 9. Save the trained model and scaler ----------
# We save both the model and the scaler together in one file so that
# app.py can use the exact same scaling that was used during training.
model_data = {
    "model": model,
    "scaler": scaler,
    "feature_columns": feature_columns,
}

joblib.dump(model_data, "placement_model.pkl")
print("\nModel saved successfully as 'placement_model.pkl'")


# ---------- 10. Simple prediction function (for testing/demo purposes) ----------
def predict_placement(cgpa, tenth, twelfth, technical, aptitude, communication, internship):
    """
    Takes raw student details and returns:
    - prediction: 'Placed' or 'Not Placed'
    - probability: chance of being placed (in %)
    """
    input_data = pd.DataFrame(
        [[cgpa, tenth, twelfth, technical, aptitude, communication, internship]],
        columns=feature_columns,
    )
    input_scaled = scaler.transform(input_data)

    prediction = model.predict(input_scaled)[0]
    probability = model.predict_proba(input_scaled)[0][1]  # probability of class "1" (Placed)

    result = "Placed" if prediction == 1 else "Not Placed"
    return result, round(probability * 100, 2)


# ---------- 11. Quick demo test ----------
if __name__ == "__main__":
    print("\n--- Sample Prediction Test ---")
    result, prob = predict_placement(
        cgpa=8.2,
        tenth=85,
        twelfth=80,
        technical=75,
        aptitude=70,
        communication=68,
        internship=1,
    )
    print(f"Sample Student -> Result: {result}, Placement Probability: {prob}%")
