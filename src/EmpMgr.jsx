import React, { useState, useEffect } from 'react';
import axios from 'axios';

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES INJECTION
   ═══════════════════════════════════════════════════════════════ */
(function injectStyles() {
  if (document.getElementById('empmgr-styles')) return;
  const s = document.createElement('style');
  s.id = 'empmgr-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800&display=swap');

    .empmgr * { box-sizing: border-box; }
    .empmgr { font-family: 'Nunito', sans-serif; }

    /* ── Keyframes ── */
    @keyframes mgr-spin    { to { transform: rotate(360deg); } }
    @keyframes mgr-fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes mgr-float1  { 0%,100%{transform:translateY(0) rotate(0deg);} 40%{transform:translateY(-12px) rotate(3deg);} 70%{transform:translateY(-6px) rotate(-2deg);} }
    @keyframes mgr-float2  { 0%,100%{transform:translateY(0) rotate(0deg);} 35%{transform:translateY(-9px) rotate(-3deg);} 65%{transform:translateY(-4px) rotate(2deg);} }
    @keyframes mgr-float3  { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-13px);} }
    @keyframes mgr-confetti{ 0%,100%{transform:translateY(0) rotate(0deg);opacity:.13;} 50%{transform:translateY(-9px) rotate(14deg);opacity:.22;} }
    @keyframes mgr-orbit   { from{transform:rotate(0deg) translateX(46px) rotate(0deg);} to{transform:rotate(360deg) translateX(46px) rotate(-360deg);} }
    @keyframes mgr-pulse-o { 0%,100%{box-shadow:0 0 0 4px rgba(255,107,53,.3),0 0 0 8px rgba(255,107,53,.1);} 50%{box-shadow:0 0 0 7px rgba(255,107,53,.45),0 0 0 13px rgba(255,107,53,.15);} }
    @keyframes mgr-pulse-p { 0%,100%{box-shadow:0 0 0 4px rgba(247,37,133,.28),0 0 0 8px rgba(247,37,133,.1);} 50%{box-shadow:0 0 0 7px rgba(247,37,133,.42),0 0 0 13px rgba(247,37,133,.15);} }
    @keyframes mgr-glow    { 0%,100%{opacity:.55;} 50%{opacity:1;} }
    @keyframes mgr-gradient{ 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }

    /* ── Hover effects ── */
    .mgr-card:hover           { transform:translateY(-5px) !important; box-shadow:0 18px 50px rgba(255,107,53,.18) !important; }
    .mgr-card                 { transition:transform .25s ease, box-shadow .25s ease; }
    .mgr-trow:hover           { background:#fff8f5 !important; transform:translateX(4px); }
    .mgr-trow                 { transition:background .18s, transform .2s; }
    .mgr-search-input:focus   { outline:none; border-color:#ff6b35 !important; box-shadow:0 0 0 3px rgba(255,107,53,.18) !important; background:#fff !important; }
    .mgr-btn-primary:hover    { transform:translateY(-2px); box-shadow:0 8px 24px rgba(247,37,133,.38) !important; }
    .mgr-btn-primary          { transition:transform .2s, box-shadow .2s; }
    .mgr-btn-secondary:hover  { background:#ffe0cc !important; color:#ff6b35 !important; }
    .mgr-btn-secondary        { transition:background .2s, color .2s; }
    .mgr-chip:hover           { transform:translateY(-3px); box-shadow:0 6px 20px rgba(255,107,53,.2) !important; }
    .mgr-chip                 { transition:transform .2s, box-shadow .2s; }
    .mgr-emp-row:hover        { cursor:pointer; }
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
const T = {
  orange:'#ff6b35', pink:'#f72585', purple:'#7209b7',
  peach:'#ff9a6c',  yellow:'#ffd166',
  bg:'#fff9f6',     white:'#ffffff',
  text:'#1a1a2e',   muted:'#9ca3af',
  border:'#ffe0cc', shade:'#fff0e8',
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED SVG ILLUSTRATIONS
   ═══════════════════════════════════════════════════════════════ */

/* Banner: search/magnifier + people org chart */
const BannerIllo = () => (
  <svg viewBox="0 0 420 165" xmlns="http://www.w3.org/2000/svg"
    style={{position:'absolute',right:0,top:0,height:'100%',width:420,pointerEvents:'none',zIndex:1}}>
    {/* Big magnifier */}
    <circle cx="210" cy="82" r="50" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.4)" strokeWidth="4"/>
    <circle cx="210" cy="82" r="36" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" strokeWidth="2"/>
    {/* Magnifier handle */}
    <line x1="248" y1="120" x2="278" y2="150" stroke="rgba(255,255,255,.5)" strokeWidth="7" strokeLinecap="round"/>
    <line x1="248" y1="120" x2="278" y2="150" stroke="rgba(255,255,255,.2)" strokeWidth="11" strokeLinecap="round"/>
    {/* People inside lens */}
    <circle cx="200" cy="70" r="11" fill="#ffd166"/>
    <rect   x="192" y="80" width="16" height="14" rx="5" fill="#ff6b35" opacity=".9"/>
    <ellipse cx="196" cy="68" rx="2" ry="2.5" fill="#3b2200"/>
    <ellipse cx="204" cy="68" rx="2" ry="2.5" fill="#3b2200"/>
    <path d="M196 74 Q200 78 204 74" stroke="#3b2200" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

    <circle cx="224" cy="78" r="10" fill="#ffd166"/>
    <rect   x="216" y="87" width="16" height="12" rx="4" fill="#f72585" opacity=".9"/>

    {/* Org chart tree at right */}
    <line x1="340" y1="30" x2="300" y2="72" stroke="rgba(255,255,255,.28)" strokeWidth="1.8" strokeDasharray="4 3"/>
    <line x1="340" y1="30" x2="380" y2="72" stroke="rgba(255,255,255,.28)" strokeWidth="1.8" strokeDasharray="4 3"/>
    <line x1="300" y1="72" x2="285" y2="112" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" strokeDasharray="3 3"/>
    <line x1="300" y1="72" x2="318" y2="112" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" strokeDasharray="3 3"/>
    <circle cx="340" cy="24" r="18" fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
    <circle cx="340" cy="18" r="8"  fill="#ffd166"/>
    <rect   x="332" y="26" width="16" height="10" rx="3.5" fill="#ff6b35" opacity=".9"/>
    <polygon points="336,12 340,6 344,12" fill="#ffd166" stroke="#ff9a6c" strokeWidth=".8"/>
    {[{cx:300,c:'#f72585'},{cx:380,c:'#ff9a6c'}].map(({cx,c},i)=>(
      <g key={i}>
        <circle cx={cx} cy="72" r="14" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.32)" strokeWidth="1.2"/>
        <circle cx={cx} cy="67" r="6"  fill="#ffd166" opacity=".9"/>
        <rect   x={cx-5} y="73" width="10" height="8" rx="2.5" fill={c} opacity=".9"/>
      </g>
    ))}
    {[285,318].map((cx,i)=>(
      <g key={i}>
        <circle cx={cx} cy="112" r="11" fill="rgba(255,255,255,.13)" stroke="rgba(255,255,255,.28)" strokeWidth="1"/>
        <circle cx={cx} cy="108" r="5"  fill="#ffd166" opacity=".8"/>
        <rect   x={cx-4} y="113" width="8" height="6" rx="2" fill={i===0?'#ff6b35':'#f72585'} opacity=".85"/>
      </g>
    ))}
    {/* Confetti */}
    <rect x="44"  y="16" width="11" height="11" rx="2" fill="#ffd166" opacity=".6" transform="rotate(22 50 22)">
      <animate attributeName="opacity" values=".6;.9;.6" dur="3s" repeatCount="indefinite"/>
    </rect>
    <rect x="390" y="130" width="9" height="9" rx="2" fill="#f72585" opacity=".5" transform="rotate(-18 394 134)"/>
    <text x="36"  y="90"  fontSize="16" fill="#ffd166" opacity=".7" style={{animation:'mgr-glow 3s ease-in-out infinite'}}>★</text>
    <text x="395" y="50"  fontSize="12" fill="rgba(255,255,255,.4)">✦</text>
    <text x="48"  y="148" fontSize="10" fill="#ffb3d1" opacity=".6">✦</text>
  </svg>
);

/* Employee card illustration */
const IlloEmployee = () => (
  <svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg"
    style={{width:100,height:110,position:'absolute',bottom:0,right:0,
      opacity:.12,pointerEvents:'none',animation:'mgr-float1 7s ease-in-out infinite'}}>
    {/* ID card */}
    <rect x="15" y="10" width="90" height="115" rx="12" fill="#ff6b35"/>
    <rect x="15" y="10" width="90" height="30"  rx="12" fill="#e85520"/>
    <rect x="15" y="28" width="90" height="12" fill="#e85520"/>
    {/* Photo */}
    <circle cx="60" cy="55" r="18" fill="#ffd166"/>
    <circle cx="60" cy="49" r="7"  fill="#3b2200"/>
    <ellipse cx="56" cy="54" rx="3" ry="3.5" fill="#3b2200"/>
    <ellipse cx="64" cy="54" rx="3" ry="3.5" fill="#3b2200"/>
    <path d="M56 60 Q60 65 64 60" stroke="#3b2200" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <rect x="40" y="72" width="40" height="18" rx="6" fill="#fff" opacity=".25"/>
    {/* Lines */}
    <rect x="25" y="96"  width="70" height="6" rx="3" fill="rgba(255,255,255,.4)"/>
    <rect x="25" y="107" width="50" height="5" rx="2.5" fill="rgba(255,255,255,.25)"/>
    <rect x="25" y="116" width="60" height="5" rx="2.5" fill="rgba(255,255,255,.25)"/>
  </svg>
);

/* Manager card illustration */
const IlloManager = () => (
  <svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg"
    style={{width:100,height:110,position:'absolute',bottom:0,right:0,
      opacity:.11,pointerEvents:'none',animation:'mgr-float2 8s ease-in-out infinite'}}>
    {/* Chair */}
    <rect x="22" y="68" width="76" height="54" rx="11" fill="#f72585"/>
    <rect x="10" y="85" width="12" height="30" rx="6" fill="#d4006e"/>
    <rect x="98" y="85" width="12" height="30" rx="6" fill="#d4006e"/>
    <rect x="6"  y="111" width="108" height="10" rx="5" fill="#b00060"/>
    {/* Person */}
    <ellipse cx="60" cy="44" rx="22" ry="22" fill="#ffd166"/>
    <ellipse cx="60" cy="26" rx="20" ry="9"  fill="#3b2200"/>
    <rect x="40" y="26" width="40" height="8" fill="#3b2200"/>
    <ellipse cx="53" cy="42" rx="3.5" ry="4.5" fill="#3b2200"/>
    <ellipse cx="67" cy="42" rx="3.5" ry="4.5" fill="#3b2200"/>
    <path d="M53 52 Q60 60 67 52" stroke="#3b2200" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="47" cy="49" rx="5" ry="3.5" fill="#ffb347" opacity=".45"/>
    <ellipse cx="73" cy="49" rx="5" ry="3.5" fill="#ffb347" opacity=".45"/>
    {/* Crown */}
    <polygon points="52,26 56,17 60,26 64,17 68,26" fill="#ffd166" stroke="#ff9a6c" strokeWidth="1"/>
    {/* Tie */}
    <polygon points="60,66 56,80 64,80" fill="#ff6b35"/>
    {/* Hands */}
    <ellipse cx="38" cy="76" rx="9" ry="8" fill="#ffd166"/>
    <ellipse cx="82" cy="76" rx="9" ry="8" fill="#ffd166"/>
  </svg>
);

/* Direct reports illustration */
const IlloTeam = () => (
  <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
    style={{width:160,height:96,position:'absolute',bottom:0,right:0,
      opacity:.1,pointerEvents:'none',animation:'mgr-float3 9s ease-in-out infinite'}}>
    {[{cx:40,c:'#ff6b35'},{cx:100,c:'#f72585'},{cx:160,c:'#ff9a6c'}].map(({cx,c},i)=>(
      <g key={i}>
        <circle cx={cx} cy="40" r="19" fill="#ffd166"/>
        <rect   x={cx-16} y="57" width="32" height="32" rx="9" fill={c}/>
        <ellipse cx={cx-5} cy="38" rx="2.8" ry="3.3" fill="#3b2200"/>
        <ellipse cx={cx+5} cy="38" rx="2.8" ry="3.3" fill="#3b2200"/>
        <path d={`M${cx-5} 46 Q${cx} 52 ${cx+5} 46`} stroke="#3b2200" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      </g>
    ))}
    <line x1="58"  y1="72" x2="82"  y2="72" stroke="rgba(255,107,53,.6)" strokeWidth="2" strokeDasharray="4 2"/>
    <line x1="118" y1="72" x2="142" y2="72" stroke="rgba(247,37,133,.6)" strokeWidth="2" strokeDasharray="4 2"/>
    <text x="92" y="20" fontSize="14" fill="#ffd166">★</text>
    <text x="16" y="108" fontSize="9"  fill="#ff6b35" opacity=".7">✦</text>
    <text x="180" y="108" fontSize="9" fill="#f72585" opacity=".7">✦</text>
  </svg>
);

/* Empty placeholder illustration */
const IlloEmpty = () => (
  <svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"
    style={{width:160,height:130,margin:'0 auto 10px',display:'block',animation:'mgr-float3 6s ease-in-out infinite'}}>
    <circle cx="100" cy="60"  r="34" fill="none" stroke="#ff9a6c" strokeWidth="3" strokeDasharray="6 3" opacity=".45"/>
    <rect   x="78"  y="90"   width="44" height="28" rx="9" fill="none" stroke="#ff9a6c" strokeWidth="2.5" strokeDasharray="5 3" opacity=".35"/>
    <text x="84" y="70" fontSize="28" fill="#ff9a6c" opacity=".3" fontWeight="900">?</text>
    <rect x="40" y="132" width="120" height="8" rx="4" fill="#ffe0cc" opacity=".5"/>
    <circle cx="40"  cy="36" r="5" fill="#ffd166" opacity=".25"/>
    <circle cx="162" cy="50" r="4" fill="#f72585" opacity=".2"/>
    <circle cx="30"  cy="110" r="6" fill="#ff6b35" opacity=".18"/>
  </svg>
);

/* Floating page background confetti */
const PageConfetti = () => (
  <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
    {[
      {x:'6%', y:'9%', s:13,c:'#ff6b35',r:22, d:0},
      {x:'92%',y:'6%', s:10,c:'#f72585',r:-16,d:1.3},
      {x:'3%', y:'50%',s:15,c:'#ffd166',r:28, d:0.6},
      {x:'95%',y:'40%',s:9, c:'#ff9a6c',r:-24,d:2.0},
      {x:'47%',y:'93%',s:12,c:'#7209b7',r:14, d:2.8},
      {x:'21%',y:'87%',s:9, c:'#f72585',r:-10,d:0.8},
      {x:'75%',y:'85%',s:11,c:'#ff6b35',r:34, d:2.6},
      {x:'32%',y:'4%', s:8, c:'#ffd166',r:-18,d:0.4},
      {x:'62%',y:'2%', s:8, c:'#ff9a6c',r:23, d:1.6},
      {x:'14%',y:'28%',s:7, c:'#7209b7',r:15, d:3.0},
      {x:'84%',y:'58%',s:8, c:'#ffd166',r:-30,d:1.1},
    ].map((p,i)=>(
      <div key={i} style={{
        position:'absolute',left:p.x,top:p.y,
        width:p.s,height:p.s,borderRadius:3,
        background:p.c,opacity:.13,
        transform:`rotate(${p.r}deg)`,
        animation:`mgr-confetti ${4.5+p.d}s ease-in-out ${p.d}s infinite`,
      }}/>
    ))}
    {[{x:'10%',y:'32%',d:1},{x:'87%',y:'24%',d:2},{x:'18%',y:'68%',d:.5},{x:'79%',y:'62%',d:1.5}].map((p,i)=>(
      <span key={i} style={{position:'absolute',left:p.x,top:p.y,fontSize:15,color:'#ff9a6c',opacity:.13,
        animation:`mgr-float${(i%3)+1} ${5.5+p.d}s ease-in-out ${p.d}s infinite`}}>✦</span>
    ))}
  </div>
);

/* Orbit avatar with spinning dot */
const OrbitAvatar = ({ letter, color='orange' }) => (
  <div style={{position:'relative',width:80,height:80,flexShrink:0}}>
    <div style={{position:'absolute',inset:0,animation:'mgr-orbit 4s linear infinite',borderRadius:'50%'}}>
      <div style={{width:9,height:9,borderRadius:'50%',
        background:color==='orange'?T.yellow:T.peach,
        boxShadow:`0 0 6px ${color==='orange'?T.yellow:T.peach}`,
        marginTop:2,marginLeft:'50%',transform:'translateX(-50%)'}}/>
    </div>
    <div style={{
      position:'absolute',inset:8,borderRadius:'50%',
      background:color==='orange'
        ?`linear-gradient(135deg,${T.orange},${T.pink})`
        :`linear-gradient(135deg,${T.pink},${T.purple})`,
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:24,fontWeight:900,color:'#fff',
      fontFamily:"'Poppins',sans-serif",
      animation:color==='orange'?'mgr-pulse-o 3s ease-in-out infinite':'mgr-pulse-p 3.2s ease-in-out .4s infinite',
    }}>
      {letter}
      {color==='orange' && <span style={{position:'absolute',top:-6,left:'50%',transform:'translateX(-50%)',fontSize:13}}>👑</span>}
    </div>
  </div>
);

/* Row avatar for table */
const RowAvatar = ({ letter, idx }) => {
  const bgs = [
    `linear-gradient(135deg,${T.orange},${T.pink})`,
    `linear-gradient(135deg,${T.pink},${T.purple})`,
    `linear-gradient(135deg,${T.peach},${T.orange})`,
    `linear-gradient(135deg,${T.purple},${T.pink})`,
  ];
  return (
    <div style={{width:36,height:36,borderRadius:'50%',background:bgs[idx%4],flexShrink:0,
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:14,fontWeight:800,color:'#fff',fontFamily:"'Poppins',sans-serif",
      boxShadow:'0 2px 10px rgba(247,37,133,.22)'}}>
      {letter}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT  —  100% original logic preserved
   ═══════════════════════════════════════════════════════════════ */
export default function EmpMgr() {
  const [username,     setUsername]     = useState('');
  const [employeeData, setEmployeeData] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
const fetchEmployeeByUsername = async (searchUsername = username) => {
  const usernameToSearch = (searchUsername || '').trim().toUpperCase();
  if (!usernameToSearch) {
    setError('Please enter a username');
    return;
  }

  setLoading(true);
  setError(null);
  setEmployeeData(null);

  try {
    console.log('Fetching manager info for:', usernameToSearch);

    // ✅ FIXED: Use /api/ prefix (matches swagger) + params object (safe encoding)
    const response = await axios.get('/api/hr/mgr/search-by-username', {
      params: { username: usernameToSearch },
      withCredentials: true,
    });

    console.log('Manager response:', response.data);
    setEmployeeData(response.data);

  } catch (err) {
    console.error('Manager fetch error:', err.response || err);
    const msg =
      err.response?.data?.message ||
      (typeof err.response?.data === 'string' ? err.response.data : null) ||
      `Error ${err.response?.status ?? ''}: Failed to fetch employee data`;
    setError(msg);
    setEmployeeData(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const defaultUsername = 'VPPL002';
    setUsername(defaultUsername);
    fetchEmployeeByUsername(defaultUsername);
  }, []);

  const handleClear = () => { setUsername(''); setEmployeeData(null); setError(null); };

  /* ── helpers ── */
  const tagOrange = { background:'#fff0e8',color:T.orange,padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:700,border:`1px solid ${T.border}` };
  const tagPink   = { background:'#fff0f6',color:T.pink,  padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:700,border:'1px solid #ffd6e7' };

  /* ── info row helper ── */
  const InfoRow = ({ label, value, badge }) => (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
      padding:'11px 14px',background:T.shade,borderRadius:12,border:`1px solid ${T.border}`,marginBottom:8}}>
      <span style={{fontSize:11,fontWeight:800,color:T.muted,textTransform:'uppercase',letterSpacing:'0.8px'}}>{label}</span>
      {badge==='orange'?<span style={tagOrange}>{value}</span>
      :badge==='pink'  ?<span style={tagPink}>{value}</span>
      :<code style={{fontFamily:'monospace',fontSize:13,color:T.text,fontWeight:700,background:'transparent'}}>{value||'—'}</code>}
    </div>
  );

  return (
    <div className="empmgr" style={S.page}>
      <PageConfetti/>

      {/* ══ HEADER BANNER ══ */}
      <div style={S.banner}>
        <div style={S.bannerInner}>
          
          <h1 style={S.bannerTitle}>Employee Manager Info</h1>
          <p style={S.bannerSub}>Search any employee to view their reporting structure and manager details</p>
          <div style={S.totalChip}>
            <span style={{fontSize:18}}>👥</span>
            <div>
              <div style={{fontSize:10,fontWeight:800,opacity:.75,textTransform:'uppercase',letterSpacing:'1px'}}>Total Reports</div>
              <div style={{fontSize:20,fontWeight:900,lineHeight:1}}>{employeeData?.reportingEmployees?.length ?? '—'}</div>
            </div>
          </div>
        </div>
        <BannerIllo/>
      </div>

      {/* ══ SEARCH BOX ══ */}
      <div style={S.searchCard} className="mgr-card" onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
          <div style={{...S.sectionIconBox,background:'#fff0e8',border:`1.5px solid ${T.border}`}}>
            <span style={{fontSize:20}}>🔍</span>
          </div>
          <div>
            <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:17,fontWeight:700,color:T.text,margin:0}}>Search Employee by Username</h3>
            <p style={{fontSize:13,color:T.muted,margin:0,fontWeight:500}}>Enter username to view manager information</p>
          </div>
        </div>

        <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-end'}}>
          <div style={{flex:1,minWidth:220}}>
            <label style={{fontSize:11,fontWeight:800,color:T.muted,textTransform:'uppercase',letterSpacing:'0.9px',display:'block',marginBottom:7}}>
              Employee ID
            </label>
            <input
              type="text"
              className="mgr-search-input"
              value={username}
              onChange={e => setUsername(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
onKeyDown={e => { if (e.key === 'Enter') fetchEmployeeByUsername(); }}
maxLength={8}
              
              style={S.searchInput}
            />
          </div>
          <button
            className="mgr-btn-primary"
            style={{...S.btnPrimary, opacity: loading||!username.trim()?0.6:1,cursor:loading||!username.trim()?'not-allowed':'pointer'}}
            onClick={()=>fetchEmployeeByUsername()}
            disabled={loading||!username.trim()}
          >
            {loading ? '⏳ Searching…' : '🔍 Search'}
          </button>
          <button className="mgr-btn-secondary" style={S.btnSecondary} onClick={handleClear}>
            ✕ Clear
          </button>
        </div>
      </div>

      {/* ══ ERROR ══ */}
      {error && (
        <div style={{
          background:'#fff0f0',border:'1.5px solid #ffcccc',borderLeft:`5px solid #ef4444`,
          borderRadius:14,padding:'16px 20px',marginBottom:20,
          animation:'mgr-fadeUp .35s ease both',
        }}>
          <div style={{fontWeight:800,color:'#dc2626',fontSize:13,marginBottom:4}}>⚠️ Error</div>
          <div style={{color:'#b91c1c',fontSize:14}}>{error}</div>
        </div>
      )}

      {/* ══ LOADING ══ */}
      {loading && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,padding:'52px 0'}}>
          <div style={{width:50,height:50,border:`5px solid ${T.border}`,borderTopColor:T.orange,borderRadius:'50%',animation:'mgr-spin .85s linear infinite'}}/>
          <p style={{color:T.muted,fontWeight:700,fontSize:15,margin:0}}>Loading employee data…</p>
        </div>
      )}

      {/* ══ PLACEHOLDER ══ */}
      {!loading && !employeeData && !error && (
        <div style={{...S.emptyCard,animation:'mgr-fadeUp .4s ease both'}}>
          <IlloEmpty/>
          <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:18,fontWeight:700,color:T.text,margin:'0 0 6px'}}>No Employee Selected</h3>
          <p style={{color:T.muted,fontSize:14,margin:0,fontWeight:500}}>Enter a username above and click Search to view details.</p>
        </div>
      )}

      {/* ══ RESULTS ══ */}
      {!loading && employeeData && (
        <div style={{animation:'mgr-fadeUp .4s ease both'}}>

          {/* Result header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
            marginBottom:20,flexWrap:'wrap',gap:12}}>
            <div>
              <h2 style={{fontFamily:"'Poppins',sans-serif",fontSize:20,fontWeight:800,color:T.text,margin:'0 0 2px'}}>
                Employee Manager Details
              </h2>
              <p style={{color:T.muted,fontSize:14,margin:0,fontWeight:500}}>
                {employeeData.employeeName} <span style={{fontFamily:'monospace'}}>({employeeData.employeeUsername})</span>
              </p>
            </div>
            <span style={{...tagOrange,fontSize:13,padding:'6px 16px'}}>
              🪪 ID: {employeeData.employeeId}
            </span>
          </div>

          {/* Two-col cards: Employee + Manager */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,marginBottom:22}}>

            {/* ── Employee Card ── */}
            <div className="mgr-card" style={S.detailCard}>
              <IlloEmployee/>
              <div style={S.cardStripe}/>
              <div style={{padding:'0 22px 20px'}}>
                <div style={{display:'flex',justifyContent:'center',paddingTop:24,marginBottom:14}}>
                  <OrbitAvatar letter={employeeData.employeeName?.charAt(0).toUpperCase()} color="orange"/>
                </div>
                <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:18,fontWeight:800,color:T.text,textAlign:'center',margin:'0 0 2px'}}>{employeeData.employeeName}</h3>
                <p style={{textAlign:'center',fontFamily:'monospace',color:T.muted,fontSize:13,margin:'0 0 16px'}}>@{employeeData.employeeUsername}</p>

                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,paddingBottom:14,borderBottom:`1.5px solid ${T.border}`}}>
                  <span style={{fontSize:18}}>👤</span>
                  <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,color:T.text,fontSize:15}}>Employee Information</span>
                </div>

                <InfoRow label="Employee ID"  value={employeeData.employeeId}/>
                <InfoRow label="Department"   value={employeeData.employeeDepartment}  badge="orange"/>
                <InfoRow label="Designation"  value={employeeData.employeeDesignation} badge="pink"/>
              </div>
            </div>

            {/* ── Manager Card ── */}
            <div className="mgr-card" style={{...S.detailCard,borderTopColor:T.pink}}>
              <IlloManager/>
              <div style={{...S.cardStripe,background:`linear-gradient(90deg,${T.pink},${T.purple})`}}/>
              <div style={{padding:'0 22px 20px'}}>
                <div style={{display:'flex',justifyContent:'center',paddingTop:24,marginBottom:14}}>
                  <OrbitAvatar letter={employeeData.managerName?.charAt(0).toUpperCase()} color="pink"/>
                </div>
                <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:18,fontWeight:800,color:T.text,textAlign:'center',margin:'0 0 2px'}}>{employeeData.managerName}</h3>
                <p style={{textAlign:'center',fontFamily:'monospace',color:T.muted,fontSize:13,margin:'0 0 16px'}}>@{employeeData.managerUsername}</p>

                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,paddingBottom:14,borderBottom:`1.5px solid ${T.border}`}}>
                  <span style={{fontSize:18}}>👨‍💼</span>
                  <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,color:T.text,fontSize:15}}>Reporting Manager</span>
                </div>

                <InfoRow label="Manager ID"   value={employeeData.managerId}/>
                <InfoRow label="Department"   value={employeeData.managerDepartment}  badge="orange"/>
                <InfoRow label="Designation"  value={employeeData.managerDesignation} badge="pink"/>
              </div>
            </div>
          </div>

          {/* ── Direct Reports Table ── */}
          <div style={S.tableCard} className="mgr-card">
            <IlloTeam/>
            <div style={S.cardStripe}/>
            <div style={{padding:'22px 22px 0'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <div style={{...S.sectionIconBox,background:'#fff0f6',border:'1.5px solid #ffd6e7'}}>
                  <span style={{fontSize:20}}>📋</span>
                </div>
                <div>
                  <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:17,fontWeight:700,color:T.text,margin:0}}>
                    Direct Reports
                    <span style={{...tagOrange,marginLeft:10,fontSize:11}}>{employeeData.reportingEmployees?.length||0}</span>
                  </h3>
                  {(employeeData.reportingEmployees?.length||0)>0 && (
                    <p style={{color:T.muted,fontSize:13,margin:0,fontWeight:500}}>
                      Employees reporting directly to {employeeData.employeeName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {employeeData.reportingEmployees?.length > 0 ? (
              <div style={{overflowX:'auto',maxHeight:420}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:`linear-gradient(90deg,#fff8f5,#fff5fb)`,position:'sticky',top:0,zIndex:2}}>
                      {['#','Employee','Username','Department','Designation'].map(h=>(
                        <th key={h} style={{padding:'13px 16px',textAlign:'left',
                          fontSize:10,fontWeight:800,color:T.muted,
                          textTransform:'uppercase',letterSpacing:'1px',
                          borderBottom:`1.5px solid ${T.border}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employeeData.reportingEmployees.map((emp, idx) => (
                      <tr key={idx} className="mgr-trow mgr-emp-row"
                        style={{borderBottom:`1px solid ${T.shade}`}}>
                        <td style={{padding:'13px 16px',color:T.muted,fontWeight:700,fontSize:13,width:40}}>{idx+1}</td>
                        <td style={{padding:'13px 16px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <RowAvatar letter={emp.name?.charAt(0).toUpperCase()} idx={idx}/>
                            <div>
                              <div style={{fontWeight:700,color:T.text,fontSize:14}}>{emp.name}</div>
                              <div style={{fontSize:11,color:T.muted,fontWeight:600}}>ID: {emp.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:'13px 16px'}}>
                          <code style={{fontFamily:'monospace',fontSize:12,color:'#888',
                            background:'#f8f5ff',padding:'3px 8px',borderRadius:6,border:'1px solid #ede9fe'}}>
                            @{emp.username}
                          </code>
                        </td>
                        <td style={{padding:'13px 16px'}}><span style={tagOrange}>{emp.department}</span></td>
                        <td style={{padding:'13px 16px'}}><span style={tagPink}>{emp.designation}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'40px 28px 32px'}}>
                <IlloEmpty/>
                <h4 style={{fontFamily:"'Poppins',sans-serif",fontSize:16,fontWeight:700,color:T.text,margin:'0 0 6px'}}>No Direct Reports</h4>
                <p style={{color:T.muted,fontSize:14,margin:0,fontWeight:500}}>{employeeData.employeeName} has no employees reporting directly.</p>
              </div>
            )}
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
  page:{maxWidth:1280,margin:'0 auto',padding:'24px 20px 52px',
    fontFamily:"'Nunito',sans-serif",background:T.bg,minHeight:'100vh',position:'relative'},

  banner:{
    background:'linear-gradient(125deg,#ff6b35 0%,#f72585 55%,#7209b7 100%)',
    borderRadius:22,minHeight:168,marginBottom:22,
    position:'relative',overflow:'hidden',
    boxShadow:'0 12px 40px rgba(247,37,133,.28)',
    display:'flex',alignItems:'stretch',
    animation:'mgr-fadeUp .5s ease both',
  },
  bannerInner:{
    position:'relative',zIndex:2,padding:'30px 36px',
    flex:1,paddingRight:340,
    display:'flex',flexDirection:'column',justifyContent:'center',gap:8,
  },
  bannerTag:{display:'inline-block',background:'rgba(255,255,255,.2)',
    color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',
    padding:'4px 12px',borderRadius:20,border:'1px solid rgba(255,255,255,.35)',
    width:'fit-content',marginBottom:4},
  bannerTitle:{fontFamily:"'Poppins',sans-serif",fontSize:28,fontWeight:800,color:'#fff',
    margin:0,lineHeight:1.15,letterSpacing:'-0.5px'},
  bannerSub:{fontSize:13,color:'rgba(255,255,255,.78)',fontWeight:500,margin:0},
  totalChip:{
    display:'inline-flex',alignItems:'center',gap:10,marginTop:4,
    background:'rgba(255,255,255,.22)',color:'#fff',
    padding:'8px 18px',borderRadius:20,border:'1px solid rgba(255,255,255,.4)',
    width:'fit-content',
  },

  searchCard:{
    background:T.white,borderRadius:20,padding:24,
    boxShadow:'0 4px 22px rgba(255,107,53,.1)',
    border:`1.5px solid ${T.border}`,marginBottom:22,
    position:'relative',overflow:'hidden',
    animation:'mgr-fadeUp .45s ease both',animationDelay:'.06s',
  },
  sectionIconBox:{width:42,height:42,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},

  searchInput:{
    width:'100%',padding:'12px 16px',
    border:`1.5px solid ${T.border}`,borderRadius:12,
    fontSize:14,color:T.text,background:T.shade,
    fontFamily:"'Nunito',sans-serif",transition:'all .2s',
  },

  btnPrimary:{
    background:`linear-gradient(135deg,${T.orange},${T.pink})`,
    color:'#fff',border:'none',padding:'12px 24px',borderRadius:12,
    fontWeight:700,fontSize:14,fontFamily:"'Nunito',sans-serif",
    boxShadow:'0 4px 14px rgba(247,37,133,.28)',
  },
  btnSecondary:{
    background:T.shade,color:T.orange,border:`1.5px solid ${T.border}`,
    padding:'12px 20px',borderRadius:12,
    fontWeight:700,fontSize:14,fontFamily:"'Nunito',sans-serif",cursor:'pointer',
  },

  detailCard:{
    background:T.white,borderRadius:20,overflow:'hidden',
    boxShadow:'0 4px 22px rgba(255,107,53,.09)',
    border:`1.5px solid ${T.border}`,
    borderTop:`4px solid ${T.orange}`,position:'relative',
  },
  cardStripe:{height:5,background:`linear-gradient(90deg,${T.orange},${T.pink})`},

  tableCard:{
    background:T.white,borderRadius:20,overflow:'hidden',
    boxShadow:'0 4px 22px rgba(247,37,133,.07)',
    border:'1.5px solid #ffd6e7',
    borderTop:`4px solid ${T.pink}`,position:'relative',
    marginBottom:8,
  },

  emptyCard:{
    background:T.white,borderRadius:20,padding:'44px 32px',textAlign:'center',
    border:`2px dashed ${T.border}`,boxShadow:`0 2px 12px rgba(255,107,53,.05)`,
    marginBottom:22,
  },
};
