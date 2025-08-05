import { Link } from 'react-router-dom';

const Contact = () => {

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'heritageinfo87@gmail.com',
      description: 'Send us an email anytime'
    },
    {
      icon: '📞',
      title: 'Phone',
      content: '9819369402',
      description: 'Call us anytime'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-400 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Get in touch with us for any questions about heritage sites or our platform
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions about heritage sites, want to contribute, or need technical support? 
                We're here to help you explore Nepal's rich cultural heritage.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.title} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-xl">{info.icon}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {info.title}
                    </h3>
                    <p className="text-gray-900 font-medium mb-1">
                      {info.content}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  How can I contribute heritage information?
                </h3>
              </div>
              <div className="card-body">
                <p className="text-gray-700">
                  You can contribute by registering as a user and submitting heritage site information through our platform. Our team will review and verify the information before publishing.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Are the heritage sites open to visitors?
                </h3>
              </div>
              <div className="card-body">
                <p className="text-gray-700">
                  Most heritage sites are open to visitors, but visiting hours and entry fees may vary. Check the individual heritage site pages for specific information.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  How accurate is the historical information?
                </h3>
              </div>
              <div className="card-body">
                <p className="text-gray-700">
                  We strive to provide accurate historical information by collaborating with historians, archaeologists, and local experts. All information is thoroughly researched and verified.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Can I book guided tours through your platform?
                </h3>
              </div>
              <div className="card-body">
                <p className="text-gray-700">
                  Currently, we provide information about heritage sites. For guided tours, we recommend contacting local tour operators or heritage site management directly.
                </p>
              </div>
            </div>
          </div>
        </div>


             </div>

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

export default Contact; 