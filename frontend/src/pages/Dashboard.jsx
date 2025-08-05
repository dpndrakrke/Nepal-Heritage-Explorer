import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUserProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {userProfile?.firstName || user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your account and explore Nepal's heritage sites
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 relative">
                    {userProfile?.profileImage ? (
                      <img 
                        src={userProfile.profileImage.startsWith('http') 
                          ? userProfile.profileImage 
                          : `http://localhost:5000${userProfile.profileImage}`} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          console.error('Dashboard image failed to load:', userProfile.profileImage);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${userProfile?.profileImage ? 'hidden' : ''}`}>
                      <span className="text-2xl font-bold text-primary-600">
                        {userProfile?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </h4>
                    <p className="text-gray-600">@{userProfile?.username}</p>
                    {userProfile?.bio && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {userProfile.bio}
                      </p>
                    )}
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
                  {userProfile?.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{userProfile?.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Status
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userProfile?.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userProfile?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">
                    {userProfile?.createdAt 
                      ? new Date(userProfile.createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
                {userProfile?.lastLogin && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="font-medium">
                      {new Date(userProfile.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Admin Controls - Only show for admin users */}
        {isAdmin() && (
          <div className="mt-8">
            <div className="card border-2 border-primary-200 bg-primary-50">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Admin Controls
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage users, heritage sites, and view platform statistics
                </p>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link 
                    to="/admin/users" 
                    className="btn-primary text-center py-4"
                  >
                    <div className="text-xl mb-2">👥</div>
                    <div className="font-semibold">Manage Users</div>
                    <div className="text-sm opacity-75">View and manage all users</div>
                  </Link>
                  <Link 
                    to="/admin/heritage/list" 
                    className="btn-primary text-center py-4"
                  >
                    <div className="text-xl mb-2">🏛️</div>
                    <div className="font-semibold">Manage Heritages</div>
                    <div className="text-sm opacity-75">Add, edit, and delete heritage sites</div>
                  </Link>
                  <Link 
                    to="/admin/statistics" 
                    className="btn-primary text-center py-4"
                  >
                    <div className="text-xl mb-2">📊</div>
                    <div className="font-semibold">View Statistics</div>
                    <div className="text-sm opacity-75">Platform analytics and metrics</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 