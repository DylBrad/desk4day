'use client';
import * as React from 'react';
import { IconContext } from 'react-icons';
import { PiDotsThreeLight } from 'react-icons/pi';
import { useMediaQuery } from 'react-responsive';

const ProfilePost = ({
  postImage,
  postDescription,
  postId,
  setPostId,
  setShowEditPostForm,
  setPostFormPlaceholder,
  setShowPostOptionsMenu,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const phoneView = {
    size: 29,
  };
  const DesktopView = {
    size: 44,
  };
  const iconsSize = isMobile ? phoneView : DesktopView;

  const handleClick = () => {
    setPostId(postId);
    console.log('clicked');
    setPostFormPlaceholder(postDescription);
    setShowPostOptionsMenu(true);
  };

  return (
    <>
      <div className="image-box">
        <div className="post-menu" onClick={handleClick}>
          <IconContext.Provider
            value={{ className: 'react-icons', size: iconsSize.size }}
          >
            <PiDotsThreeLight value={{ className: 'react-icons' }} />
          </IconContext.Provider>
        </div>

        <div
          className="grid-image"
          style={{ backgroundImage: 'url(' + postImage + ')' }}
        ></div>
        <div id={`${postId}/overlay`} className="overlay">
          <div className="details">
            <h2>{postDescription}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePost;
