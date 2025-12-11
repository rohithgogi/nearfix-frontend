import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProviderServicesManagement from './ProviderServicesManagement';
import ProviderProfileForm from './ProviderProfileForm';
import ProviderBookings from '../booking/ProviderBookings'; // ✅ NEW IMPORT
import './Dashboard.css';

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const [availability, setAvailability] = useState('OFFLINE');
  const [activeTab, setActiveTab] = useState('overview');

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

      {/* Tab Navigation */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 20px 0 20px',
          display: 'flex',
          gap: '10px',
          borderBottom: '2px solid #e0e0e0',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'overview' ? '#667eea' : 'transparent',
            color: activeTab === 'overview' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s',
          }}
        >
          📊 Overview
        </button>

        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'services' ? '#667eea' : 'transparent',
            color: activeTab === 'services' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s',
          }}
        >
          🔧 My Services
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'profile' ? '#667eea' : 'transparent',
            color: activeTab === 'profile' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s',
          }}
        >
          👤 Profile
        </button>

        {/* ✅ NEW BOOKINGS TAB BUTTON */}
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'bookings' ? '#667eea' : 'transparent',
            color: activeTab === 'bookings' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s',
          }}
        >
          📋 Bookings
        </button>
      </div>

      <main className="dashboard-main">
        {/* Overview Tab */}
        {activeTab === 'overview' ? (
          <>
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
                  <button className="btn-small" onClick={() => setActiveTab('services')}>
                    Complete
                  </button>
                </div>
                <div className="task-item incomplete">
                  <span>📄 Complete your profile</span>
                  <button className="btn-small" onClick={() => setActiveTab('profile')}>
                    Complete
                  </button>
                </div>
                <div className="task-item incomplete">
                  <span>📍 Set service area</span>
                  <button className="btn-small" onClick={() => setActiveTab('profile')}>
                    Complete
                  </button>
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
          </>
        ) : activeTab === 'services' ? (
          /* Services Management Tab */
          <ProviderServicesManagement />
        ) : activeTab === 'profile' ? (
          /* Profile Tab */
          <ProviderProfileForm onComplete={() => setActiveTab('overview')} />
        ) : activeTab === 'bookings' ? (
          /* ✅ NEW BOOKINGS TAB */
          <ProviderBookings />
        ) : null}
      </main>
    </div>
  );
};

export default ProviderDashboard;
