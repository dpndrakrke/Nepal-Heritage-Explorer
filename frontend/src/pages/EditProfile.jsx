import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { user, updateProfile, updateProfileImage, isAdmin } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log('EditProfile component mounted, fetching user profile...');
    fetchUserProfile();
  }, []);

  // Debug: Monitor formData changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      console.log('Profile response:', response.data);
      
      // The user data is nested under data.user based on our backend fix
      const userData = response.data.data?.user || response.data.data;
      console.log('User data extracted:', userData);
      
      const formDataToSet = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        bio: userData.bio || ''
      };
      
      console.log('Setting form data:', formDataToSet);
      setFormData(formDataToSet);
      
      if (userData.profileImage) {
        // Ensure the image URL is properly formatted
        const imageUrl = userData.profileImage.startsWith('http') 
          ? userData.profileImage 
          : `http://localhost:5000${userData.profileImage}`;
        console.log('Setting profile image URL:', imageUrl);
        console.log('Original profileImage from backend:', userData.profileImage);
        setPreviewImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      console.log('Selected file:', file.name, file.type, file.size);
      setProfileImage(file);
      const objectUrl = URL.createObjectURL(file);
      console.log('Created object URL:', objectUrl);
      setPreviewImage(objectUrl);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) {
      toast.error('Please select an image to upload');
      return;
    }

    setUploadingImage(true);
    try {
      // Test backend connectivity first
      try {
        await axios.get('/health');
        console.log('Backend is accessible');
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
        toast.error('Backend server is not accessible. Please check if the server is running.');
        return;
      }

      // Test authentication
      try {
        await axios.get('/api/auth/profile');
        console.log('Authentication is working');
      } catch (authError) {
        console.error('Authentication failed:', authError);
        toast.error('Authentication failed. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', profileImage);

      console.log('Uploading image:', profileImage.name);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Test debug endpoint first
      try {
        const debugResponse = await axios.post('/debug/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Debug upload response:', debugResponse.data);
      } catch (debugError) {
        console.error('Debug upload failed:', debugError);
      }

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to upload an image');
        return;
      }

      const response = await axios.post('/api/auth/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Upload response:', response.data);
      console.log('Response data.data:', response.data.data);
      console.log('Response data.data.profileImage:', response.data.data.profileImage);

      if (response.data.success) {
        toast.success('Profile image updated successfully!');
        setProfileImage(null);
        
        // Get the profile image URL from the response
        const profileImagePath = response.data.data.profileImage;
        console.log('Profile image path from response:', profileImagePath);
        
        // Ensure the returned image URL is properly formatted
        const imageUrl = profileImagePath.startsWith('http') 
          ? profileImagePath 
          : `http://localhost:5000${profileImagePath}`;
        console.log('Setting uploaded image URL:', imageUrl);
        
        // Test if the image URL is accessible
        const testImg = new Image();
        testImg.onload = () => {
          console.log('Image loaded successfully from URL:', imageUrl);
          setPreviewImage(imageUrl);
          // Update the global user state with the new profile image
          updateProfileImage(profileImagePath);
        };
        testImg.onerror = () => {
          console.error('Image failed to load from URL:', imageUrl);
          // Try without the leading slash
          const alternativeUrl = profileImagePath.startsWith('http') 
            ? profileImagePath 
            : `http://localhost:5000/${profileImagePath.replace(/^\//, '')}`;
          console.log('Trying alternative URL:', alternativeUrl);
          setPreviewImage(alternativeUrl);
          // Update the global user state with the new profile image
          updateProfileImage(profileImagePath);
        };
        testImg.src = imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to upload profile image';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully!');
        // Redirect based on user role
        if (isAdmin()) {
          navigate('/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="card-header">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-1">Update your personal information and profile picture</p>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body">
            {/* Profile Image Section */}
            <div className="mb-8">
              <label className="form-label">Profile Picture</label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', previewImage);
                          e.target.style.display = 'none';
                          const fallback = e.target.nextSibling;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                        onLoad={(e) => {
                          console.log('Image loaded successfully:', previewImage);
                          const fallback = e.target.nextSibling;
                          if (fallback) {
                            fallback.style.display = 'none';
                          }
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${previewImage ? 'hidden' : ''}`}>
                      <span className="text-2xl font-bold text-gray-400">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary text-sm"
                      disabled={uploadingImage}
                    >
                      Choose Image
                    </button>
                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        className="btn-primary text-sm"
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="form-label">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="form-label">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your last name"
                />
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="form-label">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label htmlFor="bio" className="form-label">
                  About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell us about yourself and your heritage interests..."
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Share your interests in Nepali heritage and culture
                  </p>
                  <span className="text-xs text-gray-400">
                    {formData.bio.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  if (isAdmin()) {
                    navigate('/dashboard');
                  } else {
                    navigate('/user/dashboard');
                  }
                }}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile; 