import { useState, useEffect } from 'react';
import { Search, MapPin, User, Star, Users, CheckCircle, X } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

// Service images mapping with better quality
const SERVICE_IMAGES = {
  'Plumbing': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop&q=80',
  'Electrical Work': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop&q=80',
  'House Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80',
  'Carpentry': 'https://images.unsplash.com/photo-1597839170991-e91c46c6f0b5?w=600&h=400&fit=crop&q=80',
  'Painting': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop&q=80',
  'AC Repair': 'https://images.unsplash.com/photo-1631545304369-7a5c50c2d2f7?w=600&h=400&fit=crop&q=80',
  'Pest Control': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&q=80',
  'Appliance Repair': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
  'Washing Machine Repair': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop&q=80',
  'Refrigerator Repair': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=400&fit=crop&q=80',
  'Microwave Repair': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&h=400&fit=crop&q=80',
  'Water Purifier': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&q=80'
};

export default function EnhancedNearFixHome() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Connaught Place, New Delhi');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stats] = useState({
    customers: '10,000+',
    providers: '500+',
    rating: 4.8,
    completedJobs: '25,000+'
  });

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

  const categoryColors = {
    'HOME_REPAIR': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    'CLEANING': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    'APPLIANCE_REPAIR': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    'OTHER': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' }
  };

  // Filter services based on search
  const filteredServices = Object.entries(groupedServices).reduce((acc, [category, categoryServices]) => {
    const filtered = categoryServices.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer min-w-fit"
              onClick={() => window.location.href = '#home'}
            >
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-xl font-bold text-white">
                N
              </div>
              <span className="text-2xl font-bold text-black hidden sm:block">
                NearFix
              </span>
            </div>

            {/* Location - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-black transition-colors">
              <MapPin size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700 max-w-[200px] truncate">
                {location}
              </span>
            </div>

            {/* Search Bar - Responsive */}
            <div className="flex-1 max-w-2xl relative hidden lg:block">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <User size={18} />
              <span className="hidden sm:inline">Login</span>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 lg:hidden relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
              Home services at your doorstep
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Book trusted professionals for all your home service needs
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="text-blue-600" size={24} />
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.customers}</div>
                </div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="text-green-600" size={24} />
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.providers}</div>
                </div>
                <div className="text-sm text-gray-600">Verified Providers</div>
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.rating}</div>
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="text-purple-600" size={24} />
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.completedJobs}</div>
                </div>
                <div className="text-sm text-gray-600">Jobs Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {Object.entries(filteredServices).map(([category, categoryServices]) => {
          const colors = categoryColors[category] || categoryColors['OTHER'];

          return (
            <div key={category} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {categoryNames[category] || category}
                </h2>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {categoryServices.length} Services
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Service Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${SERVICE_IMAGES[service.name] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80'})`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Icon Badge */}
                      <div className="absolute top-4 left-4 w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform">
                        {service.iconEmoji || '🔧'}
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Star className="text-yellow-500 fill-yellow-500" size={14} />
                        <span className="text-sm font-semibold text-gray-900">4.8</span>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {service.description || 'Professional service at your doorstep'}
                      </p>

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          500+ bookings
                        </span>
                        <span className="text-blue-600 font-semibold group-hover:underline">
                          Book Now →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Modal/Expansion (for appliance services) */}
              {category === 'APPLIANCE_REPAIR' && selectedCategory === category && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCategory(null)}>
                  <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">Appliance Services</h3>
                      <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={24} />
                      </button>
                    </div>
                    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {categoryServices.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleServiceClick(service)}
                          className="p-4 border border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all cursor-pointer"
                        >
                          <div className="text-3xl mb-2">{service.iconEmoji}</div>
                          <div className="font-semibold text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-600 mt-1">View Services →</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* No Results */}
        {Object.keys(filteredServices).length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 lg:py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-3xl lg:text-4xl font-bold mb-4">
            NearFix
          </div>
          <p className="text-gray-400 mb-6">
            Your trusted platform for home services
          </p>
          <div className="text-sm text-gray-500">
            © 2024 NearFix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}