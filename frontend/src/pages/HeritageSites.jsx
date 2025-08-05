import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const HeritageSites = () => {
  const [heritages, setHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { isAuthenticated } = useAuth();

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    location: '',
    historicalPeriod: '',
    builtYearFrom: '',
    builtYearTo: '',
    entryFeeFrom: '',
    entryFeeTo: '',
    featured: false,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  useEffect(() => {
    fetchCategories();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchHeritages();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get('/api/filter-options');
      setFilterOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchHeritages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters
      });

      const response = await axios.get(`/api/heritages?${params}`);
      setHeritages(response.data.data.heritages);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalItems(response.data.data.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching heritages:', error);
      toast.error('Failed to load heritage sites');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchHeritages();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      location: '',
      historicalPeriod: '',
      builtYearFrom: '',
      builtYearTo: '',
      entryFeeFrom: '',
      entryFeeTo: '',
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
    setCurrentPage(1);
  };

  const toggleSaveHeritage = async (heritageId) => {
    if (!isAuthenticated()) {
      toast.error('Please login to save heritage sites');
      return;
    }

    try {
      const response = await axios.post(`/api/saveHeritage/${heritageId}`);
      toast.success(response.data.message);
      // Update the heritage in the list to show saved status
      setHeritages(prev => 
        prev.map(heritage => 
          heritage.id === heritageId 
            ? { ...heritage, isSaved: response.data.data.isSaved }
            : heritage
        )
      );
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Failed to save heritage site');
    }
  };

  const renderHeritageCard = (heritage) => (
    <div key={heritage.id} className="card hover:shadow-lg transition-shadow duration-300">
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
            onClick={() => toggleSaveHeritage(heritage.id)}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              heritage.isSaved 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill={heritage.isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
        
        {heritage.historicalPeriod && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {heritage.historicalPeriod}
          </div>
        )}
        
        <Link
          to={`/heritage/${heritage.id}`}
          className="btn-primary w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Heritage Sites
          </h1>
          <p className="text-gray-600">
            Explore Nepal's rich cultural and historical heritage
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="card mb-6">
          <div className="card-body">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search heritage sites..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="input-field"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary px-6"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary px-4"
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  {/* Category Filter */}
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input-field"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="form-label">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="input-field"
                    >
                      <option value="">All Locations</option>
                      {filterOptions.locations?.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Historical Period Filter */}
                  <div>
                    <label className="form-label">Historical Period</label>
                    <select
                      value={filters.historicalPeriod}
                      onChange={(e) => handleFilterChange('historicalPeriod', e.target.value)}
                      className="input-field"
                    >
                      <option value="">All Periods</option>
                      {filterOptions.historicalPeriods?.map(period => (
                        <option key={period} value={period}>
                          {period}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Built Year Range */}
                  <div>
                    <label className="form-label">Built Year Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="From"
                        value={filters.builtYearFrom}
                        onChange={(e) => handleFilterChange('builtYearFrom', e.target.value)}
                        className="input-field flex-1"
                        min={filterOptions.yearRange?.minYear || 1000}
                        max={filterOptions.yearRange?.maxYear || new Date().getFullYear()}
                      />
                      <input
                        type="number"
                        placeholder="To"
                        value={filters.builtYearTo}
                        onChange={(e) => handleFilterChange('builtYearTo', e.target.value)}
                        className="input-field flex-1"
                        min={filterOptions.yearRange?.minYear || 1000}
                        max={filterOptions.yearRange?.maxYear || new Date().getFullYear()}
                      />
                    </div>
                  </div>

                  {/* Entry Fee Range */}
                  <div>
                    <label className="form-label">Entry Fee Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.entryFeeFrom}
                        onChange={(e) => handleFilterChange('entryFeeFrom', e.target.value)}
                        className="input-field flex-1"
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.entryFeeTo}
                        onChange={(e) => handleFilterChange('entryFeeTo', e.target.value)}
                        className="input-field flex-1"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Featured Filter */}
                  <div>
                    <label className="form-label">Featured Only</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.featured}
                        onChange={(e) => handleFilterChange('featured', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Show featured sites only</span>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="form-label">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="input-field"
                    >
                      <option value="createdAt">Date Added</option>
                      <option value="name">Name</option>
                      <option value="location">Location</option>
                      <option value="builtYear">Built Year</option>
                      <option value="entryFee">Entry Fee</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="form-label">Sort Order</label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                      className="input-field"
                    >
                      <option value="DESC">Descending</option>
                      <option value="ASC">Ascending</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Filter Actions */}
              {showFilters && (
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn-secondary"
                  >
                    Clear All Filters
                  </button>
                  <div className="text-sm text-gray-500">
                    {totalItems} heritage sites found
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading heritage sites...</p>
            </div>
          </div>
        ) : heritages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No heritage sites found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Heritage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {heritages.map(renderHeritageCard)}
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

export default HeritageSites; 