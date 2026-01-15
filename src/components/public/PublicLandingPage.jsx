import { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, User, ChevronDown } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

// Service images mapping
const SERVICE_IMAGES = {
  'Plumbing': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
  'Electrical Work': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
  'House Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
  'Carpentry': 'https://images.unsplash.com/photo-1597839170991-e91c46c6f0b5?w=400&h=300&fit=crop',
  'Painting': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
  'AC Repair': 'https://images.unsplash.com/photo-1631545304369-7a5c50c2d2f7?w=400&h=300&fit=crop',
  'Pest Control': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
  'Appliance Repair': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'Washing Machine Repair': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop',
  'Refrigerator Repair': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop',
  'Microwave Repair': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=300&fit=crop',
  'Water Purifier': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop'
};

export default function NearFixHomepage() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Connaught Place, New Delhi');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceClick = (service) => {
    window.location.href = `#search?service=${service.id}`;
  };

  const handleLogin = () => {
    window.location.href = '#login';
  };

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'OTHER';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  const categoryNames = {
    'HOME_REPAIR': 'Home Repairs',
    'CLEANING': 'Cleaning & Pest Control',
    'APPLIANCE_REPAIR': 'Appliance Services',
    'OTHER': 'Other Services'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            minWidth: '150px'
          }} onClick={() => window.location.href = '#home'}>
            <div style={{
              width: '36px',
              height: '36px',
              background: '#000',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#fff'
            }}>
              N
            </div>
            <span style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#000',
              letterSpacing: '-0.5px'
            }}>
              NearFix
            </span>
          </div>

          {/* Location Selector */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <div
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                background: '#fff',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#000'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            >
              <MapPin size={18} color="#666" />
              <span style={{
                fontSize: '14px',
                color: '#333',
                fontWeight: '500',
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {location}
              </span>
              <ChevronDown size={16} color="#666" />
            </div>
          </div>

          {/* Search Bar */}
          <div style={{
            flex: 1,
            maxWidth: '600px',
            position: 'relative'
          }}>
            <Search
              size={20}
              color="#999"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type="text"
              placeholder="Search for 'Kitchen cleaning'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#000'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {/* Right Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            minWidth: '120px',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              position: 'relative',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ShoppingCart size={22} color="#333" />
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: '#ff4757',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                0
              </span>
            </div>

            <button
              onClick={handleLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#333'}
              onMouseLeave={(e) => e.target.style.background = '#000'}
            >
              <User size={18} />
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
        padding: '60px 24px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#000',
            margin: '0 0 16px 0',
            letterSpacing: '-1px'
          }}>
            Home services at your doorstep
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#666',
            margin: 0,
            fontWeight: '400'
          }}>
            What are you looking for?
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 24px'
      }}>
        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '32px',
              letterSpacing: '-0.5px'
            }}>
              {categoryNames[category] || category}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {categoryServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    e.currentTarget.style.borderColor = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }}
                >
                  {/* Service Image */}
                  <div style={{
                    width: '100%',
                    height: '180px',
                    background: `url(${SERVICE_IMAGES[service.name] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {service.iconEmoji || '🔧'}
                    </div>
                  </div>

                  {/* Service Info */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#000',
                      margin: '0 0 8px 0',
                      letterSpacing: '-0.3px'
                    }}>
                      {service.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: 0,
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {service.description || 'Professional service at your doorstep'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        background: '#000',
        color: '#fff',
        padding: '48px 24px',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>
            NearFix
          </div>
          <p style={{
            fontSize: '14px',
            color: '#999',
            margin: '0 0 24px 0'
          }}>
            Your trusted platform for home services
          </p>
          <div style={{
            fontSize: '12px',
            color: '#666'
          }}>
            © 2024 NearFix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}