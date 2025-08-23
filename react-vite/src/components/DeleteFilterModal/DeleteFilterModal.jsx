import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkDeleteFilter } from '../../redux/filters';
import './DeleteFilterModal.css';

export default function DeleteFilterModal({ filter }) {
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
      setError('You must be logged in to delete filters');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkDeleteFilter(filter.id));
      closeModal();
    } catch (error) {
      setError('Failed to delete filter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!filter) {
    return (
      <div className="delete-filter-modal">
        <div className="error-message">Filter not found</div>
      </div>
    );
  }

  return (
    <div className="delete-filter-modal">
      <h2>Delete Filter</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <div className="confirmation-content">
        <p>Are you sure you want to delete this filter/category?</p>
        <div className="filter-info">
          <strong>{filter.name}</strong>
        </div>
        <p className="warning-text">
          This action cannot be undone. The filter will be permanently deleted. Videos using this filter will no longer be categorized under it.
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
          {isLoading ? 'Deleting...' : 'Delete Filter'}
        </button>
      </div>
    </div>
  );
}