import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HrEmployeeManagement.css";

/* ─────────────────────────────────────────────────────────────
   FLOATING LABEL WRAPPERS
   label must come AFTER the input in DOM so CSS ~ selector works.
   has-value class is added via JS when value is non-empty.
───────────────────────────────────────────────────────────── */

/** Standard text / number / date input with floating label */
function FLInput({ label, required, error, hint, ...props }) {
  const hasVal = Boolean(props.value !== undefined ? props.value : "");
  return (
    <div className={`input-group${hasVal ? " has-value" : ""}${error ? " has-error" : ""}`}>
      <input
        className={`modern-input${error ? " input-has-error" : ""}`}
        placeholder=" "
        {...props}
      />
      <label>
        {label}{required && <span className="required"> *</span>}
      </label>
      {error  ? <small className="error">{error}</small>
              : hint ? <span className="helper-text">{hint}</span>
              : null}
    </div>
  );
}

/** Select with floating label */
function FLSelect({ label, required, error, children, value, onChange, disabled }) {
  const hasVal = Boolean(value);
  return (
    <div className={`input-group${hasVal ? " has-value" : ""}${error ? " has-error" : ""}`}>
      <select
        className={`modern-input${error ? " input-has-error" : ""}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {children}
      </select>
      <label>
        {label}{required && <span className="required"> *</span>}
      </label>
      {error && <small className="error">{error}</small>}
    </div>
  );
}

/** Textarea with floating label */
function FLTextarea({ label, required, error, rows = 3, value, onChange, disabled }) {
  const hasVal = Boolean(value);
  return (
    <div className={`input-group is-textarea${hasVal ? " has-value" : ""}${error ? " has-error" : ""}`}>
      <textarea
        className={`modern-input${error ? " input-has-error" : ""}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        placeholder=" "
      />
      <label>
        {label}{required && <span className="required"> *</span>}
      </label>
      {error && <small className="error">{error}</small>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
function HrEmployeeManagement() {
  const [loading, setLoading]         = useState(false);
  const [message, setMessage]         = useState("");
  const [mode, setMode]               = useState("create");
  const [userId, setUserId]           = useState(null);
  const [errors, setErrors]           = useState({});
  const [stepWarningShown, setStepWarningShown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  // Search states
  const [searchValue, setSearchValue]           = useState("");
  const [searchResults, setSearchResults]       = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading]       = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Manager search states
  const [managerSearchValue, setManagerSearchValue]     = useState("");
  const [managerSearchResults, setManagerSearchResults] = useState([]);
  const [showManagerSearch, setShowManagerSearch]       = useState(false);
  const [managerSearchLoading, setManagerSearchLoading] = useState(false);
  const [selectedManager, setSelectedManager]           = useState(null);

  // API data
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [percentages, setPercentages]  = useState(null);
  const [documents, setDocuments]      = useState([]);

  // Form state
  const [form, setForm] = useState({
    personalDetailsDTO: {
      firstName: "", middleName: "", lastName: "", gender: "", dob: "",
      nationality: "", maritalStatus: "", bloodGroup: "", aadhaarNumber: "",
      panNumber: "", phoneNumber: "", emailId: "", address1: "", address2: "",
      emergencyContactName: "", emergencyContactRelation: "", emergencyPhoneNumber: "",
    },
    jobDetailsDTO: {
      departmentId: "", designationId: "", workLocation: "", dateOfJoining: "",
    },
    bankDetailsDTO: {
      bankName: "", accountNumber: "", ifsc: "", branchName: "", beneficiaryName: "",
    },
    employeeStatutoryDetailsDTO: { pfUan: "", esi: "", min: "" },
    salaryDetailsDTO: { ctc: "", basic: "", hra: "", conveyanceAllowance: "", pf: "" },
    empMgrDto: { mgrId: "" }
  });

  const [netSalary, setNetSalary]               = useState(0);
  const [uploadedFiles, setUploadedFiles]       = useState({});
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState({});
  const [completedSteps, setCompletedSteps]     = useState(
    { 1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false }
  );

  const steps = [
    { number:1, title:"Search Employee",  icon:"🔍" },
    { number:2, title:"Personal Details", icon:"👤" },
    { number:3, title:"Contact Info",     icon:"📞" },
    { number:4, title:"Job Details",      icon:"💼" },
    { number:5, title:"Manager",          icon:"👔" },
    { number:6, title:"Bank Details",     icon:"🏦" },
    { number:7, title:"Salary",           icon:"💰" },
    { number:8, title:"Documents",        icon:"📄" },
  ];

  /* ── Fetch initial data ── */
  useEffect(() => {
    axios.get(`/api/departments`, { withCredentials: true })
      .then(r => setDepartments(r.data)).catch(console.error);
    axios.get(`/api/designations`, { withCredentials: true })
      .then(r => setDesignations(r.data)).catch(console.error);
    axios.get(`/api/salary/calculator/get`, { withCredentials: true })
      .then(r => {
        const item = Array.isArray(r.data) ? r.data.find(i => i.basicPercentage > 0) : r.data;
        if (item) setPercentages({ basic: Number(item.basicPercentage), hra: Number(item.hraPercentage), pf: Number(item.pfPercentage) });
      }).catch(console.error);

    setDocuments([
      { id:1, documentName:"joining-letter",    key:"joiningLetter",    displayName:"Joining Letter",    mandatory:true,  fileType:"PDF", apiKey:"joining-letter"    },
      { id:2, documentName:"resume",             key:"resume",           displayName:"Resume",            mandatory:true,  fileType:"PDF", apiKey:"resume"            },
      { id:3, documentName:"resignation-letter", key:"resignationLetter",displayName:"Resignation Letter",mandatory:false, fileType:"PDF", apiKey:"resignation-letter" },
      { id:4, documentName:"offer-letter",       key:"offerLetter",      displayName:"Offer Letter",     mandatory:true,  fileType:"PDF", apiKey:"offer-letter"      },
      { id:5, documentName:"photograph",         key:"photograph",       displayName:"Photograph",       mandatory:true,  fileType:"JPG/PNG",apiKey:"photograph"      },
    ]);
  }, []);

  /* ── Auto-calculate salary ── */
  useEffect(() => {
    if (!percentages || !form.salaryDetailsDTO.ctc) return;
    const ctc = Number(form.salaryDetailsDTO.ctc);
    if (isNaN(ctc) || ctc <= 0) return;
    const basic  = (ctc * percentages.basic) / 100;
    const hra    = (basic * percentages.hra)  / 100;
    const pf     = (basic * percentages.pf)   / 100;
    const conv   = ctc - (basic + hra + pf);
    const net    = ctc - pf;
    setForm(prev => ({ ...prev, salaryDetailsDTO: { ...prev.salaryDetailsDTO, basic:basic.toFixed(0), hra:hra.toFixed(0), pf:pf.toFixed(0), conveyanceAllowance:conv.toFixed(0) } }));
    setNetSalary(net.toFixed(0));
  }, [form.salaryDetailsDTO.ctc, percentages]);

  const handleChange = (section, field, value) =>
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  /* ── Field-level validation ── */
  const validateField = (field, value) => {
    let err = "";
    const nameRx = /^[A-Za-z]+$/;

    if (field === "firstName") {
      if (!value) err = "First name is required";
      else if (!nameRx.test(value)) err = "First name: letters only";
      else if (value.length < 2)    err = "Min 2 characters";
    }
    if (field === "lastName") {
      if (!value) err = "Last name is required";
      else if (!nameRx.test(value)) err = "Last name: letters only";
    }
    if (field === "dob") {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 20) err = "Employee must be at least 20 years old";
    }
    if (field === "aadhaar") {
      if (!/^[2-9][0-9]{11}$/.test(value)) err = "12 digits, cannot start with 0 or 1";
    }
    if (field === "pan") {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) err = "Format: ABCDE1234F";
    }
    if (field === "phone") {
      if (!/^[6-9][0-9]{9}$/.test(value)) err = "Must start with 6-9 and be 10 digits";
    }
    if (field === "email") {
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) err = "Enter a valid email address";
    }
    if (field === "address") {
      if (value.trim().length < 10) err = "Address must be at least 10 characters";
    }
    if (field === "emergencyName") {
      if (!/^[A-Za-z ]{2,50}$/.test(value)) err = "Letters only (min 2 characters)";
    }
    if (field === "emergencyPhone") {
      if (!/^[6-9][0-9]{9}$/.test(value)) err = "Invalid emergency contact number";
    }
    if (field === "bankName")     { if (!/^[A-Za-z ]{2,50}$/.test(value)) err = "Letters only (2–50 characters)"; }
    if (field === "accountNumber"){ if (!/^[0-9]{9,18}$/.test(value)) err = "Must be 9–18 digits"; else if (/^(\d)\1+$/.test(value)) err = "Cannot be repeating digits"; }
    if (field === "ifsc")         { if (!/^[A-Z]{4}0[0-9]{6}$/.test(value)) err = "Format: SBIN0001234"; }
    if (field === "branch")       { if (!/^[A-Za-z ]{2,50}$/.test(value)) err = "Letters only (2–50 characters)"; }
    if (field === "beneficiary")  { if (!/^[A-Za-z ]{2,50}$/.test(value)) err = "Letters only (2–50 characters)"; }
    if (field === "uan") {
      if (!/^[0-9]{12}$/.test(value)) err = "UAN must be exactly 12 digits";
      else if (/^(\d)\1+$/.test(value)) err = "Cannot be repeating digits";
    }
    if (field === "esi") {
      if (!/^[0-9]{10}$/.test(value)) err = "ESI must be exactly 10 digits";
      else if (/^(\d)\1+$/.test(value)) err = "Cannot be repeating digits";
    }
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  /* ── Step validation ── */
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 2:
        if (!form.personalDetailsDTO.firstName) { setMessage("❌ Please enter first name"); return false; }
        if (!form.personalDetailsDTO.lastName)  { setMessage("❌ Please enter last name");  return false; }
        if (!form.personalDetailsDTO.gender)    { setMessage("❌ Please select gender");    return false; }
        if (!form.personalDetailsDTO.dob)       { setMessage("❌ Please select date of birth"); return false; }
        break;
      case 3:
        if (!form.personalDetailsDTO.phoneNumber) { setMessage("❌ Please enter phone number"); return false; }
        if (!form.personalDetailsDTO.emailId)     { setMessage("❌ Please enter email");        return false; }
        if (!form.personalDetailsDTO.address1)    { setMessage("❌ Please enter address");      return false; }
        break;
      case 4:
        if (!form.jobDetailsDTO.departmentId)  { setMessage("❌ Please select department");  return false; }
        if (!form.jobDetailsDTO.designationId) { setMessage("❌ Please select designation"); return false; }
        if (!form.jobDetailsDTO.dateOfJoining) { setMessage("❌ Please select date of joining"); return false; }
        break;
      case 6:
        if (!form.bankDetailsDTO.bankName)      { setMessage("❌ Please enter bank name");      return false; }
        if (!form.bankDetailsDTO.accountNumber) { setMessage("❌ Please enter account number"); return false; }
        if (!form.bankDetailsDTO.ifsc)          { setMessage("❌ Please enter IFSC code");      return false; }
        break;
      case 7:
        if (!form.salaryDetailsDTO.ctc || Number(form.salaryDetailsDTO.ctc) <= 0) { setMessage("❌ Please enter valid CTC amount"); return false; }
        break;
      default: break;
    }
    setMessage(""); return true;
  };

  /* ── Navigation ── */
  const nextStep = () => {
    if (!validateCurrentStep()) {
      if (!stepWarningShown) { setStepWarningShown(true); setTimeout(() => { setMessage(""); setStepWarningShown(false); }, 3000); }
      return;
    }
    setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top:0, behavior:'smooth' });
  };
  const prevStep = () => { setCurrentStep(prev => Math.max(prev - 1, 1)); window.scrollTo({ top:0, behavior:'smooth' }); };
  const goToStep = (step) => {
    if (step < currentStep) { setCurrentStep(step); return; }
    for (let i = 1; i < step; i++) {
      if (!completedSteps[i]) {
        if (!stepWarningShown) {
          setMessage(`❌ Please complete "${steps[i-1].title}" first`);
          setStepWarningShown(true);
          setTimeout(() => { setMessage(""); setStepWarningShown(false); }, 3000);
        }
        return;
      }
    }
    setMessage(""); setCurrentStep(step);
  };

  /* ── Search ── */
  const handleSearch = async () => {
    if (!searchValue.trim()) { setMessage("Please enter a search term"); return; }
    try {
      setSearchLoading(true); setShowSearchResults(true);
      const res = await axios.get(`/api/dept/hr/emp/search?value=${searchValue}`, { withCredentials:true });
      const results = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setSearchResults(results);
      if (!results.length) setMessage("No employees found");
    } catch { setMessage("❌ Failed to search employee"); } finally { setSearchLoading(false); }
  };

  const loadSelectedEmployee = async () => {
    if (!selectedEmployee) { setMessage("❌ Please select an employee first"); return; }
    const fetchedUserId = selectedEmployee.ftechUserId?.userid;
    setUserId(fetchedUserId || null);
    setForm({
      personalDetailsDTO: {
        firstName:              selectedEmployee.personalDetailsDTO.firstName  || "",
        middleName:             selectedEmployee.personalDetailsDTO.middleName || "",
        lastName:               selectedEmployee.personalDetailsDTO.lastName   || "",
        gender:                 selectedEmployee.personalDetailsDTO.gender     || "",
        dob:                    selectedEmployee.personalDetailsDTO.dob        || "",
        nationality:            selectedEmployee.personalDetailsDTO.nationality|| "",
        maritalStatus:          selectedEmployee.personalDetailsDTO.maritalStatus || "",
        bloodGroup:             selectedEmployee.personalDetailsDTO.bloodGroup  || "",
        aadhaarNumber:          selectedEmployee.personalDetailsDTO.aadhaarNumber || "",
        panNumber:              selectedEmployee.personalDetailsDTO.panNumber   || "",
        phoneNumber:            selectedEmployee.personalDetailsDTO.phoneNumber || "",
        emailId:                selectedEmployee.personalDetailsDTO.emailId    || "",
        address1:               selectedEmployee.personalDetailsDTO.address1   || "",
        address2:               selectedEmployee.personalDetailsDTO.address2   || "",
        emergencyContactName:   selectedEmployee.personalDetailsDTO.emergencyContactName || "",
        emergencyContactRelation:selectedEmployee.personalDetailsDTO.emergencyContactRelation || "",
        emergencyPhoneNumber:   selectedEmployee.personalDetailsDTO.emergencyPhoneNumber || "",
      },
      jobDetailsDTO: {
        departmentId:  selectedEmployee.jobDetailsDTO.departmentId?.toString()  || "",
        designationId: selectedEmployee.jobDetailsDTO.designationId?.toString() || "",
        workLocation:  selectedEmployee.jobDetailsDTO.workLocation  || "",
        dateOfJoining: selectedEmployee.jobDetailsDTO.dateOfJoining || "",
      },
      bankDetailsDTO: {
        bankName:        selectedEmployee.bankDetailsDTO.bankName         || "",
        accountNumber:   selectedEmployee.bankDetailsDTO.accountNumber?.toString() || "",
        ifsc:            selectedEmployee.bankDetailsDTO.ifsc             || "",
        branchName:      selectedEmployee.bankDetailsDTO.branchName       || "",
        beneficiaryName: selectedEmployee.bankDetailsDTO.beneficiaryName  || "",
      },
      employeeStatutoryDetailsDTO: {
        pfUan: selectedEmployee.employeeStatutoryDetailsDTO.pfUan || "",
        esi:   selectedEmployee.employeeStatutoryDetailsDTO.esi   || "",
        min:   selectedEmployee.employeeStatutoryDetailsDTO.min   || "",
      },
      salaryDetailsDTO: {
        ctc:                 selectedEmployee.salaryDetailsDTO.ctc?.toString()                || "",
        basic:               selectedEmployee.salaryDetailsDTO.basic?.toString()              || "",
        hra:                 selectedEmployee.salaryDetailsDTO.hra?.toString()                || "",
        conveyanceAllowance: selectedEmployee.salaryDetailsDTO.conveyanceAllowance?.toString()|| "",
        pf:                  selectedEmployee.salaryDetailsDTO.pf?.toString()                 || "",
      },
      empMgrDto: { mgrId: selectedEmployee.empMgrDto?.mgrId?.toString() || "" }
    });
    if (fetchedUserId) {
      try {
        const r = await axios.get(`/api/hr/search-doc/${fetchedUserId}`, { withCredentials:true });
        setExistingDocuments(r.data);
      } catch { console.error("Documents fetch error"); }
    }
    setMode(fetchedUserId ? "edit" : "create");
    setShowSearchResults(false); setSelectedEmployee(null); setSearchValue("");
    setMessage("✅ Employee loaded for editing");
    setCurrentStep(2);
  };

  /* ── Document helpers ── */
  const handleFileChange = async (docKey, file) => {
    if (!file) return;
    if (mode === "edit" && userId) await uploadDocumentImmediately(docKey, file);
    else { setUploadedFiles(prev => ({ ...prev, [docKey]: file })); setMessage(`📁 ${getDocumentDisplayName(docKey)} selected`); }
  };
  const uploadDocumentImmediately = async (docKey, file) => {
    if (!userId) return;
    const docConfig = documents.find(d => d.key === docKey); if (!docConfig) return;
    setUploadingDocuments(prev => ({ ...prev, [docKey]: true }));
    try {
      const existing = existingDocuments.find(d => d.documentName === docConfig.documentName);
      const fd = new FormData(); fd.append("file", file);
      if (existing?.docId) {
        await axios.put(`/api/v1/users/${userId}/documents/${existing.docId}/replace`, fd, { withCredentials:true, headers:{"Content-Type":"multipart/form-data"} });
        setMessage(`✅ ${docConfig.displayName} replaced`);
      } else {
        const fd2 = new FormData(); fd2.append("file",file); fd2.append("documentType",docConfig.apiKey); fd2.append("userId",userId);
        await axios.post(`/api/dept/hr/employee/document/upload`, fd2, { withCredentials:true, headers:{"Content-Type":"multipart/form-data"} });
        setMessage(`✅ ${docConfig.displayName} uploaded`);
      }
      const r = await axios.get(`/api/hr/search-doc/${userId}`, { withCredentials:true });
      setExistingDocuments(r.data);
    } catch { setMessage(`❌ Failed to upload ${docConfig.displayName}`); }
    finally { setUploadingDocuments(prev => ({ ...prev, [docKey]: false })); }
  };
  const getDocumentDisplayName = (key) => { const d = documents.find(x => x.key === key); return d?.displayName || key; };
  const getFileNameFromPath = (path) => { if (!path) return "N/A"; const p = path.split("/"); return p[p.length - 1] || "N/A"; };

  /* ── Submit ── */
  const submitEmployee = async () => {
    if (!validateCurrentStep()) return;
    try {
      setLoading(true); setMessage("Processing employee...");
      const payload = {
        personalDetailsDTO: { ...form.personalDetailsDTO, gender:form.personalDetailsDTO.gender.toUpperCase(), maritalStatus:form.personalDetailsDTO.maritalStatus.toUpperCase(), panNumber:form.personalDetailsDTO.panNumber.toUpperCase() },
        jobDetailsDTO: { ...form.jobDetailsDTO, departmentId:Number(form.jobDetailsDTO.departmentId), designationId:Number(form.jobDetailsDTO.designationId) },
        salaryDetailsDTO: { ctc:Number(form.salaryDetailsDTO.ctc), basic:Number(form.salaryDetailsDTO.basic), hra:Number(form.salaryDetailsDTO.hra), conveyanceAllowance:Number(form.salaryDetailsDTO.conveyanceAllowance), pf:Number(form.salaryDetailsDTO.pf) },
        bankDetailsDTO: form.bankDetailsDTO,
        employeeStatutoryDetailsDTO: form.employeeStatutoryDetailsDTO,
        empMgrDto: { mgrId: form.empMgrDto.mgrId ? Number(form.empMgrDto.mgrId) : null },
      };
      if (mode === "create") {
        const fd = new FormData();
        fd.append("dto", new Blob([JSON.stringify(payload)], { type:"application/json" }));
        for (const k of Object.keys(uploadedFiles)) fd.append(k, uploadedFiles[k]);
        await axios.post(`/api/dept/hr/onboarding`, fd, { withCredentials:true, headers:{"Content-Type":"multipart/form-data"} });
        setMessage("✅ Employee created successfully!");
      } else {
        await axios.put(`/api/dept/hr/employee/edit?userId=${userId}`, payload, { withCredentials:true, headers:{"Content-Type":"application/json"} });
        setMessage("✅ Employee updated successfully!");
      }
    } catch (err) { setMessage(`❌ ${err.message}`); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ personalDetailsDTO:{ firstName:"",middleName:"",lastName:"",gender:"",dob:"",nationality:"",maritalStatus:"",bloodGroup:"",aadhaarNumber:"",panNumber:"",phoneNumber:"",emailId:"",address1:"",address2:"",emergencyContactName:"",emergencyContactRelation:"",emergencyPhoneNumber:"" }, jobDetailsDTO:{departmentId:"",designationId:"",workLocation:"",dateOfJoining:""}, bankDetailsDTO:{bankName:"",accountNumber:"",ifsc:"",branchName:"",beneficiaryName:""}, employeeStatutoryDetailsDTO:{pfUan:"",esi:"",min:""}, salaryDetailsDTO:{ctc:"",basic:"",hra:"",conveyanceAllowance:"",pf:""}, empMgrDto:{mgrId:""} });
    setCurrentStep(1); setMode("create"); setUserId(null); setMessage(""); setErrors({});
  };

  /* ── Manager search ── */
  const handleManagerSearch = async () => {
    if (!managerSearchValue.trim()) return;
    try {
      setManagerSearchLoading(true);
      const res = await axios.get(`/api/dept/hr/emp/search?value=${managerSearchValue}`, { withCredentials:true });
      const results = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setManagerSearchResults(results); setShowManagerSearch(true);
    } catch { setMessage("❌ Failed to search manager"); } finally { setManagerSearchLoading(false); }
  };
  const selectManager = (emp) => {
    const id = emp.ftechUserId?.userid;
    if (id) { setSelectedManager(emp); setForm(prev => ({ ...prev, empMgrDto:{ mgrId:id.toString() } })); setMessage("✅ Manager selected"); setShowManagerSearch(false); }
  };

  /* ════════════════════════════════════════════════════════
     RENDER STEP CONTENT
  ════════════════════════════════════════════════════════ */
  const renderStepContent = () => {
    const pd = form.personalDetailsDTO;
    const jd = form.jobDetailsDTO;
    const bd = form.bankDetailsDTO;
    const sd = form.salaryDetailsDTO;
    const st = form.employeeStatutoryDetailsDTO;

    switch (currentStep) {

      /* ── STEP 1: Search ── */
      case 1:
        return (
          <div className="step-content">
            <div className="step-header"><h3>🔍 Search Employee</h3><p>Search for an existing employee to edit, or skip to create a new one</p></div>
            <div className="search-container">
              <div className="search-input-wrapper">
                <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by Employee Code, Name, Email, or Phone"
                  className="modern-input" style={{paddingTop:"0",paddingBottom:"0"}} />
                <button onClick={handleSearch} className="search-btn" disabled={searchLoading}>
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </div>
              {showSearchResults && searchResults.length > 0 && (
                <div className="search-results-card">
                  <div className="results-header">
                    <h4>Found {searchResults.length} employee(s)</h4>
                    <button onClick={() => setShowSearchResults(false)}>×</button>
                  </div>
                  <div className="results-list">
                    {searchResults.map((emp, i) => (
                      <div key={i} className={`result-item ${selectedEmployee === emp ? 'selected' : ''}`} onClick={() => setSelectedEmployee(emp)}>
                        <div className="result-info">
                          <h5>{emp.personalDetailsDTO?.firstName} {emp.personalDetailsDTO?.lastName}</h5>
                          <p>ID: {emp.ftechUserId?.userid} | {emp.personalDetailsDTO?.emailId}</p>
                        </div>
                        {selectedEmployee === emp && <span className="check-mark">✓</span>}
                      </div>
                    ))}
                  </div>
                  {selectedEmployee && <button onClick={loadSelectedEmployee} className="load-btn">Load for Editing</button>}
                </div>
              )}
              <div className="or-divider"><span>OR</span></div>
              <button onClick={() => setCurrentStep(2)} className="create-new-btn">Create New Employee</button>
            </div>
          </div>
        );

      /* ── STEP 2: Personal Details ── */
      case 2:
        return (
          <div className="step-content">
            <div className="step-header"><h3>👤 Personal Details</h3><p>Enter basic personal information</p></div>
            <div className="form-grid-2">

              <FLInput label="First Name" required
                value={pd.firstName} error={errors.firstName}
                onChange={e => { const v = e.target.value.replace(/[^A-Za-z]/g,""); handleChange("personalDetailsDTO","firstName",v); validateField("firstName",v); }} />

              <FLInput label="Middle Name"
                value={pd.middleName}
                onChange={e => handleChange("personalDetailsDTO","middleName",e.target.value.replace(/[^A-Za-z]/g,""))} />

              <FLInput label="Last Name" required
                value={pd.lastName} error={errors.lastName}
                onChange={e => { const v = e.target.value.replace(/[^A-Za-z]/g,"").slice(0,50); handleChange("personalDetailsDTO","lastName",v); validateField("lastName",v); }} />

              <FLSelect label="Gender" required value={pd.gender}
                onChange={e => handleChange("personalDetailsDTO","gender",e.target.value)}>
                <option value="" />
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </FLSelect>

              <FLInput label="Date of Birth" required type="date"
                value={pd.dob} error={errors.dob}
                max={new Date(new Date().setFullYear(new Date().getFullYear()-20)).toISOString().split("T")[0]}
                onChange={e => { handleChange("personalDetailsDTO","dob",e.target.value); validateField("dob",e.target.value); }} />

              <FLSelect label="Nationality" required value={pd.nationality}
                onChange={e => handleChange("personalDetailsDTO","nationality",e.target.value)}>
                <option value="" />
                <option value="Indian">Indian</option>
                <option value="American">American</option>
                <option value="British">British</option>
                <option value="Other">Other</option>
              </FLSelect>

              <FLSelect label="Marital Status" value={pd.maritalStatus}
                onChange={e => handleChange("personalDetailsDTO","maritalStatus",e.target.value)}>
                <option value="" />
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </FLSelect>

              <FLSelect label="Blood Group" required value={pd.bloodGroup}
                onChange={e => handleChange("personalDetailsDTO","bloodGroup",e.target.value)}>
                <option value="" />
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <option key={g} value={g}>{g}</option>)}
              </FLSelect>

              <FLInput label="Aadhaar Number" required
                value={pd.aadhaarNumber} error={errors.aadhaar}
                maxLength={12}
                onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,12); handleChange("personalDetailsDTO","aadhaarNumber",v); validateField("aadhaar",v); }} />

              <FLInput label="PAN Number" required
                value={pd.panNumber} error={errors.pan}
                maxLength={10}
                onChange={e => { const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,10); handleChange("personalDetailsDTO","panNumber",v); validateField("pan",v); }} />

            </div>
          </div>
        );

      /* ── STEP 3: Contact ── */
      case 3:
        return (
          <div className="step-content">
            <div className="step-header"><h3>📞 Contact Information</h3><p>Phone, email, and address details</p></div>
            <div className="form-grid-2">

              <FLInput label="Phone Number" required
                value={pd.phoneNumber} error={errors.phone}
                maxLength={10}
                onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,10); handleChange("personalDetailsDTO","phoneNumber",v); validateField("phone",v); }} />

              <FLInput label="Email Address" required
                value={pd.emailId} error={errors.email}
                onChange={e => { const v = e.target.value.toLowerCase(); handleChange("personalDetailsDTO","emailId",v); validateField("email",v); }} />

              <div className="full-width">
                <FLTextarea label="Current Address" required
                  value={pd.address1} error={errors.address}
                  onChange={e => { handleChange("personalDetailsDTO","address1",e.target.value); validateField("address",e.target.value); }} />
              </div>

              <div className="full-width">
                <FLTextarea label="Permanent Address"
                  value={pd.address2}
                  onChange={e => handleChange("personalDetailsDTO","address2",e.target.value)} />
              </div>

              <FLInput label="Emergency Contact Name" required
                value={pd.emergencyContactName} error={errors.emergencyName}
                onChange={e => { const v = e.target.value.replace(/[^A-Za-z ]/g,"").slice(0,50); handleChange("personalDetailsDTO","emergencyContactName",v); validateField("emergencyName",v); }} />

              <FLSelect label="Emergency Contact Relation" required
                value={pd.emergencyContactRelation}
                onChange={e => handleChange("personalDetailsDTO","emergencyContactRelation",e.target.value)}>
                <option value="" />
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
              </FLSelect>

              <FLInput label="Emergency Phone Number" required
                value={pd.emergencyPhoneNumber} error={errors.emergencyPhone}
                maxLength={10}
                onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,10); handleChange("personalDetailsDTO","emergencyPhoneNumber",v); validateField("emergencyPhone",v); }} />

            </div>
          </div>
        );

      /* ── STEP 4: Job Details ── */
      case 4:
        return (
          <div className="step-content">
            <div className="step-header"><h3>💼 Job Details</h3><p>Department, designation, and work information</p></div>
            <div className="form-grid-2">

              <FLSelect label="Department" required value={jd.departmentId}
                onChange={e => handleChange("jobDetailsDTO","departmentId",e.target.value)}>
                <option value="" />
                {departments.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
              </FLSelect>

              <FLSelect label="Designation" required value={jd.designationId}
                onChange={e => handleChange("jobDetailsDTO","designationId",e.target.value)}>
                <option value="" />
                {designations.map(d => <option key={d.id} value={d.id}>{d.designationName}</option>)}
              </FLSelect>

              <FLInput label="Date of Joining" required type="date"
                value={jd.dateOfJoining}
                onChange={e => handleChange("jobDetailsDTO","dateOfJoining",e.target.value)} />

              <FLInput label="Work Location"
                value={jd.workLocation}
                onChange={e => handleChange("jobDetailsDTO","workLocation",e.target.value)} />

            </div>
          </div>
        );

      /* ── STEP 5: Manager ── */
      case 5:
        return (
          <div className="step-content">
            <div className="step-header"><h3>👔 Manager Assignment</h3><p>Search and assign a reporting manager</p></div>
            <div className="manager-assignment">
              {selectedManager ? (
                <div className="selected-manager-card">
                  <div className="manager-info">
                    <h4>{selectedManager.personalDetailsDTO?.firstName} {selectedManager.personalDetailsDTO?.lastName}</h4>
                    <p>ID: {selectedManager.ftechUserId?.userid}</p>
                    <p>{selectedManager.personalDetailsDTO?.emailId}</p>
                  </div>
                  <button onClick={() => { setSelectedManager(null); setForm(prev => ({ ...prev, empMgrDto:{ mgrId:"" } })); }} className="remove-btn">Remove</button>
                </div>
              ) : (
                <div className="manager-search">
                  <div className="search-input-wrapper">
                    <input value={managerSearchValue} onChange={e => setManagerSearchValue(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleManagerSearch()}
                      placeholder="Search manager by Employee ID, name or email"
                      className="modern-input" style={{paddingTop:"0",paddingBottom:"0"}} />
                    <button onClick={handleManagerSearch} className="search-btn" disabled={managerSearchLoading}>
                      {managerSearchLoading ? "Searching..." : "Search"}
                    </button>
                  </div>
                  {showManagerSearch && managerSearchResults.length > 0 && (
                    <div className="manager-results">
                      {managerSearchResults.map((emp, i) => (
                        <div key={i} className="manager-result-item" onClick={() => selectManager(emp)}>
                          <h5>{emp.personalDetailsDTO?.firstName} {emp.personalDetailsDTO?.lastName}</h5>
                          <p>ID: {emp.ftechUserId?.userid} | {emp.personalDetailsDTO?.emailId}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="skip-note">Manager assignment is mandatory and cannot be skipped.</p>
            </div>
          </div>
        );

      /* ── STEP 6: Bank ── */
      case 6:
        return (
          <div className="step-content">
            <div className="step-header"><h3>🏦 Bank Details</h3><p>Enter bank account information for salary processing</p></div>
            <div className="form-grid-2">

              <FLInput label="Bank Name" required
                value={bd.bankName} error={errors.bankName}
                onChange={e => { const v = e.target.value.replace(/[^A-Za-z ]/g,"").slice(0,50); handleChange("bankDetailsDTO","bankName",v); validateField("bankName",v); }} />

              <FLInput label="Account Number" required
                value={bd.accountNumber} error={errors.accountNumber}
                maxLength={18}
                onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,18); handleChange("bankDetailsDTO","accountNumber",v); validateField("accountNumber",v); }} />

              <FLInput label="IFSC Code" required
                value={bd.ifsc} error={errors.ifsc}
                maxLength={11}
                onChange={e => { const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,11); handleChange("bankDetailsDTO","ifsc",v); validateField("ifsc",v); }} />

              <FLInput label="Branch Name" required
                value={bd.branchName} error={errors.branch}
                onChange={e => { const v = e.target.value.replace(/[^A-Za-z ]/g,"").slice(0,50); handleChange("bankDetailsDTO","branchName",v); validateField("branch",v); }} />

              <div className="full-width">
                <FLInput label="Beneficiary Name" required
                  value={bd.beneficiaryName} error={errors.beneficiary}
                  onChange={e => { const v = e.target.value.replace(/[^A-Za-z ]/g,"").slice(0,50); handleChange("bankDetailsDTO","beneficiaryName",v); validateField("beneficiary",v); }} />
              </div>

            </div>
          </div>
        );

      /* ── STEP 7: Salary ── */
      case 7:
        return (
          <div className="step-content">
            <div className="step-header"><h3>💰 Salary &amp; Statutory Details</h3><p>CTC and statutory information</p></div>
            <div className="salary-calculation-info">
              <h4>Salary Breakdown</h4>
              <p>Basic: {percentages?.basic}% | HRA: {percentages?.hra}% | PF: {percentages?.pf}%</p>
            </div>
            <div className="form-grid-2">

              <div className="full-width">
                <FLInput label="CTC (Annual)" required type="number"
                  value={sd.ctc}
                  hint="Salary components will auto-calculate"
                  onChange={e => handleChange("salaryDetailsDTO","ctc",e.target.value)} />
              </div>

              <FLInput label="Basic Salary" required type="number" value={sd.basic} readOnly className="modern-input readonly" onChange={()=>{}} />
              <FLInput label="HRA" required type="number" value={sd.hra} readOnly onChange={()=>{}} />
              <FLInput label="PF" required type="number" value={sd.pf} readOnly onChange={()=>{}} />
              <FLInput label="Conveyance Allowance" required type="number" value={sd.conveyanceAllowance} readOnly onChange={()=>{}} />

              <div className="full-width">
                <FLInput label="Net Salary (Annual)" required type="number" value={netSalary} readOnly onChange={()=>{}} />
              </div>

            </div>
            <div className="statutory-section">
              <h4>Statutory Details</h4>
              <div className="form-grid-2">

                <FLInput label="PF UAN" required
                  value={st.pfUan} error={errors.uan}
                  maxLength={12}
                  onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,12); handleChange("employeeStatutoryDetailsDTO","pfUan",v); validateField("uan",v); }} />

                <FLInput label="ESI Number" required
                  value={st.esi} error={errors.esi}
                  maxLength={10}
                  onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,10); handleChange("employeeStatutoryDetailsDTO","esi",v); validateField("esi",v); }} />

                <div className="full-width">
                  <FLInput label="Medical Insurance Number" required
                    value={st.min}
                    onChange={e => handleChange("employeeStatutoryDetailsDTO","min",e.target.value)} />
                </div>

              </div>
            </div>
          </div>
        );

      /* ── STEP 8: Documents ── */
      case 8:
        return (
          <div className="step-content">
            <div className="step-header"><h3>📄 Document Uploads</h3><p>Upload required documents</p></div>
            {mode === "edit" && existingDocuments.length > 0 && (
              <div className="existing-docs">
                <h4>Existing Documents</h4>
                {existingDocuments.map(doc => (
                  <div key={doc.docId} className="doc-item">
                    <span>{doc.documentName}</span>
                    <span className="doc-file">{getFileNameFromPath(doc.docPath)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="document-upload-grid">
              {documents.map(doc => {
                const isUploading = uploadingDocuments[doc.key];
                const existing    = existingDocuments.find(d => d.documentName === doc.documentName);
                return (
                  <div key={doc.id} className="doc-upload-card">
                    <div className="doc-header">
                      <h5>{doc.displayName}</h5>
                      {doc.mandatory ? <span className="badge-required">Required</span> : <span className="badge-optional">Optional</span>}
                    </div>
                    <input type="file" onChange={e => handleFileChange(doc.key, e.target.files[0])}
                      disabled={loading || isUploading}
                      accept={doc.fileType === "PDF" ? ".pdf" : ".jpg,.jpeg,.png"}
                      className="file-input" />
                    {isUploading && <p className="uploading">Uploading...</p>}
                    {existing    && <p className="uploaded">✓ {getFileNameFromPath(existing.docPath)}</p>}
                    {uploadedFiles[doc.key] && <p className="selected">Selected: {uploadedFiles[doc.key].name}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default: return null;
    }
  };

  /* ════════════════════════════════════════════════════════
     MAIN RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="modular-container">
      <div className="modular-card">

        {/* ── Progress ── */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width:`${(currentStep / totalSteps) * 100}%` }} />
          </div>
          <div className="step-indicators">
            {steps.map(step => (
              <div key={step.number}
                className={`step-indicator ${currentStep === step.number ? 'active' : ''} ${completedSteps[step.number] ? 'completed' : ''}`}
                onClick={() => goToStep(step.number)}>
                <div className="step-number">{completedSteps[step.number] ? '✓' : step.icon}</div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step content ── */}
        <div className="step-container">{renderStepContent()}</div>

        {/* ── Navigation ── */}
        <div className="navigation-buttons">
          {currentStep > 1 && (
            <button onClick={prevStep} className="nav-btn prev-btn">← Previous</button>
          )}
          {currentStep < totalSteps && currentStep !== 1 && (
            <button onClick={nextStep} className="nav-btn next-btn">Next →</button>
          )}
          {currentStep === totalSteps && (
            <button onClick={submitEmployee} className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : mode === "create" ? "Create Employee" : "Update Employee"}
            </button>
          )}
        </div>

        {/* ── Toast ── */}
        {message && (
          <div className={`message-toast ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default HrEmployeeManagement;
