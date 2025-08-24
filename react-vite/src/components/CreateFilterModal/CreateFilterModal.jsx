import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkAddFilter } from '../../redux/filters';
import './CreateFilterModal.css';

export default function CreateFilterModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    if (!user?.id) newErrors.general = 'You must be logged in to create a filter';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(thunkAddFilter(filterData));
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to create filter. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-filter-modal">
      <h2>Create New Filter</h2>
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
            Create a new category/filter for organizing videos (e.g., &quot;Algebra&quot;, &quot;Calculus&quot;, &quot;Geometry&quot;)
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
            {isLoading ? 'Creating...' : 'Create Filter'}
          </button>
        </div>
      </form>
    </div>
  );
}