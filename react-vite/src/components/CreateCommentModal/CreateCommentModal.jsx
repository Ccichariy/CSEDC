import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkAddComment } from '../../redux/comments';
import './CreateCommentModal.css';

export default function CreateCommentModal({ videoId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const commentData = {
      content: content.trim(),
      videoId: videoId,
      userId: user?.id
    };

    // Basic validation
    const newErrors = {};
    if (!commentData.content) newErrors.content = 'Comment content is required';
    if (!user?.id) newErrors.general = 'You must be logged in to comment';
    if (!videoId) newErrors.general = 'Video ID is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkAddComment(commentData));
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to add comment. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-comment-modal">
      <h2>Add Comment</h2>
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="content">Comment *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment here..."
            rows={4}
            maxLength={1000}
          />
          {errors.content && <span className="error">{errors.content}</span>}
          <div className="character-count">
            {content.length}/1000 characters
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={closeModal}
            className="cancel-button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}