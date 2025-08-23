import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkUpdateComment } from '../../redux/comments';
import './EditCommentModal.css';

export default function EditCommentModal({ comment }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (comment) {
      setContent(comment.content || '');
    }
  }, [comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const commentData = {
      content: content.trim(),
      videoId: comment.videoId,
      userId: user?.id
    };

    // Basic validation
    const newErrors = {};
    if (!commentData.content) newErrors.content = 'Comment content is required';
    if (!user?.id) newErrors.general = 'You must be logged in to edit comments';
    if (comment?.userId !== user?.id) newErrors.general = 'You can only edit your own comments';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkUpdateComment(comment.id, commentData));
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to update comment. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!comment) {
    return (
      <div className="edit-comment-modal">
        <div className="error-message">Comment not found</div>
      </div>
    );
  }

  return (
    <div className="edit-comment-modal">
      <h2>Edit Comment</h2>
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
            {isLoading ? 'Updating...' : 'Update Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}