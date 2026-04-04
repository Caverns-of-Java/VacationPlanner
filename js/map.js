/**
 * Initialises a Leaflet map with OpenStreetMap tiles.
 * Requires Leaflet CSS + JS to be loaded in the page before this module runs.
 *
 * @param {string} containerId  ID of the DOM element to mount the map into
 * @param {number} lat          Initial latitude
 * @param {number} lng          Initial longitude
 * @param {number} [zoom=13]
 * @returns {L.Map}
 */
export function initStreetMap(containerId, lat, lng, zoom = 13) {
  const map = L.map(containerId).setView([lat, lng], zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);
  return map;
}

/**
 * Adds a marker for each destination that has lat/lng coordinates.
 * Binds a popup with the destination name and address.
 *
 * @param {L.Map}  map
 * @param {Array}  destinations
 */
export function addMarkers(map, destinations) {
  destinations.forEach(dest => {
    if (dest.lat && dest.lng) {
      L.marker([parseFloat(dest.lat), parseFloat(dest.lng)])
        .addTo(map)
        .bindPopup(
          `<strong>${dest.name}</strong>` +
          (dest.address ? `<br>${dest.address}` : '')
        );
    }
  });
}

/**
 * Renders a public transport map (image or PDF) into a container element.
 * PDFs are displayed in an <iframe>; everything else as an <img>.
 *
 * @param {string} containerId
 * @param {string} mediaUrl
 */
export function renderPTMap(containerId, mediaUrl) {
  const container = document.getElementById(containerId);
  if (!container || !mediaUrl) return;

  const embedUrl = getPdfEmbedUrl(mediaUrl);
  const isPdf = embedUrl.toLowerCase().includes('.pdf');
  if (isPdf) {
    container.innerHTML =
      `<iframe src="${embedUrl}" class="media-frame" title="Public Transport Map"></iframe>`;
  } else {
    container.innerHTML =
      `<img src="${embedUrl}" class="media-img" alt="Public Transport Map">`;
  }
}

/**
 * Returns the great-circle distance in kilometres between two coordinates
 * using the Haversine formula.
 */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Shows the user's current location on the map using the browser Geolocation API.
 * Adds a circle marker and an accuracy circle, then pans to the position.
 *
 * If `referencePoints` is provided (array of objects with lat/lng properties),
 * the marker is only shown when the user is within `maxDistanceKm` of at least
 * one reference point.
 *
 * @param {L.Map}    map
 * @param {Array}    [referencePoints]   Array of objects with lat & lng properties
 * @param {number}   [maxDistanceKm=30]
 */
export function showCurrentLocation(map, referencePoints = null, maxDistanceKm = 30) {
  map.locate({ setView: false, maxZoom: 16, enableHighAccuracy: true, timeout: 10000 });

  map.once('locationfound', e => {
    if (referencePoints && referencePoints.length > 0) {
      const nearby = referencePoints.some(p => {
        const lat = Number.parseFloat(p.lat);
        const lng = Number.parseFloat(p.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
        return haversineKm(e.latlng.lat, e.latlng.lng, lat, lng) <= maxDistanceKm;
      });
      if (!nearby) return;
    }

    L.circleMarker(e.latlng, {
      radius: 8,
      color: '#2563eb',
      fillColor: '#2563eb',
      fillOpacity: 0.9,
      weight: 2,
    })
      .addTo(map)
      .bindPopup('You are here')
      .openPopup();

    if (e.accuracy) {
      L.circle(e.latlng, { radius: e.accuracy, color: '#2563eb', weight: 1, fillOpacity: 0.08 })
        .addTo(map);
    }
  });

  map.once('locationerror', () => {
    console.warn('Current location unavailable.');
  });
}

function getPdfEmbedUrl(mediaUrl) {
  const normalizedUrl = mediaUrl.trim().replace(/\\/g, '/').replace(/ /g, '%20');

  const driveMatch = normalizedUrl.match(/\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  const openIdMatch = normalizedUrl.match(/[?&]id=([^&]+)/);
  if (normalizedUrl.includes('drive.google.com') && openIdMatch) {
    return `https://drive.google.com/file/d/${openIdMatch[1]}/preview`;
  }

  return normalizedUrl;
}
