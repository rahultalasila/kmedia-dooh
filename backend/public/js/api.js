// ===== API CONFIG =====
const API_BASE = window.location.hostname === 'localhost' || window.location.protocol === 'file:'
  ? 'http://localhost:5001/api'
  : '/api';
let authToken = localStorage.getItem('kmedia_token') || null;

function getHeaders(json = true) {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  return headers;
}

// ===== AUTH =====
async function apiLogin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.success) {
    authToken = data.token;
    localStorage.setItem('kmedia_token', authToken);
  }
  return data;
}

async function apiVerifyToken() {
  if (!authToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/verify`, { headers: getHeaders() });
    const data = await res.json();
    return data.success;
  } catch { return false; }
}

function apiLogout() {
  authToken = null;
  localStorage.removeItem('kmedia_token');
}

// ===== CITIES =====
async function apiGetCities() {
  const res = await fetch(`${API_BASE}/cities`);
  return res.json();
}

async function apiAddCity(id, name, whatsappNumber) {
  const res = await fetch(`${API_BASE}/cities`, {
    method: 'POST', headers: getHeaders(),
    body: JSON.stringify({ id, name, whatsappNumber })
  });
  return res.json();
}

async function apiEditCity(id, name, whatsappNumber) {
  const res = await fetch(`${API_BASE}/cities/${id}`, {
    method: 'PUT', headers: getHeaders(),
    body: JSON.stringify({ name, whatsappNumber })
  });
  return res.json();
}

async function apiDeleteCity(id) {
  const res = await fetch(`${API_BASE}/cities/${id}`, {
    method: 'DELETE', headers: getHeaders()
  });
  return res.json();
}

// ===== AREAS =====
async function apiGetAreas(cityId) {
  const url = cityId ? `${API_BASE}/areas?cityId=${cityId}` : `${API_BASE}/areas`;
  const res = await fetch(url);
  return res.json();
}

async function apiAddArea(id, name, cityId) {
  const res = await fetch(`${API_BASE}/areas`, {
    method: 'POST', headers: getHeaders(),
    body: JSON.stringify({ id, name, cityId })
  });
  return res.json();
}

async function apiEditArea(id, name) {
  const res = await fetch(`${API_BASE}/areas/${id}`, {
    method: 'PUT', headers: getHeaders(),
    body: JSON.stringify({ name })
  });
  return res.json();
}

async function apiDeleteArea(id) {
  const res = await fetch(`${API_BASE}/areas/${id}`, {
    method: 'DELETE', headers: getHeaders()
  });
  return res.json();
}

// ===== LOCATIONS =====
async function apiGetLocations(cityId) {
  const url = cityId ? `${API_BASE}/locations?cityId=${cityId}` : `${API_BASE}/locations`;
  const res = await fetch(url);
  return res.json();
}

async function apiAddLocation(loc) {
  const res = await fetch(`${API_BASE}/locations`, {
    method: 'POST', headers: getHeaders(),
    body: JSON.stringify(loc)
  });
  return res.json();
}

async function apiEditLocation(id, loc) {
  const res = await fetch(`${API_BASE}/locations/${id}`, {
    method: 'PUT', headers: getHeaders(),
    body: JSON.stringify(loc)
  });
  return res.json();
}

async function apiToggleStatus(id, status) {
  const res = await fetch(`${API_BASE}/locations/${id}/status`, {
    method: 'PUT', headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  return res.json();
}

async function apiDeleteLocation(id) {
  const res = await fetch(`${API_BASE}/locations/${id}`, {
    method: 'DELETE', headers: getHeaders()
  });
  return res.json();
}

// ===== UPLOAD =====
async function apiUploadImages(locationId, files, clearExisting) {
  const formData = new FormData();
  if (clearExisting) formData.append('clearExisting', 'true');
  Array.from(files).forEach(f => formData.append('images', f));

  const res = await fetch(`${API_BASE}/upload/${locationId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` },
    body: formData
  });
  return res.json();
}

// ===== SETTINGS =====
async function apiGetSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

async function apiSaveSettings(settings) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT', headers: getHeaders(),
    body: JSON.stringify(settings)
  });
  return res.json();
}
