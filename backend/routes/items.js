const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get items error:', error.message);
    res.status(500).json({ message: 'Server error fetching items' });
  }
});

router.post('/', protect, async (req, res) => {
  const { title, description, category } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const item = await Item.create({
      title,
      description: description || '',
      category: category || 'General',
      user: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error.message);
    res.status(500).json({ message: 'Server error creating item' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete item error:', error.message);
    res.status(500).json({ message: 'Server error deleting item' });
  }
});

module.exports = router;
