'use client';
import * as React from 'react';
import { IconContext } from 'react-icons';
import { PiDotsThreeLight } from 'react-icons/pi';
import { useMediaQuery } from 'react-responsive';

import DeleteButton from '../DeleteButton/DeleteButton';

const ProfilePost = ({
  postImage,
  postDescription,
  postId,
  setPostId,
  setShowEditPostForm,
  setPostFormPlaceholder,
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
    let post = document.getElementById(postId);
    let overlay = document.getElementById(`${postId}/overlay`);

    let computedStyle = window.getComputedStyle(post);

    if (computedStyle.display === 'none') {
      post.style.display = 'flex';
      overlay.style.display = 'none';
    } else if (computedStyle.display === 'flex') {
      post.style.display = 'none';
      overlay.style.display = 'flex';
    }
  };

  const handleShowEditPostForm = () => {
    setShowEditPostForm(true);
    setPostFormPlaceholder(postDescription);
    setPostId(postId);
  };

  React.useEffect(() => {
    // Close the options menu if window is clicked elsewhere
    const handleWindowClick = (event) => {
      const postOptionsMenu = document.getElementById(postId);
      const overlay = document.getElementById(`${postId}/overlay`);
      const postMenuIcon = document.querySelector('.post-menu');

      if (postOptionsMenu && overlay && postMenuIcon) {
        // check that the menu was not clicked
        if (
          !postOptionsMenu.contains(event.target) &&
          !overlay.contains(event.target) &&
          !postMenuIcon.contains(event.target)
        ) {
          postOptionsMenu.style.display = 'none';
          overlay.style.display = 'flex';
        }
      }
    };

    // Add the click event listener when the component mounts
    window.addEventListener('click', handleWindowClick);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [postId]);

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
        <div id={postId} className="menu-options post-menu-options">
          <DeleteButton postId={postId} />
          <button className="primary-button" onClick={handleShowEditPostForm}>
            Edit Post
          </button>
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
