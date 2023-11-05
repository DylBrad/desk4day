import React from 'react';
import { IconContext } from 'react-icons';
import { MdOutlineClose } from 'react-icons/md';

const LogView = ({ setShowLogView, logEntryImage }) => {
  const handleClose = () => {
    setShowLogView(false);
    document.getElementById('mapComponent').style.display = 'block';
  };
  return (
    // Image(s)
    // Image carousel
    // Meta: Name, icon, location, created by/at
    // Reviews
    // Add review form (review, rating, image optional)
    <div className="log-view">
      <button className="close-button">
        <IconContext.Provider value={{ className: 'react-icons', size: 44 }}>
          <MdOutlineClose
            onClick={handleClose}
            value={{ className: 'react-icons' }}
          />
        </IconContext.Provider>
      </button>

      <div className="log-view-content-container">
        <div className="log-view-content">
          <div className="logV-image-box">
            <div className="logV-image-container">
              <div
                className="logV-image"
                style={{ backgroundImage: 'url(' + logEntryImage + ')' }}
              ></div>
            </div>
            <div className="carousel"></div>
          </div>

          <div className="logV-content-container">
            <div className="logV-meta"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogView;
