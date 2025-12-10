import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../store/userSlice'
import '../styles/Auth.css'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.user)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [validationError, setValidationError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    isLengthValid: false,
  })

  /**
   * Validate email format using RFC 5322 standard
   * Strict validation for common email patterns
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/
    return emailRegex.test(email)
  }

  /**
   * Check password complexity requirements:
   * - At least one uppercase letter (A-Z)
   * - At least one lowercase letter (a-z)
   * - At least one number (0-9)
   * - Minimum 8 characters
   */
  const validatePassword = (pwd) => {
    const strength = {
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      isLengthValid: pwd.length >= 8,
    }
    setPasswordStrength(strength)
    return Object.values(strength).every(val => val === true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Validate password as user types
    if (name === 'password') {
      validatePassword(value)
    }
    
    setValidationError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Strict email validation
    if (!validateEmail(formData.email)) {
      setValidationError('Please enter a valid email address (e.g., user@example.com)')
      return
    }

    // Strict password validation
    if (!validatePassword(formData.password)) {
      setValidationError(
        'Password must contain: 1 uppercase letter, 1 lowercase letter, 1 number, and be at least 8 characters'
      )
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      setValidationError('Passwords do not match')
      return
    }

    try {
      await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })).unwrap()
      navigate('/')
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
            <small style={{ color: '#999', fontSize: '0.85em', marginTop: '5px', display: 'block' }}>
              Format: user@example.com
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
            
            {/* Password strength indicator */}
            <div className="password-requirements" style={{ marginTop: '10px', fontSize: '0.85em' }}>
              <div style={{ color: passwordStrength.hasUppercase ? '#4CAF50' : '#ccc', marginBottom: '5px' }}>
                ✓ Uppercase letter (A-Z): {passwordStrength.hasUppercase ? '✓' : '✗'}
              </div>
              <div style={{ color: passwordStrength.hasLowercase ? '#4CAF50' : '#ccc', marginBottom: '5px' }}>
                ✓ Lowercase letter (a-z): {passwordStrength.hasLowercase ? '✓' : '✗'}
              </div>
              <div style={{ color: passwordStrength.hasNumber ? '#4CAF50' : '#ccc', marginBottom: '5px' }}>
                ✓ Number (0-9): {passwordStrength.hasNumber ? '✓' : '✗'}
              </div>
              <div style={{ color: passwordStrength.isLengthValid ? '#4CAF50' : '#ccc' }}>
                ✓ At least 8 characters: {passwordStrength.isLengthValid ? '✓' : '✗'}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {validationError && <div className="error-message">{validationError}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
