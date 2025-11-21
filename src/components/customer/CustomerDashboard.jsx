import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();

  const services = [
    { id: 1, name: 'Plumbing', icon: '🔧', color: '#4A90E2' },
    { id: 2, name: 'Electrical', icon: '⚡', color: '#F5A623' },
    { id: 3, name: 'Cleaning', icon: '🧹', color: '#7ED321' },
    { id: 4, name: 'Carpentry', icon: '🪚', color: '#BD10E0' },
    { id: 5, name: 'Painting', icon: '🎨', color: '#F8E71C' },
    { id: 6, name: 'AC Repair', icon: '❄️', color: '#50E3C2' },
  ];

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
        </section>

        <section className="services-section">
          <h3>Popular Services</h3>
          <div className="services-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card"
                style={{ borderColor: service.color }}
                onClick={() => alert(`${service.name} - Coming soon!`)}
              >
                <div className="service-icon" style={{ background: service.color }}>
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
            <p className="empty-subtitle">Book a service to see your history here</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;