import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const HeritageList = () => {
  const [heritages, setHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchHeritages();
  }, []);

  const fetchHeritages = async () => {
    try {
      const response = await axios.get('/api/admin/heritageManagement');
      setHeritages(response.data.data.heritages);
    } catch (error) {
      console.error('Error fetching heritages:', error);
      toast.error('Failed to load heritage sites');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (heritageId, heritageName) => {
    if (!window.confirm(`Are you sure you want to delete "${heritageName}"?`)) {
      return;
    }

    try {
      await axios.delete(`/api/heritage/${heritageId}`);
      toast.success('Heritage site deleted successfully!');
      fetchHeritages(); // Refresh the list
    } catch (error) {
      console.error('Error deleting heritage:', error);
      toast.error('Failed to delete heritage site');
    }
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

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You need admin privileges to view this page.
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
          <p className="text-gray-600">Loading heritage sites...</p>
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
                Heritage Sites Management
              </h1>
              <p className="text-gray-600">
                Manage all heritage sites in the platform
              </p>
            </div>
            <Link to="/admin/heritage/add" className="btn-primary">
              Add New Heritage Site
            </Link>
          </div>
        </div>

        {/* Heritage Sites Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              All Heritage Sites ({heritages.length})
            </h3>
          </div>
          <div className="card-body">
            {heritages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No heritage sites found
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first heritage site
                </p>
                <Link to="/admin/heritage/add" className="btn-primary">
                  Add Heritage Site
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Heritage Site
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Featured
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {heritages.map((heritage) => (
                      <tr key={heritage.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-lg">{getCategoryIcon(heritage.category)}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {heritage.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {heritage.shortDescription}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {heritage.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {heritage.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            heritage.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {heritage.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {heritage.featured ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/heritage/${heritage.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              View
                            </Link>
                            <Link
                              to={`/admin/heritage/edit/${heritage.id}`}
                              className="text-heritage-600 hover:text-heritage-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(heritage.id, heritage.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeritageList; 