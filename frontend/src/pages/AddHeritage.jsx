import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AddHeritage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: 'temple',
    visitingHours: '',
    entryFee: '',
    featured: false
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'temple', label: 'Temple' },
    { value: 'palace', label: 'Palace' },
    { value: 'monument', label: 'Monument' },
    { value: 'museum', label: 'Museum' },
    { value: 'natural', label: 'Natural Site' },
    { value: 'fortress', label: 'Fortress' },
    { value: 'monastery', label: 'Monastery' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Heritage site name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.entryFee && isNaN(formData.entryFee)) {
      newErrors.entryFee = 'Entry fee must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, { file, url: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const heritageData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'entryFee') {
          heritageData.append(key, formData[key] ? parseInt(formData[key]) : 0);
        } else if (key === 'featured') {
          heritageData.append(key, formData[key]);
        } else {
          heritageData.append(key, formData[key]);
        }
      });

      // Add images
      selectedImages.forEach((image, index) => {
        heritageData.append('images', image);
        heritageData.append(`imageCaptions[${index}]`, `Image ${index + 1}`);
      });

      console.log('Submitting heritage data...');
      console.log('Form data:', formData);
      console.log('Selected images:', selectedImages);
      
      // Log FormData contents
      for (let [key, value] of heritageData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await axios.post('/api/heritage', heritageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Response:', response.data);
      
      toast.success('Heritage site added successfully!');
      navigate('/admin/heritage/list');
    } catch (error) {
      console.error('Error adding heritage site:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const message = error.response?.data?.message || 'Failed to add heritage site';
      toast.error(message);
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
            You need admin privileges to add heritage sites.
          </p>
          <button
            onClick={() => {
              if (isAdmin()) {
                navigate('/dashboard');
              } else {
                navigate('/user/dashboard');
              }
            }}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Heritage Site
          </h1>
          <p className="text-gray-600">
            Add a new heritage site to the platform
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Heritage Site Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field ${errors.name ? 'input-error' : ''}`}
                    placeholder="e.g., Pashupatinath Temple"
                  />
                  {errors.name && (
                    <p className="form-error">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="form-label">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className={`input-field ${errors.location ? 'input-error' : ''}`}
                  placeholder="e.g., Kathmandu, Nepal"
                />
                {errors.location && (
                  <p className="form-error">{errors.location}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`input-field ${errors.description ? 'input-error' : ''}`}
                  placeholder="Describe the heritage site..."
                />
                {errors.description && (
                  <p className="form-error">{errors.description}</p>
                )}
              </div>

              {/* Visiting Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="visitingHours" className="form-label">
                    Visiting Hours
                  </label>
                  <input
                    type="text"
                    id="visitingHours"
                    name="visitingHours"
                    value={formData.visitingHours}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 6:00 AM - 6:00 PM"
                  />
                </div>

                <div>
                  <label htmlFor="entryFee" className="form-label">
                    Entry Fee (NPR)
                  </label>
                  <input
                    type="number"
                    id="entryFee"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleChange}
                    className={`input-field ${errors.entryFee ? 'input-error' : ''}`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.entryFee && (
                    <p className="form-error">{errors.entryFee}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="featured" className="form-label">
                  Featured Site
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Mark as featured
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="form-label">
                  Heritage Site Images
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload multiple images (JPG, PNG, GIF). Maximum 5MB per image.
                  </p>
                </div>

                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Image Preview:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/heritage/list')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Heritage Site...' : 'Add Heritage Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHeritage; 