const express = require('express');
const { db } = require('../config/database');
const { authMiddleware } = require('../middleware');
const router = express.Router();

router.get('/', (req, res) => {
  const { cityId } = req.query;
  if (cityId) {
    res.json(db.prepare('SELECT * FROM areas WHERE cityId = ?').all(cityId));
  } else {
    res.json(db.prepare('SELECT * FROM areas').all());
  }
});

router.post('/', authMiddleware, (req, res) => {
  const { id, name, cityId } = req.body;
  if (!name || !cityId) return res.status(400).json({ message: 'Area name and city are required' });

  db.prepare('INSERT INTO areas (id, name, cityId) VALUES (?, ?, ?)').run(id, name, cityId);
  res.json({ success: true, message: 'Area added' });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name } = req.body;
  db.prepare('UPDATE areas SET name = ? WHERE id = ?').run(name, req.params.id);
  res.json({ success: true, message: 'Area updated' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM areas WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Area deleted' });
});

module.exports = router;
