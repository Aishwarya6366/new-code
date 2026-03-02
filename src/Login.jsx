//import api from "./api";
import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import Header from './components/Header';
import img1 from "./assets/IMAGES1.jpg";
import img2 from "./assets/IMAGES2.jpeg";
import img3 from "./assets/IMAGES3.jpg";
import img4 from "./assets/IMAGES4.jpg";

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    redirectTo: null,
    error: '',
    usernameError: '',
    passwordError: '',
    currentIndex: 0,
    touched: { username: false, password: false }
  };

  images = [img1, img2, img3, img4];

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(prevState => ({
        currentIndex: (prevState.currentIndex + 1) % this.images.length
      }));
    }, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /* ================= VALIDATION HELPERS ================= */
  validateUsername = (value) => {
    if (!value) return 'Employee ID is required';
    if (!/^VPPL\d{3,4}$/.test(value)) return 'Format must be VPPL001 or VPPL0001';
    return '';
  };

  validatePassword = (value) => {
    if (!value) return 'Password is required';
    // if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  /* ================= INPUT HANDLER ================= */
  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      const upperValue = value.toUpperCase();
      if (upperValue.length > 8) return;

      const usernameError = this.state.touched.username
        ? this.validateUsername(upperValue)
        : (upperValue.length >= 7 ? this.validateUsername(upperValue) : '');

      this.setState({ username: upperValue, usernameError });
      return;
    }

    if (name === 'password') {
      const passwordError = this.state.touched.password
        ? this.validatePassword(value)
        : '';
      this.setState({ password: value, passwordError });
    }
  };

  handleBlur = (e) => {
    const { name } = e.target;
    const { username, password } = this.state;

    this.setState(prev => ({
      touched: { ...prev.touched, [name]: true },
      usernameError: name === 'username' ? this.validateUsername(username) : prev.usernameError,
      passwordError: name === 'password' ? this.validatePassword(password) : prev.passwordError,
    }));
  };

  togglePassword = () => {
    this.setState(prev => ({ showPassword: !prev.showPassword }));
  };

  /* ================= LOGIN ================= */
  handleLogin = (e) => {
    e.preventDefault();
    this.setState({ error: '' });

    const { username, password } = this.state;

    const usernameError = this.validateUsername(username);
    const passwordError = this.validatePassword(password);

    if (usernameError || passwordError) {
      this.setState({
        usernameError,
        passwordError,
        touched: { username: true, password: true }
      });
      return;
    }

    fetch(`/api/user/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid username or password');
        return res.json();
      })
      .then(async result => {
        await fetch("/api/hr/holidaylocation", {
          credentials: "include"
        }).catch(() => {});

        const msg = result.message || '';

        if (msg.includes('status : 0')) {
          sessionStorage.clear();
          localStorage.clear();
          this.setState({ redirectTo: '/set-password' });
          return;
        }

        if (msg.startsWith('1')) {
          sessionStorage.setItem('loggedIn', 'true');
          sessionStorage.setItem('role', 'HR');
          this.setState({ redirectTo: '/hr-dashboard' });
          return;
        }

        if (msg.startsWith('2')) {
          sessionStorage.setItem('loggedIn', 'true');
          sessionStorage.setItem('role', 'EMP');
          this.setState({ redirectTo: '/emp-dashboard' });
          return;
        }

        this.setState({ error: 'Invalid username or password' });
      })
      .catch(err => this.setState({ error: err.message }));
  };

  render() {
    if (this.state.redirectTo) {
      return <Navigate to={this.state.redirectTo} replace />;
    }

    const { username, password, showPassword, usernameError, passwordError, error } = this.state;

    return (
      <div className="login-page">
        <Header />

        <div
          className="login-main"
          style={{
            backgroundImage: `url(${this.images[this.state.currentIndex]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            transition: 'background-image 1s ease-in-out'
          }}
        >
          <div className="login-left" />

          <div className="login-right">
            <form className="login-box" onSubmit={this.handleLogin} noValidate>

              <h2>Login</h2>
              <p className="login-subtitle">
                Enter your credentials to access your account
              </p>

              {/* ── EMPLOYEE ID ── */}
              <div className="login-field-group">
                <label className="login-label">
                  Employee ID <span className="required-star">*</span>
                </label>
                <input
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  className={`login-input${usernameError ? ' input-error' : ''}`}
                  placeholder="VPPL001 or VPPL0001"
                  autoComplete="username"
                />
                {usernameError && (
                  <small className="field-error-msg">⚠ {usernameError}</small>
                )}
              </div>

              {/* ── PASSWORD ── */}
              <div className="login-field-group">
                <label className="login-label">
                  Password <span className="required-star">*</span>
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    className={`login-input password-input${passwordError ? ' input-error' : ''}`}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={this.togglePassword}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordError && (
                  <small className="field-error-msg">⚠ {passwordError}</small>
                )}
              </div>

              {/* ── SUBMIT ── */}
              <button className="login-button" type="submit">Login</button>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>

              {/* ── API / AUTH ERROR ── */}
              {error && (
                <div className="login-api-error">⚠ {error}</div>
              )}

            </form>
          </div>
        </div>

        <footer className="login-footer">
          © 2026 Venturebiz Promotions Private Limited. All rights reserved.
        </footer>
      </div>
    );
  }
}