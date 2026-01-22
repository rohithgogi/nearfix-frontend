import React, { useState, useEffect } from 'react';
import { Search, MapPin, User, Star, Users, CheckCircle, X, Phone, Clock, Shield, Award } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

// High-quality service images
const SERVICE_IMAGES = {
  'Plumbing': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop&q=80',
  'Electrical Work': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&q=80',
  'House Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80',
  'Carpentry': 'https://images.unsplash.com/photo-1597839170991-e91c46c6f0b5?w=800&h=600&fit=crop&q=80',
  'Painting': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop&q=80',
  'AC Repair': 'https://images.unsplash.com/photo-1631545304369-7a5c50c2d2f7?w=800&h=600&fit=crop&q=80',
  'Pest Control': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop&q=80',
  'Washing Machine Repair': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop&q=80',
  'Refrigerator Repair': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop&q=80',
  'Microwave Repair': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&h=600&fit=crop&q=80'
};

export default function EnhancedNearFixLanding() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Select your location');
  const [locationDetected, setLocationDetected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const stats = {
    customers: '10,000+',
    providers: '500+',
    rating: 4.8,
    completedJobs: '25,000+'
  };

  const features = [
    { icon: '🛡️', title: 'Verified Professionals', desc: 'All service providers are background verified' },
    { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges, pay what you see' },
    { icon: '⚡', title: 'Quick Service', desc: 'Same-day service available for urgent needs' },
    { icon: '⭐', title: 'Quality Assured', desc: '30-day service guarantee on all bookings' }
  ];

  useEffect(() => {
    fetchServices();
    detectLocation();

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
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

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation('Delhi NCR');
          setLocationDetected(true);
        },
        () => {
          setLocation('Select your location');
        }
      );
    }
  };

  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'OTHER';
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {});

  const categoryNames = {
    'HOME_REPAIR': 'Home Repairs',
    'CLEANING': 'Cleaning & Pest Control',
    'APPLIANCE_REPAIR': 'Appliance Services',
    'OTHER': 'Other Services'
  };

  const handleCategoryClick = (category, categoryServices) => {
    if (categoryServices.length > 1) {
      setSelectedCategory({ category, services: categoryServices });
      setShowCategoryModal(true);
    } else {
      handleServiceClick(categoryServices[0]);
    }
  };

  const handleServiceClick = (service) => {
    setShowCategoryModal(false);
    window.location.href = `#search?service=${service.id}`;
  };

  const filteredServices = Object.entries(groupedServices).reduce((acc, [category, categoryServices]) => {
    const filtered = categoryServices.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) acc[category] = filtered;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sleek Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '#home'}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-xl font-bold text-white">N</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  NearFix
                </div>
                <div className="text-xs text-gray-500">Your Local Services</div>
              </div>
            </div>

            {/* Location Selector */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 hover:shadow-md transition-all bg-white">
              <MapPin size={18} className={locationDetected ? 'text-purple-600' : 'text-gray-400'} />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Service in</span>
                <span className="text-sm font-semibold text-gray-900 max-w-[150px] truncate">
                  {location}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl relative hidden lg:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services (e.g., AC Repair, Plumbing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={() => window.location.href = '#login'}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <User size={18} />
              <span className="hidden sm:inline">Login</span>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 lg:hidden relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-700">500+ verified professionals available</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Home services at your
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  doorstep
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Book trusted professionals for all your home service needs. Fast, reliable, and affordable.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="text-purple-600" size={20} />
                    <div className="text-2xl font-bold text-gray-900">{stats.customers}</div>
                  </div>
                  <div className="text-xs text-gray-600">Customers</div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className="text-green-600" size={20} />
                    <div className="text-2xl font-bold text-gray-900">{stats.providers}</div>
                  </div>
                  <div className="text-xs text-gray-600">Providers</div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Star className="text-yellow-500 fill-yellow-500" size={20} />
                    <div className="text-2xl font-bold text-gray-900">{stats.rating}</div>
                  </div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className="text-blue-600" size={20} />
                    <div className="text-2xl font-bold text-gray-900">{stats.completedJobs}</div>
                  </div>
                  <div className="text-xs text-gray-600">Jobs Done</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Explore Services →
              </button>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${
                        activeFeature === index
                          ? 'border-purple-400 scale-105'
                          : 'border-transparent hover:border-purple-200'
                      }`}
                    >
                      <div className="text-4xl mb-3">{feature.icon}</div>
                      <div className="text-sm font-bold text-gray-900 mb-2">{feature.title}</div>
                      <div className="text-xs text-gray-600">{feature.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {Object.entries(filteredServices).map(([category, categoryServices]) => (
          <div key={category} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {categoryNames[category] || category}
                </h2>
                <p className="text-gray-600">{categoryServices.length} services available</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="group bg-white rounded-2xl overflow-hidden cursor-pointer border-2 border-gray-100 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                    <div
                      className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${SERVICE_IMAGES[service.name] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80'})`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform">
                      {service.iconEmoji || '🔧'}
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="text-yellow-500 fill-yellow-500" size={14} />
                      <span className="text-sm font-semibold text-gray-900">4.8</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {service.description || 'Professional service at your doorstep with guaranteed satisfaction'}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>60 min</span>
                      </div>
                      <span className="text-purple-600 font-bold text-sm group-hover:underline">
                        Book Now →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(filteredServices).length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose NearFix?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best home service experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% Verified</h3>
              <p className="text-gray-600">All professionals are background verified and trained</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4">
                <Award className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">30-day service guarantee on all bookings</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4">
                <Phone className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for your needs</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mb-4">
                <Star className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Top Rated</h3>
              <p className="text-gray-600">4.8 average rating from 10,000+ customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold">N</span>
                </div>
                <span className="text-xl font-bold">NearFix</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted platform for home services in tier 2 & 3 cities
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">Plumbing</li>
                <li className="hover:text-white cursor-pointer">Electrical</li>
                <li className="hover:text-white cursor-pointer">Cleaning</li>
                <li className="hover:text-white cursor-pointer">Appliance Repair</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Safety</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 NearFix. All rights reserved. | Empowering local service providers
            </p>
          </div>
        </div>
      </footer>

      {/* Category Modal */}
      {showCategoryModal && selectedCategory && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm"
          onClick={() => setShowCategoryModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-2xl font-bold">
                  {categoryNames[selectedCategory.category]}
                </h3>
                <p className="text-white/80 text-sm mt-1">Select a service to continue</p>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedCategory.services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                        {service.iconEmoji || '🔧'}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">
                        {service.name.replace(' Repair', '')}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Star className="text-yellow-500 fill-yellow-500" size={12} />
                        4.8
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}