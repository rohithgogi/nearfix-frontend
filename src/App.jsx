import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import OtpVerification from './components/auth/OtpVerification';
import RoleSelection from './components/auth/RoleSelection';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ProviderDashboard from './components/provider/ProviderDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import PublicLandingPage from './components/public/PublicLandingPage';
import ProviderSearch from './components/customer/ProviderSearch';
import './App.css';

function AppContent() {
  const { user, loading, isCustomer, isProvider } = useAuth();
  const [authStep, setAuthStep] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentRoute, setCurrentRoute] = useState('home');

  // Simple router based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Reset auth step when user logs in successfully
  useEffect(() => {
    if (user && authStep !== 'login') {
      setAuthStep('login');
      // Redirect to appropriate dashboard after successful auth
      if (currentRoute === 'login' || currentRoute === 'home') {
        window.location.hash = 'home';
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // ========================================
  // 📱 PUBLIC ROUTES (No Login Required)
  // ========================================

  // Home/Landing Page
  if (currentRoute === 'home' && !user) {
    return <PublicLandingPage />;
  }

  // Public Search (Anyone can browse)
  if (currentRoute === 'search') {
    return <ProviderSearch initialServiceId={1} />;
  }

  // ========================================
  // 🔐 LOGIN FLOW (Priority over authenticated routes during auth)
  // ========================================

  // Show login flow if on login route OR in middle of auth process
  if (currentRoute === 'login' || (authStep !== 'login' && !user)) {
    if (authStep === 'login') {
      return (
        <LoginScreen
          onOtpSent={(phone) => {
            setPhoneNumber(phone);
            setAuthStep('otp');
          }}
        />
      );
    }

    if (authStep === 'otp') {
      return (
        <OtpVerification
          phoneNumber={phoneNumber}
          onNewUser={(phone) => {
            setPhoneNumber(phone);
            setAuthStep('role');
          }}
          onBack={() => setAuthStep('login')}
        />
      );
    }

    if (authStep === 'role') {
      return <RoleSelection phoneNumber={phoneNumber} />;
    }
  }

  // ========================================
  // 🔐 AUTHENTICATED ROUTES
  // ========================================

  if (user) {
    // Admin Dashboard
    if (user.role === 'ADMIN') {
      return <AdminDashboard />;
    }

    // Customer Dashboard
    if (isCustomer()) {
      return <CustomerDashboard />;
    }

    // Provider Dashboard
    if (isProvider()) {
      return <ProviderDashboard />;
    }
  }

  // ========================================
  // 🏠 DEFAULT: Show Public Landing
  // ========================================
  return <PublicLandingPage />;
}

function App() {
  return (
    <AuthProvider>
      {/* Navigation Bar */}
      {/* Single Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }} onClick={() => window.location.hash = 'home'}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(to bottom right, #667eea, #764ba2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>N</span>
            </div>
            <div>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                NearFix
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Your Local Services</div>
            </div>
          </div>

          {/* Navigation Links + Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a
              href="#home"
              style={{
                textDecoration: 'none',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              Home
            </a>
            <a
              href="#search"
              style={{
                textDecoration: 'none',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              Browse Services
            </a>

            <button
              onClick={() => window.location.hash = 'login'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                background: 'linear-gradient(to right, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>👤</span>
              <span>Login / Sign Up</span>
            </button>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed nav */}
      <div style={{ paddingTop: '70px' }}>
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
