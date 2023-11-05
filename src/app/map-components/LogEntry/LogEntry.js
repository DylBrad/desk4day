import React from 'react';
import { Popup } from 'react-map-gl';
import { IconContext } from 'react-icons';
import { GrLocationPin } from 'react-icons/gr';
import { BiCommentDetail } from 'react-icons/bi';
import { AiOutlineStar } from 'react-icons/ai';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

import Likes from '../Likes/Likes';

const LogEntry = ({
  longi,
  lati,
  setPopupInfo,
  img,
  title,
  description,
  authorId,
  id,
  setShowLogView,
  setLogEntryImage,
}) => {
  const [placeName, setPlaceName] = React.useState('');
  const [trimmedDescription, setTrimmedDescription] = React.useState('');

  // COOKIES
  const [cookies] = useCookies(['user']);
  const token = cookies.token;
  let decodedToken = undefined;
  let userId = undefined;
  if (token !== undefined) {
    decodedToken = jwt_decode(token);
    userId = decodedToken.userId;
  }

  const getUserArea = async () => {
    const reversedCoords = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longi},${lati}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
    );
    const response = await reversedCoords.json();
    setPlaceName(response.features[2].place_name);
  };

  const trimDescription = (string, length) => {
    const trimmedString = string.substring(0, length);
    return trimmedString;
  };

  const handleShowLogView = () => {
    setShowLogView(true);
    setLogEntryImage(img);
    document.getElementById('mapComponent').style.display = 'none';
  };

  React.useEffect(() => {
    getUserArea();
    setTrimmedDescription(trimDescription(description, 95));
    // eslint-disable-next-line
  }, []);

  return (
    <Popup
      longitude={longi}
      latitude={lati}
      anchor="bottom"
      onClose={() => setPopupInfo(null)}
      style={{ padding: 0 }}
    >
      <div className="popup-img-container">
        <img className="popup-image" alt="location" src={img}></img>
      </div>

      <div className="mapbox-popup-content">
        <h2>{title}</h2>
        <div className="mapbox-popup-location">
          <IconContext.Provider value={{ className: 'react-icons', size: 10 }}>
            <GrLocationPin value={{ className: 'react-icons' }} />
            <span>{placeName}</span>
          </IconContext.Provider>
        </div>
        <p>{`${trimmedDescription}...`}</p>

        <div className="mapbox-popup-content-likes mapbox-popup-icons">
          <Likes id={id} authorId={authorId} path={'logs'} userId={userId} />

          <button className="icon-button" onClick={handleShowLogView}>
            <IconContext.Provider
              value={{ className: 'react-icons', size: 14 }}
            >
              <AiOutlineStar value={{ className: 'react-icons' }} />

              <BiCommentDetail value={{ className: 'react-icons' }} />
            </IconContext.Provider>
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default LogEntry;
