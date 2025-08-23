import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkDeleteVideo } from '../../redux/videos';
import './DeleteVideoModal.css';

export default function DeleteVideoModal({ video }) {
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
      setError('You must be logged in to delete videos');
      setIsLoading(false);
      return;
    }
    
    if (video?.ownerId !== user?.id) {
      setError('You can only delete your own videos');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkDeleteVideo(video.id));
      closeModal();
    } catch (error) {
      setError('Failed to delete video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!video) {
    return (
      <div className="delete-video-modal">
        <div className="error-message">Video not found</div>
      </div>
    );
  }

  return (
    <div className="delete-video-modal">
      <h2>Delete Video</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <div className="confirmation-content">
        <p>Are you sure you want to delete this video?</p>
        <div className="video-info">
          <strong>{video.title}</strong>
          {video.description && (
            <p className="video-description">{video.description}</p>
          )}
        </div>
        <p className="warning-text">
          This action cannot be undone. The video and all associated comments will be permanently deleted.
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
          {isLoading ? 'Deleting...' : 'Delete Video'}
        </button>
      </div>
    </div>
  );
}