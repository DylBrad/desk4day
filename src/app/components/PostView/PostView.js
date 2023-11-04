import React from 'react';
import { IconContext } from 'react-icons';

import { MdOutlineClose } from 'react-icons/md';

const PostView = ({ postImage, setShowPostView }) => {
  const handleClose = () => {
    setShowPostView(false);
    document.body.style.overflow = 'scroll';
  };
  return (
    <div className="post-view-container">
      <div className="post-view-content">
        <div className="postV-image-container">
          <div
            className="postV-image"
            style={{ backgroundImage: 'url(' + postImage + ')' }}
          ></div>
        </div>
        <div className="postV-content-container">
          <div>
            <span className="postV-author"></span>
            <button className="close-button">
              <IconContext.Provider
                value={{ className: 'react-icons', size: 34 }}
              >
                <MdOutlineClose
                  onClick={handleClose}
                  value={{ className: 'react-icons' }}
                />
              </IconContext.Provider>
            </button>
          </div>

          <div className="postV-comments"></div>
          {/* PUT COMMENT BOX HERE */}
        </div>
      </div>
    </div>
  );
};

export default PostView;
