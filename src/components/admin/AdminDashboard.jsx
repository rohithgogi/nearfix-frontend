import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    } else if (activeTab === 'verifications') {
      fetchPendingVerifications();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingVerifications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/admin/providers/pending?page=0&size=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch verifications');
      const data = await response.json();
      setPendingProviders(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/admin/users?page=0&size=50`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyProvider = async (providerId) => {
    if (!confirm('Verify this provider?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/providers/${providerId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: 'Verified by admin' })
      });

      if (!response.ok) throw new Error('Failed to verify provider');
      alert('✅ Provider verified successfully');
      fetchPendingVerifications();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const rejectProvider = async (providerId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/providers/${providerId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) throw new Error('Failed to reject provider');
      alert('❌ Provider rejected');
      fetchPendingVerifications();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const formatCurrency = (num) => {
    return `₹${formatNumber(num)}`;
  };

  const formatPercentage = (num) => {
    if (num === undefined || num === null) return '0%';
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

  const getGrowthColor = (num) => {
    if (num > 0) return '#28a745';
    if (num < 0) return '#dc3545';
    return '#666';
  };

  if (loading && !stats && !pendingProviders.length && !users.length) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '48px' }}>⏳</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px 40px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>👨‍💼 Admin Dashboard</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Platform Management & Oversight</p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: 'white',
        borderBottom: '2px solid #e0e0e0',
        padding: '0 40px'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['overview', 'verifications', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '15px 25px',
                background: activeTab === tab ? '#667eea' : 'transparent',
                color: activeTab === tab ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'verifications' && pendingProviders.length > 0 && (
                <span style={{
                  background: '#ff4757',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}>
                  {pendingProviders.length}
                </span>
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '30px 40px' }}>
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Users */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '48px' }}>👥</div>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                      {formatNumber(stats.totalUsers)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Total Users</div>
                    <div style={{
                      fontSize: '12px',
                      color: getGrowthColor(stats.userGrowthRate),
                      marginTop: '5px'
                    }}>
                      {formatPercentage(stats.userGrowthRate)} this month
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookings */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '48px' }}>📋</div>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                      {formatNumber(stats.totalBookings)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Total Bookings</div>
                    <div style={{
                      fontSize: '12px',
                      color: getGrowthColor(stats.bookingGrowthRate),
                      marginTop: '5px'
                    }}>
                      {formatPercentage(stats.bookingGrowthRate)} this month
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '48px' }}>💰</div>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                      {formatCurrency(stats.totalRevenue)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Total Revenue</div>
                    <div style={{
                      fontSize: '12px',
                      color: getGrowthColor(stats.revenueGrowthRate),
                      marginTop: '5px'
                    }}>
                      {formatPercentage(stats.revenueGrowthRate)} this month
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Verifications */}
              <div style={{
                background: stats.pendingVerifications > 0 ? '#fff3cd' : 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: stats.pendingVerifications > 0 ? '2px solid #ffc107' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '48px' }}>⏳</div>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>
                      {formatNumber(stats.pendingVerifications)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Pending Verifications</div>
                    <button
                      onClick={() => setActiveTab('verifications')}
                      style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Review Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <StatCard icon="👤" label="Customers" value={formatNumber(stats.totalCustomers)} />
              <StatCard icon="🔧" label="Providers" value={formatNumber(stats.totalProviders)} />
              <StatCard icon="✅" label="Completed" value={formatNumber(stats.completedBookings)} />
              <StatCard icon="⏳" label="Pending" value={formatNumber(stats.pendingBookings)} />
              <StatCard icon="✓" label="Verified" value={formatNumber(stats.verifiedProviders)} />
              <StatCard icon="❌" label="Rejected" value={formatNumber(stats.rejectedProviders)} />
            </div>

            {/* Recent Activity */}
            {stats.recentActivities && stats.recentActivities.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 20px 0' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {stats.recentActivities.slice(0, 10).map((activity, idx) => (
                    <div key={idx} style={{
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                          {activity.description}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {activity.userPhone}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#999', textAlign: 'right' }}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Provider Verification Queue</h2>

            {pendingProviders.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '60px 20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '10px' }}>✅</div>
                <h3>All Caught Up!</h3>
                <p style={{ color: '#666' }}>No pending verifications</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {pendingProviders.map(provider => (
                  <div key={provider.providerId} style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '25px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '20px' }}>
                      {/* Photo */}
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '12px',
                        background: provider.photoUrl
                          ? `url(${API_BASE}/api/files${provider.photoUrl})`
                          : '#667eea',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }} />

                      {/* Details */}
                      <div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{provider.businessName || 'Unnamed Business'}</h3>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                          📞 {provider.phoneNumber}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                          📍 {provider.address}, {provider.city} - {provider.pincode}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                          📊 Profile: {provider.profileCompletionPercentage}% complete
                        </div>

                        {provider.services && provider.services.length > 0 && (
                          <div style={{ marginTop: '10px' }}>
                            <strong style={{ fontSize: '14px' }}>Services:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                              {provider.services.map((service, idx) => (
                                <span key={idx} style={{
                                  padding: '4px 12px',
                                  background: '#f0f0f0',
                                  borderRadius: '12px',
                                  fontSize: '12px'
                                }}>
                                  {service.serviceIcon} {service.serviceName} - ₹{service.basePrice}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {provider.aadharUrl && (
                          <div style={{ marginTop: '10px' }}>
                            <a
                              href={`${API_BASE}/api/files${provider.aadharUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#667eea',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '600'
                              }}
                            >
                              📄 View ID Document →
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                          onClick={() => verifyProvider(provider.providerId)}
                          style={{
                            padding: '12px 24px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          ✅ Verify
                        </button>
                        <button
                          onClick={() => rejectProvider(provider.providerId)}
                          style={{
                            padding: '12px 24px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>User Management</h2>

            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              overflowX: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Bookings</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.userId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        {user.phoneNumber}
                        {user.businessName && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {user.businessName}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: user.role === 'PROVIDER' ? '#e3f2fd' : '#f3e5f5',
                          color: user.role === 'PROVIDER' ? '#1976d2' : '#9c27b0'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {user.verificationStatus && (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            background: user.verificationStatus === 'VERIFIED' ? '#d4edda' : '#fff3cd',
                            color: user.verificationStatus === 'VERIFIED' ? '#155724' : '#856404'
                          }}>
                            {user.verificationStatus}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {user.totalBookings || 0}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          style={{
                            padding: '6px 12px',
                            background: '#e0e0e0',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{ fontSize: '32px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>
          {value}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>{label}</div>
      </div>
    </div>
  );
}