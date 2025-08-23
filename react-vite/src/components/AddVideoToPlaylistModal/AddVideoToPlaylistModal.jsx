import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkFetchPlaylists, thunkAddVideoToPlaylist } from '../../redux/playlists';
import './AddVideoToPlaylistModal.css';

export default function AddVideoToPlaylistModal({ video }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const playlists = useSelector(state => Object.values(state.playlists.allPlaylists));
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter playlists to only show user's own playlists
  const userPlaylists = playlists.filter(playlist => playlist.userId === user?.id);

  useEffect(() => {
    dispatch(thunkFetchPlaylists());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!selectedPlaylistId) {
      setError('Please select a playlist');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkAddVideoToPlaylist(selectedPlaylistId, video.id));
      closeModal();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="add-video-modal">
        <div className="error-message">You must be logged in to add videos to playlists</div>
      </div>
    );
  }

  return (
    <div className="add-video-modal">
      <h2>Add Video to Playlist</h2>
      
      <div className="video-info">
        <h3>{video.title}</h3>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="playlist">Select Playlist *</label>
          <select
            id="playlist"
            value={selectedPlaylistId}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Choose a playlist...</option>
            {userPlaylists.map(playlist => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name} ({playlist.videos?.length || 0} videos)
              </option>
            ))}
          </select>
        </div>

        {userPlaylists.length === 0 && (
          <p className="no-playlists">You don't have any playlists yet. Create one first!</p>
        )}

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
            disabled={isLoading || userPlaylists.length === 0}
          >
            {isLoading ? 'Adding...' : 'Add to Playlist'}
          </button>
        </div>
      </form>
    </div>
  );
}