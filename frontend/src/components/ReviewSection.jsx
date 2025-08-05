import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ heritageId, reviewStats, onReviewUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated, user } = useAuth();

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated()) {
      fetchUserReview();
    }
  }, [heritageId, currentPage]);

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for heritage:', heritageId);
      const response = await axios.get(`/api/reviews/heritage/${heritageId}/reviews?page=${currentPage}&limit=5`);
      console.log('Reviews response:', response.data);
      setReviews(response.data.data.reviews);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      console.log('Fetching user review for heritage:', heritageId);
      const response = await axios.get(`/api/reviews/heritage/${heritageId}/reviews/my`);
      console.log('User review response:', response.data);
      setUserReview(response.data.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching user review:', error);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error('Please login to submit a review');
      return;
    }

    setSubmitting(true);
    try {
      if (userReview) {
        // Update existing review
        await axios.put(`/api/reviews/reviews/${userReview.id}`, reviewForm);
        toast.success('Review updated successfully!');
      } else {
        // Create new review
        await axios.post(`/api/reviews/heritage/${heritageId}/reviews`, reviewForm);
        toast.success('Review submitted successfully!');
      }
      
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      fetchReviews();
      fetchUserReview();
      if (onReviewUpdate) onReviewUpdate();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      await axios.delete(`/api/reviews/reviews/${userReview.id}`);
      toast.success('Review deleted successfully!');
      setUserReview(null);
      fetchReviews();
      if (onReviewUpdate) onReviewUpdate();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onChange(star) : undefined}
            className={`text-2xl ${
              star <= rating
                ? 'text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const renderReviewCard = (review) => (
    <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 relative">
            {review.user?.profileImage ? (
              <img 
                src={review.user.profileImage.startsWith('http') 
                  ? review.user.profileImage 
                  : `http://localhost:5000${review.user.profileImage}`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  console.error('Review image failed to load:', review.user.profileImage);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center ${review.user?.profileImage ? 'hidden' : ''}`}>
              <span className="text-primary-600 font-semibold">
                {review.user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {review.user?.firstName} {review.user?.lastName}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {renderStars(review.rating)}
      </div>
      
      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      <p className="text-gray-700">{review.comment}</p>
      
      {review.id === userReview?.id && (
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => {
              setReviewForm({
                rating: review.rating,
                title: review.title,
                comment: review.comment
              });
              setShowReviewForm(true);
            }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteReview}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
          {isAuthenticated() && !userReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary"
            >
              Write a Review
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {reviewStats?.averageRating?.toFixed(1) || '0.0'}
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          
          <div className="flex-1">
            {renderStars(Math.round(reviewStats?.averageRating || 0))}
            <div className="text-sm text-gray-600 mt-1">
              {reviewStats?.totalReviews || 0} reviews
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h4>
          
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(reviewForm.rating, true, (rating) => 
                setReviewForm(prev => ({ ...prev, rating }))
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Brief summary of your experience"
                maxLength={100}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                className="input-field resize-none"
                rows={4}
                placeholder="Share your detailed experience..."
                maxLength={1000}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {reviewForm.comment.length}/1000 characters
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewForm({ rating: 5, title: '', comment: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User's Review */}
      {userReview && !showReviewForm && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Your Review</h4>
          {renderReviewCard(userReview)}
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          All Reviews ({reviewStats?.totalReviews || 0})
        </h4>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⭐</div>
            <p className="text-gray-600">No reviews yet. Be the first to review this heritage site!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map(renderReviewCard)}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
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

export default ReviewSection; 