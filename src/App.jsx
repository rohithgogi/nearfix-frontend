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
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#667eea',
          cursor: 'pointer'
        }} onClick={() => window.location.hash = 'home'}>
          🔧 NearFix
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a
            href="#home"
            style={{
              textDecoration: 'none',
              color: '#333',
              fontWeight: '500'
            }}
          >
            Home
          </a>
          <a
            href="#search"
            style={{
              textDecoration: 'none',
              color: '#333',
              fontWeight: '500'
            }}
          >
            Browse Services
          </a>
          <button
            onClick={() => window.location.hash = 'login'}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Login / Sign Up
          </button>
        </div>
      </nav>

      {/* Add padding to account for fixed nav */}
      <div style={{ paddingTop: '70px' }}>
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;