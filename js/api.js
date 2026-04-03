// Set this to your Google Apps Script web app URL after deployment.
// e.g. 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
//
// Apps Script note: doGet(e) receives query params via e.parameter.
// Implement routing on e.parameter.action in your Apps Script,
// matching the action names used below.
const API_BASE = 'https://script.google.com/macros/s/AKfycbxDH2r2BV2-BpSFknc8Zfm6P56l7H0tpY7m-wC-g3bfHwL5SSJQk7PIBE95rO8P5AuMqg/exec';

async function apiFetch(params) {
  if (!API_BASE) throw new Error('API_BASE is not configured in js/api.js.');
  const url = API_BASE + '?' + new URLSearchParams(params).toString();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getTrips() {
  return apiFetch({ action: 'getTrips' });
}

export async function getDestinations(tripId) {
  return apiFetch({ action: 'getDestinations', trip_id: tripId });
}

export async function getMaps(tripId) {
  return apiFetch({ action: 'getMaps', trip_id: tripId });
}

export async function getItinerary(tripId) {
  return apiFetch({ action: 'getItinerary', trip_id: tripId });
}
