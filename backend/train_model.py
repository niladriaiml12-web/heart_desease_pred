"""
Script to train the KNN heart disease model and save all artifacts.
Run this once to generate: KNN_heart.pkl, scaler.pkl, columns.pkl
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
import joblib
import os

# Get the directory of this script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

print("Loading heart.csv ...")
df = pd.read_csv(os.path.join(BASE_DIR, 'heart.csv'))

print(f"Dataset shape: {df.shape}")

# One-hot encode categorical columns (drop_first=True to match notebook)
df_encode = pd.get_dummies(df, columns=['Sex', 'ChestPainType', 'RestingECG', 'ExerciseAngina', 'ST_Slope'], drop_first=True)

print(f"Encoded columns: {list(df_encode.columns)}")

# Features and target
x = df_encode.drop('HeartDisease', axis=1)
y = df_encode['HeartDisease']

print(f"Feature columns: {list(x.columns)}")

# Train/test split
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

# Scale numerical features only
numerical_cols = ['Age', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR', 'Oldpeak']
scaler = StandardScaler()
x_train_scaled = x_train.copy()
x_test_scaled = x_test.copy()
x_train_scaled[numerical_cols] = scaler.fit_transform(x_train[numerical_cols])
x_test_scaled[numerical_cols] = scaler.transform(x_test[numerical_cols])

# Train KNN
print("Training KNN model ...")
knn = KNeighborsClassifier()
knn.fit(x_train_scaled, y_train)

from sklearn.metrics import accuracy_score, f1_score
y_pred = knn.predict(x_test_scaled)
acc = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
print(f"KNN Accuracy: {acc:.4f}, F1: {f1:.4f}")

# Save artifacts
print("Saving model artifacts ...")
joblib.dump(knn, os.path.join(BASE_DIR, 'KNN_heart.pkl'))
joblib.dump(scaler, os.path.join(BASE_DIR, 'scaler.pkl'))
joblib.dump(x.columns.tolist(), os.path.join(BASE_DIR, 'columns.pkl'))

print("✅ Saved: KNN_heart.pkl, scaler.pkl, columns.pkl")
print("Feature order:", x.columns.tolist())
