import * as React from 'react';

import { deletePost } from '../../API';

const DeleteButton = (props) => {
  const [showConfirm, setShowConfirm] = React.useState(null);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleDelete = async (postId) => {
    postId = props.postId;
    await deletePost(postId);
  };

  const handleCloseModule = () => {
    setShowConfirm(null);
  };

  return (
    <>
      <button className="delete" onClick={handleClick}>
        Delete
      </button>

      {showConfirm && (
        <div className="confirm-delete">
          <div className="close-icon" onClick={handleCloseModule}>
            ✖
          </div>
          <p>Are you sure you want to delete this post?</p>
          <button onClick={handleDelete}>Confirm</button>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
