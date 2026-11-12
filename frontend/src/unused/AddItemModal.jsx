import React, { useState } from 'react';
import API from '../api/axios';

export default function AddItemModal({ onClose, onItemAdded }) {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'General' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await API.post('/items', formData);
      onItemAdded(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add New Item</h2>
          <button id="close-modal-btn" className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="item-title">Title *</label>
            <input
              id="item-title"
              className="form-input"
              type="text"
              name="title"
              placeholder="e.g. VS Code, React Project..."
              value={formData.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="item-description">Description</label>
            <textarea
              id="item-description"
              className="form-textarea"
              name="description"
              placeholder="Brief description (optional)..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="item-category">Category</label>
            <select
              id="item-category"
              className="form-input"
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            >
              <option value="General">General</option>
              <option value="Tool">Tool</option>
              <option value="Project">Project</option>
              <option value="Resource">Resource</option>
              <option value="Library">Library</option>
              <option value="API">API</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              id="add-item-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ flex: 2 }}
            >
              {isLoading ? 'Adding...' : '+ Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
