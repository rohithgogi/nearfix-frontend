import { useState, useRef, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const OtpVerification = ({ phoneNumber, onNewUser, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);
  const { login } = useAuth();

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();

    // Resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (index === 3 && value) {
      const otpCode = newOtp.join('');
      if (otpCode.length === 4) {
        handleVerifyOtp(otpCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOtp(phoneNumber, otpCode);
      const data = response.data;

      if (data.isNewUser) {
        // New user - show role selection
        onNewUser(phoneNumber);
      } else {
        // Existing user - login directly
        login(data.jwtToken, data.phoneNumber, data.role);
      }
    } catch (err) {
      setError(err.response?.data || 'Invalid or expired OTP');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError('');

    try {
      await authAPI.sendOtp(phoneNumber);
      setResendTimer(30);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-btn" onClick={onBack}>← Back</button>

        <div className="auth-header">
          <h2>Verify OTP</h2>
          <p>Enter the 4-digit code sent to</p>
          <p className="phone-display">+91 {phoneNumber}</p>
        </div>

        <div className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className="otp-input"
              />
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={() => handleVerifyOtp()}
            className="btn-primary"
            disabled={loading || otp.join('').length !== 4}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="resend-section">
            {resendTimer > 0 ? (
              <p>Resend OTP in {resendTimer}s</p>
            ) : (
              <button onClick={handleResendOtp} className="btn-link" disabled={loading}>
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;