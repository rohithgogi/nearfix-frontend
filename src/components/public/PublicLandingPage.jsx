import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:8080';

export default function PublicLandingPage() {
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [stats, setStats] = useState({ providers: 0, services: 0, cities: 0 });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      // Fetch services (public)
      const servicesRes = await fetch(`${API_BASE}/api/services`);
      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data.slice(0, 6)); // Show top 6
      }

      // Mock stats - you can create a public stats endpoint later
      setStats({ providers: 150, services: 12, cities: 25 });
    } catch (error) {
      console.error('Error fetching public data:', error);
    }
  };

  const handleServiceClick = (service) => {
    // Navigate to search page (will be public)
    window.location.href = `/search?service=${service.id}`;
  };

  const handleCTAClick = () => {
    if (isAuthenticated()) {
      window.location.href = '/dashboard';
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '48px',
            margin: '0 0 20px 0',
            fontWeight: '700'
          }}>
            🔧 NearFix
          </h1>
          <p style={{
            fontSize: '24px',
            margin: '0 0 40px 0',
            opacity: 0.9
          }}>
            Local Services at Your Doorstep
          </p>
          <p style={{
            fontSize: '18px',
            margin: '0 0 40px 0',
            lineHeight: '1.6'
          }}>
            Find trusted plumbers, electricians, cleaners, and more in your area.
            Browse without login, book with confidence.
          </p>

          {!isAuthenticated() && (
            <button
              onClick={handleCTAClick}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                fontWeight: '700',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Get Started - It's Free! 🚀
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '-40px auto 60px',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#667eea' }}>
              {stats.providers}+
            </div>
            <div style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
              Verified Providers
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#667eea' }}>
              {stats.services}+
            </div>
            <div style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
              Service Categories
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#667eea' }}>
              {stats.cities}+
            </div>
            <div style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
              Cities Covered
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{
          fontSize: '36px',
          textAlign: 'center',
          marginBottom: '50px',
          color: '#333'
        }}>
          Popular Services
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px'
        }}>
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                fontSize: '64px',
                marginBottom: '20px'
              }}>
                {service.iconEmoji || '🔧'}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 10px 0',
                color: '#333'
              }}>
                {service.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {service.description || 'Professional service at your doorstep'}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => window.location.href = '/services'}
            style={{
              padding: '14px 30px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            View All Services →
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div style={{
        background: '#f8f9fa',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#333'
          }}>
            How It Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px'
          }}>
            {[
              { icon: '🔍', title: 'Browse Services', desc: 'Explore our wide range of home services without any login' },
              { icon: '📍', title: 'Find Providers', desc: 'Search for verified professionals near your location' },
              { icon: '📅', title: 'Book Instantly', desc: 'Choose your time slot and book with just a few clicks' },
              { icon: '⭐', title: 'Rate & Review', desc: 'Share your experience to help others make informed decisions' }
            ].map((step, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 20px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  {step.icon}
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  margin: '0 0 15px 0',
                  color: '#333'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            margin: '0 0 20px 0',
            fontWeight: '700'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '18px',
            margin: '0 0 40px 0',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Join thousands of satisfied customers who trust NearFix for their home service needs.
            No credit card required. Start exploring now!
          </p>

          {!isAuthenticated() ? (
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.href = '/search'}
                style={{
                  padding: '16px 40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}
              >
                Browse Services 🔍
              </button>
              <button
                onClick={handleCTAClick}
                style={{
                  padding: '16px 40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '50px',
                  cursor: 'pointer'
                }}
              >
                Sign Up Free 🚀
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                fontWeight: '700',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
              }}
            >
              Go to Dashboard →
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#1a1a1a',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>🔧 NearFix</div>
          <p style={{ fontSize: '14px', opacity: 0.7, margin: '0 0 20px 0' }}>
            Your Trusted Platform for Local Home Services
          </p>
          <div style={{ fontSize: '12px', opacity: 0.5 }}>
            © 2024 NearFix. Built as a portfolio project showcasing full-stack development.
          </div>
          <div style={{ marginTop: '20px', fontSize: '14px' }}>
            <a href="https://github.com/yourusername" style={{ color: '#667eea', textDecoration: 'none', marginRight: '20px' }}>
              GitHub
            </a>
            <a href="https://linkedin.com/in/yourusername" style={{ color: '#667eea', textDecoration: 'none' }}>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}