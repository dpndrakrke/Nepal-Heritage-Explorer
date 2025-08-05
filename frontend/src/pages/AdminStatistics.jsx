import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CountUp from 'react-countup';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [heritageStats, setHeritageStats] = useState(null);
  const [activityTrends, setActivityTrends] = useState(null);
  const { isAdmin } = useAuth();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const [userResponse, heritageResponse, trendsResponse] = await Promise.all([
        axios.get('/api/admin/userStats'),
        axios.get('/api/admin/heritageStats'),
        axios.get('/api/admin/activityTrends')
      ]);

      setUserStats(userResponse.data.data);
      setHeritageStats(heritageResponse.data.data);
      setActivityTrends(trendsResponse.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (data, keyField, valueField) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      name: item[keyField] || 'Unknown',
      value: parseInt(item[valueField]) || 0
    }));
  };

  const formatLineChartData = (data, dateField, countField) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      date: item[dateField] || 'Unknown',
      count: parseInt(item[countField]) || 0
    }));
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You need admin privileges to view statistics.
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
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Platform Statistics
              </h1>
              <p className="text-gray-600">
                Comprehensive analytics and insights for the Nepal Heritage Explorer platform
              </p>
            </div>
            <button
              onClick={fetchAllStats}
              className="btn-primary"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* User Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 User Analytics</h2>
          
          {/* User Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  <CountUp end={userStats?.totalUsers || 0} duration={2} />
                </div>
                <div className="text-gray-600">Total Users</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <CountUp end={userStats?.activeUsersToday || 0} duration={2} />
                </div>
                <div className="text-gray-600">Active Today</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <CountUp end={userStats?.newRegistrations || 0} duration={2} />
                </div>
                <div className="text-gray-600">New This Week</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  <CountUp end={userStats?.roleDistribution?.find(r => r.role === 'admin')?.count || 0} duration={2} />
                </div>
                <div className="text-gray-600">Admin Users</div>
              </div>
            </div>
          </div>

          {/* Role Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Role Distribution</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={formatChartData(userStats?.roleDistribution, 'role', 'count')}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {formatChartData(userStats?.roleDistribution, 'role', 'count').map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Registrations Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Registrations</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatChartData(userStats?.monthlyRegistrations, 'month', 'count')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Heritage Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🏛️ Heritage Analytics</h2>
          
          {/* Heritage Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-heritage-600 mb-2">
                  <CountUp end={heritageStats?.totalHeritages || 0} duration={2} />
                </div>
                <div className="text-gray-600">Total Heritage Sites</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  <CountUp end={heritageStats?.featuredCount || 0} duration={2} />
                </div>
                <div className="text-gray-600">Featured Sites</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <CountUp end={heritageStats?.mostSavedHeritage?.saveCount || 0} duration={2} />
                </div>
                <div className="text-gray-600">Most Saved</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <CountUp end={heritageStats?.recentHeritages?.length || 0} duration={2} />
                </div>
                <div className="text-gray-600">Added This Week</div>
              </div>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Heritage Categories</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatChartData(heritageStats?.categoryDistribution, 'category', 'count')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Saved Heritage */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Most Saved Heritage</h3>
              </div>
              <div className="card-body">
                {heritageStats?.mostSavedHeritage ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {heritageStats.mostSavedHeritage.heritage.name}
                    </div>
                    <div className="text-gray-600 mb-4">
                      {heritageStats.mostSavedHeritage.heritage.location}
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      <CountUp end={heritageStats.mostSavedHeritage.saveCount} duration={2} />
                    </div>
                    <div className="text-gray-600">Times Saved</div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No saved heritages yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Trends */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Activity Trends</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Registrations Trend */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">User Registrations (Last 7 Days)</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatLineChartData(activityTrends?.dailyRegistrations, 'date', 'count')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Logins Trend */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">User Logins (Last 30 Days)</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatLineChartData(activityTrends?.dailyLogins, 'date', 'count')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Heritage Saves Trend */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Heritage Saves (Last 7 Days)</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatLineChartData(activityTrends?.dailySaves, 'date', 'count')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#FFBB28" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/users" className="btn-primary text-center py-4">
                <div className="text-xl mb-2">👥</div>
                <div className="font-semibold">Manage Users</div>
                <div className="text-sm opacity-75">View and manage all users</div>
              </Link>
              <Link to="/admin/heritage/list" className="btn-primary text-center py-4">
                <div className="text-xl mb-2">🏛️</div>
                <div className="font-semibold">Manage Heritages</div>
                <div className="text-sm opacity-75">Add, edit, and delete heritage sites</div>
              </Link>
              <Link to="/admin" className="btn-primary text-center py-4">
                <div className="text-xl mb-2">📊</div>
                <div className="font-semibold">Admin Dashboard</div>
                <div className="text-sm opacity-75">Return to main admin panel</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics; 