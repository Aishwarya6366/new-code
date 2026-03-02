import api from "./api";
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import {
  FiHome, FiUser, FiCalendar,
  FiLogOut, FiSettings, FiEye, FiEyeOff,
  FiUsers, FiClock,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

import EmpProfile               from "./EmpProfile";
import EmpSalary                from "./EmpSalary";
import EmployeeHolidayCalendar  from "./EmployeeHolidayCalendar";
import ReportingManager         from "./ReportingManager";
import EmpLeaveManagement       from "./EmpLeaveManagement";

import "./EmpDashboard.css";

/* ─────────────────────────────────────────────────────────
   ANIMATED SVG ILLUSTRATIONS for the dashboard home
   ───────────────────────────────────────────────────────── */

/* Welcome hero right-side illustration: desk worker */
const WelcomeIllo = () => (
  <svg viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg"
    style={{width:150,height:120,position:"absolute",right:28,top:"50%",
      transform:"translateY(-50%)",pointerEvents:"none",zIndex:1,
      animation:"welcomeFloat 6s ease-in-out infinite"}}>
    {/* Desk */}
    <rect x="20" y="100" width="140" height="10" rx="5" fill="rgba(255,255,255,0.3)"/>
    <rect x="30"  y="110" width="8" height="22" rx="4" fill="rgba(255,255,255,0.2)"/>
    <rect x="142" y="110" width="8" height="22" rx="4" fill="rgba(255,255,255,0.2)"/>
    {/* Monitor */}
    <rect x="55" y="60" width="70" height="44" rx="6" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
    <rect x="60" y="65" width="60" height="30" rx="4" fill="rgba(255,255,255,0.15)"/>
    {/* Screen content lines */}
    <rect x="64" y="69" width="30" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
    <rect x="64" y="76" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.3)"/>
    <rect x="64" y="82" width="26" height="3" rx="1.5" fill="rgba(255,255,255,0.3)"/>
    {/* Monitor stand */}
    <rect x="85" y="104" width="10" height="8" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="78" y="110" width="24" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
    {/* Person */}
    <ellipse cx="140" cy="70" rx="18" ry="18" fill="#ffd166"/>
    <ellipse cx="140" cy="55" rx="16" ry="8" fill="#3b2200"/>
    <rect x="124" y="55" width="32" height="7" fill="#3b2200"/>
    <ellipse cx="133" cy="68" rx="3.5" ry="4" fill="#3b2200"/>
    <ellipse cx="147" cy="68" rx="3.5" ry="4" fill="#3b2200"/>
    <path d="M133 78 Q140 84 147 78" stroke="#3b2200" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="128" cy="74" rx="4.5" ry="3" fill="#ffb347" opacity="0.5"/>
    <ellipse cx="152" cy="74" rx="4.5" ry="3" fill="#ffb347" opacity="0.5"/>
    {/* Body */}
    <rect x="128" y="86" width="24" height="18" rx="6" fill="rgba(255,255,255,0.3)"/>
    <polygon points="140,88 136,98 144,98" fill="rgba(247,37,133,0.7)"/>
    {/* Waving hand */}
    <ellipse cx="120" cy="82" rx="8" ry="7" fill="#ffd166"/>
    {/* Confetti */}
    <rect x="22" y="30" width="10" height="10" rx="2" fill="rgba(255,255,255,0.25)" transform="rotate(20 27 35)"/>
    <rect x="45" y="18" width="8"  height="8"  rx="2" fill="rgba(255,209,102,0.5)"  transform="rotate(-15 49 22)"/>
    <rect x="100" y="15" width="9"  height="9"  rx="2" fill="rgba(255,255,255,0.2)"  transform="rotate(30 104 19)"/>
    <text x="26" y="58" fontSize="14" fill="rgba(255,255,255,0.35)">✦</text>
    <text x="105" y="45" fontSize="10" fill="rgba(255,209,102,0.5)">★</text>
  </svg>
);

/* Quick action tile icons as cartoon SVGs */
const IconLeave = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <rect x="6" y="10" width="36" height="32" rx="6" fill="currentColor" opacity="0.15"/>
    <rect x="6" y="10" width="36" height="32" rx="6" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="6"  width="4" height="8" rx="2" fill="currentColor"/>
    <rect x="30" y="6"  width="4" height="8" rx="2" fill="currentColor"/>
    <line x1="6" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <rect x="12" y="28" width="8" height="8" rx="2" fill="currentColor" opacity="0.7"/>
    <rect x="28" y="28" width="8" height="4" rx="2" fill="currentColor" opacity="0.4"/>
  </svg>
);

const IconSalary = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <rect x="4" y="10" width="40" height="28" rx="8" fill="currentColor" opacity="0.12"/>
    <rect x="4" y="10" width="40" height="28" rx="8" fill="none" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="24" cy="24" rx="9" ry="9" fill="currentColor" opacity="0.2"/>
    <text x="20" y="28" fontSize="12" fontWeight="900" fill="currentColor">₹</text>
    <rect x="8"  y="14" width="6" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>
    <rect x="34" y="31" width="6" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <rect x="6" y="10" width="36" height="32" rx="6" fill="currentColor" opacity="0.12"/>
    <rect x="6" y="10" width="36" height="32" rx="6" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="6" width="4" height="8" rx="2" fill="currentColor"/>
    <rect x="30" y="6" width="4" height="8" rx="2" fill="currentColor"/>
    <line x1="6" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    {[14,22,30,14,22].map((x,i) => (
      <rect key={i} x={x} y={i<3?28:36} width="5" height="5" rx="1.5"
        fill="currentColor" opacity={i===1||i===4?1:0.4}/>
    ))}
  </svg>
);

const IconTeam = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <ellipse cx="16" cy="18" rx="8" ry="8" fill="currentColor" opacity="0.6"/>
    <ellipse cx="32" cy="18" rx="8" ry="8" fill="currentColor" opacity="0.9"/>
    <path d="M4 38 Q4 28 16 28 Q24 28 24 34" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
    <path d="M44 38 Q44 28 32 28 Q22 28 22 36" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────
   MAIN CLASS COMPONENT  — all logic 100% identical
   ───────────────────────────────────────────────────────── */
export default class EmpDashboard extends Component {
  state = {
    activePage:         "dashboard",
    showMenu:           false,
    showChangePassword: false,
    showNewPassword:    false,
    showConfirmPassword:false,
    password:           "",
    confirmPassword:    "",
    message:            "",
    logout:             false,
    leaveBalance:       [],
  };

  componentDidMount() {
    this.fetchLeaveBalance();
  }

  fetchLeaveBalance = async () => {
    try {
      const response = await fetch(`/api/leave-status/my-balance`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        this.setState({ leaveBalance: data });
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    }
  };

  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  toggleMenu = () => this.setState({ showMenu: !this.state.showMenu });

  handleNavigation = (page) => this.setState({ activePage: page, showMenu: false });

  logout = () => {
    fetch("/logout", { method: "POST", credentials: "include" })
      .then(() => this.setState({ logout: true }));
  };

  submitPassword = () => {
    const { password, confirmPassword } = this.state;
    if (!password || !confirmPassword) {
      this.setState({ message: "Please fill all fields" }); return;
    }
    if (!this.passwordRegex.test(password)) {
      this.setState({ message: "Password must be 8+ chars with uppercase, lowercase, number & special character" }); return;
    }
    if (password !== confirmPassword) {
      this.setState({ message: "Passwords do not match" }); return;
    }
    fetch("/password", {
      method: "PUT", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then(res => { if (!res.ok) throw new Error(); return res.text(); })
      .then(() => this.setState({
        message: "✓ Password changed successfully",
        showChangePassword: false,
        password: "", confirmPassword: "",
      }))
      .catch(() => this.setState({ message: "✗ Failed to update password" }));
  };

  renderContent() {
    switch (this.state.activePage) {
      case "profile":                  return <EmpProfile />;
      case "salary":                   return <EmpSalary />;
      case "empleavemanagement":       return <EmpLeaveManagement />;
      case "EmployeeHolidayCalendar":  return <EmployeeHolidayCalendar />;
      case "reportingmanager":         return <ReportingManager />;
      default:                         return this.renderDashboardHome();
    }
  }

  renderDashboardHome() {
    const { leaveBalance } = this.state;

    const quickActions = [
      { label:"Apply Leave",        page:"empleavemanagement",      icon:<IconLeave/>,    color:"#ff6b35" },
      { label:"View Payslip",       page:"salary",                  icon:<IconSalary/>,   color:"#f72585" },
      { label:"Holiday Calendar",   page:"EmployeeHolidayCalendar", icon:<IconCalendar/>, color:"#7209b7" },
      { label:"Reporting Manager",  page:"reportingmanager",        icon:<IconTeam/>,     color:"#ff9a6c" },
    ];

    return (
      <div className="dashboard-home">

        {/* ── Welcome Hero ── */}
        <div className="welcome-card">
          <div className="welcome-text">
            <h2>Welcome Back! 👋</h2>
            <p>Employee Dashboard</p>
          </div>
          <WelcomeIllo/>
          <div className="welcome-deco"></div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="actions-grid">
            {quickActions.map(({ label, page, icon, color }) => (
              <button
                key={page}
                className="action-btn"
                style={{ "--accent": color }}
                onClick={() => this.handleNavigation(page)}
              >
                <div className="action-icon" style={{ color }}>
                  {icon}
                </div>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

       
          
        
      </div>
    );
  }

  render() {
    if (this.state.logout) return <Navigate to="/" replace />;

    const menuItems = [
      { key:"dashboard",              label:"Dashboard",         icon:<FiHome/>     },
      { key:"profile",                label:"My Profile",        icon:<FiUser/>     },
      { key:"salary",                 label:"Salary",            icon:<FaRupeeSign/>},
      { key:"empleavemanagement",     label:"Leave",             icon:<FiClock/>    },
      { key:"EmployeeHolidayCalendar",label:"Holidays",          icon:<FiCalendar/> },
      { key:"reportingmanager",       label:"Reporting Manager", icon:<FiUsers/>    },
    ];

    return (
      <div className="emp-dashboard">

        {/* ══ HEADER ══ */}
        <header className="emp-header">
          <div className="header-left">
            <div className="header-logo-wrap">
              
              <h3>HRMS PORTAL</h3>
            </div>
          </div>

          <div className="header-profile-section">
            <div className="emp-profile-icon" onClick={this.toggleMenu}>
              <FiUser size={20}/>
            </div>

            <button className="emp-logout-btn" onClick={this.logout}>
              <FiLogOut size={15}/>
              <span className="logout-text">Logout</span>
            </button>

            {this.state.showMenu && (
              <div className="emp-profile-menu">
                <div
                  className="emp-menu-item"
                  onClick={() => this.setState({ showChangePassword:true, showMenu:false, message:"" })}
                >
                  <FiSettings size={16}/>
                  <span>Change Password</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ══ TOP NAVIGATION BAR  (replaces sidebar) ══ */}
        <nav className="emp-navbar">
          {menuItems.map(({ key, label, icon }) => (
            <div
              key={key}
              className={`emp-nav-item${this.state.activePage === key ? " active" : ""}`}
              onClick={() => this.handleNavigation(key)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </div>
          ))}
        </nav>

        {/* ══ MAIN CONTENT ══ */}
        <main className="emp-content">
          {this.renderContent()}
        </main>

        {/* ══ FOOTER ══ */}
        <footer className="emp-footer">
          © 2026 VentureBiz — HR Management System
        </footer>

        {/* ══ CHANGE PASSWORD MODAL ══ */}
        {this.state.showChangePassword && (
          <div className="emp-modal-overlay">
            <div className="emp-modal-box">

              <div className="modal-header">
                <h4>🔒 Change Password</h4>
                <button
                  className="close-modal"
                  onClick={() => this.setState({ showChangePassword:false, password:"", confirmPassword:"", message:"" })}
                >×</button>
              </div>

              <div className="modal-body">
                <div className="password-field">
                  <label>New Password</label>
                  <div className="input-with-icon">
                    <input
                      type={this.state.showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={this.state.password}
                      maxLength={20}
                      onChange={e => this.setState({ password: e.target.value })}
                    />
                    <button
                      className="toggle-visibility"
                      onClick={() => this.setState({ showNewPassword: !this.state.showNewPassword })}
                    >
                      {this.state.showNewPassword ? <FiEyeOff/> : <FiEye/>}
                    </button>
                  </div>
                </div>

                <div className="password-field">
                  <label>Confirm Password</label>
                  <div className="input-with-icon">
                    <input
                      type={this.state.showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={this.state.confirmPassword}
                      maxLength={20}
                      onChange={e => this.setState({ confirmPassword: e.target.value })}
                    />
                    <button
                      className="toggle-visibility"
                      onClick={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}
                    >
                      {this.state.showConfirmPassword ? <FiEyeOff/> : <FiEye/>}
                    </button>
                  </div>
                </div>

                <div className="password-hint">
                  Must contain uppercase, lowercase, number &amp; special character
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-primary" onClick={this.submitPassword}>
                  Update Password
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => this.setState({ showChangePassword:false, password:"", confirmPassword:"", message:"" })}
                >
                  Cancel
                </button>
              </div>

              {this.state.message && (
                <p className={`message-text ${this.state.message.includes("✓") ? "success" : "error"}`}>
                  {this.state.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
