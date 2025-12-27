import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

// StatCard component defined outside main component
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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

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
      const response = await fetch(`${API_BASE}/api/admin/pending?page=0&size=20`, {
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
    if (!window.confirm('Verify this provider?')) return;

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
      fetchStats();
      fetchPendingVerifications();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const rejectProvider = async (providerId) => {
    const reason = window.prompt('Enter rejection reason:');
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
      fetchStats();
      fetchPendingVerifications();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
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
              {tab}
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

            {loading && pendingProviders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
                <div>Loading verifications...</div>
              </div>
            ) : pendingProviders.length === 0 ? (
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
                    {/* Provider Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '20px',
                      paddingBottom: '15px',
                      borderBottom: '2px solid #f0f0f0'
                    }}>
                      <div>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#333' }}>
                          {provider.businessName || 'Unnamed Business'}
                        </h2>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                          📞 {provider.phoneNumber}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          🆔 Provider ID: #{provider.providerId}
                        </div>
                      </div>
                      <div style={{
                        padding: '8px 16px',
                        background: '#fff3cd',
                        border: '2px solid #ffc107',
                        borderRadius: '8px',
                        fontWeight: '600',
                        color: '#856404'
                      }}>
                        ⏳ {provider.verificationStatus}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: '25px' }}>
                      {/* Photo */}
                      <div>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>
                          Profile Photo
                        </div>
                        <div style={{
                          width: '150px',
                          height: '150px',
                          borderRadius: '12px',
                          background: provider.photoUrl
                            ? `url(${API_BASE}/api/files${provider.photoUrl})`
                            : '#667eea',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: '3px solid #e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '48px',
                          color: 'white'
                        }}>
                          {!provider.photoUrl && '👤'}
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px', fontWeight: '600' }}>
                          Business Information
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '13px', color: '#888' }}>📍 Location</div>
                          <div style={{ fontSize: '14px', color: '#333', marginTop: '4px' }}>
                            {provider.address}, {provider.city} - {provider.pincode}
                          </div>
                        </div>

                        {provider.bio && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '13px', color: '#888' }}>📝 Bio</div>
                            <div style={{ fontSize: '14px', color: '#333', marginTop: '4px' }}>
                              {provider.bio}
                            </div>
                          </div>
                        )}

                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '13px', color: '#888' }}>📊 Profile Completion</div>
                          <div style={{ marginTop: '6px' }}>
                            <div style={{
                              height: '8px',
                              background: '#e0e0e0',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${provider.profileCompletionPercentage}%`,
                                background: provider.profileCompletionPercentage === 100 ? '#28a745' : '#667eea',
                                transition: 'width 0.3s'
                              }} />
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                              {provider.profileCompletionPercentage}% complete
                            </div>
                          </div>
                        </div>

                        {provider.services && provider.services.length > 0 && (
                          <div style={{ marginTop: '15px' }}>
                            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
                              🔧 Services Offered
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {provider.services.map((service, idx) => (
                                <span key={idx} style={{
                                  padding: '6px 12px',
                                  background: '#f0f0f0',
                                  borderRadius: '12px',
                                  fontSize: '13px',
                                  border: '1px solid #e0e0e0'
                                }}>
                                  {service.serviceIcon} {service.serviceName} - ₹{service.basePrice}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ID Document Section */}
                        <div style={{
                          marginTop: '20px',
                          padding: '15px',
                          background: '#f8f9fa',
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0'
                        }}>
                          <div style={{ fontSize: '13px', color: '#888', marginBottom: '10px', fontWeight: '600' }}>
                            📄 Identity Document
                          </div>
                          {provider.aadharUrl ? (
                            <div>
                              <div style={{ fontSize: '12px', color: '#28a745', marginBottom: '8px' }}>
                                ✅ Document uploaded
                              </div>
                              <a
                                href={`${API_BASE}/api/files${provider.aadharUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-block',
                                  padding: '10px 20px',
                                  background: '#667eea',
                                  color: 'white',
                                  textDecoration: 'none',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600'
                                }}
                              >
                                📂 View Document →
                              </a>
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: '#dc3545' }}>
                              ❌ No document uploaded
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '140px' }}>
                        <button
                          onClick={() => verifyProvider(provider.providerId)}
                          disabled={!provider.aadharUrl || !provider.photoUrl}
                          style={{
                            padding: '12px 20px',
                            background: provider.aadharUrl && provider.photoUrl ? '#28a745' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: provider.aadharUrl && provider.photoUrl ? 'pointer' : 'not-allowed',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                          title={!provider.aadharUrl || !provider.photoUrl ? 'Profile incomplete' : 'Verify provider'}
                        >
                          ✅ Verify
                        </button>
                        <button
                          onClick={() => rejectProvider(provider.providerId)}
                          style={{
                            padding: '12px 20px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '15px',
                      borderTop: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      <div>
                        📅 Registered: {new Date(provider.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        📊 Total Bookings: {provider.totalBookings || 0} | ⭐ Rating: {provider.rating || '0.0'}
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
                          onClick={() => viewUserDetails(user)}
                          style={{
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

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }} onClick={() => setShowUserModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f0f0f0'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>👤 User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  background: '#e0e0e0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>
                  📞 Contact Information
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                    +91 {selectedUser.phoneNumber}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    User ID: #{selectedUser.userId}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>
                    👥 Role
                  </div>
                  <div style={{
                    padding: '12px',
                    background: selectedUser.role === 'PROVIDER' ? '#e3f2fd' : '#f3e5f5',
                    color: selectedUser.role === 'PROVIDER' ? '#1976d2' : '#9c27b0',
                    borderRadius: '8px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    {selectedUser.role}
                  </div>
                </div>

                {selectedUser.verificationStatus && (
                  <div>
                    <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>
                      ✓ Verification
                    </div>
                    <div style={{
                      padding: '12px',
                      background: selectedUser.verificationStatus === 'VERIFIED' ? '#d4edda' : '#fff3cd',
                      color: selectedUser.verificationStatus === 'VERIFIED' ? '#155724' : '#856404',
                      borderRadius: '8px',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      {selectedUser.verificationStatus}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowUserModal(false)}
              style={{
                width: '100%',
                marginTop: '25px',
                padding: '14px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}