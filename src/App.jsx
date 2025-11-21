import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import OtpVerification from './components/auth/OtpVerification';
import RoleSelection from './components/auth/RoleSelection';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ProviderDashboard from './components/provider/ProviderDashboard';
import './App.css';

function AppContent() {
  const { user, loading, isCustomer, isProvider } = useAuth();
  const [authStep, setAuthStep] = useState('login'); // login, otp, role
  const [phoneNumber, setPhoneNumber] = useState('');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    if (isCustomer()) {
      return <CustomerDashboard />;
    }
    if (isProvider()) {
      return <ProviderDashboard />;
    }
  }

  // Authentication flow
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

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;