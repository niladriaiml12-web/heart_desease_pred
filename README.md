# ❤️ CardioSense AI — Heart Disease Prediction

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=flat&logo=flask&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/scikit--learn-1.x-F7931E?style=flat&logo=scikit-learn&logoColor=white)
![Accuracy](https://img.shields.io/badge/Model%20Accuracy-86.4%25-22c55e?style=flat)

A full-stack AI-powered web application that predicts heart disease risk using a **K-Nearest Neighbors (KNN)** machine learning model trained on 918 patient records. The frontend features an interactive neural particle animation and a premium dark-mode UI.

---

## 📸 Preview

| Form Input | Prediction Result |
|---|---|
| Patient data form with 11 clinical parameters grouped by category | Real-time risk assessment with donut chart, probability bars & recommendations |

---

## 🧠 How the Prediction Works

### Dataset
The model is trained on the **Heart Failure Prediction Dataset** (`heart.csv`) containing **918 patient records** with 11 clinical features and 1 binary target (`HeartDisease`: 0 = No, 1 = Yes).

### Input Features

| Feature | Type | Description |
|---|---|---|
| `Age` | Numeric | Patient age in years |
| `Sex` | Categorical | M = Male, F = Female |
| `ChestPainType` | Categorical | ATA (Atypical Angina), NAP (Non-Anginal Pain), ASY (Asymptomatic), TA (Typical Angina) |
| `RestingBP` | Numeric | Resting blood pressure (mm Hg) |
| `Cholesterol` | Numeric | Serum cholesterol (mm/dl) |
| `FastingBS` | Binary | Fasting blood sugar > 120 mg/dl (1 = True, 0 = False) |
| `RestingECG` | Categorical | Resting ECG results: Normal, ST, LVH |
| `MaxHR` | Numeric | Maximum heart rate achieved (bpm) |
| `ExerciseAngina` | Categorical | Exercise-induced angina: Y = Yes, N = No |
| `Oldpeak` | Numeric | ST depression induced by exercise (mm) |
| `ST_Slope` | Categorical | Slope of the peak exercise ST segment: Up, Flat, Down |

### Preprocessing Pipeline

```
Raw Input
    │
    ▼
One-Hot Encoding (categorical → binary columns)
    │   Sex       → Sex_M
    │   ChestPain → ChestPainType_ATA, _NAP, _TA
    │   RestingECG→ RestingECG_Normal, _ST
    │   ExAngina  → ExerciseAngina_Y
    │   ST_Slope  → ST_Slope_Flat, ST_Slope_Up
    │
    ▼
StandardScaler (numerical features only)
    │   Age, RestingBP, Cholesterol, FastingBS, MaxHR, Oldpeak
    │   → zero mean, unit variance
    │
    ▼
KNN Classifier (k=5, default)
    │
    ▼
Prediction (0 = No Disease, 1 = Disease) + Probability Scores
```

### Algorithm — K-Nearest Neighbors (KNN)

KNN is a **non-parametric**, instance-based learning algorithm. For each new patient:

1. Calculates the Euclidean distance to all 918 training patients in feature space
2. Finds the **5 nearest neighbors**
3. Takes a **majority vote** among neighbors
4. Returns the class (0 or 1) and probability (fraction of neighbors in each class)

**Why KNN?** It captures local patterns in clinical data without assuming a global model structure, making it effective for medical datasets where patient clusters have distinct risk profiles.

---

## 📊 Model Performance

Models were trained and evaluated on an **80/20 train-test split** (734 training / 184 test samples).

| Model | Accuracy | F1 Score |
|---|---|---|
| **KNN ⭐ (selected)** | **86.41%** | **88.15%** |
| Logistic Regression | 86.96% | 88.57% |
| Naive Bayes | 85.33% | 86.83% |
| SVM | 84.78% | 86.79% |
| Decision Tree | 76.09% | 78.43% |

> **Note:** KNN was selected for this app due to its strong F1 score and its ability to return probability estimates via `predict_proba()`, which power the risk gauge visualization.

### Risk Level Classification

| Risk Level | Disease Probability |
|---|---|
| 🟢 Low | < 30% |
| 🟡 Moderate | 30% – 60% |
| 🔴 High | > 60% |

---

## 🗂️ Project Structure

```
Heart Desease Prediction/
│
├── 📓 heart-desease-prediction.ipynb   # Original Jupyter Notebook (EDA + training)
├── 📄 heart.csv                         # Dataset (918 records)
├── 🤖 KNN_heart.pkl                     # Trained KNN model (auto-generated)
├── 📏 scaler.pkl                        # StandardScaler (auto-generated)
├── 📋 columns.pkl                       # Feature column order (auto-generated)
│
├── 📁 backend/
│   ├── app.py                           # Flask REST API
│   ├── train_model.py                   # Script to retrain & save model
│   └── requirements.txt                 # Python dependencies
│
└── 📁 frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── App.jsx                      # Main app + result panel
        ├── App.css                      # Premium dark-mode styles
        ├── main.jsx                     # React entry point
        └── components/
            ├── NeuralBackground.jsx     # Animated particle canvas
            └── PredictionForm.jsx       # 11-feature input form
```

---

## 🚀 How to Run Locally

### Prerequisites

Make sure you have these installed:

- **Python 3.8+** → [python.org](https://www.python.org/downloads/)
- **Node.js 18+** → [nodejs.org](https://nodejs.org/)
- **pip** (comes with Python)

---

### Step 1 — Clone / Open the Project

```bash
# If you cloned from git:
cd "Heart Desease Prediction"

# Or just navigate to the folder in your terminal
```

---

### Step 2 — Train the Model (One-time Setup)

This generates `KNN_heart.pkl`, `scaler.pkl`, and `columns.pkl`:

```bash
python backend/train_model.py
```

Expected output:
```
Loading heart.csv ...
Dataset shape: (918, 12)
Training KNN model ...
KNN Accuracy: 0.8478, F1: 0.8641
Saving model artifacts ...
Saved: KNN_heart.pkl, scaler.pkl, columns.pkl
```

> ⚠️ **Skip this step** if you already ran the Jupyter notebook (`heart-desease-prediction.ipynb`) — the `.pkl` files will already exist.

---

### Step 3 — Start the Backend (Flask API)

```bash
# Install Python dependencies
pip install flask flask-cors scikit-learn numpy pandas joblib

# Start the Flask server
python backend/app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
* Debug mode: on
```

The API will be available at **http://localhost:5000**

---

### Step 4 — Start the Frontend (React + Vite)

Open a **new terminal** window:

```bash
# Navigate to the frontend folder
cd frontend

# Install Node dependencies (first time only)
npm install

# Start the development server
npm run dev
```

You should see:
```
VITE v8.x  ready in 464 ms
➜  Local:   http://localhost:5173/
```

---

### Step 5 — Open the App

Visit **[http://localhost:5173](http://localhost:5173)** in your browser 🎉

---

## 🔌 API Reference

### `GET /api/health`
Check if the backend is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Heart Disease Prediction API is running"
}
```

---

### `POST /api/predict`
Submit patient data and get a heart disease prediction.

**Request Body:**
```json
{
  "age": 55,
  "sex": "M",
  "chestPainType": "ASY",
  "restingBP": 140,
  "cholesterol": 250,
  "fastingBS": 0,
  "restingECG": "Normal",
  "maxHR": 120,
  "exerciseAngina": "Y",
  "oldpeak": 2.0,
  "stSlope": "Flat"
}
```

**Response:**
```json
{
  "prediction": 1,
  "probability": {
    "no_disease": 20.0,
    "disease": 80.0
  },
  "risk_level": "High"
}
```

| Field | Description |
|---|---|
| `prediction` | `0` = No Heart Disease, `1` = Heart Disease |
| `probability.disease` | Probability of having heart disease (%) |
| `probability.no_disease` | Probability of no heart disease (%) |
| `risk_level` | `"Low"`, `"Moderate"`, or `"High"` |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **ML Model** | scikit-learn KNN |
| **Backend** | Python, Flask, Flask-CORS |
| **Frontend** | React 18, Vite 6 |
| **Styling** | Vanilla CSS (glassmorphism, dark mode) |
| **Animation** | HTML5 Canvas (Neural particle flow field) |
| **Data** | pandas, NumPy, joblib |

---

## ⚠️ Disclaimer

> This application is **for educational and demonstration purposes only**. It is **not a medical device** and should **not be used** for clinical diagnosis or treatment decisions. Always consult a qualified healthcare professional for medical advice.

---

## 📚 Dataset Source

The dataset used is the **Heart Failure Prediction Dataset**, a combination of 5 heart disease datasets available on [Kaggle](https://www.kaggle.com/datasets/fedesoriano/heart-failure-prediction).

- Cleveland Heart Disease Dataset
- Hungarian Institute of Cardiology Dataset
- Switzerland Dataset
- Long Beach VA Dataset
- Stalog (Heart) Dataset
