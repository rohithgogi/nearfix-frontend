import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import OtpVerification from './components/auth/OtpVerification';
import RoleSelection from './components/auth/RoleSelection';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ProviderDashboard from './components/provider/ProviderDashboard';
import AdminDashboard from './components/admin/AdminDashboard'; // ✅ ADD THIS
import './App.css';

function AppContent() {
  const { user, loading, isCustomer, isProvider } = useAuth();
  const [authStep, setAuthStep] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    console.log('App State:', {
      authStep,
      phoneNumber,
      user,
      loading,
      isCustomer: isCustomer(),
      isProvider: isProvider()
    });
  }, [authStep, phoneNumber, user, loading]);

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
    console.log('User authenticated, role:', user.role);

    // ✅ ADD ADMIN CHECK
    if (user.role === 'ADMIN') {
      return <AdminDashboard />;
    }

    if (isCustomer()) {
      return <CustomerDashboard />;
    }
    if (isProvider()) {
      return <ProviderDashboard />;
    }
  }

  // Authentication flow
  if (authStep === 'login') {
    console.log('Rendering LoginScreen');
    return (
      <LoginScreen
        onOtpSent={(phone) => {
          console.log('OTP sent to:', phone);
          setPhoneNumber(phone);
          setAuthStep('otp');
        }}
      />
    );
  }

  if (authStep === 'otp') {
    console.log('Rendering OtpVerification for:', phoneNumber);
    return (
      <OtpVerification
        phoneNumber={phoneNumber}
        onNewUser={(phone) => {
          console.log('New user detected, moving to role selection:', phone);
          setPhoneNumber(phone);
          setAuthStep('role');
        }}
        onBack={() => {
          console.log('Going back to login');
          setAuthStep('login');
        }}
      />
    );
  }

  if (authStep === 'role') {
    console.log('Rendering RoleSelection for:', phoneNumber);
    return <RoleSelection phoneNumber={phoneNumber} />;
  }

  console.log('No matching state, this should not happen');
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