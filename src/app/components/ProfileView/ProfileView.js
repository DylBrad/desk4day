'use client';
import * as React from 'react';
import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';
import { BiArrowBack } from 'react-icons/bi';

import { findOneUser, listCurrentUserPosts } from '@/app/API';

const ProfileView = ({ viewUsersId, setShowProfileView }) => {
  const [posts, setPosts] = React.useState([]);
  const [profilePic, setProfilePic] = React.useState(null);
  const [profileBio, setProfileBio] = React.useState(null);
  const [username, setUsername] = React.useState(null);

  const getUsersPosts = async () => {
    const posts = await listCurrentUserPosts(viewUsersId);
    setPosts(posts);
  };
  const getUserDetails = async () => {
    const user = await findOneUser(viewUsersId);
    const profilePicture = user.profile_pic;
    setProfilePic(profilePicture);
    const userName = user.username;
    setUsername(userName);
    let bio = null;
    if (user.bio) {
      bio = user.bio;
    }
    setProfileBio(bio);
  };

  const handleSetProfileView = () => {
    setShowProfileView(false);
  };

  React.useEffect(() => {
    getUsersPosts();
    getUserDetails();
  }, []);

  return (
    <>
      <div className="nav-child profile-container">
        <div className="profile-info">
          <IconContext.Provider
            value={{ className: 'react-icons back-arrow', size: 34 }}
          >
            <BiArrowBack
              onClick={handleSetProfileView}
              value={{ className: 'react-icons back-arrow' }}
            />
          </IconContext.Provider>
          <div className="profile-pic">
            {profilePic ? (
              <div className="profile-pic-container">
                <img alt="" src={profilePic}></img>
              </div>
            ) : (
              <IconContext.Provider
                value={{ className: 'react-icons', size: 54 }}
              >
                <FaUserAlt value={{ className: 'react-icons' }} />
              </IconContext.Provider>
            )}
          </div>
          <div className="profile-bio">
            <h2>{username}</h2>
            {profileBio ? (
              <p>{profileBio}</p>
            ) : (
              <p>Hello, I am {username}! Lets connect!</p>
            )}
          </div>
        </div>

        <div className="profile-gallery">
          {posts.map((post) => {
            return (
              <div className="image-box">
                <div
                  className="grid-image"
                  style={{ backgroundImage: 'url(' + post.image + ')' }}
                ></div>
                <div className="overlay">
                  <div className="details">
                    <h2>{post.description}</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProfileView;
