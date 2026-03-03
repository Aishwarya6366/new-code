
import { useEffect, useState } from "react";
import axios from "axios";
import "./HrLeaveManagement.css";

/* ── axios ── */
const api = axios.create({ baseURL: "/api", withCredentials: true });

export default function HrLeaveManagement() {
  /* ─── STATE ─── */
  const [leaves,    setLeaves]    = useState([]);
  const [form,      setForm]      = useState({ leaveName: "", noOfDays: "" });
  const [editId,    setEditId]    = useState(null);
  const [searchTerm,setSearchTerm]= useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [leaveNameError, setLeaveNameError] = useState("");
  const [noOfDaysError,  setNoOfDaysError]  = useState("");

  const [lopForm, setLopForm] = useState({ userName:"", fromDate:"", toDate:"", reason:"" });

  const [userNameError, setUserNameError] = useState("");
  const [dateError,     setDateError]     = useState("");
  const [reasonError,   setReasonError]   = useState("");

  /* ── notification: stored as array so multiple can stack ── */
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("leaveMaster");

  /* ─── FETCH ─── */
  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/leave-master/all");
      setLeaves(res.data);
    } catch (err) {
      showNotification("Error fetching leaves: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  /* ─── NOTIFICATION ─── */
  const showNotification = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  /* ─── LEAVE MASTER INPUT ─── */
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "leaveName") {
      value = value.replace(/[^A-Za-z\s]/g, "");
      if (value.trim() === "") {
        setLeaveNameError("");
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        setLeaveNameError("Leave name must contain only letters and spaces");
      } else if (value.length < 2) {
        setLeaveNameError("Leave name must be at least 2 characters");
      } else if (value.length > 50) {
        setLeaveNameError("Leave name cannot exceed 50 characters");
      } else {
        setLeaveNameError("");
      }
    }

    if (name === "noOfDays") {
      value = value.replace(/\D/g, "");
      if (value.length > 3) return;
      if (value === "") {
        setNoOfDaysError("");
      } else {
        const n = Number(value);
        if (n < 1)        { setNoOfDaysError("Number of days must be at least 1"); }
        else if (n > 366) { setNoOfDaysError("Number of days cannot exceed 366"); value = "366"; }
        else              { setNoOfDaysError(""); }
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleLopChange = (e) => {
    let { name, value } = e.target;
    if (name === "userName") {
      value = value.replace(/[^A-Za-z0-9]/g, "");
      if (value.length > 50) return;
      if (value === "") setUserNameError("");
      else if (value.length < 3) setUserNameError("Username must be at least 3 characters");
      else if (value.length > 50) setUserNameError("Username cannot exceed 50 characters");
      else setUserNameError("");
    }
    if (name === "reason") {
      if (value.length > 500) return;
      if (value === "") setReasonError("");
      else if (value.length < 10) setReasonError("Reason must be at least 10 characters");
      else if (value.length > 500) setReasonError("Reason cannot exceed 500 characters");
      else setReasonError("");
    }
    setLopForm({ ...lopForm, [name]: value });
  };

  /* ─── VALIDATION FUNCTIONS ─── */
  const validateLeaveMaster = () => {
    let hasError = false;

    // Leave Name validation
    if (!form.leaveName.trim()) {
      setLeaveNameError("Leave name is required");
      hasError = true;
    } else if (form.leaveName.trim().length < 2) {
      setLeaveNameError("Leave name must be at least 2 characters");
      hasError = true;
    } else if (form.leaveName.trim().length > 50) {
      setLeaveNameError("Leave name cannot exceed 50 characters");
      hasError = true;
    } else if (!/^[A-Za-z\s]+$/.test(form.leaveName.trim())) {
      setLeaveNameError("Leave name must contain only letters and spaces");
      hasError = true;
    }

    // Number of Days validation
    if (!form.noOfDays) {
      setNoOfDaysError("Number of days is required");
      hasError = true;
    } else {
      const n = Number(form.noOfDays);
      if (isNaN(n)) {
        setNoOfDaysError("Please enter a valid number");
        hasError = true;
      } else if (n < 1) {
        setNoOfDaysError("Number of days must be at least 1");
        hasError = true;
      } else if (n > 366) {
        setNoOfDaysError("Number of days cannot exceed 366");
        hasError = true;
      } else if (!Number.isInteger(n)) {
        setNoOfDaysError("Number of days must be a whole number");
        hasError = true;
      }
    }

    return !hasError;
  };

  const validateLOP = () => {
    let hasError = false;

    // Username validation
    if (!lopForm.userName.trim()) {
      setUserNameError("Employee username is required");
      hasError = true;
    } else if (lopForm.userName.trim().length < 3) {
      setUserNameError("Username must be at least 3 characters");
      hasError = true;
    } else if (lopForm.userName.trim().length > 50) {
      setUserNameError("Username cannot exceed 50 characters");
      hasError = true;
    } else if (!/^[A-Za-z0-9]+$/.test(lopForm.userName.trim())) {
      setUserNameError("Username must contain only letters and numbers");
      hasError = true;
    }

    // Reason validation
    if (!lopForm.reason.trim()) {
      setReasonError("Reason is required");
      hasError = true;
    } else if (lopForm.reason.trim().length < 10) {
      setReasonError("Reason must be at least 10 characters");
      hasError = true;
    } else if (lopForm.reason.trim().length > 500) {
      setReasonError("Reason cannot exceed 500 characters");
      hasError = true;
    }

    // Date validation
    if (!lopForm.fromDate || !lopForm.toDate) {
      setDateError("Both From Date and To Date are required");
      hasError = true;
    } else {
      const from = new Date(lopForm.fromDate);
      const to = new Date(lopForm.toDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (from > to) {
        setDateError("From date cannot be after To date");
        hasError = true;
      } else if (from < today) {
        setDateError("From date cannot be in the past");
        hasError = true;
      } else if (to < today) {
        setDateError("To date cannot be in the past");
        hasError = true;
      } else {
        // Check if dates are within reasonable range (e.g., not more than 1 year in future)
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        if (from > oneYearFromNow || to > oneYearFromNow) {
          setDateError("Dates cannot be more than 1 year in the future");
          hasError = true;
        } else {
          setDateError("");
        }
      }
    }

    return !hasError;
  };

  /* ─── SUBMIT LEAVE MASTER ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLeaveMaster()) return;

    setIsLoading(true);
    try {
      const payload = {
        leaveId:   editId ?? undefined,
        leaveName: form.leaveName.trim(),
        noOfDays:  Number(form.noOfDays),
      };

      if (editId) {
        await api.put(`/leave-master/updateLeaveMaster/${editId}`, payload);
        // Window alert for edit success
        window.alert(`✅ SUCCESS\n\nLeave type "${form.leaveName.trim()}" has been successfully updated!\n\nDays allocated: ${form.noOfDays}`);
        showNotification(`✅ Leave type "${form.leaveName.trim()}" updated successfully!`, "success");
      } else {
        await api.post("/leave-master/create", payload);
        // Window alert for create success
        window.alert(`✅ SUCCESS\n\nLeave type "${form.leaveName.trim()}" has been successfully created!\n\nDays allocated: ${form.noOfDays}`);
        showNotification(`✅ Leave type "${form.leaveName.trim()}" created successfully!`, "success");
      }

      setForm({ leaveName: "", noOfDays: "" });
      setEditId(null);
      setLeaveNameError("");
      setNoOfDaysError("");
      fetchLeaves();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to save leave type";
      // Window alert for error
      window.alert(`❌ ERROR\n\n${errorMessage}\n\nPlease try again or contact support.`);
      showNotification("❌ " + errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (leave) => {
    setForm({ leaveName: leave.leaveName, noOfDays: leave.noOfDays });
    setEditId(leave.leaveId);
    setActiveTab("leaveMaster");
    setLeaveNameError("");
    setNoOfDaysError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const leaveToDelete = leaves.find(l => l.leaveId === id);
    
    if (!window.confirm(`⚠️ CONFIRM DELETE\n\nAre you sure you want to delete "${leaveToDelete?.leaveName}"?\n\nThis action cannot be undone.`)) return;
    
    setIsLoading(true);
    try {
      await api.delete(`/leave-master/deleteLeaveMaster/${id}`);
      // Window alert for delete success
      window.alert(`🗑️ DELETED\n\nLeave type "${leaveToDelete?.leaveName}" has been successfully deleted.`);
      showNotification("🗑️ Leave type deleted successfully", "success");
      fetchLeaves();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete leave type";
      // Window alert for delete error
      window.alert(`❌ DELETE FAILED\n\n${errorMessage}\n\nPlease try again.`);
      showNotification("❌ " + errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (editId) {
      if (window.confirm("Cancel editing? Any unsaved changes will be lost.")) {
        setForm({ leaveName: "", noOfDays: "" });
        setEditId(null);
        setLeaveNameError("");
        setNoOfDaysError("");
      }
    } else {
      setForm({ leaveName: "", noOfDays: "" });
      setEditId(null);
      setLeaveNameError("");
      setNoOfDaysError("");
    }
  };

  /* ─── SUBMIT LOP ─── */
  const submitLOP = async (e) => {
    e.preventDefault();
    
    if (!validateLOP()) return;

    // Calculate number of days for confirmation
    const from = new Date(lopForm.fromDate);
    const to = new Date(lopForm.toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Confirmation dialog
    if (!window.confirm(
      `⚠️ CONFIRM LOP RECORD\n\n` +
      `Employee: ${lopForm.userName.trim()}\n` +
      `Period: ${lopForm.fromDate} to ${lopForm.toDate}\n` +
      `Days: ${diffDays} day${diffDays > 1 ? 's' : ''}\n` +
      `Reason: ${lopForm.reason.trim().substring(0, 50)}${lopForm.reason.length > 50 ? '...' : ''}\n\n` +
      `This will mark these days as Loss of Pay. Continue?`
    )) return;

    setIsLoading(true);
    try {
      const payload = {
        userName:  lopForm.userName.trim(),
        fromDate:  lopForm.fromDate,
        toDate:    lopForm.toDate,
        reason:    lopForm.reason.trim(),
      };
      await api.post("/leave-record/update-lop", payload);
      
      // Window alert for LOP success
      window.alert(
        `✅ LOP RECORDED\n\n` +
        `Loss of Pay has been successfully recorded for:\n\n` +
        `Employee: ${lopForm.userName.trim()}\n` +
        `Period: ${lopForm.fromDate} to ${lopForm.toDate}\n` +
        `Total Days: ${diffDays}\n\n` +
        `A notification has been sent to the employee.`
      );
      
      showNotification(
        `✅ LOP recorded for "${lopForm.userName.trim()}" — notification sent to employee!`,
        "success"
      );
      
      setLopForm({ userName: "", fromDate: "", toDate: "", reason: "" });
      setUserNameError(""); setDateError(""); setReasonError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to record LOP";
      // Window alert for LOP error
      window.alert(`❌ LOP FAILED\n\n${errorMessage}\n\nPlease verify the employee username and try again.`);
      showNotification("❌ " + errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── DERIVED ─── */
  const filteredLeaves    = leaves.filter(l =>
    l.leaveName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalLeaveTypes   = leaves.length;
  const totalDays         = leaves.reduce((s, l) => s + l.noOfDays, 0);

  /* ─── TICKER ITEMS ─── */
  const tickerItems = [
    { icon: "🏖️",  label: "Annual Leave" },
    { icon: "🤒",  label: "Sick Leave" },
    { icon: "🍼",  label: "Maternity Leave" },
    { icon: "⚡",  label: "Emergency Leave" },
    { icon: "📋",  label: "Casual Leave" },
    { icon: "🌿",  label: "Sabbatical" },
    { icon: "💔",  label: "Bereavement" },
    { icon: "🏥",  label: "Medical Leave" },
  ];
  // duplicate for seamless loop
  const allTicker = [...tickerItems, ...tickerItems];

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="hr-leave-container">

      {/* ══════════ TOAST NOTIFICATIONS ══════════ */}
      {notifications.map((n, i) => (
        <div
          key={n.id}
          className={`notification notification-${n.type}`}
          style={{ top: 24 + i * 100 + "px" }}
        >
          <div className="notification-icon">
            {n.type === "success" ? "✓" : "✕"}
          </div>
          <div className="notification-body">
            <div className="notification-title">
              {n.type === "success" ? "Success" : "Error"}
            </div>
            <div className="notification-message">{n.message}</div>
          </div>
          <button
            className="notification-close"
            onClick={() => dismissNotification(n.id)}
          >×</button>
        </div>
      ))}

      {/* ══════════ HERO BANNER ══════════ */}
      <div className="hero-banner">
        <span className="hero-sparkle hs1">✦</span>
        <span className="hero-sparkle hs2">★</span>
        <span className="hero-sparkle hs3">✦</span>
        <span className="hero-sparkle hs4">✸</span>
        <span className="hero-sparkle hs5">✦</span>

        <div className="hero-text">
          
          <h1 className="hero-title">Leave Management</h1>
          <p className="hero-sub">
            Manage leave types and Loss of Pay records efficiently
          </p>
        </div>

       
      </div>

    

      {/* ══════════ CONTENT ══════════ */}
      <div className="leave-content">

        {/* ── Stats ── */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-ring" />
            <div className="stat-label">📋 Total Leave Types</div>
            <div className="stat-value">{totalLeaveTypes}</div>
          </div>
 
          <div className="stat-card">
            <div className="stat-ring" />
            <div className="stat-label">👤 Active Session</div>
            <div className="stat-value" style={{ fontSize: 22, paddingTop: 8, color: "#5c5751", fontFamily: "var(--font)" }}>
              HR Admin
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "leaveMaster" ? "active" : ""}`}
            onClick={() => setActiveTab("leaveMaster")}
          >
            <span className="tab-icon">📋</span> Leave Master
          </button>
          <button
            className={`tab-btn ${activeTab === "lop" ? "active" : ""}`}
            onClick={() => setActiveTab("lop")}
          >
            <span className="tab-icon">⚠️</span> Record LOP
          </button>
        </div>

        {/* ════ LEAVE MASTER TAB ════ */}
        {activeTab === "leaveMaster" && (
          <>
            {/* Form */}
            <div className="leave-form-container">
              <div className="form-header">
                <h3>
                  {editId ? "✏️ Edit Leave Type" : "➕ Add New Leave Type"}
                </h3>
                {editId && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCancelEdit}
                  >
                    ✕ Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="leave-form">
                {/* Leave Name */}
                <div className="form-group">
                  <label htmlFor="leaveName">
                    Leave Type Name <span className="required">*</span>
                  </label>
                  <input
                    id="leaveName"
                    type="text"
                    name="leaveName"
                    placeholder="e.g., Annual Leave, Sick Leave"
                    value={form.leaveName}
                    onChange={handleChange}
                    maxLength={50}
                    className={leaveNameError ? "input-error" : ""}
                    required
                  />
                  {leaveNameError && (
                    <div className="field-error">{leaveNameError}</div>
                  )}
                  <small className="form-help">
                    {form.leaveName.length}/50 characters - Letters and spaces only
                  </small>
                </div>

                {/* Number of Days */}
                <div className="form-group">
                  <label htmlFor="noOfDays">
                    Number of Days <span className="required">*</span>
                  </label>
                  <input
                    id="noOfDays"
                    type="number"
                    name="noOfDays"
                    placeholder="e.g., 15"
                    value={form.noOfDays}
                    onChange={handleChange}
                    min="1" max="366"
                    step="1"
                    className={noOfDaysError ? "input-error" : ""}
                    required
                  />
                  {noOfDaysError && (
                    <div className="field-error">{noOfDaysError}</div>
                  )}
                  <small className="form-help">
                    Must be between 1 and 366 days
                  </small>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className={editId ? "update-btn" : "btn btn-primary"}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? <><span style={{ animation: "spin 0.8s linear infinite", display:"inline-block" }}>⟳</span> Processing…</>
                      : editId
                        ? "💾 Update Leave Type"
                        : "➕ Add Leave Type"}
                  </button>
                </div>
              </form>
            </div>

            {/* Table */}
            <div className="table-section">
              <div className="table-header">
                <h3>📂 Leave Types Directory</h3>
                <div className="table-actions">
                  <input
                    type="text"
                    className="search-box"
                    placeholder="Search leave types..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="hr-leave-table-wrapper">
                {isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner" />
                    <p className="loading">Loading leave types…</p>
                  </div>
                ) : filteredLeaves.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-state-icon">📭</span>
                    <h4>No Leave Types Found</h4>
                    <p>
                      {searchTerm
                        ? "No leave types match your search"
                        : "Start by adding your first leave type above"}
                    </p>
                  </div>
                ) : (
                  <table className="hr-leave-table">
                    <thead>
                      <tr>
                        <th style={{ width: "12%" }}>ID</th>
                        <th style={{ width: "40%" }}>Leave Type</th>
                        <th style={{ width: "24%" }}>Days Allocated</th>
                        <th style={{ width: "24%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaves.map(leave => (
                        <tr key={leave.leaveId}>
                          <td>{leave.leaveId}</td>
                          <td><strong>{leave.leaveName}</strong></td>
                          <td>
                            <span className="days-badge">{leave.noOfDays} days</span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="edit-btn"
                                onClick={() => handleEdit(leave)}
                                disabled={isLoading}
                              >
                                ✏️ Edit
                              </button>
                              {/* <button
                                className="delete-btn"
                                onClick={() => handleDelete(leave.leaveId)}
                                disabled={isLoading}
                              >
                                🗑️ Delete
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {/* ════ LOP TAB ════ */}
        {activeTab === "lop" && (
          <div className="leave-form-container">
            <div className="form-header">
              <h3>⚠️ Record Loss of Pay (LOP)</h3>
            </div>

            <form onSubmit={submitLOP} className="lop-form">
              {/* Employee Username */}
              <div className="form-group">
                <label htmlFor="userName">
                  Employee ID <span className="required">*</span>
                </label>
                <input
                  id="userName"
                  type="text"
                  name="userName"
                  placeholder="e.g., VPPL038"
                  value={lopForm.userName}
                  onChange={handleLopChange}
                  maxLength={50}
                  className={userNameError ? "input-error" : ""}
                  required
                />
                {userNameError && (
                  <div className="field-error">{userNameError}</div>
                )}
                <small className="form-help">
                  {lopForm.userName.length}/50 characters - Letters and numbers only
                </small>
              </div>

              {/* From Date */}
              <div className="form-group">
                <label htmlFor="fromDate">
                  From Date <span className="required">*</span>
                </label>
                <input
                  id="fromDate"
                  type="date"
                  name="fromDate"
                  value={lopForm.fromDate}
                  onChange={handleLopChange}
                  min={new Date().toISOString().split('T')[0]}
                  max={lopForm.toDate || undefined}
                  className={dateError ? "input-error" : ""}
                  required
                />
              </div>

              {/* To Date */}
              <div className="form-group">
                <label htmlFor="toDate">
                  To Date <span className="required">*</span>
                </label>
                <input
                  id="toDate"
                  type="date"
                  name="toDate"
                  value={lopForm.toDate}
                  onChange={handleLopChange}
                  min={lopForm.fromDate || new Date().toISOString().split('T')[0]}
                  className={dateError ? "input-error" : ""}
                  required
                />
                {dateError && (
                  <div className="field-error">{dateError}</div>
                )}
              </div>

              {/* Reason */}
              <div className="form-group full-width">
                <label htmlFor="reason">
                  Reason for LOP <span className="required">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  placeholder="Enter detailed reason for Loss of Pay (min. 10 characters)..."
                  value={lopForm.reason}
                  onChange={handleLopChange}
                  rows={4}
                  maxLength={500}
                  className={reasonError ? "input-error" : ""}
                  required
                />
                {reasonError && (
                  <div className="field-error">{reasonError}</div>
                )}
                <small className="form-help">
                  {lopForm.reason.length}/500 characters - Minimum 10 characters required
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <><span style={{ animation:"spin 0.8s linear infinite", display:"inline-block" }}>⟳</span> Recording LOP…</>
                    : "📨 Record LOP & Send Notification"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}