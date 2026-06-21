const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'kmedia.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      whatsappNumber TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS areas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cityId TEXT NOT NULL,
      FOREIGN KEY (cityId) REFERENCES cities(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      areaId TEXT NOT NULL,
      cityId TEXT NOT NULL,
      tvSize TEXT DEFAULT '43 inch',
      screens INTEGER DEFAULT 1,
      orientation TEXT DEFAULT 'horizontal',
      status TEXT DEFAULT 'available',
      FOREIGN KEY (areaId) REFERENCES areas(id) ON DELETE CASCADE,
      FOREIGN KEY (cityId) REFERENCES cities(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS location_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      locationId TEXT NOT NULL,
      imagePath TEXT NOT NULL,
      FOREIGN KEY (locationId) REFERENCES locations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('whatsappNumber', '919876543210');
    insertSetting.run('adSpecs_video', 'MP4');
    insertSetting.run('adSpecs_image', 'JPG, JPEG');
    insertSetting.run('adSpecs_resolution', 'Horizontal: 16:9 (1920x1080) | Vertical: 9:16 (1080x1920)');
    insertSetting.run('adSpecs_duration', '15 sec');
  }
}

module.exports = { db, initDB };
