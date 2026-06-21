const express = require('express');
const { db } = require('../config/database');
const { authMiddleware } = require('../middleware');
const router = express.Router();

router.get('/', (req, res) => {
  const cities = db.prepare('SELECT * FROM cities').all();
  res.json(cities);
});

router.post('/', authMiddleware, (req, res) => {
  const { id, name, whatsappNumber } = req.body;
  if (!id || !name) return res.status(400).json({ message: 'City name is required' });

  try {
    db.prepare('INSERT INTO cities (id, name, whatsappNumber) VALUES (?, ?, ?)').run(id, name, whatsappNumber || '');
    res.json({ success: true, message: 'City added' });
  } catch (e) {
    res.status(400).json({ message: 'City already exists' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, whatsappNumber } = req.body;
  db.prepare('UPDATE cities SET name = ?, whatsappNumber = ? WHERE id = ?').run(name, whatsappNumber || '', req.params.id);
  res.json({ success: true, message: 'City updated' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  if (req.params.id === 'hyderabad') return res.status(400).json({ message: 'Cannot delete headquarters city' });

  db.prepare('DELETE FROM cities WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'City deleted' });
});

module.exports = router;
