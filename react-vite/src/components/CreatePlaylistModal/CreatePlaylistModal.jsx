import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkAddPlaylist } from '../../redux/playlists';
import './CreatePlaylistModal.css';

export default function CreatePlaylistModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    if (!user?.id) newErrors.general = 'You must be logged in to create a playlist';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkAddPlaylist(playlistData));
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to create playlist. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-playlist-modal">
      <h2>Create New Playlist</h2>
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
            {isLoading ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
      </form>
    </div>
  );
}