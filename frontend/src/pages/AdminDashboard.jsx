import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You need admin privileges to access this page.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, heritage sites, and view platform statistics
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.totalUsers}
                </div>
                <div className="text-gray-600">Total Users</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-heritage-600 mb-2">
                  {stats.totalHeritages}
                </div>
                <div className="text-gray-600">Heritage Sites</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.totalBookings}
                </div>
                <div className="text-gray-600">Total Bookings</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.totalSaved}
                </div>
                <div className="text-gray-600">Saved Items</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Heritage Management
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <Link to="/admin/heritage/add" className="btn-primary w-full">
                  Add New Heritage Site
                </Link>
                <Link to="/admin/heritage/list" className="btn-secondary w-full">
                  View All Heritage Sites
                </Link>
                <Link to="/admin/heritage/categories" className="btn-secondary w-full">
                  Manage Categories
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                User Management
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <Link to="/admin/users" className="btn-primary w-full">
                  View All Users
                </Link>
                <Link to="/admin/users?filter=active" className="btn-secondary w-full">
                  Active Users
                </Link>
                <Link to="/admin/users?filter=inactive" className="btn-secondary w-full">
                  Inactive Users
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              📊 Detailed Analytics
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive platform statistics and trends
            </p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/admin/statistics" 
                className="btn-primary text-center py-6"
              >
                <div className="text-2xl mb-2">📈</div>
                <div className="font-semibold text-lg">View Statistics</div>
                <div className="text-sm opacity-75 mt-2">
                  User Analytics, Heritage Analytics, Activity Trends
                </div>
              </Link>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-semibold text-lg">User Analytics</div>
                <div className="text-sm text-gray-600 mt-2">
                  Total users, active users, role distribution
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">🏛️</div>
                <div className="font-semibold text-lg">Heritage Analytics</div>
                <div className="text-sm text-gray-600 mt-2">
                  Site counts, categories, most saved sites
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">New User Registration</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <span className="text-green-600 text-sm font-medium">+1</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Heritage Site Added</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
                <span className="text-heritage-600 text-sm font-medium">+1</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Booking Created</p>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </div>
                <span className="text-blue-600 text-sm font-medium">+3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 