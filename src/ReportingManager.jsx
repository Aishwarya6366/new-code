import api from "./api";
import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS INJECTION
   ═══════════════════════════════════════════════════════════════ */
(function injectStyles() {
  if (document.getElementById("rm-global-styles")) return;
  const s = document.createElement("style");
  s.id = "rm-global-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800&display=swap');

    .rm-root *, .rm-root *::before, .rm-root *::after { box-sizing: border-box; }
    .rm-root { font-family: 'Nunito', sans-serif; }

    @keyframes rmSpin    { to { transform: rotate(360deg); } }
    @keyframes rmFadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes rmSlideIn { from { opacity:0; transform:translateY(-20px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }

    .rm-mgr-card:hover  { transform: translateY(-6px) !important; box-shadow: 0 18px 50px rgba(255,107,53,0.2) !important; }
    .rm-mgr-card        { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .rm-trow:hover      { background: #fff8f5 !important; transform: translateX(5px); }
    .rm-trow            { transition: background 0.18s, transform 0.2s; }
    .rm-stat-chip:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(255,107,53,0.2) !important; }
    .rm-stat-chip       { transition: transform 0.2s, box-shadow 0.2s; }
    .rm-btn:hover       { opacity: 0.88; transform: translateY(-1px); }
    .rm-btn             { transition: opacity 0.18s, transform 0.18s; }
    .rm-close-btn:hover { background: #fff0e8 !important; color: #ff6b35 !important; }
    .rm-close-btn       { transition: background 0.18s, color 0.18s; }
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
const T = {
  orange:"#ff6b35", pink:"#f72585", purple:"#7209b7",
  peach:"#ff9a6c",  yellow:"#ffd166",
  bg:"#fff9f6",     white:"#ffffff",
  text:"#1a1a2e",   muted:"#9ca3af",
  border:"#ffe0cc", shade:"#fff0e8",
};

/* ═══════════════════════════════════════════════════════════════
   AVATAR COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const ProfileAvatar = ({ letter, isManager }) => (
  <div style={{
    width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
    background: isManager
      ? "linear-gradient(135deg,#ff6b35,#f72585)"
      : "linear-gradient(135deg,#f72585,#7209b7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 26, fontWeight: 900, color: "#fff",
    fontFamily: "'Poppins',sans-serif",
    boxShadow: isManager
      ? "0 4px 16px rgba(255,107,53,0.35)"
      : "0 4px 16px rgba(247,37,133,0.35)",
  }}>
    {letter}
  </div>
);

const RowAvatar = ({ letter, idx }) => {
  const colors = [
    "linear-gradient(135deg,#ff6b35,#f72585)",
    "linear-gradient(135deg,#f72585,#7209b7)",
    "linear-gradient(135deg,#ff9a6c,#ff6b35)",
    "linear-gradient(135deg,#7209b7,#f72585)",
  ];
  return (
    <div style={{
      width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
      background: colors[idx % 4],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 15, fontWeight: 800, color: "#fff",
      fontFamily: "'Poppins',sans-serif",
      boxShadow: "0 2px 10px rgba(247,37,133,0.25)",
    }}>
      {letter}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SECTION ICONS (simple static SVGs)
   ═══════════════════════════════════════════════════════════════ */
const IconPerson = ({ color = T.orange }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconTeam = ({ color = T.pink }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconRole = ({ color = T.purple }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT — 100% original logic preserved
   ═══════════════════════════════════════════════════════════════ */
export default function ReportingManager() {
  const [role,           setRole]           = useState("");
  const [manager,        setManager]        = useState(null);
  const [employees,      setEmployees]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileRes = await api.get("/emp/profile");
      const designation = profileRes.data.designationName;
      setRole(designation);

      try {
        const mgrRes = await api.get("/hr/mgr/emp/my-manager");
        setManager(mgrRes.data);
      } catch (mgrErr) {
        if (mgrErr.response?.status === 400) setManager(null);
        else console.error("Manager fetch error", mgrErr);
      }

      try {
        const empRes = await api.get("/hr/mgr/mgr/my-employees");
        setEmployees(empRes.data || []);
      } catch (empErr) {
        console.error("Employees fetch error", empErr);
        setEmployees([]);
      }
    } catch (err) {
      setError("Failed to load reporting structure");
      console.error("Profile load error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="rm-root" style={{...S.page, display:"flex", alignItems:"center", justifyContent:"center", minHeight:420, flexDirection:"column", gap:20}}>
      <div style={{
        width: 56, height: 56,
        border: "5px solid #ffe0cc", borderTopColor: T.orange,
        borderRadius: "50%", animation: "rmSpin 0.85s linear infinite",
      }}/>
      <p style={{fontSize:15, color:T.muted, fontWeight:700, margin:0}}>Loading reporting structure…</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="rm-root" style={{...S.page, display:"flex", alignItems:"center", justifyContent:"center", minHeight:420, flexDirection:"column", gap:14}}>
      <div style={{width:56, height:56, borderRadius:"50%", background:T.shade, border:`2px dashed ${T.border}`,
        display:"flex", alignItems:"center", justifyContent:"center"}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2 style={{fontFamily:"'Poppins',sans-serif", fontSize:22, fontWeight:700, color:T.text, margin:0}}>Error Loading Data</h2>
      <p style={{color:T.muted, fontSize:15, margin:0}}>{error}</p>
      <button className="rm-btn" style={S.btnPrimary} onClick={loadAllData}>&#8635; Retry</button>
    </div>
  );

  /* ── Main ── */
  return (
    <div className="rm-root" style={S.page}>

      {/* ══ HEADER BANNER ══ */}
      <div style={{
        background: "linear-gradient(125deg,#ff6b35 0%,#f72585 55%,#7209b7 100%)",
        borderRadius: 22, padding: "28px 36px", marginBottom: 22,
        boxShadow: "0 8px 32px rgba(247,37,133,0.25)",
        animation: "rmFadeUp 0.5s ease both",
      }}>
        <h1 style={{
          fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 800,
          color: "#fff", margin: 0, letterSpacing: "-0.3px",
        }}>Reporting Structure</h1>
        <p style={{fontSize:14, color:"rgba(255,255,255,0.82)", fontWeight:500, margin:"6px 0 0"}}>
          View your manager and the team reporting to you
        </p>
        <div style={{display:"flex", gap:10, marginTop:14, flexWrap:"wrap"}}>
          <div style={S.bannerChip}>{employees.length} Team Member{employees.length !== 1 ? "s" : ""}</div>
          {role && <div style={S.bannerChip}>{role}</div>}
        </div>
      </div>

      {/* ══ STAT CHIPS ══ */}
      <div style={S.chipRow}>
        {[
          { icon: <IconPerson color={T.orange}/>, label:"My Manager",  value: manager ? manager.managerName : "Not Assigned", color:T.orange },
          { icon: <IconTeam   color={T.pink}/>,  label:"Team Size",   value: `${employees.length} member${employees.length!==1?"s":""}`, color:T.pink },
          { icon: <IconRole   color={T.purple}/>,label:"My Role",     value: role || "—", color:T.purple },
        ].map((c,i) => (
          <div key={i} className="rm-stat-chip" style={{
            flex:1, minWidth:160,
            background: T.white,
            border: `1.5px solid ${c.color}28`,
            borderLeft: `5px solid ${c.color}`,
            borderRadius: 14, padding: "13px 16px",
            display: "flex", alignItems: "center", gap: 11,
            boxShadow: `0 2px 12px ${c.color}12`, cursor: "default",
          }}>
            <div style={{width:36, height:36, borderRadius:10, background:T.shade,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              {c.icon}
            </div>
            <div>
              <div style={{fontSize:10, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.9px", marginBottom:2}}>{c.label}</div>
              <div style={{fontSize:14, fontWeight:800, color:T.text}}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ CONTENT GRID ══ */}
      <div style={S.grid}>

        {/* ── MY MANAGER ── */}
        <section style={{animation:"rmFadeUp 0.45s ease both", animationDelay:"0.1s"}}>
          <div style={S.sectionHead}>
            <div style={{...S.sectionIconBox, background:"#fff0e8", border:`1.5px solid ${T.border}`}}>
              <IconPerson color={T.orange}/>
            </div>
            <h2 style={S.sectionTitle}>My Manager</h2>
          </div>

          {manager ? (
            <div
              className="rm-mgr-card"
              style={S.mgrCard}
              onClick={() => setSelectedPerson({
                id: manager.managerId,
                name: manager.managerName,
                username: manager.managerUsername,
                designation: manager.designation,
                department: manager.department,
                isManager: true,
              })}
            >
              <div style={S.mgrStripe}/>
              <div style={{display:"flex", justifyContent:"center", paddingTop:24}}>
                <ProfileAvatar letter={manager.managerName?.charAt(0).toUpperCase()} isManager/>
              </div>
              <div style={S.mgrBody}>
                <h3 style={S.mgrName}>{manager.managerName}</h3>
                <p style={S.mgrUser}>@{manager.managerUsername}</p>
                <div style={S.detailRow}>
                  <span style={S.detailLbl}>Designation</span>
                  <span style={S.tagOrange}>{manager.designation}</span>
                </div>
                <div style={{...S.detailRow, marginBottom:0}}>
                  <span style={S.detailLbl}>Department</span>
                  <span style={S.tagPink}>{manager.department}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={S.emptyCard}>
              <div style={{width:56, height:56, borderRadius:"50%", background:T.shade, border:`2px dashed ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px"}}>
                <IconPerson color={T.peach}/>
              </div>
              <p style={S.emptyTitle}>No Manager Assigned</p>
              <p style={S.emptySub}>You may be at the top of the hierarchy</p>
            </div>
          )}
        </section>

        {/* ── MY TEAM ── */}
        <section style={{animation:"rmFadeUp 0.45s ease both", animationDelay:"0.2s"}}>
          <div style={S.sectionHead}>
            <div style={{...S.sectionIconBox, background:"#fff0f6", border:"1.5px solid #ffd6e7"}}>
              <IconTeam color={T.pink}/>
            </div>
            <h2 style={S.sectionTitle}>
              My Team
              <span style={S.teamBadge}>{employees.length}</span>
            </h2>
          </div>

          {employees.length === 0 ? (
            <div style={S.emptyCard}>
              <div style={{width:56, height:56, borderRadius:"50%", background:T.shade, border:`2px dashed ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px"}}>
                <IconTeam color={T.peach}/>
              </div>
              <p style={S.emptyTitle}>No Team Members Yet</p>
              <p style={S.emptySub}>No employees are currently reporting to you</p>
            </div>
          ) : (
            <div style={S.tableCard}>
              <div style={{overflowX:"auto", overflowY:"auto", maxHeight:460}}>
                <table style={{width:"100%", borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"linear-gradient(90deg,#fff8f5,#fff5fb)", position:"sticky", top:0, zIndex:2}}>
                      {["Id","UserName","EmployeeId","Designation","Department"].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((e, idx) => (
                      <tr
                        key={e.employeeId}
                        className="rm-trow"
                        style={{borderBottom:`1px solid ${T.shade}`, cursor:"pointer"}}
                        onClick={() => setSelectedPerson({
                          id: e.employeeId,
                          name: e.employeeName,
                          username: e.employeeUsername,
                          designation: e.designation,
                          department: e.department,
                          isManager: false,
                        })}
                      >
                        <td style={{...S.td, color:T.muted, fontWeight:700, width:40}}>{idx+1}</td>
                        <td style={S.td}>
                          <div style={{display:"flex", alignItems:"center", gap:10}}>
                            <RowAvatar letter={e.employeeName?.charAt(0).toUpperCase()} idx={idx}/>
                            <span style={{fontWeight:700, color:T.text, fontSize:14}}>{e.employeeName}</span>
                          </div>
                        </td>
                        <td style={S.td}>
                          <code style={S.code}>@{e.employeeUsername}</code>
                        </td>
                        <td style={S.td}><span style={S.tagOrange}>{e.designation}</span></td>
                        <td style={S.td}><span style={S.tagPink}>{e.department}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ══ DETAIL MODAL ══ */}
      {selectedPerson && (
        <div
          style={{
            position:"fixed", inset:0,
            background:"rgba(26,26,46,0.55)",
            display:"flex", alignItems:"center", justifyContent:"center",
            zIndex:1000, padding:20,
            backdropFilter:"blur(4px)",
          }}
          onClick={() => setSelectedPerson(null)}
        >
          <div
            style={{
              background: T.white,
              borderRadius: 22, width:"100%", maxWidth:440,
              boxShadow: "0 28px 65px rgba(0,0,0,0.18)",
              animation: "rmSlideIn 0.28s cubic-bezier(.22,1,.36,1) both",
              overflow: "hidden", border:`1.5px solid ${T.border}`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{
              background: "linear-gradient(135deg,#fff8f5,#fff0f6)",
              borderBottom: `1.5px solid ${T.border}`,
              padding: "24px 24px 20px",
              display: "flex", alignItems: "center", gap: 16,
              position: "relative",
            }}>
              <ProfileAvatar
                letter={selectedPerson.name?.charAt(0).toUpperCase()}
                isManager={selectedPerson.isManager}
              />
              <div style={{flex:1}}>
                <h2 style={{fontFamily:"'Poppins',sans-serif", fontSize:19, fontWeight:800, color:T.text, margin:"0 0 3px"}}>{selectedPerson.name}</h2>
                <p style={{fontSize:13, color:T.muted, fontFamily:"monospace", margin:"0 0 8px"}}>@{selectedPerson.username}</p>
                <span style={selectedPerson.isManager ? S.tagOrange : S.tagPink}>
                  {selectedPerson.isManager ? "Manager" : "Employee"}
                </span>
              </div>
              <button
                className="rm-close-btn"
                style={{
                  position:"absolute", top:16, right:16,
                  background:"rgba(0,0,0,0.05)", border:"none",
                  fontSize:20, color:T.muted, cursor:"pointer",
                  width:32, height:32, borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700,
                }}
                onClick={() => setSelectedPerson(null)}
              >×</button>
            </div>

            {/* Modal body */}
            <div style={{padding:"20px 24px", display:"flex", flexDirection:"column", gap:10}}>
              {[
                {label:"Employee ID", value: selectedPerson.id,          badge:null},
                {label:"Designation", value: selectedPerson.designation, badge:"orange"},
                {label:"Department",  value: selectedPerson.department,  badge:"pink"},
              ].map((row,i) => (
                <div key={i} style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"12px 14px", background:T.shade,
                  borderRadius:12, border:`1px solid ${T.border}`,
                }}>
                  <span style={{fontSize:12, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.8px"}}>{row.label}</span>
                  {row.badge==="orange" ? <span style={S.tagOrange}>{row.value}</span>
                  :row.badge==="pink"   ? <span style={S.tagPink}>{row.value}</span>
                  :<code style={S.code}>{row.value}</code>}
                </div>
              ))}
            </div>

            <div style={{padding:"14px 24px 22px", borderTop:`1.5px solid ${T.shade}`, textAlign:"right"}}>
              <button className="rm-btn" style={S.btnPrimary} onClick={() => setSelectedPerson(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */
const S = {
  page: {
    maxWidth:1300, margin:"0 auto", padding:"26px 20px 52px",
    fontFamily:"'Nunito',sans-serif", background:T.bg, minHeight:"100vh", position:"relative",
  },

  bannerChip: {
    display:"inline-flex", alignItems:"center", gap:6,
    background:"rgba(255,255,255,0.2)", color:"#fff",
    padding:"5px 14px", borderRadius:20,
    fontSize:12, fontWeight:700,
    border:"1px solid rgba(255,255,255,0.3)",
    fontFamily:"'Nunito',sans-serif",
  },

  chipRow: {
    display:"flex", gap:14, marginBottom:24, flexWrap:"wrap",
    animation:"rmFadeUp 0.5s ease both", animationDelay:"0.08s",
  },

  grid: { display:"grid", gridTemplateColumns:"1fr 2fr", gap:26, alignItems:"start" },

  sectionHead: { display:"flex", alignItems:"center", gap:12, marginBottom:16 },
  sectionIconBox: { width:42, height:42, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" },
  sectionTitle: {
    fontFamily:"'Poppins',sans-serif", fontSize:19, fontWeight:700, color:T.text,
    margin:0, display:"flex", alignItems:"center", gap:10,
  },
  teamBadge: {
    background:T.shade, color:T.orange, fontSize:12, fontWeight:800,
    padding:"3px 10px", borderRadius:20, border:`1px solid ${T.border}`,
  },

  mgrCard: {
    background:T.white, borderRadius:20, overflow:"hidden",
    boxShadow:"0 4px 24px rgba(255,107,53,0.1)",
    border:`1.5px solid ${T.border}`, cursor:"pointer", position:"relative",
  },
  mgrStripe: { height:6, background:"linear-gradient(90deg,#ff6b35,#f72585)" },
  mgrBody: { padding:"10px 22px 20px" },
  mgrName: {
    fontFamily:"'Poppins',sans-serif", fontSize:20, fontWeight:800, color:T.text,
    textAlign:"center", margin:"10px 0 3px",
  },
  mgrUser: { fontSize:13, color:T.muted, fontFamily:"monospace", textAlign:"center", margin:"0 0 16px" },

  detailRow: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"11px 14px", background:T.shade,
    borderRadius:10, border:`1px solid ${T.border}`, marginBottom:8,
  },
  detailLbl: { fontSize:12, color:T.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.6px" },

  tagOrange: {
    background:"#fff0e8", color:T.orange, padding:"4px 12px", borderRadius:20,
    fontSize:12, fontWeight:700, border:`1px solid ${T.border}`,
  },
  tagPink: {
    background:"#fff0f6", color:T.pink, padding:"4px 12px", borderRadius:20,
    fontSize:12, fontWeight:700, border:"1px solid #ffd6e7",
  },

  tableCard: {
    background:T.white, borderRadius:20, overflow:"hidden",
    boxShadow:"0 4px 24px rgba(247,37,133,0.07)",
    border:"1.5px solid #ffd6e7", position:"relative",
  },
  th: {
    padding:"13px 16px", textAlign:"left", fontSize:10, fontWeight:800,
    color:T.muted, textTransform:"uppercase", letterSpacing:"1px",
    borderBottom:`1.5px solid ${T.border}`,
  },
  td: { padding:"13px 16px", fontSize:14, color:T.text },
  code: {
    fontFamily:"monospace", fontSize:12, color:"#888",
    background:"#f8f5ff", padding:"3px 8px", borderRadius:6, border:"1px solid #ede9fe",
  },

  emptyCard: {
    background:T.white, borderRadius:20, padding:"40px 28px", textAlign:"center",
    border:`2px dashed ${T.border}`, boxShadow:`0 2px 12px rgba(255,107,53,0.05)`,
  },
  emptyTitle: { fontFamily:"'Poppins',sans-serif", fontSize:16, fontWeight:700, color:T.text, margin:"0 0 6px" },
  emptySub: { fontSize:13, color:T.muted, margin:0, fontWeight:500 },

  btnPrimary: {
    background:"linear-gradient(135deg,#ff6b35,#f72585)",
    color:"#fff", border:"none",
    padding:"11px 26px", borderRadius:12, cursor:"pointer",
    fontWeight:700, fontSize:14, fontFamily:"'Nunito',sans-serif",
    boxShadow:"0 4px 14px rgba(247,37,133,0.3)",
  },
};
