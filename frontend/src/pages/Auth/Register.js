import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    location: { region: '', district: '' },
    farmDetails: { farmSize: '', crops: [] },
    businessDetails: { businessName: '', businessType: '' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Please fill in all fields');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Invalid email format');
        return false;
      }
      if (!/^[0-9]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
        setError('Invalid phone number');
        return false;
      }
    } else if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please enter password');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    } else if (step === 3) {
      if (!formData.location.region) {
        setError('Please select a region');
        return false;
      }
      if (formData.role === 'farmer' && !formData.farmDetails.farmSize) {
        setError('Please enter farm size');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        location: formData.location,
        ...(formData.role === 'farmer' && { farmDetails: formData.farmDetails }),
        ...(formData.role === 'buyer' && { businessDetails: formData.businessDetails })
      };

      await register(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join MkulimaLink</h1>
          <p>Step {step} of 3 - Create your account</p>
        </div>

        {(error || authError) && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={20} className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+255 123 456 789"
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">I am a</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-select"
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <label htmlFor="region">Region</label>
                <div className="input-wrapper">
                  <MapPin size={20} className="input-icon" />
                  <select
                    id="region"
                    name="location.region"
                    value={formData.location.region}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-select"
                  >
                    <option value="">Select Region</option>
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Morogoro">Morogoro</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Iringa">Iringa</option>
                    <option value="Mbeya">Mbeya</option>
                    <option value="Mwanza">Mwanza</option>
                    <option value="Dodoma">Dodoma</option>
                    <option value="Kilimanjaro">Kilimanjaro</option>
                  </select>
                </div>
              </div>

              {formData.role === 'farmer' && (
                <div className="form-group">
                  <label htmlFor="farmSize">Farm Size (acres)</label>
                  <input
                    type="number"
                    id="farmSize"
                    name="farmDetails.farmSize"
                    value={formData.farmDetails.farmSize}
                    onChange={handleChange}
                    placeholder="Enter farm size"
                    disabled={loading}
                  />
                </div>
              )}

              {formData.role === 'buyer' && (
                <div className="form-group">
                  <label htmlFor="businessName">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessDetails.businessName"
                    value={formData.businessDetails.businessName}
                    onChange={handleChange}
                    placeholder="Your business name"
                    disabled={loading}
                  />
                </div>
              )}
            </>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="auth-button secondary"
                disabled={loading}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="auth-button"
                disabled={loading}
              >
                Next
              </button>
            ) : (
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? (
                  <>
                    <Loader size={20} className="spinner" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          </div>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
