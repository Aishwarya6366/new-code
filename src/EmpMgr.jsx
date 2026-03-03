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

    @keyframes mgr-spin    { to { transform: rotate(360deg); } }
    @keyframes mgr-fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

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
   ROW AVATAR
   ═══════════════════════════════════════════════════════════════ */
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
   PROFILE AVATAR
   ═══════════════════════════════════════════════════════════════ */
const ProfileAvatar = ({ letter, color = 'orange' }) => (
  <div style={{
    width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
    background: color === 'orange'
      ? `linear-gradient(135deg,${T.orange},${T.pink})`
      : `linear-gradient(135deg,${T.pink},${T.purple})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, fontWeight: 900, color: '#fff',
    fontFamily: "'Poppins',sans-serif",
    boxShadow: color === 'orange'
      ? '0 4px 16px rgba(255,107,53,.35)'
      : '0 4px 16px rgba(247,37,133,.35)',
  }}>
    {letter}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT — 100% original logic preserved
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

      {/* ══ HEADER BANNER ══ */}
      <div style={S.banner}>
        <div style={S.bannerInner}>
          <h1 style={S.bannerTitle}>Employee Manager Info</h1>
          <p style={S.bannerSub}>Search any employee to view their reporting structure and manager details</p>
          {employeeData && (
            <div style={S.totalChip}>
              <div>
                <div style={{fontSize:10,fontWeight:800,opacity:.75,textTransform:'uppercase',letterSpacing:'1px'}}>Total Reports</div>
                <div style={{fontSize:20,fontWeight:900,lineHeight:1}}>{employeeData?.reportingEmployees?.length ?? '—'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ SEARCH BOX ══ */}
      <div style={S.searchCard} className="mgr-card" onClick={e => e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
          <div style={{...S.sectionIconBox, background:'#fff0e8', border:`1.5px solid ${T.border}`}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
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
            style={{...S.btnPrimary, opacity: loading||!username.trim()?0.6:1, cursor:loading||!username.trim()?'not-allowed':'pointer'}}
            onClick={() => fetchEmployeeByUsername()}
            disabled={loading||!username.trim()}
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
          <button className="mgr-btn-secondary" style={S.btnSecondary} onClick={handleClear}>
            Clear
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
          <div style={{fontWeight:800,color:'#dc2626',fontSize:13,marginBottom:4}}>Error</div>
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
        <div style={{...S.emptyCard, animation:'mgr-fadeUp .4s ease both'}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:T.shade,border:`2px dashed ${T.border}`,
            display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.peach} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
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
              ID: {employeeData.employeeId}
            </span>
          </div>

          {/* Two-col cards: Employee + Manager */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,marginBottom:22}}>

            {/* ── Employee Card ── */}
            <div className="mgr-card" style={S.detailCard}>
              <div style={S.cardStripe}/>
              <div style={{padding:'0 22px 20px'}}>
                <div style={{display:'flex',justifyContent:'center',paddingTop:24,marginBottom:14}}>
                  <ProfileAvatar letter={employeeData.employeeName?.charAt(0).toUpperCase()} color="orange"/>
                </div>
                <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:18,fontWeight:800,color:T.text,textAlign:'center',margin:'0 0 2px'}}>{employeeData.employeeName}</h3>
                <p style={{textAlign:'center',fontFamily:'monospace',color:T.muted,fontSize:13,margin:'0 0 16px'}}>@{employeeData.employeeUsername}</p>

                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,paddingBottom:14,borderBottom:`1.5px solid ${T.border}`}}>
                  <div style={{...S.sectionIconBox,width:32,height:32,background:'#fff0e8',border:`1px solid ${T.border}`}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,color:T.text,fontSize:15}}>Employee Information</span>
                </div>

                <InfoRow label="Employee ID"  value={employeeData.employeeId}/>
                <InfoRow label="Department"   value={employeeData.employeeDepartment}  badge="orange"/>
                <InfoRow label="Designation"  value={employeeData.employeeDesignation} badge="pink"/>
              </div>
            </div>

            {/* ── Manager Card ── */}
            <div className="mgr-card" style={{...S.detailCard,borderTopColor:T.pink}}>
              <div style={{...S.cardStripe,background:`linear-gradient(90deg,${T.pink},${T.purple})`}}/>
              <div style={{padding:'0 22px 20px'}}>
                <div style={{display:'flex',justifyContent:'center',paddingTop:24,marginBottom:14}}>
                  <ProfileAvatar letter={employeeData.managerName?.charAt(0).toUpperCase()} color="pink"/>
                </div>
                <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:18,fontWeight:800,color:T.text,textAlign:'center',margin:'0 0 2px'}}>{employeeData.managerName}</h3>
                <p style={{textAlign:'center',fontFamily:'monospace',color:T.muted,fontSize:13,margin:'0 0 16px'}}>@{employeeData.managerUsername}</p>

                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,paddingBottom:14,borderBottom:`1.5px solid ${T.border}`}}>
                  <div style={{...S.sectionIconBox,width:32,height:32,background:'#fff0f6',border:'1px solid #ffd6e7'}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.pink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
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
            <div style={{...S.cardStripe,background:`linear-gradient(90deg,${T.pink},${T.purple})`}}/>
            <div style={{padding:'22px 22px 0'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <div style={{...S.sectionIconBox,background:'#fff0f6',border:'1.5px solid #ffd6e7'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.pink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:17,fontWeight:700,color:T.text,margin:0}}>
                    Direct Reports
                    <span style={{...tagOrange,marginLeft:10,fontSize:11}}>{employeeData.reportingEmployees?.length||0}</span>
                  </h3>
                  {(employeeData.reportingEmployees?.length||0) > 0 && (
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
                <div style={{width:56,height:56,borderRadius:'50%',background:T.shade,border:`2px dashed ${T.border}`,
                  display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.peach} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
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
    borderRadius:22,minHeight:140,marginBottom:22,
    position:'relative',overflow:'hidden',
    boxShadow:'0 12px 40px rgba(247,37,133,.28)',
    display:'flex',alignItems:'stretch',
    animation:'mgr-fadeUp .5s ease both',
  },
  bannerInner:{
    position:'relative',zIndex:2,padding:'30px 36px',
    flex:1,
    display:'flex',flexDirection:'column',justifyContent:'center',gap:8,
  },
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
