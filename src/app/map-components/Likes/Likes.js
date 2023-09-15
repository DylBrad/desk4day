import React from 'react';
import { IconContext } from 'react-icons';
import { FcLikePlaceholder } from 'react-icons/fc';
import { FcLike } from 'react-icons/fc';

const Likes = ({ id, authorId, path, userId }) => {
  const [displayLikes, setDisplayLikes] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);

  const updateLogEntry = async (postID, usrID, numberOfLikes) => {
    let data = {
      likes: numberOfLikes,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${path}/likes/?_id=${postID}&userId=${usrID}`,
      {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  };

  async function getLikes(postID, usrID) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${path}/likes/?_id=${postID}&userId=${usrID}`,
    );
    const result = await response.json();
    setDisplayLikes(result.likes);
    setIsLiked(result.likedByUser);
  }

  const handleAddLike = async () => {
    if (userId === undefined) {
      alert('You must be logged in to like or comment on posts!');
      return;
    }

    const updatedLikes = displayLikes + 1;

    await updateLogEntry(id, authorId, updatedLikes);

    setDisplayLikes(updatedLikes);
  };
  const handleRemoveLike = async () => {
    if (userId === undefined) {
      alert('You must be logged in to like or comment on posts!');
      return;
    }

    const updatedLikes = displayLikes - 1;

    await updateLogEntry(id, authorId, updatedLikes);

    setDisplayLikes(updatedLikes);
  };

  React.useEffect(() => {
    getLikes(id, authorId);
    // eslint-disable-next-line
  }, [displayLikes]);

  return (
    <div className="likes">
      <IconContext.Provider value={{ className: 'react-icons', size: 17 }}>
        {isLiked && (
          <FcLike
            onClick={handleRemoveLike}
            value={{ className: 'react-icons' }}
          />
        )}
        {!isLiked && (
          <FcLikePlaceholder
            onClick={handleAddLike}
            value={{ className: 'react-icons' }}
          />
        )}
      </IconContext.Provider>
      <span>{displayLikes}</span>
    </div>
  );
};

export default Likes;
