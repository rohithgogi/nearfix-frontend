import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

export default function ProviderSearch({ initialServiceId = 1, onBack = null }) {
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [services, setServices] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [radius, setRadius] = useState(10);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Filters
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
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          setError('Please enable location access');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  const handleSearch = async () => {
    if (!location.lat || !location.lng) {
      setError('Location not available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const searchRequest = {
        serviceId,
        latitude: location.lat,
        longitude: location.lng,
        radiusKm: radius,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : null,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
        minRating: filters.minRating ? parseFloat(filters.minRating) : null,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      const response = await fetch(`${API_BASE}/api/search/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchRequest)
      });

      const data = await response.json();
      setProviders(data);
    } catch (err) {
      setError('Failed to search providers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewProviderDetail = async (providerId) => {
    try {
      const response = await fetch(`${API_BASE}/api/search/providers/${providerId}`);
      const data = await response.json();
      setSelectedProvider(data);
    } catch (err) {
      console.error('Error fetching provider details:', err);
    }
  };

  if (selectedProvider) {
    return <ProviderDetail provider={selectedProvider} onBack={() => setSelectedProvider(null)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Back Button (if onBack provided) */}
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
              fontSize: '16px'
            }}
          >
            ← Back to Dashboard
          </button>
        )}

        {/* Header */}
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

        {/* Search Controls */}
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
                Service Type
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
              >
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

          {/* Filters */}
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
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Max Price (₹)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  placeholder="10000"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
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
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
          </details>

          {/* Location Status */}
          <div style={{
            background: location.lat ? '#d4edda' : '#fff3cd',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {location.lat ? (
              <>📍 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</>
            ) : (
              <>⚠️ Waiting for location access...</>
            )}
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading || !location.lat}
            style={{
              width: '100%',
              padding: '14px',
              background: loading || !location.lat ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !location.lat ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : '🔍 Search Providers'}
          </button>
        </div>

        {/* Results */}
        {providers.length > 0 ? (
          <>
            <div style={{ marginBottom: '20px', color: '#666' }}>
              Found {providers.length} provider{providers.length !== 1 ? 's' : ''}
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
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
            <p>Searching for providers...</p>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>🔧</div>
            <h3 style={{ margin: '10px 0', color: '#333' }}>No Providers Found</h3>
            <p style={{ color: '#666' }}>Try adjusting your search filters or increasing the radius</p>
          </div>
        )}
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
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    onClick={onViewDetail}
    >
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '12px',
          background: provider.photoUrl ? `url(http://localhost:8080/api/files${provider.photoUrl})` : '#f0f0f0',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px'
        }}>
          {!provider.photoUrl && '👤'}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
            {provider.businessName}
            {provider.verified && <span style={{ marginLeft: '5px' }}>✓</span>}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
            <span>⭐ {provider.rating.toFixed(1)}</span>
            <span>•</span>
            <span>📍 {provider.distanceKm} km</span>
          </div>
          {provider.experienceYears && (
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
              {provider.experienceYears} years experience
            </div>
          )}
        </div>
      </div>

      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#667eea',
        marginBottom: '12px'
      }}>
        Starting at ₹{provider.startingPrice}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Services Offered:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {provider.servicesOffered.slice(0, 3).map((service, idx) => (
            <span key={idx} style={{
              padding: '4px 10px',
              background: '#f0f0f0',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {service.serviceIcon} {service.serviceName}
            </span>
          ))}
          {provider.servicesOffered.length > 3 && (
            <span style={{
              padding: '4px 10px',
              background: '#f0f0f0',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              +{provider.servicesOffered.length - 3} more
            </span>
          )}
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
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'white',
            border: '2px solid #e0e0e0',
            padding: '10px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to Search
        </button>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: '25px', marginBottom: '30px', alignItems: 'flex-start' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '15px',
              background: provider.photoUrl ? `url(http://localhost:8080/api/files${provider.photoUrl})` : '#f0f0f0',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px'
            }}>
              {!provider.photoUrl && '👤'}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
                {provider.businessName}
                {provider.verificationStatus === 'VERIFIED' && (
                  <span style={{
                    marginLeft: '10px',
                    fontSize: '16px',
                    padding: '4px 12px',
                    background: '#d4edda',
                    color: '#155724',
                    borderRadius: '12px'
                  }}>
                    ✓ Verified
                  </span>
                )}
              </h1>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '10px', fontSize: '16px', color: '#666' }}>
                <span>⭐ {provider.rating.toFixed(1)} ({provider.totalReviews} reviews)</span>
                <span>•</span>
                <span>📋 {provider.totalBookings} bookings</span>
                {provider.experienceYears && (
                  <>
                    <span>•</span>
                    <span>👔 {provider.experienceYears} years exp</span>
                  </>
                )}
              </div>

              <div style={{ color: '#666' }}>
                📍 {provider.address}, {provider.city} - {provider.pincode}
              </div>
            </div>
          </div>

          {/* Services */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Services Offered</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {provider.services.map((service, idx) => (
                <div key={idx} style={{
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{service.serviceIcon}</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>{service.serviceName}</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#667eea' }}>
                    ₹{service.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          {provider.bio && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>About</h3>
              <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>{provider.bio}</p>
            </div>
          )}

          {/* Working Hours */}
          {provider.workingHours && provider.workingHours !== '{}' && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Working Hours</h3>
              <div style={{ color: '#666' }}>
                {provider.workingHours}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Customer Reviews</h3>
            <div style={{
              background: '#f8f9fa',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>⭐</div>
              <p>Reviews feature coming soon!</p>
            </div>
          </div>

          {/* Book Button */}
          <button style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            📅 Book This Provider
          </button>
        </div>
      </div>
    </div>
  );
}