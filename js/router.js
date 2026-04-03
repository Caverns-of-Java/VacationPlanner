/**
 * Returns the value of a URL query parameter by key.
 * @param {string} key
 * @returns {string|null}
 */
export function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Navigates to a page, appending the given params as query string.
 * @param {string} page  e.g. 'trip.html'
 * @param {Object} params  e.g. { trip_id: '1', trip_name: 'Japan' }
 */
export function navigate(page, params = {}) {
  const qs = new URLSearchParams(params).toString();
  window.location.href = qs ? `${page}?${qs}` : page;
}
