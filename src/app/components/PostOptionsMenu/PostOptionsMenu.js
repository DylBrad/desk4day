'use client';
import * as React from 'react';

import DeleteButton from '../DeleteButton/DeleteButton';

const PostOptionsMenu = ({
  setShowEditPostForm,
  setShowPostOptionsMenu,
  setShowConfirmDelete,
  postId,
}) => {
  const handleShowEditPostForm = () => {
    setShowEditPostForm(true);
    setShowPostOptionsMenu(false);
  };

  const handleCloseMenu = () => {
    setShowPostOptionsMenu(false);
  };

  return (
    <>
      <div className="wrapper-shaddow">
        <div className="menu-options post-menu-options">
          <DeleteButton
            setShowConfirmDelete={setShowConfirmDelete}
            setShowPostOptionsMenu={setShowPostOptionsMenu}
          />
          <button className="primary-button" onClick={handleShowEditPostForm}>
            Edit Post
          </button>
          <button className="primary-button" onClick={handleCloseMenu}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default PostOptionsMenu;
