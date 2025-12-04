import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

const ProviderServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token found:', token ? 'YES' : 'NO');
    console.log('🔑 Token preview:', token?.substring(0, 20) + '...');

    fetchAllServices();
    if (token) {
      fetchProviderServices();
    } else {
      setError('⚠️ Not authenticated. Please log in again.');
    }
  }, []);

  const fetchAllServices = async () => {
    try {
      console.log('Fetching all services from:', `${API_BASE}/api/services`);
      const response = await fetch(`${API_BASE}/api/services`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Services fetched:', data);
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load available services');
    }
  };

  const fetchProviderServices = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching provider services from:', `${API_BASE}/api/provider/services`);
      console.log('Using token:', token.substring(0, 20) + '...');

      const response = await fetch(`${API_BASE}/api/provider/services`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Provider services fetched:', data);
      setProviderServices(data);
    } catch (err) {
      console.error('Error fetching provider services:', err);
      setError('Failed to load your services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Adding service:', {
        serviceId: parseInt(selectedServiceId),
        basePrice: parseFloat(basePrice),
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        description: description || null
      });

      const response = await fetch(`${API_BASE}/api/provider/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: parseInt(selectedServiceId),
          basePrice: parseFloat(basePrice),
          experienceYears: experienceYears ? parseInt(experienceYears) : null,
          description: description || null
        })
      });

      console.log('Add service response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(errorData || 'Failed to add service');
      }

      const data = await response.json();
      console.log('Service added successfully:', data);
      setProviderServices([...providerServices, data]);
      resetForm();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding service:', err);
      setError(err.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/provider/services/${editingService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          basePrice: parseFloat(basePrice),
          experienceYears: experienceYears ? parseInt(experienceYears) : null,
          description: description || null,
          available
        })
      });

      if (!response.ok) throw new Error('Failed to update service');

      const data = await response.json();
      setProviderServices(providerServices.map(s =>
        s.id === editingService.id ? data : s
      ));
      resetForm();
      setEditingService(null);
    } catch (err) {
      setError(err.message || 'Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to remove this service?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/provider/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to remove service');

      setProviderServices(providerServices.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to remove service');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setBasePrice(service.basePrice);
    setExperienceYears(service.experienceYears || '');
    setDescription(service.description || '');
    setAvailable(service.available);
  };

  const resetForm = () => {
    setSelectedServiceId('');
    setBasePrice('');
    setExperienceYears('');
    setDescription('');
    setAvailable(true);
    setError('');
  };

  const getAvailableServices = () => {
    const providerServiceIds = providerServices.map(ps => ps.serviceId);
    return services.filter(s => !providerServiceIds.includes(s.id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>My Services</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Manage the services you provide</p>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          + Add New Service
        </button>

        {loading && providerServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : providerServices.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '10px' }}>🔧</div>
            <h3 style={{ margin: '10px 0', color: '#333' }}>No Services Added</h3>
            <p style={{ color: '#666' }}>Add services you provide to start receiving bookings</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {providerServices.map(service => (
              <div key={service.id} style={{
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{
                    fontSize: '36px',
                    background: '#f0f0f0',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {service.serviceIcon || '🔧'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{service.serviceName}</h3>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: service.available ? '#d4edda' : '#f8d7da',
                      color: service.available ? '#155724' : '#721c24'
                    }}>
                      {service.available ? '✓ Available' : '✗ Unavailable'}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '15px', color: '#666' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea', marginBottom: '10px' }}>
                    ₹{service.basePrice}
                  </div>
                  {service.experienceYears && (
                    <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                      📅 {service.experienceYears} years experience
                    </div>
                  )}
                  {service.description && (
                    <div style={{
                      fontSize: '14px',
                      marginTop: '10px',
                      color: '#888',
                      lineHeight: '1.5'
                    }}>
                      {service.description}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => openEditModal(service)}
                    style={{
                      flex: 1,
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    disabled={loading}
                    style={{
                      flex: 1,
                      background: '#ff4757',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
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
          }} onClick={() => setShowAddModal(false)}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ margin: '0 0 20px 0' }}>Add New Service</h2>

              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Select Service *
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Choose a service...</option>
                    {getAvailableServices().map(service => (
                      <option key={service.id} value={service.id}>
                        {service.iconEmoji} {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '16px'
                    }}
                    placeholder="500"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '16px'
                    }}
                    placeholder="5"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    placeholder="Describe your service expertise..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleAddService}
                    disabled={loading || !selectedServiceId || !basePrice}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      opacity: loading || !selectedServiceId || !basePrice ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Service'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    style={{
                      flex: 1,
                      background: '#e0e0e0',
                      color: '#333',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {editingService && (
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
          }} onClick={() => setEditingService(null)}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ margin: '0 0 20px 0' }}>Edit Service</h2>

              <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '10px'
              }}>
                <strong>{editingService.serviceIcon} {editingService.serviceName}</strong>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Experience (Years)
                </label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    style={{
                      marginRight: '10px',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  Service is available for booking
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleUpdateService}
                  disabled={loading || !basePrice}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: loading || !basePrice ? 0.6 : 1
                  }}
                >
                  {loading ? 'Updating...' : 'Update Service'}
                </button>
                <button
                  onClick={() => {
                    setEditingService(null);
                    resetForm();
                  }}
                  style={{
                    flex: 1,
                    background: '#e0e0e0',
                    color: '#333',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderServicesManagement;