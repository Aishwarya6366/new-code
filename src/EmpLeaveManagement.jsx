import React, { useState, useEffect, useCallback } from "react";
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
  const nameFields = ["leaveName","leave_name","leaveType","leave_type","leaveTypeName","type","typeName","name"];
  for (const f of nameFields) {
    if (leave[f] && String(leave[f]).trim() !== "") return leave[f];
  }
  const idFields = ["leaveId","leave_id","leaveTypeId","leavemaster_id","masterLeaveId","leaveCode"];
  for (const f of idFields) {
    if (leave[f] != null) {
      const m = leaveTypes.find((lt) =>
        String(lt.leaveId ?? lt.id ?? lt.leave_id ?? "") === String(leave[f])
      );
      if (m?.leaveName || m?.name) return m.leaveName || m.name;
    }
  }
  if (leave.noOfDays != null && leaveTypes.length > 0) {
    const m = leaveTypes.find((lt) => lt.noOfDays === leave.noOfDays);
    if (m?.leaveName) return m.leaveName;
  }
  return "-";
};

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
   SVG ICONS
───────────────────────────────────────────────────────────── */
const IcoCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoX       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoAlert   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IcoRefresh = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IcoSend    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IcoList    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IcoUsers   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoApply   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>;

/* ─────────────────────────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`elv-toast elv-toast-${type}`}>
      <span className={`elv-toast-icon elv-toast-icon-${type}`}>
        {type === "success" ? <IcoCheck /> : <IcoAlert />}
      </span>
      <span className="elv-toast-msg">{message}</span>
      <button className="elv-toast-x" onClick={onClose}><IcoX /></button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONFIRM MODAL
───────────────────────────────────────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="elv-overlay" onClick={onCancel}>
      <div className="elv-modal" onClick={e => e.stopPropagation()}>
        <div className="elv-modal-icon elv-modal-icon-warn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 className="elv-modal-title">Confirm Action</h3>
        <p className="elv-modal-msg">{message}</p>
        <div className="elv-modal-btns">
          <button className="elv-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="elv-modal-confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const { text, cls } = statusInfo(status);
  return <span className={`status-badge ${cls}`}>{text}</span>;
}

/* ─────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────── */
function EmptyState({ title, desc }) {
  return (
    <div className="elv-empty">
      <div className="elv-empty-icon">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <h3 className="elv-empty-title">{title}</h3>
      <p className="elv-empty-sub">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOAST HOOK
───────────────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((type, text) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, text }]);
  }, []);
  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return { toasts, show, remove };
}

/* ─────────────────────────────────────────────────────────────
   TAB: APPLY LEAVE
───────────────────────────────────────────────────────────── */
function ApplyLeaveTab({ leaveTypes, onApplied, showMsg }) {
  const [form,    setForm]    = useState({ leaveId: "", startDate: "", endDate: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const days         = calculateDays(form.startDate, form.endDate);
  const selectedType = leaveTypes.find((lt) => lt.leaveId == form.leaveId);
  const maxDays      = selectedType?.noOfDays || 0;
  const exceeds      = days > maxDays && maxDays > 0;

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const clearForm    = () => setForm({ leaveId: "", startDate: "", endDate: "", reason: "" });

  const submit = async () => {
    const { leaveId, startDate, endDate, reason } = form;
    if (!leaveId || !startDate || !endDate || !reason.trim()) { showMsg("error", "Please fill all required fields"); return; }
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
      showMsg("success", "Leave application submitted successfully.");
      clearForm();
      onApplied();
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Failed to apply leave.");
    } finally { setLoading(false); }
  };

  return (
    <div className="elv-section">
      <div className="elv-section-hd">
        <div>
          <h2 className="elv-section-title">Apply for Leave</h2>
          <p className="elv-section-sub">Submit a new leave request with required details</p>
        </div>
      </div>

      <div className="elv-form">
        {/* Leave Type — full width */}
        <div className="elv-form-grid-1">
          <div className="elv-field">
            <label className="elv-label">Leave Type <span className="elv-req">*</span></label>
            <select name="leaveId" value={form.leaveId} onChange={handleChange} className="elv-input" disabled={loading}>
              <option value="">— Select Leave Type —</option>
              {leaveTypes.map((l) => (
                <option key={l.leaveId} value={l.leaveId}>{l.leaveName} (Max: {l.noOfDays} days)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Date | End Date | Total Days */}
        <div className="elv-form-grid-3">
          <div className="elv-field">
            <label className="elv-label">Start Date <span className="elv-req">*</span></label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
              className="elv-input" disabled={loading} min={TODAY} />
          </div>
          <div className="elv-field">
            <label className="elv-label">End Date <span className="elv-req">*</span></label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
              className="elv-input" disabled={loading} min={form.startDate || TODAY} />
          </div>
          <div className="elv-field">
            <label className="elv-label">Total Days</label>
            <div className={`elv-days-box${exceeds ? " elv-days-warn" : ""}`}>
              <span className="elv-days-num">{days}</span>
              <span className="elv-days-lbl">
                day{days !== 1 ? "s" : ""}
                {exceeds && <span className="elv-days-err">Exceeds limit by {days - maxDays}</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Reason — full width */}
        <div className="elv-form-grid-1">
          <div className="elv-field">
            <label className="elv-label">Reason <span className="elv-req">*</span></label>
            <textarea name="reason" value={form.reason} onChange={handleChange}
              className="elv-input elv-textarea" rows={4} disabled={loading}
              placeholder="Provide a detailed reason for your leave request…" />
          </div>
        </div>

        <div className="elv-form-actions">
          <button className="elv-btn-secondary" onClick={clearForm} disabled={loading}>Clear</button>
          <button className="elv-btn-primary" onClick={submit} disabled={loading || exceeds}>
            <IcoSend />
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: MY LEAVES
───────────────────────────────────────────────────────────── */
function MyLeavesTab({ myLeaves, leaveTypes, onRefresh, loading }) {
  return (
    <div className="elv-section">
      <div className="elv-section-hd">
        <div>
          <h2 className="elv-section-title">My Leave History</h2>
          <p className="elv-section-sub">Track your leave applications and their status</p>
        </div>
        <button className="elv-btn-refresh" onClick={onRefresh} disabled={loading}>
          <IcoRefresh /> Refresh
        </button>
      </div>

      {myLeaves.length === 0 ? (
        <EmptyState title="No Leave Applications" desc="You have not applied for any leaves yet." />
      ) : (
        <div className="elv-tscroll">
          <table className="elv-table">
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
                return (
                  <tr key={leave.recId} className="elv-tr">
                    <td><span className="elv-id">{leave.recId}</span></td>
                    <td>{leaveName}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>{days > 0 ? `${days} day${days !== 1 ? "s" : ""}` : "—"}</td>
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
   TAB: TEAM LEAVES
───────────────────────────────────────────────────────────── */
function TeamLeavesTab({ teamLeaves, leaveTypes, onRefresh, loading, showMsg, onActionDone }) {
  const [rejectModal,  setRejectModal]  = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actioning,    setActioning]    = useState(false);
  const [confirmData,  setConfirmData]  = useState(null);
  const [flashRow,     setFlashRow]     = useState(null);

  const approve = (recId, status, employeeName) => {
    if (!isPendingStatus(status)) { showMsg("error", "Only pending leaves can be approved"); return; }
    setConfirmData({
      message: `Approve leave request for ${employeeName || "this employee"}?`,
      onConfirm: async () => {
        setConfirmData(null);
        setActioning(true);
        try {
          await api.put(`/leave-record/approve/${recId}`, {});
          setFlashRow(recId);
          setTimeout(() => setFlashRow(null), 1600);
          showMsg("success", "Leave approved successfully.");
          onActionDone();
        } catch (err) {
          showMsg("error", err.response?.data?.message || "Failed to approve leave.");
        } finally { setActioning(false); }
      },
    });
  };

  const openReject = (leave) => { setRejectModal(leave); setRejectReason(""); };

  const confirmReject = async () => {
    if (!rejectModal || !isPendingStatus(rejectModal.status)) { showMsg("error", "Only pending leaves can be rejected"); return; }
    if (!rejectReason.trim()) { showMsg("error", "Please enter a reason for rejection"); return; }
    setActioning(true);
    try {
      await api.put(`/leave-record/reject/${rejectModal.recId}`, { reason: rejectReason.trim() });
      showMsg("success", "Leave rejected successfully.");
      setRejectModal(null);
      onActionDone();
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Failed to reject leave.");
    } finally { setActioning(false); }
  };

  return (
    <div className="elv-section">
      {confirmData && (
        <ConfirmModal
          message={confirmData.message}
          onConfirm={confirmData.onConfirm}
          onCancel={() => setConfirmData(null)}
        />
      )}

      <div className="elv-section-hd">
        <div>
          <h2 className="elv-section-title">Team Leave Requests</h2>
          <p className="elv-section-sub">Review and manage leave requests from your team</p>
        </div>
        <button className="elv-btn-refresh" onClick={onRefresh} disabled={loading}>
          <IcoRefresh /> Refresh
        </button>
      </div>

      {teamLeaves.length === 0 ? (
        <EmptyState title="No Team Requests" desc="There are no leave requests from your team." />
      ) : (
        <div className="elv-tscroll">
          <table className="elv-table">
            <thead>
              <tr>
                <th>Employee</th>
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
                const days     = leave.noOfDays ?? calculateDays(leave.startDate, leave.endDate);
                const leaveName = resolveLeaveName(leave, leaveTypes);
                const empName  = resolveEmployeeName(leave);
                const empId    = resolveEmployeeId(leave);
                const pending  = isPendingStatus(leave.status);
                const approved = isApprovedStatus(leave.status);
                const initials = empName?.charAt(0)?.toUpperCase() || "E";
                return (
                  <tr key={leave.recId} className={`elv-tr${flashRow === leave.recId ? " elv-tr-flash" : ""}`}>
                    <td>
                      <div className="elv-emp">
                        <div className="elv-avatar">{initials}</div>
                        <div>
                          <div className="elv-emp-name">{empName || "—"}</div>
                          {empId && <div className="elv-emp-id">{empId}</div>}
                        </div>
                      </div>
                    </td>
                    <td>{leaveName !== "-" ? leaveName : <span className="elv-na">N/A</span>}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>{days > 0 ? `${days} day${days !== 1 ? "s" : ""}` : "—"}</td>
                    <td><StatusBadge status={leave.status} /></td>
                    <td>
                      {pending ? (
                        <div className="elv-act-btns">
                          <button className="elv-approve-btn"
                            onClick={() => approve(leave.recId, leave.status, empName)}
                            disabled={loading || actioning}>
                            <IcoCheck /> Approve
                          </button>
                          <button className="elv-reject-btn"
                            onClick={() => openReject(leave)}
                            disabled={loading || actioning}>
                            <IcoX /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`elv-action-done ${approved ? "elv-done-ok" : "elv-done-no"}`}>
                          {approved ? "Approved" : "Rejected"}
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
        <div className="elv-overlay" onClick={() => setRejectModal(null)}>
          <div className="elv-modal elv-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="elv-modal-hd">
              <h3 className="elv-modal-title">Reject Leave Request</h3>
              <button className="elv-modal-close" onClick={() => setRejectModal(null)}><IcoX /></button>
            </div>

            <div className="elv-detail-grid">
              <div className="elv-detail-row">
                <span className="elv-detail-lbl">Employee</span>
                <span className="elv-detail-val">{resolveEmployeeName(rejectModal) || "—"}</span>
              </div>
              <div className="elv-detail-row">
                <span className="elv-detail-lbl">Leave Type</span>
                <span className="elv-detail-val">{resolveLeaveName(rejectModal, leaveTypes)}</span>
              </div>
              <div className="elv-detail-row">
                <span className="elv-detail-lbl">Dates</span>
                <span className="elv-detail-val">
                  {formatDate(rejectModal.startDate)} — {formatDate(rejectModal.endDate)}
                </span>
              </div>
              <div className="elv-detail-row">
                <span className="elv-detail-lbl">Duration</span>
                <span className="elv-detail-val">
                  {rejectModal.noOfDays ?? calculateDays(rejectModal.startDate, rejectModal.endDate)} days
                </span>
              </div>
            </div>

            <div className="elv-field" style={{ marginTop: 16 }}>
              <label className="elv-label">
                Reason for Rejection <span className="elv-req">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="elv-input elv-textarea"
                rows={4}
                placeholder="Please provide a clear reason for rejecting this request…"
              />
            </div>

            <div className="elv-modal-btns">
              <button className="elv-modal-cancel" onClick={() => setRejectModal(null)}>Cancel</button>
              <button className="elv-modal-danger" onClick={confirmReject}
                disabled={!rejectReason.trim() || actioning}>
                {actioning ? "Rejecting…" : "Confirm Rejection"}
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

  const { toasts, show: showMsg, remove: removeToast } = useToast();

  const loadLeaveTypes = useCallback(async () => {
    try {
      const res  = await api.get("/leave-master/all");
      const data = Array.isArray(res.data) ? res.data : [];
      setLeaveTypes(data.filter((l) => l.leaveName !== "LOP"));
    } catch (err) { console.error("Error loading leave types:", err); }
  }, []);

  const loadMyLeaves = useCallback(async () => {
    try {
      const res  = await api.get("/leave-record/myLeaves");
      setMyLeaves(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Error loading my leaves:", err); }
  }, []);

  const loadTeamLeaves = useCallback(async () => {
    try {
      const res  = await api.get("/leave-record/teamLeaves");
      setTeamLeaves(Array.isArray(res.data) ? res.data : []);
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
    { key: "apply", label: "Apply Leave",  Icon: IcoApply  },
    { key: "my",    label: "My Leaves",    Icon: IcoList   },
    { key: "team",  label: "Team Leaves",  Icon: IcoUsers  },
  ];

  return (
    <div className="elv-wrap">

      {/* ── Toast stack ── */}
      <div className="elv-toast-stack">
        {toasts.map((t, i) => (
          <Toast key={t.id} message={t.text} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {/* ── Hero Banner ── */}
      <div className="elv-hero">
        <div className="elv-hero-inner">
          
          <h1 className="elv-hero-title">Leave Management</h1>
          <p className="elv-hero-sub">Apply for leave, track history and manage team approvals</p>
          <div className="elv-hero-stats">
            <div className="elv-stat">
              <span className="elv-sn">{myLeaves.length}</span>
              <span className="elv-sl">My Applications</span>
            </div>
            <div className="elv-ssep"/>
            <div className="elv-stat">
              <span className="elv-sn">{teamLeaves.filter(l => isPendingStatus(l.status)).length}</span>
              <span className="elv-sl">Pending Approvals</span>
            </div>
            <div className="elv-ssep"/>
            <div className="elv-stat">
              <span className="elv-sn">{leaveTypes.length}</span>
              <span className="elv-sl">Leave Types</span>
            </div>
          </div>
        </div>
      </div>

      <div className="elv-content">

        {/* ── Tabs ── */}
        <div className="elv-tabs">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`elv-tab${activeTab === key ? " elv-tab-on" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon /> {label}
            </button>
          ))}
          <button className="elv-tab-refresh" onClick={loadAllData} disabled={loading}>
            <IcoRefresh />
          </button>
        </div>

        {/* ── Loading bar ── */}
        {loading && <div className="elv-loading-bar"><div className="elv-loading-fill"/></div>}

        {/* ── Tab content ── */}
        {activeTab === "apply" && (
          <ApplyLeaveTab leaveTypes={leaveTypes} onApplied={loadMyLeaves} showMsg={showMsg} />
        )}
        {activeTab === "my" && (
          <MyLeavesTab myLeaves={myLeaves} leaveTypes={leaveTypes} onRefresh={loadMyLeaves} loading={loading} />
        )}
        {activeTab === "team" && (
          <TeamLeavesTab
            teamLeaves={teamLeaves}
            leaveTypes={leaveTypes}
            onRefresh={loadTeamLeaves}
            loading={loading}
            showMsg={showMsg}
            onActionDone={() => { loadTeamLeaves(); loadMyLeaves(); }}
          />
        )}
      </div>
    </div>
  );
}
