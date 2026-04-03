/**
 * Renders a loading spinner into a container element.
 * @param {HTMLElement} container
 */
export function showLoading(container) {
  container.innerHTML = '<div class="loading"><span class="spinner"></span>Loading…</div>';
}

/**
 * Renders an error message into a container element.
 * @param {HTMLElement} container
 * @param {string} [msg]
 */
export function showError(container, msg = 'Something went wrong.') {
  container.innerHTML = `<div class="error">${msg}</div>`;
}

/**
 * Renders a grid of tiles into a container.
 * @param {HTMLElement}  container
 * @param {Array}        items        Array of data objects
 * @param {Function}     renderFn     (item) => HTML string for tile inner content
 * @param {Function}     [onClick]    (item) => void, called when a tile is clicked
 */
export function renderTiles(container, items, renderFn, onClick) {
  container.innerHTML = '';
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="empty">No items found.</p>';
    return;
  }
  items.forEach(item => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = renderFn(item);
    if (onClick) tile.addEventListener('click', () => onClick(item));
    container.appendChild(tile);
  });
}

/**
 * Renders a detail card into a container.
 * @param {HTMLElement} container
 * @param {Object}      item
 * @param {Function}    renderFn   (item) => HTML string for card inner content
 */
export function renderDetailCard(container, item, renderFn) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'detail-card';
  card.innerHTML = renderFn(item);
  container.appendChild(card);
}
