import { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeHolidayCalendar.css";

/* ── Main Component ─────────────────────────────────────────── */
export default function EmployeeHolidayCalendar() {
  const [holidays, setHolidays]         = useState([]);
  const [types, setTypes]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [viewMode, setViewMode]         = useState("calendar");
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
    const today=new Date();
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
          <button onClick={()=>navigateMonth(-1)} className="cal-nav-btn">&#8592; Prev</button>
          <h3 className="calendar-month-title">{getMonthName(currentMonth)}</h3>
          <button onClick={()=>navigateMonth(1)}  className="cal-nav-btn">Next &#8594;</button>
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
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={loadData} className="btn-primary">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="emp-holiday-container">

      {/* ── Header Banner ── */}
      <div style={{
        background: "linear-gradient(125deg, #ff6b35 0%, #f72585 50%, #7209b7 100%)",
        borderRadius: "18px",
        padding: "28px 36px",
        marginBottom: "24px",
        boxShadow: "0 8px 32px rgba(247,37,133,0.25)",
      }}>
        <h1 style={{
          margin: 0,
          fontSize: "22px",
          fontWeight: "800",
          color: "#ffffff",
          letterSpacing: "-0.3px",
          fontFamily: "'Nunito', sans-serif",
        }}>Holiday Calendar</h1>
        <p style={{
          margin: "6px 0 0",
          fontSize: "14px",
          color: "rgba(255,255,255,0.82)",
          fontWeight: "500",
          fontFamily: "'Nunito', sans-serif",
        }}>Plan your leaves and stay updated on upcoming holidays</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.2)", color: "#fff",
            padding: "5px 14px", borderRadius: "20px",
            fontSize: "12px", fontWeight: "700",
            border: "1px solid rgba(255,255,255,0.3)",
            fontFamily: "'Nunito', sans-serif",
          }}>
            {holidays.length} Total Holidays
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.2)", color: "#fff",
            padding: "5px 14px", borderRadius: "20px",
            fontSize: "12px", fontWeight: "700",
            border: "1px solid rgba(255,255,255,0.3)",
            fontFamily: "'Nunito', sans-serif",
          }}>
            {types.length} Types
          </div>
        </div>
      </div>

      {/* ── View Toggle + Refresh ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div className="view-toggle">
          <button onClick={()=>setViewMode("list")}     className={`view-btn${viewMode==="list"?" active":""}`}>List</button>
          <button onClick={()=>setViewMode("calendar")} className={`view-btn${viewMode==="calendar"?" active":""}`}>Calendar</button>
        </div>
        <button onClick={loadData} className="btn-refresh">&#8635; Refresh</button>
      </div>

      {/* ── Content ── */}
      {sortedHolidays.length===0 ? (
        <div className="empty-state">
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#fff3ea", border: "2px dashed #ff9f43",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ff9a6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
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
