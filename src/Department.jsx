import { useState, useEffect } from "react";
import axios from "axios";

/* =====================================================
   GLOBAL STYLES
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
    @keyframes listItemIn {
      from { opacity:0; transform:translateX(-14px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes shimmerLine {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    .dept-page {
      font-family: 'Nunito', 'Segoe UI', sans-serif;
      min-height: 100vh;
      background: #ffffff;
      position: relative;
      overflow-x: hidden;
    }

    .dept-header { animation: headingIn 0.7s cubic-bezier(0.22,1,0.36,1) both; }
    .dept-card-1 { animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
    .dept-card-2 { animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.25s both; }

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

  /* ── Section icon (simple SVG, no animation) ── */
  const BuildingIcon = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="5" y="8" width="26" height="24" rx="3" fill="#fff7f0" stroke="#ff7a00" strokeWidth="1.5"/>
      <rect x="5" y="8" width="26" height="7" rx="3" fill="#ff7a00"/>
      <rect x="10" y="20" width="5" height="4" rx="1" fill="#ff9f43"/>
      <rect x="18" y="20" width="5" height="4" rx="1" fill="#ff9f43"/>
      <rect x="10" y="28" width="5" height="4" rx="1" fill="#ffb347"/>
      <rect x="18" y="28" width="5" height="4" rx="1" fill="#ffb347"/>
      <rect x="14" y="28" width="8" height="4" rx="1" fill="#ff7a00"/>
    </svg>
  );

  const BadgeIcon = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <polygon points="12,4 18,8 24,4 24,14 18,11 12,14" fill="#ff9f43"/>
      <circle cx="18" cy="24" r="10" fill="#fff7f0" stroke="#ff7a00" strokeWidth="1.5"/>
      <circle cx="18" cy="24" r="7" fill="#ff7a00"/>
      <polygon points="18,17 19.5,22 24,22 20.5,24.5 22,29 18,26.5 14,29 15.5,24.5 12,22 16.5,22" fill="#fff" opacity="0.95"/>
    </svg>
  );

  return (
    <div className="dept-page" style={styles.page}>
      <GlobalStyles />

      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "24px 20px 0" }}>
        {/* ── HEADER BANNER ── */}
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
        }}>Department &amp; Designation</h1>
        <p style={{
          margin: "6px 0 0",
          fontSize: "14px",
          color: "rgba(255,255,255,0.82)",
          fontWeight: "500",
          fontFamily: "'Nunito', sans-serif",
        }}>Manage and organise your company's hierarchy with ease</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.2)", color: "#fff",
            padding: "5px 14px", borderRadius: "20px",
            fontSize: "12px", fontWeight: "700",
            border: "1px solid rgba(255,255,255,0.3)",
            fontFamily: "'Nunito', sans-serif",
          }}>
            {departments.length} Departments
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.2)", color: "#fff",
            padding: "5px 14px", borderRadius: "20px",
            fontSize: "12px", fontWeight: "700",
            border: "1px solid rgba(255,255,255,0.3)",
            fontFamily: "'Nunito', sans-serif",
          }}>
            {designations.length} Designations
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div style={styles.gridContainer}>

        {/* ══ DEPARTMENTS CARD ══ */}
        <div className="dept-card-1" style={styles.card}>
          <div className="card-shimmer-line" />

          <div style={styles.illustrationArea}>
            <BuildingIcon />
            <div style={styles.illustrationText}>
              <div style={styles.illustrationTitle}>Departments</div>
              <div style={styles.illustrationSub}>Define your divisions</div>
            </div>
            <span style={styles.badge}>{departments.length} Total</span>
          </div>

          <div style={styles.cardDivider} />

          <div style={styles.inputGroup}>
            <div className="dept-input-wrap" style={styles.inputWrapper}>
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
              {loadingDept ? "Adding..." : "+ Add"}
            </button>
          </div>
          {deptError && <div style={styles.errorMsg}>⚠ {deptError}</div>}

          <div className="dept-filter-wrap" style={styles.filterWrapper}>
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
                <div style={styles.emptyIconWrap}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#fff3ea" stroke="#ff9f43" strokeWidth="1.5" strokeDasharray="5 3"/>
                    <rect x="12" y="14" width="24" height="20" rx="3" fill="none" stroke="#ff9f43" strokeWidth="1.5"/>
                    <rect x="17" y="22" width="5" height="4" rx="1" fill="#ffb347" opacity="0.5"/>
                    <rect x="26" y="22" width="5" height="4" rx="1" fill="#ffb347" opacity="0.5"/>
                  </svg>
                </div>
                <p style={{ margin: "8px 0 0", fontWeight: 700, color: "#b45309" }}>No departments yet</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#d97706" }}>Add your first one above</p>
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
            <BadgeIcon />
            <div style={styles.illustrationText}>
              <div style={styles.illustrationTitle}>Designations</div>
              <div style={styles.illustrationSub}>Define your roles &amp; titles</div>
            </div>
            <span style={styles.badge}>{designations.length} Total</span>
          </div>

          <div style={styles.cardDivider} />

          <div style={styles.inputGroup}>
            <div className="dept-input-wrap" style={styles.inputWrapper}>
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
              {loadingDesg ? "Adding..." : "+ Add"}
            </button>
          </div>
          {desgError && <div style={styles.errorMsg}>⚠ {desgError}</div>}

          <div className="dept-filter-wrap" style={styles.filterWrapper}>
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
                <div style={styles.emptyIconWrap}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#fff3ea" stroke="#ff9f43" strokeWidth="1.5" strokeDasharray="5 3"/>
                    <polygon points="16,8 24,13 32,8 32,20 24,16 16,20" fill="none" stroke="#ff9f43" strokeWidth="1.5" opacity="0.6"/>
                    <circle cx="24" cy="30" r="8" fill="none" stroke="#ff9f43" strokeWidth="1.5" opacity="0.5"/>
                  </svg>
                </div>
                <p style={{ margin: "8px 0 0", fontWeight: 700, color: "#b45309" }}>No designations yet</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#d97706" }}>Add your first one above</p>
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

    </div>
  );
}

/* ======================
   STYLES
   ====================== */
const styles = {
  page: {
    padding: 0,
    position: "relative",
    zIndex: 1,
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
    padding: "0 0 40px",
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
    gap: "14px",
    padding: "20px 22px 16px",
    background: "#ffffff",
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
  emptyIconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "4px",
    opacity: 0.7,
  },
};
