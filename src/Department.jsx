
 import { useState, useEffect } from "react";
 import axios from "axios";
 
 /* =====================================================
    ANIMATED SVG ILLUSTRATIONS
    ===================================================== */
 const BuildingIllustration = () => (
   <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
     <style>{`
       @keyframes floatBuilding { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
       @keyframes windowBlink { 0%,100%{opacity:1} 45%,55%{opacity:0.3} }
       @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:1} 100%{opacity:0.4} }
       .bld-wrap { animation: floatBuilding 3.5s ease-in-out infinite; transform-origin: center bottom; }
       .w1 { animation: windowBlink 2.8s ease-in-out infinite 0.1s; }
       .w2 { animation: windowBlink 2.8s ease-in-out infinite 0.6s; }
       .w3 { animation: windowBlink 2.8s ease-in-out infinite 1.1s; }
       .w4 { animation: windowBlink 2.8s ease-in-out infinite 1.6s; }
       .shine { animation: shimmer 2s ease-in-out infinite; }
     `}</style>
     <g className="bld-wrap">
       <ellipse cx="55" cy="104" rx="32" ry="5" fill="rgba(255,122,0,0.13)" />
       <rect x="22" y="28" width="66" height="72" rx="4" fill="#fff7f0" stroke="#ff7a00" strokeWidth="1.5" />
       <rect x="22" y="28" width="66" height="8" rx="4" fill="#ff7a00" />
       <line x1="55" y1="8" x2="55" y2="28" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" />
       <polygon points="55,8 70,14 55,20" fill="#ff7a00" className="shine" />
       <rect x="31" y="46" width="12" height="10" rx="2" fill="#ff9f43" className="w1" />
       <rect x="49" y="46" width="12" height="10" rx="2" fill="#ff9f43" className="w2" />
       <rect x="67" y="46" width="12" height="10" rx="2" fill="#ff9f43" className="w3" />
       <rect x="31" y="64" width="12" height="10" rx="2" fill="#ffb347" className="w4" />
       <rect x="49" y="64" width="12" height="10" rx="2" fill="#ffb347" className="w1" />
       <rect x="67" y="64" width="12" height="10" rx="2" fill="#ffb347" className="w2" />
       <rect x="31" y="82" width="12" height="10" rx="2" fill="#ff9f43" className="w3" />
       <rect x="49" y="82" width="12" height="10" rx="2" fill="#ff9f43" className="w4" />
       <rect x="67" y="82" width="12" height="10" rx="2" fill="#ff9f43" className="w1" />
       <rect x="46" y="88" width="18" height="12" rx="3" fill="#ff7a00" />
       <circle cx="61" cy="94" r="1.5" fill="#fff" />
     </g>
   </svg>
 );
 
 const BadgeIllustration = () => (
   <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
     <style>{`
       @keyframes floatBadge { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-7px) rotate(3deg)} }
       @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
       @keyframes starPop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
       .bdg-wrap { animation: floatBadge 4s ease-in-out infinite; transform-origin: center; }
       .ring { animation: spinRing 10s linear infinite; transform-origin: 55px 65px; }
       .star { animation: starPop 2s ease-in-out infinite; transform-origin: 55px 65px; }
     `}</style>
     <g className="bdg-wrap">
       <ellipse cx="55" cy="103" rx="28" ry="4.5" fill="rgba(255,122,0,0.12)" />
       <polygon points="40,10 55,22 70,10 70,35 55,28 40,35" fill="#ff9f43" />
       <polygon points="40,10 55,22 70,10 70,12 55,24 40,12" fill="#ff7a00" />
       <circle cx="55" cy="65" r="32" fill="#fff7f0" stroke="#ff7a00" strokeWidth="2" />
       <circle cx="55" cy="65" r="26" fill="none" stroke="#ff9f43" strokeWidth="1" strokeDasharray="5 4" className="ring" />
       <circle cx="55" cy="65" r="20" fill="#ff7a00" />
       <g className="star">
         <polygon points="55,47 57.9,55.8 67.2,55.8 59.7,61.1 62.6,69.9 55,64.6 47.4,69.9 50.3,61.1 42.8,55.8 52.1,55.8" fill="#fff" opacity="0.95" />
       </g>
     </g>
   </svg>
 );
 
 /* =====================================================
    FLOATING PARTICLES
    ===================================================== */
 const Particles = () => (
   <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
     <style>{`
       @keyframes riseParticle { 0%{transform:translateY(100vh) scale(0.5);opacity:0} 10%{opacity:0.7} 90%{opacity:0.4} 100%{transform:translateY(-10vh) scale(1.1);opacity:0} }
       .particle { position:absolute; border-radius:50%; animation:riseParticle linear infinite; }
     `}</style>
     {[
       { size:8, left:"8%", dur:"9s", delay:"0s", color:"rgba(255,122,0,0.18)" },
       { size:5, left:"18%", dur:"12s", delay:"2s", color:"rgba(255,159,67,0.22)" },
       { size:10, left:"28%", dur:"8s", delay:"4s", color:"rgba(255,122,0,0.12)" },
       { size:6, left:"40%", dur:"11s", delay:"1s", color:"rgba(255,180,100,0.2)" },
       { size:9, left:"52%", dur:"10s", delay:"3s", color:"rgba(255,122,0,0.15)" },
       { size:4, left:"63%", dur:"13s", delay:"0.5s", color:"rgba(255,159,67,0.18)" },
       { size:7, left:"74%", dur:"9.5s", delay:"5s", color:"rgba(255,122,0,0.2)" },
       { size:5, left:"85%", dur:"11.5s", delay:"2.5s", color:"rgba(255,200,120,0.18)" },
       { size:6, left:"92%", dur:"8.5s", delay:"1.5s", color:"rgba(255,122,0,0.14)" },
     ].map((p, i) => (
       <div key={i} className="particle" style={{
         width: p.size, height: p.size,
         left: p.left, bottom: 0,
         background: p.color,
         animationDuration: p.dur,
         animationDelay: p.delay,
       }} />
     ))}
   </div>
 );
 
 /* =====================================================
    GLOBAL KEYFRAMES
    ===================================================== */
 const GlobalStyles = () => (
   <style>{`
     @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
     * { box-sizing: border-box; }
 
     @keyframes fadeSlideUp {
       from { opacity:0; transform:translateY(24px); }
       to   { opacity:1; transform:translateY(0); }
     }
     @keyframes cardIn {
       from { opacity:0; transform:translateY(32px) scale(0.97); }
       to   { opacity:1; transform:translateY(0) scale(1); }
     }
     @keyframes headingIn {
       from { opacity:0; transform:translateY(-18px); }
       to   { opacity:1; transform:translateY(0); }
     }
     @keyframes rotateSlow {
       from { transform:rotate(0deg); }
       to   { transform:rotate(360deg); }
     }
     @keyframes bgPulse {
       0%,100% { opacity:0.45; transform:scale(1); }
       50%      { opacity:0.7;  transform:scale(1.08); }
     }
     @keyframes listItemIn {
       from { opacity:0; transform:translateX(-14px); }
       to   { opacity:1; transform:translateX(0); }
     }
     @keyframes shimmerLine {
       0%   { background-position: -200% center; }
       100% { background-position: 200% center; }
     }
     @keyframes badgePulse {
       0%,100% { box-shadow: 0 0 0 0 rgba(255,122,0,0.35); }
       50%      { box-shadow: 0 0 0 6px rgba(255,122,0,0); }
     }
     @keyframes countUp {
       from { opacity:0; transform:scale(0.7); }
       to   { opacity:1; transform:scale(1); }
     }
 
.dept-page {
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #ffffff;   /* Pure white */
  position: relative;
  overflow-x: hidden;
}
 
     .deco-ring {
       position: absolute;
       top: -80px; left: 50%; transform: translateX(-50%);
       width: 340px; height: 340px;
       border: 2px dashed rgba(255,122,0,0.18);
       border-radius: 50%;
       animation: rotateSlow 22s linear infinite;
       pointer-events: none;
     }
     .deco-ring-2 {
       position: absolute;
       top: -50px; left: 50%; transform: translateX(-50%);
       width: 220px; height: 220px;
       border: 1.5px dashed rgba(255,159,67,0.14);
       border-radius: 50%;
       animation: rotateSlow 15s linear infinite reverse;
       pointer-events: none;
     }
 
     .dept-header { animation: headingIn 0.7s cubic-bezier(0.22,1,0.36,1) both; }
     .dept-card-1 { animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
     .dept-card-2 { animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
     .illus-wrap  { animation: fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
     .stat-num    { animation: countUp 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.6s both; }
 
     .dept-input:focus {
       border-color: #ff7a00 !important;
       box-shadow: 0 0 0 3px rgba(255,122,0,0.15) !important;
       background: #fff !important;
       outline: none;
     }
     .dept-filter:focus {
       border-color: #ff9f43 !important;
       box-shadow: 0 0 0 3px rgba(255,159,67,0.12) !important;
       outline: none;
     }
     .dept-input-wrap:focus-within {
       border-color: #ff7a00 !important;
       box-shadow: 0 0 0 3px rgba(255,122,0,0.12) !important;
       background: #fff !important;
     }
     .dept-filter-wrap:focus-within {
       border-color: #ff9f43 !important;
       box-shadow: 0 0 0 3px rgba(255,159,67,0.1) !important;
     }
 
     .dept-list-item:hover {
       background: #fff3ea !important;
       border-color: #ff9f43 !important;
       transform: translateX(4px) !important;
       box-shadow: 0 3px 12px rgba(255,122,0,0.1) !important;
     }
     .dept-list-item { transition: all 0.18s ease !important; animation: listItemIn 0.3s ease both; }
 
     .dept-add-btn:hover:not(:disabled) {
       transform: translateY(-2px) !important;
       box-shadow: 0 8px 20px rgba(255,122,0,0.45) !important;
       filter: brightness(1.06);
     }
     .dept-add-btn:active:not(:disabled) { transform: translateY(0) !important; }
     .dept-add-btn:disabled { opacity: 0.65; cursor: not-allowed; }
     .dept-add-btn { transition: all 0.2s ease; }
 
     .dept-edit-btn:hover  { background: #2563eb !important; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(59,130,246,0.3); }
     .dept-save-btn:hover  { background: #059669 !important; transform: translateY(-1px); }
     .dept-cancel-btn:hover{ background: #4b5563 !important; transform: translateY(-1px); }
     .dept-edit-btn, .dept-save-btn, .dept-cancel-btn { transition: all 0.18s ease; }
 
     .card-shimmer-line {
       height: 4px;
       border-radius: 4px 4px 0 0;
       background: linear-gradient(90deg, #ff7a00, #ff9f43, #ffcc80, #ff9f43, #ff7a00);
       background-size: 200% auto;
       animation: shimmerLine 2.5s linear infinite;
     }
 
     .dept-badge { animation: badgePulse 2.4s ease-in-out infinite; }
     .wavy-divider { animation: bgPulse 4s ease-in-out infinite; }
 
     .dept-list-scroll::-webkit-scrollbar { width: 5px; }
     .dept-list-scroll::-webkit-scrollbar-track { background: #fff3ea; border-radius: 4px; }
     .dept-list-scroll::-webkit-scrollbar-thumb { background: #ffb347; border-radius: 4px; }
   `}</style>
 );
 
 export default function Department() {
   /* ======================
      STATES
      ====================== */
   const [departments, setDepartments] = useState([]);
   const [designations, setDesignations] = useState([]);
 
   const [newDepartment, setNewDepartment] = useState("");
   const [newDesignation, setNewDesignation] = useState("");
   const [deptError, setDeptError] = useState("");
   const [desgError, setDesgError] = useState("");
 
   const [deptFilter, setDeptFilter] = useState("");
   const [desgFilter, setDesgFilter] = useState("");
 
   const [editingDept, setEditingDept] = useState(null);
   const [editingDesg, setEditingDesg] = useState(null);
   const [editDeptName, setEditDeptName] = useState("");
   const [editDesgName, setEditDesgName] = useState("");
 
   const [loadingDept, setLoadingDept] = useState(false);
   const [loadingDesg, setLoadingDesg] = useState(false);
 
   /* ======================
      GET DEPARTMENTS
      ====================== */
   const fetchDepartments = async () => {
     try {
       const res = await axios.get(`/api/departments`, { withCredentials: true });
       setDepartments(res.data);
     } catch (error) {
       console.error(error);
       alert("Unable to fetch departments");
     }
   };
 
   /* ======================
      GET DESIGNATIONS
      ====================== */
   const fetchDesignations = async () => {
     try {
       const res = await axios.get(`/api/designations`, { withCredentials: true });
       const cleaned = res.data.filter((d) => d.designationName !== null);
       setDesignations(cleaned);
     } catch (error) {
       console.error(error);
       alert("Unable to fetch designations");
     }
   };
 
   /* ======================
      INITIAL LOAD
      ====================== */
   useEffect(() => {
     fetchDepartments();
     fetchDesignations();
   }, []);
 
   /* ======================
      CREATE DEPARTMENT
      ====================== */
   const addDepartment = async () => {
     const deptVal = newDepartment.trim();
     if (!deptVal) { setDeptError("Department name is required"); return; }
     if (!/^[A-Za-z ]{2,30}$/.test(deptVal)) { setDeptError("Only letters allowed, 2-30 chars"); return; }
     setDeptError("");
     try {
       setLoadingDept(true);
       await axios.post(`/api/departments`, { departmentName: newDepartment }, { withCredentials: true });
       alert("Department created successfully");
       setNewDepartment("");
       fetchDepartments();
     } catch (error) {
       alert(error.response?.data?.message || "Create failed");
     } finally {
       setLoadingDept(false);
     }
   };
 
   /* ======================
      CREATE DESIGNATION
      ====================== */
   const addDesignation = async () => {
     const desgVal = newDesignation.trim();
     if (!desgVal) { setDesgError("Designation name is required"); return; }
     if (!/^[A-Za-z ]{2,30}$/.test(desgVal)) { setDesgError("Only letters allowed, 2-30 chars"); return; }
     setDesgError("");
     try {
       setLoadingDesg(true);
       await axios.post(`/api/dept/hr/DesignationName`, { designationName: newDesignation }, { withCredentials: true });
       alert("Designation created successfully");
       setNewDesignation("");
       fetchDesignations();
     } catch (error) {
       alert(error.response?.data?.message || "Create failed");
     } finally {
       setLoadingDesg(false);
     }
   };
 
   /* ======================
      UPDATE DEPARTMENT
      ====================== */
   const updateDepartment = async (id) => {
     if (!editDeptName.trim()) { alert("Department name is required"); return; }
     try {
       await axios.put(`/api/departments/department-upate?departmentId=${id}`, { departmentName: editDeptName }, { withCredentials: true });
       alert("Department updated successfully");
       setEditingDept(null);
       setEditDeptName("");
       fetchDepartments();
     } catch (error) {
       alert(error.response?.data?.message || "Update failed");
     }
   };
 
   /* ======================
      UPDATE DESIGNATION
      ====================== */
   const updateDesignation = async (id) => {
     if (!editDesgName.trim()) { alert("Designation name is required"); return; }
     try {
       await axios.put(`/api/designations/designation-update?designationId=${id}`, { designationName: editDesgName }, { withCredentials: true });
       alert("Designation updated successfully");
       setEditingDesg(null);
       setEditDesgName("");
       fetchDesignations();
     } catch (error) {
       alert(error.response?.data?.message || "Update failed");
     }
   };
 
   /* ======================
      START EDITING
      ====================== */
   const startEditDept = (dept) => { setEditingDept(dept.id); setEditDeptName(dept.departmentName); };
   const startEditDesg = (desg) => { setEditingDesg(desg.id); setEditDesgName(desg.designationName); };
   const cancelEdit = () => { setEditingDept(null); setEditingDesg(null); setEditDeptName(""); setEditDesgName(""); };
 
   return (
     <div className="dept-page" style={styles.page}>
       <GlobalStyles />
       <Particles />
 
       {/* ── HEADER ── */}
       <div style={styles.headerWrapper}>
         <div className="deco-ring" />
         <div className="deco-ring-2" />
         <div className="dept-header" style={styles.header}>
           <div style={styles.headerIconRow}>
                        
           </div>
 
           <h1 style={styles.heading}>Department &amp; Designation</h1>
           <p style={styles.subtitle}>Manage and organise your company's hierarchy with ease</p>
 
           
            
             <div style={styles.statDivider} />
             
             
            
           
         </div>
       </div>
 
       {/* ── GRID ── */}
       <div style={styles.gridContainer}>
 
         {/* ══ DEPARTMENTS CARD ══ */}
         <div className="dept-card-1" style={styles.card}>
           <div className="card-shimmer-line" />
 
           <div style={styles.illustrationArea}>
             <div className="illus-wrap">
               <BuildingIllustration />
             </div>
             <div style={styles.illustrationText}>
               <div style={styles.illustrationTitle}>Departments</div>
               <div style={styles.illustrationSub}>Define your divisions</div>
             </div>
             <span className="dept-badge" style={styles.badge}>{departments.length} Total</span>
           </div>
 
           <div style={styles.cardDivider} />
 
           <div style={styles.inputGroup}>
             <div className="dept-input-wrap" style={styles.inputWrapper}>
               <span style={styles.inputIcon}>🏢</span>
               <input
                 type="text"
                 placeholder="Enter department name..."
                 value={newDepartment}
                 onChange={(e) => {
                   const rawVal = e.target.value;
                   if (/[^A-Za-z ]/.test(rawVal)) setDeptError("Numbers and special characters are not allowed");
                   else setDeptError("");
                   setNewDepartment(rawVal.replace(/[^A-Za-z ]/g, ""));
                 }}
                 className="dept-input"
                 style={styles.input}
                 onKeyPress={(e) => e.key === "Enter" && addDepartment()}
                 maxLength={30}
               />
             </div>
             <button onClick={addDepartment} disabled={loadingDept} className="dept-add-btn" style={styles.addButton}>
               {loadingDept ? "Adding..." : "＋ Add"}
             </button>
           </div>
           {deptError && <div style={styles.errorMsg}>⚠ {deptError}</div>}
 
           <div className="dept-filter-wrap" style={styles.filterWrapper}>
             <span style={styles.inputIcon}>🔍</span>
             <input
               type="text"
               placeholder="Filter departments..."
               value={deptFilter}
               onChange={(e) => setDeptFilter(e.target.value)}
               className="dept-filter"
               style={styles.filterInput}
             />
           </div>
 
           <div className="dept-list-scroll" style={styles.listContainer}>
             {departments.length === 0 ? (
               <div style={styles.emptyState}>
                 <div style={styles.emptyIllus}>
                   <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                     <circle cx="35" cy="35" r="33" fill="#fff3ea" stroke="#ff9f43" strokeWidth="1.5" strokeDasharray="5 3"/>
                     <text x="35" y="44" textAnchor="middle" fontSize="28">🏢</text>
                   </svg>
                 </div>
                 <p style={{ margin: "8px 0 0", fontWeight: 700, color: "#b45309" }}>No departments yet</p>
                 <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#d97706" }}>Add your first one above ↑</p>
               </div>
             ) : (
               departments
                 .filter(dept => dept.departmentName.toLowerCase().includes(deptFilter.toLowerCase()))
                 .map((dept, idx) => (
                   <div key={dept.id} className="dept-list-item" style={{ ...styles.listItem, animationDelay: `${idx * 45}ms` }}>
                     {editingDept === dept.id ? (
                       <div style={styles.editContainer}>
                         <input
                           type="text"
                           value={editDeptName}
                           onChange={(e) => setEditDeptName(e.target.value)}
                           className="dept-input"
                           style={styles.editInput}
                           autoFocus
                         />
                         <div style={styles.editActions}>
                           <button onClick={() => updateDepartment(dept.id)} className="dept-save-btn" style={styles.saveButton} title="Save">✓</button>
                           <button onClick={cancelEdit} className="dept-cancel-btn" style={styles.cancelButton} title="Cancel">✕</button>
                         </div>
                       </div>
                     ) : (
                       <>
                         <div style={styles.itemLeft}>
                           <span style={styles.itemIndex}>{String(idx + 1).padStart(2, "0")}</span>
                           <span style={styles.itemText}>{dept.departmentName}</span>
                         </div>
                         <div style={styles.actions}>
                           <button onClick={() => startEditDept(dept)} className="dept-edit-btn" style={styles.editButton} title="Edit">✎ Edit</button>
                         </div>
                       </>
                     )}
                   </div>
                 ))
             )}
           </div>
         </div>
 
         {/* ══ DESIGNATIONS CARD ══ */}
         <div className="dept-card-2" style={styles.card}>
           <div className="card-shimmer-line" />
 
           <div style={styles.illustrationArea}>
             <div className="illus-wrap">
               <BadgeIllustration />
             </div>
             <div style={styles.illustrationText}>
               <div style={styles.illustrationTitle}>Designations</div>
               <div style={styles.illustrationSub}>Define your roles &amp; titles</div>
             </div>
             <span className="dept-badge" style={styles.badge}>{designations.length} Total</span>
           </div>
 
           <div style={styles.cardDivider} />
 
           <div style={styles.inputGroup}>
             <div className="dept-input-wrap" style={styles.inputWrapper}>
               <span style={styles.inputIcon}>🎖️</span>
               <input
                 type="text"
                 placeholder="Enter designation name..."
                 value={newDesignation}
                 onChange={(e) => {
                   const rawVal = e.target.value;
                   if (/[^A-Za-z ]/.test(rawVal)) setDesgError("Numbers and special characters are not allowed");
                   else setDesgError("");
                   setNewDesignation(rawVal.replace(/[^A-Za-z ]/g, ""));
                 }}
                 className="dept-input"
                 style={styles.input}
                 onKeyPress={(e) => e.key === "Enter" && addDesignation()}
                 maxLength={30}
               />
             </div>
             <button onClick={addDesignation} disabled={loadingDesg} className="dept-add-btn" style={styles.addButton}>
               {loadingDesg ? "Adding..." : "＋ Add"}
             </button>
           </div>
           {desgError && <div style={styles.errorMsg}>⚠ {desgError}</div>}
 
           <div className="dept-filter-wrap" style={styles.filterWrapper}>
             <span style={styles.inputIcon}>🔍</span>
             <input
               type="text"
               placeholder="Filter designations..."
               value={desgFilter}
               onChange={(e) => setDesgFilter(e.target.value)}
               className="dept-filter"
               style={styles.filterInput}
             />
           </div>
 
           <div className="dept-list-scroll" style={styles.listContainer}>
             {designations.length === 0 ? (
               <div style={styles.emptyState}>
                 <div style={styles.emptyIllus}>
                   <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                     <circle cx="35" cy="35" r="33" fill="#fff3ea" stroke="#ff9f43" strokeWidth="1.5" strokeDasharray="5 3"/>
                     <text x="35" y="44" textAnchor="middle" fontSize="28">🎖️</text>
                   </svg>
                 </div>
                 <p style={{ margin: "8px 0 0", fontWeight: 700, color: "#b45309" }}>No designations yet</p>
                 <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#d97706" }}>Add your first one above ↑</p>
               </div>
             ) : (
               designations
                 .filter(desg => desg.designationName.toLowerCase().includes(desgFilter.toLowerCase()))
                 .map((desg, idx) => (
                   <div key={desg.id} className="dept-list-item" style={{ ...styles.listItem, animationDelay: `${idx * 45}ms` }}>
                     {editingDesg === desg.id ? (
                       <div style={styles.editContainer}>
                         <input
                           type="text"
                           value={editDesgName}
                           onChange={(e) => setEditDesgName(e.target.value)}
                           className="dept-input"
                           style={styles.editInput}
                           autoFocus
                         />
                         <div style={styles.editActions}>
                           <button onClick={() => updateDesignation(desg.id)} className="dept-save-btn" style={styles.saveButton} title="Save">✓</button>
                           <button onClick={cancelEdit} className="dept-cancel-btn" style={styles.cancelButton} title="Cancel">✕</button>
                         </div>
                       </div>
                     ) : (
                       <>
                         <div style={styles.itemLeft}>
                           <span style={styles.itemIndex}>{String(idx + 1).padStart(2, "0")}</span>
                           <span style={styles.itemText}>{desg.designationName}</span>
                         </div>
                         <div style={styles.actions}>
                           <button onClick={() => startEditDesg(desg)} className="dept-edit-btn" style={styles.editButton} title="Edit">✎ Edit</button>
                         </div>
                       </>
                     )}
                   </div>
                 ))
             )}
           </div>
         </div>
 
       </div>
 
       
     </div>
   );
 }
 
 /* ======================
    STYLES — Orange theme preserved, rich new layout
    ====================== */
 const styles = {
   page: {
     padding: 0,
     position: "relative",
     zIndex: 1,
   },
 
 headerWrapper: {
  position: "relative",
  textAlign: "center",
  padding: "20px 10px 10px",
  overflow: "hidden",
},
   header: {
     position: "relative",
     zIndex: 2,
   },
   headerIconRow: {
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     gap: "10px",
     marginBottom: "14px",
   },
   headerTag: {
     background: "linear-gradient(135deg, #ff7a00, #ff9f43)",
     color: "#fff",
     fontSize: "11px",
     fontWeight: "800",
     letterSpacing: "0.13em",
     textTransform: "uppercase",
     padding: "4px 14px",
     borderRadius: "100px",
   },
   heading: {
     fontSize: "clamp(26px, 4vw, 38px)",
     fontWeight: "900",
     background: "linear-gradient(135deg, #c2410c 0%, #ff7a00 45%, #ff9f43 100%)",
     WebkitBackgroundClip: "text",
     WebkitTextFillColor: "transparent",
     backgroundClip: "text",
     marginBottom: "10px",
     letterSpacing: "-0.02em",
     lineHeight: 1.15,
   },
   subtitle: {
     fontSize: "15px",
     color: "#92400e",
     fontWeight: "500",
     margin: "0 0 28px",
     opacity: 0.75,
   },
 
   statsStrip: {
     display: "inline-flex",
     alignItems: "center",
     background: "#fff",
     border: "1.5px solid #fde68a",
     borderRadius: "16px",
     padding: "12px 28px",
     boxShadow: "0 4px 20px rgba(255,122,0,0.12)",
   },
   statItem: {
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     padding: "0 20px",
   },
   statNum: {
     fontSize: "26px",
     fontWeight: "900",
     color: "#ff7a00",
     lineHeight: 1,
   },
   statLabel: {
     fontSize: "11px",
     fontWeight: "700",
     color: "#92400e",
     marginTop: "3px",
     textTransform: "uppercase",
     letterSpacing: "0.06em",
     opacity: 0.7,
   },
   statDivider: {
     width: "1px",
     height: "36px",
     background: "linear-gradient(to bottom, transparent, #fde68a, transparent)",
   },
 
   gridContainer: {
     display: "grid",
     gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
     gap: "24px",
     maxWidth: "1140px",
     margin: "0 auto",
     padding: "0 20px 40px",
     position: "relative",
     zIndex: 2,
   },
 
card: {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
  paddingBottom: "24px",
},
 
 illustrationArea: {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "20px 22px 16px",
  background: "#ffffff",   // pure white
},
   illustrationText: { flex: 1 },
   illustrationTitle: {
     fontSize: "20px",
     fontWeight: "800",
     color: "#92400e",
     letterSpacing: "-0.01em",
   },
   illustrationSub: {
     fontSize: "12.5px",
     color: "#b45309",
     marginTop: "3px",
     fontWeight: "500",
     opacity: 0.75,
   },
 
   cardDivider: {
     height: "1px",
     background: "linear-gradient(to right, transparent, #fde68a 30%, #ff9f43 50%, #fde68a 70%, transparent)",
     margin: "0 0 20px",
   },
 
   badge: {
     background: "linear-gradient(135deg, #ff7a00, #ff9f43)",
     color: "#fff",
     padding: "6px 14px",
     borderRadius: "100px",
     fontSize: "12px",
     fontWeight: "800",
     flexShrink: 0,
     boxShadow: "0 3px 10px rgba(255,122,0,0.3)",
   },
 
   inputGroup: {
     display: "flex",
     gap: "10px",
     marginBottom: "8px",
     padding: "0 20px",
   },
   inputWrapper: {
     flex: 1,
     display: "flex",
     alignItems: "center",
     background: "#fff8f3",
     border: "1.5px solid #fde68a",
     borderRadius: "11px",
     padding: "0 14px",
     transition: "all 0.2s",
   },
   inputIcon: {
     fontSize: "17px",
     marginRight: "8px",
     flexShrink: 0,
   },
   input: {
     flex: 1,
     padding: "11px 0",
     border: "none",
     background: "transparent",
     fontSize: "14px",
     fontFamily: "'Nunito', sans-serif",
     fontWeight: "600",
     color: "#78350f",
     outline: "none",
   },
   addButton: {
     padding: "11px 20px",
     borderRadius: "11px",
     border: "none",
     background: "linear-gradient(135deg, #ff7a00, #ff9f43)",
     color: "#fff",
     cursor: "pointer",
     fontSize: "14px",
     fontWeight: "800",
     whiteSpace: "nowrap",
     boxShadow: "0 4px 14px rgba(255,122,0,0.38)",
     letterSpacing: "0.01em",
     fontFamily: "'Nunito', sans-serif",
   },
   errorMsg: {
     color: "#dc2626",
     fontSize: "12.5px",
     fontWeight: "700",
     padding: "4px 20px 8px",
     display: "flex",
     alignItems: "center",
     gap: "5px",
   },
   filterWrapper: {
     display: "flex",
     alignItems: "center",
     background: "#fafafa",
     border: "1.5px solid #e5e7eb",
     borderRadius: "10px",
     padding: "0 14px",
     margin: "0 20px 16px",
     transition: "all 0.2s",
   },
   filterInput: {
     flex: 1,
     padding: "9px 0",
     border: "none",
     background: "transparent",
     fontSize: "13.5px",
     fontFamily: "'Nunito', sans-serif",
     fontWeight: "600",
     color: "#374151",
     outline: "none",
   },
 
   listContainer: {
     maxHeight: "390px",
     overflowY: "auto",
     padding: "0 20px",
   },
   listItem: {
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
     padding: "12px 14px",
     marginBottom: "7px",
     borderRadius: "11px",
     backgroundColor: "#fffbf7",
     border: "1.5px solid #fde68a",
     cursor: "default",
   },
   itemLeft: {
     display: "flex",
     alignItems: "center",
     gap: "10px",
     flex: 1,
   },
   itemIndex: {
     fontSize: "11px",
     fontWeight: "800",
     color: "#ff9f43",
     minWidth: "24px",
     fontFamily: "monospace",
     letterSpacing: "0.04em",
   },
   itemText: {
     fontSize: "14.5px",
     color: "#374151",
     fontWeight: "700",
     flex: 1,
   },
   actions: {
     display: "flex",
     gap: "8px",
   },
   editButton: {
     padding: "6px 14px",
     borderRadius: "8px",
     border: "none",
     backgroundColor: "#3b82f6",
     color: "#ffffff",
     cursor: "pointer",
     fontSize: "12.5px",
     fontWeight: "700",
     display: "flex",
     alignItems: "center",
     gap: "4px",
     fontFamily: "'Nunito', sans-serif",
   },
 
   editContainer: {
     display: "flex",
     gap: "10px",
     width: "100%",
     alignItems: "center",
   },
   editInput: {
     flex: 1,
     padding: "9px 13px",
     borderRadius: "9px",
     border: "2px solid #ff7a00",
     fontSize: "14px",
     outline: "none",
     backgroundColor: "#fff8f3",
     fontFamily: "'Nunito', sans-serif",
     fontWeight: "600",
     color: "#78350f",
   },
   editActions: {
     display: "flex",
     gap: "7px",
   },
   saveButton: {
     padding: "8px 15px",
     borderRadius: "8px",
     border: "none",
     backgroundColor: "#10b981",
     color: "#fff",
     cursor: "pointer",
     fontSize: "17px",
     fontWeight: "bold",
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     boxShadow: "0 3px 10px rgba(16,185,129,0.35)",
   },
   cancelButton: {
     padding: "8px 15px",
     borderRadius: "8px",
     border: "none",
     backgroundColor: "#6b7280",
     color: "#fff",
     cursor: "pointer",
     fontSize: "17px",
     fontWeight: "bold",
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
   },
 
   emptyState: {
     textAlign: "center",
     padding: "36px 20px",
     color: "#b45309",
   },
   emptyIllus: {
     display: "flex",
     justifyContent: "center",
     marginBottom: "4px",
     opacity: 0.7,
   },
 
   footerWave: {
     marginTop: "20px",
     position: "relative",
     zIndex: 2,
   },
   footerText: {
     textAlign: "center",
     color: "#b45309",
     fontSize: "12px",
     fontWeight: "700",
     padding: "6px 0 20px",
     letterSpacing: "0.05em",
     opacity: 0.6,
   },
 };
 