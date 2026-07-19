import os
import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model artifacts from the parent directory (where notebook was run)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, 'KNN_heart.pkl'))
scaler = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
columns = joblib.load(os.path.join(BASE_DIR, 'columns.pkl'))

# The numerical columns that get scaled
NUMERICAL_COLS = ['Age', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR', 'Oldpeak']


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Heart Disease Prediction API is running'})


@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Extract inputs
        age = float(data['age'])
        sex = data['sex']                         # 'M' or 'F'
        chest_pain_type = data['chestPainType']   # 'ATA', 'NAP', 'ASY', 'TA'
        resting_bp = float(data['restingBP'])
        cholesterol = float(data['cholesterol'])
        fasting_bs = int(data['fastingBS'])       # 0 or 1
        resting_ecg = data['restingECG']          # 'Normal', 'ST', 'LVH'
        max_hr = float(data['maxHR'])
        exercise_angina = data['exerciseAngina']  # 'Y' or 'N'
        oldpeak = float(data['oldpeak'])
        st_slope = data['stSlope']                # 'Up', 'Flat', 'Down'

        # Build feature dict matching notebook preprocessing
        # Numerical features
        row = {
            'Age': age,
            'RestingBP': resting_bp,
            'Cholesterol': cholesterol,
            'FastingBS': fasting_bs,
            'MaxHR': max_hr,
            'Oldpeak': oldpeak,
            # One-hot encoded
            'Sex_M': 1 if sex == 'M' else 0,
            'ChestPainType_ATA': 1 if chest_pain_type == 'ATA' else 0,
            'ChestPainType_NAP': 1 if chest_pain_type == 'NAP' else 0,
            'ChestPainType_TA': 1 if chest_pain_type == 'TA' else 0,
            'RestingECG_Normal': 1 if resting_ecg == 'Normal' else 0,
            'RestingECG_ST': 1 if resting_ecg == 'ST' else 0,
            'ExerciseAngina_Y': 1 if exercise_angina == 'Y' else 0,
            'ST_Slope_Flat': 1 if st_slope == 'Flat' else 0,
            'ST_Slope_Up': 1 if st_slope == 'Up' else 0,
        }

        # Create DataFrame with columns in the right order (same as training)
        df = pd.DataFrame([row])

        # The scaler was fitted on numerical columns only
        # Scale the numerical columns
        df[NUMERICAL_COLS] = scaler.transform(df[NUMERICAL_COLS])

        # Reorder columns to match training order
        df = df[columns]

        # Predict
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0]

        return jsonify({
            'prediction': int(prediction),
            'probability': {
                'no_disease': round(float(probability[0]) * 100, 1),
                'disease': round(float(probability[1]) * 100, 1)
            },
            'risk_level': get_risk_level(float(probability[1]))
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_risk_level(prob):
    if prob < 0.3:
        return 'Low'
    elif prob < 0.6:
        return 'Moderate'
    else:
        return 'High'


if __name__ == '__main__':
    app.run(debug=True, port=5000)
