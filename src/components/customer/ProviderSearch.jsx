import { useState, useEffect } from 'react';
import BookingForm from '../booking/BookingForm';
const API_BASE = 'http://localhost:8080';

export default function ProviderSearch({ initialServiceId = 1, onBack = null }) {
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [services, setServices] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState('loading');
  const [manualLocation, setManualLocation] = useState(false);
  const [radius, setRadius] = useState(10);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'distance',
    sortOrder: 'asc'
  });

  useEffect(() => {
    fetchServices();
    getCurrentLocation();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/services`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setManualLocation(true);
      return;
    }

    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('granted');
        setManualLocation(false);
        setError('');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('denied');
        setManualLocation(true);

        // Set default location (Chennai) as fallback
        setLocation({ lat: 13.0827, lng: 80.2707 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleManualLocation = (lat, lng) => {
    setLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
    setLocationStatus('manual');
    setError('');
  };

  const handleSearch = async () => {
    if (!location.lat || !location.lng) {
      setError('Please provide a valid location');
      return;
    }

    if (!serviceId) {
      setError('Please select a service');
      return;
    }

    setLoading(true);
    setError('');
    setProviders([]);

    try {
      const searchRequest = {
        serviceId: parseInt(serviceId),
        latitude: location.lat,
        longitude: location.lng,
        radiusKm: radius,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : null,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
        minRating: filters.minRating ? parseFloat(filters.minRating) : null,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      console.log('🔍 Searching with:', searchRequest);

      const response = await fetch(`${API_BASE}/api/search/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to search providers');
      }

      const data = await response.json();
      console.log('✅ Found:', data.length, 'providers');
      setProviders(data);

      if (data.length === 0) {
        setError('No providers found. Try increasing search radius or changing service.');
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const viewProviderDetail = async (providerId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/search/providers/${providerId}`);
      if (!response.ok) throw new Error('Failed to load provider details');
      const data = await response.json();
      setSelectedProvider(data);
    } catch (err) {
      setError('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  if (selectedProvider) {
    return (
      <ProviderDetail
        provider={selectedProvider}
        onBack={() => {
          setSelectedProvider(null);
          setError('');
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'white',
              border: '2px solid #e0e0e0',
              padding: '10px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            ← Back to Dashboard
          </button>
        )}

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>🔍 Find Providers</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Search for local service providers near you</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Service Type *
              </label>
              <select
                value={serviceId}
                onChange={(e) => {
                  setServiceId(parseInt(e.target.value));
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
              >
                <option value="">Select a service...</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.iconEmoji} {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Search Radius: {radius} km
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                style={{ width: '100%', height: '40px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                <span>5 km</span>
                <span>50 km</span>
              </div>
            </div>
          </div>

          {/* Location Section - SIMPLE & CLEAN */}
          {locationStatus === 'denied' || locationStatus === 'error' ? (
            <div style={{
              background: '#fff3cd',
              border: '2px solid #ffc107',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📍</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Location Permission Needed</h3>
              <p style={{ color: '#856404', marginBottom: '20px', lineHeight: '1.6' }}>
                To find nearby providers, we need to access your location.<br/>
                Please click the button below and allow location access.
              </p>
              <button
                onClick={getCurrentLocation}
                style={{
                  padding: '14px 30px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
              >
                🔓 Enable Location Access
              </button>
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#666'
              }}>
                <strong>💡 How to enable:</strong><br/>
                1. Click the 🔓 button above<br/>
                2. When browser asks, click "Allow"<br/>
                3. If you previously blocked it, click the 🔒 icon in your browser's address bar
              </div>
            </div>
          ) : locationStatus === 'loading' ? (
            <div style={{
              background: '#cfe2ff',
              border: '2px solid #0d6efd',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>⏳</div>
              <h3 style={{ margin: 0, color: '#084298' }}>Getting your location...</h3>
              <p style={{ color: '#084298', margin: '10px 0 0 0', fontSize: '14px' }}>
                This may take a few seconds
              </p>
            </div>
          ) : locationStatus === 'granted' || locationStatus === 'manual' ? (
            <div style={{
              background: '#d4edda',
              border: '2px solid #c3e6cb',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📍</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#155724' }}>Location Set</div>
                  <div style={{ fontSize: '13px', color: '#155724', opacity: 0.8 }}>
                    {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}
                  </div>
                </div>
              </div>
              <button
                onClick={getCurrentLocation}
                style={{
                  padding: '8px 16px',
                  background: 'white',
                  border: '2px solid #c3e6cb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#155724'
                }}
              >
                🔄 Update
              </button>
            </div>
          ) : null}

          <details style={{ marginBottom: '15px' }}>
            <summary style={{
              cursor: 'pointer',
              fontWeight: '600',
              padding: '10px',
              background: '#f5f5f5',
              borderRadius: '8px'
            }}>
              ⚙️ Filters & Sorting
            </summary>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginTop: '15px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Min Price (₹)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  placeholder="0"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Max Price (₹)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  placeholder="10000"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="">Any</option>
                  <option value="3">3+ ⭐</option>
                  <option value="4">4+ ⭐</option>
                  <option value="4.5">4.5+ ⭐</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
          </details>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid #fcc'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading || !location.lat || !location.lng || !serviceId}
            style={{
              width: '100%',
              padding: '14px',
              background: loading || !location.lat || !location.lng || !serviceId
                ? '#ccc'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !location.lat || !location.lng || !serviceId ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 Searching...' : '🔍 Search Providers'}
          </button>
        </div>

        {loading && providers.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>🔄</div>
            <h3 style={{ margin: '10px 0', color: '#333' }}>Searching...</h3>
          </div>
        ) : providers.length > 0 ? (
          <>
            <div style={{ marginBottom: '20px', color: '#666', fontSize: '18px', fontWeight: '600' }}>
              ✅ Found {providers.length} provider{providers.length !== 1 ? 's' : ''}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {providers.map(provider => (
                <ProviderCard
                  key={provider.providerId}
                  provider={provider}
                  onViewDetail={() => viewProviderDetail(provider.providerId)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function ProviderCard({ provider, onViewDetail }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    }}
    onClick={onViewDetail}
    >
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '12px',
          background: provider.photoUrl
            ? `url(${API_BASE}/api/files${provider.photoUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          color: 'white'
        }}>
          {!provider.photoUrl && '👤'}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
            {provider.businessName}
            {provider.verified && <span style={{ color: '#28a745', marginLeft: '5px' }}>✓</span>}
          </h3>
          <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#666' }}>
            <span>⭐ {provider.rating?.toFixed(1) || '0.0'}</span>
            <span>•</span>
            <span>📍 {provider.distanceKm?.toFixed(1)} km</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea', marginBottom: '12px' }}>
        Starting at ₹{provider.startingPrice}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Services:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {provider.servicesOffered?.slice(0, 3).map((service, idx) => (
            <span key={idx} style={{
              padding: '4px 10px',
              background: '#f0f0f0',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {service.serviceIcon} {service.serviceName}
            </span>
          ))}
        </div>
      </div>

      <button style={{
        width: '100%',
        padding: '10px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
      }}>
        View Full Profile →
      </button>
    </div>
  );
}


function ProviderDetail({ provider, onBack }) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: "20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            background: "white",
            border: "2px solid #e0e0e0",
            padding: "10px 20px",
            borderRadius: "8px",
            marginBottom: "20px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          ← Back to Search
        </button>

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
            {provider.businessName}
          </h1>

          {/* UPDATED SERVICES WITH BOOK BUTTON */}
          {provider.services && provider.services.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h3>Services Offered</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "15px",
                }}
              >
                {provider.services.map((service, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "15px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "12px",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                      {service.serviceIcon}
                    </div>
                    <div style={{ fontWeight: "600" }}>
                      {service.serviceName}
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        color: "#667eea",
                        marginBottom: "10px",
                      }}
                    >
                      ₹{service.price}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setShowBookingForm(true);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      📅 Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOOKING FORM SECTION */}
          {showBookingForm && selectedService && (
            <BookingForm
              provider={provider}
              service={selectedService}
              onSuccess={(booking) => {
                setShowBookingForm(false);
                alert(
                  `✅ Booking #${booking.id} created successfully! Check "My Bookings" to track status.`
                );
              }}
              onCancel={() => setShowBookingForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}


