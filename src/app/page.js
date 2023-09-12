'use client';
import * as React from 'react';
import styles from './page.module.css';
import Map, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from 'react-map-gl';

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [viewState, setViewState] = React.useState({
    longitude: -6.2603,
    latitude: 53.3498,
    zoom: 11,
  });

  return (
    <Map
      {...viewState}
      mapboxAccessToken={mapboxToken}
      style={{ marginLeft: '260px', width: 'auto', height: '100vh' }}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/dylbrad/cl9h7i0r900it14pi0yg2sacm"
    />
  );
}
