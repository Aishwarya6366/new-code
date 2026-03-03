import api from "./api";
import { useEffect, useState } from "react";
import axios from "axios";
import "./HolidayCalendar.css";

/* ═══════════════════════════════════════════════
   CONFIRM MODAL
═══════════════════════════════════════════════ */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="cm-overlay" onClick={onCancel}>
      <div className="cm-box" onClick={e => e.stopPropagation()}>
        <div className="cm-icon-wrap cm-icon-warn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 className="cm-title">Confirm Delete</h3>
        <p className="cm-msg">{message}</p>
        <div className="cm-btns">
          <button className="cm-cancel" onClick={onCancel}>Cancel</button>
          <button className="cm-confirm" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ALERT MODAL
═══════════════════════════════════════════════ */
function AlertModal({ message, onClose }) {
  const isSuccess = String(message).includes("✅") || String(message).toLowerCase().includes("success");
  const isError   = String(message).toLowerCase().includes("error");
  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-box cm-alert" onClick={e => e.stopPropagation()}>
        <div className={`cm-icon-wrap ${isSuccess ? "cm-icon-ok" : isError ? "cm-icon-err" : "cm-icon-info"}`}>
          {isSuccess ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : isError ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          )}
        </div>
        <h3 className="cm-title">{isSuccess ? "Success" : isError ? "Error" : "Notice"}</h3>
        <p className="cm-msg">
          {String(message).replace("✅","").replace("⚠️","").replace("ℹ️","").trim()}
        </p>
        <div className="cm-btns">
          <button className="cm-confirm" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function HolidayCalendar() {
  const [types,        setTypes]        = useState([]);
  const [locations,    setLocations]    = useState([]);
  const [holidays,     setHolidays]     = useState([]);
  const [editingId,    setEditingId]    = useState(null);
  const [isEditing,    setIsEditing]    = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [alertModal,   setAlertModal]   = useState(null);

  const showAlert   = (msg)     => setAlertModal(msg);
  const showConfirm = (msg, cb) => setConfirmModal({ message: msg, onConfirm: cb });

  const [newType,     setNewType]     = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [form, setForm] = useState({
    holidayName: "", holidayDate: "", holidayTypeId: "", holidayLocationId: ""
  });

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    try {
      const typeRes    = await axios.get("/api/hr/holidaymaster",  { withCredentials: true });
      const locRes     = await axios.get("/api/hr/holidaylocation", { withCredentials: true });
      const holidayRes = await api.get("/hr/holiday");
      setTypes(typeRes.data || []);
      setLocations(locRes.data || []);
      setHolidays(Array.isArray(holidayRes.data) ? holidayRes.data : []);
    } catch (err) { console.error("Data load error:", err); }
  };

  const addNewType = async () => {
    if (!newType.trim()) return;
    try {
      const res = await axios.post("/api/hr/holidaymaster", { holidayType: newType }, { withCredentials: true });
      if (res.data?.htId) setForm(f => ({ ...f, holidayTypeId: res.data.htId.toString() }));
      setNewType(""); loadAllData();
    } catch (err) { console.error(err); }
  };

  const addNewLocation = async () => {
    if (!newLocation.trim()) return;
    try {
      const res = await axios.post("/api/hr/holidaylocation", { locationName: newLocation }, { withCredentials: true });
      if (res.data?.hlId) setForm(f => ({ ...f, holidayLocationId: res.data.hlId.toString() }));
      setNewLocation(""); loadAllData();
    } catch (err) { console.error(err); }
  };

  const saveHoliday = async () => {
    if (!form.holidayName || !form.holidayDate)         { showAlert("Please enter holiday name and date.");      return; }
    if (!form.holidayTypeId || !form.holidayLocationId) { showAlert("Please select a holiday type and location."); return; }
    try {
      if (isEditing && editingId) {
        await axios.put(`/api/hr/holiday/${editingId}`, {
          holidayName:       form.holidayName,
          holidayDate:       form.holidayDate,
          holidayTypeId:     Number(form.holidayTypeId),
          holidayLocationId: Number(form.holidayLocationId),
        }, { withCredentials: true });
        showAlert("✅ Holiday updated successfully.");
      } else {
        await axios.post("/api/hr/holiday", {
          holidayName:       form.holidayName,
          holidayDate:       form.holidayDate,
          holidayTypeId:     Number(form.holidayTypeId),
          holidayLocationId: Number(form.holidayLocationId),
        }, { withCredentials: true });
        showAlert("✅ Holiday added successfully.");
      }
      resetForm(); loadAllData();
    } catch (err) { console.error(err); showAlert("Error saving holiday. Please try again."); }
  };

  const editHoliday = (holiday) => {
    const hid = holiday.id || holiday.holidayId || holiday.hId;
    if (!hid) { showAlert("Cannot edit: Holiday ID not found."); return; }
    setForm({
      holidayName:       holiday.holidayName || "",
      holidayDate:       holiday.holidayDate || "",
      holidayTypeId:     holiday.holidayTypeId     ? holiday.holidayTypeId.toString()     : "",
      holidayLocationId: holiday.holidayLocationId ? holiday.holidayLocationId.toString() : "",
    });
    setEditingId(hid);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteHoliday = (holiday) => {
    const hid = holiday.id || holiday.holidayId || holiday.hId;
    if (!hid) { showAlert("Cannot delete: Holiday ID not found."); return; }
    showConfirm(`Delete "${holiday.holidayName || "this holiday"}"? This action cannot be undone.`, async () => {
      setConfirmModal(null);
      try {
        await axios.delete(`/api/hr/holiday/${hid}`, { withCredentials: true });
        showAlert("✅ Holiday deleted successfully.");
        loadAllData();
      } catch (err) { console.error(err); showAlert("Error deleting holiday."); }
    });
  };

  const resetForm = () => {
    setForm({ holidayName: "", holidayDate: "", holidayTypeId: "", holidayLocationId: "" });
    setEditingId(null);
    setIsEditing(false);
  };

  const getTypeName     = (id) => { const t = types.find(t => t.htId == id || t.id == id); return t ? (t.holidayType || t.type) : "—"; };
  const getLocationName = (id) => { const l = locations.find(l => l.hlId == id || l.id == id); return l ? (l.locationName || l.name) : "—"; };

  const parseDate = (str) => {
    if (!str) return null;
    const iso = String(str).match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (iso) { const d = new Date(+iso[1], +iso[2]-1, +iso[3]); return isNaN(d) ? null : d; }
    const dmy = String(str).match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmy) { const d = new Date(+dmy[3], +dmy[2]-1, +dmy[1]); return isNaN(d) ? null : d; }
    const d = new Date(str); return isNaN(d) ? null : d;
  };

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  return (
    <div className="hc-wrap">
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      {alertModal && (
        <AlertModal message={alertModal} onClose={() => setAlertModal(null)}/>
      )}

      {/* ══ HERO BANNER ══ */}
      <div className="hc-hero">
        <div className="hc-hero-inner">
          
          <h1 className="hc-hero-title">Holiday Calendar</h1>
          <p className="hc-hero-sub">Add, manage and schedule company holidays</p>
          <div className="hc-hero-stats">
            <div className="hc-stat">
              <span className="hc-sn">{holidays.length}</span>
              <span className="hc-sl">Total Holidays</span>
            </div>
            <div className="hc-ssep"/>
            <div className="hc-stat">
              <span className="hc-sn">{types.length}</span>
              <span className="hc-sl">Holiday Types</span>
            </div>
            <div className="hc-ssep"/>
            <div className="hc-stat">
              <span className="hc-sn">{locations.length}</span>
              <span className="hc-sl">Locations</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FORM CARD ══ */}
      <div className={`hc-card${isEditing ? " hc-card-edit" : ""}`}>
        <div className="hc-card-hd">
          <div className="hc-card-icon-wrap">
            {isEditing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
            )}
          </div>
          <div>
            <h2 className="hc-card-title">{isEditing ? "Edit Holiday" : "Add New Holiday"}</h2>
            <p className="hc-card-sub">Fill in all the details below</p>
          </div>
          {isEditing && <span className="hc-edit-badge">Editing Mode</span>}
        </div>

        {/* Row 1 — Name + Date */}
        <div className="hc-section-label">Basic Details</div>
        <div className="hc-form-grid">
          <div className="hc-field">
            <label className="hc-label">Holiday Name <span className="hc-req">*</span></label>
            <input
              className="hc-inp"
              type="text"
              placeholder="e.g. Republic Day"
              value={form.holidayName}
              onChange={e => setForm(f => ({ ...f, holidayName: e.target.value }))}
            />
          </div>
          <div className="hc-field">
            <label className="hc-label">Holiday Date <span className="hc-req">*</span></label>
            <input
              className="hc-inp"
              type="date"
              value={form.holidayDate}
              onChange={e => setForm(f => ({ ...f, holidayDate: e.target.value }))}
            />
          </div>
        </div>

        {/* Row 2 — Type select + add new */}
        <div className="hc-section-label">Holiday Type</div>
        <div className="hc-form-grid hc-form-grid-3">
          <div className="hc-field">
            <label className="hc-label">Select Type <span className="hc-req">*</span></label>
            <select
              className="hc-inp"
              value={form.holidayTypeId}
              onChange={e => setForm(f => ({ ...f, holidayTypeId: e.target.value }))}
            >
              <option value="">— Choose Type —</option>
              {types.map(t => (
                <option key={t.htId || t.id} value={t.htId || t.id}>{t.holidayType || t.type}</option>
              ))}
            </select>
          </div>
          <div className="hc-field">
            <label className="hc-label">Add New Type</label>
            <input
              className="hc-inp"
              placeholder="Type name…"
              value={newType}
              onChange={e => setNewType(e.target.value)}
              onKeyPress={e => e.key === "Enter" && addNewType()}
            />
          </div>
          <div className="hc-field hc-field-btn">
            <label className="hc-label">&nbsp;</label>
            <button className="hc-add-btn" onClick={addNewType}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Type
            </button>
          </div>
        </div>

        {/* Row 3 — Location select + add new */}
        <div className="hc-section-label">Location</div>
        <div className="hc-form-grid hc-form-grid-3">
          <div className="hc-field">
            <label className="hc-label">Select Location <span className="hc-req">*</span></label>
            <select
              className="hc-inp"
              value={form.holidayLocationId}
              onChange={e => setForm(f => ({ ...f, holidayLocationId: e.target.value }))}
            >
              <option value="">— Choose Location —</option>
              {locations.map(l => (
                <option key={l.hlId || l.id} value={l.hlId || l.id}>{l.locationName || l.name}</option>
              ))}
            </select>
          </div>
          <div className="hc-field">
            <label className="hc-label">Add New Location</label>
            <input
              className="hc-inp"
              placeholder="Location name…"
              value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              onKeyPress={e => e.key === "Enter" && addNewLocation()}
            />
          </div>
          <div className="hc-field hc-field-btn">
            <label className="hc-label">&nbsp;</label>
            <button className="hc-add-btn" onClick={addNewLocation}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Location
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="hc-act-row">
          <button className="hc-save-btn" onClick={saveHoliday}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {isEditing ? "Update Holiday" : "Save Holiday"}
          </button>
          {isEditing && (
            <button className="hc-cancel-btn" onClick={resetForm}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ══ HOLIDAY LIST ══ */}
      <div className="hc-list">
        <div className="hc-list-hd">
          <div className="hc-list-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h2 className="hc-list-title">Holiday List</h2>
            <p className="hc-list-sub">{holidays.length} holiday{holidays.length !== 1 ? "s" : ""} scheduled</p>
          </div>
        </div>

        {holidays.length === 0 ? (
          <div className="hc-empty">
            <div className="hc-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <p className="hc-empty-title">No holidays scheduled</p>
            <p className="hc-empty-sub">Add your first holiday using the form above</p>
          </div>
        ) : (
          <div className="hc-tscroll">
            <table className="hc-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Holiday Name</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h, idx) => {
                  const hid = h.id || h.holidayId || h.hId || idx;
                  const raw = h.holidayDate || h.date || "";
                  const d   = parseDate(raw);
                  const v   = !!d;
                  const isW = v && [0, 6].includes(d.getDay());
                  return (
                    <tr key={hid} className="hc-tr">
                      <td><span className="hc-num">{idx + 1}</span></td>
                      <td>
                        <div className="hc-name-cell">
                          <span className="hc-name-text">{h.holidayName || h.name || "—"}</span>
                          {isW && <span className="hc-weekend-tag">Weekend</span>}
                        </div>
                      </td>
                      <td>
                        {v ? (
                          <div className="hc-date-cell">
                            <span className="hc-date-day">{d.getDate()}</span>
                            <span className="hc-date-mon">{MONTHS[d.getMonth()]} {d.getFullYear()}</span>
                          </div>
                        ) : (
                          <span className="hc-raw">{raw || "—"}</span>
                        )}
                      </td>
                      <td>
                        <span className={`hc-day-tag${isW ? " hc-day-weekend" : ""}`}>
                          {v ? DAYS[d.getDay()] : "—"}
                        </span>
                      </td>
                      <td><span className="hc-type-tag">{getTypeName(h.holidayTypeId || h.typeId)}</span></td>
                      <td><span className="hc-loc-tag">{getLocationName(h.holidayLocationId || h.locationId)}</span></td>
                      <td>
                        <div className="hc-acts">
                          <button className="hc-edit-btn" onClick={() => editHoliday(h)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit
                          </button>
                         
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
