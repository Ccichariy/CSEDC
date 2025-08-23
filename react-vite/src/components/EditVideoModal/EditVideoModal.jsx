import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkUpdateVideo } from '../../redux/videos';
import { thunkFetchFilters } from '../../redux/filters';
import './EditVideoModal.css';

export default function EditVideoModal({ video }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const filtersObj = useSelector(state => state.filters.allFilters);
  const filters = Object.values(filtersObj || {});
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [filterId, setFilterId] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch filters when component mounts
    dispatch(thunkFetchFilters());
  }, [dispatch]);

  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setDescription(video.description || '');
      setUrl(video.url || '');
      setFilterId(video.filterId || '');
    }
  }, [video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const videoData = {
      title: title.trim(),
      description: description.trim() || null,
      url: url.trim(),
      filterId: filterId || null,
      userId: user?.id
    };

    // Basic validation
    const newErrors = {};
    if (!videoData.title) newErrors.title = 'Video title is required';
    if (!videoData.url) newErrors.url = 'Video URL is required';
    if (!user?.id) newErrors.general = 'You must be logged in to edit videos';
    if (video?.ownerId !== user?.id) newErrors.general = 'You can only edit your own videos';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkUpdateVideo(video.id, videoData));
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to update video. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!video) {
    return (
      <div className="edit-video-modal">
        <div className="error-message">Video not found</div>
      </div>
    );
  }

  return (
    <div className="edit-video-modal">
      <h2>Edit Video</h2>
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
            placeholder="Enter video description (optional)"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">Video URL *</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/video"
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
            {isLoading ? 'Updating...' : 'Update Video'}
          </button>
        </div>
      </form>
    </div>
  );
}