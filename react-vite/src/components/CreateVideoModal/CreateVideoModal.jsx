import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkAddVideo } from '../../redux/videos';
import { thunkFetchFilters } from '../../redux/filters';
import './CreateVideoModal.css';

// Helper function to validate YouTube URLs
const isValidYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
};

export default function CreateVideoModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const filtersObj = useSelector(state => state.filters.allFilters);
  const filters = Object.values(filtersObj || {});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [filterId, setFilterId] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(thunkFetchFilters());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Check if user is logged in
    if (!user?.id) {
      setErrors({ general: 'You must be logged in to create videos' });
      setIsLoading(false);
      return;
    }

    const videoData = {
      ownerId: user.id,
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      thumbnailUrl: thumbnailUrl.trim() || null,
      filterId: filterId || null
    };

    // Basic validation
    const newErrors = {};
    if (!videoData.title) newErrors.title = 'Title is required';
    if (!videoData.url) newErrors.url = 'Video URL is required';
    if (videoData.url && !isValidYouTubeUrl(videoData.url)) {
      newErrors.url = 'Please enter a valid YouTube URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkAddVideo(videoData));
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to create video. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-video-modal">
      <h2>Add New Video</h2>
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            maxLength={255}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">YouTube URL *</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
          />
          {errors.url && <span className="error">{errors.url}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="filterId">Category</label>
          <select
            id="filterId"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
          >
            <option value="">Select a category (optional)</option>
            {filters.map(filter => (
              <option key={filter.id} value={filter.id}>
                {filter.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="thumbnailUrl">Thumbnail URL (optional)</label>
          <input
            type="url"
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
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
            {isLoading ? 'Creating...' : 'Create Video'}
          </button>
        </div>
      </form>
    </div>
  );
}