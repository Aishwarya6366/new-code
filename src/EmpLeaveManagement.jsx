// import React, { useState, useEffect, useCallback, useRef } from "react";
// import api from "./api";
// import "./EmpLeaveManagement.css";

// /* ─────────────────────────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────────────────────────── */
// const calculateDays = (startDate, endDate) => {
//   if (!startDate || !endDate) return 0;
//   let start, end;
//   if (Array.isArray(startDate) && Array.isArray(endDate)) {
//     start = new Date(startDate[0], startDate[1] - 1, startDate[2]);
//     end   = new Date(endDate[0],   endDate[1]   - 1, endDate[2]);
//   } else if (typeof startDate === "string" && typeof endDate === "string") {
//     start = new Date(startDate);
//     end   = new Date(endDate);
//   } else return 0;
//   if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
//   return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
// };

// const formatDate = (dateArray) => {
//   if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return "-";
//   const [year, month, day] = dateArray;
//   if (!year || !month || !day) return "-";
//   const date = new Date(year, month - 1, day);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
// };

// const convertToDateArray = (dateString) => {
//   if (!dateString) return null;
//   const d = new Date(dateString);
//   return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
// };

// const STATUS_MAP_NUM = {
//   1: { text: "PENDING",  cls: "status-pending"  },
//   2: { text: "APPROVED", cls: "status-approved" },
//   3: { text: "REJECTED", cls: "status-rejected" },
// };
// const STATUS_MAP_STR = {
//   "PENDING":  { text: "PENDING",  cls: "status-pending"  },
//   "APPROVED": { text: "APPROVED", cls: "status-approved" },
//   "REJECTED": { text: "REJECTED", cls: "status-rejected" },
// };
// const statusInfo = (s) => {
//   if (s === null || s === undefined) return { text: "-", cls: "" };
//   if (typeof s === "string") return STATUS_MAP_STR[s.toUpperCase()] || { text: s, cls: "" };
//   return STATUS_MAP_NUM[s] || { text: "-", cls: "" };
// };
// const isPendingStatus  = (s) => s === 1 || (typeof s === "string" && s.toUpperCase() === "PENDING");
// const isApprovedStatus = (s) => s === 2 || (typeof s === "string" && s.toUpperCase() === "APPROVED");

// const resolveLeaveName = (leave, leaveTypes = []) => {
//   // Tier 1: direct name fields — all possible backend key variants
//   const nameFields = ["leaveName","leave_name","leaveType","leave_type","leaveTypeName","type","typeName","name"];
//   for (const f of nameFields) {
//     if (leave[f] && String(leave[f]).trim() !== "") return leave[f];
//   }
//   // Tier 2: match by ID
//   const idFields = ["leaveId","leave_id","leaveTypeId","leavemaster_id","masterLeaveId","leaveCode"];
//   for (const f of idFields) {
//     if (leave[f] != null) {
//       const m = leaveTypes.find((lt) =>
//         String(lt.leaveId ?? lt.id ?? lt.leave_id ?? "") === String(leave[f])
//       );
//       if (m?.leaveName || m?.name) return m.leaveName || m.name;
//     }
//   }
//   // Tier 3: match by noOfDays
//   if (leave.noOfDays != null && leaveTypes.length > 0) {
//     const m = leaveTypes.find((lt) => lt.noOfDays === leave.noOfDays);
//     if (m?.leaveName) return m.leaveName;
//   }
//   return "-";
// };

// // Resolve employee ID from all possible field names the backend may use
// const resolveEmployeeId = (leave) => {
//   const fields = [
//     "employeeId","employee_id","empId","emp_id",
//     "staffId","staff_id","userId","user_id",
//     "empCode","employeeCode","createdBy","created_by",
//     "memberId","personId"
//   ];
//   for (const f of fields) {
//     const v = leave[f];
//     if (v != null && String(v).trim() !== "" && String(v).trim() !== "null" && String(v).trim() !== "undefined") {
//       return String(v);
//     }
//   }
//   return null;
// };

// // Resolve employee name from all possible field name variants
// const resolveEmployeeName = (leave) => {
//   const fields = [
//     "employeeName","employee_name","empName","emp_name",
//     "name","fullName","full_name","staffName",
//     "firstName","first_name","userName","user_name","displayName"
//   ];
//   for (const f of fields) {
//     const v = leave[f];
//     if (v && String(v).trim() !== "") return String(v);
//   }
//   return null;
// };

// const TODAY = new Date().toISOString().split("T")[0];

// /* ─────────────────────────────────────────────────────────────
//    🎉 CELEBRATION ENGINE
//    Spawns confetti, floating cartoons, hearts, stars, rocket
//    and a big approval banner on screen.
// ───────────────────────────────────────────────────────────── */

// // Cartoon / emoji "characters" that float upward
// const FLOAT_CHARS   = ["🥳","🎊","🎉","😄","🌟","🦄","🐥","🎈","🍭","🤩","😎","🌈","🎀","🥰","🏖️"];
// const STAR_CHARS    = ["✨","⭐","💫","🌟","⚡"];
// const HEART_CHARS   = ["💖","💕","💝","❤️","🧡","💛","💚","💙"];
// const CONFETTI_COLS = ["#f97316","#ec4899","#facc15","#34d399","#60a5fa","#a78bfa","#fb7185","#4ade80"];

// function rand(min, max) { return Math.random() * (max - min) + min; }

// function CelebrationOverlay({ active, employeeName }) {
//   const [items, setItems] = useState([]);
//   const [showBanner, setShowBanner] = useState(false);
//   const idRef = useRef(0);

//   useEffect(() => {
//     if (!active) { setItems([]); setShowBanner(false); return; }

//     setShowBanner(true);
//     const newItems = [];

//     // ── 40 confetti pieces ──
//     for (let i = 0; i < 40; i++) {
//       newItems.push({
//         id: idRef.current++,
//         kind: "confetti",
//         left: `${rand(0, 100)}%`,
//         color: CONFETTI_COLS[Math.floor(Math.random() * CONFETTI_COLS.length)],
//         delay: `${rand(0, 1.4)}s`,
//         width: `${rand(8, 16)}px`,
//         height: `${rand(10, 20)}px`,
//         borderRadius: Math.random() > 0.5 ? "50%" : "3px",
//         swayDuration: `${rand(0.7, 1.3)}s`,
//       });
//     }

//     // ── 12 floating cartoon characters ──
//     for (let i = 0; i < 12; i++) {
//       newItems.push({
//         id: idRef.current++,
//         kind: "char",
//         emoji: FLOAT_CHARS[Math.floor(Math.random() * FLOAT_CHARS.length)],
//         left: `${rand(5, 90)}%`,
//         bottom: `${rand(5, 30)}%`,
//         delay: `${rand(0, 1.2)}s`,
//         size: `${rand(42, 66)}px`,
//         duration: `${rand(2.2, 3.5)}s`,
//       });
//     }

//     // ── 10 star bursts ──
//     for (let i = 0; i < 10; i++) {
//       newItems.push({
//         id: idRef.current++,
//         kind: "star",
//         emoji: STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)],
//         left: `${rand(5, 92)}%`,
//         top:  `${rand(10, 70)}%`,
//         delay: `${rand(0, 1)}s`,
//         duration: `${rand(1.3, 2)}s`,
//       });
//     }

//     // ── 8 floating hearts ──
//     for (let i = 0; i < 8; i++) {
//       newItems.push({
//         id: idRef.current++,
//         kind: "heart",
//         emoji: HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
//         left: `${rand(5, 90)}%`,
//         bottom: `${rand(5, 25)}%`,
//         delay: `${rand(0.2, 1.5)}s`,
//         duration: `${rand(1.8, 2.8)}s`,
//       });
//     }

//     // ── 3 rockets ──
//     for (let i = 0; i < 3; i++) {
//       newItems.push({
//         id: idRef.current++,
//         kind: "rocket",
//         left:   `${rand(20, 80)}%`,
//         bottom: `${rand(5, 20)}%`,
//         delay:  `${rand(0, 0.8)}s`,
//         duration: `${rand(1.8, 2.4)}s`,
//       });
//     }

//     setItems(newItems);

//     // Clean up after animations finish
//     const cleanup = setTimeout(() => {
//       setItems([]);
//       setShowBanner(false);
//     }, 5000);

//     return () => clearTimeout(cleanup);
//   }, [active]);

//   if (!active && items.length === 0 && !showBanner) return null;

//   return (
//     <>
//       {/* Approval banner */}
//       {showBanner && (
//         <div className="approval-banner">
//           <span className="approval-banner-icon">🎉</span>
//           Leave Approved{employeeName ? ` for ${employeeName}` : ""}!
//           <span className="approval-banner-icon">✅</span>
//         </div>
//       )}

//       {/* Particle layer */}
//       <div className="celebration-overlay" aria-hidden="true">
//         {items.map((item) => {
//           if (item.kind === "confetti") {
//             return (
//               <div
//                 key={item.id}
//                 className="confetti-piece"
//                 style={{
//                   left: item.left,
//                   background: item.color,
//                   animationDelay: item.delay,
//                   width: item.width,
//                   height: item.height,
//                   borderRadius: item.borderRadius,
//                   animationDuration: `3s, ${item.swayDuration}`,
//                 }}
//               />
//             );
//           }
//           if (item.kind === "char") {
//             return (
//               <div
//                 key={item.id}
//                 className="float-char"
//                 style={{
//                   left: item.left,
//                   bottom: item.bottom,
//                   fontSize: item.size,
//                   animationDelay: item.delay,
//                   animationDuration: item.duration,
//                 }}
//               >
//                 {item.emoji}
//               </div>
//             );
//           }
//           if (item.kind === "star") {
//             return (
//               <div
//                 key={item.id}
//                 className="star-burst"
//                 style={{
//                   left: item.left,
//                   top: item.top,
//                   animationDelay: item.delay,
//                   animationDuration: item.duration,
//                 }}
//               >
//                 {item.emoji}
//               </div>
//             );
//           }
//           if (item.kind === "heart") {
//             return (
//               <div
//                 key={item.id}
//                 className="heart-float"
//                 style={{
//                   left: item.left,
//                   bottom: item.bottom,
//                   animationDelay: item.delay,
//                   animationDuration: item.duration,
//                 }}
//               >
//                 {item.emoji}
//               </div>
//             );
//           }
//           if (item.kind === "rocket") {
//             return (
//               <div
//                 key={item.id}
//                 className="rocket-char"
//                 style={{
//                   left: item.left,
//                   bottom: item.bottom,
//                   animationDelay: item.delay,
//                   animationDuration: item.duration,
//                 }}
//               >
//                 🚀
//               </div>
//             );
//           }
//           return null;
//         })}
//       </div>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    ANIMATED BACKGROUND BUBBLES
// ───────────────────────────────────────────────────────────── */
// function AnimatedBackground() {
//   return (
//     <div className="animated-bg" aria-hidden="true">
//       {Array.from({ length: 10 }).map((_, i) => (
//         <div key={i} className="bubble" />
//       ))}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    SMALL UI ATOMS
// ───────────────────────────────────────────────────────────── */
// function StatusBadge({ status }) {
//   const { text, cls } = statusInfo(status);
//   return <span className={`status-badge ${cls}`}>{text}</span>;
// }

// function EmptyState({ icon, title, desc }) {
//   return (
//     <div className="empty-state">
//       <div className="empty-icon">{icon}</div>
//       <h3>{title}</h3>
//       <p>{desc}</p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    🎨 ANIMATED ALERT MODAL
//    Context-aware: success shows sleeping/holiday emojis,
//    error shows worried emojis, with floating particles
// ───────────────────────────────────────────────────────────── */

// // Leave-themed emoji sets per alert type
// const ALERT_THEMES = {
//   success: {
//     hero:       ["😴","🏖️","🌴","🛌","😪","🌙","⭐","🏝️","🎒","☀️"],
//     floaters:   ["💤","💤","🌟","✨","🌈","🎉","🥳","🎊","😊","🌸","🌺","🦋"],
//     particles:  ["#f97316","#ec4899","#facc15","#34d399","#60a5fa","#a78bfa"],
//     bg:         "linear-gradient(135deg, #fff7ed 0%, #fdf2f8 100%)",
//     border:     "linear-gradient(135deg, #f97316, #ec4899)",
//     titleColor: "#f97316",
//     label:      "Yayyy! 🎉",
//   },
//   error: {
//     hero:       ["😟","😬","⚠️","😰","🙈","😖","💔","🚫","😤","🤦"],
//     floaters:   ["❌","⚠️","😟","💢","🔴","❗","😔","😮"],
//     particles:  ["#ef4444","#f97316","#fbbf24","#f43f5e","#fb923c"],
//     bg:         "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)",
//     border:     "linear-gradient(135deg, #ef4444, #f97316)",
//     titleColor: "#ef4444",
//     label:      "Oops!",
//   },
// };


// function AnimatedAlertModal({ message, onClose }) {
//   const [visible, setVisible]     = useState(false);
//   const [leaving, setLeaving]     = useState(false);
//   const [floaters, setFloaters]   = useState([]);
//   const [particles, setParticles] = useState([]);
//   const idRef = useRef(0);
//   const autoRef = useRef(null);

//   // Build floating items whenever a new message arrives
//   useEffect(() => {
//     if (!message.text) { setVisible(false); return; }

//     const theme = ALERT_THEMES[message.type] || ALERT_THEMES.success;
//     setLeaving(false);
//     setVisible(true);

//     // Floating emoji characters
//     const fl = [];
//     for (let i = 0; i < 14; i++) {
//       fl.push({
//         id: idRef.current++,
//         emoji: theme.floaters[Math.floor(Math.random() * theme.floaters.length)],
//         left:     `${rand(2, 95)}%`,
//         bottom:   `${rand(-5, 40)}%`,
//         size:     `${rand(22, 48)}px`,
//         delay:    `${rand(0, 1.8)}s`,
//         duration: `${rand(3, 6)}s`,
//         drift:    rand(-40, 40),
//       });
//     }
//     setFloaters(fl);

//     // Confetti/particle burst
//     const pc = [];
//     for (let i = 0; i < 28; i++) {
//       pc.push({
//         id: idRef.current++,
//         color: theme.particles[Math.floor(Math.random() * theme.particles.length)],
//         left:    `${rand(5, 95)}%`,
//         delay:   `${rand(0, 1.2)}s`,
//         w:       `${rand(7, 14)}px`,
//         h:       `${rand(9, 18)}px`,
//         shape:   Math.random() > 0.4 ? "3px" : "50%",
//         swing:   `${rand(0.6, 1.2)}s`,
//       });
//     }
//     setParticles(pc);

//     // Auto dismiss after 4.5s
//     if (autoRef.current) clearTimeout(autoRef.current);
//     autoRef.current = setTimeout(() => handleClose(), 4500);
//     return () => clearTimeout(autoRef.current);
//   }, [message]);

//   const handleClose = () => {
//     setLeaving(true);
//     setTimeout(() => { setVisible(false); onClose(); }, 420);
//   };

//   if (!visible && !message.text) return null;

//   const theme  = ALERT_THEMES[message.type] || ALERT_THEMES.success;
//   const heroEmoji = theme.hero[Math.floor(Math.random() * theme.hero.length)];

//   return (
//     <div
//       className={`alert-modal-overlay ${leaving ? "alert-leaving" : "alert-entering"}`}
//       onClick={handleClose}
//     >
//       <div
//         className={`alert-modal-card ${leaving ? "card-leaving" : "card-entering"}`}
//         style={{ background: theme.bg }}
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Border glow ring */}
//         <div className="alert-border-ring" style={{ background: theme.border }} />

//         {/* Confetti layer */}
//         <div className="alert-confetti-layer" aria-hidden="true">
//           {particles.map(p => (
//             <div key={p.id} className="alert-particle" style={{
//               left: p.left, background: p.color,
//               width: p.w, height: p.h, borderRadius: p.shape,
//               animationDelay: p.delay,
//               animationDuration: `2.8s, ${p.swing}`,
//             }} />
//           ))}
//         </div>

//         {/* Floating emoji background layer */}
//         <div className="alert-floaters-layer" aria-hidden="true">
//           {floaters.map(f => (
//             <div key={f.id} className="alert-floater" style={{
//               left: f.left, bottom: f.bottom,
//               fontSize: f.size,
//               animationDelay: f.delay,
//               animationDuration: f.duration,
//               "--drift": `${f.drift}px`,
//             }}>
//               {f.emoji}
//             </div>
//           ))}
//         </div>

//         {/* Hero character — big bouncing emoji */}
//         <div className="alert-hero-wrap">
//           <div className="alert-hero-circle" style={{ background: theme.border }}>
//             <span className="alert-hero-emoji">{heroEmoji}</span>
//           </div>
//           {/* Orbiting mini emojis */}
//           {["💤","⭐","✨","🌟"].map((e, i) => (
//             <div key={i} className={`alert-orbit alert-orbit-${i}`}>{e}</div>
//           ))}
//         </div>

//         {/* Label pill */}
//         <div className="alert-label-pill" style={{ background: theme.border }}>
//           {theme.label}
//         </div>

//         {/* Message text */}
//         <p className="alert-message-text" style={{ color: theme.titleColor }}>
//           {message.text}
//         </p>

//         {/* Progress bar */}
//         <div className="alert-progress-bar">
//           <div
//             className="alert-progress-fill"
//             style={{ background: theme.border }}
//           />
//         </div>

//         {/* Close button */}
//         <button className="alert-close-btn" onClick={handleClose}>
//           Got it ✓
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    HOOK: useToast  (unchanged API — showMsg still works)
// ───────────────────────────────────────────────────────────── */
// function useToast() {
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const show = useCallback((type, text) => {
//     setMessage({ type, text });
//   }, []);
//   const clear = useCallback(() => setMessage({ type: "", text: "" }), []);
//   return { message, show, clear };
// }

// /* ─────────────────────────────────────────────────────────────
//    TAB: APPLY LEAVE
// ───────────────────────────────────────────────────────────── */
// function ApplyLeaveTab({ leaveTypes, onApplied, showMsg }) {
//   const [form, setForm]       = useState({ leaveId: "", startDate: "", endDate: "", reason: "" });
//   const [loading, setLoading] = useState(false);

//   const days         = calculateDays(form.startDate, form.endDate);
//   const selectedType = leaveTypes.find((lt) => lt.leaveId == form.leaveId);
//   const maxDays      = selectedType?.noOfDays || 0;
//   const exceeds      = days > maxDays && maxDays > 0;

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const clearForm = () =>
//     setForm({ leaveId: "", startDate: "", endDate: "", reason: "" });

//   const submit = async () => {
//     const { leaveId, startDate, endDate, reason } = form;
//     if (!leaveId || !startDate || !endDate || !reason.trim()) {
//       showMsg("error", "Please fill all required fields"); return;
//     }
//     const start = new Date(startDate), end = new Date(endDate);
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) { showMsg("error", "Invalid date format"); return; }
//     const today = new Date(); today.setHours(0, 0, 0, 0);
//     if (start < today) { showMsg("error", "Start date cannot be in the past"); return; }
//     if (start > end)   { showMsg("error", "End date must be after start date"); return; }
//     if (exceeds)       { showMsg("error", `Maximum ${maxDays} days allowed for this leave type`); return; }

//     setLoading(true);
//     try {
//       await api.post("/leave-record/applyLeave", {
//         leaveId,
//         startDate: convertToDateArray(startDate),
//         endDate:   convertToDateArray(endDate),
//         reason:    reason.trim(),
//       });
//       showMsg("success", "Leave application submitted successfully!");
//       clearForm();
//       onApplied();
//     } catch (err) {
//       showMsg("error", err.response?.data?.message || "Failed to apply leave");
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="section-container">
//       <div className="section-header">
//         <div>
//           <h2>Apply for Leave</h2>
//           <p className="section-subtitle">Submit a new leave request with required details</p>
//         </div>
//       </div>
//       <div className="form-container">
//         <div className="form-group">
//           <label className="form-label">Leave Type <span className="required">*</span></label>
//           <select name="leaveId" value={form.leaveId} onChange={handleChange}
//             className="form-select" disabled={loading}>
//             <option value="">Select Leave Type</option>
//             {leaveTypes.map((l) => (
//               <option key={l.leaveId} value={l.leaveId}>
//                 {l.leaveName} (Max: {l.noOfDays} days)
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Start Date <span className="required">*</span></label>
//             <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
//               className="form-input" disabled={loading} min={TODAY} />
//           </div>
//           <div className="form-group">
//             <label className="form-label">End Date <span className="required">*</span></label>
//             <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
//               className="form-input" disabled={loading} min={form.startDate || TODAY} />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Total Days</label>
//             <div className={`days-display ${exceeds ? "days-display-warning" : ""}`}>
//               <span className="days-count">{days}</span>
//               <span className="days-text">
//                 day{days !== 1 ? "s" : ""}
//                 {exceeds && (
//                   <span style={{ display: "block", fontSize: 12, color: "var(--danger)", marginTop: 4, fontWeight: 500 }}>
//                     Exceeds limit by {days - maxDays} days
//                   </span>
//                 )}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="form-group">
//           <label className="form-label">Reason <span className="required">*</span></label>
//           <textarea name="reason" value={form.reason} onChange={handleChange}
//             className="form-textarea" rows={4} disabled={loading}
//             placeholder="Please provide a detailed reason for your leave..." />
//         </div>

//         <div className="form-actions">
//           <button className="btn btn-secondary" onClick={clearForm} disabled={loading}>Clear Form</button>
//           <button className="btn btn-primary" onClick={submit} disabled={loading || exceeds}>
//             {loading ? "Submitting..." : "Apply Leave"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    TAB: MY LEAVES
// ───────────────────────────────────────────────────────────── */
// function MyLeavesTab({ myLeaves, leaveTypes, onRefresh, loading }) {
//   return (
//     <div className="section-container">
//       <div className="section-header">
//         <div>
//           <h2>My Leave History</h2>
//           <p className="section-subtitle">Track your leave applications and status</p>
//         </div>
//         <div className="section-actions">
//           <button className="btn-refresh-small" onClick={onRefresh} disabled={loading}>↻ Refresh</button>
//         </div>
//       </div>

//       {myLeaves.length === 0 ? (
//         <EmptyState icon="📋" title="No Leave Applications" desc="You haven't applied for any leaves yet" />
//       ) : (
//         <div className="table-container">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Leave ID</th>
//                 <th>Type</th>
//                 <th>From Date</th>
//                 <th>To Date</th>
//                 <th>Duration</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {myLeaves.map((leave) => {
//                 const days      = leave.noOfDays ?? calculateDays(leave.startDate, leave.endDate);
//                 const leaveName = resolveLeaveName(leave, leaveTypes);
//                 // use recId OR any available unique key
//                 return (
//                   <tr key={leave.recId}>
//                     <td className="text-center">#{leave.recId}</td>
//                     <td>{leaveName}</td>
//                     <td>{formatDate(leave.startDate)}</td>
//                     <td>{formatDate(leave.endDate)}</td>
//                     <td className="text-center">{days > 0 ? `${days} days` : "-"}</td>
//                     <td><StatusBadge status={leave.status} /></td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    TAB: TEAM LEAVES  (celebration fires here on approve)
// ───────────────────────────────────────────────────────────── */
// function TeamLeavesTab({ teamLeaves, leaveTypes, onRefresh, loading, showMsg, onActionDone, onApproveSuccess }) {
//   const [rejectModal,  setRejectModal]  = useState(null);
//   const [rejectReason, setRejectReason] = useState("");
//   const [actioning,    setActioning]    = useState(false);
//   const [flashRow,     setFlashRow]     = useState(null);

//   const approve = async (recId, status, employeeName) => {
//     if (!isPendingStatus(status)) {
//       showMsg("error", "Only pending leaves can be approved"); return;
//     }
//     if (!window.confirm("Are you sure you want to approve this leave request?")) return;
//     setActioning(true);
//     try {
//       await api.put(`/leave-record/approve/${recId}`, {});

//       // Flash the row
//       setFlashRow(recId);
//       setTimeout(() => setFlashRow(null), 1600);

//       // 🎉 Trigger celebration
//       onApproveSuccess(employeeName);

//       showMsg("success", "Leave approved successfully!");
//       onActionDone();
//     } catch (err) {
//       showMsg("error", err.response?.data?.message || "Failed to approve leave");
//     } finally { setActioning(false); }
//   };

//   const openReject = (leave) => { setRejectModal(leave); setRejectReason(""); };

//   const confirmReject = async () => {
//     if (!rejectModal || !isPendingStatus(rejectModal.status)) {
//       showMsg("error", "Only pending leaves can be rejected"); return;
//     }
//     if (!rejectReason.trim()) {
//       showMsg("error", "Please enter a reason for rejection"); return;
//     }
//     setActioning(true);
//     try {
//       await api.put(`/leave-record/reject/${rejectModal.recId}`, { reason: rejectReason.trim() });
//       showMsg("success", "Leave rejected successfully!");
//       setRejectModal(null);
//       onActionDone();
//     } catch (err) {
//       showMsg("error", err.response?.data?.message || "Failed to reject leave");
//     } finally { setActioning(false); }
//   };

//   return (
//     <div className="section-container">
//       <div className="section-header">
//         <div>
//           <h2>Team Leave Requests</h2>
//           <p className="section-subtitle">Review and manage leave requests from your team</p>
//         </div>
//         <div className="section-actions">
//           <button className="btn-refresh-small" onClick={onRefresh} disabled={loading}>↻ Refresh</button>
//         </div>
//       </div>

//       {teamLeaves.length === 0 ? (
//         <EmptyState icon="👥" title="No Team Requests" desc="There are no pending leave requests from your team" />
//       ) : (
//         <div className="table-container">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Employee</th>
//                 <th>Leave Type</th>
//                 <th>From Date</th>
//                 <th>To Date</th>
//                 <th>Duration</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {teamLeaves.map((leave) => {
//                 const days      = leave.noOfDays ?? calculateDays(leave.startDate, leave.endDate);
//                 const leaveName = resolveLeaveName(leave, leaveTypes);
//                 const empName   = resolveEmployeeName(leave);
//                 const empId     = resolveEmployeeId(leave);
//                 const pending   = isPendingStatus(leave.status);
//                 const approved  = isApprovedStatus(leave.status);
//                 const avatarChar = empName?.charAt(0)?.toUpperCase() || "E";
//                 return (
//                   <tr
//                     key={leave.recId}
//                     className={flashRow === leave.recId ? "row-approved-flash" : ""}
//                   >
//                     <td>
//                       <div className="employee-info">
//                         <div className="employee-avatar">{avatarChar}</div>
//                         <div className="employee-details">
//                           <div className="employee-name">{empName || "—"}</div>
//                           {empId && <div className="employee-id">ID: {empId}</div>}
//                         </div>
//                       </div>
//                     </td>
//                     <td>{leaveName !== "-" ? leaveName : <span style={{color:"var(--gray-400)",fontStyle:"italic"}}>N/A</span>}</td>
//                     <td>{formatDate(leave.startDate)}</td>
//                     <td>{formatDate(leave.endDate)}</td>
//                     <td className="text-center">{days > 0 ? `${days} days` : "-"}</td>
//                     <td><StatusBadge status={leave.status} /></td>
//                     <td>
//                       {pending ? (
//                         <div className="action-buttons">
//                           <button className="btn-action approve"
//                             onClick={() => approve(leave.recId, leave.status, empName)}
//                             disabled={loading || actioning}>Approve</button>
//                           <button className="btn-action reject"
//                             onClick={() => openReject(leave)}
//                             disabled={loading || actioning}>Reject</button>
//                         </div>
//                       ) : (
//                         <span className="action-text">
//                           {approved ? "✔ Approved" : "❌ Rejected"}
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Reject Modal */}
//       {rejectModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Reject Leave Request</h3>
//               <button className="modal-close" onClick={() => setRejectModal(null)}>×</button>
//             </div>
//             <div className="modal-body">
//               <div className="leave-details">
//                 <div className="detail-row">
//                   <span className="detail-label">Employee:</span>
//                   <span className="detail-value">{resolveEmployeeName(rejectModal) || "—"}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Leave Type:</span>
//                   <span className="detail-value">{resolveLeaveName(rejectModal, leaveTypes)}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Dates:</span>
//                   <span className="detail-value">
//                     {formatDate(rejectModal.startDate)} to {formatDate(rejectModal.endDate)}
//                   </span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Duration:</span>
//                   <span className="detail-value">
//                     {(rejectModal.noOfDays ?? calculateDays(rejectModal.startDate, rejectModal.endDate))} days
//                   </span>
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label className="form-label">
//                   Reason for Rejection <span className="required">*</span>
//                 </label>
//                 <textarea value={rejectReason}
//                   onChange={(e) => setRejectReason(e.target.value)}
//                   className="form-textarea" rows={4}
//                   placeholder="Please provide a reason for rejecting this leave request..." />
//               </div>
//             </div>
//             <div className="modal-actions">
//               <button className="btn btn-secondary" onClick={() => setRejectModal(null)}>Cancel</button>
//               <button className="btn btn-danger" onClick={confirmReject}
//                 disabled={!rejectReason.trim() || actioning}>
//                 {actioning ? "Rejecting..." : "Confirm Rejection"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────────────────────── */
// export default function EmpLeaveManagement() {
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [myLeaves,   setMyLeaves]   = useState([]);
//   const [teamLeaves, setTeamLeaves] = useState([]);
//   const [loading,    setLoading]    = useState(false);
//   const [activeTab,  setActiveTab]  = useState("apply");

//   // 🎉 Celebration state
//   const [celebrationActive,   setCelebrationActive]   = useState(false);
//   const [celebrationEmployee, setCelebrationEmployee] = useState("");
//   const celebrationTimer = useRef(null);

//   const triggerCelebration = useCallback((employeeName) => {
//     // Reset if already running so animation restarts cleanly
//     setCelebrationActive(false);
//     if (celebrationTimer.current) clearTimeout(celebrationTimer.current);

//     // Small tick to allow React to re-render the reset
//     setTimeout(() => {
//       setCelebrationEmployee(employeeName || "");
//       setCelebrationActive(true);
//       celebrationTimer.current = setTimeout(() => {
//         setCelebrationActive(false);
//       }, 4800);
//     }, 50);
//   }, []);

//   const { message, show: showMsg, clear: clearMsg } = useToast();

//   const loadLeaveTypes = useCallback(async () => {
//     try {
//       const res  = await api.get("/leave-master/all");
//       const data = Array.isArray(res.data) ? res.data : [];
//       // DEBUG: log raw leave types so we can see actual field names
//       if (data.length > 0) console.log("[LeaveTypes] sample:", JSON.stringify(data[0]));
//       setLeaveTypes(data.filter((l) => l.leaveName !== "LOP"));
//     } catch (err) { console.error("Error loading leave types:", err); }
//   }, []);

//   const loadMyLeaves = useCallback(async () => {
//     try {
//       const res  = await api.get("/leave-record/myLeaves");
//       const data = Array.isArray(res.data) ? res.data : [];
//       if (data.length > 0) console.log("[MyLeaves] sample:", JSON.stringify(data[0]));
//       setMyLeaves(data);
//     } catch (err) { console.error("Error loading my leaves:", err); }
//   }, []);

//   const loadTeamLeaves = useCallback(async () => {
//     try {
//       const res  = await api.get("/leave-record/teamLeaves");
//       const data = Array.isArray(res.data) ? res.data : [];
//       // DEBUG: log raw team leave so we can see actual field names from API
//       if (data.length > 0) console.log("[TeamLeaves] sample:", JSON.stringify(data[0]));
//       setTeamLeaves(data);
//     } catch (err) { console.error("Error loading team leaves:", err); }
//   }, []);

//   const loadAllData = useCallback(async () => {
//     setLoading(true);
//     try {
//       await Promise.all([loadLeaveTypes(), loadMyLeaves(), loadTeamLeaves()]);
//     } catch { showMsg("error", "Failed to load data"); }
//     finally  { setLoading(false); }
//   }, [loadLeaveTypes, loadMyLeaves, loadTeamLeaves, showMsg]);

//   useEffect(() => { loadAllData(); }, [loadAllData]);

//   const TABS = [
//     { key: "apply", icon: "✦",  label: "Apply Leave"  },
//     { key: "my",    icon: "📋", label: "My Leaves"    },
//     { key: "team",  icon: "👥", label: "Team Leaves"  },
//   ];

//   return (
//     <>
//       <AnimatedBackground />

//       {/* 🎉 Global celebration overlay — renders above everything */}
//       <CelebrationOverlay
//         active={celebrationActive}
//         employeeName={celebrationEmployee}
//       />

//       <div className="leave-management-container">
//         <div className="leave-header">
//           <div className="header-content">
//             <h1 className="page-title">Leave Management</h1>
//             <p className="page-subtitle">Manage your leave applications and approvals</p>
//           </div>
//           <div className="header-actions">
//             <button className="refresh-btn" onClick={loadAllData} disabled={loading}>
//               <span className="refresh-icon">↻</span>
//               Refresh Data
//             </button>
//           </div>
//         </div>

//         <AnimatedAlertModal message={message} onClose={clearMsg} />

//         <div className="tab-navigation">
//           {TABS.map((t) => (
//             <button key={t.key}
//               className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
//               onClick={() => setActiveTab(t.key)}>
//               <span className="tab-icon">{t.icon}</span>
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {loading && activeTab === "apply" && (
//           <div className="loading-overlay">
//             <div className="loading-spinner" />
//             <p>Loading...</p>
//           </div>
//         )}

//         <div className="content-wrapper">
//           {activeTab === "apply" && (
//             <ApplyLeaveTab leaveTypes={leaveTypes} onApplied={loadMyLeaves} showMsg={showMsg} />
//           )}
//           {activeTab === "my" && (
//             <MyLeavesTab
//               myLeaves={myLeaves} leaveTypes={leaveTypes}
//               onRefresh={loadMyLeaves} loading={loading} />
//           )}
//           {activeTab === "team" && (
//             <TeamLeavesTab
//               teamLeaves={teamLeaves}
//               leaveTypes={leaveTypes}
//               onRefresh={loadTeamLeaves}
//               loading={loading}
//               showMsg={showMsg}
//               onApproveSuccess={triggerCelebration}
//               onActionDone={() => { loadTeamLeaves(); loadMyLeaves(); }} />
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "./api";
import "./EmpLeaveManagement.css";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  let start, end;
  if (Array.isArray(startDate) && Array.isArray(endDate)) {
    start = new Date(startDate[0], startDate[1] - 1, startDate[2]);
    end   = new Date(endDate[0],   endDate[1]   - 1, endDate[2]);
  } else if (typeof startDate === "string" && typeof endDate === "string") {
    start = new Date(startDate);
    end   = new Date(endDate);
  } else return 0;
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const formatDate = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return "-";
  const [year, month, day] = dateArray;
  if (!year || !month || !day) return "-";
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const convertToDateArray = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
};

const STATUS_MAP_NUM = {
  1: { text: "PENDING",  cls: "status-pending"  },
  2: { text: "APPROVED", cls: "status-approved" },
  3: { text: "REJECTED", cls: "status-rejected" },
};
const STATUS_MAP_STR = {
  "PENDING":  { text: "PENDING",  cls: "status-pending"  },
  "APPROVED": { text: "APPROVED", cls: "status-approved" },
  "REJECTED": { text: "REJECTED", cls: "status-rejected" },
};
const statusInfo = (s) => {
  if (s === null || s === undefined) return { text: "-", cls: "" };
  if (typeof s === "string") return STATUS_MAP_STR[s.toUpperCase()] || { text: s, cls: "" };
  return STATUS_MAP_NUM[s] || { text: "-", cls: "" };
};
const isPendingStatus  = (s) => s === 1 || (typeof s === "string" && s.toUpperCase() === "PENDING");
const isApprovedStatus = (s) => s === 2 || (typeof s === "string" && s.toUpperCase() === "APPROVED");

const resolveLeaveName = (leave, leaveTypes = []) => {
  // Tier 1: direct name fields — all possible backend key variants
  const nameFields = ["leaveName","leave_name","leaveType","leave_type","leaveTypeName","type","typeName","name"];
  for (const f of nameFields) {
    if (leave[f] && String(leave[f]).trim() !== "") return leave[f];
  }
  // Tier 2: match by ID
  const idFields = ["leaveId","leave_id","leaveTypeId","leavemaster_id","masterLeaveId","leaveCode"];
  for (const f of idFields) {
    if (leave[f] != null) {
      const m = leaveTypes.find((lt) =>
        String(lt.leaveId ?? lt.id ?? lt.leave_id ?? "") === String(leave[f])
      );
      if (m?.leaveName || m?.name) return m.leaveName || m.name;
    }
  }
  // Tier 3: match by noOfDays
  if (leave.noOfDays != null && leaveTypes.length > 0) {
    const m = leaveTypes.find((lt) => lt.noOfDays === leave.noOfDays);
    if (m?.leaveName) return m.leaveName;
  }
  return "-";
};

// Resolve employee ID from all possible field names the backend may use
const resolveEmployeeId = (leave) => {
  const fields = [
    "employeeId","employee_id","empId","emp_id",
    "staffId","staff_id","userId","user_id",
    "empCode","employeeCode","createdBy","created_by",
    "memberId","personId"
  ];
  for (const f of fields) {
    const v = leave[f];
    if (v != null && String(v).trim() !== "" && String(v).trim() !== "null" && String(v).trim() !== "undefined") {
      return String(v);
    }
  }
  return null;
};

// Resolve employee name from all possible field name variants
const resolveEmployeeName = (leave) => {
  const fields = [
    "employeeName","employee_name","empName","emp_name",
    "name","fullName","full_name","staffName",
    "firstName","first_name","userName","user_name","displayName"
  ];
  for (const f of fields) {
    const v = leave[f];
    if (v && String(v).trim() !== "") return String(v);
  }
  return null;
};

const TODAY = new Date().toISOString().split("T")[0];

/* ─────────────────────────────────────────────────────────────
   🎉 CELEBRATION ENGINE
   Spawns confetti, floating cartoons, hearts, stars, rocket
   and a big approval banner on screen.
───────────────────────────────────────────────────────────── */

// Cartoon / emoji "characters" that float upward
const FLOAT_CHARS   = ["🥳","🎊","🎉","😄","🌟","🦄","🐥","🎈","🍭","🤩","😎","🌈","🎀","🥰","🏖️"];
const STAR_CHARS    = ["✨","⭐","💫","🌟","⚡"];
const HEART_CHARS   = ["💖","💕","💝","❤️","🧡","💛","💚","💙"];
const CONFETTI_COLS = ["#f97316","#ec4899","#facc15","#34d399","#60a5fa","#a78bfa","#fb7185","#4ade80"];

function rand(min, max) { return Math.random() * (max - min) + min; }

function CelebrationOverlay({ active, employeeName }) {
  const [items, setItems] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) { setItems([]); setShowBanner(false); return; }

    setShowBanner(true);
    const newItems = [];

    // ── 40 confetti pieces ──
    for (let i = 0; i < 40; i++) {
      newItems.push({
        id: idRef.current++,
        kind: "confetti",
        left: `${rand(0, 100)}%`,
        color: CONFETTI_COLS[Math.floor(Math.random() * CONFETTI_COLS.length)],
        delay: `${rand(0, 1.4)}s`,
        width: `${rand(8, 16)}px`,
        height: `${rand(10, 20)}px`,
        borderRadius: Math.random() > 0.5 ? "50%" : "3px",
        swayDuration: `${rand(0.7, 1.3)}s`,
      });
    }

    // ── 12 floating cartoon characters ──
    for (let i = 0; i < 12; i++) {
      newItems.push({
        id: idRef.current++,
        kind: "char",
        emoji: FLOAT_CHARS[Math.floor(Math.random() * FLOAT_CHARS.length)],
        left: `${rand(5, 90)}%`,
        bottom: `${rand(5, 30)}%`,
        delay: `${rand(0, 1.2)}s`,
        size: `${rand(42, 66)}px`,
        duration: `${rand(2.2, 3.5)}s`,
      });
    }

    // ── 10 star bursts ──
    for (let i = 0; i < 10; i++) {
      newItems.push({
        id: idRef.current++,
        kind: "star",
        emoji: STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)],
        left: `${rand(5, 92)}%`,
        top:  `${rand(10, 70)}%`,
        delay: `${rand(0, 1)}s`,
        duration: `${rand(1.3, 2)}s`,
      });
    }

    // ── 8 floating hearts ──
    for (let i = 0; i < 8; i++) {
      newItems.push({
        id: idRef.current++,
        kind: "heart",
        emoji: HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
        left: `${rand(5, 90)}%`,
        bottom: `${rand(5, 25)}%`,
        delay: `${rand(0.2, 1.5)}s`,
        duration: `${rand(1.8, 2.8)}s`,
      });
    }

    // ── 3 rockets ──
    for (let i = 0; i < 3; i++) {
      newItems.push({
        id: idRef.current++,
        kind: "rocket",
        left:   `${rand(20, 80)}%`,
        bottom: `${rand(5, 20)}%`,
        delay:  `${rand(0, 0.8)}s`,
        duration: `${rand(1.8, 2.4)}s`,
      });
    }

    setItems(newItems);

    // Clean up after animations finish
    const cleanup = setTimeout(() => {
      setItems([]);
      setShowBanner(false);
    }, 5000);

    return () => clearTimeout(cleanup);
  }, [active]);

  if (!active && items.length === 0 && !showBanner) return null;

  return (
    <>
      {/* Approval banner */}
      {showBanner && (
        <div className="approval-banner">
          <span className="approval-banner-icon">🎉</span>
          Leave Approved{employeeName ? ` for ${employeeName}` : ""}!
          <span className="approval-banner-icon">✅</span>
        </div>
      )}

      {/* Particle layer */}
      <div className="celebration-overlay" aria-hidden="true">
        {items.map((item) => {
          if (item.kind === "confetti") {
            return (
              <div
                key={item.id}
                className="confetti-piece"
                style={{
                  left: item.left,
                  background: item.color,
                  animationDelay: item.delay,
                  width: item.width,
                  height: item.height,
                  borderRadius: item.borderRadius,
                  animationDuration: `3s, ${item.swayDuration}`,
                }}
              />
            );
          }
          if (item.kind === "char") {
            return (
              <div
                key={item.id}
                className="float-char"
                style={{
                  left: item.left,
                  bottom: item.bottom,
                  fontSize: item.size,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                {item.emoji}
              </div>
            );
          }
          if (item.kind === "star") {
            return (
              <div
                key={item.id}
                className="star-burst"
                style={{
                  left: item.left,
                  top: item.top,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                {item.emoji}
              </div>
            );
          }
          if (item.kind === "heart") {
            return (
              <div
                key={item.id}
                className="heart-float"
                style={{
                  left: item.left,
                  bottom: item.bottom,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                {item.emoji}
              </div>
            );
          }
          if (item.kind === "rocket") {
            return (
              <div
                key={item.id}
                className="rocket-char"
                style={{
                  left: item.left,
                  bottom: item.bottom,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                🚀
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED BACKGROUND BUBBLES
───────────────────────────────────────────────────────────── */
function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bubble" />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SMALL UI ATOMS
───────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const { text, cls } = statusInfo(status);
  return <span className={`status-badge ${cls}`}>{text}</span>;
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   🎨 ANIMATED ALERT MODAL
   Context-aware: success shows sleeping/holiday emojis,
   error shows worried emojis, with floating particles
───────────────────────────────────────────────────────────── */

// Leave-themed emoji sets per alert type
const ALERT_THEMES = {
  success: {
    hero:       ["😴","🏖️","🌴","🛌","😪","🌙","⭐","🏝️","🎒","☀️"],
    floaters:   ["💤","💤","🌟","✨","🌈","🎉","🥳","🎊","😊","🌸","🌺","🦋"],
    particles:  ["#f97316","#ec4899","#facc15","#34d399","#60a5fa","#a78bfa"],
    bg:         "linear-gradient(135deg, #fff7ed 0%, #fdf2f8 100%)",
    border:     "linear-gradient(135deg, #f97316, #ec4899)",
    titleColor: "#f97316",
    label:      "Yayyy! 🎉",
  },
  error: {
    hero:       ["😟","😬","⚠️","😰","🙈","😖","💔","🚫","😤","🤦"],
    floaters:   ["❌","⚠️","😟","💢","🔴","❗","😔","😮"],
    particles:  ["#ef4444","#f97316","#fbbf24","#f43f5e","#fb923c"],
    bg:         "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)",
    border:     "linear-gradient(135deg, #ef4444, #f97316)",
    titleColor: "#ef4444",
    label:      "Oops!",
  },
};


function AnimatedAlertModal({ message, onClose }) {
  const [visible, setVisible]     = useState(false);
  const [leaving, setLeaving]     = useState(false);
  const [floaters, setFloaters]   = useState([]);
  const [particles, setParticles] = useState([]);
  const idRef = useRef(0);
  const autoRef = useRef(null);

  // Build floating items whenever a new message arrives
  useEffect(() => {
    if (!message.text) { setVisible(false); return; }

    const theme = ALERT_THEMES[message.type] || ALERT_THEMES.success;
    setLeaving(false);
    setVisible(true);

    // Floating emoji characters
    const fl = [];
    for (let i = 0; i < 14; i++) {
      fl.push({
        id: idRef.current++,
        emoji: theme.floaters[Math.floor(Math.random() * theme.floaters.length)],
        left:     `${rand(2, 95)}%`,
        bottom:   `${rand(-5, 40)}%`,
        size:     `${rand(22, 48)}px`,
        delay:    `${rand(0, 1.8)}s`,
        duration: `${rand(3, 6)}s`,
        drift:    rand(-40, 40),
      });
    }
    setFloaters(fl);

    // Confetti/particle burst
    const pc = [];
    for (let i = 0; i < 28; i++) {
      pc.push({
        id: idRef.current++,
        color: theme.particles[Math.floor(Math.random() * theme.particles.length)],
        left:    `${rand(5, 95)}%`,
        delay:   `${rand(0, 1.2)}s`,
        w:       `${rand(7, 14)}px`,
        h:       `${rand(9, 18)}px`,
        shape:   Math.random() > 0.4 ? "3px" : "50%",
        swing:   `${rand(0.6, 1.2)}s`,
      });
    }
    setParticles(pc);

    // Auto dismiss after 4.5s
    if (autoRef.current) clearTimeout(autoRef.current);
    autoRef.current = setTimeout(() => handleClose(), 4500);
    return () => clearTimeout(autoRef.current);
  }, [message]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => { setVisible(false); onClose(); }, 420);
  };

  if (!visible && !message.text) return null;

  const theme  = ALERT_THEMES[message.type] || ALERT_THEMES.success;
  const heroEmoji = theme.hero[Math.floor(Math.random() * theme.hero.length)];

  return (
    <div
      className={`alert-modal-overlay ${leaving ? "alert-leaving" : "alert-entering"}`}
      onClick={handleClose}
    >
      <div
        className={`alert-modal-card ${leaving ? "card-leaving" : "card-entering"}`}
        style={{ background: theme.bg }}
        onClick={e => e.stopPropagation()}
      >
        {/* Border glow ring */}
        <div className="alert-border-ring" style={{ background: theme.border }} />

        {/* Confetti layer */}
        <div className="alert-confetti-layer" aria-hidden="true">
          {particles.map(p => (
            <div key={p.id} className="alert-particle" style={{
              left: p.left, background: p.color,
              width: p.w, height: p.h, borderRadius: p.shape,
              animationDelay: p.delay,
              animationDuration: `2.8s, ${p.swing}`,
            }} />
          ))}
        </div>

        {/* Floating emoji background layer */}
        <div className="alert-floaters-layer" aria-hidden="true">
          {floaters.map(f => (
            <div key={f.id} className="alert-floater" style={{
              left: f.left, bottom: f.bottom,
              fontSize: f.size,
              animationDelay: f.delay,
              animationDuration: f.duration,
              "--drift": `${f.drift}px`,
            }}>
              {f.emoji}
            </div>
          ))}
        </div>

        {/* Hero character — big bouncing emoji */}
        <div className="alert-hero-wrap">
          <div className="alert-hero-circle" style={{ background: theme.border }}>
            <span className="alert-hero-emoji">{heroEmoji}</span>
          </div>
          {/* Orbiting mini emojis */}
          {["💤","⭐","✨","🌟"].map((e, i) => (
            <div key={i} className={`alert-orbit alert-orbit-${i}`}>{e}</div>
          ))}
        </div>

        {/* Label pill */}
        <div className="alert-label-pill" style={{ background: theme.border }}>
          {theme.label}
        </div>

        {/* Message text */}
        <p className="alert-message-text" style={{ color: theme.titleColor }}>
          {message.text}
        </p>

        {/* Progress bar */}
        <div className="alert-progress-bar">
          <div
            className="alert-progress-fill"
            style={{ background: theme.border }}
          />
        </div>

        {/* Close button */}
        <button className="alert-close-btn" onClick={handleClose}>
          Got it ✓
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useToast  (unchanged API — showMsg still works)
───────────────────────────────────────────────────────────── */
function useToast() {
  const [message, setMessage] = useState({ type: "", text: "" });
  const show = useCallback((type, text) => {
    setMessage({ type, text });
  }, []);
  const clear = useCallback(() => setMessage({ type: "", text: "" }), []);
  return { message, show, clear };
}

/* ─────────────────────────────────────────────────────────────
   TAB: APPLY LEAVE
───────────────────────────────────────────────────────────── */
function ApplyLeaveTab({ leaveTypes, onApplied, showMsg }) {
  const [form, setForm]       = useState({ leaveId: "", startDate: "", endDate: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const days         = calculateDays(form.startDate, form.endDate);
  const selectedType = leaveTypes.find((lt) => lt.leaveId == form.leaveId);
  const maxDays      = selectedType?.noOfDays || 0;
  const exceeds      = days > maxDays && maxDays > 0;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const clearForm = () =>
    setForm({ leaveId: "", startDate: "", endDate: "", reason: "" });

  const submit = async () => {
    const { leaveId, startDate, endDate, reason } = form;
    if (!leaveId || !startDate || !endDate || !reason.trim()) {
      showMsg("error", "Please fill all required fields"); return;
    }
    const start = new Date(startDate), end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) { showMsg("error", "Invalid date format"); return; }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (start < today) { showMsg("error", "Start date cannot be in the past"); return; }
    if (start > end)   { showMsg("error", "End date must be after start date"); return; }
    if (exceeds)       { showMsg("error", `Maximum ${maxDays} days allowed for this leave type`); return; }

    setLoading(true);
    try {
      await api.post("/leave-record/applyLeave", {
        leaveId,
        startDate: convertToDateArray(startDate),
        endDate:   convertToDateArray(endDate),
        reason:    reason.trim(),
      });
      showMsg("success", "Leave application submitted successfully!");
      clearForm();
      onApplied();
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Failed to apply leave");
    } finally { setLoading(false); }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>Apply for Leave</h2>
          <p className="section-subtitle">Submit a new leave request with required details</p>
        </div>
      </div>
      <div className="form-container">
        <div className="form-group">
          <label className="form-label">Leave Type <span className="required">*</span></label>
          <select name="leaveId" value={form.leaveId} onChange={handleChange}
            className="form-select" disabled={loading}>
            <option value="">Select Leave Type</option>
            {leaveTypes.map((l) => (
              <option key={l.leaveId} value={l.leaveId}>
                {l.leaveName} (Max: {l.noOfDays} days)
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date <span className="required">*</span></label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
              className="form-input" disabled={loading} min={TODAY} />
          </div>
          <div className="form-group">
            <label className="form-label">End Date <span className="required">*</span></label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
              className="form-input" disabled={loading} min={form.startDate || TODAY} />
          </div>
          <div className="form-group">
            <label className="form-label">Total Days</label>
            <div className={`days-display ${exceeds ? "days-display-warning" : ""}`}>
              <span className="days-count">{days}</span>
              <span className="days-text">
                day{days !== 1 ? "s" : ""}
                {exceeds && (
                  <span style={{ display: "block", fontSize: 12, color: "var(--danger)", marginTop: 4, fontWeight: 500 }}>
                    Exceeds limit by {days - maxDays} days
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reason <span className="required">*</span></label>
          <textarea name="reason" value={form.reason} onChange={handleChange}
            className="form-textarea" rows={4} disabled={loading}
            placeholder="Please provide a detailed reason for your leave..." />
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={clearForm} disabled={loading}>Clear Form</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading || exceeds}>
            {loading ? "Submitting..." : "Apply Leave"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: MY LEAVES (UPDATED - removed # from Leave ID)
───────────────────────────────────────────────────────────── */
function MyLeavesTab({ myLeaves, leaveTypes, onRefresh, loading }) {
  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>My Leave History</h2>
          <p className="section-subtitle">Track your leave applications and status</p>
        </div>
        <div className="section-actions">
          <button className="btn-refresh-small" onClick={onRefresh} disabled={loading}>↻ Refresh</button>
        </div>
      </div>

      {myLeaves.length === 0 ? (
        <EmptyState icon="📋" title="No Leave Applications" desc="You haven't applied for any leaves yet" />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Leave ID</th>
                <th>Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.map((leave) => {
                const days      = leave.noOfDays ?? calculateDays(leave.startDate, leave.endDate);
                const leaveName = resolveLeaveName(leave, leaveTypes);
                // use recId OR any available unique key - REMOVED THE # SYMBOL
                return (
                  <tr key={leave.recId}>
                    <td className="text-center">{leave.recId}</td>
                    <td>{leaveName}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td className="text-center">{days > 0 ? `${days} days` : "-"}</td>
                    <td><StatusBadge status={leave.status} /></td>
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

/* ─────────────────────────────────────────────────────────────
   TAB: TEAM LEAVES  (celebration fires here on approve)
───────────────────────────────────────────────────────────── */
function TeamLeavesTab({ teamLeaves, leaveTypes, onRefresh, loading, showMsg, onActionDone, onApproveSuccess }) {
  const [rejectModal,  setRejectModal]  = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actioning,    setActioning]    = useState(false);
  const [flashRow,     setFlashRow]     = useState(null);

  const approve = async (recId, status, employeeName) => {
    if (!isPendingStatus(status)) {
      showMsg("error", "Only pending leaves can be approved"); return;
    }
    if (!window.confirm("Are you sure you want to approve this leave request?")) return;
    setActioning(true);
    try {
      await api.put(`/leave-record/approve/${recId}`, {});

      // Flash the row
      setFlashRow(recId);
      setTimeout(() => setFlashRow(null), 1600);

      // 🎉 Trigger celebration
      onApproveSuccess(employeeName);

      showMsg("success", "Leave approved successfully!");
      onActionDone();
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Failed to approve leave");
    } finally { setActioning(false); }
  };

  const openReject = (leave) => { setRejectModal(leave); setRejectReason(""); };

  const confirmReject = async () => {
    if (!rejectModal || !isPendingStatus(rejectModal.status)) {
      showMsg("error", "Only pending leaves can be rejected"); return;
    }
    if (!rejectReason.trim()) {
      showMsg("error", "Please enter a reason for rejection"); return;
    }
    setActioning(true);
    try {
      await api.put(`/leave-record/reject/${rejectModal.recId}`, { reason: rejectReason.trim() });
      showMsg("success", "Leave rejected successfully!");
      setRejectModal(null);
      onActionDone();
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Failed to reject leave");
    } finally { setActioning(false); }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>Team Leave Requests</h2>
          <p className="section-subtitle">Review and manage leave requests from your team</p>
        </div>
        <div className="section-actions">
          <button className="btn-refresh-small" onClick={onRefresh} disabled={loading}>↻ Refresh</button>
        </div>
      </div>

      {teamLeaves.length === 0 ? (
        <EmptyState icon="👥" title="No Team Requests" desc="There are no pending leave requests from your team" />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamLeaves.map((leave) => {
                const days      = leave.noOfDays ?? calculateDays(leave.startDate, leave.endDate);
                const leaveName = resolveLeaveName(leave, leaveTypes);
                const empName   = resolveEmployeeName(leave);
                const empId     = resolveEmployeeId(leave);
                const pending   = isPendingStatus(leave.status);
                const approved  = isApprovedStatus(leave.status);
                const avatarChar = empName?.charAt(0)?.toUpperCase() || "E";
                return (
                  <tr
                    key={leave.recId}
                    className={flashRow === leave.recId ? "row-approved-flash" : ""}
                  >
                    <td>
                      <div className="employee-info">
                        <div className="employee-avatar">{avatarChar}</div>
                        <div className="employee-details">
                          <div className="employee-name">{empName || "—"}</div>
                          {empId && <div className="employee-id">ID: {empId}</div>}
                        </div>
                      </div>
                    </td>
                    <td>{leaveName !== "-" ? leaveName : <span style={{color:"var(--gray-400)",fontStyle:"italic"}}>N/A</span>}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td className="text-center">{days > 0 ? `${days} days` : "-"}</td>
                    <td><StatusBadge status={leave.status} /></td>
                    <td>
                      {pending ? (
                        <div className="action-buttons">
                          <button className="btn-action approve"
                            onClick={() => approve(leave.recId, leave.status, empName)}
                            disabled={loading || actioning}>Approve</button>
                          <button className="btn-action reject"
                            onClick={() => openReject(leave)}
                            disabled={loading || actioning}>Reject</button>
                        </div>
                      ) : (
                        <span className="action-text">
                          {approved ? "✔ Approved" : "❌ Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reject Leave Request</h3>
              <button className="modal-close" onClick={() => setRejectModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="leave-details">
                <div className="detail-row">
                  <span className="detail-label">Employee:</span>
                  <span className="detail-value">{resolveEmployeeName(rejectModal) || "—"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Leave Type:</span>
                  <span className="detail-value">{resolveLeaveName(rejectModal, leaveTypes)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Dates:</span>
                  <span className="detail-value">
                    {formatDate(rejectModal.startDate)} to {formatDate(rejectModal.endDate)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">
                    {(rejectModal.noOfDays ?? calculateDays(rejectModal.startDate, rejectModal.endDate))} days
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Reason for Rejection <span className="required">*</span>
                </label>
                <textarea value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="form-textarea" rows={4}
                  placeholder="Please provide a reason for rejecting this leave request..." />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setRejectModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmReject}
                disabled={!rejectReason.trim() || actioning}>
                {actioning ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function EmpLeaveManagement() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [myLeaves,   setMyLeaves]   = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [activeTab,  setActiveTab]  = useState("apply");

  // 🎉 Celebration state
  const [celebrationActive,   setCelebrationActive]   = useState(false);
  const [celebrationEmployee, setCelebrationEmployee] = useState("");
  const celebrationTimer = useRef(null);

  const triggerCelebration = useCallback((employeeName) => {
    // Reset if already running so animation restarts cleanly
    setCelebrationActive(false);
    if (celebrationTimer.current) clearTimeout(celebrationTimer.current);

    // Small tick to allow React to re-render the reset
    setTimeout(() => {
      setCelebrationEmployee(employeeName || "");
      setCelebrationActive(true);
      celebrationTimer.current = setTimeout(() => {
        setCelebrationActive(false);
      }, 4800);
    }, 50);
  }, []);

  const { message, show: showMsg, clear: clearMsg } = useToast();

  const loadLeaveTypes = useCallback(async () => {
    try {
      const res  = await api.get("/leave-master/all");
      const data = Array.isArray(res.data) ? res.data : [];
      // DEBUG: log raw leave types so we can see actual field names
      if (data.length > 0) console.log("[LeaveTypes] sample:", JSON.stringify(data[0]));
      setLeaveTypes(data.filter((l) => l.leaveName !== "LOP"));
    } catch (err) { console.error("Error loading leave types:", err); }
  }, []);

  const loadMyLeaves = useCallback(async () => {
    try {
      const res  = await api.get("/leave-record/myLeaves");
      const data = Array.isArray(res.data) ? res.data : [];
      if (data.length > 0) console.log("[MyLeaves] sample:", JSON.stringify(data[0]));
      setMyLeaves(data);
    } catch (err) { console.error("Error loading my leaves:", err); }
  }, []);

  const loadTeamLeaves = useCallback(async () => {
    try {
      const res  = await api.get("/leave-record/teamLeaves");
      const data = Array.isArray(res.data) ? res.data : [];
      // DEBUG: log raw team leave so we can see actual field names from API
      if (data.length > 0) console.log("[TeamLeaves] sample:", JSON.stringify(data[0]));
      setTeamLeaves(data);
    } catch (err) { console.error("Error loading team leaves:", err); }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadLeaveTypes(), loadMyLeaves(), loadTeamLeaves()]);
    } catch { showMsg("error", "Failed to load data"); }
    finally  { setLoading(false); }
  }, [loadLeaveTypes, loadMyLeaves, loadTeamLeaves, showMsg]);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  const TABS = [
    { key: "apply", icon: "✦",  label: "Apply Leave"  },
    { key: "my",    icon: "📋", label: "My Leaves"    },
    { key: "team",  icon: "👥", label: "Team Leaves"  },
  ];

  return (
    <>
      <AnimatedBackground />

      {/* 🎉 Global celebration overlay — renders above everything */}
      <CelebrationOverlay
        active={celebrationActive}
        employeeName={celebrationEmployee}
      />

      <div className="leave-management-container">

        {/* ── Hero Banner ─────────────────────────────── */}
        <div className="hero-banner">
          {/* Decorative star sparkles */}
          <div className="hero-star hero-star-1">✦</div>
          <div className="hero-star hero-star-2">✦</div>
          <div className="hero-star hero-star-3">+</div>
          <div className="hero-star hero-star-4">✦</div>

          {/* Left: text */}
          <div className="hero-text-side">
            <h1 className="hero-title">Leave Management</h1>
            <p className="hero-sub">Manage your leave applications and team approvals</p>
            <button className="refresh-btn hero-refresh" onClick={loadAllData} disabled={loading}>
              <span className="refresh-icon">↻</span>
              Refresh
            </button>
          </div>

          {/* Right: floating cartoon scene */}
          <div className="hero-scene" aria-hidden="true">

            {/* Manager node at top */}
            <div className="hero-node hero-node-manager">
              <div className="hero-node-ring" />
              <span className="hero-node-emoji">😎</span>
            </div>

            {/* SVG dashed connector lines */}
            <svg className="hero-lines" viewBox="0 0 260 160" fill="none">
              {/* manager → left reportee */}
              <line x1="130" y1="44" x2="60"  y2="100" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeDasharray="5 4"/>
              {/* manager → right reportee */}
              <line x1="130" y1="44" x2="200" y2="100" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeDasharray="5 4"/>
              {/* left → sub-left */}
              <line x1="60"  y1="104" x2="30"  y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeDasharray="4 4"/>
              {/* left → sub-mid */}
              <line x1="60"  y1="104" x2="90"  y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeDasharray="4 4"/>
              {/* right → sub-right1 */}
              <line x1="200" y1="104" x2="170" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeDasharray="4 4"/>
              {/* right → sub-right2 */}
              <line x1="200" y1="104" x2="230" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeDasharray="4 4"/>
            </svg>

            {/* Mid-level nodes */}
            <div className="hero-node hero-node-mid hero-node-mid-left">
              <div className="hero-node-ring" />
              <span className="hero-node-emoji">🙂</span>
            </div>
            <div className="hero-node hero-node-mid hero-node-mid-right">
              <div className="hero-node-ring" />
              <span className="hero-node-emoji">😊</span>
            </div>

            {/* Bottom leaf nodes */}
            <div className="hero-node hero-node-leaf hero-leaf-1">
              <div className="hero-node-ring hero-node-ring-sm" />
              <span className="hero-node-emoji" style={{fontSize:"18px"}}>😴</span>
            </div>
            <div className="hero-node hero-node-leaf hero-leaf-2">
              <div className="hero-node-ring hero-node-ring-sm" />
              <span className="hero-node-emoji" style={{fontSize:"18px"}}>🏖️</span>
            </div>
            <div className="hero-node hero-node-leaf hero-leaf-3">
              <div className="hero-node-ring hero-node-ring-sm" />
              <span className="hero-node-emoji" style={{fontSize:"18px"}}>🌴</span>
            </div>
            <div className="hero-node hero-node-leaf hero-leaf-4">
              <div className="hero-node-ring hero-node-ring-sm" />
              <span className="hero-node-emoji" style={{fontSize:"18px"}}>✈️</span>
            </div>

            {/* Floating lone sparkle emojis */}
            <div className="hero-float hero-float-1">💤</div>
            <div className="hero-float hero-float-2">🌟</div>
            <div className="hero-float hero-float-3">☀️</div>
          </div>
        </div>

        <AnimatedAlertModal message={message} onClose={clearMsg} />

        <div className="tab-navigation">
          {TABS.map((t) => (
            <button key={t.key}
              className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}>
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {loading && activeTab === "apply" && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <p>Loading...</p>
          </div>
        )}

        <div className="content-wrapper">
          {activeTab === "apply" && (
            <ApplyLeaveTab leaveTypes={leaveTypes} onApplied={loadMyLeaves} showMsg={showMsg} />
          )}
          {activeTab === "my" && (
            <MyLeavesTab
              myLeaves={myLeaves} leaveTypes={leaveTypes}
              onRefresh={loadMyLeaves} loading={loading} />
          )}
          {activeTab === "team" && (
            <TeamLeavesTab
              teamLeaves={teamLeaves}
              leaveTypes={leaveTypes}
              onRefresh={loadTeamLeaves}
              loading={loading}
              showMsg={showMsg}
              onApproveSuccess={triggerCelebration}
              onActionDone={() => { loadTeamLeaves(); loadMyLeaves(); }} />
          )}
        </div>
      </div>
    </>
  );
}