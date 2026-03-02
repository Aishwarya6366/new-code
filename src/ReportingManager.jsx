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

    @keyframes rmSpin     { to { transform: rotate(360deg); } }
    @keyframes rmFadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes rmSlideIn  { from { opacity:0; transform:translateY(-20px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }

    @keyframes rmFloat1 {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      40%     { transform: translateY(-12px) rotate(3deg); }
      70%     { transform: translateY(-6px) rotate(-2deg); }
    }
    @keyframes rmFloat2 {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      35%     { transform: translateY(-9px) rotate(-3deg); }
      65%     { transform: translateY(-4px) rotate(2deg); }
    }
    @keyframes rmFloat3 {
      0%,100% { transform: translateY(0px); }
      50%     { transform: translateY(-14px); }
    }
    @keyframes rmConfetti {
      0%,100% { transform: translateY(0) rotate(0deg); opacity:0.14; }
      50%     { transform: translateY(-8px) rotate(12deg); opacity:0.22; }
    }
    @keyframes rmPulseOrange {
      0%,100% { box-shadow: 0 0 0 4px rgba(255,107,53,0.3), 0 0 0 8px rgba(255,107,53,0.1); }
      50%     { box-shadow: 0 0 0 7px rgba(255,107,53,0.45), 0 0 0 13px rgba(255,107,53,0.15); }
    }
    @keyframes rmPulsePink {
      0%,100% { box-shadow: 0 0 0 4px rgba(247,37,133,0.28), 0 0 0 8px rgba(247,37,133,0.1); }
      50%     { box-shadow: 0 0 0 7px rgba(247,37,133,0.42), 0 0 0 13px rgba(247,37,133,0.15); }
    }
    @keyframes rmOrbitDot {
      from { transform: rotate(0deg) translateX(54px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(54px) rotate(-360deg); }
    }
    @keyframes rmBannerGlow {
      0%,100% { opacity: 0.6; }
      50%     { opacity: 1; }
    }

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
   ANIMATED SVG ILLUSTRATIONS
   ═══════════════════════════════════════════════════════════════ */

/* ── Header banner: org-chart tree ── */
const BannerOrgTree = () => (
  <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg"
    style={{position:"absolute",right:0,top:0,height:"100%",width:400,pointerEvents:"none",zIndex:1}}>
    {/* Connecting lines */}
    <line x1="200" y1="36" x2="120" y2="88" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeDasharray="5 3"/>
    <line x1="200" y1="36" x2="280" y2="88" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeDasharray="5 3"/>
    <line x1="120" y1="88" x2="80"  y2="136" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="4 3"/>
    <line x1="120" y1="88" x2="155" y2="136" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="4 3"/>
    <line x1="280" y1="88" x2="248" y2="136" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="4 3"/>
    <line x1="280" y1="88" x2="316" y2="136" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="4 3"/>

    {/* Root node — boss with crown */}
    <circle cx="200" cy="26" r="26" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
    <circle cx="200" cy="20" r="10" fill="#ffd166"/>
    <ellipse cx="196" cy="18" rx="1.8" ry="2.2" fill="#3b2200"/>
    <ellipse cx="204" cy="18" rx="1.8" ry="2.2" fill="#3b2200"/>
    <path d="M196 23 Q200 27 204 23" stroke="#3b2200" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="191" y="30" width="18" height="10" rx="4" fill="#ff6b35" opacity="0.9"/>
    <polygon points="194,14 197,8 200,14 203,8 206,14" fill="#ffd166" stroke="#ff9a6c" strokeWidth="0.8"/>

    {/* Mid level nodes */}
    {[{cx:120,cy:88,c:"#f72585"},{cx:280,cy:88,c:"#ff9a6c"}].map((n,i)=>(
      <g key={i}>
        <circle cx={n.cx} cy={n.cy} r="19" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5"/>
        <circle cx={n.cx} cy={n.cy-5} r="8" fill="#ffd166"/>
        <rect   x={n.cx-7} y={n.cy+3} width="14" height="9" rx="3" fill={n.c} opacity="0.9"/>
      </g>
    ))}

    {/* Leaf nodes */}
    {[80,155,248,316].map((cx,i)=>(
      <g key={i}>
        <circle cx={cx} cy="136" r="14" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
        <circle cx={cx} cy="131" r="6"  fill="#ffd166" opacity="0.9"/>
        <rect   x={cx-5} y="137" width="10" height="8" rx="2.5"
          fill={i%2===0?"#ff6b35":"#f72585"} opacity="0.85"/>
      </g>
    ))}

    {/* Floating confetti */}
    <rect x="44"  y="18"  w="11" h="11" rx="2" fill="#ffd166" opacity="0.65" transform="rotate(22 50 24)"><animate attributeName="opacity" values="0.65;0.9;0.65" dur="3s" repeatCount="indefinite"/></rect>
    <rect x="352" y="12"  w="10" h="10" rx="2" fill="#ff9a6c" opacity="0.6"  transform="rotate(-14 357 17)"><animate attributeName="opacity" values="0.6;0.85;0.6" dur="4s" repeatCount="indefinite"/></rect>
    <rect x="368" y="110" w="9"  h="9"  rx="2" fill="#f72585" opacity="0.55" transform="rotate(28 372 114)"/>
    <text x="38"  y="96"  fontSize="18" fill="#ffd166" opacity="0.7" style={{animation:"rmBannerGlow 3s ease-in-out infinite"}}>★</text>
    <text x="380" y="48"  fontSize="13" fill="rgba(255,255,255,0.45)">✦</text>
    <text x="380" y="148" fontSize="11" fill="#ffb3d1" opacity="0.7">✦</text>
  </svg>
);

/* ── Manager card: boss illustration ── */
const IlloBoss = () => (
  <svg viewBox="0 0 130 140" xmlns="http://www.w3.org/2000/svg"
    style={{width:110,height:120,position:"absolute",bottom:0,right:0,
      opacity:0.12,pointerEvents:"none",
      animation:"rmFloat1 7s ease-in-out infinite"}}>
    {/* Chair */}
    <rect x="25" y="72" width="80" height="58" rx="12" fill="#ff6b35"/>
    <rect x="12" y="90" width="12" height="32" rx="6" fill="#e85520"/>
    <rect x="106" y="90" width="12" height="32" rx="6" fill="#e85520"/>
    <rect x="8"  y="118" width="114" height="10" rx="5" fill="#cc4415"/>
    {/* Desk */}
    <rect x="5" y="130" width="120" height="8" rx="4" fill="#3b2200" opacity="0.3"/>
    {/* Person head */}
    <ellipse cx="65" cy="46" rx="24" ry="24" fill="#ffd166"/>
    <ellipse cx="65" cy="26" rx="22" ry="10" fill="#3b2200"/>
    <rect    x="43" y="26"  width="44" height="9" fill="#3b2200"/>
    {/* Eyes */}
    <ellipse cx="57" cy="44" rx="4" ry="5" fill="#3b2200"/>
    <ellipse cx="73" cy="44" rx="4" ry="5" fill="#3b2200"/>
    <ellipse cx="58" cy="42" rx="1.5" ry="2" fill="white" opacity="0.6"/>
    <ellipse cx="74" cy="42" rx="1.5" ry="2" fill="white" opacity="0.6"/>
    {/* Cheeks */}
    <ellipse cx="51" cy="51" rx="5.5" ry="4" fill="#ffb347" opacity="0.45"/>
    <ellipse cx="79" cy="51" rx="5.5" ry="4" fill="#ffb347" opacity="0.45"/>
    {/* Smile */}
    <path d="M57 56 Q65 64 73 56" stroke="#3b2200" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Collar + tie */}
    <rect x="55" y="68" width="20" height="8" rx="3" fill="#fff" opacity="0.4"/>
    <polygon points="65,76 61,92 69,92" fill="#f72585"/>
    {/* Crown */}
    <polygon points="55,26 59,17 65,26 71,17 75,26" fill="#ffd166" stroke="#ff9a6c" strokeWidth="1"/>
    {/* Hands */}
    <ellipse cx="40" cy="80" rx="10" ry="9" fill="#ffd166"/>
    <ellipse cx="90" cy="80" rx="10" ry="9" fill="#ffd166"/>
  </svg>
);

/* ── Team section: 3 people ── */
const IlloTeam = () => (
  <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg"
    style={{width:150,height:105,position:"absolute",bottom:0,right:0,
      opacity:0.11,pointerEvents:"none",
      animation:"rmFloat2 8s ease-in-out infinite"}}>
    {[{cx:36,col:"#ff6b35"},{cx:90,col:"#f72585"},{cx:144,col:"#ff9a6c"}].map(({cx,col},i)=>(
      <g key={i}>
        <circle cx={cx} cy="42" r="20" fill="#ffd166"/>
        <rect   x={cx-17} y="60" width="34" height="36" rx="9" fill={col}/>
        {/* Eyes */}
        <ellipse cx={cx-6} cy="40" rx="3" ry="3.5" fill="#3b2200"/>
        <ellipse cx={cx+6} cy="40" rx="3" ry="3.5" fill="#3b2200"/>
        {/* Smile */}
        <path d={`M${cx-6} 48 Q${cx} 54 ${cx+6} 48`} stroke="#3b2200" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* Cheeks */}
        <ellipse cx={cx-12} cy={46} rx="4.5" ry="3" fill="#ffb347" opacity="0.4"/>
        <ellipse cx={cx+12} cy={46} rx="4.5" ry="3" fill="#ffb347" opacity="0.4"/>
      </g>
    ))}
    {/* Connection dashes */}
    <line x1="54"  y1="78" x2="72"  y2="78" stroke="rgba(255,107,53,0.6)" strokeWidth="2" strokeDasharray="4 2"/>
    <line x1="108" y1="78" x2="126" y2="78" stroke="rgba(247,37,133,0.6)" strokeWidth="2" strokeDasharray="4 2"/>
    {/* Stars */}
    <text x="82" y="22" fontSize="14" fill="#ffd166">★</text>
    <text x="18" y="110" fontSize="10" fill="#ff6b35" opacity="0.7">✦</text>
    <text x="158" y="110" fontSize="10" fill="#f72585" opacity="0.7">✦</text>
  </svg>
);

/* ── Empty state: no manager ── */
const EmptyManagerIllo = () => (
  <svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"
    style={{width:160,height:130,margin:"0 auto 8px",display:"block",
      animation:"rmFloat3 5.5s ease-in-out infinite"}}>
    {/* Empty throne/chair */}
    <rect x="50" y="72" width="100" height="72" rx="14" fill="#ffe0cc"/>
    <rect x="36" y="94" width="14" height="40" rx="7" fill="#ff9a6c" opacity="0.5"/>
    <rect x="150" y="94" width="14" height="40" rx="7" fill="#ff9a6c" opacity="0.5"/>
    <rect x="30" y="130" width="140" height="12" rx="6" fill="#ff6b35" opacity="0.3"/>
    {/* Crown floating above */}
    <polygon points="100,26 107,10 100,26 113,10 120,26" fill="#ffd166" opacity="0.5" stroke="#ff9a6c" strokeWidth="1.5"/>
    <text x="78" y="60" fontSize="40" fill="#ff9a6c" opacity="0.3" fontWeight="900" fontFamily="Poppins,sans-serif">?</text>
    {/* Dashed ghost outline */}
    <circle cx="100" cy="52" r="22" fill="none" stroke="#ff9a6c" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.45"/>
    <rect   x="82"  y="72" width="36" height="24" rx="8" fill="none" stroke="#ff9a6c" strokeWidth="2" strokeDasharray="4 3" opacity="0.35"/>
    {/* Floating dots */}
    <circle cx="50" cy="32" r="5" fill="#ffd166" opacity="0.25"/>
    <circle cx="155" cy="44" r="4" fill="#f72585" opacity="0.2"/>
    <circle cx="40" cy="110" r="6" fill="#ff6b35" opacity="0.18"/>
  </svg>
);

/* ── Empty state: no team ── */
const EmptyTeamIllo = () => (
  <svg viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg"
    style={{width:170,height:130,margin:"0 auto 8px",display:"block",
      animation:"rmFloat3 6s ease-in-out infinite"}}>
    {/* Three empty desks */}
    {[36,108,178].map((cx,i)=>(
      <g key={i} opacity="0.32">
        <circle cx={cx} cy="50" r="18" fill="none" stroke="#ff9a6c" strokeWidth="2" strokeDasharray="5 3"/>
        <rect   x={cx-15} y="66" width="30" height="26" rx="7" fill="none" stroke={i===1?"#f72585":"#ff6b35"} strokeWidth="1.8" strokeDasharray="4 3"/>
      </g>
    ))}
    <rect x="14" y="98" width="190" height="9" rx="4" fill="#ffe0cc" opacity="0.6"/>
    {/* Chairs */}
    {[36,108,178].map((cx,i)=>(
      <rect key={i} x={cx-10} y="107" width="20" height="24" rx="5" fill="#ff9a6c" opacity="0.18"/>
    ))}
    <text x="72" y="148" fontSize="13" fill="#ff6b35" opacity="0.45" fontWeight="700" fontFamily="Nunito,sans-serif">No team members yet</text>
    <circle cx="20"  cy="140" r="4" fill="#ffd166" opacity="0.22"/>
    <circle cx="200" cy="30"  r="5" fill="#f72585" opacity="0.18"/>
  </svg>
);

/* ── Floating background confetti (fixed behind page) ── */
const BackgroundConfetti = () => (
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
    {[
      {x:"7%",  y:"10%",s:13,c:"#ff6b35",r:22, d:0},
      {x:"91%", y:"7%", s:10,c:"#f72585",r:-16,d:1.4},
      {x:"4%",  y:"52%",s:15,c:"#ffd166",r:28, d:0.7},
      {x:"94%", y:"42%",s:10,c:"#ff9a6c",r:-24,d:2.1},
      {x:"48%", y:"92%",s:12,c:"#7209b7",r:14, d:2.9},
      {x:"22%", y:"88%",s:9, c:"#f72585",r:-10,d:0.9},
      {x:"76%", y:"86%",s:11,c:"#ff6b35",r:34, d:2.7},
      {x:"33%", y:"5%", s:9, c:"#ffd166",r:-18,d:0.4},
      {x:"63%", y:"3%", s:8, c:"#ff9a6c",r:23, d:1.7},
      {x:"15%", y:"30%",s:7, c:"#7209b7",r:15, d:3.1},
      {x:"85%", y:"60%",s:8, c:"#ffd166",r:-30,d:1.2},
    ].map((p,i)=>(
      <div key={i} style={{
        position:"absolute",left:p.x,top:p.y,
        width:p.s,height:p.s,borderRadius:3,
        background:p.c,opacity:0.13,
        transform:`rotate(${p.r}deg)`,
        animation:`rmConfetti ${4.5+p.d}s ease-in-out ${p.d}s infinite`,
      }}/>
    ))}
    {[
      {x:"11%",y:"34%",d:1},{x:"87%",y:"26%",d:2.1},
      {x:"19%",y:"70%",d:0.5},{x:"80%",y:"65%",d:1.6},
      {x:"52%",y:"50%",d:3},{x:"38%",y:"78%",d:0.8},
    ].map((p,i)=>(
      <span key={i} style={{
        position:"absolute",left:p.x,top:p.y,
        fontSize:15,color:"#ff9a6c",opacity:0.13,
        animation:`rmFloat${(i%3)+1} ${5.5+p.d}s ease-in-out ${p.d}s infinite`,
      }}>✦</span>
    ))}
  </div>
);

/* ── Avatar with animated orbit dot ── */
const AnimatedAvatar = ({ letter, isManager }) => (
  <div style={{position:"relative",width:86,height:86,flexShrink:0}}>
    {/* Orbit dot */}
    <div style={{
      position:"absolute",inset:0,
      animation:"rmOrbitDot 4s linear infinite",
      borderRadius:"50%",
    }}>
      <div style={{
        width:10,height:10,borderRadius:"50%",
        background:isManager?"#ffd166":"#ff9a6c",
        boxShadow:`0 0 6px ${isManager?"#ffd166":"#ff9a6c"}`,
        marginTop:3,marginLeft:"50%",transform:"translateX(-50%)",
      }}/>
    </div>
    {/* Avatar circle */}
    <div style={{
      position:"absolute",inset:8,
      borderRadius:"50%",
      background:isManager
        ?"linear-gradient(135deg,#ff6b35,#f72585)"
        :"linear-gradient(135deg,#f72585,#7209b7)",
      display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:28,fontWeight:900,color:"#fff",
      fontFamily:"'Poppins',sans-serif",
      animation:isManager?"rmPulseOrange 3s ease-in-out infinite":"rmPulsePink 3.2s ease-in-out 0.4s infinite",
    }}>
      {letter}
      {/* Crown for manager */}
      {isManager && (
        <div style={{
          position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",
          fontSize:14,lineHeight:1,
        }}>👑</div>
      )}
    </div>
  </div>
);

/* ── Table row avatar ── */
const RowAvatar = ({ letter, idx }) => {
  const colors = [
    "linear-gradient(135deg,#ff6b35,#f72585)",
    "linear-gradient(135deg,#f72585,#7209b7)",
    "linear-gradient(135deg,#ff9a6c,#ff6b35)",
    "linear-gradient(135deg,#7209b7,#f72585)",
  ];
  return (
    <div style={{
      width:38,height:38,borderRadius:"50%",flexShrink:0,
      background:colors[idx%4],
      display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:15,fontWeight:800,color:"#fff",
      fontFamily:"'Poppins',sans-serif",
      boxShadow:"0 2px 10px rgba(247,37,133,0.25)",
    }}>
      {letter}
    </div>
  );
};

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
   MAIN COMPONENT  —  100% original logic preserved
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
    <div className="rm-root" style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:420,flexDirection:"column",gap:20}}>
      <BackgroundConfetti/>
      <div style={{
        width:56,height:56,
        border:"5px solid #ffe0cc",borderTopColor:T.orange,
        borderRadius:"50%",animation:"rmSpin 0.85s linear infinite",
      }}/>
      <p style={{fontSize:15,color:T.muted,fontWeight:700,margin:0}}>Loading reporting structure…</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="rm-root" style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:420,flexDirection:"column",gap:14}}>
      <BackgroundConfetti/>
      <div style={{fontSize:60}}>⚠️</div>
      <h2 style={{fontFamily:"'Poppins',sans-serif",fontSize:22,fontWeight:700,color:T.text,margin:0}}>Error Loading Data</h2>
      <p style={{color:T.muted,fontSize:15,margin:0}}>{error}</p>
      <button className="rm-btn" style={S.btnPrimary} onClick={loadAllData}>↻ Retry</button>
    </div>
  );

  /* ── Main ── */
  return (
    <div className="rm-root" style={S.page}>
      <BackgroundConfetti/>

      {/* ══ HEADER BANNER ══ */}
      <div style={S.banner}>
        <div style={S.bannerInner}>
         
          <h1 style={S.bannerTitle}>Reporting Structure</h1>
          <p style={S.bannerSub}>View your manager and the team reporting to you</p>
          {/* <div style={S.rolePill}>
            {role === "MANAGER" ? "👔 Manager View" : "👤 Employee View"}
          </div> */}
        </div>
        <BannerOrgTree/>
      </div>

      {/* ══ STAT CHIPS ══ */}
      <div style={S.chipRow}>
        {[
          {icon:"👤",label:"My Manager",  value: manager ? manager.managerName : "Not Assigned", color:T.orange},
          {icon:"👥",label:"Team Size",   value:`${employees.length} member${employees.length!==1?"s":""}`, color:T.pink},
          {icon:"🏷️",label:"My Role",    value: role||"—",                                                color:T.purple},
          
        ].map((c,i)=>(
          <div key={i} className="rm-stat-chip" style={{
            flex:1,minWidth:160,
            background:T.white,
            border:`1.5px solid ${c.color}28`,
            borderLeft:`5px solid ${c.color}`,
            borderRadius:14,padding:"13px 16px",
            display:"flex",alignItems:"center",gap:11,
            boxShadow:`0 2px 12px ${c.color}12`,cursor:"default",
          }}>
            <span style={{fontSize:24}}>{c.icon}</span>
            <div>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:"0.9px",marginBottom:2}}>{c.label}</div>
              <div style={{fontSize:14,fontWeight:800,color:T.text}}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ CONTENT GRID ══ */}
      <div style={S.grid}>

        {/* ── MY MANAGER ── */}
        <section style={{position:"relative",animation:"rmFadeUp 0.45s ease both",animationDelay:"0.1s"}}>
          <div style={S.sectionHead}>
            <div style={{...S.sectionIconBox,background:"#fff0e8",border:`1.5px solid ${T.border}`}}>
              <span style={{fontSize:20}}>👤</span>
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
              <IlloBoss/>
              <div style={S.mgrStripe}/>

              <div style={{display:"flex",justifyContent:"center",paddingTop:28}}>
                <AnimatedAvatar letter={manager.managerName?.charAt(0).toUpperCase()} isManager/>
              </div>

              <div style={S.mgrBody}>
                <h3 style={S.mgrName}>{manager.managerName}</h3>
                <p style={S.mgrUser}>@{manager.managerUsername}</p>

                <div style={S.detailRow}>
                  <span style={S.detailLbl}>Designation</span>
                  <span style={S.tagOrange}>{manager.designation}</span>
                </div>
                <div style={{...S.detailRow,marginBottom:0}}>
                  <span style={S.detailLbl}>Department</span>
                  <span style={S.tagPink}>{manager.department}</span>
                </div>

 
              </div>
            </div>
          ) : (
            <div style={S.emptyCard}>
              <EmptyManagerIllo/>
              <p style={S.emptyTitle}>No Manager Assigned</p>
              <p style={S.emptySub}>You may be at the top of the hierarchy</p>
            </div>
          )}
        </section>

        {/* ── MY TEAM ── */}
        <section style={{position:"relative",animation:"rmFadeUp 0.45s ease both",animationDelay:"0.2s"}}>
          <div style={S.sectionHead}>
            <div style={{...S.sectionIconBox,background:"#fff0f6",border:`1.5px solid #ffd6e7`}}>
              <span style={{fontSize:20}}>👥</span>
            </div>
            <h2 style={S.sectionTitle}>
              My Team
              <span style={S.teamBadge}>{employees.length}</span>
            </h2>
          </div>

          {employees.length === 0 ? (
            <div style={S.emptyCard}>
              <EmptyTeamIllo/>
              <p style={S.emptyTitle}>No Team Members Yet</p>
              <p style={S.emptySub}>No employees are currently reporting to you</p>
            </div>
          ) : (
            <div style={S.tableCard}>
              <IlloTeam/>
              <div style={{overflowX:"auto",overflowY:"auto",maxHeight:460}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"linear-gradient(90deg,#fff8f5,#fff5fb)",position:"sticky",top:0,zIndex:2}}>
                      {["Id","UserName","EmployeeId","Designation","Department"].map(h=>(
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((e, idx) => (
                      <tr
                        key={e.employeeId}
                        className="rm-trow"
                        style={{borderBottom:`1px solid ${T.shade}`,cursor:"pointer"}}
                        onClick={() => setSelectedPerson({
                          id: e.employeeId,
                          name: e.employeeName,
                          username: e.employeeUsername,
                          designation: e.designation,
                          department: e.department,
                          isManager: false,
                        })}
                      >
                        <td style={{...S.td,color:T.muted,fontWeight:700,width:40}}>{idx+1}</td>
                        <td style={S.td}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <RowAvatar letter={e.employeeName?.charAt(0).toUpperCase()} idx={idx}/>
                            <span style={{fontWeight:700,color:T.text,fontSize:14}}>{e.employeeName}</span>
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
            position:"fixed",inset:0,
            background:"rgba(26,26,46,0.55)",
            display:"flex",alignItems:"center",justifyContent:"center",
            zIndex:1000,padding:20,
            backdropFilter:"blur(4px)",
          }}
          onClick={() => setSelectedPerson(null)}
        >
          <div
            style={{
              background:T.white,
              borderRadius:22,width:"100%",maxWidth:440,
              boxShadow:"0 28px 65px rgba(0,0,0,0.18)",
              animation:"rmSlideIn 0.28s cubic-bezier(.22,1,.36,1) both",
              overflow:"hidden",border:`1.5px solid ${T.border}`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{
              background:"linear-gradient(135deg,#fff8f5,#fff0f6)",
              borderBottom:`1.5px solid ${T.border}`,
              padding:"24px 24px 20px",
              display:"flex",alignItems:"center",gap:16,
              position:"relative",
            }}>
              <AnimatedAvatar
                letter={selectedPerson.name?.charAt(0).toUpperCase()}
                isManager={selectedPerson.isManager}
              />
              <div style={{flex:1}}>
                <h2 style={{fontFamily:"'Poppins',sans-serif",fontSize:19,fontWeight:800,color:T.text,margin:"0 0 3px"}}>{selectedPerson.name}</h2>
                <p style={{fontSize:13,color:T.muted,fontFamily:"monospace",margin:"0 0 8px"}}>@{selectedPerson.username}</p>
                <span style={selectedPerson.isManager?S.tagOrange:S.tagPink}>
                  {selectedPerson.isManager?"👔 Manager":"👤 Employee"}
                </span>
              </div>
              <button
                className="rm-close-btn"
                style={{
                  position:"absolute",top:16,right:16,
                  background:"rgba(0,0,0,0.05)",border:"none",
                  fontSize:20,color:T.muted,cursor:"pointer",
                  width:32,height:32,borderRadius:"50%",
                  display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,
                }}
                onClick={() => setSelectedPerson(null)}
              >×</button>
            </div>

            {/* Modal body */}
            <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:10}}>
              {[
                {label:"Employee ID", value: selectedPerson.id,          badge:null},
                {label:"Designation", value: selectedPerson.designation, badge:"orange"},
                {label:"Department",  value: selectedPerson.department,  badge:"pink"},
              ].map((row,i)=>(
                <div key={i} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"12px 14px",background:T.shade,
                  borderRadius:12,border:`1px solid ${T.border}`,
                }}>
                  <span style={{fontSize:12,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:"0.8px"}}>{row.label}</span>
                  {row.badge==="orange"?<span style={S.tagOrange}>{row.value}</span>
                  :row.badge==="pink"  ?<span style={S.tagPink}>{row.value}</span>
                  :<code style={S.code}>{row.value}</code>}
                </div>
              ))}
            </div>

            <div style={{padding:"14px 24px 22px",borderTop:`1.5px solid ${T.shade}`,textAlign:"right"}}>
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
  page:{maxWidth:1300,margin:"0 auto",padding:"26px 20px 52px",
    fontFamily:"'Nunito',sans-serif",background:T.bg,minHeight:"100vh",position:"relative"},

  /* Banner */
  banner:{
    background:"linear-gradient(125deg,#ff6b35 0%,#f72585 55%,#7209b7 100%)",
    borderRadius:22,minHeight:172,marginBottom:22,
    position:"relative",overflow:"hidden",
    boxShadow:"0 12px 40px rgba(247,37,133,0.28)",
    display:"flex",alignItems:"stretch",
    animation:"rmFadeUp 0.5s ease both",
  },
  bannerInner:{
    position:"relative",zIndex:2,
    padding:"32px 36px",flex:1,paddingRight:340,
    display:"flex",flexDirection:"column",justifyContent:"center",gap:8,
  },
  bannerTag:{
    display:"inline-block",background:"rgba(255,255,255,0.2)",
    color:"#fff",fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",
    padding:"4px 12px",borderRadius:20,border:"1px solid rgba(255,255,255,0.35)",
    width:"fit-content",marginBottom:4,
  },
  bannerTitle:{
    fontFamily:"'Poppins',sans-serif",fontSize:30,fontWeight:800,color:"#fff",
    margin:0,lineHeight:1.15,letterSpacing:"-0.5px",
  },
  bannerSub:{fontSize:13,color:"rgba(255,255,255,0.78)",fontWeight:500,margin:0},
  rolePill:{
    display:"inline-block",marginTop:4,
    background:"rgba(255,255,255,0.22)",color:"#fff",
    fontSize:13,fontWeight:700,padding:"6px 16px",borderRadius:20,
    border:"1px solid rgba(255,255,255,0.4)",width:"fit-content",
  },

  /* Stat chips */
  chipRow:{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap",
    animation:"rmFadeUp 0.5s ease both",animationDelay:"0.08s"},

  /* Grid */
  grid:{display:"grid",gridTemplateColumns:"1fr 2fr",gap:26,alignItems:"start"},

  /* Section header */
  sectionHead:{display:"flex",alignItems:"center",gap:12,marginBottom:16},
  sectionIconBox:{width:42,height:42,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"},
  sectionTitle:{fontFamily:"'Poppins',sans-serif",fontSize:19,fontWeight:700,color:T.text,
    margin:0,display:"flex",alignItems:"center",gap:10},
  teamBadge:{background:T.shade,color:T.orange,fontSize:12,fontWeight:800,
    padding:"3px 10px",borderRadius:20,border:`1px solid ${T.border}`},

  /* Manager card */
  mgrCard:{
    background:T.white,borderRadius:20,overflow:"hidden",
    boxShadow:"0 4px 24px rgba(255,107,53,0.1)",
    border:`1.5px solid ${T.border}`,cursor:"pointer",position:"relative",
  },
  mgrStripe:{height:6,background:"linear-gradient(90deg,#ff6b35,#f72585)"},
  mgrBody:{padding:"10px 22px 20px"},
  mgrName:{fontFamily:"'Poppins',sans-serif",fontSize:20,fontWeight:800,color:T.text,
    textAlign:"center",margin:"10px 0 3px"},
  mgrUser:{fontSize:13,color:T.muted,fontFamily:"monospace",textAlign:"center",margin:"0 0 16px"},
  clickHint:{marginTop:14,paddingTop:12,borderTop:`1.5px dashed ${T.border}`,
    textAlign:"center",fontSize:12,fontWeight:700,color:T.peach},

  detailRow:{
    display:"flex",justifyContent:"space-between",alignItems:"center",
    padding:"11px 14px",background:T.shade,
    borderRadius:10,border:`1px solid ${T.border}`,marginBottom:8,
  },
  detailLbl:{fontSize:12,color:T.muted,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.6px"},

  /* Tags */
  tagOrange:{background:"#fff0e8",color:T.orange,padding:"4px 12px",borderRadius:20,
    fontSize:12,fontWeight:700,border:`1px solid ${T.border}`},
  tagPink:{background:"#fff0f6",color:T.pink,padding:"4px 12px",borderRadius:20,
    fontSize:12,fontWeight:700,border:"1px solid #ffd6e7"},

  /* Table */
  tableCard:{
    background:T.white,borderRadius:20,overflow:"hidden",
    boxShadow:"0 4px 24px rgba(247,37,133,0.07)",
    border:`1.5px solid #ffd6e7`,position:"relative",
  },
  th:{padding:"13px 16px",textAlign:"left",fontSize:10,fontWeight:800,
    color:T.muted,textTransform:"uppercase",letterSpacing:"1px",
    borderBottom:`1.5px solid ${T.border}`},
  td:{padding:"13px 16px",fontSize:14,color:T.text},
  code:{fontFamily:"monospace",fontSize:12,color:"#888",
    background:"#f8f5ff",padding:"3px 8px",borderRadius:6,border:"1px solid #ede9fe"},

  /* Empty */
  emptyCard:{background:T.white,borderRadius:20,padding:"40px 28px",textAlign:"center",
    border:`2px dashed ${T.border}`,boxShadow:`0 2px 12px rgba(255,107,53,0.05)`},
  emptyTitle:{fontFamily:"'Poppins',sans-serif",fontSize:16,fontWeight:700,color:T.text,margin:"0 0 6px"},
  emptySub:{fontSize:13,color:T.muted,margin:0,fontWeight:500},

  /* Button */
  btnPrimary:{
    background:"linear-gradient(135deg,#ff6b35,#f72585)",
    color:"#fff",border:"none",
    padding:"11px 26px",borderRadius:12,cursor:"pointer",
    fontWeight:700,fontSize:14,fontFamily:"'Nunito',sans-serif",
    boxShadow:"0 4px 14px rgba(247,37,133,0.3)",
  },
};
