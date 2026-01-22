import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

const SERVICE_IMAGES = {
  'Plumbing': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop&q=80',
  'Electrical Work': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&q=80',
  'House Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80',
  'Carpentry': 'https://images.unsplash.com/photo-1597839170991-e91c46c6f0b5?w=800&h=600&fit=crop&q=80',
  'Painting': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop&q=80',
  'AC Repair': 'https://images.unsplash.com/photo-1631545304369-7a5c50c2d2f7?w=800&h=600&fit=crop&q=80',
};

export default function PublicLandingPage() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceClick = (service) => {
    window.location.href = `#search?service=${service.id}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f9fafb, #ffffff)' }}>
      {/* Header */}
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
          }} onClick={() => window.location.href = '#home'}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(to bottom right, #7c3aed, #2563eb)',
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
                background: 'linear-gradient(to right, #7c3aed, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                NearFix
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Your Local Services</div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '600px', position: 'relative', display: 'none' }}>
            <input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}>🔍</span>
          </div>

          {/* Login Button */}
          <button
            onClick={() => window.location.href = '#login'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              background: 'linear-gradient(to right, #7c3aed, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
          >
            <span>👤</span>
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(to bottom right, #ede9fe, #dbeafe, #fce7f3)',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '384px',
          height: '384px',
          background: '#c4b5fd',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.2,
          animation: 'pulse 3s infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '384px',
          height: '384px',
          background: '#93c5fd',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.2,
          animation: 'pulse 3s infinite'
        }} />

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '64px 16px',
          position: 'relative'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'white',
                borderRadius: '9999px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '24px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  animation: 'ping 1s infinite'
                }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  500+ verified professionals available
                </span>
              </div>

              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '24px',
                lineHeight: 1.2
              }}>
                Home services at your
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(to right, #7c3aed, #2563eb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  doorstep
                </span>
              </h1>

              <p style={{
                fontSize: '20px',
                color: '#6b7280',
                marginBottom: '32px',
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}>
                Book trusted professionals for all your home service needs. Fast, reliable, and affordable.
              </p>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '32px'
              }}>
                {[
                  { icon: '👥', value: '10,000+', label: 'Customers' },
                  { icon: '✅', value: '500+', label: 'Providers' },
                  { icon: '⭐', value: '4.8', label: 'Rating' },
                  { icon: '✓', value: '25,000+', label: 'Jobs Done' }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                        {stat.value}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(to right, #7c3aed, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '18px',
                  boxShadow: '0 10px 15px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.2)';
                }}
              >
                Explore Services →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '64px 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px'
            }}>
              Popular Services
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>
              {services.length} services available
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid #f3f4f6',
                transition: 'all 0.3s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#a78bfa';
                e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#f3f4f6';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                height: '192px',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom right, #ede9fe, #dbeafe)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${SERVICE_IMAGES[service.name] || SERVICE_IMAGES['Plumbing']})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
                }} />

                {/* Icon Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  width: '56px',
                  height: '56px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}>
                  {service.iconEmoji || '🔧'}
                </div>

                {/* Rating */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <span style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>4.8</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  {service.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {service.description || 'Professional service at your doorstep with guaranteed satisfaction'}
                </p>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <span>⏱️</span>
                    <span>60 min</span>
                  </div>
                  <span style={{
                    color: '#7c3aed',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Book Now →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px'
            }}>
              No services found
            </h3>
            <p style={{ color: '#6b7280' }}>Try adjusting your search query</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '48px 0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(to bottom right, #7c3aed, #2563eb)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>N</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>NearFix</span>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
            Your trusted platform for home services
          </p>
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '32px'
          }}>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              © 2024 NearFix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.3; }
          }
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(2); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}