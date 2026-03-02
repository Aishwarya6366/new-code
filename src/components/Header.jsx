import React from 'react';
import './Header.css'; // or inline styles below

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-brand">
        <img
          // src="/logo.png"           // ← replace with your actual logo import/path
          // alt="Company Logo"
          className="header-logo"
        />
        <span className="header-company-name">
          Venturebiz Promotions Private Limited
        </span>
      </div>
    </header>
  );
}