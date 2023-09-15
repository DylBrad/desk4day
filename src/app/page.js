'use client';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from 'react-map-gl';

import LogEntry from './map-components/LogEntry/LogEntry';

import { listLogEntries } from './API';

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [logEntries, setLogEntries] = React.useState([]);
  const [popupInfo, setPopupInfo] = React.useState(null);
  const [viewState, setViewState] = React.useState({
    longitude: -6.2603,
    latitude: 53.3498,
    zoom: 11,
  });

  const getAllMarkers = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  React.useEffect(() => {
    getAllMarkers();
  }, []);

  return (
    <Map
      {...viewState}
      mapboxAccessToken={mapboxToken}
      style={{ marginLeft: '260px', width: 'auto', height: '100vh' }}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/dylbrad/cl9h7i0r900it14pi0yg2sacm"
    >
      {logEntries.map((entry) => {
        return (
          <div>
            <Marker
              key={entry._id}
              longitude={entry.longitude}
              latitude={entry.latitude}
              onClick={(e) => {
                // If we let the click event propagates to the map, it will immediately close the popup
                // with `closeOnClick: true`
                e.originalEvent.stopPropagation();
                setPopupInfo(entry);
              }}
            ></Marker>
          </div>
        );
      })}
      {popupInfo && (
        <LogEntry
          longi={popupInfo.longitude}
          lati={popupInfo.latitude}
          setPopupInfo={setPopupInfo}
          img={popupInfo.image}
          title={popupInfo.title}
          description={popupInfo.description}
          authorId={popupInfo.authorId}
          id={popupInfo._id}
        />
      )}
    </Map>
  );
}
