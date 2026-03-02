import React, { Component } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

/* ═══════════════════════════════════════════════════════════════
   ANIMATED CARTOON SVG ILLUSTRATIONS — purely decorative
   ═══════════════════════════════════════════════════════════════ */

const IlloWorker = () => (
  <svg viewBox="0 0 140 160" xmlns="http://www.w3.org/2000/svg" style={deco.floatSvg} className="deco-illo deco-illo-1">
    {/* Body */}
    <rect x="38" y="80" width="64" height="70" rx="14" fill="#ff6b35"/>
    <rect x="38" y="80" width="64" height="20" rx="8" fill="#e85520"/>
    {/* Collar/tie */}
    <rect x="62" y="80" width="16" height="45" rx="4" fill="#fff" opacity="0.3"/>
    <polygon points="70,88 66,100 74,100" fill="#f72585" opacity="0.8"/>
    {/* Arms */}
    <rect x="16" y="82" width="26" height="12" rx="6" fill="#ffd166"/>
    <rect x="98" y="82" width="26" height="12" rx="6" fill="#ffd166"/>
    {/* Hands */}
    <ellipse cx="18" cy="88" rx="9" ry="8" fill="#ffd166"/>
    <ellipse cx="122" cy="88" rx="9" ry="8" fill="#ffd166"/>
    {/* Head */}
    <ellipse cx="70" cy="52" rx="30" ry="30" fill="#ffd166"/>
    {/* Hair */}
    <ellipse cx="70" cy="26" rx="28" ry="12" fill="#3b2200"/>
    <rect x="42" y="26" width="56" height="10" fill="#3b2200"/>
    {/* Eyes */}
    <ellipse cx="60" cy="50" rx="5" ry="6" fill="#3b2200"/>
    <ellipse cx="80" cy="50" rx="5" ry="6" fill="#3b2200"/>
    <ellipse cx="61" cy="48" rx="2" ry="2.5" fill="white" opacity="0.7"/>
    <ellipse cx="81" cy="48" rx="2" ry="2.5" fill="white" opacity="0.7"/>
    {/* Smile */}
    <path d="M60 60 Q70 70 80 60" stroke="#3b2200" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Cheeks */}
    <ellipse cx="52" cy="58" rx="6" ry="4" fill="#ffb347" opacity="0.5"/>
    <ellipse cx="88" cy="58" rx="6" ry="4" fill="#ffb347" opacity="0.5"/>
    {/* Briefcase */}
    <rect x="48" y="128" width="44" height="28" rx="6" fill="#7209b7"/>
    <rect x="58" y="122" width="24" height="10" rx="5" fill="#560bad"/>
    <rect x="68" y="128" width="4" height="28" fill="#560bad" opacity="0.5"/>
    {/* Legs */}
    <rect x="48" y="144" width="20" height="14" rx="6" fill="#e85520"/>
    <rect x="72" y="144" width="20" height="14" rx="6" fill="#e85520"/>
  </svg>
);

const IlloStar = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={deco.floatStar} className="deco-illo deco-illo-2">
    <polygon points="40,5 50,30 75,30 55,48 62,73 40,58 18,73 25,48 5,30 30,30" fill="#ffd166" stroke="#ff6b35" strokeWidth="2"/>
    <polygon points="40,15 47,28 62,28 50,38 55,52 40,44 25,52 30,38 18,28 33,28" fill="#ff9a6c" opacity="0.6"/>
  </svg>
);

const IlloMail = () => (
  <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" style={deco.floatMail} className="deco-illo deco-illo-3">
    <rect x="5" y="10" width="90" height="60" rx="10" fill="#fff" stroke="#ff6b35" strokeWidth="3"/>
    <rect x="5" y="10" width="90" height="60" rx="10" fill="#fff0e8"/>
    <polyline points="5,10 50,45 95,10" stroke="#ff6b35" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <line x1="5" y1="70" x2="35" y2="45" stroke="#ff6b35" strokeWidth="2" opacity="0.5"/>
    <line x1="95" y1="70" x2="65" y2="45" stroke="#ff6b35" strokeWidth="2" opacity="0.5"/>
    {/* Heart on envelope flap */}
    <path d="M50,38 Q46,30 40,32 Q34,34 36,42 Q38,48 50,56 Q62,48 64,42 Q66,34 60,32 Q54,30 50,38Z" fill="#f72585" opacity="0.8" transform="translate(0,-10) scale(0.5) translate(50,20)"/>
  </svg>
);

const IlloChart = () => (
  <svg viewBox="0 0 110 90" xmlns="http://www.w3.org/2000/svg" style={deco.floatChart} className="deco-illo deco-illo-4">
    {/* Board */}
    <rect x="5" y="5" width="100" height="75" rx="10" fill="#fff" stroke="#f72585" strokeWidth="2"/>
    {/* Bars */}
    <rect x="20" y="45" width="14" height="26" rx="4" fill="#ff6b35"/>
    <rect x="40" y="30" width="14" height="41" rx="4" fill="#f72585"/>
    <rect x="60" y="20" width="14" height="51" rx="4" fill="#ffd166"/>
    <rect x="80" y="35" width="14" height="36" rx="4" fill="#7209b7" opacity="0.8"/>
    {/* Arrow trend */}
    <polyline points="20,52 40,38 60,26 82,40" stroke="#ff6b35" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2"/>
    {/* Stars */}
    <text x="68" y="18" fontSize="12" fill="#ffd166">★</text>
    {/* Pin at top */}
    <rect x="48" y="0" width="14" height="8" rx="3" fill="#ff6b35"/>
  </svg>
);

const IlloConfetti = () => (
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={deco.floatConfetti} className="deco-illo deco-illo-5">
    <rect x="20" y="15" width="12" height="12" rx="2" fill="#ff6b35" transform="rotate(20 26 21)"/>
    <rect x="80" y="10" width="10" height="10" rx="2" fill="#f72585" transform="rotate(-15 85 15)"/>
    <rect x="55" y="40" width="8" height="8" rx="2" fill="#ffd166" transform="rotate(30 59 44)"/>
    <rect x="15" y="65" width="11" height="11" rx="2" fill="#7209b7" opacity="0.7" transform="rotate(-25 20 70)"/>
    <rect x="88" y="55" width="9" height="9" rx="2" fill="#ff9a6c" transform="rotate(40 92 59)"/>
    <rect x="40" y="85" width="13" height="13" rx="2" fill="#f72585" transform="rotate(15 46 91)"/>
    <rect x="95" y="85" width="8" height="8" rx="2" fill="#ffd166" transform="rotate(-30 99 89)"/>
    <rect x="10" y="98" width="10" height="10" rx="2" fill="#ff6b35" opacity="0.6" transform="rotate(20 15 103)"/>
    <text x="58" y="28" fontSize="16" fill="#ff6b35">✦</text>
    <text x="28" y="50" fontSize="12" fill="#f72585">✦</text>
    <text x="90" y="38" fontSize="10" fill="#ffd166">✦</text>
    <text x="70" y="100" fontSize="14" fill="#7209b7" opacity="0.7">✦</text>
  </svg>
);

/* Header banner illustration */
const HeaderBanner = () => (
  <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" style={deco.headerSvg} aria-hidden="true">
    {/* Big ID card */}
    <rect x="12" y="18" width="100" height="128" rx="12" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
    {/* Photo area */}
    <rect x="26" y="30" width="36" height="36" rx="18" fill="rgba(255,255,255,0.3)"/>
    <ellipse cx="44" cy="42" rx="10" ry="10" fill="#ffd166"/>
    <path d="M30,65 Q44,56 58,65" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none"/>
    {/* Name lines */}
    <rect x="68" y="32" width="34" height="7" rx="3.5" fill="rgba(255,255,255,0.6)"/>
    <rect x="68" y="44" width="26" height="5" rx="2.5" fill="rgba(255,255,255,0.35)"/>
    <rect x="68" y="54" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.35)"/>
    {/* Divider */}
    <line x1="22" y1="75" x2="102" y2="75" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
    {/* Data rows */}
    <rect x="22" y="82" width="18" height="5" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="46" y="82" width="50" height="5" rx="2" fill="rgba(255,255,255,0.45)"/>
    <rect x="22" y="95" width="18" height="5" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="46" y="95" width="40" height="5" rx="2" fill="rgba(255,255,255,0.45)"/>
    <rect x="22" y="108" width="18" height="5" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="46" y="108" width="45" height="5" rx="2" fill="rgba(255,255,255,0.45)"/>
    {/* Barcode at bottom */}
    {[0,1,2,3,4,5,6,7,8].map(i=>(
      <rect key={i} x={22+i*9} y={120} width={i%3===0?4:2} height={18} rx="1" fill="rgba(255,255,255,0.4)"/>
    ))}

    {/* Floating confetti */}
    <rect x="148" y="20" width="14" height="14" rx="3" fill="#ffd166" opacity="0.9" transform="rotate(20 155 27)"/>
    <rect x="178" y="48" width="11" height="11" rx="2" fill="#ff9a6c" opacity="0.85" transform="rotate(-15 183 53)"/>
    <rect x="162" y="75" width="9" height="9" rx="2" fill="#f72585" opacity="0.75" transform="rotate(30 166 79)"/>
    <rect x="200" y="28" width="16" height="16" rx="3" fill="rgba(255,255,255,0.28)" transform="rotate(10 208 36)"/>
    <rect x="228" y="62" width="10" height="10" rx="2" fill="#c77dff" opacity="0.75" transform="rotate(-20 233 67)"/>
    <text x="245" y="30" fontSize="24" fill="#ffd166" opacity="0.95">★</text>
    <text x="148" y="118" fontSize="16" fill="rgba(255,255,255,0.45)">✦</text>
    <text x="270" y="98" fontSize="12" fill="#ffb3d1" opacity="0.8">✦</text>

    {/* Smiley worker character */}
    {/* Head */}
    <ellipse cx="310" cy="105" rx="34" ry="34" fill="#ffd166"/>
    {/* Hair */}
    <ellipse cx="310" cy="76" rx="30" ry="12" fill="#3b2200"/>
    <rect x="280" y="76" width="60" height="10" fill="#3b2200"/>
    {/* Cheeks */}
    <ellipse cx="295" cy="113" rx="7" ry="5" fill="#ffb347" opacity="0.5"/>
    <ellipse cx="325" cy="113" rx="7" ry="5" fill="#ffb347" opacity="0.5"/>
    {/* Eyes */}
    <ellipse cx="300" cy="100" rx="4.5" ry="5.5" fill="#3b2200"/>
    <ellipse cx="320" cy="100" rx="4.5" ry="5.5" fill="#3b2200"/>
    <ellipse cx="301" cy="98" rx="1.5" ry="2" fill="white" opacity="0.6"/>
    <ellipse cx="321" cy="98" rx="1.5" ry="2" fill="white" opacity="0.6"/>
    {/* Smile */}
    <path d="M298 114 Q310 126 322 114" stroke="#3b2200" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Tie/collar */}
    <rect x="300" y="134" width="20" height="8" rx="3" fill="#ff6b35"/>
    <polygon points="310,142 305,156 315,156" fill="#e85520"/>
    {/* Shoulders */}
    <rect x="278" y="135" width="64" height="22" rx="10" fill="#ff6b35"/>
    {/* Hands waving */}
    <ellipse cx="268" cy="128" rx="10" ry="9" fill="#ffd166"/>
    <ellipse cx="352" cy="128" rx="10" ry="9" fill="#ffd166"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   DECORATOR STYLE OBJECTS  (positions only — no design logic)
   ═══════════════════════════════════════════════════════════════ */
const deco = {
  floatSvg:   { width:120, height:140, position:"absolute", right:16, bottom:0, opacity:0.13, pointerEvents:"none" },
  floatStar:  { width:64,  height:64,  position:"absolute", top:12, right:20, opacity:0.18, pointerEvents:"none" },
  floatMail:  { width:80,  height:64,  position:"absolute", bottom:12, left:20, opacity:0.15, pointerEvents:"none" },
  floatChart: { width:88,  height:72,  position:"absolute", top:16, right:32, opacity:0.15, pointerEvents:"none" },
  floatConfetti:{ width:100, height:100, position:"absolute", bottom:8, right:12, opacity:0.18, pointerEvents:"none" },
  headerSvg:  { position:"absolute", right:0, top:0, bottom:0, height:"100%", width:370, pointerEvents:"none", zIndex:1 },
};

/* ═══════════════════════════════════════════════════════════════
   INJECT GLOBAL STYLES
   ═══════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800&display=swap');

  .emp-profile-root {
    font-family: 'Nunito', sans-serif !important;
    background: #fff9f6 !important;
  }

  /* Floating animations */
  .deco-illo { animation: decoFloat 6s ease-in-out infinite; }
  .deco-illo-1 { animation-delay: 0s; }
  .deco-illo-2 { animation-delay: 1.2s; }
  .deco-illo-3 { animation-delay: 2.4s; }
  .deco-illo-4 { animation-delay: 0.8s; }
  .deco-illo-5 { animation-delay: 1.8s; }

  @keyframes decoFloat {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    40%     { transform: translateY(-10px) rotate(2deg); }
    70%     { transform: translateY(-5px) rotate(-1.5deg); }
  }

  .header-illo-wrap { animation: headerFloat 8s ease-in-out infinite; }
  @keyframes headerFloat {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-8px); }
  }

  /* Tab hover */
  .emp-tab:hover:not(.emp-tab--active) {
    background: #fff0e8 !important;
    color: #ff6b35 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255,107,53,0.15) !important;
  }

  /* Field row hover */
  .emp-field-wrap:hover {
    background: #fff8f5;
    border-radius: 10px;
    padding: 4px 8px;
    margin: -4px -8px;
  }

  /* Section entrance */
  .emp-section { animation: sectionIn 0.45s cubic-bezier(.22,1,.36,1) both; }
  @keyframes sectionIn {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Profile card entrance */
  .profile-header-card { animation: cardIn 0.5s cubic-bezier(.22,1,.36,1) both; }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(-16px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Avatar glow */
  .emp-avatar-ring {
    animation: avatarGlow 3s ease-in-out infinite;
  }
  @keyframes avatarGlow {
    0%,100% { box-shadow: 0 0 0 6px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.18); }
    50%     { box-shadow: 0 0 0 10px rgba(255,255,255,0.3), 0 10px 32px rgba(0,0,0,0.25); }
  }

  /* Spinner */
  .emp-spinner {
    width:44px; height:44px;
    border:4px solid #ffe0cc;
    border-top-color:#ff6b35;
    border-radius:50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* Skeleton pulse */
  @keyframes pulse {
    0%,100% { opacity:1; }
    50%     { opacity:0.45; }
  }

  /* Value badge on hover */
  .emp-value:hover {
    color: #ff6b35;
    transition: color 0.2s;
  }

  /* Input focus */
  .emp-input:focus, .emp-select:focus, .emp-textarea:focus {
    outline: none;
    border-color: #ff6b35 !important;
    box-shadow: 0 0 0 3px rgba(255,107,53,0.18) !important;
  }

  @media print {
    .no-print { display:none !important; }
    .print-section { break-inside:avoid; }
    body { background:white !important; }
  }

  .tab-scroll::-webkit-scrollbar { height:5px; }
  .tab-scroll::-webkit-scrollbar-track { background:#fff0e8; border-radius:3px; }
  .tab-scroll::-webkit-scrollbar-thumb { background:#ff9a6c; border-radius:3px; }
`;

(function injectCSS() {
  if (document.getElementById("emp-profile-styles")) return;
  const s = document.createElement("style");
  s.id = "emp-profile-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
const T = {
  orange:  "#ff6b35",
  pink:    "#f72585",
  peach:   "#ff9a6c",
  yellow:  "#ffd166",
  purple:  "#7209b7",
  bg:      "#fff9f6",
  white:   "#ffffff",
  text:    "#1a1a2e",
  muted:   "#9ca3af",
  border:  "#ffe0cc",
  section: "#ffffff",
  shade:   "#fff0e8",
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT  (class unchanged, only styles replaced)
   ═══════════════════════════════════════════════════════════════ */
export default class EmpProfile extends Component {
  state = {
    loading: true,
    error: null,
    data: null,
    editing: false,
    formData: {},
    profilePicture: null,
    activeTab: "personal",
    photographData: null,
    photographLoading: false,
  };

  componentDidMount() {
    this.fetchProfile();
    this.refreshInterval = setInterval(this.fetchProfile, 300000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
    if (this.state.photographData && this.state.photographData !== "default") {
      URL.revokeObjectURL(this.state.photographData);
    }
  }

  fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/emp/profile`);
      this.setState({ data: res.data, loading: false, formData: res.data }, () => {
        this.fetchPhotograph(res.data.userId);
      });
    } catch (err) {
      this.setState({ error: "Failed to load profile. Please try again.", loading: false });
    }
  };

  fetchPhotograph = async (userId) => {
    if (!userId) return;
    this.setState({ photographLoading: true });
    try {
      const docRes = await axios.get(`/api/hr/search-doc/${userId}`);
      const photographDoc = docRes.data.find(doc => doc.documentName === "photograph");
      if (photographDoc) {
        const imageRes = await axios.get(
          `/api/v1/users/${userId}/documents/${photographDoc.docId}/download`,
          { responseType: 'blob', timeout: 10000 }
        );
        const imageBlob = new Blob([imageRes.data], { type: imageRes.headers['content-type'] || 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        if (this.state.photographData && this.state.photographData !== "default") {
          URL.revokeObjectURL(this.state.photographData);
        }
        this.setState({ photographData: imageUrl, photographLoading: false });
      } else {
        this.setState({ photographData: "default", photographLoading: false });
      }
    } catch {
      this.setState({ photographData: "default", photographLoading: false });
    }
  };

  handleEditToggle = () => {
    this.setState(p => ({ editing: !p.editing, formData: p.data }));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(p => ({ formData: { ...p.formData, [name]: value } }));
  };

  handleSave = async () => {
    try {
      await axios.put(`/api/emp/profile`, this.state.formData);
      this.setState({ editing: false, data: this.state.formData });
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to update profile. Please try again.");
    }
  };

  handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert("Please upload an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image size should be less than 5MB"); return; }
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const res = await axios.post(`/api/emp/profile/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      this.setState(p => ({ data: { ...p.data, profilePicture: res.data.imageUrl } }));
      alert("Profile picture updated successfully!");
    } catch {
      alert("Failed to upload image.");
    }
  };

  handlePrint = () => { window.print(); };

  exportToPDF = async () => {
    try {
      const response = await axios.get(`/api/emp/profile/export/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employee-profile.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to export PDF.");
    }
  };

  maskAccountNumber = (accNum) => {
    if (!accNum || accNum.length < 4) return "-";
    return `****${accNum.slice(-4)}`;
  };

  formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length !== 3) return "-";
    try {
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
    } catch { return "-"; }
  };

  formatCurrency = (value) => {
    if (!value && value !== 0) return "-";
    return `₹ ${Number(value).toLocaleString("en-IN")}`;
  };

  render() {
    const { loading, error, data, editing, formData, activeTab, photographData, photographLoading } = this.state;

    if (loading) return <ProfileSkeleton />;
    if (error)   return <ErrorMessage message={error} onRetry={this.fetchProfile} />;
    if (!data)   return null;

    const initials = `${data.firstName?.charAt(0)||""}${data.lastName?.charAt(0)||""}`;
    const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><circle cx='60' cy='60' r='60' fill='%23ff6b35'/><text x='50%25' y='55%25' text-anchor='middle' fill='white' font-size='48' font-family='Arial, sans-serif' dy='.3em'>${initials}</text></svg>`;
    const photographUrl = (photographData && photographData !== "default") ? photographData : defaultAvatar;

    return (
      <div style={S.container} className="emp-profile-root">

        {/* ── Page Header Banner ── */}
        <div style={S.banner} className="profile-header-card no-print">
          <div style={S.bannerContent}>
            
            <h1 style={S.bannerTitle}>My Profile</h1>
            <p style={S.bannerSub}>View and manage your personal, job and financial information</p>
            
          </div>
          
        </div>

       

        {/* ── Profile Hero Card ── */}
        <div style={S.profileHero} className="emp-section">

          {/* Left gradient stripe with avatar */}
          <div style={S.heroLeft}>
            {/* Decorative circles behind avatar */}
            <div style={S.heroBubble1}/>
            <div style={S.heroBubble2}/>
            <div style={S.heroBubble3}/>

            <div style={S.avatarWrap}>
              <div style={S.avatarRing} className="emp-avatar-ring">
                {photographLoading ? (
                  <div style={S.photoLoading}>
                    <div className="emp-spinner" style={{width:32,height:32,margin:0}}/>
                  </div>
                ) : (
                  <img
                    src={photographUrl}
                    alt="Profile"
                    style={S.avatar}
                    onError={e => { e.target.src = defaultAvatar; }}
                  />
                )}
              </div>
             
            </div>

            {/* Status dot below avatar */}
            {data.employmentStatus && (
              <span style={getStatusBadge(data.employmentStatus)}>{data.employmentStatus}</span>
            )}
          </div>

          {/* Center: name + details */}
          <div style={S.heroCenter}>
            <h2 style={S.empName}>{data.firstName} {data.lastName}</h2>

            <div style={S.heroRoleRow}>
              <span style={S.heroDesigPill}>{data.designationName || "—"}</span>
              <span style={S.heroDeptPill}>{data.departmentName || "—"}</span>
            </div>

            <div style={S.heroIdRow}>
              <span style={S.heroIdChip}>🪪 ID: {data.userId || "N/A"}</span>
              <span style={S.heroIdChip}>📧 {data.emailId || "—"}</span>
              <span style={S.heroIdChip}>📞 {data.phoneNumber || "—"}</span>
            </div>

            {/* Mini progress bar — profile completeness decorative */}
            
          </div>

          {/* Right: Quick stats vertical stack */}
          <div style={S.heroRight}>
            <HeroStat icon="📅" label="Date Joined"  value={this.formatDate(data.dateOfJoining)} color="#ff6b35"/>
            <HeroStat icon="📍" label="Work Location" value={data.workLocation || "—"}            color="#f72585"/>
            <HeroStat icon="🩸" label="Blood Group"   value={data.bloodGroup || "—"}              color="#7209b7"/>
            <HeroStat icon="💼" label="Department"    value={data.departmentName || "—"}          color="#ff9a6c"/>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={S.tabBar} className="tab-scroll no-print">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`emp-tab${activeTab===tab.id?" emp-tab--active":""}`}
              style={activeTab===tab.id ? {...S.tab,...S.tabActive} : S.tab}
              onClick={() => this.setState({ activeTab: tab.id })}
            >
              <span style={{fontSize:16}}>{TAB_ICONS[tab.id]}</span>
              <span style={{fontSize:13, fontWeight:700}}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Content Sections ── */}
        <div style={{display:"flex", flexDirection:"column", gap:20}}>

          {(activeTab==="personal"||activeTab==="all") && (
            <Section title="Personal Details" icon="👤" color={T.orange} decoEl={<IlloWorker/>}>
              <Field label="First Name"   value={data.firstName}    editing={editing} name="firstName"   onChange={this.handleInputChange} formValue={formData.firstName}/>
              <Field label="Last Name"    value={data.lastName}     editing={editing} name="lastName"    onChange={this.handleInputChange} formValue={formData.lastName}/>
              <Field label="Gender"       value={data.gender}       editing={editing} name="gender"      type="select" options={["MALE","FEMALE","OTHER"]} onChange={this.handleInputChange} formValue={formData.gender}/>
              <Field label="Date of Birth" value={this.formatDate(data.dob)} editing={editing} name="dob" type="date" onChange={this.handleInputChange} formValue={formData.dob}/>
              <Field label="Phone Number" value={data.phoneNumber}  editing={editing} name="phoneNumber" onChange={this.handleInputChange} formValue={formData.phoneNumber}/>
              <Field label="Email"        value={data.emailId}      editing={editing} name="emailId"     type="email" onChange={this.handleInputChange} formValue={formData.emailId}/>
              <Field label="Blood Group"  value={data.bloodGroup}   editing={editing} name="bloodGroup"  type="select" options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} onChange={this.handleInputChange} formValue={formData.bloodGroup}/>
              <Field label="Address"      value={data.address1}     editing={editing} name="address1"    type="textarea" onChange={this.handleInputChange} formValue={formData.address1} fullWidth/>
            </Section>
          )}

          {(activeTab==="job"||activeTab==="all") && (
            <Section title="Job Details" icon="💼" color={T.pink} decoEl={<IlloChart/>}>
              <Field label="Employee ID"      value={data.userId}          editing={false}/>
              <Field label="Work Location"    value={data.workLocation}    editing={editing} name="workLocation"  onChange={this.handleInputChange} formValue={formData.workLocation}/>
              <Field label="Date of Joining"  value={this.formatDate(data.dateOfJoining)} editing={editing} name="dateOfJoining" type="date" onChange={this.handleInputChange} formValue={formData.dateOfJoining}/>
              <Field label="Department"       value={data.departmentName}  editing={false}/>
              <Field label="Designation"      value={data.designationName} editing={false}/>
            </Section>
          )}

          {(activeTab==="salary"||activeTab==="all") && (
            <Section title="Salary Details" icon="💰" color="#10b981" decoEl={<IlloStar/>}>
              <Field label="CTC"                  value={this.formatCurrency(data.ctc)}                editing={editing} name="ctc"                  type="number" onChange={this.handleInputChange} formValue={formData.ctc}/>
              <Field label="Basic Salary"          value={this.formatCurrency(data.basic)}              editing={editing} name="basic"                type="number" onChange={this.handleInputChange} formValue={formData.basic}/>
              <Field label="HRA"                   value={this.formatCurrency(data.hra)}                editing={editing} name="hra"                  type="number" onChange={this.handleInputChange} formValue={formData.hra}/>
              <Field label="Conveyance Allowance"  value={this.formatCurrency(data.conveyanceAllowance)} editing={editing} name="conveyanceAllowance" type="number" onChange={this.handleInputChange} formValue={formData.conveyanceAllowance}/>
            </Section>
          )}

          {(activeTab==="bank"||activeTab==="all") && (
            <Section title="Bank Details" icon="🏦" color={T.purple} decoEl={<IlloMail/>}>
              <Field label="Bank Name"        value={data.bankName}          editing={editing} name="bankName"        onChange={this.handleInputChange} formValue={formData.bankName}/>
              <Field label="Account Number"   value={this.maskAccountNumber(data.accountNumber)} editing={editing} name="accountNumber" onChange={this.handleInputChange} formValue={formData.accountNumber} maskable/>
              <Field label="IFSC Code"        value={data.ifsc}              editing={editing} name="ifsc"            onChange={this.handleInputChange} formValue={formData.ifsc}/>
              <Field label="Branch Name"      value={data.branchName}        editing={editing} name="branchName"      onChange={this.handleInputChange} formValue={formData.branchName}/>
              <Field label="Beneficiary Name" value={data.beneficiaryName}   editing={editing} name="beneficiaryName" onChange={this.handleInputChange} formValue={formData.beneficiaryName}/>
            </Section>
          )}

          {(activeTab==="emergency"||activeTab==="all") && (
            <Section title="Emergency Contact" icon="🚨" color="#ef4444" decoEl={<IlloStar/>}>
              <Field label="Contact Name"   value={data.emergencyContactName}  editing={editing} name="emergencyContactName"  onChange={this.handleInputChange} formValue={formData.emergencyContactName}/>
              <Field label="Contact Number" value={data.emergencyPhoneNumber}   editing={editing} name="emergencyPhoneNumber"  onChange={this.handleInputChange} formValue={formData.emergencyPhoneNumber}/>
            </Section>
          )}

          {(activeTab==="statutory"||activeTab==="all") && (
            <Section title="Statutory Details" icon="📋" color={T.orange} decoEl={<IlloConfetti/>}>
              <Field label="PF / UAN Number" value={data.pfUan}           editing={editing} name="pfUan"      onChange={this.handleInputChange} formValue={formData.pfUan}/>
              <Field label="ESI"             value={data.esi==="yes"?"Yes":"No"} editing={editing} name="esi" type="select" options={["yes","no"]} onChange={this.handleInputChange} formValue={formData.esi}/>
              <Field label="MIN"             value={data.min==="yes"?"Yes":"No"} editing={editing} name="min" type="select" options={["yes","no"]} onChange={this.handleInputChange} formValue={formData.min}/>
              <Field label="PAN Number"      value={data.panNumber}       editing={editing} name="panNumber"   onChange={this.handleInputChange} formValue={formData.panNumber}/>
              <Field label="Aadhaar Number"  value={data.aadhaarNumber?`**** **** ${data.aadhaarNumber.slice(-4)}`:"-"} editing={editing} name="aadhaarNumber" onChange={this.handleInputChange} formValue={formData.aadhaarNumber} maskable/>
            </Section>
          )}
        </div>
      </div>
    );
  }
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

const HeroStat = ({ icon, label, value, color }) => (
  <div style={{
    display:"flex", alignItems:"center", gap:12,
    background:"#fff",
    border:`1.5px solid ${color}28`,
    borderLeft:`4px solid ${color}`,
    borderRadius:12,
    padding:"10px 14px",
    boxShadow:`0 2px 10px ${color}12`,
    transition:"transform 0.2s, box-shadow 0.2s",
    cursor:"default",
  }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateX(4px)"; e.currentTarget.style.boxShadow=`0 4px 18px ${color}22`; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="translateX(0)";   e.currentTarget.style.boxShadow=`0 2px 10px ${color}12`; }}
  >
    <span style={{fontSize:22, lineHeight:1}}>{icon}</span>
    <div>
      <div style={{fontSize:10, fontWeight:800, color:"#adb5bd", textTransform:"uppercase", letterSpacing:"0.9px", marginBottom:2}}>{label}</div>
      <div style={{fontSize:14, fontWeight:800, color:"#1a1a2e", lineHeight:1}}>{value}</div>
    </div>
  </div>
);

const QuickStat = ({ icon, label, value }) => (
  <div style={S.quickStat}>
    <span style={S.quickIcon}>{icon}</span>
    <div>
      <div style={S.quickLabel}>{label}</div>
      <div style={S.quickVal}>{value}</div>
    </div>
  </div>
);

const Section = ({ title, icon, color, children, decoEl }) => (
  <div style={{...S.section, borderTopColor: color}} className="emp-section print-section">
    <div style={S.sectionHead}>
      <div style={{...S.sectionIconWrap, background:`${color}18`, border:`1.5px solid ${color}33`}}>
        <span style={{fontSize:20}}>{icon}</span>
      </div>
      <h3 style={{...S.sectionTitle, color: T.text}}>{title}</h3>
    </div>
    {/* Floating deco behind content */}
    <div style={{position:"relative", overflow:"hidden"}}>
      {decoEl}
    </div>
    <div style={S.fieldGrid}>{children}</div>
  </div>
);

const Field = ({ label, value, editing, name, type="text", options, onChange, formValue, fullWidth=false, maskable=false }) => (
  <div style={fullWidth ? S.fieldFull : S.field} className="emp-field-wrap">
    <label style={S.label}>{label}</label>
    {editing ? (
      type==="select" ? (
        <select name={name} value={formValue||""} onChange={onChange} style={S.select} className="emp-select">
          <option value="">Select…</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ) : type==="textarea" ? (
        <textarea name={name} value={formValue||""} onChange={onChange} style={S.textarea} rows={3} className="emp-textarea"/>
      ) : (
        <input type={type} name={name} value={formValue||""} onChange={onChange} style={S.input} className="emp-input"/>
      )
    ) : (
      <div style={S.value} className="emp-value">
        {maskable && label.includes("Account") ? `**** **** ${value?.slice(-4)||""}` : value||"-"}
      </div>
    )}
  </div>
);

const ProfileSkeleton = () => (
  <div style={S.container} className="emp-profile-root">
    <div style={{...S.banner, background:"#ffe0cc"}}/>
    <div style={{...S.profileCard, marginTop:24}}>
      <div style={{width:110,height:110,borderRadius:"50%",background:"#ffe0cc",animation:"pulse 1.5s infinite"}}/>
      <div style={{flex:1, display:"flex",flexDirection:"column",gap:10}}>
        {[200,140,100].map((w,i)=>(
          <div key={i} style={{width:w,height:18,background:"#ffe0cc",borderRadius:6,animation:"pulse 1.5s infinite"}}/>
        ))}
      </div>
    </div>
    {[1,2,3].map(i=>(
      <div key={i} style={{...S.section,marginTop:16}}>
        <div style={{width:160,height:22,background:"#ffe0cc",borderRadius:6,marginBottom:20,animation:"pulse 1.5s infinite"}}/>
        <div style={S.fieldGrid}>
          {[1,2,3,4].map(j=>(
            <div key={j} style={{height:60,background:"#fff0e8",borderRadius:10,animation:"pulse 1.5s infinite"}}/>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div style={S.container} className="emp-profile-root">
    <div style={{textAlign:"center",padding:"80px 40px"}}>
      <div style={{fontSize:56,marginBottom:20}}>⚠️</div>
      <h3 style={{fontSize:22,fontWeight:700,color:"#ef4444",marginBottom:10}}>Error Loading Profile</h3>
      <p style={{color:T.muted,fontSize:15,marginBottom:28}}>{message}</p>
      <button style={S.btnPrimary} onClick={onRetry}>↻ Retry</button>
    </div>
  </div>
);

const EditForm = ({ formData, onChange, onSave, onCancel }) => (
  <div style={S.editCard} className="emp-section no-print">
    <h3 style={{fontFamily:"'Poppins',sans-serif",fontSize:18,fontWeight:700,color:T.text,marginBottom:20,paddingBottom:14,borderBottom:`2px solid ${T.border}`}}>
      ✏️ Edit Profile
    </h3>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18,marginBottom:24}}>
      {[
        {label:"First Name", name:"firstName", type:"text"},
        {label:"Last Name",  name:"lastName",  type:"text"},
        {label:"Phone Number",name:"phoneNumber",type:"tel"},
        {label:"Email",      name:"emailId",   type:"email"},
      ].map(f=>(
        <div key={f.name} style={{display:"flex",flexDirection:"column",gap:6}}>
          <label style={S.label}>{f.label}</label>
          <input type={f.type} name={f.name} value={formData[f.name]||""} onChange={onChange} style={S.input} className="emp-input"/>
        </div>
      ))}
      <div style={{display:"flex",flexDirection:"column",gap:6,gridColumn:"1/-1"}}>
        <label style={S.label}>Address</label>
        <textarea name="address1" value={formData.address1||""} onChange={onChange} style={S.textarea} rows={3} className="emp-textarea"/>
      </div>
    </div>
    <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
      <button style={{...S.btnPrimary, background:`linear-gradient(135deg,#10b981,#059669)`}} onClick={onSave}>✓ Save Changes</button>
      <button style={{...S.btnPrimary, background:`linear-gradient(135deg,#ef4444,#dc2626)`}} onClick={onCancel}>✕ Cancel</button>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id:"personal",  label:"Personal"  },
  { id:"job",       label:"Job"       },
  { id:"salary",    label:"Salary"    },
  { id:"bank",      label:"Bank"      },
  { id:"emergency", label:"Emergency" },
  { id:"statutory", label:"Statutory" },
  { id:"all",       label:"View All"  },
];

const TAB_ICONS = {
  personal:"👤", job:"💼", salary:"💰", bank:"🏦", emergency:"🚨", statutory:"📋", all:"📊",
};

/* ═══════════════════════════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════════════════════════ */
const getStatusBadge = (status) => {
  const base = { padding:"4px 14px", borderRadius:20, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" };
  switch(status?.toLowerCase()) {
    case "active":   return {...base, background:"#d1fae5", color:"#065f46"};
    case "inactive": return {...base, background:"#fee2e2", color:"#991b1b"};
    case "on leave": return {...base, background:"#fef3c7", color:"#92400e"};
    default:         return {...base, background:"#f3f4f6", color:"#374151"};
  }
};

/* ═══════════════════════════════════════════════════════════════
   STYLE OBJECTS  (all white bg, orange/pink accents)
   ═══════════════════════════════════════════════════════════════ */
const S = {
  container: {
    padding:"24px 20px 48px",
    maxWidth:1240,
    margin:"0 auto",
    background:T.bg,
    minHeight:"100vh",
    fontFamily:"'Nunito',sans-serif",
  },

  /* Banner */
  banner: {
    background:"linear-gradient(125deg,#ff6b35 0%,#f72585 55%,#7209b7 100%)",
    borderRadius:22,
    padding:0,
    marginBottom:24,
    position:"relative",
    overflow:"hidden",
    minHeight:180,
    display:"flex",
    alignItems:"stretch",
    boxShadow:"0 14px 40px rgba(247,37,133,0.28)",
  },
  bannerContent: {
    position:"relative", zIndex:2,
    padding:"32px 36px",
    flex:1, paddingRight:320,
    display:"flex", flexDirection:"column", gap:8,
    justifyContent:"center",
  },
  bannerTag: {
    display:"inline-block",
    background:"rgba(255,255,255,0.2)",
    color:"#fff", fontSize:11, fontWeight:700,
    letterSpacing:"1.5px", textTransform:"uppercase",
    padding:"4px 12px", borderRadius:20,
    border:"1px solid rgba(255,255,255,0.35)",
    width:"fit-content", marginBottom:4,
  },
  bannerTitle: {
    fontFamily:"'Poppins',sans-serif",
    fontSize:32, fontWeight:800, color:"#fff",
    margin:0, lineHeight:1.15, letterSpacing:"-0.5px",
  },
  bannerSub: { fontSize:13, color:"rgba(255,255,255,0.78)", fontWeight:500, margin:0 },
  bannerActions: { display:"flex", gap:10, flexWrap:"wrap", marginTop:6 },

  /* Buttons */
  btnPrimary: {
    background:"linear-gradient(135deg,#ff6b35,#f72585)",
    color:"#fff", border:"none",
    padding:"10px 22px", borderRadius:10,
    cursor:"pointer", fontWeight:700, fontSize:13,
    fontFamily:"'Nunito',sans-serif",
    boxShadow:"0 4px 14px rgba(247,37,133,0.25)",
    transition:"transform 0.15s,box-shadow 0.15s",
  },
  btnOutline: {
    background:"rgba(255,255,255,0.18)",
    color:"#fff", border:"1.5px solid rgba(255,255,255,0.4)",
    padding:"10px 22px", borderRadius:10,
    cursor:"pointer", fontWeight:700, fontSize:13,
    fontFamily:"'Nunito',sans-serif",
    backdropFilter:"blur(4px)",
  },

  /* ── Profile Hero Card ── */
  profileHero: {
    background:T.white,
    borderRadius:24,
    overflow:"hidden",
    display:"flex",
    alignItems:"stretch",
    boxShadow:"0 8px 40px rgba(255,107,53,0.13)",
    border:`1.5px solid ${T.border}`,
    marginBottom:22,
    minHeight:200,
  },

  /* Left column — gradient bg with avatar centered */
  heroLeft: {
    background:"linear-gradient(160deg, #ff6b35 0%, #f72585 60%, #7209b7 100%)",
    width:200,
    flexShrink:0,
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    gap:14,
    padding:"28px 20px",
    position:"relative",
    overflow:"hidden",
  },
  /* Decorative bubble overlays inside heroLeft */
  heroBubble1: {
    position:"absolute", top:-30, left:-30,
    width:120, height:120, borderRadius:"50%",
    background:"rgba(255,255,255,0.1)", pointerEvents:"none",
  },
  heroBubble2: {
    position:"absolute", bottom:-20, right:-20,
    width:90, height:90, borderRadius:"50%",
    background:"rgba(255,255,255,0.08)", pointerEvents:"none",
  },
  heroBubble3: {
    position:"absolute", top:"40%", right:-15,
    width:50, height:50, borderRadius:"50%",
    background:"rgba(255,255,255,0.07)", pointerEvents:"none",
  },

  avatarWrap: { position:"relative", flexShrink:0, zIndex:2 },
  avatarRing: {
    width:100, height:100, borderRadius:"50%",
    border:"4px solid rgba(255,255,255,0.7)",
    overflow:"hidden",
    boxShadow:"0 0 0 6px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.2)",
  },
  avatar:       { width:100, height:100, objectFit:"cover", display:"block" },
  photoLoading: { width:100, height:100, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.15)" },
  uploadBtn: {
    position:"absolute", bottom:0, right:0,
    width:28, height:28, borderRadius:"50%",
    background:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:13, cursor:"pointer",
    border:`2px solid ${T.orange}`,
    boxShadow:"0 2px 8px rgba(0,0,0,0.2)",
    zIndex:3,
  },

  /* Center column — name + roles + info */
  heroCenter: {
    flex:1,
    padding:"28px 30px",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    gap:12,
    borderRight:`1.5px solid ${T.border}`,
  },
  empName: {
    fontFamily:"'Poppins',sans-serif",
    fontSize:26, fontWeight:800, color:T.text,
    margin:0, lineHeight:1.2, letterSpacing:"-0.3px",
  },
  heroRoleRow: { display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" },
  heroDesigPill: {
    background:`linear-gradient(135deg,${T.orange},${T.pink})`,
    color:"#fff", fontSize:12, fontWeight:700,
    padding:"5px 14px", borderRadius:20,
  },
  heroDeptPill: {
    background:T.shade, color:T.orange,
    fontSize:12, fontWeight:700,
    padding:"5px 14px", borderRadius:20,
    border:`1px solid ${T.border}`,
  },
  heroIdRow: { display:"flex", gap:8, flexWrap:"wrap" },
  heroIdChip: {
    background:"#f8f5ff", color:"#555",
    fontSize:12, fontWeight:600,
    padding:"4px 12px", borderRadius:10,
    border:"1px solid #ede9fe",
  },

  /* Progress bar */
  heroProgressWrap: { display:"flex", flexDirection:"column", gap:5, marginTop:4 },
  heroProgressLabel: { fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.8px" },
  heroProgressBar: {
    height:6, background:"#ffe0cc", borderRadius:10, overflow:"hidden",
  },
  heroProgressFill: {
    height:"100%",
    background:`linear-gradient(90deg,${T.orange},${T.pink})`,
    borderRadius:10,
    transition:"width 1s ease",
  },

  /* Right column — stat stack */
  heroRight: {
    width:230,
    flexShrink:0,
    padding:"20px 18px",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    gap:10,
    background:"#fffcfb",
  },

  /* Keep these for Section components below */
  profileInfo: { flex:1, minWidth:200 },
  empDesig: { fontSize:16, color:T.orange, fontWeight:700, margin:"0 0 2px" },
  empDept:  { fontSize:14, color:T.muted,  fontWeight:500, margin:"0 0 10px" },
  badgeRow: { display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" },
  idBadge:  { background:T.shade, color:T.orange, fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, border:`1px solid ${T.border}` },

  /* Quick stats */
  quickStats: { display:"flex", flexDirection:"column", gap:12, minWidth:200 },
  quickStat:  { display:"flex", alignItems:"center", gap:10, background:T.shade, borderRadius:12, padding:"10px 14px", border:`1px solid ${T.border}` },
  quickIcon:  { fontSize:22 },
  quickLabel: { fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.8px" },
  quickVal:   { fontSize:14, fontWeight:700, color:T.text },

  /* Tabs */
  tabBar: {
    display:"flex", gap:8, overflowX:"auto",
    padding:"14px 16px",
    background:T.white,
    borderRadius:16,
    boxShadow:"0 2px 12px rgba(255,107,53,0.08)",
    border:`1.5px solid ${T.border}`,
    marginBottom:22,
    scrollbarWidth:"thin",
  },
  tab: {
    display:"flex", alignItems:"center", gap:7,
    padding:"10px 18px", minWidth:100,
    background:"#fff8f5", border:`1.5px solid ${T.border}`,
    borderRadius:10, cursor:"pointer",
    fontFamily:"'Nunito',sans-serif",
    whiteSpace:"nowrap", justifyContent:"center",
    color:T.muted, transition:"all 0.2s",
  },
  tabActive: {
    background:`linear-gradient(135deg,${T.orange},${T.pink})`,
    color:"#fff", borderColor:"transparent",
    boxShadow:`0 4px 14px rgba(247,37,133,0.25)`,
  },

  /* Sections */
  section: {
    background:T.white,
    borderRadius:20,
    padding:"24px 24px 20px",
    boxShadow:"0 4px 18px rgba(0,0,0,0.05)",
    border:`1.5px solid ${T.border}`,
    borderTop:`4px solid ${T.orange}`,
    position:"relative",
    overflow:"hidden",
  },
  sectionHead: { display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:14, borderBottom:`1.5px solid ${T.border}` },
  sectionIconWrap: { width:40, height:40, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" },
  sectionTitle: { fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, margin:0 },
  fieldGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 },

  /* Fields */
  field:     { display:"flex", flexDirection:"column", gap:5, transition:"all 0.2s" },
  fieldFull: { display:"flex", flexDirection:"column", gap:5, gridColumn:"1/-1", transition:"all 0.2s" },
  label: {
    fontSize:11, fontWeight:800, color:T.muted,
    textTransform:"uppercase", letterSpacing:"1px",
  },
  value: {
    fontSize:15, color:T.text, fontWeight:600,
    padding:"10px 12px", background:T.shade,
    borderRadius:10, minHeight:42,
    border:`1px solid ${T.border}`,
    transition:"color 0.2s",
  },
  input: {
    padding:"10px 12px", border:`1.5px solid ${T.border}`,
    borderRadius:10, fontSize:14, fontFamily:"'Nunito',sans-serif",
    background:"#fff", color:T.text, width:"100%",
    transition:"border-color 0.2s, box-shadow 0.2s",
  },
  select: {
    padding:"10px 12px", border:`1.5px solid ${T.border}`,
    borderRadius:10, fontSize:14, fontFamily:"'Nunito',sans-serif",
    background:"#fff", color:T.text, width:"100%", cursor:"pointer",
  },
  textarea: {
    padding:"10px 12px", border:`1.5px solid ${T.border}`,
    borderRadius:10, fontSize:14, fontFamily:"'Nunito',sans-serif",
    background:"#fff", color:T.text, width:"100%",
    resize:"vertical", minHeight:80,
  },

  /* Edit card */
  editCard: {
    background:T.white,
    borderRadius:20, padding:"26px 28px",
    marginBottom:22,
    boxShadow:"0 6px 24px rgba(255,107,53,0.12)",
    border:`2px solid ${T.orange}`,
  },
};

export { S as styles };
