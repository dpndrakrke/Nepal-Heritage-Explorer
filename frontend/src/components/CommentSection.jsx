import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ heritageId, commentStats, onCommentUpdate }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const { isAuthenticated, user } = useAuth();

  const [commentForm, setCommentForm] = useState({
    content: ''
  });

  useEffect(() => {
    fetchComments();
  }, [heritageId, currentPage]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/heritage/${heritageId}/comments?page=${currentPage}&limit=10`);
      setComments(response.data.data.comments);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error('Please login to post a comment');
      return;
    }

    setSubmitting(true);
    try {
      if (editingComment) {
        // Update existing comment
        await axios.put(`/api/comments/comments/${editingComment.id}`, commentForm);
        toast.success('Comment updated successfully!');
        setEditingComment(null);
      } else {
        // Create new comment
        await axios.post(`/api/comments/heritage/${heritageId}/comments`, {
          ...commentForm,
          parentId: replyingTo?.id || null
        });
        toast.success('Comment posted successfully!');
        setReplyingTo(null);
      }
      
      setShowCommentForm(false);
      setCommentForm({ content: '' });
      fetchComments();
      if (onCommentUpdate) onCommentUpdate();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/comments/${commentId}`);
      toast.success('Comment deleted successfully!');
      fetchComments();
      if (onCommentUpdate) onCommentUpdate();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setShowCommentForm(true);
    setEditingComment(null);
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setCommentForm({ content: comment.content });
    setShowCommentForm(true);
    setReplyingTo(null);
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 relative">
              {comment.user?.profileImage ? (
                <img 
                  src={comment.user.profileImage.startsWith('http') 
                    ? comment.user.profileImage 
                    : `http://localhost:5000${comment.user.profileImage}`} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    console.error('Comment image failed to load:', comment.user.profileImage);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center ${comment.user?.profileImage ? 'hidden' : ''}`}>
                <span className="text-primary-600 font-semibold text-sm">
                  {comment.user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {comment.user?.firstName} {comment.user?.lastName}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {isAuthenticated() && comment.user?.id === user?.id && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(comment)}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-700 text-sm">{comment.content}</p>
        
        {!isReply && isAuthenticated() && (
          <button
            onClick={() => handleReply(comment)}
            className="text-xs text-primary-600 hover:text-primary-700 mt-2"
          >
            Reply
          </button>
        )}
      </div>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Comment Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
          {isAuthenticated() && (
            <button
              onClick={() => {
                setShowCommentForm(true);
                setReplyingTo(null);
                setEditingComment(null);
              }}
              className="btn-primary"
            >
              Add Comment
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          {commentStats?.totalComments || 0} total comments
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {editingComment ? 'Edit Comment' : replyingTo ? `Reply to ${replyingTo.user?.firstName}` : 'Add a Comment'}
          </h4>
          
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={commentForm.content}
                onChange={(e) => setCommentForm({ content: e.target.value })}
                className="input-field resize-none"
                rows={4}
                placeholder={replyingTo ? "Write your reply..." : "Share your thoughts about this heritage site..."}
                maxLength={500}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {commentForm.content.length}/500 characters
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Posting...' : (editingComment ? 'Update Comment' : 'Post Comment')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCommentForm(false);
                  setCommentForm({ content: '' });
                  setReplyingTo(null);
                  setEditingComment(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          All Comments ({commentStats?.totalComments || 0})
        </h4>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-600">No comments yet. Be the first to comment on this heritage site!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {comments.map(comment => renderComment(comment))}
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

export default CommentSection; 