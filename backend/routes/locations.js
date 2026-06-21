const express = require('express');
const { db } = require('../config/database');
const { authMiddleware } = require('../middleware');
const router = express.Router();

router.get('/', (req, res) => {
  const { cityId } = req.query;
  let locations;
  if (cityId) {
    locations = db.prepare('SELECT * FROM locations WHERE cityId = ?').all(cityId);
  } else {
    locations = db.prepare('SELECT * FROM locations').all();
  }

  locations.forEach(loc => {
    loc.images = db.prepare('SELECT imagePath FROM location_images WHERE locationId = ?').all(loc.id).map(r => r.imagePath);
  });

  res.json(locations);
});

router.post('/', authMiddleware, (req, res) => {
  const { id, name, areaId, cityId, tvSize, screens, orientation, status } = req.body;
  if (!name || !areaId || !cityId) return res.status(400).json({ message: 'Name, area and city are required' });

  db.prepare('INSERT INTO locations (id, name, areaId, cityId, tvSize, screens, orientation, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, name, areaId, cityId, tvSize || '43 inch', screens || 1, orientation || 'horizontal', status || 'available');

  res.json({ success: true, message: 'Location added', id });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, areaId, cityId, tvSize, screens, orientation, status } = req.body;
  db.prepare('UPDATE locations SET name=?, areaId=?, cityId=?, tvSize=?, screens=?, orientation=?, status=? WHERE id=?')
    .run(name, areaId, cityId, tvSize, screens, orientation, status, req.params.id);
  res.json({ success: true, message: 'Location updated' });
});

router.put('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE locations SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true, message: 'Status updated' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM location_images WHERE locationId = ?').run(req.params.id);
  db.prepare('DELETE FROM locations WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Location deleted' });
});

module.exports = router;
