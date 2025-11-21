import { useState } from 'react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const RoleSelection = ({ phoneNumber }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const roles = [
    {
      value: 'CUSTOMER',
      title: 'I need services',
      icon: '🏠',
      description: 'Book local services like plumbing, electrical, cleaning, etc.',
    },
    {
      value: 'PROVIDER',
      title: 'I provide services',
      icon: '🔧',
      description: 'Offer your skills and earn by providing services in your area.',
    },
  ];

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.registerWithRole(phoneNumber, selectedRole);
      const data = response.data;
      login(data.jwtToken, data.phoneNumber, data.role);
    } catch (err) {
      setError(err.response?.data || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card role-card">
        <div className="auth-header">
          <h2>Choose Your Role</h2>
          <p>How would you like to use NearFix?</p>
        </div>

        <div className="role-options">
          {roles.map((role) => (
            <div
              key={role.value}
              className={`role-option ${selectedRole === role.value ? 'selected' : ''}`}
              onClick={() => setSelectedRole(role.value)}
            >
              <div className="role-icon">{role.icon}</div>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <div className="radio-btn">
                {selectedRole === role.value && <div className="radio-dot" />}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          onClick={handleRoleSelect}
          className="btn-primary"
          disabled={!selectedRole || loading}
        >
          {loading ? 'Creating Account...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;