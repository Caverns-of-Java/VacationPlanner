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
