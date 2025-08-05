import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [savedHeritages, setSavedHeritages] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [statistics, setStatistics] = useState({
    savedCount: 0,
    visitedCount: 0,
    totalHeritages: 0,
    popularSites: []
  });
  const [featuredHeritages, setFeaturedHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      
      // Fetch user profile
      const profileResponse = await axios.get('/api/auth/profile');
      console.log('Profile response:', profileResponse.data);
      setUserProfile(profileResponse.data.data.user);
      
      // Fetch saved heritages
      try {
        const savedResponse = await axios.get('/api/savedHeritages');
        console.log('Saved heritages response:', savedResponse.data);
        setSavedHeritages(savedResponse.data.data.savedHeritages || []);
        setStatistics(prev => ({ ...prev, savedCount: savedResponse.data.data.savedHeritages?.length || 0 }));
      } catch (savedError) {
        console.error('Error fetching saved heritages:', savedError);
        setSavedHeritages([]);
      }

      // Fetch featured heritages
      try {
        const featuredResponse = await axios.get('/api/heritages?featured=true&limit=6');
        console.log('Featured heritages response:', featuredResponse.data);
        setFeaturedHeritages(featuredResponse.data.data.heritages || []);
      } catch (featuredError) {
        console.error('Error fetching featured heritages:', featuredError);
        setFeaturedHeritages([]);
      }

      // Fetch statistics
      try {
        const statsResponse = await axios.get('/api/user/statistics');
        console.log('Statistics response:', statsResponse.data);
        setStatistics(prev => ({ ...prev, ...statsResponse.data.data }));
      } catch (statsError) {
        console.error('Error fetching statistics:', statsError);
        // Use default statistics
        setStatistics(prev => ({ 
          ...prev, 
          visitedCount: 0,
          totalHeritages: 0,
          popularSites: []
        }));
      }

      // Generate mock recent activities (since we don't have a real activity API)
      generateMockActivities();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load dashboard information');
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivities = () => {
    const activities = [
      {
        id: 1,
        type: 'saved',
        message: 'Saved Pashupatinath Temple to favorites',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: '❤️'
      },
      {
        id: 2,
        type: 'visited',
        message: 'Viewed details of Swayambhunath Stupa',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        icon: '👁️'
      },
      {
        id: 3,
        type: 'saved',
        message: 'Added Boudhanath Stupa to your collection',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        icon: '❤️'
      },
      {
        id: 4,
        type: 'visited',
        message: 'Explored Kathmandu Durbar Square',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        icon: '👁️'
      }
    ];
    setRecentActivities(activities);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return formatDate(date);
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'saved': return 'text-red-500 bg-red-50';
      case 'visited': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {userProfile?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600">
            Your personal dashboard for exploring Nepal's heritage sites
          </p>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="card mb-8">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center relative">
                      {userProfile?.profileImage ? (
                        <img 
                          src={userProfile.profileImage.startsWith('http') 
                            ? userProfile.profileImage 
                            : `http://localhost:5000${userProfile.profileImage}`} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${userProfile?.profileImage ? 'hidden' : ''}`}>
                        <span className="text-2xl font-bold text-primary-600">
                          {userProfile?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {userProfile?.firstName} {userProfile?.lastName}
                      </h4>
                      <p className="text-gray-600">@{userProfile?.username}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{userProfile?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                        userProfile?.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {userProfile?.role}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">{formatDate(userProfile?.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity Feed
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Featured Heritage Sites */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <div className="card-header flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Featured Heritage Sites
                </h3>
                <Link
                  to="/heritages"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="card-body">
                {featuredHeritages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredHeritages.map((heritage) => (
                      <div key={heritage.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-9">
                          {heritage.images && heritage.images.length > 0 ? (
                            <img
                              src={heritage.images[0].url || `http://localhost:5000/uploads/${heritage.images[0].filename}`}
                              alt={heritage.name}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-4xl">🏛️</span>
                            </div>
                          )}
                                                     {/* Featured badge removed for user dashboard - only admins should see this */}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {heritage.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {heritage.location}
                          </p>
                          <div className="flex items-center justify-between">
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
                            <Link
                              to={`/heritage/${heritage.id}`}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">🏛️</span>
                    <p className="text-gray-600">No featured heritage sites available</p>
                    <Link
                      to="/heritages"
                      className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
                    >
                      Explore heritage sites
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Heritage Sites */}
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Saved Heritage Sites
                </h3>
                <Link
                  to="/saved-heritages"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="card-body">
                {savedHeritages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedHeritages.slice(0, 4).map((saved) => (
                      <div key={saved.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-9">
                          {saved.heritage.images && saved.heritage.images.length > 0 ? (
                            <img
                              src={saved.heritage.images[0].url || `http://localhost:5000/uploads/${saved.heritage.images[0].filename}`}
                              alt={saved.heritage.name}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-4xl">🏛️</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {saved.heritage.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {saved.heritage.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Saved on {formatDate(saved.savedDate)}
                            </span>
                            <Link
                              to={`/heritage/${saved.heritage.id}`}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              View →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">❤️</span>
                    <p className="text-gray-600">No saved heritage sites yet</p>
                    <Link
                      to="/heritages"
                      className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
                    >
                      Explore heritage sites
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 