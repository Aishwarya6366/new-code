import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import companyLogo from "./assets/download.png";
import { FiDownload, FiCalendar, FiFileText} from "react-icons/fi";

// ══════════════════════════════════════════════════════════════
//  FLOATING MOVIE-POSTER STYLE ANIMATED SVG IMAGES
//  (only addition — zero changes to original code below)
// ══════════════════════════════════════════════════════════════

/** Inject all keyframe animations into <head> once */
const InjectFloatStyles = () => {
  useEffect(() => {
    const id = "__float_anim_styles__";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      /* ── Float paths ── */
      @keyframes imgFloat1 {
        0%   { transform: translateY(0px)   rotate(-3deg) scale(1); }
        100% { transform: translateY(-24px) rotate(3deg)  scale(1.04); }
      }
      @keyframes imgFloat2 {
        0%   { transform: translateY(-10px) rotate(2deg)  scale(1.02); }
        100% { transform: translateY(14px)  rotate(-3deg) scale(1); }
      }
      @keyframes imgFloat3 {
        0%   { transform: translateY(0px)   rotate(1deg)  scale(1); }
        100% { transform: translateY(-18px) rotate(-2deg) scale(1.03); }
      }
      @keyframes imgFloat4 {
        0%   { transform: translateY(-8px)  rotate(-1deg); }
        100% { transform: translateY(16px)  rotate(2deg); }
      }
      @keyframes imgFloat5 {
        0%   { transform: translateX(0px)   rotate(-2deg); }
        100% { transform: translateX(-12px) rotate(2deg); }
      }
      @keyframes imgFloat6 {
        0%   { transform: translateY(0px)   scale(1)    rotate(0deg); }
        100% { transform: translateY(-20px) scale(1.05) rotate(-2deg); }
      }
      /* ── Sparkle blink ── */
      @keyframes spkBlink {
        0%,100% { opacity: 0.3; transform: scale(1);   }
        50%     { opacity: 1;   transform: scale(1.8); }
      }
      /* ── Ripple pulse ── */
      @keyframes ripplePulse {
        0%   { transform: scale(1);   opacity: 0.5; }
        100% { transform: scale(2.4); opacity: 0;   }
      }
      /* ── Bar rise on load ── */
      @keyframes barRiseAnim {
        from { transform: scaleY(0); }
        to   { transform: scaleY(1); }
      }
      /* ── Download arrow bounce ── */
      @keyframes arrowBounceAnim {
        0%,100% { transform: translateY(0px); }
        50%     { transform: translateY(7px); }
      }
      /* ── Orbit rings spin ── */
      @keyframes orbitSpin  { from { transform: rotate(0deg); }   to { transform: rotate(360deg);  } }
      @keyframes orbitSpinR { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
      /* ── Ambient orb drift ── */
      @keyframes ambOrb {
        0%   { transform: translate(0,0)     scale(1); }
        100% { transform: translate(22px,-18px) scale(1.07); }
      }
      @keyframes ambOrbR {
        0%   { transform: translate(0,0)        scale(1); }
        100% { transform: translate(-18px,20px) scale(1.05); }
      }
    `;
    document.head.appendChild(el);
  }, []);
  return null;
};

/* ─── FLOATING IMAGE 1: Gold Rupee Coin Tower ───────────────── */
const ImgCoinTower = ({ style }) => (
  <svg width="115" height="145" viewBox="0 0 115 145" fill="none" style={style}>
    <defs>
      <linearGradient id="ct1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fbbf24"/><stop offset="1" stopColor="#d97706"/></linearGradient>
      <linearGradient id="ct2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fcd34d"/><stop offset="1" stopColor="#f59e0b"/></linearGradient>
      <linearGradient id="ct3" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fde68a"/><stop offset="1" stopColor="#fbbf24"/></linearGradient>
    </defs>
    {/* Coin back */}
    <ellipse cx="70" cy="46" rx="27" ry="8"  fill="#92400e" opacity="0.35"/>
    <circle  cx="70" cy="36" r="27" fill="url(#ct1)"/>
    <circle  cx="70" cy="36" r="21" fill="none" stroke="#fef3c7" strokeWidth="2"   opacity="0.5"/>
    <text x="70" y="42" textAnchor="middle" fill="white" fontSize="19" fontFamily="Georgia,serif" fontWeight="bold">₹</text>
    {/* Coin mid */}
    <ellipse cx="54" cy="74" rx="24" ry="7"  fill="#78350f" opacity="0.3"/>
    <circle  cx="54" cy="65" r="24" fill="url(#ct2)"/>
    <circle  cx="54" cy="65" r="18" fill="none" stroke="#fef9c3" strokeWidth="1.5" opacity="0.45"/>
    <text x="54" y="70" textAnchor="middle" fill="white" fontSize="15" fontFamily="Georgia,serif" fontWeight="bold">₹</text>
    {/* Coin front */}
    <ellipse cx="38" cy="100" rx="19" ry="6" fill="#7c2d12" opacity="0.28"/>
    <circle  cx="38" cy="92"  r="19" fill="url(#ct3)"/>
    <circle  cx="38" cy="92"  r="14" fill="none" stroke="#fff7ed" strokeWidth="1.5" opacity="0.4"/>
    <text x="38" y="97" textAnchor="middle" fill="white" fontSize="12" fontFamily="Georgia,serif" fontWeight="bold">₹</text>
    {/* Ground shadow */}
    <ellipse cx="55" cy="124" rx="38" ry="7" fill="#d97706" opacity="0.12"/>
    {/* Sparkle dots */}
    {[[104,14,3.5],[8,38,2.5],[110,72,2],[12,104,2.5],[98,108,2]].map(([x,y,r],i)=>(
      <circle key={i} cx={x} cy={y} r={r} fill="#fbbf24"
        style={{animation:`spkBlink ${1.3+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.4}s`}}/>
    ))}
  </svg>
);

/* ─── FLOATING IMAGE 2: Cinematic Payslip PDF Card ─────────── */
const ImgPayslipCard = ({ style }) => (
  <svg width="112" height="140" viewBox="0 0 112 140" fill="none" style={style}>
    <defs>
      <linearGradient id="pc1" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#3730a3"/></linearGradient>
      <linearGradient id="pc2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f97316"/><stop offset="1" stopColor="#dc2626"/></linearGradient>
    </defs>
    <ellipse cx="56" cy="136" rx="36" ry="6" fill="#3730a3" opacity="0.1"/>
    {/* Card body */}
    <rect x="6" y="6"  width="90" height="118" rx="10" fill="url(#pc1)"/>
    {/* Sheen */}
    <rect x="6" y="6"  width="90" height="30"  rx="10" fill="white" opacity="0.06"/>
    {/* Fold corner */}
    <path d="M72 6 L96 30 L72 30 Z" fill="white" opacity="0.1"/>
    <path d="M72 6 L96 30" stroke="white" strokeWidth="1" opacity="0.18"/>
    {/* PDF badge */}
    <rect x="12" y="14" width="38" height="15" rx="5" fill="url(#pc2)"/>
    <text x="31" y="24.5" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial" fontWeight="bold">PAYSLIP</text>
    {/* Content rows */}
    {[40,52,64,76].map((y,i)=>(
      <rect key={y} x="12" y={y} width={[62,52,58,44][i]} height="3.5" rx="1.5" fill="white" opacity={[0.45,0.32,0.28,0.22][i]}/>
    ))}
    {/* Net pay box */}
    <rect x="12" y="90" width="78" height="20" rx="6" fill="white" opacity="0.1"/>
    <text x="51" y="104" textAnchor="middle" fill="white" fontSize="9" fontFamily="Arial" fontWeight="bold">NET PAY  ₹ ——</text>
    {/* Stamp */}
    <circle cx="80" cy="114" r="12" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7"/>
    <text x="80" y="118" textAnchor="middle" fill="#a5b4fc" fontSize="12" fontWeight="bold">✓</text>
    {/* Sparkles */}
    {[[4,22,2.5],[102,40,2],[4,94,2.5],[102,106,2]].map(([x,y,r],i)=>(
      <circle key={i} cx={x} cy={y} r={r} fill="#818cf8"
        style={{animation:`spkBlink ${1.5+i*0.35}s ease-in-out infinite`,animationDelay:`${i*0.5}s`}}/>
    ))}
  </svg>
);

/* ─── FLOATING IMAGE 3: Animated Salary Bar Chart ───────────── */
const ImgBarChart = ({ style }) => (
  <svg width="130" height="105" viewBox="0 0 130 105" fill="none" style={style}>
    <defs>
      <linearGradient id="bc1" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#10b981"/><stop offset="1" stopColor="#6ee7b7" stopOpacity="0.25"/></linearGradient>
      <linearGradient id="bc2" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#fcd34d" stopOpacity="0.25"/></linearGradient>
      <linearGradient id="bc3" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a5b4fc" stopOpacity="0.25"/></linearGradient>
      <linearGradient id="bc4" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#93c5fd" stopOpacity="0.25"/></linearGradient>
      <linearGradient id="bc5" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f97316"/><stop offset="1" stopColor="#fdba74" stopOpacity="0.25"/></linearGradient>
    </defs>
    {/* Grid */}
    <line x1="10" y1="85" x2="122" y2="85" stroke="#e2e8f0" strokeWidth="1"/>
    <line x1="10" y1="10" x2="10"  y2="85" stroke="#e2e8f0" strokeWidth="1"/>
    {[25,45,65].map(y=><line key={y} x1="10" y1={y} x2="122" y2={y} stroke="#f1f5f9" strokeWidth="0.8" strokeDasharray="3 4"/>)}
    {/* Bars */}
    {[
      {x:16,h:36,g:"bc1",d:"0s"},{x:36,h:54,g:"bc2",d:"0.1s"},
      {x:56,h:42,g:"bc3",d:"0.2s"},{x:76,h:62,g:"bc4",d:"0.3s"},{x:96,h:48,g:"bc5",d:"0.4s"}
    ].map(({x,h,g,d})=>(
      <rect key={x} x={x} y={85-h} width="18" height={h} rx="5" fill={`url(#${g})`}
        style={{animation:`barRiseAnim 1.4s ease both`,animationDelay:d,transformOrigin:`${x+9}px 85px`}}/>
    ))}
    {/* Trend line + dots */}
    <polyline points="25,49 45,31 65,43 85,23 105,37"
      stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
    {[25,45,65,85,105].map((cx,i)=>(
      <circle key={cx} cx={cx} cy={[49,31,43,23,37][i]} r="3.5" fill="#f97316" opacity="0.9"/>
    ))}
    {/* Axis label */}
    <text x="8" y="18" fill="#94a3b8" fontSize="8" fontFamily="Arial">₹</text>
    {/* Month labels */}
    {["Jan","Feb","Mar","Apr","May"].map((m,i)=>(
      <text key={m} x={25+i*20} y="97" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="Arial">{m}</text>
    ))}
  </svg>
);

/* ─── FLOATING IMAGE 4: Office Building (payroll scene) ─────── */
const ImgOfficeBuilding = ({ style }) => (
  <svg width="112" height="136" viewBox="0 0 112 136" fill="none" style={style}>
    <defs>
      <linearGradient id="ob1" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#1e40af"/></linearGradient>
      <linearGradient id="ob2" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#2563eb"/></linearGradient>
    </defs>
    {/* Ground */}
    <rect x="0" y="122" width="112" height="14" rx="5" fill="#dbeafe" opacity="0.45"/>
    {/* Building A */}
    <rect x="6"  y="48" width="46" height="74" rx="4" fill="url(#ob1)"/>
    <rect x="6"  y="48" width="46" height="14" rx="4" fill="white" opacity="0.06"/>
    {/* Roof A */}
    <polygon points="29,16 6,48 52,48" fill="#1d4ed8"/>
    {/* Antenna */}
    <line x1="29" y1="4"  x2="29" y2="16" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="29" cy="4" r="3.5" fill="#f97316"
      style={{animation:"spkBlink 1.4s ease-in-out infinite"}}/>
    {/* Building B */}
    <rect x="60" y="64" width="46" height="58" rx="4" fill="url(#ob2)"/>
    {/* Windows A */}
    {[[12,62],[26,62],[12,78],[26,78],[12,94],[26,94],[12,110],[26,110]].map(([x,y])=>(
      <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" fill="#bfdbfe" opacity="0.85"/>
    ))}
    {/* Windows B */}
    {[[66,76],[80,76],[66,92],[80,92],[66,108],[80,108]].map(([x,y])=>(
      <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" fill="#e0f2fe" opacity="0.85"/>
    ))}
    {/* Door */}
    <rect x="22" y="108" width="14" height="14" rx="2" fill="#1e40af" opacity="0.8"/>
    <circle cx="34" cy="115" r="1.5" fill="#93c5fd"/>
    {/* Cloud */}
    <ellipse cx="86" cy="32" rx="16" ry="10" fill="white" opacity="0.35"/>
    <ellipse cx="98" cy="27" rx="12" ry="8"  fill="white" opacity="0.28"/>
    <ellipse cx="74" cy="28" rx="10" ry="7"  fill="white" opacity="0.22"/>
    {/* Stars */}
    {[[102,50,2],[4,80,1.8]].map(([x,y,r],i)=>(
      <circle key={i} cx={x} cy={y} r={r} fill="#60a5fa" opacity="0.6"
        style={{animation:`spkBlink ${1.6+i*0.4}s ease-in-out infinite`,animationDelay:`${i*0.5}s`}}/>
    ))}
  </svg>
);

/* ─── FLOATING IMAGE 5: Download Pulse Circle ───────────────── */
const ImgDownloadCircle = ({ style }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={style}>
    <defs>
      <linearGradient id="dc1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#667eea"/><stop offset="1" stopColor="#764ba2"/></linearGradient>
    </defs>
    {/* Ripple rings */}
    <circle cx="50" cy="50" r="46" stroke="#667eea" strokeWidth="1.5" fill="none" opacity="0.22"
      style={{animation:"ripplePulse 2.2s ease-out infinite"}}/>
    <circle cx="50" cy="50" r="46" stroke="#667eea" strokeWidth="1.2" fill="none" opacity="0.12"
      style={{animation:"ripplePulse 2.2s ease-out infinite",animationDelay:"0.7s"}}/>
    {/* Layers */}
    <circle cx="50" cy="50" r="40" fill="url(#dc1)" opacity="0.14"/>
    <circle cx="50" cy="50" r="32" fill="url(#dc1)" opacity="0.2"/>
    <circle cx="50" cy="50" r="24" fill="url(#dc1)" opacity="0.88"/>
    {/* Arrow */}
    <g style={{animation:"arrowBounceAnim 1.3s ease-in-out infinite"}}>
      <path d="M50 35 L50 56 M42 49 L50 58 L58 49"
        stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <text x="50" y="82" textAnchor="middle" fill="#667eea" fontSize="9" fontFamily="Arial" fontWeight="bold">PDF</text>
  </svg>
);

/* ─── FLOATING IMAGE 6: Wallet with Cards ───────────────────── */
const ImgWallet = ({ style }) => (
  <svg width="124" height="96" viewBox="0 0 124 96" fill="none" style={style}>
    <defs>
      <linearGradient id="wl1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#667eea"/><stop offset="1" stopColor="#764ba2"/></linearGradient>
      <linearGradient id="wl2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fbbf24"/><stop offset="1" stopColor="#d97706"/></linearGradient>
    </defs>
    <ellipse cx="62" cy="92" rx="46" ry="6" fill="#764ba2" opacity="0.1"/>
    {/* Body */}
    <rect x="4" y="26" width="116" height="60" rx="10" fill="url(#wl1)"/>
    {/* Flap */}
    <rect x="4" y="10" width="70" height="28" rx="8" fill="#764ba2"/>
    <rect x="4" y="28" width="70" height="10" fill="#764ba2"/>
    {/* Card slot */}
    <rect x="78" y="36" width="36" height="26" rx="7" fill="white" opacity="0.1"/>
    {/* Debit card */}
    <rect x="80" y="38" width="32" height="20" rx="5" fill="url(#wl2)" opacity="0.9"/>
    <rect x="80" y="38" width="32" height="7"  rx="5" fill="white" opacity="0.08"/>
    <rect x="82" y="40" width="12" height="8"  rx="2" fill="#fef3c7" opacity="0.55"/>
    <circle cx="104" cy="48" r="5" fill="none" stroke="#fff7ed" strokeWidth="1" opacity="0.45"/>
    <circle cx="104" cy="48" r="3" fill="none" stroke="#fff7ed" strokeWidth="0.7" opacity="0.3"/>
    {/* Cash lines */}
    <rect x="12" y="42" width="52" height="4" rx="2" fill="white" opacity="0.32"/>
    <rect x="12" y="52" width="40" height="4" rx="2" fill="white" opacity="0.22"/>
    <rect x="12" y="62" width="30" height="4" rx="2" fill="white" opacity="0.16"/>
    {/* Rupee */}
    <text x="20" y="78" fill="#c4b5fd" fontSize="18" fontFamily="Georgia,serif" fontWeight="bold" opacity="0.55">₹</text>
    {/* Sparkles */}
    {[[3,18,2.5],[116,18,2],[3,74,2],[116,76,2.5]].map(([x,y,r],i)=>(
      <circle key={i} cx={x} cy={y} r={r} fill="#a78bfa"
        style={{animation:`spkBlink ${1.5+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.45}s`}}/>
    ))}
  </svg>
);

/* ─── FLOATING IMAGE 7: Calendar Widget ─────────────────────── */
const ImgCalendar = ({ style }) => (
  <svg width="104" height="112" viewBox="0 0 104 112" fill="none" style={style}>
    <defs>
      <linearGradient id="cal1" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#667eea"/><stop offset="1" stopColor="#764ba2"/></linearGradient>
    </defs>
    <ellipse cx="52" cy="108" rx="34" ry="5" fill="#764ba2" opacity="0.1"/>
    {/* Card */}
    <rect x="6" y="18" width="92" height="84" rx="10" fill="white" stroke="#ede9fe" strokeWidth="1.5"/>
    {/* Header */}
    <rect x="6" y="18" width="92" height="28" rx="10" fill="url(#cal1)"/>
    <rect x="6" y="38" width="92" height="8"  fill="url(#cal1)"/>
    {/* Binding pins */}
    <rect x="28" y="8"  width="8" height="22" rx="4" fill="#7c3aed"/>
    <rect x="68" y="8"  width="8" height="22" rx="4" fill="#7c3aed"/>
    {/* Month label */}
    <text x="52" y="36" textAnchor="middle" fill="white" fontSize="10" fontFamily="Arial" fontWeight="bold">THIS MONTH</text>
    {/* Day headers */}
    {["M","T","W","T","F","S","S"].map((d,i)=>(
      <text key={i} x={20+i*11} y="58" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="Arial" fontWeight="bold">{d}</text>
    ))}
    {/* Day grid */}
    {Array.from({length:21},(_,i)=>i+1).map((n,i)=>{
      const col=i%7, row=Math.floor(i/7);
      const isHL = n===15;
      return (
        <g key={n}>
          {isHL && <circle cx={20+col*11} cy={68+row*10} r="6.5" fill="#667eea"/>}
          <text x={20+col*11} y={71+row*10} textAnchor="middle"
            fill={isHL?"white":"#475569"} fontSize="7.5" fontFamily="Arial"
            fontWeight={isHL?"bold":"normal"}>{n}</text>
        </g>
      );
    })}
  </svg>
);

/* ─── FLOATING IMAGE 8: Orbit Rings Decoration ──────────────── */
const ImgOrbitRings = ({ style, color="#667eea" }) => (
  <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={style}>
    <circle cx="45" cy="45" r="40" stroke={color} strokeWidth="1.5" strokeDasharray="10 7" fill="none"
      style={{animation:"orbitSpin 14s linear infinite"}}/>
    <circle cx="45" cy="45" r="28" stroke={color} strokeWidth="1"   strokeDasharray="6 9"  fill="none"
      style={{animation:"orbitSpinR 10s linear infinite"}}/>
    <circle cx="45" cy="45" r="14" stroke={color} strokeWidth="0.8" strokeDasharray="4 6"  fill="none"
      style={{animation:"orbitSpin 7s linear infinite"}}/>
    <circle cx="45" cy="45" r="5" fill={color} opacity="0.25"/>
    {/* Planet dots */}
    <circle cx="85" cy="45" r="4.5" fill={color} opacity="0.7"/>
    <circle cx="45" cy="5"  r="3.5" fill={color} opacity="0.5"/>
    <circle cx="5"  cy="45" r="4"   fill={color} opacity="0.6"/>
  </svg>
);

/* ─── FLOATING IMAGE 9: Salary Slip Paper ───────────────────── */
const ImgSalarySlip = ({ style }) => (
  <svg width="98" height="122" viewBox="0 0 98 122" fill="none" style={style}>
    <defs>
      <linearGradient id="ss1" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f0fdf4"/><stop offset="1" stopColor="#dcfce7"/></linearGradient>
    </defs>
    <ellipse cx="49" cy="118" rx="34" ry="5" fill="#16a34a" opacity="0.09"/>
    {/* Paper */}
    <rect x="4" y="4" width="90" height="110" rx="8" fill="url(#ss1)" stroke="#bbf7d0" strokeWidth="1.5"/>
    {/* Header */}
    <rect x="4" y="4"  width="90" height="24" rx="8" fill="#16a34a" opacity="0.16"/>
    <rect x="4" y="20" width="90" height="8"  fill="#16a34a" opacity="0.16"/>
    {/* Logo chip */}
    <rect x="14" y="9" width="24" height="12" rx="3" fill="#16a34a" opacity="0.28"/>
    <text x="26" y="18" textAnchor="middle" fill="#15803d" fontSize="7" fontFamily="Arial" fontWeight="bold">COMPANY</text>
    {/* Title */}
    <text x="49" y="32" textAnchor="middle" fill="#15803d" fontSize="8.5" fontFamily="Arial" fontWeight="bold">SALARY SLIP</text>
    {/* Table rows */}
    {[40,52,64,76].map((y,i)=>(
      <g key={y}>
        <rect x="8" y={y} width="82" height="10" rx="2" fill={i%2===0?"#f0fdf4":"white"} opacity="0.8"/>
        <rect x="10" y={y+2.5} width="26" height="5" rx="1.5" fill="#86efac" opacity="0.65"/>
        <rect x="60" y={y+2.5} width="24" height="5" rx="1.5" fill="#6ee7b7" opacity="0.55"/>
      </g>
    ))}
    {/* Net pay highlight */}
    <rect x="8" y="90" width="82" height="14" rx="5" fill="#16a34a" opacity="0.11"/>
    <text x="49" y="100" textAnchor="middle" fill="#15803d" fontSize="9" fontFamily="Arial" fontWeight="bold">NET PAY  ₹</text>
    {/* Sig line */}
    <line x1="12" y1="110" x2="50" y2="110" stroke="#86efac" strokeWidth="1"/>
    <text x="31" y="118" textAnchor="middle" fill="#86efac" fontSize="6.5" fontFamily="Arial">Signature</text>
    {/* Seal */}
    <circle cx="78" cy="110" r="10" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.55"/>
    <text x="78" y="114" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="bold">✓</text>
  </svg>
);

/* ─── Ambient background orbs ────────────────────────────────── */
const AmbientBackground = () => (
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
    {/* Soft color orbs */}
    {[
      {w:380,h:380,top:"-80px", left:"-70px", c:"rgba(99,102,241,0.07)",  a:"ambOrb  10s ease-in-out infinite alternate"},
      {w:320,h:320,bottom:"-70px",right:"-60px",c:"rgba(16,185,129,0.06)",a:"ambOrbR 12s ease-in-out infinite alternate"},
      {w:240,h:240,top:"38%",  left:"4%",     c:"rgba(249,115,22,0.05)", a:"ambOrb  8s ease-in-out infinite alternate 2s"},
      {w:190,h:190,top:"18%",  right:"6%",    c:"rgba(139,92,246,0.06)", a:"ambOrbR 9s ease-in-out infinite alternate 1s"},
    ].map((o,i)=>(
      <div key={i} style={{
        position:"absolute",width:o.w,height:o.h,borderRadius:"50%",
        background:`radial-gradient(circle,${o.c},transparent)`,
        top:o.top,left:o.left,bottom:o.bottom,right:o.right,animation:o.a,
      }}/>
    ))}
    {/* Subtle dot grid */}
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}
      viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      {Array.from({length:10}).map((_,r)=>Array.from({length:18}).map((_,c)=>(
        <circle key={`${r}-${c}`} cx={c*68+12} cy={r*80+12} r="1.6" fill="#667eea" opacity="0.045"/>
      )))}
    </svg>
  </div>
);

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT — ORIGINAL CODE, ZERO CHANGES TO FUNCTIONS
// ══════════════════════════════════════════════════════════════

const EmpSalary = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- Month Formatter ---------- */
  const formatMonthToWords = (yearMonth) => {
    if (!yearMonth) return "";
    const [year, month] = yearMonth.split("-");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  /* ---------- Number to Words ---------- */
  const numberToWords = (num) => {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
      "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return a[Math.floor(n / 100)] + " Hundred" +
          (n % 100 ? " and " + inWords(n % 100) : "");
      if (n < 100000)
        return inWords(Math.floor(n / 1000)) + " Thousand" +
          (n % 1000 ? " " + inWords(n % 1000) : "");
      return "";
    };

    return `${inWords(Math.floor(num))} Rupees Only`;
  };

  /* ---------- Download Payslip PDF ---------- */
  const downloadPayslipPDF = async () => {
    if (!selectedMonth) {
      setMessage("Please select month");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const [year, month] = selectedMonth.split("-");

      const res = await axios.get(
        `/api/salary/emp/payslip?month=${month}&year=${year}`,
        { withCredentials: true }
      );

      const data = res.data;

      const doc = new jsPDF();
      doc.setFont("times");

      const pdfWidth = doc.internal.pageSize.getWidth();

      const imgProps = doc.getImageProperties(companyLogo);
      const logoWidth = 25;
      const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
      doc.addImage(companyLogo, "PNG", pdfWidth / 2 - logoWidth / 2, 10, logoWidth, logoHeight);

      doc.setFontSize(16);
      doc.setFont("times", "bold");
      doc.text("Venturebiz Promotions Private Limited", pdfWidth / 2, 35, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("times", "normal");
      doc.text(
        "#2085/16, 2nd Floor, Spoorthi, Wilson Garden Society Layout,",
        pdfWidth / 2,
        42,
        { align: "center" }
      );
      doc.text(
        "Puttenahalli Main Road, JP Nagar 7th Phase, Bangalore-560078.",
        pdfWidth / 2,
        48,
        { align: "center" }
      );

      doc.setFontSize(12);
      doc.text(
        `Payslip for the month of ${formatMonthToWords(selectedMonth)}`,
        pdfWidth / 2,
        58,
        { align: "center" }
      );

      autoTable(doc, {
        startY: 65,
        theme: "grid",
        styles: { font: "times", fontSize: 9 },
        body: [
          ["Name", data.name, "Department", data.department],
          ["Designation", data.designation, "Location", data.location],
          ["Date of Joining", data.dateOfJoining, "Worked Days", data.workedDays],
          ["Days in Month", data.totalDays, "PF No", data.pfNo],
          ["ESI No", data.esiNo, "", ""]
        ]
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["EARNINGS", "AMOUNT", "DEDUCTIONS", "AMOUNT"]],
        theme: "grid",
        styles: { font: "times", fontSize: 9 },
        headStyles: { fillColor: [40, 40, 40] },
        body: [
          ["Basic", data.basic.toFixed(2), "PF", data.pf.toFixed(2)],
          ["HRA", data.hra.toFixed(2), "", ""],
          ["Conveyance", data.conveyance.toFixed(2), "", ""],
          ["Total Earnings", data.grossPay.toFixed(2), "Total Deductions", data.pf.toFixed(2)]
        ]
      });

      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFont("times", "bold");
      doc.text("Net Pay :", 14, finalY);
      doc.text(data.netPay.toFixed(2), 170, finalY);

      doc.setFont("times", "normal");
      doc.text(`*${numberToWords(data.netPay)}*`, 14, finalY + 8);

      doc.setFontSize(9);
      doc.text(
        "This is a system generated payslip and does not require signature",
        pdfWidth / 2,
        finalY + 20,
        { align: "center" }
      );

      doc.save(`Payslip_${month}_${year}.pdf`);
    } catch (err) {
      setMessage("Failed to download payslip");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* ── New additions: animations + background + floating images ── */}
      <InjectFloatStyles />
      <AmbientBackground />

      {/* ── LEFT floating column ── */}
      <div style={floatCol.left}>
        <ImgCoinTower    style={{animation:"imgFloat1 3.4s ease-in-out infinite alternate"}} />
        <ImgBarChart     style={{animation:"imgFloat2 4.1s ease-in-out infinite alternate", marginTop:18}} />
        <ImgWallet       style={{animation:"imgFloat3 3.7s ease-in-out infinite alternate", marginTop:14}} />
        <ImgOrbitRings   style={{animation:"imgFloat4 5.2s ease-in-out infinite alternate", marginTop:10}} color="#667eea"/>
      </div>

      {/* ── RIGHT floating column ── */}
      <div style={floatCol.right}>
        <ImgPayslipCard    style={{animation:"imgFloat2 3.6s ease-in-out infinite alternate"}} />
        <ImgCalendar       style={{animation:"imgFloat1 4.4s ease-in-out infinite alternate", marginTop:16}} />
        <ImgDownloadCircle style={{animation:"imgFloat6 3.5s ease-in-out infinite alternate", marginTop:12}} />
        <ImgSalarySlip     style={{animation:"imgFloat3 4.9s ease-in-out infinite alternate", marginTop:10}} />
      </div>

      {/* ── CORNER decorations ── */}
      <ImgOfficeBuilding style={{
        position:"fixed", bottom:16, left:16,
        animation:"imgFloat5 4.2s ease-in-out infinite alternate",
        opacity:0.7, zIndex:0, pointerEvents:"none",
      }}/>
      <ImgOrbitRings style={{
        position:"fixed", top:20, right:20,
        animation:"imgFloat4 6s ease-in-out infinite alternate",
        opacity:0.35, zIndex:0, pointerEvents:"none",
      }} color="#764ba2"/>

      {/* ══ ORIGINAL UI — completely unchanged below ══ */}
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <FiFileText size={28} />
          </div>
          <div>
            <h1 style={styles.headerTitle}>Employee Payslip</h1>
            <p style={styles.headerSubtitle}>Download your monthly salary slips</p>
          </div>
        </div>

        {/* Main Card */}
        <div style={styles.card}>
          {message && (
            <div style={styles.messageBox}>
              <p style={styles.messageText}>{message}</p>
            </div>
          )}

          {/* Instructions */}
          <div style={styles.instructionBox}>
            <div>
              <h3 style={styles.instructionTitle}>How to Download</h3>
              <p style={styles.instructionText}>
                Select a month and download your payslip. The document will include all salary details.
              </p>
            </div>
          </div>

          {/* Month Selection */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FiCalendar style={styles.labelIcon} />
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={styles.input}
              max={new Date().toISOString().slice(0, 7)}
            />
            {selectedMonth && (
              <p style={styles.selectedMonthText}>
                Selected: <strong>{formatMonthToWords(selectedMonth)}</strong>
              </p>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={downloadPayslipPDF}
            disabled={loading || !selectedMonth}
            style={{
              ...styles.button,
              ...(loading || !selectedMonth ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Processing...
              </>
            ) : (
              <>
                <FiDownload style={styles.buttonIcon} />
                Download Payslip
              </>
            )}
          </button>

          {/* Features List */}
          <div style={styles.featuresContainer}>
            <h3 style={styles.featuresTitle}>What's Included:</h3>
            <div style={styles.featuresGrid}>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <span>Basic Salary Details</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <span>Allowances & Deductions</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <span>Employee Information</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <span>Net Pay in Words</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={styles.footerNote}>
          <p style={styles.footerText}>
            Your payslip will be downloaded as a PDF document. Keep it for your records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmpSalary;

// ══════════════════════════════════════════════════════════════
//  FLOATING COLUMN POSITIONS (new — positions images beside card)
// ══════════════════════════════════════════════════════════════

const floatCol = {
  left: {
    position: "fixed",
    left: "max(16px, calc(50% - 560px))",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    zIndex: 0,
    pointerEvents: "none",
  },
  right: {
    position: "fixed",
    right: "max(16px, calc(50% - 560px))",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    zIndex: 0,
    pointerEvents: "none",
  },
};

// ══════════════════════════════════════════════════════════════
//  ORIGINAL STYLES — completely untouched
// ══════════════════════════════════════════════════════════════

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    position: "relative",
  },
  container: {
    width: "100%",
    maxWidth: "500px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  headerIcon: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2d3748",
    margin: "0 0 5px 0",
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "#718096",
    margin: "0",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    marginBottom: "20px",
  },
  messageBox: {
    backgroundColor: "#fed7d7",
    borderLeft: "4px solid #e53e3e",
    padding: "12px 16px",
    marginBottom: "24px",
    borderRadius: "4px",
  },
  messageText: {
    color: "#742a2a",
    margin: "0",
    fontSize: "14px",
    fontWeight: "500",
  },
  instructionBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    backgroundColor: "#edf2f7",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
  },
  instructionIcon: {
    color: "#4299e1",
    flexShrink: "0",
  },
  instructionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2d3748",
    margin: "0 0 8px 0",
  },
  instructionText: {
    fontSize: "14px",
    color: "#4a5568",
    margin: "0",
    lineHeight: "1.5",
  },
  inputGroup: {
    marginBottom: "30px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "10px",
  },
  labelIcon: {
    color: "#718096",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    color: "#2d3748",
    outline: "none",
    transition: "all 0.3s ease",
  },
  inputFocus: {
    borderColor: "#4299e1",
    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
  },
  selectedMonthText: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#4a5568",
  },
  button: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    marginBottom: "30px",
  },
  buttonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
  },
  buttonDisabled: {
    background: "#cbd5e0",
    cursor: "not-allowed",
    transform: "none",
  },
  buttonIcon: {
    fontSize: "20px",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "3px solid #ffffff",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "10px",
  },
  featuresContainer: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "24px",
  },
  featuresTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "16px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#4a5568",
  },
  featureIcon: {
    width: "20px",
    height: "20px",
    background: "#48bb78",
    color: "#ffffff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
  },
  footerNote: {
    textAlign: "center",
    padding: "16px",
  },
  footerText: {
    fontSize: "14px",
    color: "#718096",
    margin: "0",
  },
};

// Add CSS for spinner animation — ORIGINAL
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);
