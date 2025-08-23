import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkDeletePlaylist } from '../../redux/playlists';
import './DeletePlaylistModal.css';

export default function DeletePlaylistModal({ playlist }) {
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
      setError('You must be logged in to delete playlists');
      setIsLoading(false);
      return;
    }
    
    if (playlist?.userId !== user?.id) {
      setError('You can only delete your own playlists');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkDeletePlaylist(playlist.id));
      closeModal();
    } catch (error) {
      setError('Failed to delete playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!playlist) {
    return (
      <div className="delete-playlist-modal">
        <div className="error-message">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="delete-playlist-modal">
      <h2>Delete Playlist</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <div className="confirmation-content">
        <p>Are you sure you want to delete this playlist?</p>
        <div className="playlist-info">
          <strong>{playlist.name}</strong>
          {playlist.description && (
            <p className="playlist-description">{playlist.description}</p>
          )}
          {playlist.videos && playlist.videos.length > 0 && (
            <p className="video-count">{playlist.videos.length} video(s) in this playlist</p>
          )}
        </div>
        <p className="warning-text">
          This action cannot be undone. The playlist will be permanently deleted, but the videos will remain.
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
          {isLoading ? 'Deleting...' : 'Delete Playlist'}
        </button>
      </div>
    </div>
  );
}