/**
 * Google Map widget.
 * Reads the location from `data-q` (a place query) or `data-lat`/`data-lng`
 * on the widget element (populated from the widget href query params) and
 * builds a keyless Google Maps embed URL.
 * @param {Element} widget The widget block element
 */
export default function decorate(widget) {
  const iframe = widget.querySelector('iframe');
  if (!iframe) return;

  const { q, lat, lng, zoom } = widget.dataset;
  const z = zoom || '15';

  let src;
  if (lat && lng) {
    src = `https://maps.google.com/maps?q=${lat},${lng}&z=${z}&output=embed`;
  } else {
    const query = q || 'DMart';
    src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${z}&output=embed`;
  }

  iframe.src = src;
}
