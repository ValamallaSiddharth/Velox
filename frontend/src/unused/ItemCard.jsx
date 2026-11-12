import React, { useState } from 'react';
import API from '../api/axios';

export default function ItemCard({ item, onDelete, style }) {
  const [deleting, setDeleting] = useState(false);

  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      await API.delete(`/items/${item._id}`);
      onDelete(item._id);
    } catch (err) {
      alert('Failed to delete item. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="item-card" style={style}>
      <div className="item-card-header">
        <h3 className="item-title">{item.title}</h3>
        <span className="item-category-badge">{item.category}</span>
      </div>

      <p className="item-description">
        {item.description || (
          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No description provided
          </span>
        )}
      </p>

      <div className="item-card-footer">
        <span className="item-date">📅 {formattedDate}</span>
        <button
          id={`delete-item-${item._id}`}
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? '...' : '🗑 Delete'}
        </button>
      </div>
    </div>
  );
}