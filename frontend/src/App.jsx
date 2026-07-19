import { useState } from "react";
import "./App.css";
import NeuralBackground from "./components/NeuralBackground";
import PredictionForm from "./components/PredictionForm";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to backend. Make sure the Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Neural background fills entire viewport */}
      <div className="neural-layer">
        <NeuralBackground color="#818cf8" trailOpacity={0.1} speed={0.8} particleCount={600} />
      </div>

      {/* Overlay gradient */}
      <div className="overlay-gradient" />

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
          </div>
          <div className="header-text">
            <h1 className="app-title">CardioSense AI</h1>
            <p className="app-subtitle">Heart Disease Risk Prediction using Machine Learning</p>
          </div>
          <div className="accuracy-badge">
            <span className="badge-label">Model Accuracy</span>
            <span className="badge-value">86.4%</span>
          </div>
        </header>

        {/* Info bar */}
        <div className="info-bar">
          <div className="info-item">
            <span className="info-icon">🧠</span>
            <span>KNN Algorithm</span>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <span className="info-icon">📊</span>
            <span>918 Training Samples</span>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <span>Real-time Prediction</span>
          </div>
        </div>

        {/* Form + Result */}
        <div className="content-grid">
          <PredictionForm onPredict={handlePredict} loading={loading} />
          <ResultPanel result={result} loading={loading} error={error} />
        </div>

        {/* Footer disclaimer */}
        <footer className="app-footer">
          <p>⚠️ This tool is for educational purposes only. Always consult a medical professional for diagnosis.</p>
        </footer>
      </div>
    </div>
  );
}

function ResultPanel({ result, loading, error }) {
  if (loading) {
    return (
      <div className="result-panel loading-panel">
        <div className="loading-spinner">
          <div className="spinner-ring" />
          <div className="spinner-ring spinner-ring-2" />
          <div className="spinner-ring spinner-ring-3" />
        </div>
        <p className="loading-text">Analyzing patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-panel error-panel">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Connection Error</h3>
        <p className="error-msg">{error}</p>
        <div className="error-hint">
          <p>Make sure the Flask backend is running:</p>
          <code>cd backend && python app.py</code>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-panel empty-panel">
        <div className="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="80" height="80">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="empty-title">Ready to Analyze</h3>
        <p className="empty-desc">Fill in the patient information and click Analyze to get a heart disease risk assessment.</p>
      </div>
    );
  }

  const isDisease = result.prediction === 1;
  const riskColor = result.risk_level === "Low" ? "#22c55e" : result.risk_level === "Moderate" ? "#f59e0b" : "#ef4444";
  const diseaseProb = result.probability.disease;
  const noDisease = result.probability.no_disease;

  return (
    <div className={`result-panel prediction-panel ${isDisease ? "high-risk" : "low-risk"}`}>
      <div className="prediction-badge" style={{ borderColor: riskColor }}>
        <div className="prediction-icon" style={{ color: riskColor }}>
          {isDisease ? "🚨" : "✅"}
        </div>
        <h2 className="prediction-title" style={{ color: riskColor }}>
          {isDisease ? "Heart Disease Detected" : "No Heart Disease Detected"}
        </h2>
        <div className="risk-pill" style={{ background: riskColor + "22", border: `1px solid ${riskColor}` }}>
          <span style={{ color: riskColor, fontWeight: 700 }}>Risk Level: {result.risk_level}</span>
        </div>
      </div>

      {/* Probability bars */}
      <div className="prob-section">
        <h3 className="prob-title">Probability Breakdown</h3>

        <div className="prob-item">
          <div className="prob-label">
            <span>Heart Disease</span>
            <span className="prob-pct">{diseaseProb}%</span>
          </div>
          <div className="prob-bar-bg">
            <div
              className="prob-bar-fill"
              style={{
                width: `${diseaseProb}%`,
                background: "linear-gradient(90deg, #ef4444, #dc2626)",
              }}
            />
          </div>
        </div>

        <div className="prob-item">
          <div className="prob-label">
            <span>No Disease</span>
            <span className="prob-pct">{noDisease}%</span>
          </div>
          <div className="prob-bar-bg">
            <div
              className="prob-bar-fill"
              style={{
                width: `${noDisease}%`,
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Donut chart visual */}
      <div className="donut-wrapper">
        <svg viewBox="0 0 120 120" className="donut-chart" width="120" height="120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff11" strokeWidth="14" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={riskColor}
            strokeWidth="14"
            strokeDasharray={`${(diseaseProb / 100) * 314} 314`}
            strokeDashoffset="78.5"
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
          <text x="60" y="56" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{diseaseProb}%</text>
          <text x="60" y="72" textAnchor="middle" fill="#94a3b8" fontSize="9">Risk Score</text>
        </svg>
      </div>

      {/* Recommendation */}
      <div className="recommendation" style={{ borderColor: riskColor + "44" }}>
        <h4 style={{ color: riskColor, marginBottom: 8 }}>
          {isDisease ? "Recommended Actions" : "Preventive Measures"}
        </h4>
        {isDisease ? (
          <ul>
            <li>Consult a cardiologist immediately</li>
            <li>Complete ECG and stress test</li>
            <li>Review medications and lifestyle</li>
          </ul>
        ) : (
          <ul>
            <li>Maintain healthy diet and exercise</li>
            <li>Regular annual check-ups</li>
            <li>Monitor blood pressure and cholesterol</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
