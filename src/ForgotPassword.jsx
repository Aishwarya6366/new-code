import api from "./api";
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Header from './components/Header';
import './ForgotPassword.css';

export default class ForgotPassword extends Component {
  state = {
    username: '',
    email: '',
    message: '',
    redirect: false,
    usernameError: '',
    isLoading: false
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    /* ✅ EMPLOYEE ID VALIDATION ONLY */
    if (name === 'username') {
      const v = value.toUpperCase().slice(0, 8); // max 8 chars

      this.setState({
        username: v,
        usernameError:
          v.length === 0
            ? ''
            : /^VPPL\d{3,4}$/.test(v)
            ? ''
            : 'Employee ID must be VPPL001 or VPPL0001'
      });
      return;
    }

    // existing behavior untouched
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Block submit if Employee ID invalid
    if (this.state.usernameError) return;

    this.setState({ isLoading: true, message: '' });

    // Swagger API endpoint: PUT /api/forget-password
    fetch('/api/forget-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email
      })
    })
      .then(async res => {
        if (!res.ok) {
          // Try to get error message from response
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Request failed');
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          message: 'Please check your registered email. We sent a new password.',
          isLoading: false
        });

        setTimeout(() => {
          this.setState({ redirect: true });
        }, 3000);
      })
      .catch(error => {
        console.error('Forgot password error:', error);
        this.setState({
          message: 'Employee ID and Registered Email do not match',
          isLoading: false
        });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/" replace />;
    }

    const { username, email, message, usernameError, isLoading } = this.state;

    return (
      <div className="login-page">
        <Header />

        <div className="login-main">
          <div className="login-right">
            <form className="login-box" onSubmit={this.handleSubmit}>
              <h2>Forgot Password</h2>

              {/* Employee ID */}
              <label className="login-label">
                Employee ID <span className="required-star">*</span>
              </label>
              <input
                name="username"
                placeholder="VPPL001 or VPPL0001"
                value={username}
                onChange={this.handleChange}
                className={`login-input ${usernameError ? 'input-error' : ''}`}
                required
                disabled={isLoading}
              />

              {usernameError && (
                <small className="error-message">
                  {usernameError}
                </small>
              )}

              {/* Registered Email */}
              <label className="login-label">Registered Email ID</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Registered Email ID"
                value={email}
                onChange={this.handleChange}
                className="login-input"
                required
                disabled={isLoading}
              />

              <button 
                className="login-button" 
                type="submit"
                disabled={isLoading || !!usernameError}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>

              {message && (
                <div
                  className={`message ${
                    message.includes('check') ? 'success-message' : 'error-message'
                  }`}
                >
                  {message}
                </div>
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