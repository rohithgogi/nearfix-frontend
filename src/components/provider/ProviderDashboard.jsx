import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const [availability, setAvailability] = useState('OFFLINE');

  const stats = [
    { label: 'Total Bookings', value: '0', icon: '📋' },
    { label: 'Completed', value: '0', icon: '✅' },
    { label: 'Rating', value: '0.0', icon: '⭐' },
    { label: 'Earnings', value: '₹0', icon: '💰' },
  ];

  const toggleAvailability = () => {
    setAvailability((prev) => (prev === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE'));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header provider-header">
        <div className="header-content">
          <h1>🔧 NearFix Provider</h1>
          <div className="user-info">
            <span>+91 {user.phoneNumber}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="provider-status">
          <div className="status-card">
            <h3>Availability Status</h3>
            <div className="status-toggle">
              <span className={`status-badge ${availability.toLowerCase()}`}>
                {availability === 'AVAILABLE' ? '🟢' : '🔴'} {availability}
              </span>
              <button onClick={toggleAvailability} className="btn-toggle">
                {availability === 'AVAILABLE' ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
            <p className="status-info">
              {availability === 'AVAILABLE'
                ? 'You are visible to customers'
                : 'Turn on to start receiving bookings'}
            </p>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <h4>{stat.value}</h4>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h3>Complete Your Profile</h3>
          <div className="profile-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '20%' }}></div>
            </div>
            <p>20% Complete</p>
          </div>
          <div className="profile-tasks">
            <div className="task-item incomplete">
              <span>📝 Add service details</span>
              <button className="btn-small">Complete</button>
            </div>
            <div className="task-item incomplete">
              <span>📄 Upload documents</span>
              <button className="btn-small">Complete</button>
            </div>
            <div className="task-item incomplete">
              <span>📍 Set service area</span>
              <button className="btn-small">Complete</button>
            </div>
          </div>
        </section>

        <section className="bookings-section">
          <h3>Booking Requests</h3>
          <div className="empty-state">
            <p>📦</p>
            <p>No booking requests</p>
            <p className="empty-subtitle">Go online to start receiving bookings</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProviderDashboard;