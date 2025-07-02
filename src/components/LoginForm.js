"use client"

import { useState } from "react"

function LoginForm({ onLogin, onRegister, darkMode, setDarkMode, error }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!isLogin && !formData.username) {
      newErrors.username = "Username is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password)
      } else {
        await onRegister(formData)
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setErrors({ submit: error.message || "Authentication failed" })
    } finally {
      setLoading(false)
    }
  }

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      email: "demo@example.com",
      password: "password123",
    })
  }

  return (
    <div className={`login-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="login-card">
        <div className="login-header">
          <h1>🍳 Recipe Share</h1>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Demo credentials info */}
        <div className="demo-info">
          <p>
            <strong>Demo Credentials:</strong>
          </p>
          <p>Email: demo@example.com</p>
          <p>Password: password123</p>
          <button type="button" onClick={fillDemoCredentials} className="demo-btn">
            Use Demo Credentials
          </button>
        </div>

        <div className="auth-tabs">
          <button className={isLogin ? "tab-btn active" : "tab-btn"} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "tab-btn active" : "tab-btn"} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? "error" : ""}
                disabled={loading}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error" : ""}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
              disabled={loading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Display API or form errors */}
          {(error || errors.submit) && (
            <div className="error-message">
              <p>{error || errors.submit}</p>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
