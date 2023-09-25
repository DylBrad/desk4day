import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useControl } from 'react-map-gl';

const GeoCoder = (setViewState) => {
  const geocoder = new MapboxGeocoder({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    marker: false,
    collapsed: false,
  });

  useControl(() => geocoder);
  geocoder.on('result', (e) => {
    const coords = e.result.geometry.coordinates;
    setViewState({
      longitude: coords[0],
      latitude: coords[1],
      zoom: 15,
    });
  });

  return null;
};

export default GeoCoder;
