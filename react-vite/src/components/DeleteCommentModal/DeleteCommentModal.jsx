import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkDeleteComment } from '../../redux/comments';
import './DeleteCommentModal.css';

export default function DeleteCommentModal({ comment }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!user?.id) {
      setError('You must be logged in to delete comments');
      setIsLoading(false);
      return;
    }
    
    if (comment?.userId !== user?.id) {
      setError('You can only delete your own comments');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkDeleteComment(comment.id));
      closeModal();
    } catch (error) {
      setError('Failed to delete comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!comment) {
    return (
      <div className="delete-comment-modal">
        <div className="error-message">Comment not found</div>
      </div>
    );
  }

  return (
    <div className="delete-comment-modal">
      <h2>Delete Comment</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <div className="confirmation-content">
        <p>Are you sure you want to delete this comment?</p>
        <div className="comment-info">
          <div className="comment-content">
            {comment.content}
          </div>
          {comment.createdAt && (
            <div className="comment-date">
              Posted on {new Date(comment.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
        <p className="warning-text">
          This action cannot be undone. The comment will be permanently deleted.
        </p>
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
          type="button"
          onClick={handleDelete}
          className="delete-button"
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Delete Comment'}
        </button>
      </div>
    </div>
  );
}