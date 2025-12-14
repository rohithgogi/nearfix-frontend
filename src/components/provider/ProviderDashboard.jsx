import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProviderServicesManagement from './ProviderServicesManagement';
import ProviderProfileForm from './ProviderProfileForm';
import ProviderBookings from '../booking/ProviderBookings';
import './Dashboard.css';

const API_BASE = 'http://localhost:8080';

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const [availability, setAvailability] = useState('OFFLINE');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    rating: 0.0,
    totalReviews: 0,
    earnings: 0
  });

  const token = localStorage.getItem('token');

  // ✅ Fetch profile and stats on mount
  useEffect(() => {
    fetchProfile();
    fetchBookingStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      fetchProfile();
      fetchBookingStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch provider profile (includes rating and reviews)
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/provider/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setAvailability(data.availabilityStatus || 'OFFLINE');

        // Update rating stats from profile
        setStats(prev => ({
          ...prev,
          rating: data.rating || 0.0,
          totalReviews: data.totalReviews || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // ✅ Fetch booking statistics
  const fetchBookingStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings/provider`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const bookings = await response.json();

        // Calculate stats from bookings
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
        const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
        const earnings = bookings
          .filter(b => b.status === 'COMPLETED' && b.finalPrice)
          .reduce((sum, b) => sum + parseFloat(b.finalPrice), 0);

        setStats(prev => ({
          ...prev,
          totalBookings,
          completedBookings,
          pendingBookings,
          earnings
        }));
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  // ✅ Toggle availability and update database
  const toggleAvailability = async () => {
    const newStatus = availability === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/provider/profile/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          availabilityStatus: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      const updatedProfile = await response.json();
      setAvailability(updatedProfile.availabilityStatus);

      console.log('✅ Availability updated:', updatedProfile.availabilityStatus);
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate profile completion percentage
  const getProfileCompletion = () => {
    if (!profile) return 0;
    return profile.profileCompletionPercentage || 0;
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
          {stats.pendingBookings > 0 && (
            <span style={{
              marginLeft: '8px',
              background: '#ff4757',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {stats.pendingBookings}
            </span>
          )}
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
                  <button
                    onClick={toggleAvailability}
                    className="btn-toggle"
                    disabled={loading}
                    style={{ opacity: loading ? 0.6 : 1 }}
                  >
                    {loading
                      ? '⏳ Updating...'
                      : availability === 'AVAILABLE'
                        ? 'Go Offline'
                        : 'Go Online'}
                  </button>
                </div>
                <p className="status-info">
                  {availability === 'AVAILABLE'
                    ? 'You are visible to customers and can receive bookings'
                    : 'Turn online to start receiving booking requests'}
                </p>
              </div>
            </section>

            {/* ✅ REAL-TIME STATS */}
            <section className="stats-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-info">
                    <h4>{stats.totalBookings}</h4>
                    <p>Total Bookings</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h4>{stats.completedBookings}</h4>
                    <p>Completed</p>
                  </div>
                </div>

                <div className="stat-card" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <div className="stat-icon" style={{ fontSize: '48px' }}>⭐</div>
                  <div className="stat-info">
                    <h4 style={{ color: 'white' }}>{stats.rating?.toFixed(1) || '0.0'}</h4>
                    <p style={{ color: 'white' }}>
                      Rating ({stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''})
                    </p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h4>₹{stats.earnings.toFixed(0)}</h4>
                    <p>Total Earnings</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Profile Completion */}
            <section className="profile-section">
              <h3>Complete Your Profile</h3>
              <div className="profile-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${getProfileCompletion()}%` }}
                  ></div>
                </div>
                <p>{getProfileCompletion()}% Complete</p>
              </div>

              {getProfileCompletion() < 100 && (
                <div className="profile-tasks">
                  {(!profile?.businessName || !profile?.address) && (
                    <div className="task-item incomplete">
                      <span>📝 Add business details & location</span>
                      <button className="btn-small" onClick={() => setActiveTab('profile')}>
                        Complete
                      </button>
                    </div>
                  )}

                  {!profile?.photoUrl && (
                    <div className="task-item incomplete">
                      <span>📷 Upload profile photo</span>
                      <button className="btn-small" onClick={() => setActiveTab('profile')}>
                        Complete
                      </button>
                    </div>
                  )}

                  {!profile?.aadharUrl && (
                    <div className="task-item incomplete">
                      <span>📄 Upload ID document</span>
                      <button className="btn-small" onClick={() => setActiveTab('profile')}>
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {getProfileCompletion() === 100 && (
                <div style={{
                  background: '#d4edda',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  marginTop: '20px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>
                    Profile Complete!
                  </h3>
                  <p style={{ margin: 0, color: '#155724' }}>
                    Your profile is fully set up and ready to receive bookings
                  </p>
                </div>
              )}
            </section>

            {/* Quick Actions */}
            <section style={{ marginTop: '30px' }}>
              <h3>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <button
                  onClick={() => setActiveTab('bookings')}
                  style={{
                    padding: '15px',
                    background: 'white',
                    border: '2px solid #667eea',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    color: '#667eea'
                  }}
                >
                  📋 View Bookings
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  style={{
                    padding: '15px',
                    background: 'white',
                    border: '2px solid #667eea',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    color: '#667eea'
                  }}
                >
                  🔧 Manage Services
                </button>
              </div>
            </section>
          </>
        ) : activeTab === 'services' ? (
          <ProviderServicesManagement />
        ) : activeTab === 'profile' ? (
          <ProviderProfileForm onComplete={() => {
            setActiveTab('overview');
            fetchProfile(); // Refresh profile after completion
          }} />
        ) : activeTab === 'bookings' ? (
          <ProviderBookings />
        ) : null}
      </main>
    </div>
  );
};

export default ProviderDashboard;