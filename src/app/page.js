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
import { FaCoffee, FaTree } from 'react-icons/fa';
import {
  MdOutlineRestaurant,
  MdWorkspaces,
  MdMuseum,
  MdLocalLibrary,
} from 'react-icons/md';
import { RiTeamFill } from 'react-icons/ri';

import Nav from './components/Nav/Nav';
import LogEntry from './map-components/LogEntry/LogEntry';
import NewEntryForm from './map-components/NewEntryForm/NewEntryForm';
import GeoCoder from './map-components/GeoCoder/GeoCoder';
import LogView from './map-components/LogView/LogView';

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
  // LogView
  const [showLogView, setShowLogView] = React.useState(false);
  const [logEntryImage, setLogEntryImage] = React.useState('');
  const [logEntryTitle, setLogEntryTitle] = React.useState('');
  const [logEntryDescription, setLogEntryDescription] = React.useState('');
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
        style={{ width: 'auto' }}
        mapStyle="mapbox://styles/dylbrad/cl9h7i0r900it14pi0yg2sacm"
        onClick={showAddMarkerPopup}
        id="mapComponent"
      >
        <GeoCoder />
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <NavigationControl position="top-right" />
        {logEntries.map((entry) => {
          const pickIcon = () => {
            if (entry.establishment === 'cafe') {
              return (
                <div className="marker-icon">
                  <div className="location-icon coffee-icon">
                    <FaCoffee />
                  </div>
                  <div className="marker-bottom coffee-bottom"></div>
                </div>
              );
            } else if (entry.establishment === 'restaurant') {
              return (
                <div className="marker-icon">
                  <div className="location-icon restaurant-icon">
                    <MdOutlineRestaurant />
                  </div>
                  <div className="marker-bottom restaurant-bottom"></div>
                </div>
              );
            } else if (entry.establishment === 'library') {
              return (
                <div className="marker-icon">
                  <div className="location-icon library-icon">
                    <MdLocalLibrary />
                  </div>
                  <div className="marker-bottom library-bottom"></div>
                </div>
              );
            } else if (entry.establishment === 'museum') {
              return (
                <div className="marker-icon">
                  <div className="location-icon museum-icon">
                    <MdMuseum />
                  </div>
                  <div className="marker-bottom museum-bottom"></div>
                </div>
              );
            } else if (entry.establishment === 'coworking') {
              return (
                <div className="marker-icon">
                  <div className="location-icon coworking-icon">
                    <RiTeamFill />
                  </div>
                  <div className="marker-bottom coworking-bottom"></div>
                </div>
              );
            } else if (entry.establishment === 'outdoor') {
              return (
                <div className="marker-icon">
                  <div className="location-icon outdoor-icon">
                    <FaTree />
                  </div>
                  <div className="marker-bottom outdoor-bottom"></div>
                </div>
              );
            } else {
              return (
                <div className="marker-icon">
                  <div className="location-icon other-icon">
                    <MdWorkspaces />
                  </div>
                  <div className="marker-bottom other-bottom"></div>
                </div>
              );
            }
          };

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
              <div className="map-marker">{pickIcon()}</div>
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
            setShowLogView={setShowLogView}
            setLogEntryImage={setLogEntryImage}
            setLogEntryTitle={setLogEntryTitle}
            setLogEntryDescription={setLogEntryDescription}
          />
        )}
        {newEntryLocation ? (
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
      {showLogView && (
        <LogView
          setShowLogView={setShowLogView}
          logEntryImage={logEntryImage}
          logEntryTitle={logEntryTitle}
          logEntryDescription={logEntryDescription}
        />
      )}
    </>
  );
}
