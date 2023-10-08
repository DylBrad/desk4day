import * as React from 'react';

import { deletePost } from '../../API';

const DeleteConfirm = ({
  postId,
  setShowConfirmDelete,
  setShowPostOptionsMenu,
}) => {
  const handleDelete = async () => {
    await deletePost(postId);
    window.location.reload(false);
  };

  const handleCloseModule = () => {
    setShowConfirmDelete(false);
    setShowPostOptionsMenu(true);
  };

  return (
    <>
      <div className="wrapper-shaddow">
        <div className="menu-options post-menu-options">
          <button className="primary-button" onClick={handleCloseModule}>
            Cancel
          </button>
          <button className="primary-button delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirm;
