import api from "./api";
import { useEffect, useState } from "react";
import axios from "axios";
import "./HolidayCalendar.css";

/* ═══════════════════════════════════════════════
   CONFIRM MODAL  (replaces window.confirm)
═══════════════════════════════════════════════ */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="cm-overlay" onClick={onCancel}>
      <div className="cm-box" onClick={e => e.stopPropagation()}>
        <div className="cm-icon">🗑️</div>
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
   ALERT MODAL  (replaces window.alert)
═══════════════════════════════════════════════ */
function AlertModal({ message, onClose }) {
  const isSuccess = String(message).includes("✅");
  const isWarn    = String(message).includes("⚠");
  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-box cm-alert" onClick={e => e.stopPropagation()}>
        <div className="cm-icon">{isSuccess ? "✅" : isWarn ? "⚠️" : "ℹ️"}</div>
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
   CONFETTI
═══════════════════════════════════════════════ */
function Confetti({ show }) {
  if (!show) return null;
  const cols = ["#f97316","#ef4444","#a855f7","#ec4899","#fbbf24","#fff","#22c55e"];
  const pieces = Array.from({ length: 26 }, (_, i) => ({
    x: Math.random() * 100, c: cols[i % cols.length],
    d: Math.random() * 0.6, s: 6 + Math.random() * 9,
    r: Math.random() * 360,
  }));
  return (
    <div className="confetti-wrap" aria-hidden="true">
      {pieces.map((p, i) => (
        <div key={i} className="confetti-piece" style={{
          left:`${p.x}%`, background:p.c, width:p.s, height:p.s,
          animationDelay:`${p.d}s`, transform:`rotate(${p.r}deg)`
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SLEEPING CARTOON — hammock character
═══════════════════════════════════════════════ */
const SleepingCartoon = () => (
  <svg width="195" height="185" viewBox="0 0 195 185" fill="none">
    <style>{`
      @keyframes hF{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
      @keyframes z1u{0%{opacity:0;transform:translate(0,0) scale(.6)}50%{opacity:1}100%{opacity:0;transform:translate(12px,-34px) scale(1.2)}}
      @keyframes z2u{0%{opacity:0;transform:translate(0,0) scale(.5)}50%{opacity:1}100%{opacity:0;transform:translate(18px,-46px) scale(1.4)}}
      @keyframes z3u{0%{opacity:0;transform:translate(0,0) scale(.4)}50%{opacity:1}100%{opacity:0;transform:translate(22px,-58px) scale(1.6)}}
      @keyframes brth{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.07)}}
      @keyframes stTw{0%,100%{opacity:.8;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
      .hg{animation:hF 3.6s ease-in-out infinite;transform-origin:98px 155px}
      .z1{animation:z1u 2.2s ease-in-out infinite 0s}
      .z2{animation:z2u 2.2s ease-in-out infinite .55s}
      .z3{animation:z3u 2.2s ease-in-out infinite 1.1s}
      .ch{animation:brth 3.6s ease-in-out infinite;transform-origin:98px 126px}
      .s1{animation:stTw 1.8s ease-in-out infinite}
      .s2{animation:stTw 1.8s ease-in-out infinite .5s}
    `}</style>
    <ellipse cx="98" cy="178" rx="50" ry="7" fill="rgba(0,0,0,0.13)"/>
    <g className="hg">
      <line x1="6" y1="75" x2="52" y2="125" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="188" y1="75" x2="142" y2="125" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M50 123 Q98 158 146 123" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.55)" strokeWidth="2"/>
      <path d="M50 123 Q98 148 146 123 Q98 162 50 123Z" fill="rgba(255,255,255,0.15)"/>
      <path d="M62 138 Q98 152 134 138" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>
      <g className="ch">
        <rect x="76" y="116" width="44" height="20" rx="10" fill="#fbbf24"/>
        <ellipse cx="98" cy="126" rx="26" ry="12" fill="#fde68a"/>
      </g>
      <ellipse cx="133" cy="133" rx="18" ry="8" fill="#fbbf24" transform="rotate(-14 133 133)"/>
      <ellipse cx="148" cy="129" rx="11" ry="6.5" fill="#fde68a" transform="rotate(-8 148 129)"/>
      <ellipse cx="158" cy="126" rx="9" ry="5.5" fill="#f97316" transform="rotate(-6 158 126)"/>
      <ellipse cx="74" cy="123" rx="13" ry="6.5" fill="#fbbf24" transform="rotate(22 74 123)"/>
      <ellipse cx="66" cy="118" rx="15" ry="10" fill="rgba(255,255,255,0.82)"/>
      <ellipse cx="66" cy="118" rx="12" ry="7.5" fill="rgba(255,255,255,0.55)"/>
      <ellipse cx="98" cy="108" rx="9" ry="7.5" fill="#fbbf24"/>
      <circle cx="98" cy="94" r="20" fill="#fde68a"/>
      <path d="M80 88 Q83 72 98 74 Q113 72 116 88" fill="#92400e"/>
      <path d="M80 88 Q78 83 82 80 Q79 75 85 74" fill="#92400e"/>
      <path d="M116 88 Q118 83 114 80 Q117 75 111 74" fill="#92400e"/>
      <path d="M89 95 Q92 91.5 95 95" stroke="#7c2d12" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M101 95 Q104 91.5 107 95" stroke="#7c2d12" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M92 103 Q98 108 104 103" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <ellipse cx="87" cy="101" rx="5.5" ry="3" fill="#f97316" opacity=".28"/>
      <ellipse cx="109" cy="101" rx="5.5" ry="3" fill="#f97316" opacity=".28"/>
      <text className="z1" x="122" y="78" fontSize="15" fontWeight="900" fill="rgba(255,255,255,0.85)" fontFamily="sans-serif">z</text>
      <text className="z2" x="132" y="61" fontSize="19" fontWeight="900" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Z</text>
      <text className="z3" x="144" y="40" fontSize="23" fontWeight="900" fill="rgba(255,255,255,0.75)" fontFamily="sans-serif">Z</text>
      <polygon className="s1" points="56,68 57.4,72.5 62,72.5 58.3,75.3 59.7,79.8 56,77 52.3,79.8 53.7,75.3 50,72.5 54.6,72.5" fill="#fbbf24" opacity=".8"/>
      <polygon className="s2" points="140,64 141,67.5 144.5,67.5 141.8,69.5 142.8,73 140,71 137.2,73 138.2,69.5 135.5,67.5 139,67.5" fill="#fff" opacity=".7"/>
    </g>
  </svg>
);

/* ═══════════════════════════════════════════════
   DANCING CARTOON
═══════════════════════════════════════════════ */
const DancingCartoon = () => (
  <svg width="120" height="180" viewBox="0 0 120 180" fill="none">
    <style>{`
      @keyframes bB{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-11px) rotate(3deg)}75%{transform:translateY(-6px) rotate(-3deg)}}
      @keyframes aL{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-42deg)}}
      @keyframes aR{0%,100%{transform:rotate(0deg)}50%{transform:rotate(42deg)}}
      @keyframes lL2{0%,100%{transform:rotate(0deg)}50%{transform:rotate(26deg)}}
      @keyframes lR2{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-26deg)}}
      @keyframes nF{0%{opacity:0;transform:translate(0,0)}50%{opacity:1}100%{opacity:0;transform:translate(14px,-28px)}}
      @keyframes hBb{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-8deg)}}
      .db{animation:bB .7s ease-in-out infinite;transform-origin:60px 115px}
      .daL{animation:aL .7s ease-in-out infinite;transform-origin:48px 103px}
      .daR{animation:aR .7s ease-in-out infinite 0.35s;transform-origin:72px 103px}
      .dlL{animation:lL2 .7s ease-in-out infinite;transform-origin:54px 143px}
      .dlR{animation:lR2 .7s ease-in-out infinite 0.35s;transform-origin:66px 143px}
      .dh{animation:hBb .7s ease-in-out infinite;transform-origin:60px 80px}
      .n1{animation:nF 1.4s ease-in-out infinite 0s}
      .n2{animation:nF 1.4s ease-in-out infinite 0.5s}
    `}</style>
    <ellipse cx="60" cy="174" rx="28" ry="5" fill="rgba(0,0,0,0.1)"/>
    <g className="daL"><rect x="30" y="99" width="20" height="9" rx="4.5" fill="#a855f7" transform="rotate(-30 30 99)"/></g>
    <g className="daR"><rect x="70" y="99" width="20" height="9" rx="4.5" fill="#a855f7" transform="rotate(30 90 99)"/></g>
    <g className="db">
      <rect x="46" y="100" width="28" height="44" rx="14" fill="#a855f7"/>
      <rect x="49" y="103" width="13" height="38" rx="6.5" fill="#c084fc" opacity=".5"/>
    </g>
    <g className="dlL">
      <rect x="48" y="141" width="12" height="30" rx="6" fill="#7e22ce"/>
      <ellipse cx="52" cy="172" rx="8" ry="5" fill="#ec4899"/>
    </g>
    <g className="dlR">
      <rect x="60" y="141" width="12" height="30" rx="6" fill="#7e22ce"/>
      <ellipse cx="68" cy="172" rx="8" ry="5" fill="#ec4899"/>
    </g>
    <g className="dh">
      <circle cx="60" cy="80" r="21" fill="#fde68a"/>
      <path d="M41 74 Q45 58 60 60 Q75 58 79 74" fill="#92400e"/>
      <circle cx="53" cy="79" r="3.5" fill="#1c1915"/>
      <circle cx="67" cy="79" r="3.5" fill="#1c1915"/>
      <circle cx="54.5" cy="77.5" r="1.2" fill="#fff"/>
      <circle cx="68.5" cy="77.5" r="1.2" fill="#fff"/>
      <path d="M51 88 Q60 97 69 88" stroke="#c2410c" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="60" cy="94" rx="5" ry="3" fill="#ef4444" opacity=".7"/>
      <ellipse cx="48" cy="87" rx="5" ry="3" fill="#f97316" opacity=".3"/>
      <ellipse cx="72" cy="87" rx="5" ry="3" fill="#f97316" opacity=".3"/>
      <ellipse cx="60" cy="62" rx="17" ry="5" fill="#7e22ce"/>
      <rect x="49" y="46" width="22" height="18" rx="5" fill="#7e22ce"/>
      <rect x="52" y="49" width="6" height="10" rx="2" fill="#a855f7" opacity=".5"/>
    </g>
    <text className="n1" x="85" y="68" fontSize="17" fill="rgba(255,255,255,0.85)" fontFamily="sans-serif">♪</text>
    <text className="n2" x="12" y="64" fontSize="21" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">♫</text>
  </svg>
);

/* ═══════════════════════════════════════════════
   PARTY POPPER CARTOON
═══════════════════════════════════════════════ */
const PartyCartoon = () => (
  <svg width="115" height="165" viewBox="0 0 115 165" fill="none">
    <style>{`
      @keyframes pJ{0%,100%{transform:translateY(0)}40%{transform:translateY(-14px)}60%{transform:translateY(-8px)}}
      @keyframes pA{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(1.1) rotate(8deg)}}
      @keyframes ppS{0%{opacity:0;transform:translate(0,0) scale(.5)}100%{opacity:0;transform:translate(var(--px),var(--py)) scale(1.2)}}
      .pg{animation:pJ 1.1s ease-in-out infinite;transform-origin:57px 130px}
      .pa{animation:pA 1.1s ease-in-out infinite;transform-origin:75px 94px}
      .p1{--px:20px;--py:-20px;animation:ppS 1.1s ease-out infinite 0s}
      .p2{--px:30px;--py:-10px;animation:ppS 1.1s ease-out infinite .15s}
      .p3{--px:10px;--py:-30px;animation:ppS 1.1s ease-out infinite .3s}
      .p4{--px:35px;--py:-5px;animation:ppS 1.1s ease-out infinite .08s}
      .p5{--px:15px;--py:-25px;animation:ppS 1.1s ease-out infinite .22s}
    `}</style>
    <ellipse cx="57" cy="159" rx="24" ry="5" fill="rgba(0,0,0,0.1)"/>
    <g className="pg">
      <rect x="41" y="95" width="30" height="40" rx="14" fill="#ec4899"/>
      <rect x="44" y="98" width="12" height="34" rx="6" fill="#f472b6" opacity=".5"/>
      <rect x="44" y="132" width="11" height="24" rx="5.5" fill="#db2777"/>
      <rect x="60" y="132" width="11" height="24" rx="5.5" fill="#db2777"/>
      <ellipse cx="48" cy="157" rx="8" ry="5" fill="#f97316"/>
      <ellipse cx="67" cy="157" rx="8" ry="5" fill="#f97316"/>
      <rect x="25" y="97" width="16" height="9" rx="4.5" fill="#ec4899" transform="rotate(20 25 97)"/>
      <g className="pa">
        <rect x="70" y="92" width="20" height="9" rx="4.5" fill="#ec4899" transform="rotate(-35 70 92)"/>
        <path d="M84 81 L94 67 L98 75Z" fill="#fbbf24"/>
        <path d="M94 67 L106 57 L102 69Z" fill="#fbbf24" opacity=".7"/>
        <circle className="p1" cx="94" cy="67" r="3" fill="#f97316"/>
        <circle className="p2" cx="94" cy="67" r="2.5" fill="#a855f7"/>
        <rect className="p3" x="92" y="65" width="5" height="5" rx="1" fill="#22c55e"/>
        <circle className="p4" cx="94" cy="67" r="2" fill="#ec4899"/>
        <rect className="p5" x="93" y="66" width="4" height="4" rx="1" fill="#fbbf24"/>
      </g>
      <circle cx="57" cy="77" r="20" fill="#fde68a"/>
      <path d="M39 70 Q43 55 57 57 Q71 55 75 70" fill="#7c2d12"/>
      <path d="M46 65 L57 41 L68 65Z" fill="#f97316"/>
      <path d="M46 65 L57 41 L68 65Z" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2"/>
      <circle cx="57" cy="40" r="4" fill="#fbbf24"/>
      <rect x="45" y="64" width="24" height="5" rx="2.5" fill="#ef4444"/>
      <circle cx="50" cy="76" r="4" fill="#1c1915"/>
      <circle cx="64" cy="76" r="4" fill="#1c1915"/>
      <circle cx="51.5" cy="74.5" r="1.5" fill="#fff"/>
      <circle cx="65.5" cy="74.5" r="1.5" fill="#fff"/>
      <ellipse cx="57" cy="84" rx="6" ry="4.5" fill="#1c1915"/>
      <ellipse cx="57" cy="85" rx="5" ry="3" fill="#ef4444"/>
      <rect x="53" y="81" width="4" height="3" rx="1" fill="#fff"/>
      <rect x="57" y="81" width="4" height="3" rx="1" fill="#fff"/>
      <ellipse cx="44" cy="82" rx="5" ry="3" fill="#f97316" opacity=".3"/>
      <ellipse cx="70" cy="82" rx="5" ry="3" fill="#f97316" opacity=".3"/>
    </g>
  </svg>
);

/* ═══════════════════════════════════════════════
   READING CARTOON
═══════════════════════════════════════════════ */
const ReadingCartoon = () => (
  <svg width="108" height="158" viewBox="0 0 108 158" fill="none">
    <style>{`
      @keyframes rB{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @keyframes pF{0%,100%{transform:scaleX(1)}50%{transform:scaleX(0.9)}}
      .rg{animation:rB 2.8s ease-in-out infinite;transform-origin:54px 128px}
      .rb{animation:pF 2.8s ease-in-out infinite;transform-origin:54px 118px}
    `}</style>
    <ellipse cx="54" cy="153" rx="26" ry="5" fill="rgba(0,0,0,0.1)"/>
    <g className="rg">
      <rect x="35" y="90" width="38" height="44" rx="14" fill="#06b6d4"/>
      <rect x="38" y="93" width="16" height="38" rx="8" fill="#22d3ee" opacity=".45"/>
      <rect x="19" y="106" width="18" height="9" rx="4.5" fill="#06b6d4" transform="rotate(10 19 106)"/>
      <rect x="71" y="106" width="18" height="9" rx="4.5" fill="#06b6d4" transform="rotate(-10 89 106)"/>
      <rect x="40" y="131" width="11" height="20" rx="5.5" fill="#0891b2"/>
      <rect x="57" y="131" width="11" height="20" rx="5.5" fill="#0891b2"/>
      <ellipse cx="44" cy="152" rx="8" ry="5" fill="#f97316"/>
      <ellipse cx="64" cy="152" rx="8" ry="5" fill="#f97316"/>
      <g className="rb">
        <rect x="20" y="113" width="68" height="42" rx="5" fill="#fbbf24"/>
        <rect x="20" y="113" width="34" height="42" rx="5" fill="#f59e0b"/>
        <line x1="54" y1="113" x2="54" y2="155" stroke="#d97706" strokeWidth="1.5"/>
        <rect x="25" y="119" width="24" height="2.5" rx="1.2" fill="#92400e" opacity=".5"/>
        <rect x="25" y="124" width="18" height="2" rx="1" fill="#92400e" opacity=".4"/>
        <rect x="25" y="129" width="22" height="2" rx="1" fill="#92400e" opacity=".4"/>
        <rect x="57" y="119" width="24" height="2.5" rx="1.2" fill="#92400e" opacity=".5"/>
        <rect x="57" y="124" width="18" height="2" rx="1" fill="#92400e" opacity=".4"/>
        <rect x="57" y="129" width="22" height="2" rx="1" fill="#92400e" opacity=".4"/>
      </g>
      <circle cx="54" cy="71" r="20" fill="#fde68a"/>
      <path d="M36 65 Q40 50 54 52 Q68 50 72 65" fill="#7c2d12"/>
      <circle cx="47" cy="71" r="6" fill="none" stroke="#1c1915" strokeWidth="1.8"/>
      <circle cx="61" cy="71" r="6" fill="none" stroke="#1c1915" strokeWidth="1.8"/>
      <line x1="53" y1="71" x2="55" y2="71" stroke="#1c1915" strokeWidth="1.5"/>
      <line x1="33" y1="70" x2="41" y2="71" stroke="#1c1915" strokeWidth="1.5"/>
      <line x1="67" y1="71" x2="75" y2="70" stroke="#1c1915" strokeWidth="1.5"/>
      <circle cx="47" cy="71" r="3" fill="#1c1915"/>
      <circle cx="61" cy="71" r="3" fill="#1c1915"/>
      <circle cx="48" cy="70" r="1" fill="#fff"/>
      <circle cx="62" cy="70" r="1" fill="#fff"/>
      <path d="M47 80 Q54 86 61 80" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </g>
  </svg>
);

/* ═══════════════════════════════════════════════
   ORBITAL NODES — like the reference image
═══════════════════════════════════════════════ */
const OrbitalNodes = () => (
  <div className="hc-orbital-wrap" aria-hidden="true">
    <style>{`
      @keyframes ob1f{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-8px,-12px) scale(1.06)}}
      @keyframes ob2f{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(10px,-8px) scale(1.09)}}
      @keyframes ob3f{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-6px,10px) scale(1.05)}}
      @keyframes ob4f{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(12px,6px) scale(1.07)}}
      @keyframes ob5f{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-10px,-6px) scale(1.08)}}
      .ob1{animation:ob1f 4s ease-in-out infinite}
      .ob2{animation:ob2f 3.5s ease-in-out infinite .5s}
      .ob3{animation:ob3f 5s ease-in-out infinite 1s}
      .ob4{animation:ob4f 3.8s ease-in-out infinite 1.5s}
      .ob5{animation:ob5f 4.2s ease-in-out infinite .8s}
    `}</style>
    <svg width="300" height="260" viewBox="0 0 300 260" fill="none">
      <line x1="150" y1="125" x2="74" y2="55"  stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="150" y1="125" x2="240" y2="50" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="150" y1="125" x2="50"  y2="150" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="150" y1="125" x2="268" y2="155" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="150" y1="125" x2="150" y2="24"  stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="5 4"/>
      {/* Centre */}
      <circle cx="150" cy="125" r="36" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.42)" strokeWidth="2"/>
      <circle cx="150" cy="125" r="26" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.58)" strokeWidth="1.5"/>
      <text x="150" y="133" textAnchor="middle" fontSize="26">📅</text>
      {/* Node 1 */}
      <g className="ob1"><circle cx="74" cy="55" r="26" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5"/><circle cx="74" cy="55" r="18" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.48)" strokeWidth="1"/><text x="74" y="63" textAnchor="middle" fontSize="20">🏖️</text></g>
      {/* Node 2 */}
      <g className="ob2"><circle cx="240" cy="50" r="23" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5"/><circle cx="240" cy="50" r="16" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.48)" strokeWidth="1"/><text x="240" y="57" textAnchor="middle" fontSize="17">🎉</text></g>
      {/* Node 3 */}
      <g className="ob3"><circle cx="50" cy="150" r="21" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5"/><circle cx="50" cy="150" r="14" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.48)" strokeWidth="1"/><text x="50" y="157" textAnchor="middle" fontSize="15">✅</text></g>
      {/* Node 4 */}
      <g className="ob4"><circle cx="268" cy="155" r="25" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5"/><circle cx="268" cy="155" r="17" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.48)" strokeWidth="1"/><text x="268" y="163" textAnchor="middle" fontSize="19">📊</text></g>
      {/* Node 5 top */}
      <g className="ob5"><circle cx="150" cy="24" r="19" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5"/><circle cx="150" cy="24" r="12" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.48)" strokeWidth="1"/><text x="150" y="31" textAnchor="middle" fontSize="13">🔔</text></g>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function HolidayCalendar() {
  const [types,        setTypes]        = useState([]);
  const [locations,    setLocations]    = useState([]);
  const [holidays,     setHolidays]     = useState([]);
  const [editingId,    setEditingId]    = useState(null);
  const [isEditing,    setIsEditing]    = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [alertModal,   setAlertModal]   = useState(null);

  const showAlert   = (msg)    => setAlertModal(msg);
  const showConfirm = (msg,cb) => setConfirmModal({ message:msg, onConfirm:cb });

  const [newType,     setNewType]     = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [form, setForm] = useState({
    holidayName:"", holidayDate:"", holidayTypeId:"", holidayLocationId:""
  });

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    try {
      const typeRes    = await axios.get(`/api/hr/holidaymaster`,  { withCredentials:true });
      const locRes     = await axios.get(`/api/hr/holidaylocation`, { withCredentials:true });
      const holidayRes = await api.get("/hr/holiday");
      setTypes(typeRes.data || []);
      setLocations(locRes.data || []);
      setHolidays(Array.isArray(holidayRes.data) ? holidayRes.data : []);
    } catch (err) { console.log("Data load error:", err); }
  };

  const addNewType = async () => {
    if (!newType.trim()) return;
    try {
      const res = await axios.post(`/api/hr/holidaymaster`, { holidayType:newType }, { withCredentials:true });
      if (res.data?.htId) setForm(f => ({ ...f, holidayTypeId:res.data.htId.toString() }));
      setNewType(""); loadAllData();
    } catch (err) { console.error(err); }
  };

  const addNewLocation = async () => {
    if (!newLocation.trim()) return;
    try {
      const res = await axios.post(`/api/hr/holidaylocation`, { locationName:newLocation }, { withCredentials:true });
      if (res.data?.hlId) setForm(f => ({ ...f, holidayLocationId:res.data.hlId.toString() }));
      setNewLocation(""); loadAllData();
    } catch (err) { console.error(err); }
  };

  const saveHoliday = async () => {
    if (!form.holidayName || !form.holidayDate)                      { showAlert("Enter name & date");        return; }
    if (!form.holidayTypeId || !form.holidayLocationId)              { showAlert("Select type & location");   return; }
    try {
      if (isEditing && editingId) {
        await axios.put(`/api/hr/holiday/${editingId}`, {
          holidayName:form.holidayName, holidayDate:form.holidayDate,
          holidayTypeId:Number(form.holidayTypeId), holidayLocationId:Number(form.holidayLocationId)
        }, { withCredentials:true });
        showAlert("✅ Holiday Updated");
      } else {
        await axios.post(`/api/hr/holiday`, {
          holidayName:form.holidayName, holidayDate:form.holidayDate,
          holidayTypeId:Number(form.holidayTypeId), holidayLocationId:Number(form.holidayLocationId)
        }, { withCredentials:true });
        setShowConfetti(true);
        setTimeout(()=>setShowConfetti(false), 1500);
        showAlert("✅ Holiday Added");
      }
      resetForm(); loadAllData();
    } catch (err) { console.error(err); showAlert("Error saving holiday"); }
  };

  const editHoliday = (holiday) => {
    const hid = holiday.id || holiday.holidayId || holiday.hId;
    if (!hid) { showAlert("Cannot edit: Holiday ID not found"); return; }
    setForm({
      holidayName:      holiday.holidayName || "",
      holidayDate:      holiday.holidayDate || "",
      holidayTypeId:     holiday.holidayTypeId     ? holiday.holidayTypeId.toString()     : "",
      holidayLocationId: holiday.holidayLocationId ? holiday.holidayLocationId.toString() : "",
    });
    setEditingId(hid); setIsEditing(true);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const deleteHoliday = (holiday) => {
    const hid = holiday.id || holiday.holidayId || holiday.hId;
    if (!hid) { showAlert("Cannot delete: Holiday ID not found"); return; }
    showConfirm(`Delete "${holiday.holidayName || "this holiday"}"?`, async () => {
      setConfirmModal(null);
      try {
        await axios.delete(`/api/hr/holiday/${hid}`, { withCredentials:true });
        showAlert("✅ Holiday Deleted"); loadAllData();
      } catch (err) { console.error(err); showAlert("Error deleting holiday"); }
    });
  };

  const resetForm = () => {
    setForm({ holidayName:"", holidayDate:"", holidayTypeId:"", holidayLocationId:"" });
    setEditingId(null); setIsEditing(false);
  };

  const getTypeName     = (id) => { const t = types.find(t=>t.htId==id||t.id==id); return t ? t.holidayType||t.type : "Unknown"; };
  const getLocationName = (id) => { const l = locations.find(l=>l.hlId==id||l.id==id); return l ? l.locationName||l.name : "Unknown"; };

  const parseDate = (str) => {
    if (!str) return null;
    const iso = String(str).match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (iso) { const d=new Date(+iso[1],+iso[2]-1,+iso[3]); return isNaN(d)?null:d; }
    const dmy = String(str).match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmy) { const d=new Date(+dmy[3],+dmy[2]-1,+dmy[1]); return isNaN(d)?null:d; }
    const d=new Date(str); return isNaN(d)?null:d;
  };
  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const MC     = ["#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#f97316","#10b981","#6366f1","#f43f5e"];

  return (
    <div className="hc-wrap">
      {confirmModal && <ConfirmModal message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={()=>setConfirmModal(null)}/>}
      {alertModal   && <AlertModal   message={alertModal}           onClose={()=>setAlertModal(null)}/>}

      {/* ══════════ HERO ══════════ */}
      <div className="hc-hero">
        <div className="hc-hero-bg"/>
        {/* Characters */}
        <div className="hc-chars">
          <div className="hc-char hc-c1"><SleepingCartoon/></div>
          <div className="hc-char hc-c2"><DancingCartoon/></div>
          <div className="hc-char hc-c3"><ReadingCartoon/></div>
          <div className="hc-char hc-c4"><PartyCartoon/></div>
        </div>
        {/* Centre text */}
        <div className="hc-hero-center">
        
          <h1 className="hc-hero-title">Holiday Calendar</h1>
          <p className="hc-hero-sub">Manage leave types and holiday records efficiently</p>
          <div className="hc-hero-stats">
            <div className="hc-stat"><span className="hc-sn">{holidays.length}</span><span className="hc-sl">Holidays</span></div>
            <div className="hc-ssep"/>
            <div className="hc-stat"><span className="hc-sn">{types.length}</span><span className="hc-sl">Types</span></div>
            <div className="hc-ssep"/>
            <div className="hc-stat"><span className="hc-sn">{locations.length}</span><span className="hc-sl">Locations</span></div>
          </div>
        </div>
        {/* Orbital nodes */}
        <div className="hc-orbital"><OrbitalNodes/></div>
        {/* Sparkles */}
        <div className="hc-sparkles" aria-hidden="true">
          {["✦","✧","⬥","◆","✦","✧","◇","✦"].map((s,i)=>(
            <span key={i} className={`hc-sp hc-sp${i}`}>{s}</span>
          ))}
        </div>
      </div>

      {/* ══════════ FORM CARD ══════════ */}
      <div className={`hc-card${isEditing?" hc-card-edit":""}`}>
        <Confetti show={showConfetti}/>
        <div className="hc-shimmer"/>
        <div className="hc-card-hd">
          <div className="hc-card-icon">{isEditing?"✏️":"🌟"}</div>
          <div>
            <h2 className="hc-card-title">{isEditing?"Edit Holiday":"Add New Holiday"}</h2>
            <p className="hc-card-sub">Fill in the details to {isEditing?"update":"schedule"} a holiday</p>
          </div>
          {isEditing && <span className="hc-edit-badge">Editing</span>}
        </div>

        <div className="hc-sec-lbl">📋 Basic Details</div>
        <div className="hc-row">
          <div className="hc-iw"><span className="hc-pre">🎉</span><input className="hc-inp" placeholder="Holiday Name" value={form.holidayName} onChange={e=>setForm(f=>({...f,holidayName:e.target.value}))}/></div>
          <div className="hc-iw"><span className="hc-pre">📅</span><input className="hc-inp" type="date" value={form.holidayDate} onChange={e=>setForm(f=>({...f,holidayDate:e.target.value}))}/></div>
        </div>

        <div className="hc-sec-lbl">🏷️ Holiday Type</div>
        <div className="hc-row">
          <div className="hc-iw hc-sw"><span className="hc-pre">📂</span><select className="hc-inp hc-sel" value={form.holidayTypeId} onChange={e=>setForm(f=>({...f,holidayTypeId:e.target.value}))}><option value="">Select Type</option>{types.map(t=><option key={t.htId||t.id} value={t.htId||t.id}>{t.holidayType||t.type}</option>)}</select></div>
          <div className="hc-iw"><span className="hc-pre">➕</span><input className="hc-inp" placeholder="Add new type…" value={newType} onChange={e=>setNewType(e.target.value)} onKeyPress={e=>e.key==="Enter"&&addNewType()}/></div>
          <button className="hc-add-btn" onClick={addNewType}>Add</button>
        </div>

        <div className="hc-sec-lbl">📍 Location</div>
        <div className="hc-row">
          <div className="hc-iw hc-sw"><span className="hc-pre">🌏</span><select className="hc-inp hc-sel" value={form.holidayLocationId} onChange={e=>setForm(f=>({...f,holidayLocationId:e.target.value}))}><option value="">Select Location</option>{locations.map(l=><option key={l.hlId||l.id} value={l.hlId||l.id}>{l.locationName||l.name}</option>)}</select></div>
          <div className="hc-iw"><span className="hc-pre">➕</span><input className="hc-inp" placeholder="Add new location…" value={newLocation} onChange={e=>setNewLocation(e.target.value)} onKeyPress={e=>e.key==="Enter"&&addNewLocation()}/></div>
          <button className="hc-add-btn" onClick={addNewLocation}>Add</button>
        </div>

        <div className="hc-act-row">
          <button className="hc-save-btn" onClick={saveHoliday}><span>{isEditing?"💾":"🚀"}</span>{isEditing?"Update Holiday":"Save Holiday"}</button>
          {isEditing && <button className="hc-cancel-btn" onClick={resetForm}><span>✕</span> Cancel</button>}
        </div>
      </div>

      {/* ══════════ LIST ══════════ */}
      <div className="hc-list">
        <div className="hc-list-hd">
          <div className="hc-list-icon">📆</div>
          <div>
            <h2 className="hc-list-title">Holiday List</h2>
            <p className="hc-list-sub">{holidays.length} holiday{holidays.length!==1?"s":""} scheduled</p>
          </div>
        </div>
        {holidays.length===0 ? (
          <div className="hc-empty">
            <div className="hc-empty-ico">📅</div>
            <p className="hc-empty-title">No holidays yet!</p>
            <p className="hc-empty-sub">Add your first holiday using the form above ↑</p>
          </div>
        ) : (
          <div className="hc-tscroll">
            <table className="hc-table">
              <thead><tr><th>#</th><th>🎉 Holiday Name</th><th>📅 Date</th><th>📆 Day</th><th>🏷️ Type</th><th>📍 Location</th><th>⚙️ Actions</th></tr></thead>
              <tbody>
                {holidays.map((h,idx)=>{
                  const hid=h.id||h.holidayId||h.hId||Math.random();
                  const raw=h.holidayDate||h.date||"";
                  const d=parseDate(raw); const v=!!d;
                  const mi=v?d.getMonth():-1;
                  const isW=v&&[0,6].includes(d.getDay());
                  return (
                    <tr key={hid} className="hc-tr" style={{animationDelay:`${idx*50}ms`}}>
                      <td><span className="hc-num">{String(idx+1).padStart(2,"0")}</span></td>
                      <td><div className="hc-name-c"><span className="hc-ndot"/><div><span className="hc-ntxt">{h.holidayName||h.name||"—"}</span>{isW&&<span className="hc-wtag">Weekend</span>}</div></div></td>
                      <td>{v?(<div className="hc-dc" style={{"--mc":MC[mi]}}><div className="hc-dc-t">{MONTHS[mi]}</div><div className="hc-dc-n">{d.getDate()}</div><div className="hc-dc-y">{d.getFullYear()}</div></div>):(<span className="hc-raw">{raw||"—"}</span>)}</td>
                      <td><span className={`hc-day${isW?" hc-day-w":""}`}>{v?DAYS[d.getDay()]:"—"}</span></td>
                      <td><span className="hc-type">{getTypeName(h.holidayTypeId||h.typeId)}</span></td>
                      <td><span className="hc-loc"><svg width="10" height="13" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.8 0 1 1.8 1 4c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#9f1239"/></svg>{getLocationName(h.holidayLocationId||h.locationId)}</span></td>
                      <td className="hc-acts">
                        <button className="hc-edit-btn" onClick={()=>editHoliday(h)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Edit</button>
                        {/* <button className="hc-del-btn"  onClick={()=>deleteHoliday(h)}><svg width="11" height="12" viewBox="0 0 11 12" fill="none"><path d="M1 3h9M3.5 3V2h4v1M2 3l.9 8h5.2L9 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Delete</button> */}
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
