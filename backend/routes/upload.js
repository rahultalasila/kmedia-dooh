const express = require('express');
const multer = require('multer');
const path = require('path');
const { db } = require('../config/database');
const { authMiddleware } = require('../middleware');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

router.post('/:locationId', authMiddleware, upload.array('images', 10), (req, res) => {
  const { locationId } = req.params;

  if (req.body.clearExisting === 'true') {
    db.prepare('DELETE FROM location_images WHERE locationId = ?').run(locationId);
  }

  const insert = db.prepare('INSERT INTO location_images (locationId, imagePath) VALUES (?, ?)');
  req.files.forEach(file => {
    insert.run(locationId, '/uploads/' + file.filename);
  });

  const images = db.prepare('SELECT imagePath FROM location_images WHERE locationId = ?').all(locationId).map(r => r.imagePath);
  res.json({ success: true, images });
});

module.exports = router;
