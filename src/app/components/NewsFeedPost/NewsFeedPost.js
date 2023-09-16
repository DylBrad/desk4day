import React from 'react';
import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

import Likes from '@/app/map-components/Likes/Likes';
import { findOneUser } from '@/app/API';

const NewsFeedPost = ({ postAuthor, postImage, postDescription, id }) => {
  const [user, setUser] = React.useState(null);
  const [profilePic, setProfilePic] = React.useState(null);

  // COOKIES
  const [cookies] = useCookies(['user']);
  const token = cookies.token;
  let decodedToken = undefined;
  let userId = undefined;
  if (token !== undefined) {
    decodedToken = jwt_decode(token);
    userId = decodedToken._id;
  }

  const findUser = async () => {
    const user = await findOneUser(postAuthor);
    setUser(user);
    setProfilePic(user.profile_pic);
  };

  React.useEffect(() => {
    findUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="newsfeed-post">
      <div className="author-details">
        {profilePic ? (
          <div
            className="profile-pic-nf"
            style={{ backgroundImage: 'url(' + profilePic + ')' }}
          ></div>
        ) : (
          <IconContext.Provider value={{ className: 'react-icons', size: 24 }}>
            <div className="profile-pic">
              <FaUserAlt value={{ className: 'react-icons' }} />
            </div>
          </IconContext.Provider>
        )}
        <div>
          <h2>{user && user.username}</h2>
        </div>
      </div>
      <div
        className="image-container"
        style={{ backgroundImage: 'url(' + postImage + ')' }}
      ></div>
      <div className="post-details">
        <p>{postDescription}</p>
        <Likes id={id} authorId={postAuthor} path={'posts'} userId={userId} />
      </div>
    </div>
  );
};

export default NewsFeedPost;
