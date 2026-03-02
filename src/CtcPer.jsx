import api from "./api";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HrCalculateSalary.css";

// Cartoon SVG Characters
const PiggyBankSVG = () => (
  <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <ellipse cx="50" cy="58" rx="32" ry="26" fill="#FFB3C6" stroke="#FF4D8D" strokeWidth="2.5"/>
    {/* Head */}
    <circle cx="72" cy="46" r="16" fill="#FFB3C6" stroke="#FF4D8D" strokeWidth="2.5"/>
    {/* Ear */}
    <ellipse cx="72" cy="32" rx="6" ry="5" fill="#FF7BAC" stroke="#FF4D8D" strokeWidth="2"/>
    {/* Snout */}
    <ellipse cx="79" cy="50" rx="7" ry="5" fill="#FF7BAC" stroke="#FF4D8D" strokeWidth="2"/>
    <circle cx="77" cy="50" r="1.5" fill="#FF4D8D"/>
    <circle cx="81" cy="50" r="1.5" fill="#FF4D8D"/>
    {/* Eye */}
    <circle cx="69" cy="43" r="3" fill="white"/>
    <circle cx="70" cy="43" r="1.5" fill="#2D1B0E"/>
    {/* Coin slot */}
    <rect x="44" y="33" width="14" height="4" rx="2" fill="#FF4D8D"/>
    {/* Legs */}
    <rect x="28" y="78" width="10" height="14" rx="5" fill="#FFB3C6" stroke="#FF4D8D" strokeWidth="2"/>
    <rect x="42" y="80" width="10" height="12" rx="5" fill="#FFB3C6" stroke="#FF4D8D" strokeWidth="2"/>
    <rect x="56" y="80" width="10" height="12" rx="5" fill="#FFB3C6" stroke="#FF4D8D" strokeWidth="2"/>
    {/* Tail */}
    <path d="M18 60 Q10 55 14 48 Q18 41 14 36" stroke="#FF4D8D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Coin */}
    <circle cx="50" cy="20" r="9" fill="#FFD700" stroke="#FF6B35" strokeWidth="2"/>
    <text x="50" y="25" textAnchor="middle" fontSize="10" fill="#FF6B35" fontWeight="bold">₹</text>
  </svg>
);

const CalculatorSVG = () => (
  <svg width="80" height="90" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <rect x="8" y="8" width="64" height="84" rx="14" fill="#FF6B35" stroke="#E85A28" strokeWidth="2.5"/>
    <rect x="14" y="14" width="52" height="78" rx="10" fill="#FF8C5A"/>
    {/* Screen */}
    <rect x="18" y="18" width="44" height="22" rx="7" fill="#FFF8F5" stroke="#FFD4C0" strokeWidth="1.5"/>
    <text x="40" y="33" textAnchor="middle" fontSize="11" fill="#FF6B35" fontWeight="bold" fontFamily="monospace">₹ 0.00</text>
    {/* Buttons */}
    {[0,1,2,3].map(row => [0,1,2].map(col => (
      <rect key={`${row}-${col}`}
        x={19 + col * 15} y={46 + row * 15}
        width="11" height="11" rx="3.5"
        fill={row === 0 ? "#FFD4C0" : "#FFF8F5"}
        stroke={row === 0 ? "#FF6B35" : "#FFD4C0"}
        strokeWidth="1.5"
      />
    )))}
    {/* Face */}
    <circle cx="40" cy="6" r="6" fill="#FFD700" stroke="#FF6B35" strokeWidth="2"/>
    <circle cx="38" cy="5" r="1" fill="#2D1B0E"/>
    <circle cx="42" cy="5" r="1" fill="#2D1B0E"/>
    <path d="M37 8 Q40 10 43 8" stroke="#2D1B0E" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* Stars */}
    <text x="58" y="16" fontSize="12" opacity="0.6">✨</text>
  </svg>
);

const CoinSVG = () => (
  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35" cy="35" r="32" fill="#FFD700" stroke="#FF6B35" strokeWidth="3"/>
    <circle cx="35" cy="35" r="25" fill="#FFE455" stroke="#FF6B35" strokeWidth="1.5"/>
    <text x="35" y="43" textAnchor="middle" fontSize="22" fill="#FF6B35" fontWeight="bold">₹</text>
    {/* Shine */}
    <ellipse cx="25" cy="22" rx="5" ry="3" fill="white" opacity="0.4" transform="rotate(-30 25 22)"/>
    {/* Face */}
    <circle cx="22" cy="50" r="1.5" fill="#FF6B35"/>
    <circle cx="48" cy="50" r="1.5" fill="#FF6B35"/>
    <path d="M27 55 Q35 60 43 55" stroke="#FF6B35" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const MoneyBagSVG = () => (
  <svg width="80" height="90" viewBox="0 0 80 95" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Knot */}
    <ellipse cx="40" cy="18" rx="10" ry="7" fill="#FF6B35" stroke="#E85A28" strokeWidth="2"/>
    <rect x="33" y="22" width="14" height="6" rx="0" fill="#FF6B35"/>
    {/* Bag */}
    <ellipse cx="40" cy="60" rx="30" ry="30" fill="#FF8C5A" stroke="#FF6B35" strokeWidth="2.5"/>
    {/* Shine */}
    <ellipse cx="28" cy="42" rx="6" ry="4" fill="white" opacity="0.25" transform="rotate(-20 28 42)"/>
    {/* Money sign */}
    <text x="40" y="68" textAnchor="middle" fontSize="26" fill="#FFD700" fontWeight="bold">$</text>
    {/* Stars around */}
    <text x="10" y="35" fontSize="14" opacity="0.5">⭐</text>
    <text x="62" y="30" fontSize="10" opacity="0.5">✨</text>
    {/* Eyes */}
    <circle cx="33" cy="53" r="3" fill="white"/>
    <circle cx="47" cy="53" r="3" fill="white"/>
    <circle cx="34" cy="53" r="1.5" fill="#2D1B0E"/>
    <circle cx="48" cy="53" r="1.5" fill="#2D1B0E"/>
    {/* Smile */}
    <path d="M33 63 Q40 68 47 63" stroke="#2D1B0E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </svg>
);

const StarSVG = ({ size = 30, color = "#FF6B35", opacity = 0.3 }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="15,2 18.5,11 28,11 20.5,17 23,26 15,21 7,26 9.5,17 2,11 11.5,11"
      fill={color} opacity={opacity}/>
  </svg>
);

// Compact Animated Success Toast
const SuccessToast = ({ type, onClose }) => {
  const isUpdate = type === "updated";
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="success-toast">
      {/* Animated check icon bubble */}
      <div className="toast-icon">
        <svg className="toast-tick" viewBox="0 0 20 20" fill="none">
          <circle className="toast-tick-circle" cx="10" cy="10" r="8" stroke="white" strokeWidth="1.8"/>
          <polyline className="toast-tick-check" points="6,10.5 9,13.5 14,7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Text */}
      <div className="toast-body">
        <span className="toast-title">
          {isUpdate ? "Updated!" : "Created!"}
        </span>
        <span className="toast-sub">
          {isUpdate ? "Configuration saved ✓" : "Setup complete ✓"}
        </span>
      </div>

      {/* Emoji */}
      <span className="toast-emoji">{isUpdate ? "🎉" : "🚀"}</span>

      {/* Auto-close progress bar */}
      <div className="toast-progress">
        <div className="toast-progress-fill" />
      </div>
    </div>
  );
};

export default function SalaryConfiguration() {
  const [form, setForm] = useState({
    id: null,
    basicPercentage: "",
    hraPercentage: "",
    pfPercentage: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [configExists, setConfigExists] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState("updated"); // "updated" | "created"

  const triggerSuccess = (type = "updated") => {
    setSuccessType(type);
    setShowSuccess(true);
    // Don't set timeout here - it's handled in the SuccessToast component
  };

  const handleCloseToast = () => {
    setShowSuccess(false);
  };

  useEffect(() => {
    fetchSalaryConfig();
  }, []);

  const fetchSalaryConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/salary/calculator/get`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      let configData = null;
      if (response.data) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          configData = response.data[0];
        } else if (typeof response.data === 'object' && Object.keys(response.data).length > 0) {
          configData = response.data;
        }
      }

      if (configData && (configData.id !== undefined || configData.basicPercentage !== undefined || configData.hraPercentage !== undefined || configData.pfPercentage !== undefined)) {
        setForm({
          id: configData.id || null,
          basicPercentage: configData.basicPercentage?.toString() || "",
          hraPercentage: configData.hraPercentage?.toString() || "",
          pfPercentage: configData.pfPercentage?.toString() || ""
        });
        setConfigExists(true);
        setMessage("✅ Configuration loaded successfully");
        setErrors({});
      } else {
        resetForm();
        setConfigExists(false);
        setMessage("⚠️ No configuration found. You can create one.");
      }
    } catch (error) {
      if (error.response?.status === 500 || error.response?.status === 400 || error.response?.status === 404) {
        resetForm();
        setConfigExists(false);
        setMessage("⚠️ No configuration found. You can create one.");
      } else {
        setMessage("❌ Error loading configuration");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setErrors({});
    setForm({ id: null, basicPercentage: "", hraPercentage: "", pfPercentage: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.basicPercentage.trim()) {
      errors.basic = "Basic percentage is required";
    } else {
      const basicValue = parseFloat(form.basicPercentage);
      if (isNaN(basicValue) || basicValue <= 0 || basicValue > 100) {
        errors.basic = "Basic percentage must be between 0.01 and 100";
      }
    }
    if (!form.hraPercentage.trim()) {
      errors.hra = "HRA percentage is required";
    } else {
      const hraValue = parseFloat(form.hraPercentage);
      if (isNaN(hraValue) || hraValue < 0 || hraValue > 100) {
        errors.hra = "HRA percentage must be between 0 and 100";
      }
    }
    if (!form.pfPercentage.trim()) {
      errors.pf = "PF percentage is required";
    } else {
      const pfValue = parseFloat(form.pfPercentage);
      if (isNaN(pfValue) || pfValue < 0 || pfValue > 100) {
        errors.pf = "PF percentage must be between 0 and 100";
      }
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleaned = value.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    if (cleaned.length > 30) return;
    if (cleaned.startsWith(".")) return;
    if (/^0{2,}/.test(cleaned)) return;
    setForm(prev => ({ ...prev, [name]: cleaned }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value && value.trim() !== "" && !isNaN(value)) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setForm(prev => ({ ...prev, [name]: num.toFixed(2) }));
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = validateForm();
    if (Object.keys(errorsObj).length > 0) {
      setErrors(errorsObj);
      const errorText = Object.values(errorsObj).join("\n");
      setMessage(`❌ Please fix the following:\n${errorText}`);
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      const payload = {
        basicPercentage: parseFloat(form.basicPercentage),
        hraPercentage: parseFloat(form.hraPercentage),
        pfPercentage: parseFloat(form.pfPercentage)
      };

      if (configExists && form.id) {
        // Update existing configuration
        const response = await axios.put(`/api/salary/update/${form.id}`, payload, { 
          withCredentials: true, 
          headers: { 'Content-Type': 'application/json' } 
        });
        
        // Show success message and toast
        setMessage("✅ Configuration updated successfully");
        setErrors({});
        triggerSuccess("updated");
        window.alert("Configuration updated successfully");
        // Fetch updated config after a short delay to ensure database is updated
        setTimeout(() => { 
          fetchSalaryConfig(); 
        }, 1000);
        
      } else {
        // Create new configuration
        try {
          const response = await axios.post(`/api/salary/calculator`, payload, { 
            withCredentials: true, 
            headers: { 'Content-Type': 'application/json' } 
          });
          
          if (response.status === 200 || response.status === 201) {
            // Extract the new ID from response
            const newId = response.data?.id || response.data?.configId;
            
            if (newId) {
              setForm(prev => ({ ...prev, id: newId }));
            }
            
            setConfigExists(true);
            
            // Show success message and toast
            setMessage("✅ Configuration created successfully (One-time setup complete)");
            setErrors({});
            triggerSuccess("created");
            
            // Fetch updated config after a short delay
            setTimeout(() => { 
              fetchSalaryConfig(); 
            }, 1000);
          }
        } catch (createError) {
          // Handle case where config might already exist
          if (createError.response?.status === 500 || createError.response?.status === 409) {
            const errorMsg = createError.response?.data?.message || createError.response?.data?.toString() || "";
            
            if (errorMsg.toLowerCase().includes("already exists")) {
              setMessage("⚠️ Configuration already exists. Loading existing configuration...");
              setTimeout(() => { fetchSalaryConfig(); }, 1000);
            } else {
              setMessage("❌ Server error during creation");
            }
          } else {
            setMessage(`❌ Error: ${createError.response?.data?.message || createError.message}`);
          }
        }
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setMessage("❌ Server error. Please try again.");
      } else if (error.response?.status === 400) {
        setMessage("❌ Invalid data. Please check your inputs.");
      } else {
        setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (configExists) {
      fetchSalaryConfig();
      setMessage("Form reset to current configuration");
    } else {
      resetForm();
      setMessage("Form cleared");
    }
  };

  if (loading) {
    return (
      <div className="salary-calc-page">
        {showSuccess && <SuccessToast type={successType} onClose={handleCloseToast} />}
        {/* Cartoon background characters */}
        <div className="cartoon-character cartoon-piggy"><PiggyBankSVG /></div>
        <div className="cartoon-character cartoon-calc"><CalculatorSVG /></div>
        <div className="cartoon-character cartoon-coin"><CoinSVG /></div>
        <div className="cartoon-character cartoon-bag"><MoneyBagSVG /></div>
        <div className="cartoon-character cartoon-star1"><StarSVG size={36} color="#FF6B35" opacity={0.3}/></div>
        <div className="cartoon-character cartoon-star2"><StarSVG size={28} color="#FF4D8D" opacity={0.3}/></div>
        <div className="cartoon-character cartoon-star3"><StarSVG size={20} color="#FF6B35" opacity={0.25}/></div>

        <div className="salary-calc-card">
          <div className="card-icon-row">
            <div className="card-icon">🐷</div>
            <div className="card-icon">💰</div>
            <div className="card-icon">📊</div>
          </div>
          <div className="loading">
            <h2>Loading Configuration...</h2>
            <p>Checking for existing salary configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="salary-calc-page">
      {/* Animated success toast */}
      {showSuccess && <SuccessToast type={successType} onClose={handleCloseToast} />}
      
      {/* Cartoon background characters */}
      <div className="cartoon-character cartoon-piggy"><PiggyBankSVG /></div>
      <div className="cartoon-character cartoon-calc"><CalculatorSVG /></div>
      <div className="cartoon-character cartoon-coin"><CoinSVG /></div>
      <div className="cartoon-character cartoon-bag"><MoneyBagSVG /></div>
      <div className="cartoon-character cartoon-star1"><StarSVG size={36} color="#FF6B35" opacity={0.3}/></div>
      <div className="cartoon-character cartoon-star2"><StarSVG size={28} color="#FF4D8D" opacity={0.3}/></div>
      <div className="cartoon-character cartoon-star3"><StarSVG size={20} color="#FF6B35" opacity={0.25}/></div>

      <div className="salary-calc-card">
        {/* Bouncing icon row */}
        <div className="card-icon-row">
          <div className="card-icon">🐷</div>
          <div className="card-icon">💰</div>
          <div className="card-icon">📊</div>
        </div>

        <h2>Salary Configuration</h2>

        <p className="subtitle">
          {configExists
            ? "✏️ Edit salary calculation percentages (Can update anytime)"
            : "🎉 Create salary calculation percentages (One-time setup only)"}
        </p>

        {message && (
          <div className={`message ${message.includes("✅") ? "success" : message.includes("⚠️") ? "warning" : "error"}`}>
            {message.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="basicPercentage">
              🏠 Basic Percentage (% of CTC) *
            </label>
            <input
              id="basicPercentage"
              type="text"
              name="basicPercentage"
              value={form.basicPercentage}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="e.g., 40.00"
              disabled={saving}
              required
              className={errors.basic ? "input-error" : ""}
            />
            {errors.basic && <span className="error-text">⚠️ {errors.basic}</span>}
            <small className="field-note">Percentage of CTC for Basic Salary</small>
          </div>

          <div className="form-group">
            <label htmlFor="hraPercentage">
              🏡 HRA Percentage (% of Basic) *
            </label>
            <input
              id="hraPercentage"
              type="text"
              name="hraPercentage"
              value={form.hraPercentage}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="e.g., 20.00"
              disabled={saving}
              required
              className={errors.hra ? "input-error" : ""}
            />
            {errors.hra && <span className="error-text">⚠️ {errors.hra}</span>}
            <small className="field-note">Percentage of Basic Salary for HRA</small>
          </div>

          <div className="form-group">
            <label htmlFor="pfPercentage">
              💼 PF Percentage (% of Basic) *
            </label>
            <input
              id="pfPercentage"
              type="text"
              name="pfPercentage"
              value={form.pfPercentage}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="e.g., 12.00"
              disabled={saving}
              required
              className={errors.pf ? "input-error" : ""}
            />
            {errors.pf && <span className="error-text">⚠️ {errors.pf}</span>}
            <small className="field-note">Percentage of Basic Salary for PF</small>
          </div>

          <div className="button-group">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving
                ? "⏳ Processing..."
                : configExists
                  ? "💾 Update Configuration"
                  : "🚀 Create Configuration"}
            </button>

            <button type="button" className="reset-btn" onClick={handleReset} disabled={saving}>
              {configExists ? "🔄 Refresh" : "🗑️ Clear"}
            </button>
          </div>
        </form>

        <div className="info-box">
          <h4>Important Rules</h4>
          <ul>
            <li>
              <strong>Adding:</strong> Can only be done <strong>once</strong> when no configuration exists
            </li>
            <li>
              <strong>Editing:</strong> Can be done <strong>anytime</strong> once configuration exists
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}