import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search, Download, Calendar, User, DollarSign, RefreshCw,
  Filter, X, Edit, Save, Trash2, Eye, TrendingUp, Users,
  ChevronDown, Zap, BarChart3, FileText
} from "lucide-react";
import "./HrSalaryManagement.css";

/* ─── ANIMATED SVG ILLUSTRATIONS ─── */

const PayrollRocketSVG = () => (
  <svg className="deco-svg deco-rocket" width="110" height="120" viewBox="0 0 110 120" fill="none">
    {/* Rocket body */}
    <ellipse cx="55" cy="62" rx="20" ry="32" fill="url(#rocketGrad)" />
    <defs>
      <linearGradient id="rocketGrad" x1="35" y1="30" x2="75" y2="94" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6B2C"/>
        <stop offset="1" stopColor="#FFB085"/>
      </linearGradient>
      <linearGradient id="flameGrad" x1="55" y1="94" x2="55" y2="115" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700"/>
        <stop offset="0.5" stopColor="#FF6B2C"/>
        <stop offset="1" stopColor="#FF4D8D" stopOpacity="0"/>
      </linearGradient>
    </defs>
    {/* Nose */}
    <path d="M55 30 Q40 48 40 62 Q55 55 70 62 Q70 48 55 30Z" fill="#FF4D8D"/>
    {/* Window */}
    <circle cx="55" cy="60" r="9" fill="white" opacity="0.9"/>
    <circle cx="55" cy="60" r="6" fill="#B3D9FF"/>
    <circle cx="57" cy="58" r="2" fill="white" opacity="0.8"/>
    {/* Fins */}
    <path d="M35 75 Q28 85 30 95 L40 82Z" fill="#FF4D8D"/>
    <path d="M75 75 Q82 85 80 95 L70 82Z" fill="#FF4D8D"/>
    {/* Flame */}
    <ellipse cx="55" cy="100" rx="10" ry="18" fill="url(#flameGrad)" className="flame-anim"/>
    <ellipse cx="55" cy="104" rx="5" ry="10" fill="#FFD700" opacity="0.7" className="flame-anim2"/>
    {/* Stars */}
    <circle cx="22" cy="30" r="2.5" fill="#FF6B2C" opacity="0.5" className="star-twinkle"/>
    <circle cx="88" cy="20" r="2" fill="#FF4D8D" opacity="0.6" className="star-twinkle2"/>
    <circle cx="15" cy="65" r="1.5" fill="#FFD700" opacity="0.7" className="star-twinkle3"/>
    <circle cx="95" cy="55" r="2" fill="#FF6B2C" opacity="0.5" className="star-twinkle"/>
    {/* ₹ on body */}
    <text x="55" y="64" textAnchor="middle" fontSize="9" fill="#FF6B2C" fontWeight="bold" fontFamily="sans-serif">₹</text>
  </svg>
);

const SearchCharacterSVG = () => (
  <svg className="deco-svg deco-search-char" width="100" height="110" viewBox="0 0 100 110" fill="none">
    <defs>
      <linearGradient id="magGrad" x1="0" y1="0" x2="100" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6B2C"/>
        <stop offset="1" stopColor="#FFB085"/>
      </linearGradient>
    </defs>
    {/* Magnifier circle */}
    <circle cx="40" cy="42" r="28" fill="white" stroke="url(#magGrad)" strokeWidth="7"/>
    {/* Inner glass */}
    <circle cx="40" cy="42" r="20" fill="#FFF3EE" opacity="0.8"/>
    {/* Shine */}
    <ellipse cx="32" cy="34" rx="5" ry="3" fill="white" opacity="0.6" transform="rotate(-30 32 34)"/>
    {/* Face inside magnifier */}
    <circle cx="35" cy="40" r="3" fill="white"/>
    <circle cx="35" cy="40" r="1.5" fill="#1C1915"/>
    <circle cx="45" cy="40" r="3" fill="white"/>
    <circle cx="45" cy="40" r="1.5" fill="#1C1915"/>
    <path d="M34 48 Q40 53 46 48" stroke="#FF6B2C" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Handle */}
    <rect x="60" y="62" width="30" height="10" rx="5" fill="#FF6B2C" transform="rotate(45 60 62)"/>
    <rect x="62" y="64" width="26" height="6" rx="3" fill="#FFB085" transform="rotate(45 62 64)"/>
    {/* Sparkles */}
    <text x="70" y="20" fontSize="14" className="sparkle-float">✨</text>
    <text x="5" y="25" fontSize="10" className="sparkle-float2">⭐</text>
  </svg>
);

const CoinStackSVG = () => (
  <svg className="deco-svg deco-coins" width="90" height="100" viewBox="0 0 90 100" fill="none">
    <defs>
      <linearGradient id="coinGold" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor="#FFE455"/>
        <stop offset="1" stopColor="#FFB300"/>
      </linearGradient>
    </defs>
    {/* Coin stack - bottom to top */}
    {[70,58,46,34,22].map((y, i) => (
      <g key={i} className={`coin-rise coin-rise-${i}`}>
        <ellipse cx="45" cy={y+8} rx="28" ry="7" fill="#E0940050"/>
        <ellipse cx="45" cy={y} rx="28" ry="8" fill={i===0?"#FFD700":i===1?"#FFC107":i===2?"#FFB300":i===3?"#FFA000":"#FF8F00"}
          stroke="#E65100" strokeWidth="1.5"/>
        <ellipse cx="45" cy={y} rx="22" ry="6" fill={i===0?"#FFE455":i===1?"#FFD740":i===2?"#FFC400":i===3?"#FFB300":"#FFA000"}/>
        <text x="45" y={y+4} textAnchor="middle" fontSize="9" fill="#E65100" fontWeight="bold" fontFamily="sans-serif">₹</text>
      </g>
    ))}
    {/* Gleam */}
    <ellipse cx="33" cy="22" rx="4" ry="2" fill="white" opacity="0.5" transform="rotate(-20 33 22)"/>
    {/* Stars beside */}
    <circle cx="78" cy="30" r="3" fill="#FF6B2C" opacity="0.4" className="star-twinkle2"/>
    <circle cx="10" cy="50" r="2" fill="#FF4D8D" opacity="0.5" className="star-twinkle3"/>
  </svg>
);

const ChartCharacterSVG = () => (
  <svg className="deco-svg deco-chart" width="100" height="100" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="chartGrad1" x1="0" y1="80" x2="0" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6B2C" stopOpacity="0.3"/>
        <stop offset="1" stopColor="#FF6B2C"/>
      </linearGradient>
      <linearGradient id="chartGrad2" x1="0" y1="80" x2="0" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF4D8D" stopOpacity="0.3"/>
        <stop offset="1" stopColor="#FF4D8D"/>
      </linearGradient>
      <linearGradient id="chartGrad3" x1="0" y1="80" x2="0" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700" stopOpacity="0.3"/>
        <stop offset="1" stopColor="#FFD700"/>
      </linearGradient>
    </defs>
    {/* Background */}
    <rect x="8" y="8" width="84" height="84" rx="16" fill="#FFF3EE"/>
    {/* Grid lines */}
    {[25,40,55,70].map(y=>(
      <line key={y} x1="20" y1={y} x2="84" y2={y} stroke="#FFD4C0" strokeWidth="0.8" strokeDasharray="3,3"/>
    ))}
    {/* Bars */}
    <rect x="22" y="50" width="14" height="30" rx="4" fill="url(#chartGrad1)" className="bar-grow bar1"/>
    <rect x="42" y="35" width="14" height="45" rx="4" fill="url(#chartGrad2)" className="bar-grow bar2"/>
    <rect x="62" y="20" width="14" height="60" rx="4" fill="url(#chartGrad3)" className="bar-grow bar3"/>
    {/* Trend line */}
    <polyline points="29,48 49,33 69,18" stroke="#FF6B2C" strokeWidth="2.5" fill="none" strokeLinecap="round" className="trend-draw"/>
    <circle cx="29" cy="48" r="3.5" fill="#FF6B2C"/>
    <circle cx="49" cy="33" r="3.5" fill="#FF4D8D"/>
    <circle cx="69" cy="18" r="3.5" fill="#FFD700"/>
    {/* Axes */}
    <line x1="18" y1="82" x2="86" y2="82" stroke="#E8E4DC" strokeWidth="2"/>
    <line x1="18" y1="15" x2="18" y2="82" stroke="#E8E4DC" strokeWidth="2"/>
    {/* Up arrow on trend */}
    <text x="72" y="14" fontSize="11" className="arrow-bounce">↗</text>
  </svg>
);

const EmptyStateSVG = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="56" fill="#FFF3EE" stroke="#FFD4C0" strokeWidth="2"/>
    <rect x="30" y="38" width="60" height="48" rx="8" fill="white" stroke="#FFD4C0" strokeWidth="2"/>
    {[50,58,66].map(y=>(
      <rect key={y} x="40" y={y} width={y===50?30:y===58?20:25} height="4" rx="2" fill="#FFD4C0"/>
    ))}
    <circle cx="78" cy="36" r="18" fill="#FF6B2C"/>
    <circle cx="78" cy="36" r="14" fill="#FFB085"/>
    <line x1="88" y1="46" x2="98" y2="56" stroke="#FF6B2C" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="77" cy="35" r="5" fill="white" opacity="0.8"/>
    <text x="60" y="104" textAnchor="middle" fontSize="10" fill="#A09B93" fontFamily="sans-serif" fontWeight="600">No Records Found</text>
  </svg>
);

const ReadySVG = () => (
  <svg width="130" height="120" viewBox="0 0 130 120" fill="none">
    <defs>
      <linearGradient id="readyGrad" x1="0" y1="0" x2="130" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6B2C" stopOpacity="0.12"/>
        <stop offset="1" stopColor="#FF4D8D" stopOpacity="0.08"/>
      </linearGradient>
    </defs>
    <circle cx="65" cy="55" r="50" fill="url(#readyGrad)"/>
    {/* Laptop */}
    <rect x="22" y="35" width="86" height="52" rx="8" fill="white" stroke="#FFD4C0" strokeWidth="2.5"/>
    <rect x="28" y="41" width="74" height="40" rx="4" fill="#FFF3EE"/>
    {/* Screen content bars */}
    {[48,56,64].map(y=>(
      <rect key={y} x="34" y={y} width={y===48?50:y===56?36:44} height="5" rx="2.5" fill="#FFD4C0"/>
    ))}
    {/* Chart on screen */}
    <rect x="72" y="48" width="8" height="20" rx="2" fill="#FF6B2C" opacity="0.6"/>
    <rect x="84" y="42" width="8" height="26" rx="2" fill="#FF4D8D" opacity="0.7"/>
    {/* Keyboard */}
    <rect x="16" y="87" width="98" height="10" rx="5" fill="#E8E4DC"/>
    <rect x="42" y="89" width="46" height="6" rx="3" fill="#D4CEC3"/>
    {/* Coins flying */}
    <circle cx="22" cy="32" r="8" fill="#FFD700" stroke="#FF6B2C" strokeWidth="1.5" className="coin-float"/>
    <text x="22" y="36" textAnchor="middle" fontSize="7" fill="#FF6B2C" fontWeight="bold">₹</text>
    <circle cx="108" cy="28" r="6" fill="#FFD700" stroke="#FF6B2C" strokeWidth="1.5" className="coin-float2"/>
    <text x="108" y="32" textAnchor="middle" fontSize="5" fill="#FF6B2C" fontWeight="bold">₹</text>
    {/* Stars */}
    <circle cx="15" cy="55" r="3" fill="#FF4D8D" opacity="0.4" className="star-twinkle"/>
    <circle cx="115" cy="50" r="2.5" fill="#FFD700" opacity="0.5" className="star-twinkle2"/>
    <text x="65" y="112" textAnchor="middle" fontSize="10" fill="#A09B93" fontFamily="sans-serif" fontWeight="600">Ready to view records</text>
  </svg>
);

/* ─── FLOATING BACKGROUND DECORATIONS ─── */
const BackgroundDecorations = () => (
  <div className="bg-decorations" aria-hidden="true">
    <div className="bg-deco bg-deco-1"><PayrollRocketSVG /></div>
    <div className="bg-deco bg-deco-2"><CoinStackSVG /></div>
    <div className="bg-deco bg-deco-3">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <polygon points="30,4 36,22 56,22 41,34 47,52 30,41 13,52 19,34 4,22 24,22"
          fill="#FF6B2C" opacity="0.12" className="star-spin"/>
      </svg>
    </div>
    <div className="bg-deco bg-deco-4">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#FF4D8D" opacity="0.08" className="pulse-ring"/>
        <circle cx="20" cy="20" r="10" fill="#FF4D8D" opacity="0.12"/>
      </svg>
    </div>
    <div className="bg-deco bg-deco-5">
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <rect x="5" y="5" width="40" height="40" rx="12" fill="#FFD700" opacity="0.10" transform="rotate(15 25 25)" className="box-rotate"/>
      </svg>
    </div>
  </div>
);

/* ─── ANIMATED CARD ICON ─── */
const CardIcon = ({ children, color = "orange" }) => (
  <div className={`card-title-icon card-title-icon-${color}`}>
    {children}
  </div>
);

export default function HrSalaryManagement() {
  const [generateForm, setGenerateForm] = useState({ totalDay: "", actualDay: "", month: "", year: "" });
  const [searchForm, setSearchForm] = useState({ month: "", year: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [filteredResults, setFilteredResults] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewDetails, setViewDetails] = useState(null);

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" }, { value: 4, label: "April" },
    { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" },
    { value: 9, label: "September" }, { value: 10, label: "October" },
    { value: 11, label: "November" }, { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 3 + i);

  useEffect(() => {
    if (generateForm.month && generateForm.year) {
      const days = new Date(generateForm.year, generateForm.month, 0).getDate();
      setGenerateForm((prev) => ({ ...prev, totalDay: days, actualDay: days }));
    }
  }, [generateForm.month, generateForm.year]);

  useEffect(() => {
    if (result && searchUsername) {
      const filtered = result.filter(item => {
        if (!item) return false;
        return (item.employeeName || "").toLowerCase().includes(searchUsername.toLowerCase().trim());
      });
      setFilteredResults(filtered);
    } else {
      setFilteredResults(result);
    }
  }, [searchUsername, result]);

  const handleGenerateChange = (e) => {
    const { name, value } = e.target;
    if (name === "actualDay" && value > generateForm.totalDay) return;
    setGenerateForm({ ...generateForm, [name]: value });
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "actualDay" && value > editForm.totalDay) return;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const clearUsernameFilter = () => { setSearchUsername(""); setFilteredResults(result); };

  const showError = (err) => {
    if (err?.response?.data) {
      const d = err.response.data;
      alert(typeof d === "string" ? d : d.message || JSON.stringify(d));
    } else {
      alert("Server error");
    }
  };

  const submitSalary = async () => {
    if (!generateForm.month || !generateForm.year) return alert("Select month & year");
    setLoading(true);
    try {
      const checkRes = await axios.get(
        `/api/salary/hr/month?month=${generateForm.month}&year=${generateForm.year}`,
        { withCredentials: true }
      );
      const monthLabel = months.find(m => m.value == generateForm.month)?.label;
      if (checkRes.data && checkRes.data.length > 0) {
        alert(`⚠️ Salaries already generated for ${monthLabel} ${generateForm.year}`);
        setLoading(false);
        return;
      }
      await axios.post(`/api/salary/hr/month/all`, {
        totalDay: Number(generateForm.totalDay),
        month: Number(generateForm.month),
        year: Number(generateForm.year),
      }, { withCredentials: true });
      alert("Salaries generated successfully for all employees ✅");
      setGenerateForm({ totalDay: "", actualDay: "", month: "", year: "" });
      setResult(null); setFilteredResults(null); setSearchUsername("");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || "";
      const monthLabel = months.find(m => m.value == generateForm.month)?.label;
      if (errorMsg.toLowerCase().includes("already") || errorMsg.toLowerCase().includes("exist")) {
        alert(`⚠️ Salaries already generated for ${monthLabel} ${generateForm.year}`);
      } else {
        showError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSalary = async () => {
    if (!searchForm.month || !searchForm.year) return alert("Select month & year");
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `/api/salary/hr/month?month=${searchForm.month}&year=${searchForm.year}`,
        { withCredentials: true }
      );
      setResult(res.data || []); setFilteredResults(res.data || []);
      setEditingId(null); setViewDetails(null);
    } catch (err) { showError(err); setResult([]); setFilteredResults([]); }
    finally { setSearchLoading(false); }
  };

  const handleEdit = (record) => {
    setEditingId(record.salaryId);
    setEditForm({
      userId: record.userId || "", month: record.month || searchForm.month,
      year: record.year || searchForm.year, totalDay: record.totalDay || "",
      actualDay: record.actualDay || "", salaryId: record.salaryId
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.actualDay) return alert("Enter present days");
    if (!editForm.totalDay) return alert("Total days is required");
    try {
      await axios.put(`/api/salary/edit/${editForm.salaryId}`, {
        userId: Number(editForm.userId), month: Number(editForm.month),
        year: Number(editForm.year), totalDay: Number(editForm.totalDay),
        actualDay: Number(editForm.actualDay)
      }, { withCredentials: true });
      alert("Salary updated successfully ✅");
      setEditingId(null); setEditForm({});
      fetchSalary();
    } catch (err) { showError(err); }
  };

  const handleCancelEdit = () => { setEditingId(null); setEditForm({}); };
  const handleViewDetails = (record) => setViewDetails(record);
  const closeViewDetails = () => setViewDetails(null);

  const fetchAllSalary = async () => {
    if (!searchForm.month || !searchForm.year) return alert("Select month & year");
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `/api/salary/hr/month?month=${searchForm.month}&year=${searchForm.year}`,
        { withCredentials: true }
      );
      setResult(res.data || []); setFilteredResults(res.data || []);
      setSearchUsername(""); setEditingId(null); setViewDetails(null);
    } catch (err) { showError(err); setResult([]); setFilteredResults([]); }
    finally { setSearchLoading(false); }
  };

  const exportToCSV = () => {
    const dataToExport = filteredResults || result || [];
    if (!dataToExport.length) return;
    const headers = ["Employee Name", "Total Days", "Present Days", "Gross Salary", "LOP", "Net Salary"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(item => {
        if (!item) return "";
        const netSalary = (item.grossSalary || 0) - (item.lop || 0);
        return [`"${item.employeeName || ""}"`, item.totalDay || 0, item.actualDay || 0, item.grossSalary || 0, item.lop || 0, netSalary].join(",");
      })
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = searchUsername
      ? `salary-${searchUsername}-${searchForm.month}-${searchForm.year}.csv`
      : `salary-all-${searchForm.month}-${searchForm.year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const calcAttPct = (total, present) => {
    if (!total || total === 0) return 0;
    return Math.round(((present || 0) / total) * 100);
  };

  const displayResults = filteredResults || result || [];
  const hasSearchFilter = searchUsername.trim() !== "";
  const totalPayroll = displayResults.reduce((s, r) => s + ((r?.grossSalary || 0) - (r?.lop || 0)), 0);
  const totalLOP = displayResults.reduce((s, r) => s + (r?.lop || 0), 0);
  const selectedMonthLabel = months.find(m => m.value == searchForm.month)?.label;

  return (
    <div className="salary-management-container">
      <BackgroundDecorations />

      {/* ── HEADER BANNER ── */}
      <div className="salary-header-banner">
        {/* Left: text */}
        <div className="banner-text">
          <h1 className="banner-title">Salary Management</h1>
          <p className="banner-subtitle">Generate, review &amp; edit employee payroll records</p>
          {displayResults.length > 0 && (
            <div className="banner-stats">
              <div className="banner-stat-chip">
                <Users size={13} />
                <span>{displayResults.length} {hasSearchFilter ? "Filtered" : "Employees"}</span>
              </div>
              <div className="banner-stat-chip banner-stat-chip-green">
                <TrendingUp size={13} />
                <span>₹{(totalPayroll / 100000).toFixed(1)}L Net Payroll</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: animated cartoon illustration */}
        <div className="banner-illustration" aria-hidden="true">
          {/* Floating geometric shapes */}
          <div className="banner-shape banner-shape-sq1" />
          <div className="banner-shape banner-shape-sq2" />
          <div className="banner-shape banner-shape-dot1" />
          <div className="banner-shape banner-shape-dot2" />
          <div className="banner-shape banner-shape-plus" />

          {/* Main magnifier with emoji faces */}
          <svg className="banner-main-svg" width="240" height="130" viewBox="0 0 240 130" fill="none">
            <defs>
              <radialGradient id="glassGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)"/>
              </radialGradient>
            </defs>

            {/* Magnifier glass */}
            <circle cx="88" cy="62" r="52" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="4"/>
            <circle cx="88" cy="62" r="44" fill="rgba(255,255,255,0.10)"/>

            {/* Magnifier handle */}
            <rect x="128" y="100" width="56" height="14" rx="7"
              fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"
              transform="rotate(40 128 100)"/>

            {/* Main happy face (yellow) */}
            <circle cx="80" cy="65" r="22" fill="#FFD700" stroke="rgba(255,255,255,0.6)" strokeWidth="2" className="banner-face-bob"/>
            <circle cx="73" cy="60" r="3.5" fill="#1C1915"/>
            <circle cx="87" cy="60" r="3.5" fill="#1C1915"/>
            <circle cx="74" cy="59" r="1.2" fill="white"/>
            <circle cx="88" cy="59" r="1.2" fill="white"/>
            <path d="M73 70 Q80 77 87 70" stroke="#1C1915" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Rosy cheeks */}
            <circle cx="70" cy="68" r="5" fill="#FF6B6B" opacity="0.35"/>
            <circle cx="90" cy="68" r="5" fill="#FF6B6B" opacity="0.35"/>

            {/* Small orange face beside */}
            <circle cx="108" cy="68" r="16" fill="#FF8C42" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" className="banner-face-bob2"/>
            <circle cx="103" cy="64" r="2.5" fill="#1C1915"/>
            <circle cx="113" cy="64" r="2.5" fill="#1C1915"/>
            <path d="M103 72 Q108 77 113 72" stroke="#1C1915" strokeWidth="2" fill="none" strokeLinecap="round"/>

            {/* Org chart nodes top-right */}
            {/* Center node */}
            <circle cx="175" cy="25" r="16" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <circle cx="175" cy="23" r="7" fill="#FFD700"/>
            <circle cx="175" cy="35" r="5" fill="#FFD700" opacity="0.7"/>

            {/* Top-right node */}
            <circle cx="215" cy="12" r="12" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
            <circle cx="215" cy="10" r="5.5" fill="#FF8C42"/>
            <circle cx="215" cy="19" r="3.5" fill="#FF8C42" opacity="0.7"/>

            {/* Bottom-right node */}
            <circle cx="220" cy="55" r="12" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
            <circle cx="220" cy="53" r="5.5" fill="#c084fc"/>
            <circle cx="220" cy="62" r="3.5" fill="#c084fc" opacity="0.7"/>

            {/* Far right node */}
            <circle cx="235" cy="30" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
            <circle cx="235" cy="28" r="4.5" fill="#fb7185"/>
            <circle cx="235" cy="36" r="3" fill="#fb7185" opacity="0.7"/>

            {/* Connector lines */}
            <line x1="191" y1="25" x2="203" y2="17" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="3,3"/>
            <line x1="191" y1="28" x2="208" y2="50" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="3,3"/>
            <line x1="215" y1="24" x2="225" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="3,3"/>

            {/* Sparkle stars */}
            <text x="148" y="55" fontSize="13" fill="rgba(255,255,255,0.7)" className="banner-sparkle1">✦</text>
            <text x="35" y="28" fontSize="10" fill="rgba(255,255,255,0.5)" className="banner-sparkle2">✦</text>
            <text x="50" y="110" fontSize="8" fill="rgba(255,255,255,0.4)" className="banner-sparkle3">✦</text>
          </svg>
        </div>
      </div>

      <div className="salary-content">

        {/* ── GENERATE SALARY CARD ── */}
        <div className="salary-card salary-card-generate">
          <div className="card-illustration card-illustration-left">
            <PayrollRocketSVG />
          </div>
          <div className="card-header">
            <div className="card-title">
              <CardIcon color="orange"><Zap size={16} /></CardIcon>
              Generate Monthly Salary for All Employees
            </div>
            <p className="card-subtitle">Create payroll records for all active employees in one click</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={12} /> Month
              </label>
              <div className="select-wrapper">
                <select className="form-select" name="month" value={generateForm.month} onChange={handleGenerateChange}>
                  <option value="">Select Month</option>
                  {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <span className="select-icon"><ChevronDown size={12} /></span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={12} /> Year
              </label>
              <div className="select-wrapper">
                <select className="form-select" name="year" value={generateForm.year} onChange={handleGenerateChange}>
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className="select-icon"><ChevronDown size={12} /></span>
              </div>
            </div>
          </div>

          <div className="search-buttons">
            <button
              className={`primary-button${loading ? " button-loading" : ""}`}
              onClick={submitSalary}
              disabled={loading}
            >
              {loading
                ? <><RefreshCw size={14} className="spinner" /> Generating...</>
                : <><Zap size={14} /> Generate Salaries for All</>}
            </button>
          </div>

          <p className="note-text">
            Note: Present days shown are defaults. Actual attendance per employee can be edited individually after generation.
          </p>
        </div>

        {/* ── SEARCH / FILTER CARD ── */}
        <div className="salary-card salary-card-search">
          <div className="card-illustration card-illustration-right">
            <SearchCharacterSVG />
          </div>
          <div className="card-header">
            <div className="card-title">
              <CardIcon color="pink"><Search size={16} /></CardIcon>
              Search Salary Records
            </div>
            <p className="card-subtitle">View and filter payroll records by period or employee</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label"><Calendar size={12} /> Month</label>
              <div className="select-wrapper">
                <select className="form-select" name="month" value={searchForm.month} onChange={handleSearchChange}>
                  <option value="">Select Month</option>
                  {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <span className="select-icon"><ChevronDown size={12} /></span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Calendar size={12} /> Year</label>
              <div className="select-wrapper">
                <select className="form-select" name="year" value={searchForm.year} onChange={handleSearchChange}>
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className="select-icon"><ChevronDown size={12} /></span>
              </div>
            </div>

           
              
          </div>

          <div className="search-buttons">
            <button
              className={`primary-button${searchLoading ? " button-loading" : ""}`}
              onClick={fetchAllSalary}
              disabled={searchLoading}
            >
              {searchLoading
                ? <><RefreshCw size={14} className="spinner" /> Loading...</>
                : <><Users size={14} /> View All Employees</>}
            </button>

            {searchUsername && (
              <button
                className={`secondary-button${searchLoading ? " button-loading" : ""}`}
                onClick={fetchSalary}
                disabled={searchLoading}
              >
                {searchLoading
                  ? <><RefreshCw size={14} className="spinner" /> Searching...</>
                  : <><Search size={14} /> Search Employee</>}
              </button>
            )}
          </div>
        </div>

        {/* ── RESULTS TABLE ── */}
        {displayResults.length > 0 && result !== null && (
          <div className="salary-card">
            <div className="card-illustration card-illustration-chart">
              <ChartCharacterSVG />
            </div>
            <div className="results-header">
              <div>
                <h2 className="results-title">
                  Salary Records — {selectedMonthLabel} {searchForm.year}
                  {hasSearchFilter && (
                    <span className="filter-indicator">
                      <Filter size={11} />
                      Filtered: "{searchUsername}"
                      <button className="clear-filter-button-small" onClick={clearUsernameFilter}>
                        <X size={10} />
                      </button>
                    </span>
                  )}
                </h2>
                <p className="results-subtitle">
                  Showing {displayResults.length} employee{displayResults.length !== 1 ? "s" : ""}
                  {hasSearchFilter && result && ` (filtered from ${result.length} total)`}
                </p>
              </div>

              <div className="results-header-actions">
                {hasSearchFilter && result && result.length > displayResults.length && (
                  <button className="show-all-button" onClick={clearUsernameFilter}>
                    Show All {result.length}
                  </button>
                )}
                <button className="export-button" onClick={exportToCSV}>
                  <Download size={13} /> Export CSV
                </button>
              </div>
            </div>

            {/* Summary pills */}
            <div className="summary-pills">
              <div className="summary-pill pill-orange">
                <Users size={13} />
                <span>{displayResults.length} Employees</span>
              </div>
              <div className="summary-pill pill-green">
                <TrendingUp size={13} />
                <span>₹{totalPayroll.toLocaleString("en-IN")} Net Payroll</span>
              </div>
              <div className="summary-pill pill-red">
                <BarChart3 size={13} />
                <span>₹{totalLOP.toLocaleString("en-IN")} Total LOP</span>
              </div>
            </div>

            <div className="table-wrapper">
              <div className="table-container">
                <table className="salary-table">
                  <thead>
                    <tr>
                      <th style={{ width: "26%" }}>Employee</th>
                      <th style={{ width: "11%", textAlign: "center" }}>Total Days</th>
                      <th style={{ width: "11%", textAlign: "center" }}>Present Days</th>
                      <th style={{ width: "18%", textAlign: "right" }}>Gross Salary</th>
                      <th style={{ width: "16%", textAlign: "right" }}>LOP Deduction</th>
                      <th style={{ width: "18%", textAlign: "right" }}>Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayResults.map((r, index) => {
                      if (!r) return null;
                      const netSalary = (r.grossSalary || 0) - (r.lop || 0);
                      const isEditing = editingId === r.salaryId;
                      const rowClass = isEditing ? "edit-row" : (index % 2 === 0 ? "even-row" : "odd-row");
                      const attPct = calcAttPct(r.totalDay, r.actualDay);

                      return (
                        <tr
                          key={r.salaryId || index}
                          className={`${rowClass} salary-row`}
                          style={{ animationDelay: `${index * 0.04}s` }}
                          onClick={() => !isEditing && handleViewDetails(r)}
                        >
                          <td className="table-cell">
                            <div className="employee-cell">
                              <div className="employee-avatar" style={{
                                background: `hsl(${(r.employeeName?.charCodeAt(0) || 0) * 15 % 360}, 70%, 55%)`
                              }}>
                                {r.employeeName?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <div className="employee-info">
                                <span className="employee-name">{r.employeeName || "Unknown"}</span>
                                <div className="att-bar-wrap">
                                  <div className="att-bar" style={{ width: `${attPct}%`,
                                    background: attPct >= 90 ? "#22C55E" : attPct >= 75 ? "#FF6B2C" : "#EF4444"
                                  }}/>
                                  <span className="att-label">{attPct}%</span>
                                </div>
                                {!isEditing && (
                                  <div className="row-hover-actions">
                                    <button
                                      className="row-action-btn row-view-btn"
                                      onClick={e => { e.stopPropagation(); handleViewDetails(r); }}
                                      title="View Details"
                                    >
                                      <Eye size={11} /> View
                                    </button>
                                   
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {isEditing ? (
                            <td className="table-cell" colSpan="5">
                              <div className="edit-form">
                                <div className="edit-form-grid">
                                  <div className="form-group" style={{ padding: 10 }}>
                                    <label className="form-label">Total Days</label>
                                    <input className="form-input" type="number" name="totalDay"
                                      value={editForm.totalDay} onChange={handleEditChange} min="1"/>
                                  </div>
                                  <div className="form-group" style={{ padding: 10 }}>
                                    <label className="form-label">Present Days</label>
                                    <input className="form-input" type="number" name="actualDay"
                                      value={editForm.actualDay} onChange={handleEditChange} min="0" max={editForm.totalDay}/>
                                  </div>
                                  <div className="form-group" style={{ padding: 10 }}>
                                    <label className="form-label">Month</label>
                                    <div className="select-wrapper">
                                      <select className="form-select" name="month" value={editForm.month} onChange={handleEditChange}>
                                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                      </select>
                                      <span className="select-icon"><ChevronDown size={11} /></span>
                                    </div>
                                  </div>
                                  <div className="form-group" style={{ padding: 10 }}>
                                    <label className="form-label">Year</label>
                                    <input className="form-input" type="number" name="year"
                                      value={editForm.year} onChange={handleEditChange} min="2020" max="2030"/>
                                  </div>
                                </div>
                                <div className="edit-form-actions">
                                  <button className="save-button" onClick={e => { e.stopPropagation(); handleSaveEdit(); }}>
                                    <Save size={12} /> Save Changes
                                  </button>
                                  <button className="cancel-button" onClick={e => { e.stopPropagation(); handleCancelEdit(); }}>
                                    <X size={12} /> Cancel
                                  </button>
                                </div>
                              </div>
                            </td>
                          ) : (
                            <>
                              <td className="table-cell number-cell">{r.totalDay || 0}</td>
                              <td className="table-cell number-cell">{r.actualDay || 0}</td>
                              <td className="table-cell">
                                <div className="amount-cell">
                                  <span className="currency">₹</span>
                                  {(r.grossSalary || 0).toLocaleString("en-IN")}
                                </div>
                              </td>
                              <td className="table-cell">
                                <div className="amount-cell lop-cell">
                                  <span className="currency">-₹</span>
                                  {(r.lop || 0).toLocaleString("en-IN")}
                                </div>
                              </td>
                              <td className="table-cell">
                                <div className="net-salary-cell">
                                  <span className="currency">₹</span>
                                  {netSalary.toLocaleString("en-IN")}
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {displayResults.length === 0 && result !== null && (
          <div className="empty-state">
            <div className="empty-icon">
              <EmptyStateSVG />
            </div>
            <h3 className="empty-title">
              {hasSearchFilter ? `No records found for "${searchUsername}"` : "No records found"}
            </h3>
            <p className="empty-text">
              {hasSearchFilter
                ? "Try a different name or view all employees."
                : "No salary records exist for the selected month and year."}
            </p>
            {hasSearchFilter && (
              <button className="clear-filter-button-large" onClick={clearUsernameFilter}>
                <X size={14} /> Clear Filter
              </button>
            )}
          </div>
        )}

        {/* ── INITIAL STATE ── */}
        {result === null && (
          <div className="empty-state">
            <div className="empty-icon">
              <ReadySVG />
            </div>
            <h3 className="empty-title">Ready to view salary records</h3>
            <p className="empty-text">
              Select a month and year above, then click <strong>"View All Employees"</strong> to load payroll data.
            </p>
          </div>
        )}
      </div>

      {/* ── VIEW DETAILS MODAL ── */}
      {viewDetails && (
        <div className="modal-overlay" onClick={closeViewDetails}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-avatar" style={{
                  background: `hsl(${(viewDetails.employeeName?.charCodeAt(0) || 0) * 15 % 360}, 70%, 55%)`
                }}>
                  {viewDetails.employeeName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <h2 className="modal-title">Salary Details</h2>
              </div>
              <button className="modal-close" onClick={closeViewDetails}>×</button>
            </div>

            <div className="detail-grid">
              <div className="detail-item detail-name-item" style={{ gridColumn: "1 / -1" }}>
                <div className="detail-label">Employee Name</div>
                <div className="detail-value detail-name">
                  {viewDetails.employeeName || "Unknown"}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Month</div>
                <div className="detail-value">{months.find(m => m.value == viewDetails.month)?.label || viewDetails.month}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Year</div>
                <div className="detail-value">{viewDetails.year}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Total Days</div>
                <div className="detail-value">{viewDetails.totalDay || 0}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Present Days</div>
                <div className="detail-value">{viewDetails.actualDay || 0}
                  <span className="detail-badge">{calcAttPct(viewDetails.totalDay, viewDetails.actualDay)}%</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Gross Salary</div>
                <div className="detail-value">₹ {(viewDetails.grossSalary || 0).toLocaleString("en-IN")}</div>
              </div>
              <div className="detail-item highlight-danger">
                <div className="detail-label">LOP Deduction</div>
                <div className="detail-value">-₹ {(viewDetails.lop || 0).toLocaleString("en-IN")}</div>
              </div>
              <div className="detail-item highlight-success" style={{ gridColumn: "1 / -1" }}>
                <div className="detail-label">Net Salary</div>
                <div className="detail-value detail-net">
                  ₹ {((viewDetails.grossSalary || 0) - (viewDetails.lop || 0)).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Salary ID</div>
                <div className="detail-value detail-mono">{viewDetails.salaryId}</div>
              </div>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
