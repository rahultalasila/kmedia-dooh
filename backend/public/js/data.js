// ===== DEFAULT DATA =====
const DEFAULT_DATA = {
  settings: {
    whatsappNumber: '919876543210',
    adSpecs: {
      video: 'MP4',
      image: 'JPG, JPEG',
      resolution: 'Horizontal: 16:9 (1920x1080) | Vertical: 9:16 (1080x1920)',
      duration: '15 sec'
    }
  },
  admin: {
    username: 'admin',
    password: 'kmedia123'
  },
  cities: [
    { id: 'hyderabad', name: 'Hyderabad', whatsappNumber: '919876543210' },
    { id: 'vijayawada', name: 'Vijayawada', whatsappNumber: '919876543210' },
    { id: 'vizag', name: 'Vizag', whatsappNumber: '919876543210' }
  ],
  areas: [
    { id: 'jubilee-hills', name: 'Jubilee Hills', cityId: 'hyderabad' },
    { id: 'banjara-hills', name: 'Banjara Hills', cityId: 'hyderabad' },
    { id: 'hitech-city', name: 'Hitech City', cityId: 'hyderabad' },
    { id: 'madhapur', name: 'Madhapur', cityId: 'hyderabad' },
    { id: 'kondapur', name: 'Kondapur', cityId: 'hyderabad' },
    { id: 'gachibowli', name: 'Gachibowli', cityId: 'hyderabad' },
    { id: 'kukatpally', name: 'Kukatpally', cityId: 'hyderabad' },
    { id: 'chanda-nagar', name: 'Chanda Nagar', cityId: 'hyderabad' },
    { id: 'manikonda', name: 'Manikonda', cityId: 'hyderabad' },
    { id: 'nallagandla', name: 'Nallagandla', cityId: 'hyderabad' },
    { id: 'kompally', name: 'Kompally', cityId: 'hyderabad' },
    { id: 'pocharum', name: 'Pocharum', cityId: 'hyderabad' },
    { id: 'begumpet', name: 'Begumpet', cityId: 'hyderabad' },
    { id: 'nagole', name: 'Nagole', cityId: 'hyderabad' },
    { id: 'vij-hyd-highway', name: 'Vij-Hyd Highway', cityId: 'hyderabad' },
    { id: 'hyd-vij-highway', name: 'Hyd-VIJ Highway', cityId: 'hyderabad' },
    { id: 'warrangal-hyd-highway', name: 'Warrangal-Hyd Highway', cityId: 'hyderabad' },
    { id: 'sainikpuri', name: 'Sainikpuri', cityId: 'hyderabad' },
    { id: 'thumukunta', name: 'Thumukunta', cityId: 'hyderabad' },
    { id: 'kokapet', name: 'Kokapet', cityId: 'hyderabad' },
    { id: 'nankramaguda', name: 'Nankramaguda', cityId: 'hyderabad' },
    { id: 'secunderabad', name: 'Secunderabad', cityId: 'hyderabad' },
    { id: 'financial-dist-kokapet', name: 'Financial District, Kokapet', cityId: 'hyderabad' },
    { id: 'gachibowli-hitech', name: 'Gachibowli, Hitech City', cityId: 'hyderabad' },
    { id: 'chityala', name: 'Chityala', cityId: 'hyderabad' }
  ],
  locations: [
    // ===== JUBILEE HILLS =====
    { id: 'l1', name: 'SpicyVenue', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l2', name: 'An Te Ra', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l3', name: 'Telangana Spice Kitchen', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l54', name: 'Film Nagar Cultural Club', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l55', name: 'Jubilee Hills International Centre', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 7, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l56', name: 'Sama', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l61', name: 'Tugo', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 3, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l62', name: 'One-Drive In', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 5, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l63', name: 'Blank by TSK', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 4, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l64', name: 'Papaya', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 4, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l65', name: 'Gamyam', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 3, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l66', name: 'Nataka', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l67', name: 'Amoroso', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 3, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l68', name: 'Ala Jubilee Lo', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 4, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l83', name: 'Dimmy Pan Shop', areaId: 'jubilee-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },

    // ===== BANJARA HILLS =====
    { id: 'l4', name: 'Pakka Local', areaId: 'banjara-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l5', name: 'Pancha Kattu', areaId: 'banjara-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l60', name: 'Chaitanya Food Court', areaId: 'banjara-hills', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== HITECH CITY =====
    { id: 'l6', name: 'Kanchi Cafe', areaId: 'hitech-city', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l7', name: 'Ala Dakshinapuram Lo', areaId: 'hitech-city', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l8', name: 'Pakka Local', areaId: 'hitech-city', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== MADHAPUR =====
    { id: 'l9', name: 'Ideal Kitchen', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l10', name: 'Maharaja Chat', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l11', name: 'Pancha Kattu', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l12', name: 'Swach', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l13', name: 'Usha Mulpuris', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l14', name: 'Anakapur Village', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l15', name: 'Udipi Upahar', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l17', name: 'Godavari Cuts', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l84', name: 'Dakshana Desapu Ruchuku', areaId: 'madhapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== KONDAPUR =====
    { id: 'l16', name: 'Pancha Kattu', areaId: 'kondapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l18', name: 'Kanchi Cafe', areaId: 'kondapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 3, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l19', name: 'Heartcup', areaId: 'kondapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l20', name: 'Babai Hotel', areaId: 'kondapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l21', name: 'Godavari Cuts', areaId: 'kondapur', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== GACHIBOWLI =====
    { id: 'l22', name: 'An Te Ra', areaId: 'gachibowli', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l23', name: 'Pakka Local', areaId: 'gachibowli', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== KUKATPALLY =====
    { id: 'l24', name: 'Usha Mulpuris', areaId: 'kukatpally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l85', name: 'Chaitanya Food Court', areaId: 'kukatpally', cityId: 'hyderabad', tvSize: '43 inch', screens: 4, images: [], orientation: 'horizontal', status: 'available' },

    // ===== CHANDA NAGAR =====
    { id: 'l25', name: 'An Te Ra', areaId: 'chanda-nagar', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l26', name: 'Babai Hotel', areaId: 'chanda-nagar', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l27', name: 'UTK', areaId: 'chanda-nagar', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l28', name: 'Dwara Cafe', areaId: 'chanda-nagar', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l29', name: 'Udipi Upahar', areaId: 'chanda-nagar', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== MANIKONDA =====
    { id: 'l30', name: 'Taara Kitchen', areaId: 'manikonda', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== NALLAGANDLA =====
    { id: 'l31', name: 'Swach', areaId: 'nallagandla', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l32', name: 'Babai Hotel', areaId: 'nallagandla', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l33', name: 'Pancha Kattu', areaId: 'nallagandla', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l34', name: 'Godavari Cuts', areaId: 'nallagandla', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== KOMPALLY =====
    { id: 'l35', name: 'TAAZA All Day', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l36', name: 'TAAZA Tiffins', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l37', name: 'Malnadu', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l38', name: 'Kanchi Cafe', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l39', name: 'An Te Ra', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l40', name: 'Huts & Hives', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l41', name: 'Malibu', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l77', name: 'Babai Hotel', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l78', name: 'Huts & Live', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l79', name: 'Dasara', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l80', name: 'Tinesipo', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l81', name: 'Ahoy', areaId: 'kompally', cityId: 'hyderabad', tvSize: '43 inch', screens: 3, images: [], orientation: 'horizontal', status: 'available' },

    // ===== POCHARUM =====
    { id: 'l42', name: 'TAAZA Tiffins', areaId: 'pocharum', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== BEGUMPET =====
    { id: 'l43', name: 'Pancha Kattu', areaId: 'begumpet', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== NAGOLE =====
    { id: 'l44', name: 'An Te Ra', areaId: 'nagole', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l45', name: 'Meld Haus', areaId: 'nagole', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },

    // ===== VIJ-HYD HIGHWAY =====
    { id: 'l46', name: 'Village Organic Choutapal', areaId: 'vij-hyd-highway', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l47', name: 'Vivera', areaId: 'vij-hyd-highway', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },

    // ===== HYD-VIJ HIGHWAY =====
    { id: 'l48', name: 'Vivera', areaId: 'hyd-vij-highway', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l49', name: 'Village Organic Koyalgudem', areaId: 'hyd-vij-highway', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== WARRANGAL-HYD HIGHWAY =====
    { id: 'l50', name: 'Vivera', areaId: 'warrangal-hyd-highway', cityId: 'hyderabad', tvSize: '43 inch', screens: 3, images: [], orientation: 'horizontal', status: 'available' },

    // ===== SAINIKPURI =====
    { id: 'l51', name: 'Swach', areaId: 'sainikpuri', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },

    // ===== THUMUKUNTA =====
    { id: 'l52', name: 'TAAZA All Day', areaId: 'thumukunta', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== KOKAPET =====
    { id: 'l53', name: 'Ishtaa', areaId: 'kokapet', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== NANKRAMAGUDA =====
    { id: 'l57', name: 'Iguru', areaId: 'nankramaguda', cityId: 'hyderabad', tvSize: '43 inch', screens: 5, images: [], orientation: 'horizontal', status: 'available' },

    // ===== SECUNDERABAD =====
    { id: 'l58', name: 'Telangana Spice Kitchen', areaId: 'secunderabad', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l59', name: 'Verandah By TSK', areaId: 'secunderabad', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== FINANCIAL DISTRICT, KOKAPET =====
    { id: 'l69', name: 'Naughty Kodi', areaId: 'financial-dist-kokapet', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l70', name: 'Insomnia', areaId: 'financial-dist-kokapet', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l71', name: 'Ko Ko Kai', areaId: 'financial-dist-kokapet', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l72', name: 'Jamming Goat', areaId: 'financial-dist-kokapet', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l73', name: 'Koki Coffee', areaId: 'financial-dist-kokapet', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l74', name: 'Asaa', areaId: 'financial-dist-kokapet', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== GACHIBOWLI, HITECH CITY =====
    { id: 'l75', name: 'Flechazo', areaId: 'gachibowli-hitech', cityId: 'hyderabad', tvSize: '43 inch', screens: 2, images: [], orientation: 'horizontal', status: 'available' },
    { id: 'l76', name: 'Koki Coffee', areaId: 'gachibowli-hitech', cityId: 'hyderabad', tvSize: '43 inch', screens: 1, images: [], orientation: 'horizontal', status: 'available' },

    // ===== CHITYALA =====
    { id: 'l82', name: 'Carnival', areaId: 'chityala', cityId: 'hyderabad', tvSize: '43 inch', screens: 3, images: [], orientation: 'horizontal', status: 'available' }
  ]
};

// ===== LOCAL STORAGE FUNCTIONS =====
function getData() {
  const currentVersion = 6;
  const stored = localStorage.getItem('kmedia_data');
  if (stored) {
    const data = JSON.parse(stored);
    if (!data.admin) {
      data.admin = DEFAULT_DATA.admin;
    }
    if (!data._version || data._version < currentVersion) {
      const freshData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      freshData._version = currentVersion;
      localStorage.setItem('kmedia_data', JSON.stringify(freshData));
      return freshData;
    }
    return data;
  }
  const freshData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  freshData._version = currentVersion;
  localStorage.setItem('kmedia_data', JSON.stringify(freshData));
  return freshData;
}

function saveData(data) {
  localStorage.setItem('kmedia_data', JSON.stringify(data));
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
