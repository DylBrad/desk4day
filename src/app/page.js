'use client';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from 'react-map-gl';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

import Nav from './components/Nav/Nav';
import LogEntry from './map-components/LogEntry/LogEntry';
import NewEntryForm from './map-components/NewEntryForm/NewEntryForm';

import { listLogEntries } from './API';

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // Authentication
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(true);
  // Map
  const [logEntries, setLogEntries] = React.useState([]);
  const [popupInfo, setPopupInfo] = React.useState(null);
  const [newEntryLocation, setNewEntryLocation] = React.useState(null);
  const [viewState, setViewState] = React.useState({
    longitude: -6.2603,
    latitude: 53.3498,
    zoom: 11,
  });
  // COOKIES
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const token = cookies.token;
  let decodedToken = undefined;
  let userId = undefined;
  if (token !== undefined) {
    decodedToken = jwt_decode(token);
    userId = decodedToken._id;
  }

  const getAllMarkers = async () => {
    const logEntries = await listLogEntries();
    console.log('LOGS', logEntries);
    setLogEntries(logEntries);
  };

  React.useEffect(() => {
    getAllMarkers();
  }, []);

  const showAddMarkerPopup = (e) => {
    if (!newEntryLocation) {
      setNewEntryLocation({
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      });
      setViewState({
        latitude: e.lngLat.lat + 0.002127,
        longitude: e.lngLat.lng,
        zoom: 16,
      });
    } else if (newEntryLocation) {
      setNewEntryLocation(null);
    }
  };

  return (
    <>
      <Nav
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
      ></Nav>
      <Map
        {...viewState}
        mapboxAccessToken={mapboxToken}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/dylbrad/cl9h7i0r900it14pi0yg2sacm"
        onClick={showAddMarkerPopup}
      >
        {logEntries.map((entry) => {
          return (
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
            >
              <img
                src={
                  'https://res.cloudinary.com/dibcf1yjc/image/upload/v1695557820/icons/slzrr4bzkur0j9kwucxn.png'
                }
                className="icon-map icon-cafe"
              ></img>
            </Marker>
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
        {newEntryLocation && userId !== undefined ? (
          <>
            <Popup
              longitude={newEntryLocation.longitude}
              latitude={newEntryLocation.latitude}
              anchor="bottom"
              onClose={() => setNewEntryLocation(null)}
              style={{ maxWidth: '550px', width: 'auto', height: '100vh' }}
            >
              <div>
                <NewEntryForm
                  onClose={() => {
                    setNewEntryLocation(null);
                    getAllMarkers();
                  }}
                  location={newEntryLocation}
                  setIsSignUp={setIsSignUp}
                  setShowAuthModal={setShowAuthModal}
                  setNewEntryLocation={setNewEntryLocation}
                />
              </div>
            </Popup>
          </>
        ) : null}
      </Map>
    </>
  );
}
