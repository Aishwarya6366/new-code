import api from "./api";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HrCalculateSalary.css";

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
          {isUpdate ? "Configuration saved" : "Setup complete"}
        </span>
      </div>

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
  const [successType, setSuccessType] = useState("updated");

  const triggerSuccess = (type = "updated") => {
    setSuccessType(type);
    setShowSuccess(true);
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
        setMessage("Configuration loaded successfully");
        setErrors({});
      } else {
        resetForm();
        setConfigExists(false);
        setMessage("No configuration found. You can create one.");
      }
    } catch (error) {
      if (error.response?.status === 500 || error.response?.status === 400 || error.response?.status === 404) {
        resetForm();
        setConfigExists(false);
        setMessage("No configuration found. You can create one.");
      } else {
        setMessage("Error loading configuration");
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
      setMessage(`Please fix the following:\n${errorText}`);
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
        await axios.put(`/api/salary/update/${form.id}`, payload, { 
          withCredentials: true, 
          headers: { 'Content-Type': 'application/json' } 
        });
        
        // Show success message and toast
        setMessage("Configuration updated successfully");
        setErrors({});
        triggerSuccess("updated");
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
            setMessage("Configuration created successfully (One-time setup complete)");
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
              setMessage("Configuration already exists. Loading existing configuration...");
              setTimeout(() => { fetchSalaryConfig(); }, 1000);
            } else {
              setMessage("Server error during creation");
            }
          } else {
            setMessage(`Error: ${createError.response?.data?.message || createError.message}`);
          }
        }
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setMessage("Server error. Please try again.");
      } else if (error.response?.status === 400) {
        setMessage("Invalid data. Please check your inputs.");
      } else {
        setMessage(`Error: ${error.response?.data?.message || error.message}`);
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
        <div className="salary-calc-card">
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

      <div className="salary-calc-card">
        <h2>Salary Configuration</h2>

        <p className="subtitle">
          {configExists
            ? "Edit salary calculation percentages (Can update anytime)"
            : "Create salary calculation percentages (One-time setup only)"}
        </p>

        {message && (
          <div className={`message ${message.includes("successfully") ? "success" : message.includes("No configuration") ? "warning" : "error"}`}>
            {message.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="basicPercentage">
              Basic Percentage (% of CTC) *
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
            {errors.basic && <span className="error-text">{errors.basic}</span>}
            <small className="field-note">Percentage of CTC for Basic Salary</small>
          </div>

          <div className="form-group">
            <label htmlFor="hraPercentage">
              HRA Percentage (% of Basic) *
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
            {errors.hra && <span className="error-text">{errors.hra}</span>}
            <small className="field-note">Percentage of Basic Salary for HRA</small>
          </div>

          <div className="form-group">
            <label htmlFor="pfPercentage">
              PF Percentage (% of Basic) *
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
            {errors.pf && <span className="error-text">{errors.pf}</span>}
            <small className="field-note">Percentage of Basic Salary for PF</small>
          </div>

          <div className="button-group">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving
                ? "Processing..."
                : configExists
                  ? "Update Configuration"
                  : "Create Configuration"}
            </button>

            <button type="button" className="reset-btn" onClick={handleReset} disabled={saving}>
              {configExists ? "Refresh" : "Clear"}
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