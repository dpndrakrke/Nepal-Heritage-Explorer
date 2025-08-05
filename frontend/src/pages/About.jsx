import { Link } from 'react-router-dom';

const About = () => {

  const stats = [
    { number: '150+', label: 'Heritage Sites' },
    { number: '10,000+', label: 'Visitors' },
    { number: '50+', label: 'Cities Covered' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-400 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Nepal Heritage Explorer
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Preserving and showcasing the rich cultural heritage of Nepal for future generations
          </p>
        </div>
      </section>

             {/* Mission Section */}
       <section className="py-16 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-3xl font-bold text-gray-900 mb-6">
                 Our Mission
               </h2>
               <p className="text-lg text-gray-700 mb-6">
                 Nepal Heritage Explorer is dedicated to preserving, documenting, and promoting the rich cultural heritage of Nepal. Our platform serves as a comprehensive digital repository of heritage sites, making them accessible to researchers, tourists, and heritage enthusiasts worldwide.
               </p>
               <p className="text-lg text-gray-700 mb-6">
                 We believe that understanding and appreciating our cultural heritage is essential for building a stronger, more connected society. Through our platform, we aim to:
               </p>
               <ul className="space-y-3 text-gray-700">
                 <li className="flex items-start">
                   <span className="text-blue-500 mr-3">✓</span>
                   Document and preserve heritage sites across Nepal
                 </li>
                 <li className="flex items-start">
                   <span className="text-blue-500 mr-3">✓</span>
                   Provide accurate historical information and cultural context
                 </li>
                 <li className="flex items-start">
                   <span className="text-blue-500 mr-3">✓</span>
                   Facilitate heritage tourism and cultural exchange
                 </li>
                 <li className="flex items-start">
                   <span className="text-blue-500 mr-3">✓</span>
                   Support conservation efforts and sustainable tourism
                 </li>
               </ul>
             </div>
             <div className="flex justify-center items-center">
               <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                 <img
                   src="/images/hero/logo.jpg"
                   alt="Nepal Heritage Explorer Logo"
                   className="w-64 h-auto object-contain"
                 />
               </div>
             </div>
           </div>
         </div>
       </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600">
              Making heritage accessible to everyone
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive heritage exploration platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Heritage Documentation
              </h3>
              <p className="text-gray-600">
                Comprehensive documentation of heritage sites with detailed historical information, photographs, and cultural significance.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Digital Accessibility
              </h3>
              <p className="text-gray-600">
                Making heritage information accessible to everyone through our user-friendly digital platform.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community Engagement
              </h3>
              <p className="text-gray-600">
                Engaging with local communities, researchers, and heritage enthusiasts to preserve cultural knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              Guiding principles that drive our mission
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-6 mb-4">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Preservation
              </h3>
              <p className="text-gray-600 text-sm">
                Committed to preserving cultural heritage for future generations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-6 mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Education
              </h3>
              <p className="text-gray-600 text-sm">
                Promoting cultural education and awareness
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-6 mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Collaboration
              </h3>
              <p className="text-gray-600 text-sm">
                Working with communities and stakeholders
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-6 mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sustainability
              </h3>
              <p className="text-gray-600 text-sm">
                Ensuring sustainable heritage tourism practices
              </p>
            </div>
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

export default About; 