import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import ItemCard from './ItemCard';
import AddItemModal from './AddItemModal';

export default function Dashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get('/items');
      setItems(data);
    } catch (err) {
      setError('Failed to load items. Please refresh.');
      console.error('Fetch items error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleItemAdded = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    setShowModal(false);
  };

  const handleItemDeleted = (deletedId) => {
    setItems((prev) => prev.filter((item) => item._id !== deletedId));
  };

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-heading">
              Your <span>Workspace</span>
            </h1>
            <p className="dashboard-subheading">
              Manage your tools, projects, and resources
            </p>
          </div>
          <button
            id="open-add-modal-btn"
            className="btn-add"
            onClick={() => setShowModal(true)}
          >
            + Add Item
          </button>
        </div>

        <div className="stats-bar">
          <div className="stat-chip">
            📦 <strong>{items.length}</strong> items
          </div>
          <div className="stat-chip">
            👤 Logged in as <strong>{user?.name}</strong>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="items-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🗂️</div>
              <p className="empty-state-title">No items yet</p>
              <p className="empty-state-text">
                Click <strong>+ Add Item</strong> to create your first entry
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <ItemCard
                key={item._id}
                item={item}
                onDelete={handleItemDeleted}
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onItemAdded={handleItemAdded}
        />
      )}
    </>
  );
}
