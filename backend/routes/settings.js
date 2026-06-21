const express = require('express');
const { db } = require('../config/database');
const { authMiddleware } = require('../middleware');
const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

router.put('/', authMiddleware, (req, res) => {
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  Object.entries(req.body).forEach(([key, value]) => {
    upsert.run(key, value);
  });
  res.json({ success: true, message: 'Settings saved' });
});

module.exports = router;
