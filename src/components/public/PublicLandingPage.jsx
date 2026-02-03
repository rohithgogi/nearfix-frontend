import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

const SERVICE_CATEGORIES = [
  {
    id: 'professionals',
    name: 'Professionals',
    icon: '👨‍💼',
    color: '#667eea',
    description: 'Plumbers, electricians & carpenters'
  },
  {
    id: 'homecare',
    name: 'Homecare',
    icon: '🏠',
    color: '#764ba2',
    description: 'Cleaning, painting & maintenance'
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    icon: '🔧',
    color: '#f093fb',
    description: 'AC, fridge & appliance repairs'
  },
  {
    id: 'pest',
    name: 'Pest Control',
    icon: '🦟',
    color: '#4facfe',
    description: 'Cockroach, termite & pest control'
  }
];

const SERVICE_MAP = {
  professionals: ['Plumbing', 'Electrical Work', 'Carpentry'],
  homecare: ['House Cleaning', 'Kitchen Deep Cleaning', 'Bathroom Deep Cleaning', 'Painting', 'Wall Plastering', 'Floor Tiles', 'False Ceiling', 'Bathroom Fitting', 'Door & Window Repair'],
  appliance: ['AC Repair', 'Washing Machine Repair', 'Refrigerator Repair', 'Microwave Repair', 'Water Purifier Service', 'Chimney Repair', 'Geyser Repair'],
  pest: ['Cockroach Control', 'Termite Control', 'Bed Bug Control', 'Rodent Control', 'Mosquito Control']
};

export default function PublicLandingPage() {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory && services.length > 0) {
      const categoryServices = SERVICE_MAP[selectedCategory];
      const filtered = services.filter(s => categoryServices.includes(s.name));
      setFilteredServices(filtered);
    }
  }, [selectedCategory, services]);

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

  const renderStars = (rating) => {
    return (
      <span style={{ color: '#fbbf24' }}>
        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f9fafb, #ffffff)' }}>
      {/* Removed duplicate header - using App.jsx fixed navigation instead */}

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(to bottom right, #ede9fe, #dbeafe, #fce7f3)',
        overflow: 'hidden'
      }}>
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
          position: 'relative',
          textAlign: 'center'
        }}>
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
              background: 'linear-gradient(to right, #667eea, #764ba2)',
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
            onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(to right, #667eea, #764ba2)',
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

      {/* Categories Section */}
      <div id="categories" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '64px 16px'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          Service Categories
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          Choose a category to see available services
        </p>

        {/* Category Cards - NOW 4 CATEGORIES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {SERVICE_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '30px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedCategory === category.id ? `3px solid ${category.color}` : '2px solid #f3f4f6',
                transition: 'all 0.3s',
                transform: selectedCategory === category.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: selectedCategory === category.id ? `0 10px 25px ${category.color}33` : '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.borderColor = category.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.borderColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '12px'
              }}>
                {category.icon}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                {category.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {category.description}
              </p>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        {selectedCategory && (
          <div style={{
            marginTop: '40px',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '30px'
            }}>
              {SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name} Services
            </h3>

            {filteredServices.length > 0 ? (
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
                      e.currentTarget.style.borderColor = '#667eea';
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
                      background: 'linear-gradient(to bottom right, #667eea, #764ba2)'
                    }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '64px'
                      }}>
                        {service.iconEmoji || '🔧'}
                      </div>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
                      }} />
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
                        lineHeight: '1.5'
                      }}>
                        {service.description || 'Professional service at your doorstep'}
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
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          ⏱️ 60 min
                        </div>
                        <span style={{
                          color: '#667eea',
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
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'white',
                borderRadius: '16px'
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
              </div>
            )}
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
              background: 'linear-gradient(to bottom right, #667eea, #764ba2)',
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
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}