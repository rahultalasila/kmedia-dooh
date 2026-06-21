require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));

// Initialize database and seed default data
initDB();
seedData();

function seedData() {
  const { db } = require('./config/database');
  const cityCount = db.prepare('SELECT COUNT(*) as count FROM cities').get();
  if (cityCount.count > 0) return;

  // Seed cities
  const insertCity = db.prepare('INSERT OR IGNORE INTO cities (id, name, whatsappNumber) VALUES (?, ?, ?)');
  insertCity.run('hyderabad', 'Hyderabad', '919876543210');
  insertCity.run('vijayawada', 'Vijayawada', '919876543210');
  insertCity.run('vizag', 'Vizag', '919876543210');

  // Seed areas
  const insertArea = db.prepare('INSERT OR IGNORE INTO areas (id, name, cityId) VALUES (?, ?, ?)');
  const areas = [
    ['jubilee-hills', 'Jubilee Hills', 'hyderabad'],
    ['banjara-hills', 'Banjara Hills', 'hyderabad'],
    ['hitech-city', 'Hitech City', 'hyderabad'],
    ['madhapur', 'Madhapur', 'hyderabad'],
    ['kondapur', 'Kondapur', 'hyderabad'],
    ['gachibowli', 'Gachibowli', 'hyderabad'],
    ['kukatpally', 'Kukatpally', 'hyderabad'],
    ['chanda-nagar', 'Chanda Nagar', 'hyderabad'],
    ['manikonda', 'Manikonda', 'hyderabad'],
    ['nallagandla', 'Nallagandla', 'hyderabad'],
    ['kompally', 'Kompally', 'hyderabad'],
    ['pocharum', 'Pocharum', 'hyderabad'],
    ['begumpet', 'Begumpet', 'hyderabad'],
    ['nagole', 'Nagole', 'hyderabad'],
    ['vij-hyd-highway', 'Vij-Hyd Highway', 'hyderabad'],
    ['hyd-vij-highway', 'Hyd-VIJ Highway', 'hyderabad'],
    ['warrangal-hyd-highway', 'Warrangal-Hyd Highway', 'hyderabad'],
    ['sainikpuri', 'Sainikpuri', 'hyderabad'],
    ['thumukunta', 'Thumukunta', 'hyderabad'],
    ['kokapet', 'Kokapet', 'hyderabad'],
    ['nankramaguda', 'Nankramaguda', 'hyderabad'],
    ['secunderabad', 'Secunderabad', 'hyderabad'],
    ['financial-dist-kokapet', 'Financial District, Kokapet', 'hyderabad'],
    ['gachibowli-hitech', 'Gachibowli, Hitech City', 'hyderabad'],
    ['chityala', 'Chityala', 'hyderabad']
  ];
  areas.forEach(a => insertArea.run(...a));

  // Seed locations
  const insertLoc = db.prepare('INSERT OR IGNORE INTO locations (id, name, areaId, cityId, tvSize, screens, orientation, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const locations = [
    ['l1','SpicyVenue','jubilee-hills','hyderabad','43 inch',1,'horizontal','available'],
    ['l2','An Te Ra','jubilee-hills','hyderabad','43 inch',1,'horizontal','available'],
    ['l3','Telangana Spice Kitchen','jubilee-hills','hyderabad','43 inch',1,'horizontal','available'],
    ['l54','Film Nagar Cultural Club','jubilee-hills','hyderabad','43 inch',2,'horizontal','available'],
    ['l55','Jubilee Hills International Centre','jubilee-hills','hyderabad','43 inch',7,'horizontal','available'],
    ['l56','Sama','jubilee-hills','hyderabad','43 inch',1,'horizontal','available'],
    ['l61','Tugo','jubilee-hills','hyderabad','43 inch',3,'horizontal','available'],
    ['l62','One-Drive In','jubilee-hills','hyderabad','43 inch',5,'horizontal','available'],
    ['l63','Blank by TSK','jubilee-hills','hyderabad','43 inch',4,'horizontal','available'],
    ['l64','Papaya','jubilee-hills','hyderabad','43 inch',4,'horizontal','available'],
    ['l65','Gamyam','jubilee-hills','hyderabad','43 inch',3,'horizontal','available'],
    ['l66','Nataka','jubilee-hills','hyderabad','43 inch',1,'horizontal','available'],
    ['l67','Amoroso','jubilee-hills','hyderabad','43 inch',3,'horizontal','available'],
    ['l68','Ala Jubilee Lo','jubilee-hills','hyderabad','43 inch',4,'horizontal','available'],
    ['l83','Dimmy Pan Shop','jubilee-hills','hyderabad','43 inch',2,'horizontal','available'],
    ['l4','Pakka Local','banjara-hills','hyderabad','43 inch',1,'horizontal','available'],
    ['l5','Pancha Kattu','banjara-hills','hyderabad','43 inch',1,'horizontal','available'],
    ['l60','Chaitanya Food Court','banjara-hills','hyderabad','43 inch',1,'horizontal','available'],
    ['l6','Kanchi Cafe','hitech-city','hyderabad','43 inch',1,'horizontal','available'],
    ['l7','Ala Dakshinapuram Lo','hitech-city','hyderabad','43 inch',1,'horizontal','available'],
    ['l8','Pakka Local','hitech-city','hyderabad','43 inch',1,'horizontal','available'],
    ['l9','Ideal Kitchen','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l10','Maharaja Chat','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l11','Pancha Kattu','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l12','Swach','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l13','Usha Mulpuris','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l14','Anakapur Village','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l15','Udipi Upahar','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l17','Godavari Cuts','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l84','Dakshana Desapu Ruchuku','madhapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l16','Pancha Kattu','kondapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l18','Kanchi Cafe','kondapur','hyderabad','43 inch',3,'horizontal','available'],
    ['l19','Heartcup','kondapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l20','Babai Hotel','kondapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l21','Godavari Cuts','kondapur','hyderabad','43 inch',1,'horizontal','available'],
    ['l22','An Te Ra','gachibowli','hyderabad','43 inch',1,'horizontal','available'],
    ['l23','Pakka Local','gachibowli','hyderabad','43 inch',1,'horizontal','available'],
    ['l24','Usha Mulpuris','kukatpally','hyderabad','43 inch',1,'horizontal','available'],
    ['l85','Chaitanya Food Court','kukatpally','hyderabad','43 inch',4,'horizontal','available'],
    ['l25','An Te Ra','chanda-nagar','hyderabad','43 inch',1,'horizontal','available'],
    ['l26','Babai Hotel','chanda-nagar','hyderabad','43 inch',1,'horizontal','available'],
    ['l27','UTK','chanda-nagar','hyderabad','43 inch',1,'horizontal','available'],
    ['l28','Dwara Cafe','chanda-nagar','hyderabad','43 inch',1,'horizontal','available'],
    ['l29','Udipi Upahar','chanda-nagar','hyderabad','43 inch',1,'horizontal','available'],
    ['l30','Taara Kitchen','manikonda','hyderabad','43 inch',1,'horizontal','available'],
    ['l31','Swach','nallagandla','hyderabad','43 inch',1,'horizontal','available'],
    ['l32','Babai Hotel','nallagandla','hyderabad','43 inch',1,'horizontal','available'],
    ['l33','Pancha Kattu','nallagandla','hyderabad','43 inch',1,'horizontal','available'],
    ['l34','Godavari Cuts','nallagandla','hyderabad','43 inch',1,'horizontal','available'],
    ['l35','TAAZA All Day','kompally','hyderabad','43 inch',1,'horizontal','available'],
    ['l36','TAAZA Tiffins','kompally','hyderabad','43 inch',1,'horizontal','available'],
    ['l37','Malnadu','kompally','hyderabad','43 inch',1,'horizontal','available'],
    ['l38','Kanchi Cafe','kompally','hyderabad','43 inch',1,'horizontal','available'],
    ['l39','An Te Ra','kompally','hyderabad','43 inch',1,'horizontal','available'],
    ['l40','Huts & Hives','kompally','hyderabad','43 inch',1,'horizontal','available'],
    ['l41','Malibu','kompally','hyderabad','43 inch',1,'horizontal','available'],
    ['l77','Babai Hotel','kompally','hyderabad','43 inch',2,'horizontal','available'],
    ['l78','Huts & Live','kompally','hyderabad','43 inch',2,'horizontal','available'],
    ['l79','Dasara','kompally','hyderabad','43 inch',2,'horizontal','available'],
    ['l80','Tinesipo','kompally','hyderabad','43 inch',1,'horizontal','available'],
    ['l81','Ahoy','kompally','hyderabad','43 inch',3,'horizontal','available'],
    ['l42','TAAZA Tiffins','pocharum','hyderabad','43 inch',1,'horizontal','available'],
    ['l43','Pancha Kattu','begumpet','hyderabad','43 inch',1,'horizontal','available'],
    ['l44','An Te Ra','nagole','hyderabad','43 inch',1,'horizontal','available'],
    ['l45','Meld Haus','nagole','hyderabad','43 inch',2,'horizontal','available'],
    ['l46','Village Organic Choutapal','vij-hyd-highway','hyderabad','43 inch',2,'horizontal','available'],
    ['l47','Vivera','vij-hyd-highway','hyderabad','43 inch',2,'horizontal','available'],
    ['l48','Vivera','hyd-vij-highway','hyderabad','43 inch',1,'horizontal','available'],
    ['l49','Village Organic Koyalgudem','hyd-vij-highway','hyderabad','43 inch',1,'horizontal','available'],
    ['l50','Vivera','warrangal-hyd-highway','hyderabad','43 inch',3,'horizontal','available'],
    ['l51','Swach','sainikpuri','hyderabad','43 inch',2,'horizontal','available'],
    ['l52','TAAZA All Day','thumukunta','hyderabad','43 inch',1,'horizontal','available'],
    ['l53','Ishtaa','kokapet','hyderabad','43 inch',1,'horizontal','available'],
    ['l57','Iguru','nankramaguda','hyderabad','43 inch',5,'horizontal','available'],
    ['l58','Telangana Spice Kitchen','secunderabad','hyderabad','43 inch',2,'horizontal','available'],
    ['l59','Verandah By TSK','secunderabad','hyderabad','43 inch',1,'horizontal','available'],
    ['l69','Naughty Kodi','financial-dist-kokapet','hyderabad','43 inch',2,'horizontal','available'],
    ['l70','Insomnia','financial-dist-kokapet','hyderabad','43 inch',2,'horizontal','available'],
    ['l71','Ko Ko Kai','financial-dist-kokapet','hyderabad','43 inch',1,'horizontal','available'],
    ['l72','Jamming Goat','financial-dist-kokapet','hyderabad','43 inch',1,'horizontal','available'],
    ['l73','Koki Coffee','financial-dist-kokapet','hyderabad','43 inch',2,'horizontal','available'],
    ['l74','Asaa','financial-dist-kokapet','hyderabad','43 inch',1,'horizontal','available'],
    ['l75','Flechazo','gachibowli-hitech','hyderabad','43 inch',2,'horizontal','available'],
    ['l76','Koki Coffee','gachibowli-hitech','hyderabad','43 inch',1,'horizontal','available'],
    ['l82','Carnival','chityala','hyderabad','43 inch',3,'horizontal','available']
  ];
  locations.forEach(l => insertLoc.run(...l));

  console.log('Database seeded with default data');
}

app.listen(PORT, () => {
  console.log(`K Media DOOH Backend running on http://localhost:${PORT}`);
});
