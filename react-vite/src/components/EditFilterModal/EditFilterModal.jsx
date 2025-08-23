import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkUpdateFilter } from '../../redux/filters';
import './EditFilterModal.css';

export default function EditFilterModal({ filter }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (filter) {
      setName(filter.name || '');
    }
  }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const filterData = {
      name: name.trim()
    };

    // Basic validation
    const newErrors = {};
    if (!filterData.name) newErrors.name = 'Filter name is required';
    if (!user?.id) newErrors.general = 'You must be logged in to edit filters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkUpdateFilter(filter.id, filterData));
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to update filter. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!filter) {
    return (
      <div className="edit-filter-modal">
        <div className="error-message">Filter not found</div>
      </div>
    );
  }

  return (
    <div className="edit-filter-modal">
      <h2>Edit Filter</h2>
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="name">Filter Name *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter filter/category name"
            maxLength={100}
          />
          {errors.name && <span className="error">{errors.name}</span>}
          <div className="help-text">
            Update the category/filter name for organizing videos (e.g., "Algebra", "Calculus", "Geometry")
          </div>
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
            {isLoading ? 'Updating...' : 'Update Filter'}
          </button>
        </div>
      </form>
    </div>
  );
}