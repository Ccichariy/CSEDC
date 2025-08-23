import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkUpdatePlaylist } from '../../redux/playlists';
import './EditPlaylistModal.css';

export default function EditPlaylistModal({ playlist }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (playlist) {
      setName(playlist.name || '');
      setDescription(playlist.description || '');
    }
  }, [playlist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const playlistData = {
      name: name.trim(),
      description: description.trim() || null,
      userId: user?.id
    };

    // Basic validation
    const newErrors = {};
    if (!playlistData.name) newErrors.name = 'Playlist name is required';
    if (!user?.id) newErrors.general = 'You must be logged in to edit playlists';
    if (playlist?.userId !== user?.id) newErrors.general = 'You can only edit your own playlists';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkUpdatePlaylist(playlist.id, playlistData));
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to update playlist. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!playlist) {
    return (
      <div className="edit-playlist-modal">
        <div className="error-message">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="edit-playlist-modal">
      <h2>Edit Playlist</h2>
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="name">Playlist Name *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter playlist name"
            maxLength={255}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter playlist description (optional)"
            rows={4}
          />
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
            {isLoading ? 'Updating...' : 'Update Playlist'}
          </button>
        </div>
      </form>
    </div>
  );
}