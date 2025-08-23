import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkAddVideo } from '../../redux/videos';
import './CreateVideoModal.css';

export default function CreateVideoModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const videoData = {
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      thumbnailUrl: thumbnailUrl.trim() || null
    };

    // Basic validation
    const newErrors = {};
    if (!videoData.title) newErrors.title = 'Title is required';
    if (!videoData.url) newErrors.url = 'Video URL is required';
    if (videoData.url && !videoData.url.includes('youtube.com/watch?v=')) {
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
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {errors.url && <span className="error">{errors.url}</span>}
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