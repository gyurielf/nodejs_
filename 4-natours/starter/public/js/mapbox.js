/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZ3l1cmllbGYiLCJhIjoiY2s5Mms3MXpjMDB6cDNpbXg2d2p0eWR5aSJ9.IumvY_2YkOhOzD23B_FEHg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    scrollZoom: false,
    doubleClickZoom: false,
    touchZoomRotate: false,
    dragZoomRotate: false,
    dragRotate: false,
    animate: false
    // center: [19.040236, 47.497913],
    // zoom: 13,
    // interactive: false,
    // antialias: true
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create the marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the new marker.
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
