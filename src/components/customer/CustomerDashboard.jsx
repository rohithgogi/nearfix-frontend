import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProviderSearch from './ProviderSearch';
import CustomerBookings from '../booking/CustomerBookings'; // ✅ NEW IMPORT
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showBookings, setShowBookings] = useState(false); // ✅ NEW STATE

  const services = [
    { id: 1, name: 'Plumbing', icon: '🔧', color: '#4A90E2' },
    { id: 2, name: 'Electrical', icon: '⚡', color: '#F5A623' },
    { id: 3, name: 'Cleaning', icon: '🧹', color: '#7ED321' },
    { id: 4, name: 'Carpentry', icon: '🪚', color: '#BD10E0' },
    { id: 5, name: 'Painting', icon: '🎨', color: '#F8E71C' },
    { id: 6, name: 'AC Repair', icon: '❄️', color: '#50E3C2' },
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowSearch(true);
  };

  const handleBackToDashboard = () => {
    setShowSearch(false);
    setSelectedService(null);
  };

  // ✅ If "My Bookings" is active, show CustomerBookings page
  if (showBookings) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>🔧 NearFix</h1>
            <div className="user-info">
              <button
                onClick={() => setShowBookings(false)}
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  marginRight: '15px',
                }}
              >
                ← Back to Dashboard
              </button>
              <span>+91 {user.phoneNumber}</span>
              <button onClick={logout} className="btn-logout">Logout</button>
            </div>
          </div>
        </header>

        <CustomerBookings />
      </div>
    );
  }

  // ✅ If search is active, show ProviderSearch
  if (showSearch && selectedService) {
    return (
      <ProviderSearch
        initialServiceId={selectedService.id}
        onBack={handleBackToDashboard}
      />
    );
  }

  // ✅ Main dashboard view
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🔧 NearFix</h1>
          <div className="user-info">
            <span>+91 {user.phoneNumber}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h2>Welcome Back! 👋</h2>
          <p>What service do you need today?</p>

          {/* ✅ NEW BUTTON */}
          <button
            onClick={() => setShowBookings(true)}
            style={{
              marginTop: '15px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            📋 View My Bookings
          </button>
        </section>

        <section className="services-section">
          <h3>Popular Services</h3>
          <div className="services-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card"
                style={{ borderColor: service.color }}
                onClick={() => handleServiceClick(service)}
              >
                <div
                  className="service-icon"
                  style={{ background: service.color }}
                >
                  {service.icon}
                </div>
                <h4>{service.name}</h4>
              </div>
            ))}
          </div>
        </section>

        <section className="bookings-section">
          <h3>Your Bookings</h3>
          <div className="empty-state">
            <p>📋</p>
            <p>No bookings yet</p>
            <p className="empty-subtitle">
              Book a service to see your history here
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;
