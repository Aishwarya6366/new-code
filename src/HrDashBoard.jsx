import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./HrDashBoard.css";
import ventureBizLogo from "./assets/venturebiz_logo.png";

import HrEmployeeManagement from "./HrEmployeeManagement";
import HrSalaryManagement   from "./HrSalaryManagement";
import Department           from "./Department";
import EmpMgr               from "./EmpMgr";
import HrLeaveManagement    from "./HrLeaveManagement";
import HolidayCalendar      from "./HolidayCalendar";
import CtcPer               from "./CtcPer";

/* ═══════════════════════════════════════════════════
   FLOATING CARTOON CHARACTERS
═══════════════════════════════════════════════════ */
const FLOAT_ITEMS = [
  "👨‍💼","👩‍💻","📊","🏢","💡","🎯","🚀","💼",
  "📈","🌟","👩‍🎤","🧑‍🔬","🎪","🏆","💰","🤝",
  "📝","🎨","🦸","🧑‍💼","🎭","🌈","⭐","🎉",
];
const FloatingCartoons = () => (
  <div className="hr-floats" aria-hidden="true">
    {FLOAT_ITEMS.map((icon, i) => (
      <span key={i} className={`hr-float fc${(i % 6) + 1} fi-${i}`}>{icon}</span>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════
   STANDARD SVG ICONS
═══════════════════════════════════════════════════ */
const IcoUser = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoLock = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IcoLogout = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IcoKey = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="4.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
);
const IcoEye = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IcoEyeOff = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IcoChevron = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IcoStar = ({ size = 16, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcoShield = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoZap = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoActivity = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IcoSearch = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoRefresh = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

/* NAV icons */
const IcoDashboard  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IcoEmployee   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoDept       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoSalary = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 4h12" />
    <path d="M6 8h12" />
    <path d="M9 4c3 0 5 2 5 4s-2 4-5 4h-3" />
    <path d="M9 12l6 8" />
  </svg>
);
const IcoManager    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v4"/><path d="M10 15h4"/></svg>;
const IcoLeave      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/></svg>;
const IcoHoliday    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IcoCTC        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

/* ═══════════════════════════════════════════════════
   SMART FIELD
═══════════════════════════════════════════════════ */
function SmartField({ label, icon, value, onChange, placeholder,
                      type = "text", validate, maxLen, hint, min, max,
                      touched, onTouch }) {
  const [focused, setFocused] = useState(false);
  const error = (touched && value) ? validate?.(value) : null;
  const isOk  = touched && value && !validate?.(value);
  const isEmpId = label === "Employee ID";
  const maxDisplay = maxLen || 8;
  const progress = isEmpId && value ? Math.round((value.length / maxDisplay) * 100) : null;

  return (
    <div className={["sf", focused?"sf-focus":"", error?"sf-error":"", isOk?"sf-ok":""].filter(Boolean).join(" ")}>
      <label className="sf-label">
        {icon && <span className="sf-icon">{icon}</span>}
        {label}
        {isEmpId && value && <span className="sf-progress-text">{value.length}/{maxDisplay}</span>}
      </label>
      <div className="sf-inp-wrap">
        <input className="sf-inp" type={type} placeholder={placeholder}
          value={value} maxLength={maxLen} min={min} max={max}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onTouch?.(); }}
        />
        {!(!value) && touched && (
          <span className={`sf-badge ${isOk ? "sf-badge-ok" : "sf-badge-err"}`}>
            {isOk ? "✓" : "!"}
          </span>
        )}
      </div>
      {isEmpId && value && (
        <div className="sf-prog-bar">
          <div className="sf-prog-fill" style={{ width:`${progress}%`, background: error?"#ef4444":isOk?"#16a34a":"#f97316" }}/>
        </div>
      )}
      {error && <p className="sf-err">{error}</p>}
      {hint && focused && !error && !touched && <p className="sf-hint">{hint}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INFO CARD
═══════════════════════════════════════════════════ */
function InfoCard({ title, items, highlight }) {
  return (
    <div className="ic">
      <div className="ic-head">{title}</div>
      <div className="ic-body">
        {items.map(([label, value], i) => (
          <div key={i} className="ic-row">
            <span className="ic-lbl">{label}</span>
            <span className={`ic-val${highlight===i?" ic-hl":""}`}>{value ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* NAV ITEMS */
const NAV_ITEMS = [
  ["dashboard",       "Dashboard",  <IcoDashboard />],
  ["employee",        "Employee",   <IcoEmployee />],
  ["department",      "Department", <IcoDept />],
  ["salary",          "Salary",     <IcoSalary />],
  ["manager",         "Manager",    <IcoManager />],
  ["leave",           "Leave",      <IcoLeave />],
  ["holidaycalendar", "Holidays",   <IcoHoliday />],
  ["ctc",             "CTC %",      <IcoCTC />],
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function HrDashBoard() {
  const [logout,       setLogout]       = useState(false);
  const [activePage,   setActivePage]   = useState("dashboard");
  const [showProfile,  setShowProfile]  = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword,       setNewPassword]       = useState("");
  const [confirmPassword,   setConfirmPassword]   = useState("");
  const [showNewPwd,        setShowNewPwd]        = useState(false);
  const [showConfirmPwd,    setShowConfirmPwd]    = useState(false);
  const [pwdLoading,        setPwdLoading]        = useState(false);
  const [pwdErrors,         setPwdErrors]         = useState({});
  const strongPwdRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  const [sp, setSp] = useState({
    username: "", firstName: "", departmentName: "",
    designationName: "", startDate: "", endDate: ""
  });
  const [touched,             setTouched]             = useState({});
  const [generalError,        setGeneralError]        = useState("");
  const [searchResults,       setSearchResults]       = useState([]);
  const [loadingSearch,       setLoadingSearch]       = useState(false);
  const [selectedEmployee,    setSelectedEmployee]    = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [documents,           setDocuments]           = useState([]);
  const [loadingDocuments,    setLoadingDocuments]    = useState(false);

  if (logout) return <Navigate to="/" replace />;

  const setField   = (key, val) => { setSp(prev => ({ ...prev, [key]: val })); setGeneralError(""); };
  const touchField = (key)      => setTouched(prev => ({ ...prev, [key]: true }));

  /* ── Date formatter: handles [y,m,d] array OR "YYYY-MM-DD" string ── */
  const fmt = (d) => {
    if (!d) return "N/A";
    // If it's an array like [2023, 5, 15]
    if (Array.isArray(d) && d.length >= 3) {
      const [y, m, day] = d;
      return `${String(day).padStart(2,"0")}/${String(m).padStart(2,"0")}/${y}`;
    }
    // If it's a string like "2023-05-15"
    if (typeof d === "string" && d.includes("-")) {
      const [y, m, day] = d.split("-");
      return `${day}/${m}/${y}`;
    }
    return "N/A";
  };

  /* ── VALIDATORS ── */
  // FIX: Allow 7 chars (VPPL001) OR 8 chars (VPPL0001)
  const vUsername = (v) => {
    if (!v) return null;
    if (/^[A-Z]{1,4}$/.test(v)) return null;           // still typing prefix
    if (/^[A-Z]{4}[0-9]{1,3}$/.test(v)) return null;   // still typing digits
    if (/^[A-Z]{4}[0-9]{3,4}$/.test(v)) return null;   // ✅ valid: 7 or 8 chars
    if (v.length < 7) return `Keep typing: 4 letters + 3–4 digits (${v.length}/7–8 chars)`;
    return "Format: VPPL001 or VPPL0001";
  };
  const vFirstName = (v) => { if (!v) return null; if (!/^[A-Za-z]+$/.test(v)) return "Only letters allowed"; return null; };
  const vDept      = (v) => { if (!v) return null; if (!/^[A-Za-z ]+$/.test(v)) return "Only letters and spaces allowed"; return null; };
  const vDesig     = (v) => { if (!v) return null; if (!/^[A-Za-z ]+$/.test(v)) return "Only letters and spaces allowed"; return null; };
  const vDateRange = () => {
    if (sp.startDate && sp.endDate && new Date(sp.startDate) > new Date(sp.endDate))
      return "Start date must be before end date";
    return null;
  };
  const hasFieldError = () =>
    vUsername(sp.username) || vFirstName(sp.firstName) ||
    vDept(sp.departmentName) || vDesig(sp.designationName) || vDateRange();

  /* ── SEARCH ── */
  const searchEmployees = async () => {
  const { username, firstName, departmentName, designationName, startDate, endDate } = sp;

  setTouched({
    username: true, firstName: true,
    departmentName: true, designationName: true,
    startDate: true, endDate: true
  });

  if (!username && !firstName && !departmentName && !designationName && !startDate && !endDate) {
    setGeneralError("Please fill in at least one field to search.");
    return;
  }
  if (hasFieldError()) {
    setGeneralError("Please fix the highlighted errors before searching.");
    return;
  }

  setGeneralError("");

  try {
    setLoadingSearch(true);

    const params = new URLSearchParams();
    if (username.trim())        params.append("username",        username.trim());
    if (firstName.trim())       params.append("firstName",       firstName.trim());
    if (departmentName.trim())  params.append("departmentName",  departmentName.trim());
    if (designationName.trim()) params.append("designationName", designationName.trim());
    if (startDate)              params.append("startDate",       startDate);
    if (endDate)                params.append("endDate",         endDate);

    const url = `/api/hr/search?${params.toString()}`;
    console.log("🔍 Search URL:", url);

    const { data } = await axios.get(url, { withCredentials: true });

    // ── DEBUG: log exactly what the backend returned ──
    console.log("✅ API response type:", typeof data);
    console.log("✅ API response isArray:", Array.isArray(data));
    console.log("✅ API response data:", data);

    if (Array.isArray(data)) {
      setSearchResults(data);
      if (data.length === 0) {
        setGeneralError("No employees found matching the given criteria.");
      }
    } else if (data && typeof data === "object") {
      // Some backends wrap results: { content: [...] } or { employees: [...] }
      const possibleArray =
        data.content || data.employees || data.data || data.result || data.results || [];
      console.log("⚠️ Response is object, trying nested array:", possibleArray);
      setSearchResults(Array.isArray(possibleArray) ? possibleArray : [data]);
      if (!possibleArray.length) {
        setGeneralError("No employees found matching the given criteria.");
      }
    } else {
      console.error("❌ Unexpected response format:", data);
      setSearchResults([]);
      setGeneralError("Unexpected response from server.");
    }

    setSelectedEmployee(null);
    setDocuments([]);
    setShowEmployeeDetails(false);

  } catch (err) {
    console.error("❌ Search error status:", err.response?.status);
    console.error("❌ Search error data:", err.response?.data);
    console.error("❌ Search error message:", err.message);
    setGeneralError(
      err.response?.data?.message ||
      err.response?.data ||
      `Error ${err.response?.status ?? ""}: Search failed. Please try again.`
    );
  } finally {
    setLoadingSearch(false);
  }
};

  /* ── FETCH DOCUMENTS ── */
  const fetchDocs = async (userId) => {
    try {
      setLoadingDocuments(true);
      const { data } = await axios.get(`/api/hr/search-doc/${userId || 7}`, { withCredentials: true });
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Doc fetch error:", err);
      setDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

 // OLD (broken): fetchDocs(emp.userId || 7)  ← always used ID 7 as fallback!
// NEW: re-fetches the full employee object by username, then uses their real userId
const viewEmployee = async (emp) => {
  setShowEmployeeDetails(true);
  setSelectedEmployee(emp);     // show basic info immediately
  setDocuments([]);
  setEmpDetailLoading(true);
  try {
    const { data } = await axios.get(`/api/hr/search`, {
      params: { username: emp.username },
      withCredentials: true,
    });
    const fullEmp = Array.isArray(data) ? data[0] : data;
    if (fullEmp) {
      setSelectedEmployee(fullEmp);
      fetchDocs(fullEmp.userId ?? fullEmp.id ?? emp.userId ?? emp.id);
    }
  } catch (err) {
    fetchDocs(emp.userId ?? emp.id);
  } finally {
    setEmpDetailLoading(false);
  }
};

  /* ── DOWNLOAD ── */
  const download = async (docPath, name) => {
    try {
      const res = await axios.get(`/api/${docPath}`, {
        withCredentials: true, responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = Object.assign(document.createElement("a"), { href: url });
      a.setAttribute("download", `${name}.pdf`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  /* ── RESET ── */
  const reset = () => {
    setSp({ username:"", firstName:"", departmentName:"", designationName:"", startDate:"", endDate:"" });
    setTouched({});
    setGeneralError("");
    setSearchResults([]);
    setSelectedEmployee(null);
    setDocuments([]);
    setShowEmployeeDetails(false);
  };

  const navTo = (key) => { setActivePage(key); reset(); };
  const openPasswordModal = () => { setShowProfile(false); setShowPasswordModal(true); };
  const closeModal = () => {
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    setPwdErrors({});
  };

  /* ── UPDATE PASSWORD ── */
  const updatePassword = async () => {
    const errs = {};
    if (!newPassword) errs.np = "New password is required";
    else if (!strongPwdRe.test(newPassword))
      errs.np = "8–16 chars · uppercase · lowercase · number · special (@$!%*?&)";
    if (!confirmPassword) errs.cp = "Please confirm your password";
    else if (newPassword && confirmPassword !== newPassword) errs.cp = "Passwords do not match";
    setPwdErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      setPwdLoading(true);
      await axios.put("/api/password", { password: newPassword }, { withCredentials: true });
      alert("Password updated successfully");
      closeModal();
    } catch (err) {
      setPwdErrors({ api: err.response?.data?.message || "Failed. Please try again." });
    } finally {
      setPwdLoading(false);
    }
  };

  /* ── FORMAT CURRENCY as Indian Rupees ── */
  const formatINR = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    const num = Number(val);
    if (isNaN(num)) return "—";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  /* ── RENDER CONTENT ── */
  const renderContent = () => {
    switch (activePage) {
      case "employee":        return <HrEmployeeManagement />;
      case "department":      return <Department />;
      case "salary":          return <HrSalaryManagement />;
      case "ctc":             return <CtcPer />;
      case "manager":         return <EmpMgr />;
      case "leave":           return <HrLeaveManagement />;
      case "holidaycalendar": return <HolidayCalendar />;
      default:                return renderDashboard();
    }
  };

  /* ═══════════════════════════════════════════════════
     DASHBOARD
  ═══════════════════════════════════════════════════ */
  const renderDashboard = () => {
    const dateErr = vDateRange();
    return (
      <div className="dh">

        {/* ── GRADIENT HERO BANNER ── */}
        <div className="hero-banner">
          <span className="hb-shape s1"/>
          <span className="hb-shape s2"/>
          <span className="hb-shape s3"/>
          <span className="hb-dot d1"/>
          <span className="hb-dot d2"/>
          <span className="hb-dot d3"/>
          <span className="hb-star st1"><IcoStar size={14} /></span>
          <span className="hb-star st2"><IcoStar size={10} /></span>
          <span className="hb-star st3"><IcoStar size={18} /></span>

          <div className="hb-left">
            
              
            
            <h1 className="hb-title">
              Good day, <span className="hb-name">HR Admin</span> <span className="wave">👋</span>
            </h1>
            <p className="hb-desc">
              Your complete workforce management hub — search, review and manage employees with ease.
            </p>
            <div className="hb-chips">
              <span className="hb-chip chip-green"><IcoActivity size={12}/> System Online</span>
              <span className="hb-chip chip-blue"><IcoZap size={12}/> Live Data</span>
              <span className="hb-chip chip-org"><IcoShield size={12}/> Secure</span>
            </div>
          </div>

        </div>

        {/* ── MODULE CARDS ── */}
        <div className="mod-grid">
          {[
            { icon:<IcoEmployee />, label:"Employee Management", sub:"Manage staff",    color:"#3b82f6", page:"employee"        },
            { icon:<IcoDept />,     label:"Department",           sub:"Org structure",   color:"#8b5cf6", page:"department"      },
            { icon:<IcoSalary />,   label:"Salary Management",    sub:"Payroll & pay",   color:"#10b981", page:"salary"          },
            { icon:<IcoManager />,  label:"Manager",              sub:"Team leads",      color:"#f97316", page:"manager"         },
            { icon:<IcoLeave />,    label:"Leave Management",     sub:"Time off",        color:"#ec4899", page:"leave"           },
            { icon:<IcoHoliday />,  label:"Holiday Calendar",     sub:"Public holidays", color:"#06b6d4", page:"holidaycalendar" },
            { icon:<IcoCTC />,      label:"Set CTC %",            sub:"Salary split",    color:"#f59e0b", page:"ctc"             },
          ].map((m, i) => (
            <button key={i} className="mcard" style={{ "--mc": m.color }} onClick={() => navTo(m.page)}>
              <div className="mcard-top">
                <div className="mcard-ic">{m.icon}</div>
                <span className="mcard-sub">{m.sub}</span>
              </div>
              <span className="mcard-lbl">{m.label}</span>
              <span className="mcard-go">Open →</span>
              <div className="mcard-bar"/>
            </button>
          ))}
        </div>

        {/* ── SEARCH PANEL ── */}
        <div className="sp">
          <div className="sp-hd">
            <div className="sp-hd-icon"><IcoSearch size={28}/></div>
            <div>
              <h2 className="sp-title">Advanced Employee Search</h2>
              <p className="sp-sub">Search by any combination of fields below</p>
            </div>
          </div>

          {generalError && (
            <div className="g-err" key={generalError}>
              <span className="g-err-icon">⚠</span>
              <span>{generalError}</span>
              <button className="g-err-x" onClick={() => setGeneralError("")}>✕</button>
            </div>
          )}

          <div className="sp-grid">
            {/* Employee ID — max 8 chars for VPPL0001 */}
            <SmartField
              label="Employee ID"
             
              value={sp.username}
              placeholder="e.g. VPPL001 or VPPL0001"
              maxLen={8}
              hint="4 uppercase letters followed by 3–4 digits"
              validate={vUsername}
              touched={touched.username}
              onTouch={() => touchField("username")}
              onChange={v => setField("username", v.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8))}
            />
            <SmartField
              label="First Name"
              
              value={sp.firstName}
              placeholder="e.g. John"
              hint="Letters only"
              validate={vFirstName}
              touched={touched.firstName}
              onTouch={() => touchField("firstName")}
              onChange={v => setField("firstName", v.replace(/[^A-Za-z]/g,""))}
            />
            <SmartField
              label="Department"
             
              value={sp.departmentName}
              placeholder="e.g. Finance"
              hint="Letters and spaces only"
              validate={vDept}
              touched={touched.departmentName}
              onTouch={() => touchField("departmentName")}
              onChange={v => setField("departmentName", v.replace(/[^A-Za-z ]/g,""))}
            />
            <SmartField
              label="Designation"
              
              value={sp.designationName}
              placeholder="e.g. Analyst"
              hint="Letters and spaces only"
              validate={vDesig}
              touched={touched.designationName}
              onTouch={() => touchField("designationName")}
              onChange={v => setField("designationName", v.replace(/[^A-Za-z ]/g,""))}
            />
            <SmartField
              label="Date of Joining — From"
              
              type="date"
              value={sp.startDate}
              max={new Date().toISOString().split("T")[0]}
              touched={touched.startDate}
              onTouch={() => touchField("startDate")}
              onChange={v => setField("startDate", v)}
            />
            <SmartField
              label="Date of Joining — To"
              
              type="date"
              value={sp.endDate}
              min={sp.startDate || undefined}
              max={new Date().toISOString().split("T")[0]}
              validate={() => dateErr}
              touched={touched.endDate}
              onTouch={() => touchField("endDate")}
              onChange={v => setField("endDate", v)}
            />
          </div>

          <div className="sp-btns">
            <button className="btn-search" onClick={searchEmployees} disabled={loadingSearch}>
              {loadingSearch
                ? <><span className="spin"/> Searching…</>
                : <><IcoSearch size={15}/> Search Employees</>
              }
            </button>
            <button className="btn-reset" onClick={reset}>
              <IcoRefresh size={15}/> Reset
            </button>
          </div>
        </div>

        {/* ── RESULTS TABLE ── */}
        {searchResults.length > 0 && !showEmployeeDetails && (
          <div className="rt">
            <div className="rt-hd">
              <div className="rt-title-row">
                <h3>Search Results</h3>
                <span className="rt-badge">{searchResults.length} found</span>
              </div>
              <button className="ghost-btn" onClick={reset}>✕ Clear</button>
            </div>
            <div className="t-scroll">
              <table className="etable">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Full Name</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Date of Joining</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((emp, i) => (
                    <tr key={i}>
                      <td><span className="epill">{emp.username}</span></td>
                      <td className="ename">{emp.firstName} {emp.lastName}</td>
                      <td>{emp.departmentName}</td>
                      <td><span className="dchip">{emp.designationName}</span></td>
                      <td>{fmt(emp.dateOfJoining)}</td>
                      <td>
                        <button className="view-btn" onClick={() => viewEmployee(emp)}>
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EMPLOYEE DETAIL VIEW ── */}
        {selectedEmployee && showEmployeeDetails && (
          <div className="edv">
            <div className="edv-banner">
              <div className="edv-left">
                <div className="edv-av">
                  {selectedEmployee.firstName?.[0]}{selectedEmployee.lastName?.[0]}
                </div>
                <div>
                  <h2>{selectedEmployee.firstName} {selectedEmployee.middleName ?? ""} {selectedEmployee.lastName}</h2>
                  <p>{selectedEmployee.designationName} · {selectedEmployee.departmentName}</p>
                </div>
              </div>
              <div className="edv-right">
                <span className="epill">{selectedEmployee.username}</span>
                <button className="ghost-btn" onClick={() => setShowEmployeeDetails(false)}>← Back</button>
              </div>
            </div>

            <div className="edv-grid">
              {/* Personal */}
              <InfoCard
                title="👤 Personal Information"
                items={[
                  ["Full Name", `${selectedEmployee.firstName ?? ""} ${selectedEmployee.middleName ?? ""} ${selectedEmployee.lastName ?? ""}`.trim()],
                  ["Email",           selectedEmployee.emailId],
                  ["Phone",           selectedEmployee.phoneNumber],
                  ["Date of Birth",   fmt(selectedEmployee.dob)],
                  ["Gender",          selectedEmployee.gender],
                  ["Marital Status",  selectedEmployee.maritalStatus],
                  ["Blood Group",     selectedEmployee.bloodGroup],
                  ["Nationality",     selectedEmployee.nationality],
                ]}
              />

              {/* Employment */}
              <InfoCard
                title="💼 Employment"
                items={[
                  ["Department",     selectedEmployee.departmentName],
                  ["Designation",    selectedEmployee.designationName],
                  ["Work Location",  selectedEmployee.workLocation],
                  ["Date of Joining",fmt(selectedEmployee.dateOfJoining)],
                  ["PF UAN",         selectedEmployee.pfUan],
                  ["ESI",            selectedEmployee.esi],
                ]}
              />

              {/* Financial — ₹ Indian Rupee symbol */}
              <InfoCard
                title="💰 Financial"
                highlight={0}
                items={[
                  ["CTC",         formatINR(selectedEmployee.ctc)],
                  ["Basic",       formatINR(selectedEmployee.basic)],
                  ["HRA",         formatINR(selectedEmployee.hra)],
                  ["Conveyance",  formatINR(selectedEmployee.conveyanceAllowance)],
                  ["PF",          formatINR(selectedEmployee.pf)],
                ]}
              />

              {/* Bank */}
              <InfoCard
                title="🏦 Bank"
                items={[
                  ["Bank Name",       selectedEmployee.bankName],
                  ["Account Number",  selectedEmployee.accountNumber],
                  ["IFSC Code",       selectedEmployee.ifsc],
                  ["Branch",          selectedEmployee.branchName],
                  ["Beneficiary",     selectedEmployee.beneficiaryName],
                ]}
              />

              {/* Identity */}
              <InfoCard
                title="🆔 Identity"
                items={[
                  ["PAN Number",    selectedEmployee.panNumber],
                  ["Aadhaar Number",selectedEmployee.aadhaarNumber],
                ]}
              />

              {/* Address */}
              <InfoCard
                title="📍 Address"
                items={[
                  ["Address Line 1", selectedEmployee.address1],
                  ["Address Line 2", selectedEmployee.address2],
                ]}
              />

              {/* Emergency */}
              <InfoCard
                title="🚨 Emergency"
                items={[
                  ["Name",     selectedEmployee.emergencyContactName],
                  ["Phone",    selectedEmployee.emergencyPhoneNumber],
                  ["Relation", selectedEmployee.emergencyContactRelation],
                ]}
              />

              {/* Documents */}
              {documents.length > 0 && (
                <div className="ic ic-full">
                  <div className="ic-head">📎 Employee Documents</div>
                  {loadingDocuments ? (
                    <p className="ldg">Loading…</p>
                  ) : (
                    <div className="doc-list">
                      {documents.map((doc, i) => (
                        <div key={i} className="doc-item">
                          <div className="doc-l">
                            <span className="doc-ico">📄</span>
                            <div>
                              <div className="doc-nm">{doc.documentName}</div>
                              <div className="doc-id">ID: {doc.docId}</div>
                            </div>
                          </div>
                          <button className="dl-btn" onClick={() => download(doc.docPath, doc.documentName)}>
                            📥 Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ══════════════════════════════════════════════════
     SHELL
  ══════════════════════════════════════════════════ */
  return (
    <div className="shell">
      <FloatingCartoons />

      {/* ═══ HEADER ═══ */}
      <header className="tbar">
        <div className="tbar-brand">
          <div className="tbar-logo-wrap">
            <img src={ventureBizLogo} alt="VentureBiz" className="tbar-logo"/>
          </div>
          <div className="tbar-divider"/>
          <div className="tbar-name-wrap">
            <span className="tbar-name">VentureBiz Promotions</span>
            <span className="tbar-tag">HRMS Portal</span>
          </div>
        </div>

        <div className="tbar-r">
          {/* Profile dropdown */}
          <div className="prof-wrap" ref={profileRef}>
            <button
              className={`prof-btn${showProfile ? " active" : ""}`}
              onClick={() => setShowProfile(v => !v)}
            >
              <div className="prof-av"><IcoUser size={17}/></div>
              <div className="prof-info">
                <span className="prof-name">HR Admin</span>
                <span className="prof-role">Administrator</span>
              </div>
              <span className={`prof-chevron${showProfile ? " open" : ""}`}><IcoChevron /></span>
            </button>

            {showProfile && (
              <div className="prof-dropdown">
                               <div className="pd-sep"/>
                <button className="pd-item" onClick={openPasswordModal}>
                  <span className="pd-ico"><IcoKey size={14}/></span>Update Password
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          <button className="logout-btn" onClick={() => setLogout(true)}>
            <IcoLogout size={15}/> <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ═══ NAV ═══ */}
      <nav className="tbar-nav">
        {NAV_ITEMS.map(([key, label, icon]) => (
          <button
            key={key}
            className={`tnav${activePage === key ? " tnav-on" : ""}`}
            onClick={() => navTo(key)}
          >
            <span className="tnav-ic">{icon}</span>
            <span className="tnav-lbl">{label}</span>
          </button>
        ))}
      </nav>

      {/* ═══ CONTENT ═══ */}
      <main className="page">{renderContent()}</main>

      {/* ═══ FOOTER ═══ */}
      <footer className="foot">©️ 2026 VentureBiz HRMS. All rights reserved.</footer>

      {/* ═══ PASSWORD MODAL ═══ */}
      {showPasswordModal && (
        <div className="mbg" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="mbox">
            <div className="mbox-hd">
              <div className="mbox-ic"><IcoLock size={18}/></div>
              <div>
                <h3 className="mbox-title">Update Password</h3>
                <p className="mbox-sub">Choose a strong new password</p>
              </div>
              <button className="mbox-x" onClick={closeModal}>✕</button>
            </div>

            <div className="mbox-body">
              {pwdErrors.api && (
                <div className="g-err"><span>⚠</span> {pwdErrors.api}</div>
              )}

              {/* New Password */}
              <div className={`sf ${pwdErrors.np ? "sf-error" : newPassword && !pwdErrors.np ? "sf-ok" : ""}`}>
                <label className="sf-label">
                  <span className="sf-icon"><IcoKey /></span>New Password
                </label>
                <div className="sf-inp-wrap">
                  <input
                    className="sf-inp"
                    type={showNewPwd ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    maxLength={16}
                    onChange={e => { setNewPassword(e.target.value); setPwdErrors(p => ({...p, np:""})); }}
                  />
                  <button className="pw-eye" onClick={() => setShowNewPwd(v => !v)} type="button">
                    {showNewPwd ? <IcoEyeOff /> : <IcoEye />}
                  </button>
                </div>
                {pwdErrors.np && <p className="sf-err">{pwdErrors.np}</p>}
              </div>

              {/* Confirm Password */}
              <div className={`sf ${pwdErrors.cp ? "sf-error" : confirmPassword && !pwdErrors.cp ? "sf-ok" : ""}`}>
                <label className="sf-label">
                  <span className="sf-icon"><IcoKey /></span>Confirm Password
                </label>
                <div className="sf-inp-wrap">
                  <input
                    className="sf-inp"
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    maxLength={16}
                    onChange={e => { setConfirmPassword(e.target.value); setPwdErrors(p => ({...p, cp:""})); }}
                  />
                  <button className="pw-eye" onClick={() => setShowConfirmPwd(v => !v)} type="button">
                    {showConfirmPwd ? <IcoEyeOff /> : <IcoEye />}
                  </button>
                </div>
                {pwdErrors.cp && <p className="sf-err">{pwdErrors.cp}</p>}
              </div>

              <div className="pw-rules">
                {["8–16 chars","Uppercase","Lowercase","Number","Special (@$!%*?&)"].map(r => (
                  <span key={r} className="pwr">{r}</span>
                ))}
              </div>
            </div>

            <div className="mbox-ft">
              <button className="mc-btn" onClick={closeModal}>Cancel</button>
              <button className="ms-btn" onClick={updatePassword} disabled={pwdLoading}>
                {pwdLoading
                  ? <><span className="spin"/> Saving…</>
                  : <><IcoLock /> Update Password</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
