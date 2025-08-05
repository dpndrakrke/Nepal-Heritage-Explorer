import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

const HeritageDetail = () => {
  const { id } = useParams();
  const [heritage, setHeritage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [commentStats, setCommentStats] = useState({});
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchHeritageDetail();
  }, [id]);

  const fetchHeritageDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/heritage/${id}`);
      setHeritage(response.data.data.heritage);
      setIsSaved(response.data.data.isSaved);
      setCommentStats(response.data.data.commentStats);
    } catch (error) {
      console.error('Error fetching heritage detail:', error);
      toast.error('Failed to load heritage details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHeritage = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to save heritage sites');
      return;
    }

    try {
      await axios.post(`/api/saveHeritage/${id}`);
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Removed from saved heritages' : 'Added to saved heritages');
    } catch (error) {
      console.error('Error saving heritage:', error);
      toast.error('Failed to save heritage site');
    }
  };

  const handleCommentUpdate = () => {
    fetchHeritageDetail(); // Refresh to get updated stats
  };

  const getCategoryIcon = (category) => {
    const icons = {
      temple: '🏛️',
      palace: '🏰',
      monument: '🗿',
      museum: '🏛️',
      natural: '🌿',
      fortress: '🏯',
      monastery: '⛩️',
      other: '🏛️'
    };
    return icons[category] || icons.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading heritage details...</p>
        </div>
      </div>
    );
  }

  if (!heritage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Heritage Site Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The heritage site you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/heritages" className="btn-primary">
            Back to Heritage Sites
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link to="/heritages" className="hover:text-primary-600">Heritage Sites</Link></li>
            <li>/</li>
            <li className="text-gray-900">{heritage.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="card mb-8">
              <div className="relative">
                {heritage.images && heritage.images.length > 0 ? (
                  <>
                    <img
                      src={heritage.images[activeImage]?.url || `http://localhost:5000/uploads/${heritage.images[activeImage]?.filename}`}
                      alt={heritage.name}
                      className="w-full h-96 object-cover rounded-t-lg"
                      onError={(e) => {
                        console.error('Failed to load image:', heritage.images[activeImage]?.filename);
                        e.target.style.display = 'none';
                      }}
                    />
                    {heritage.images.length > 1 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex space-x-2 overflow-x-auto">
                          {heritage.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImage(index)}
                              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                                index === activeImage ? 'border-primary-500' : 'border-white'
                              }`}
                            >
                              <img
                                src={image.url || `http://localhost:5000/uploads/${image.filename}`}
                                alt={`${heritage.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Failed to load thumbnail:', image.filename);
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <div className="text-6xl">🏛️</div>
                  </div>
                )}
              </div>
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {heritage.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="flex items-center">
                        📍 {heritage.location}
                      </span>
                      <span className="flex items-center">
                        {getCategoryIcon(heritage.category)} {heritage.category}
                      </span>
                      {heritage.featured && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  {isAuthenticated() && (
                    <button
                      onClick={handleSaveHeritage}
                      className={`p-2 rounded-full ${
                        isSaved ? 'text-red-500' : 'text-gray-400'
                      } hover:text-red-500 transition-colors`}
                      title={isSaved ? 'Remove from saved' : 'Save to favorites'}
                    >
                      ❤️
                    </button>
                  )}
                </div>

                {/* Description */}
                {heritage.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{heritage.description}</p>
                  </div>
                )}

                {/* Historical Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {heritage.historicalPeriod && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Historical Period</h4>
                      <p className="text-gray-700">{heritage.historicalPeriod}</p>
                    </div>
                  )}
                  {heritage.builtYear && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Built Year</h4>
                      <p className="text-gray-700">{heritage.builtYear}</p>
                    </div>
                  )}
                  {heritage.architect && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Architect</h4>
                      <p className="text-gray-700">{heritage.architect}</p>
                    </div>
                  )}
                  {heritage.significance && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Significance</h4>
                      <p className="text-gray-700">{heritage.significance}</p>
                    </div>
                  )}
                </div>

                {/* Visiting Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {heritage.visitingHours && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Visiting Hours</h4>
                      <p className="text-gray-700">{heritage.visitingHours}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Entry Fee</h4>
                    <p className="text-gray-700">
                      {heritage.entryFee ? `Rs. ${heritage.entryFee}` : 'Free'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            {heritage.latitude && heritage.longitude && (
              <div className="card mb-8">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                </div>
                <div className="card-body">
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Map will be displayed here</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Coordinates: {heritage.latitude}, {heritage.longitude}
                  </p>
                </div>
              </div>
            )}

                         {/* Comments Section */}
            <div className="mb-8">
              <CommentSection 
                heritageId={id} 
                commentStats={commentStats}
                onCommentUpdate={handleCommentUpdate}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Heritage Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Heritage Information</h3>
              </div>
              <div className="card-body space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{heritage.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    heritage.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {heritage.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {heritage.creator && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Added by:</span>
                    <span className="font-medium">{heritage.creator.firstName} {heritage.creator.lastName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Added:</span>
                  <span className="font-medium">
                    {new Date(heritage.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Heritage Sites */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Similar Sites</h3>
              </div>
              <div className="card-body">
                <p className="text-gray-600 text-sm">
                  More heritage sites in the same category will be displayed here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeritageDetail; 