import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Homepage = () => {
  const { isAuthenticated } = useAuth();

  const categories = [
    { name: 'Temples', icon: '🏛️', count: '50+' },
    { name: 'Palaces', icon: '🏰', count: '20+' },
    { name: 'Monuments', icon: '🗿', count: '30+' },
    { name: 'Museums', icon: '🏛️', count: '15+' },
    { name: 'Natural Sites', icon: '🌿', count: '25+' },
    { name: 'Fortresses', icon: '🏯', count: '10+' }
  ];

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative w-full overflow-hidden bg-white" style={{ height: '500px' }}>
        {/* Background Image */}
        <img
          src="/images/hero/hero-bg.jpg"
          alt="Nepal Heritage"
          className="w-full h-full object-cover bg-white"
          style={{ objectPosition: 'center' }}
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Discover Nepal's
            <span className="block text-blue-300">Rich Heritage</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            Embark on a journey through ancient temples, majestic palaces, and historic monuments 
            that tell the story of Nepal's glorious past and vibrant culture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            {!isAuthenticated() ? (
              <>
                <Link 
                  to="/register" 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Your Journey
                </Link>
                <Link 
                  to="/heritages" 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 border border-white/30"
                >
                  Explore Sites
                </Link>
              </>
            ) : (
              <Link 
                to="/dashboard" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '150+', label: 'Heritage Sites' },
              { number: '50K+', label: 'Visitors Monthly' },
              { number: '25+', label: 'Cities Covered' },
              { number: '4.8', label: 'Average Rating' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 group-hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Heritage Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover different types of heritage sites across Nepal, each with its own unique story and significance
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div key={category.name} className="group cursor-pointer">
                <div className="bg-white rounded-xl p-6 text-center group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 border border-gray-200">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <div className="text-blue-600 font-bold">
                    {category.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Explore Nepal's Heritage?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of heritage enthusiasts discovering Nepal's cultural treasures. 
            Start your journey today and create unforgettable memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated() ? (
              <>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Create Free Account
                </Link>
                <Link 
                  to="/heritages" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Exploring
                </Link>
              </>
            ) : (
              <Link 
                to="/heritages" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Heritage Sites
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Nepal Heritage Explorer</h3>
              <p className="text-gray-400 leading-relaxed">
                Your gateway to discovering and exploring the rich cultural heritage of Nepal. 
                Connect with history, culture, and tradition.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/heritages" className="hover:text-blue-300 transition-colors">Heritage Sites</Link></li>
                <li><Link to="/about" className="hover:text-blue-300 transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-blue-300 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/heritages?category=temple" className="hover:text-blue-300 transition-colors">Temples</Link></li>
                <li><Link to="/heritages?category=palace" className="hover:text-blue-300 transition-colors">Palaces</Link></li>
                <li><Link to="/heritages?category=monument" className="hover:text-blue-300 transition-colors">Monuments</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nepal Heritage Explorer. All rights reserved. | Preserving Nepal's Cultural Heritage</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage; 