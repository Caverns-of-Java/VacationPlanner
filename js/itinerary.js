/**
 * Renders grouped itinerary days into a container element.
 * Expects the API to return an array of day groups:
 * [{ day: 1, entries: [{ time, description, destination_id, duration, cost, transport_mode, notes }, ...] }]
 *
 * @param {HTMLElement} container
 * @param {Array}       groupedDays
 * @param {Object}      destinationLookup
 * @param {Function}    onEntrySelect
 */
export function renderItinerary(container, groupedDays, destinationLookup = {}, onEntrySelect = null) {
  container.innerHTML = '';

  if (!groupedDays || groupedDays.length === 0) {
    container.innerHTML = '<p class="empty">No itinerary available.</p>';
    return;
  }

  [...groupedDays]
    .sort((a, b) => Number(a.day) - Number(b.day))
    .forEach(dayGroup => {
    const section = document.createElement('section');
    section.className = 'day-section';

    const header = document.createElement('h2');
    header.className = 'day-header';
    header.textContent = `Day ${dayGroup.day}`;
    section.appendChild(header);

    const list = document.createElement('ul');
    list.className = 'time-entries';

    [...(dayGroup.entries || [])]
      .sort((a, b) => formatTimeForSort(a.time).localeCompare(formatTimeForSort(b.time)))
      .forEach(entry => {
      const li = document.createElement('li');
      li.className = 'time-entry';

      const destinationLabel = destinationLookup[String(entry.destination_id)] || entry.destination_id || '';

      const metaItems = [
        entry.duration       ? `<span class="meta-item">Duration: ${entry.duration}</span>` : '',
        entry.cost           ? `<span class="meta-item">Cost: ${entry.cost}</span>` : '',
        entry.transport_mode ? `<span class="meta-item">Transport: ${entry.transport_mode}</span>` : '',
      ].filter(Boolean).join('');

      li.innerHTML = `
        <span class="entry-time">${formatDisplayTime(entry.time)}</span>
        <div class="entry-body">
          <strong class="entry-desc">${escapeMultiline(entry.description || '')}</strong>
          ${destinationLabel ? `<span class="entry-dest">${escapeHtml(String(destinationLabel))}</span>` : ''}
          ${metaItems ? `<div class="entry-meta">${metaItems}</div>` : ''}
          ${entry.notes ? `<p class="entry-notes">${escapeMultiline(entry.notes)}</p>` : ''}
        </div>
      `;

      if (entry.destination_id && typeof onEntrySelect === 'function') {
        li.classList.add('time-entry-link');
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', `Open destination ${destinationLabel || entry.destination_id}`);
        li.addEventListener('click', () => onEntrySelect(entry));
        li.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onEntrySelect(entry);
          }
        });
      }

      list.appendChild(li);
    });

    section.appendChild(list);
    container.appendChild(section);
  });
}

function formatDisplayTime(value) {
  if (!value) return '';
  if (/^\d{1,2}:\d{2}$/.test(String(value))) {
    return String(value);
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    if (typeof value === 'string' && value.includes('T') && value.endsWith('Z')) {
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  return String(value);
}

function formatTimeForSort(value) {
  return formatDisplayTime(value).padStart(5, '0');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeMultiline(value) {
  return escapeHtml(value).replace(/\n/g, '<br>');
}
