import * as React from 'react';

const DeleteButton = ({ setShowConfirmDelete, setShowPostOptionsMenu }) => {
  const handleClick = () => {
    setShowConfirmDelete(true);
    setShowPostOptionsMenu(false);
  };

  return (
    <>
      <button className="primary-button delete" onClick={handleClick}>
        Delete
      </button>
    </>
  );
};

export default DeleteButton;
