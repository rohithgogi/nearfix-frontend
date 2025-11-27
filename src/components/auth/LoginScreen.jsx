import { useState } from 'react';
import { authAPI } from '../../services/api';
import './Auth.css';

const LoginScreen = ({ onOtpSent }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.sendOtp(phoneNumber);
      console.log('OTP sent successfully:', response.data);
      onOtpSent(phoneNumber);
    } catch (err) {
      console.error('Error sending OTP:', err);
      const errorMessage = err.response?.data?.error ||
                          err.response?.data?.message ||
                          err.message ||
                          'Failed to send OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔧 NearFix</h1>
          <p>Local Services at Your Doorstep</p>
        </div>

        <form onSubmit={handleSendOtp} className="auth-form">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="phone-input">
              <span className="country-code">+91</span>
              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength="10"
                disabled={loading}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-footer">
          <p>By continuing, you agree to our Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;