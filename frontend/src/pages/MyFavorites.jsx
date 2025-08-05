import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MyFavorites = () => {
  const [savedHeritages, setSavedHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchSavedHeritages();
  }, [currentPage]);

  const fetchSavedHeritages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/savedHeritages?page=${currentPage}&limit=12`);
      console.log('Saved heritages response:', response.data);
      setSavedHeritages(response.data.data.savedHeritages);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching saved heritages:', error);
      toast.error('Failed to load saved heritage sites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (heritageId) => {
    try {
      await axios.post(`/api/saveHeritage/${heritageId}`);
      toast.success('Removed from favorites');
      fetchSavedHeritages(); // Refresh the list
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const renderHeritageCard = (savedHeritage) => {
    const heritage = savedHeritage.heritage;
    
    return (
      <div key={savedHeritage.id} className="card hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          {heritage.images && heritage.images.length > 0 ? (
            <img
              src={heritage.images[0].url || `http://localhost:5000/uploads/${heritage.images[0].filename}`}
              alt={heritage.name}
              className="w-full h-48 object-cover rounded-t-lg"
              onError={(e) => {
                console.error('Failed to load image:', heritage.images[0].filename);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <span className="text-gray-400 text-4xl">🏛️</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <button
              onClick={() => handleRemoveFromFavorites(heritage.id)}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg transition-colors"
              title="Remove from favorites"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
          {heritage.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              heritage.category === 'temple' ? 'bg-purple-100 text-purple-800' :
              heritage.category === 'palace' ? 'bg-yellow-100 text-yellow-800' :
              heritage.category === 'monument' ? 'bg-blue-100 text-blue-800' :
              heritage.category === 'museum' ? 'bg-green-100 text-green-800' :
              heritage.category === 'natural' ? 'bg-emerald-100 text-emerald-800' :
              heritage.category === 'fortress' ? 'bg-red-100 text-red-800' :
              heritage.category === 'monastery' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {heritage.category.charAt(0).toUpperCase() + heritage.category.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              {heritage.entryFee ? `Rs. ${heritage.entryFee}` : 'Free'}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {heritage.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {heritage.shortDescription || heritage.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {heritage.location}
          </div>
          
          <Link
            to={`/heritage/${heritage.id}`}
            className="btn-primary w-full text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">
            Your saved heritage sites
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        ) : savedHeritages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-4">
              Start exploring heritage sites and save your favorites to see them here
            </p>
            <Link to="/heritages" className="btn-primary">
              Explore Heritage Sites
            </Link>
          </div>
        ) : (
          <>
            {/* Heritage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {savedHeritages.map(renderHeritageCard)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary px-3 py-2 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary px-3 py-2 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyFavorites; 