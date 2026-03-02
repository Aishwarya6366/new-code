import { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeHolidayCalendar.css";

/* ── Cartoon SVG Illustrations ─────────────────────────────── */

const IllustrationCalendar = () => (
  <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" className="stat-illustration">
    <rect x="10" y="22" width="140" height="100" rx="12" fill="#fff" stroke="#ffe0cc" strokeWidth="2"/>
    <rect x="10" y="22" width="140" height="30" rx="12" fill="#ff6b35"/>
    <rect x="10" y="38" width="140" height="14" fill="#ff6b35"/>
    <rect x="45" y="14" width="9" height="18" rx="4.5" fill="#ff9a6c"/>
    <rect x="106" y="14" width="9" height="18" rx="4.5" fill="#ff9a6c"/>
    <rect x="52" y="29" width="56" height="7" rx="3.5" fill="rgba(255,255,255,0.55)"/>
    {[0,1,2,3,4,5,6].map(c => [0,1,2,3].map(r => {
      const hi = (c===3&&r===0)||(c===1&&r===2);
      return <rect key={`${c}${r}`} x={18+c*18} y={62+r*15} width="13" height="10" rx="3"
        fill={hi ? (r===0?"#ff6b35":"#ff9a6c") : "#fff0e8"}/>;
    }))}
    <circle cx="138" cy="18" r="10" fill="#ffd166"/>
    <text x="133" y="22" fontSize="11" fill="#fff" fontWeight="bold">★</text>
  </svg>
);

const IllustrationTypes = () => (
  <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" className="stat-illustration">
    <rect x="12" y="18" width="80" height="28" rx="8" fill="#f72585"/>
    <rect x="22" y="27" width="45" height="7" rx="3.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="68" y="50" width="80" height="28" rx="8" fill="#ff6b35"/>
    <rect x="78" y="59" width="45" height="7" rx="3.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="18" y="82" width="72" height="26" rx="8" fill="#ff9a6c"/>
    <rect x="28" y="91" width="38" height="7" rx="3.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="88" y="86" width="62" height="24" rx="8" fill="#7209b7"/>
    <rect x="98" y="95" width="34" height="6" rx="3" fill="rgba(255,255,255,0.65)"/>
    <rect x="4"  y="64" width="8" height="8" rx="2" fill="#ffd166" transform="rotate(20 8 68)"/>
    <rect x="148" y="28" width="9" height="9" rx="2" fill="#ff6b35" opacity="0.5" transform="rotate(-15 152 32)"/>
    <rect x="144" y="112" width="8" height="8" rx="2" fill="#f72585" opacity="0.5" transform="rotate(30 148 116)"/>
  </svg>
);

const IllustrationView = () => (
  <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" className="stat-illustration">
    <rect x="15" y="20" width="130" height="85" rx="10" fill="#2d2d2d"/>
    <rect x="22" y="28" width="116" height="70" rx="6" fill="#f0f4ff"/>
    <rect x="30" y="38" width="55" height="9" rx="4" fill="#ff6b35"/>
    <rect x="30" y="52" width="85" height="5" rx="2.5" fill="#e2e8f0"/>
    <rect x="30" y="62" width="70" height="5" rx="2.5" fill="#e2e8f0"/>
    <rect x="30" y="72" width="78" height="5" rx="2.5" fill="#e2e8f0"/>
    <rect x="30" y="82" width="50" height="5" rx="2.5" fill="#e2e8f0"/>
    <rect x="110" y="65" width="9" height="28" rx="3" fill="#ff6b35" opacity="0.85"/>
    <rect x="122" y="55" width="9" height="38" rx="3" fill="#f72585" opacity="0.85"/>
    <rect x="10" y="105" width="140" height="10" rx="5" fill="#d1d5db"/>
    <rect x="50" y="111" width="60" height="6" rx="3" fill="#9ca3af"/>
    <ellipse cx="136" cy="40" rx="10" ry="10" fill="#ffd166"/>
    <ellipse cx="133" cy="38" rx="1.5" ry="2" fill="#3b2200"/>
    <ellipse cx="139" cy="38" rx="1.5" ry="2" fill="#3b2200"/>
    <path d="M133 43 Q136 47 139 43" stroke="#3b2200" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
);

const HeaderIllustration = () => (
  <svg viewBox="0 0 280 150" xmlns="http://www.w3.org/2000/svg" className="header-illustration" aria-hidden="true">
    <rect x="10" y="14" width="108" height="122" rx="14" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
    <rect x="10" y="14" width="108" height="34" rx="14" fill="rgba(255,255,255,0.25)"/>
    <rect x="10" y="34" width="108" height="14" fill="rgba(255,255,255,0.25)"/>
    <rect x="35" y="6" width="8" height="18" rx="4" fill="rgba(255,255,255,0.55)"/>
    <rect x="85" y="6" width="8" height="18" rx="4" fill="rgba(255,255,255,0.55)"/>
    <text x="38" y="30" fontSize="11" fill="rgba(255,255,255,0.95)" fontWeight="bold">February</text>
    {[0,1,2,3,4,5,6].map(c => [0,1,2,3].map(r => (
      <rect key={`h-${c}-${r}`} x={16+c*13} y={54+r*19} width="9" height="9" rx="2"
        fill={c===3&&r===1 ? "#ffd166" : "rgba(255,255,255,0.22)"}/>
    )))}
    <rect x="155" y="18" width="12" height="12" rx="2" fill="#ffd166" opacity="0.9" transform="rotate(20 161 24)"/>
    <rect x="185" y="40" width="10" height="10" rx="2" fill="#ff9a6c" opacity="0.8" transform="rotate(-15 190 45)"/>
    <rect x="168" y="62" width="8" height="8" rx="1" fill="#f72585" opacity="0.75" transform="rotate(30 172 66)"/>
    <rect x="210" y="22" width="14" height="14" rx="3" fill="rgba(255,255,255,0.3)" transform="rotate(10 217 29)"/>
    <rect x="235" y="55" width="9" height="9" rx="2" fill="#a78bfa" opacity="0.7" transform="rotate(-20 239 59)"/>
    <text x="248" y="26" fontSize="22" fill="#ffd166" opacity="0.95">★</text>
    <text x="152" y="108" fontSize="15" fill="rgba(255,255,255,0.5)">✦</text>
    <ellipse cx="248" cy="118" rx="26" ry="24" fill="#ffd166"/>
    <ellipse cx="236" cy="123" rx="5" ry="4" fill="#ffb347" opacity="0.5"/>
    <ellipse cx="260" cy="123" rx="5" ry="4" fill="#ffb347" opacity="0.5"/>
    <ellipse cx="241" cy="113" rx="3" ry="4" fill="#3b2200"/>
    <ellipse cx="255" cy="113" rx="3" ry="4" fill="#3b2200"/>
    <ellipse cx="242" cy="112" rx="1" ry="1.5" fill="white" opacity="0.6"/>
    <ellipse cx="256" cy="112" rx="1" ry="1.5" fill="white" opacity="0.6"/>
    <path d="M239 122 Q248 132 257 122" stroke="#3b2200" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <polygon points="248,90 232,112 264,112" fill="#ff6b35"/>
    <polygon points="248,90 232,112 240,112" fill="#ff9a6c" opacity="0.7"/>
    <circle cx="248" cy="90" r="5" fill="#ffd166"/>
    <path d="M230 110 Q218 96 224 84" stroke="#ffd166" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M265 110 Q278 94 272 82" stroke="#f72585" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <rect x="218" y="80" width="8" height="8" rx="2" fill="#ffd166" transform="rotate(25 222 84)"/>
    <rect x="270" y="77" width="8" height="8" rx="2" fill="#ff9a6c" transform="rotate(-20 274 81)"/>
  </svg>
);

/* ── Main Component ─────────────────────────────────────────── */
export default function EmployeeHolidayCalendar() {
  const [holidays, setHolidays]       = useState([]);
  const [types, setTypes]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [viewMode, setViewMode]       = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const [hRes, tRes] = await Promise.all([
        axios.get(`/api/hr/holiday`,       { withCredentials: true }),
        axios.get(`/api/hr/holidaymaster`, { withCredentials: true }),
      ]);
      setHolidays(hRes.data || []);
      setTypes(tRes.data || []);
    } catch (err) {
      setError("Failed to load holiday data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (id) => {
    if (!id && id !== 0) return "Not Selected";
    const t = types.find(t => String(t.htId||t.id||t.typeId).toLowerCase() === String(id).toLowerCase());
    return t ? (t.holidayType||t.type||"Unknown") : "Unknown";
  };

  const formatDate = (ds) => {
    if (!ds) return "N/A";
    try { return new Date(ds).toLocaleDateString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric'}); }
    catch { return String(ds); }
  };

  const sortedHolidays = [...holidays].sort((a,b) =>
    new Date(a.holidayDate||a.date) - new Date(b.holidayDate||b.date)
  );

  const getDaysInMonth   = d => new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
  const getFirstDay      = d => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  const getMonthName     = d => d.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const navigateMonth    = dir => { const n=new Date(currentMonth); n.setMonth(n.getMonth()+dir); setCurrentMonth(n); };

  const getHolidaysForDay = day => {
    const y=currentMonth.getFullYear(), m=currentMonth.getMonth()+1;
    return sortedHolidays.filter(h => { const d=new Date(h.holidayDate||h.date); return !isNaN(d)&&d.getFullYear()===y&&d.getMonth()+1===m&&d.getDate()===day; });
  };
  const getHolidaysByMonth = () => {
    const y=currentMonth.getFullYear(), m=currentMonth.getMonth()+1;
    return sortedHolidays.filter(h => { const d=new Date(h.holidayDate||h.date); return !isNaN(d)&&d.getFullYear()===y&&d.getMonth()+1===m; });
  };

  const renderCalendar = () => {
    const dim=getDaysInMonth(currentMonth), fd=getFirstDay(currentMonth);
    const monthHols=getHolidaysByMonth(), today=new Date();
    const days=[];
    for(let i=0;i<fd;i++) days.push(<div key={`e-${i}`} className="calendar-day empty"/>);
    for(let day=1;day<=dim;day++){
      const dh=getHolidaysForDay(day);
      const isTd=today.getDate()===day&&today.getMonth()===currentMonth.getMonth()&&today.getFullYear()===currentMonth.getFullYear();
      days.push(
        <div key={`d-${day}`} className={`calendar-day${dh.length?' has-holiday':''}${isTd?' today':''}`}>
          <span className="day-number">{day}</span>
          {dh.length>0&&(
            <div className="holiday-indicators">
              <span className="holiday-badge">{dh.length}</span>
              <div className="holiday-tooltip">
                {dh.map((h,i)=>(
                  <div key={i} className="tooltip-item">
                    <strong>{h.holidayName||h.name}</strong>
                    <span>{getTypeName(h.holidayTypeId||h.typeId)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="calendar-view">
        <div className="calendar-nav">
          <button onClick={()=>navigateMonth(-1)} className="cal-nav-btn">← Prev</button>
          <h3 className="calendar-month-title">{getMonthName(currentMonth)}</h3>
          <button onClick={()=>navigateMonth(1)}  className="cal-nav-btn">Next →</button>
        </div>
        <div className="calendar-days-header">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="cal-day-hdr">{d}</div>)}
        </div>
        <div className="calendar-grid">{days}</div>
        
      </div>
    );
  };

  if (loading) return (
    <div className="emp-holiday-container">
      <div className="state-card">
        <div className="spinner"/>
        <h2>Loading Calendar…</h2>
        <p>Fetching holiday information</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="emp-holiday-container">
      <div className="state-card">
        <h2>⚠️ Something went wrong</h2>
        <p>{error}</p>
        <button onClick={loadData} className="btn-primary">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="emp-holiday-container">

      {/* ── Header ── */}
      <div className="header-section">
        <div className="header-content">
         
          <h1>Holiday Calendar</h1>
          <p className="header-sub">Plan your leaves and stay updated on upcoming holidays</p>
          <div className="header-actions">
            <div className="view-toggle">
              <button onClick={()=>setViewMode("list")}     className={`view-btn${viewMode==="list"?" active":""}`}>📋 List</button>
              <button onClick={()=>setViewMode("calendar")} className={`view-btn${viewMode==="calendar"?" active":""}`}>📅 Calendar</button>
            </div>
            <button onClick={loadData} className="btn-refresh">↻ Refresh</button>
          </div>
        </div>
        <HeaderIllustration />
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-section">
        <div className="stat-card card-orange">
          <IllustrationCalendar />
          <div className="stat-info">
            <span className="stat-label">Total Holidays</span>
            <span className="stat-value">{holidays.length}</span>
            <span className="stat-sub">days off this year</span>
          </div>
        </div>
        <div className="stat-card card-pink">
          <IllustrationTypes />
          <div className="stat-info">
            <span className="stat-label">Holiday Types</span>
            <span className="stat-value">{types.length}</span>
            <span className="stat-sub">categories available</span>
          </div>
        </div>
        <div className="stat-card card-purple">
          <IllustrationView />
          <div className="stat-info">
            <span className="stat-label">Current View</span>
            <span className="stat-value stat-sm">{viewMode==="calendar"?"Calendar":"List"}</span>
            <span className="stat-sub">switch anytime above</span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {sortedHolidays.length===0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌴</div>
          <h3>No Holidays Scheduled</h3>
          <p>No holidays are listed at the moment.</p>
        </div>
      ) : viewMode==="calendar" ? renderCalendar() : (
        <div className="list-section">
          <table className="emp-holiday-table">
            <thead>
              <tr><th>Id</th><th>Date</th><th>Holiday Name</th><th>Type</th></tr>
            </thead>
            <tbody>
              {sortedHolidays.map((h,idx)=>{
                const id=h.holidayId||h.id||h.hId||`h-${idx}`;
                return (
                  <tr key={id}>
                    <td className="serial">{idx+1}</td>
                    <td><span className="date-pill">{formatDate(h.holidayDate||h.date)}</span></td>
                    <td className="name-cell"><strong>{h.holidayName||h.name}</strong></td>
                    <td><span className="type-pill">{getTypeName(h.holidayTypeId||h.typeId)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
        </div>
      )}
    </div>
  );
}
