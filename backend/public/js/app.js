// ===== STATE =====
let appData = { cities: [], areas: [], locations: [], settings: {} };
let isAdmin = false;
let selectedLocations = new Set();
let editingLocationId = null;
let currentCity = null;
let baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');

// ===== INIT =====
async function init() {
  try {
    const [cities, areas, settings] = await Promise.all([
      apiGetCities(),
      apiGetAreas(),
      apiGetSettings()
    ]);
    appData.cities = cities;
    appData.areas = areas;
    appData.settings = settings;
  } catch (e) {
    console.error('Backend not available, using local data');
    appData = getData();
  }

  const params = new URLSearchParams(window.location.search);
  const cityParam = params.get('city');
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const citySlug = cityParam || hash || 'hyderabad';

  const city = appData.cities.find(c => slugify(c.name) === citySlug || c.id === citySlug);
  currentCity = city || appData.cities[0] || { id: 'hyderabad', name: 'Hyderabad' };

  document.getElementById('cityName').textContent = currentCity.name;
  document.title = `K Media DOOH — ${currentCity.name}`;

  if (slugify(currentCity.name) === 'hyderabad' || currentCity.id === 'hyderabad') {
    document.getElementById('adminLoginBtn').style.display = 'inline-block';
  }

  // Load city locations
  try {
    appData.locations = await apiGetLocations(currentCity.id);
  } catch (e) {
    appData.locations = (getData()).locations.filter(l => l.cityId === currentCity.id);
  }

  renderAdSpecs();
  renderLocations();
  populateAreaFilter();

  // Check if already logged in
  const tokenValid = await apiVerifyToken();
  if (tokenValid && (currentCity.id === 'hyderabad')) {
    isAdmin = true;
    document.getElementById('adminBar').style.display = 'block';
    document.getElementById('adminLoginBtn').style.display = 'none';
    renderLocations();
  }
}

// ===== RENDER AD SPECS =====
function renderAdSpecs() {
  const s = appData.settings;
  const cards = document.querySelectorAll('.spec-card p');
  if (cards.length >= 4) {
    cards[0].textContent = s.adSpecs_video || s.adSpecs?.video || 'MP4';
    cards[1].textContent = s.adSpecs_image || s.adSpecs?.image || 'JPG, JPEG';
    cards[2].textContent = s.adSpecs_resolution || s.adSpecs?.resolution || '1920x1080';
    cards[3].textContent = s.adSpecs_duration || s.adSpecs?.duration || '15 sec';
  }
}

// ===== RENDER LOCATIONS =====
function renderLocations() {
  const container = document.getElementById('locationsContainer');
  const cityLocations = appData.locations;
  const cityAreas = appData.areas.filter(a => a.cityId === currentCity.id);

  if (cityLocations.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#666;padding:40px 0;">No locations available in this city yet.</p>';
    return;
  }

  let html = '';
  cityAreas.forEach(area => {
    const areaLocations = cityLocations.filter(l => l.areaId === area.id);
    if (areaLocations.length === 0) return;

    html += `<div class="area-group">
      <div class="area-title"><i class="fas fa-map-pin"></i> ${area.name}</div>
      <div class="locations-grid">`;

    areaLocations.forEach(loc => {
      const isSelected = selectedLocations.has(loc.id);
      const isBooked = loc.status === 'booked';

      html += `<div class="location-card ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}"
                    onclick="${isBooked && !isAdmin ? '' : `toggleLocation('${loc.id}')`}"
                    id="card-${loc.id}">
        <div class="card-image-container">
          ${renderCardImages(loc)}
          <span class="status-badge ${loc.status}">${loc.status === 'available' ? 'Available' : 'Booked'}</span>
          ${!isBooked || isAdmin ? `<div class="card-checkbox">${isSelected ? '<i class="fas fa-check"></i>' : ''}</div>` : ''}
        </div>
        <div class="card-body">
          <div class="card-name">${loc.name}</div>
          <div class="card-area"><i class="fas fa-map-marker-alt"></i> ${area.name}</div>
          <div class="card-details">
            <div class="card-detail"><i class="fas fa-tv"></i> ${loc.tvSize}</div>
            <div class="card-detail"><i class="fas fa-clone"></i> ${loc.screens} Screen${loc.screens > 1 ? 's' : ''}</div>
            <div class="card-detail"><i class="fas fa-mobile-alt${loc.orientation === 'horizontal' ? ' fa-rotate-90' : ''}"></i> ${loc.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</div>
          </div>
          ${isAdmin ? renderAdminActions(loc) : ''}
        </div>
      </div>`;
    });

    html += '</div></div>';
  });

  container.innerHTML = html;
  initSliders();
}

function renderCardImages(loc) {
  const images = loc.images || [];
  if (images.length === 0) {
    return '<div class="no-image"><i class="fas fa-tv"></i></div>';
  }

  const imgSrc = (src) => {
    if (!src) return src;
    if (src.startsWith('/uploads')) {
      return (window.location.protocol === 'file:' || window.location.hostname === 'localhost') ? `http://localhost:5001${src}` : src;
    }
    return src;
  };

  if (images.length === 1) {
    return `<img class="card-image" src="${imgSrc(images[0])}" alt="${loc.name}">`;
  }

  let dotsHtml = '';
  let imgsHtml = '';
  images.forEach((img, i) => {
    imgsHtml += `<img src="${imgSrc(img)}" alt="${loc.name}" class="${i === 0 ? 'active' : ''}" data-index="${i}">`;
    dotsHtml += `<button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="event.stopPropagation(); slideTo('${loc.id}', ${i})"></button>`;
  });

  return `<div class="card-image-slider" data-location="${loc.id}">
    ${imgsHtml}
    <div class="slider-dots">${dotsHtml}</div>
  </div>`;
}

function initSliders() {
  document.querySelectorAll('.card-image-slider').forEach(slider => {
    const locId = slider.dataset.location;
    let current = 0;
    const images = slider.querySelectorAll('img');
    if (images.length <= 1) return;

    setInterval(() => {
      current = (current + 1) % images.length;
      slideTo(locId, current);
    }, 3000);
  });
}

function slideTo(locId, index) {
  const slider = document.querySelector(`.card-image-slider[data-location="${locId}"]`);
  if (!slider) return;

  slider.querySelectorAll('img').forEach((img, i) => {
    img.classList.toggle('active', i === index);
  });
  slider.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function renderAdminActions(loc) {
  return `<div class="card-admin-actions">
    <button class="edit-btn" onclick="event.stopPropagation(); editLocation('${loc.id}')"><i class="fas fa-edit"></i> Edit</button>
    <button class="toggle-status-btn" onclick="event.stopPropagation(); toggleStatus('${loc.id}')">
      <i class="fas fa-toggle-on"></i> ${loc.status === 'available' ? 'Mark Booked' : 'Mark Available'}
    </button>
    <button class="delete-btn" onclick="event.stopPropagation(); deleteLocation('${loc.id}')"><i class="fas fa-trash"></i> Delete</button>
  </div>`;
}

// ===== TOGGLE LOCATION SELECTION =====
function toggleLocation(id) {
  if (selectedLocations.has(id)) {
    selectedLocations.delete(id);
  } else {
    selectedLocations.add(id);
  }

  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.toggle('selected');
    const checkbox = card.querySelector('.card-checkbox');
    if (checkbox) {
      checkbox.innerHTML = selectedLocations.has(id) ? '<i class="fas fa-check"></i>' : '';
    }
  }

  updateFloatingBar();
}

function updateFloatingBar() {
  const bar = document.getElementById('floatingBar');
  const count = selectedLocations.size;

  if (count > 0) {
    bar.style.display = 'flex';
    document.getElementById('selectedCount').textContent = `${count} location${count > 1 ? 's' : ''} selected`;
  } else {
    bar.style.display = 'none';
  }
}

// ===== REVIEW PAGE =====
function goToReview() {
  if (selectedLocations.size === 0) return;

  document.getElementById('locationsSection').style.display = 'none';
  document.getElementById('adSpecs').style.display = 'none';
  document.getElementById('floatingBar').style.display = 'none';
  document.getElementById('reviewPage').style.display = 'block';

  const container = document.getElementById('selectedLocationsList');
  let html = '';

  const imgSrc = (src) => src && src.startsWith('/uploads') ? `http://localhost:5001${src}` : src;

  selectedLocations.forEach(id => {
    const loc = appData.locations.find(l => l.id === id);
    if (!loc) return;
    const area = appData.areas.find(a => a.id === loc.areaId);

    const firstImg = loc.images && loc.images.length > 0 ? loc.images[0] : '';
    const imgTag = firstImg
      ? `<img src="${imgSrc(firstImg)}" alt="${loc.name}">`
      : `<div style="width:80px;height:60px;background:#FFF3E8;display:flex;align-items:center;justify-content:center;border-radius:6px;color:#E8872B;"><i class="fas fa-tv"></i></div>`;

    html += `<div class="review-location-card" id="review-${loc.id}">
      ${imgTag}
      <div class="review-card-info">
        <h4>${loc.name}</h4>
        <p><i class="fas fa-map-marker-alt"></i> ${area ? area.name : ''} &nbsp; <i class="fas fa-tv"></i> ${loc.tvSize} &nbsp; <i class="fas fa-clone"></i> ${loc.screens} Screen${loc.screens > 1 ? 's' : ''} &nbsp; <i class="fas fa-mobile-alt"></i> ${loc.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</p>
      </div>
      <button class="review-delete-btn" onclick="removeFromReview('${loc.id}')" title="Remove">
        <i class="fas fa-times"></i>
      </button>
    </div>`;
  });

  html += `<button class="clear-all-btn" onclick="clearAllSelections()"><i class="fas fa-trash"></i> Clear All Selections</button>`;

  container.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removeFromReview(id) {
  selectedLocations.delete(id);
  const card = document.getElementById(`review-${id}`);
  if (card) card.remove();

  const mainCard = document.getElementById(`card-${id}`);
  if (mainCard) {
    mainCard.classList.remove('selected');
    const checkbox = mainCard.querySelector('.card-checkbox');
    if (checkbox) checkbox.innerHTML = '';
  }

  if (selectedLocations.size === 0) {
    goBackToLocations();
  }
}

function clearAllSelections() {
  if (!confirm('Remove all selected locations?')) return;

  selectedLocations.forEach(id => {
    const mainCard = document.getElementById(`card-${id}`);
    if (mainCard) {
      mainCard.classList.remove('selected');
      const checkbox = mainCard.querySelector('.card-checkbox');
      if (checkbox) checkbox.innerHTML = '';
    }
  });

  selectedLocations.clear();
  goBackToLocations();
}

function goBackToLocations() {
  document.getElementById('reviewPage').style.display = 'none';
  document.getElementById('locationsSection').style.display = 'block';
  document.getElementById('adSpecs').style.display = 'block';
  updateFloatingBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== WHATSAPP =====
function sendToWhatsApp() {
  const companyName = document.getElementById('companyName').value.trim();
  const gstNumber = document.getElementById('gstNumber').value.trim();
  const contactPerson = document.getElementById('contactPerson').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();
  const email = document.getElementById('emailAddress').value.trim();

  if (!companyName || !gstNumber || !contactPerson || !phone || !email) {
    showToast('Please fill in all fields');
    return;
  }

  let message = `*K MEDIA DOOH — Location Inquiry*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `*City:* ${currentCity.name}\n\n`;
  message += `*Selected Locations:*\n`;

  let count = 1;
  selectedLocations.forEach(id => {
    const loc = appData.locations.find(l => l.id === id);
    if (!loc) return;
    const area = appData.areas.find(a => a.id === loc.areaId);

    message += `\n${count}. *${loc.name}*\n`;
    message += `   📍 ${area ? area.name : ''}\n`;
    message += `   📺 ${loc.tvSize} | ${loc.screens} Screen${loc.screens > 1 ? 's' : ''}\n`;
    count++;
  });

  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `*Customer Details:*\n\n`;
  message += `🏢 *Company:* ${companyName}\n`;
  message += `📋 *GST No:* ${gstNumber}\n`;
  message += `👤 *Contact:* ${contactPerson}\n`;
  message += `📱 *Phone:* ${phone}\n`;
  message += `📧 *Email:* ${email}\n`;
  message += `\n━━━━━━━━━━━━━━━━━━`;

  const cityWhatsapp = currentCity.whatsappNumber || appData.settings.whatsappNumber || '919876543210';

  const pdfDoc = generatePDFDoc(companyName, gstNumber, contactPerson, phone, email);
  const pdfBlob = pdfDoc.output('blob');
  const pdfFileName = `KMedia_${currentCity.name}_${companyName.replace(/\s+/g, '_')}.pdf`;
  const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });

  // Try sharing PDF directly (works on mobile)
  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    navigator.share({
      files: [pdfFile],
      title: 'K Media DOOH — Location Inquiry'
    }).catch(() => {
      // If share cancelled, just download PDF
      pdfDoc.save(pdfFileName);
      showToast('PDF downloaded');
    });
  } else {
    // Desktop: download PDF and open WhatsApp without text
    pdfDoc.save(pdfFileName);
    showToast('PDF downloaded — send it on WhatsApp');
    setTimeout(() => {
      window.open(`https://wa.me/${cityWhatsapp}`);
    }, 500);
  }
}

// ===== PDF GENERATION =====
function generatePDFDoc(companyName, gstNumber, contactPerson, phone, email) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFillColor(232, 135, 43);
  doc.rect(0, 0, pageWidth, 40, 'F');

  if (typeof logoBase64 !== 'undefined' && logoBase64) {
    try { doc.addImage(logoBase64, 'JPEG', 8, 4, 32, 32); } catch(e) {}
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('K MEDIA DOOH', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Digital Advertising Across Fine Dining Restaurants', pageWidth / 2, 28, { align: 'center' });
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(currentCity.name.toUpperCase(), pageWidth / 2, 36, { align: 'center' });

  y = 50;

  doc.setTextColor(232, 135, 43);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Selected Locations', 14, y);
  y += 3;
  doc.setDrawColor(232, 135, 43);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  doc.setFillColor(245, 245, 245);
  doc.rect(14, y - 5, pageWidth - 28, 10, 'F');
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('S.No', 18, y);
  doc.text('Location Name', 35, y);
  doc.text('Area', 100, y);
  doc.text('Total Screens', 138, y);
  doc.text('Orientation', 170, y);
  y += 8;

  let count = 1;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  selectedLocations.forEach(id => {
    const loc = appData.locations.find(l => l.id === id);
    if (!loc) return;
    const area = appData.areas.find(a => a.id === loc.areaId);

    if (y > 260) { doc.addPage(); y = 20; }

    if (count % 2 === 0) {
      doc.setFillColor(255, 243, 232);
      doc.rect(14, y - 5, pageWidth - 28, 8, 'F');
    }

    doc.setFontSize(9);
    doc.text(String(count), 20, y);
    doc.text(loc.name, 35, y);
    doc.text(area ? area.name : '', 100, y);
    doc.text(String(loc.screens), 148, y);
    doc.text(loc.orientation === 'horizontal' ? 'Horizontal' : 'Vertical', 170, y);
    y += 8;
    count++;
  });

  y += 5;
  doc.setDrawColor(232, 135, 43);
  doc.line(14, y, pageWidth - 14, y);
  y += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 135, 43);
  doc.text(`Total Locations: ${selectedLocations.size}`, 14, y);
  const totalScreens = Array.from(selectedLocations).reduce((sum, id) => {
    const loc = appData.locations.find(l => l.id === id);
    return sum + (loc ? loc.screens : 0);
  }, 0);
  doc.text(`Total Screens: ${totalScreens}`, 100, y);
  y += 15;

  if (y > 230) { doc.addPage(); y = 20; }

  doc.setFillColor(232, 135, 43);
  doc.rect(14, y - 5, pageWidth - 28, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Details', 18, y + 1);
  y += 15;

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);

  const details = [
    ['Company Name', companyName],
    ['GST Number', gstNumber],
    ['Contact Person', contactPerson],
    ['Phone Number', phone],
    ['Email', email]
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 18, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, y);
    y += 9;
  });

  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by K Media DOOH', pageWidth / 2, y, { align: 'center' });
  doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), pageWidth / 2, y + 5, { align: 'center' });

  return doc;
}

function downloadPDF() {
  const companyName = document.getElementById('companyName').value.trim();
  const gstNumber = document.getElementById('gstNumber').value.trim();
  const contactPerson = document.getElementById('contactPerson').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();
  const email = document.getElementById('emailAddress').value.trim();

  if (!companyName || !gstNumber || !contactPerson || !phone || !email) {
    showToast('Please fill in all fields');
    return;
  }

  const doc = generatePDFDoc(companyName, gstNumber, contactPerson, phone, email);
  doc.save(`KMedia_${currentCity.name}_${companyName.replace(/\s+/g, '_')}.pdf`);
  showToast('PDF downloaded');
}

// ===== ADMIN LOGIN =====
async function adminLogin() {
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  const result = await apiLogin(username, password);

  if (result.success) {
    isAdmin = true;
    closeModal('loginModal');
    document.getElementById('adminBar').style.display = 'block';
    document.getElementById('adminLoginBtn').style.display = 'none';
    renderLocations();
    showToast('Logged in as Admin');
  } else {
    showToast('Invalid username or password');
  }
}

function logout() {
  isAdmin = false;
  apiLogout();
  document.getElementById('adminBar').style.display = 'none';
  document.getElementById('adminLoginBtn').style.display = 'inline-block';
  renderLocations();
  showToast('Logged out');
}

document.getElementById('adminLoginBtn').addEventListener('click', () => {
  document.getElementById('loginModal').style.display = 'flex';
});

// ===== DASHBOARD =====
async function openDashboard() {
  let allLocations;
  try { allLocations = await apiGetLocations(); } catch { allLocations = appData.locations; }

  const totalCities = appData.cities.length;
  const totalLocations = allLocations.length;
  const totalScreens = allLocations.reduce((sum, l) => sum + l.screens, 0);
  const available = allLocations.filter(l => l.status === 'available').length;
  const booked = allLocations.filter(l => l.status === 'booked').length;

  document.getElementById('dashboardStats').innerHTML = `
    <div class="dashboard-card"><div class="number">${totalCities}</div><div class="label">Cities</div></div>
    <div class="dashboard-card"><div class="number">${totalLocations}</div><div class="label">Locations</div></div>
    <div class="dashboard-card"><div class="number">${totalScreens}</div><div class="label">Total Screens</div></div>
    <div class="dashboard-card"><div class="number">${available}</div><div class="label">Available</div></div>
    <div class="dashboard-card"><div class="number">${booked}</div><div class="label">Booked</div></div>
  `;
  document.getElementById('dashboardModal').style.display = 'flex';
}

// ===== MANAGE CITIES =====
function openManageCities() {
  renderCitiesList();
  document.getElementById('citiesModal').style.display = 'flex';
}

function renderCitiesList() {
  const container = document.getElementById('citiesList');
  let html = '';
  appData.cities.forEach(city => {
    const cityLink = `${baseUrl}?city=${slugify(city.name)}`;
    html += `<div class="manage-item">
      <span>${city.name} <small style="color:#666;font-weight:400;">— WA: ${city.whatsappNumber || 'Not set'}</small></span>
      <div class="manage-item-actions">
        <button class="link-action" onclick="copyToClipboard('${cityLink}')" title="Copy Link"><i class="fas fa-link"></i></button>
        <button class="edit-action" onclick="editCity('${city.id}')" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="delete-action" onclick="deleteCity('${city.id}')" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  });
  container.innerHTML = html;
}

async function addCity() {
  const name = document.getElementById('newCityName').value.trim();
  const whatsapp = document.getElementById('newCityWhatsapp').value.trim();
  if (!name) return showToast('Enter city name');
  if (!whatsapp) return showToast('Enter WhatsApp number');

  const id = slugify(name);
  await apiAddCity(id, name, whatsapp);
  appData.cities = await apiGetCities();
  document.getElementById('newCityName').value = '';
  document.getElementById('newCityWhatsapp').value = '';
  renderCitiesList();
  showToast(`${name} added`);
}

async function editCity(id) {
  const city = appData.cities.find(c => c.id === id);
  if (!city) return;

  const newName = prompt('Edit city name:', city.name);
  if (!newName || newName.trim() === '') return;

  const newWhatsapp = prompt('Edit WhatsApp number:', city.whatsappNumber || '');

  await apiEditCity(id, newName.trim(), newWhatsapp ? newWhatsapp.trim() : city.whatsappNumber);
  appData.cities = await apiGetCities();
  if (currentCity.id === id) currentCity = appData.cities.find(c => c.id === id);
  renderCitiesList();
  showToast('City updated');
}

async function deleteCity(id) {
  if (id === 'hyderabad') return showToast('Cannot delete headquarters city');
  if (!confirm('Delete this city and all its areas & locations?')) return;

  await apiDeleteCity(id);
  appData.cities = await apiGetCities();
  appData.areas = await apiGetAreas();
  renderCitiesList();
  showToast('City deleted');
}

// ===== MANAGE AREAS =====
function openManageAreas() {
  updateAreaCitySelect();
  renderAreasList();
  document.getElementById('areasModal').style.display = 'flex';
}

function updateAreaCitySelect() {
  const select = document.getElementById('areaCitySelect');
  select.innerHTML = appData.cities.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function renderAreasList() {
  const container = document.getElementById('areasList');
  let html = '';
  appData.cities.forEach(city => {
    const cityAreas = appData.areas.filter(a => a.cityId === city.id);
    if (cityAreas.length === 0) return;

    html += `<div style="margin-top:10px;"><strong style="color:#E8872B;">${city.name}</strong></div>`;
    cityAreas.forEach(area => {
      html += `<div class="manage-item">
        <span>${area.name}</span>
        <div class="manage-item-actions">
          <button class="edit-action" onclick="editArea('${area.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="delete-action" onclick="deleteArea('${area.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
    });
  });
  container.innerHTML = html || '<p style="color:#666;text-align:center;padding:20px;">No areas added yet</p>';
}

async function addArea() {
  const cityId = document.getElementById('areaCitySelect').value;
  const name = document.getElementById('newAreaName').value.trim();
  if (!name) return showToast('Enter area name');

  const id = generateId();
  await apiAddArea(id, name, cityId);
  appData.areas = await apiGetAreas();
  document.getElementById('newAreaName').value = '';
  renderAreasList();
  renderLocations();
  populateAreaFilter();
  showToast(`${name} added`);
}

async function editArea(id) {
  const area = appData.areas.find(a => a.id === id);
  if (!area) return;

  const newName = prompt('Edit area name:', area.name);
  if (!newName || newName.trim() === '') return;

  await apiEditArea(id, newName.trim());
  appData.areas = await apiGetAreas();
  renderAreasList();
  renderLocations();
  populateAreaFilter();
  showToast('Area updated');
}

async function deleteArea(id) {
  if (!confirm('Delete this area and all its locations?')) return;

  await apiDeleteArea(id);
  appData.areas = await apiGetAreas();
  appData.locations = await apiGetLocations(currentCity.id);
  renderAreasList();
  renderLocations();
  populateAreaFilter();
  showToast('Area deleted');
}

// ===== ADD / EDIT LOCATION =====
function openAddLocation() {
  editingLocationId = null;
  document.getElementById('locationModalTitle').innerHTML = '<i class="fas fa-plus"></i> Add Location';
  document.getElementById('locName').value = '';
  document.getElementById('locTvSize').value = '';
  document.getElementById('locScreens').value = '';
  document.getElementById('locStatus').value = 'available';
  document.getElementById('locOrientation').value = 'horizontal';
  document.getElementById('locImages').value = '';
  document.getElementById('imagePreview').innerHTML = '';

  updateLocCityOptions();
  document.getElementById('locationModal').style.display = 'flex';
}

function updateLocCityOptions() {
  const select = document.getElementById('locCitySelect');
  select.innerHTML = appData.cities.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  updateLocAreaOptions();
}

function updateLocAreaOptions() {
  const cityId = document.getElementById('locCitySelect').value;
  const select = document.getElementById('locAreaSelect');
  const cityAreas = appData.areas.filter(a => a.cityId === cityId);
  select.innerHTML = cityAreas.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

  if (cityAreas.length === 0) {
    select.innerHTML = '<option value="">No areas in this city</option>';
  }
}

function editLocation(id) {
  const loc = appData.locations.find(l => l.id === id);
  if (!loc) return;

  editingLocationId = id;
  document.getElementById('locationModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Location';

  updateLocCityOptions();
  document.getElementById('locCitySelect').value = loc.cityId;
  updateLocAreaOptions();
  document.getElementById('locAreaSelect').value = loc.areaId;
  document.getElementById('locName').value = loc.name;
  document.getElementById('locTvSize').value = loc.tvSize;
  document.getElementById('locScreens').value = loc.screens;
  document.getElementById('locStatus').value = loc.status;
  document.getElementById('locOrientation').value = loc.orientation || 'horizontal';

  const preview = document.getElementById('imagePreview');
  preview.innerHTML = '';
  if (loc.images) {
    loc.images.forEach(img => {
      const src = img.startsWith('/uploads') ? `http://localhost:5001${img}` : img;
      preview.innerHTML += `<img src="${src}" alt="preview">`;
    });
  }

  document.getElementById('locationModal').style.display = 'flex';
}

async function saveLocation() {
  const cityId = document.getElementById('locCitySelect').value;
  const areaId = document.getElementById('locAreaSelect').value;
  const name = document.getElementById('locName').value.trim();
  const tvSize = document.getElementById('locTvSize').value.trim();
  const screens = parseInt(document.getElementById('locScreens').value) || 0;
  const status = document.getElementById('locStatus').value;
  const orientation = document.getElementById('locOrientation').value;

  if (!name || !tvSize || !screens || !areaId) {
    return showToast('Please fill all fields');
  }

  const fileInput = document.getElementById('locImages');
  const files = fileInput.files;

  if (editingLocationId) {
    await apiEditLocation(editingLocationId, { name, areaId, cityId, tvSize, screens, orientation, status });
    if (files.length > 0) {
      await apiUploadImages(editingLocationId, files, true);
    }
    showToast('Location updated');
  } else {
    const id = generateId();
    await apiAddLocation({ id, name, areaId, cityId, tvSize, screens, orientation, status });
    if (files.length > 0) {
      await apiUploadImages(id, files, false);
    }
    showToast('Location added');
  }

  appData.locations = await apiGetLocations(currentCity.id);
  closeModal('locationModal');
  renderLocations();
}

// ===== TOGGLE STATUS =====
async function toggleStatus(id) {
  const loc = appData.locations.find(l => l.id === id);
  if (!loc) return;

  const newStatus = loc.status === 'available' ? 'booked' : 'available';
  await apiToggleStatus(id, newStatus);
  appData.locations = await apiGetLocations(currentCity.id);
  renderLocations();
  showToast(`${loc.name} marked as ${newStatus}`);
}

// ===== DELETE LOCATION =====
async function deleteLocation(id) {
  if (!confirm('Delete this location?')) return;

  await apiDeleteLocation(id);
  selectedLocations.delete(id);
  appData.locations = await apiGetLocations(currentCity.id);
  renderLocations();
  updateFloatingBar();
  showToast('Location deleted');
}

// ===== SETTINGS =====
function openSettings() {
  const s = appData.settings;
  document.getElementById('whatsappNumber').value = s.whatsappNumber || '';
  document.getElementById('specVideo').value = s.adSpecs_video || s.adSpecs?.video || '';
  document.getElementById('specImage').value = s.adSpecs_image || s.adSpecs?.image || '';
  document.getElementById('specResolution').value = s.adSpecs_resolution || s.adSpecs?.resolution || '';
  document.getElementById('specDuration').value = s.adSpecs_duration || s.adSpecs?.duration || '';
  document.getElementById('settingsModal').style.display = 'flex';
}

async function saveSettings() {
  const settings = {
    whatsappNumber: document.getElementById('whatsappNumber').value.trim(),
    adSpecs_video: document.getElementById('specVideo').value.trim(),
    adSpecs_image: document.getElementById('specImage').value.trim(),
    adSpecs_resolution: document.getElementById('specResolution').value.trim(),
    adSpecs_duration: document.getElementById('specDuration').value.trim()
  };

  await apiSaveSettings(settings);
  appData.settings = await apiGetSettings();
  renderAdSpecs();
  closeModal('settingsModal');
  showToast('Settings saved');
}

// ===== QR CODES =====
function openQRCodes() {
  const container = document.getElementById('qrCodesList');
  container.innerHTML = '';

  appData.cities.forEach(city => {
    const cityLink = `${window.location.origin}${window.location.pathname}?city=${slugify(city.name)}`;
    const div = document.createElement('div');
    div.className = 'qr-item';
    div.innerHTML = `<h4>${city.name}</h4><div id="qr-${city.id}"></div>
      <p style="font-size:0.75rem;color:#666;margin-top:8px;word-break:break-all;">${cityLink}</p>
      <button class="download-qr" onclick="downloadQR('${city.id}', '${city.name}')"><i class="fas fa-download"></i> Download</button>`;
    container.appendChild(div);

    setTimeout(() => {
      const qrContainer = document.getElementById(`qr-${city.id}`);
      if (qrContainer) {
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
          text: cityLink,
          width: 150,
          height: 150,
          colorDark: '#1A1A1A',
          colorLight: '#FFFFFF'
        });
      }
    }, 100);
  });

  document.getElementById('qrModal').style.display = 'flex';
}

function downloadQR(cityId, cityName) {
  const qrContainer = document.getElementById(`qr-${cityId}`);
  const canvas = qrContainer.querySelector('canvas');
  if (!canvas) return showToast('QR not generated yet');

  const link = document.createElement('a');
  link.download = `KMedia_QR_${cityName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast(`QR code for ${cityName} downloaded`);
}

// ===== SEARCH & FILTER =====
function populateAreaFilter() {
  const select = document.getElementById('areaFilter');
  const cityAreas = appData.areas.filter(a => a.cityId === currentCity.id);
  let html = '<option value="all">All Areas</option>';
  cityAreas.forEach(area => {
    html += `<option value="${area.id}">${area.name}</option>`;
  });
  select.innerHTML = html;
}

function filterLocations() {
  const searchText = document.getElementById('searchInput').value.toLowerCase().trim();
  const areaFilter = document.getElementById('areaFilter').value;

  const cityLocations = appData.locations;
  const cityAreas = appData.areas.filter(a => a.cityId === currentCity.id);
  const container = document.getElementById('locationsContainer');

  let filtered = cityLocations;

  if (areaFilter !== 'all') {
    filtered = filtered.filter(l => l.areaId === areaFilter);
  }

  if (searchText) {
    filtered = filtered.filter(l => l.name.toLowerCase().includes(searchText));
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#666;padding:40px 0;">No locations found matching your search.</p>';
    return;
  }

  let html = '';
  const relevantAreas = areaFilter !== 'all'
    ? cityAreas.filter(a => a.id === areaFilter)
    : cityAreas;

  relevantAreas.forEach(area => {
    const areaLocations = filtered.filter(l => l.areaId === area.id);
    if (areaLocations.length === 0) return;

    html += `<div class="area-group">
      <div class="area-title"><i class="fas fa-map-pin"></i> ${area.name}</div>
      <div class="locations-grid">`;

    areaLocations.forEach(loc => {
      const isSelected = selectedLocations.has(loc.id);
      const isBooked = loc.status === 'booked';

      html += `<div class="location-card ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}"
                    onclick="${isBooked && !isAdmin ? '' : `toggleLocation('${loc.id}')`}"
                    id="card-${loc.id}">
        <div class="card-image-container">
          ${renderCardImages(loc)}
          <span class="status-badge ${loc.status}">${loc.status === 'available' ? 'Available' : 'Booked'}</span>
          ${!isBooked || isAdmin ? `<div class="card-checkbox">${isSelected ? '<i class="fas fa-check"></i>' : ''}</div>` : ''}
        </div>
        <div class="card-body">
          <div class="card-name">${loc.name}</div>
          <div class="card-area"><i class="fas fa-map-marker-alt"></i> ${area.name}</div>
          <div class="card-details">
            <div class="card-detail"><i class="fas fa-tv"></i> ${loc.tvSize}</div>
            <div class="card-detail"><i class="fas fa-clone"></i> ${loc.screens} Screen${loc.screens > 1 ? 's' : ''}</div>
            <div class="card-detail"><i class="fas fa-mobile-alt${loc.orientation === 'horizontal' ? ' fa-rotate-90' : ''}"></i> ${loc.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</div>
          </div>
          ${isAdmin ? renderAdminActions(loc) : ''}
        </div>
      </div>`;
    });

    html += '</div></div>';
  });

  container.innerHTML = html;
  initSliders();
}

// ===== UTILITY =====
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Link copied to clipboard');
  }).catch(() => {
    prompt('Copy this link:', text);
  });
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
    }
  });
});

// Image preview on file select
document.getElementById('locImages').addEventListener('change', function() {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = '';
  Array.from(this.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML += `<img src="${e.target.result}" alt="preview">`;
    };
    reader.readAsDataURL(file);
  });
});

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hide');
  }, 1500);
});

// ===== START =====
init();
