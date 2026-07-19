import { useState } from "react";

const INITIAL_FORM = {
  age: "",
  sex: "M",
  chestPainType: "ATA",
  restingBP: "",
  cholesterol: "",
  fastingBS: "0",
  restingECG: "Normal",
  maxHR: "",
  exerciseAngina: "N",
  oldpeak: "",
  stSlope: "Up",
};

const FIELD_CONFIG = [
  {
    key: "age",
    label: "Age",
    type: "number",
    placeholder: "e.g., 55",
    min: 20,
    max: 80,
    unit: "years",
    icon: "👤",
    group: "demographics",
  },
  {
    key: "sex",
    label: "Sex",
    type: "select",
    options: [
      { value: "M", label: "Male" },
      { value: "F", label: "Female" },
    ],
    icon: "⚧",
    group: "demographics",
  },
  {
    key: "chestPainType",
    label: "Chest Pain Type",
    type: "select",
    options: [
      { value: "ATA", label: "ATA — Atypical Angina" },
      { value: "NAP", label: "NAP — Non-Anginal Pain" },
      { value: "ASY", label: "ASY — Asymptomatic" },
      { value: "TA", label: "TA — Typical Angina" },
    ],
    icon: "💔",
    group: "symptoms",
  },
  {
    key: "restingBP",
    label: "Resting Blood Pressure",
    type: "number",
    placeholder: "e.g., 130",
    min: 60,
    max: 200,
    unit: "mm Hg",
    icon: "🩸",
    group: "vitals",
  },
  {
    key: "cholesterol",
    label: "Serum Cholesterol",
    type: "number",
    placeholder: "e.g., 200",
    min: 0,
    max: 603,
    unit: "mm/dl",
    icon: "🧪",
    group: "vitals",
  },
  {
    key: "fastingBS",
    label: "Fasting Blood Sugar",
    type: "select",
    options: [
      { value: "0", label: "≤ 120 mg/dl (Normal)" },
      { value: "1", label: "> 120 mg/dl (High)" },
    ],
    icon: "🍬",
    group: "vitals",
  },
  {
    key: "restingECG",
    label: "Resting ECG Results",
    type: "select",
    options: [
      { value: "Normal", label: "Normal" },
      { value: "ST", label: "ST — ST-T wave abnormality" },
      { value: "LVH", label: "LVH — Left ventricular hypertrophy" },
    ],
    icon: "📈",
    group: "tests",
  },
  {
    key: "maxHR",
    label: "Max Heart Rate Achieved",
    type: "number",
    placeholder: "e.g., 150",
    min: 60,
    max: 202,
    unit: "bpm",
    icon: "❤️",
    group: "tests",
  },
  {
    key: "exerciseAngina",
    label: "Exercise Induced Angina",
    type: "select",
    options: [
      { value: "N", label: "No" },
      { value: "Y", label: "Yes" },
    ],
    icon: "🏃",
    group: "tests",
  },
  {
    key: "oldpeak",
    label: "ST Depression (Oldpeak)",
    type: "number",
    placeholder: "e.g., 1.0",
    min: -2.6,
    max: 6.2,
    step: "0.1",
    unit: "mm",
    icon: "📉",
    group: "tests",
  },
  {
    key: "stSlope",
    label: "Slope of Peak Exercise ST",
    type: "select",
    options: [
      { value: "Up", label: "Upsloping" },
      { value: "Flat", label: "Flat" },
      { value: "Down", label: "Downsloping" },
    ],
    icon: "📐",
    group: "tests",
  },
];

const GROUPS = {
  demographics: { label: "Demographics", color: "#818cf8" },
  symptoms: { label: "Symptoms", color: "#fb7185" },
  vitals: { label: "Vital Signs", color: "#34d399" },
  tests: { label: "Medical Tests", color: "#fbbf24" },
};

export default function PredictionForm({ onPredict, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      age: parseFloat(form.age),
      sex: form.sex,
      chestPainType: form.chestPainType,
      restingBP: parseFloat(form.restingBP),
      cholesterol: parseFloat(form.cholesterol),
      fastingBS: parseInt(form.fastingBS),
      restingECG: form.restingECG,
      maxHR: parseFloat(form.maxHR),
      exerciseAngina: form.exerciseAngina,
      oldpeak: parseFloat(form.oldpeak),
      stSlope: form.stSlope,
    };
    onPredict(payload);
  };

  const isValid =
    form.age && form.restingBP && form.cholesterol && form.maxHR && form.oldpeak;

  // Group fields by category
  const grouped = {};
  FIELD_CONFIG.forEach((f) => {
    if (!grouped[f.group]) grouped[f.group] = [];
    grouped[f.group].push(f);
  });

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2 className="form-title">Patient Information</h2>
        <p className="form-subtitle">Enter all clinical parameters for accurate analysis</p>
      </div>

      {Object.entries(grouped).map(([groupKey, fields]) => {
        const group = GROUPS[groupKey];
        return (
          <div key={groupKey} className="form-group-section">
            <div className="group-header" style={{ borderColor: group.color }}>
              <span className="group-dot" style={{ background: group.color }} />
              <span className="group-label" style={{ color: group.color }}>{group.label}</span>
            </div>
            <div className="fields-grid">
              {fields.map((field) => (
                <div key={field.key} className="field-wrapper">
                  <label className="field-label">
                    <span className="field-icon">{field.icon}</span>
                    {field.label}
                    {field.unit && <span className="field-unit">({field.unit})</span>}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.key}
                      className="field-select"
                      value={form[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.key}
                      type="number"
                      className="field-input"
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step || "1"}
                      value={form[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button
        type="submit"
        className={`submit-btn ${loading ? "submit-loading" : ""}`}
        disabled={!isValid || loading}
      >
        {loading ? (
          <>
            <span className="btn-spinner" />
            Analyzing...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
            Analyze Risk
          </>
        )}
      </button>

      <button
        type="button"
        className="reset-btn"
        onClick={() => { setForm(INITIAL_FORM); setTouched({}); }}
      >
        Reset Form
      </button>
    </form>
  );
}
