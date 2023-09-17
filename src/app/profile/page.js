'use client';
import * as React from 'react';
import { useCookies } from 'react-cookie';

import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';
import { GrAddCircle } from 'react-icons/gr';

import jwt_decode from 'jwt-decode';

import NewPostForm from '../components/NewPostForm/NewPostForm';
import DeleteButton from '../components/DeleteButton/DeleteButton';
import EditProfileForm from '../components/EditProfileForm/EditProfileForm';
import Nav from '../components/Nav/Nav';

import { listCurrentUserPosts, findOneUser } from '../API';

const Profile = () => {
  const [showNewPostForm, setShowNewPostForm] = React.useState(false);
  const [showEditProfileForm, setShowEditProfileForm] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [profilePic, setProfilePic] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [cookies] = useCookies(['user']);

  const token = cookies.token;

  let decodedToken = undefined;
  if (token !== undefined) {
    decodedToken = jwt_decode(token);
  }

  const getUsersPosts = async () => {
    // const posts = await listPosts();
    const id = decodedToken.userId;
    const posts = await listCurrentUserPosts(id);
    setPosts(posts);
  };

  const getUserProfilePic = async () => {
    const id = decodedToken.userId;
    const user = await findOneUser(id);
    const profilePicture = user.profile_pic;
    setProfilePic(profilePicture);
    const userName = user.username;
    setUsername(userName);
  };

  React.useEffect(() => {
    getUsersPosts();
    getUserProfilePic();
    // eslint-disable-next-line
  }, []);

  const handleClick = () => {
    setShowNewPostForm(true);
  };

  // edit profile form
  const handleShowEditProfileForm = () => {
    setShowEditProfileForm(true);
  };

  return (
    <>
      <Nav></Nav>
      <div className="nav-child profile-container">
        <div className="profile-info">
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
            <p>`Hello, I am ${username}! Lets connect!`</p>
            <div>
              <button
                className="edit-profile-btn"
                onClick={handleShowEditProfileForm}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="button-container" onClick={handleClick}>
          <IconContext.Provider value={{ className: 'react-icons', size: 64 }}>
            <GrAddCircle />
          </IconContext.Provider>
          <span>New Post</span>
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
                  <DeleteButton postId={post._id} />
                </div>
              </div>
            );
          })}
        </div>

        {(showNewPostForm || showEditProfileForm) && (
          <>
            {showNewPostForm && (
              <NewPostForm setShowNewPostForm={setShowNewPostForm} />
            )}
            {showEditProfileForm && (
              <EditProfileForm
                setShowEditProfileForm={setShowEditProfileForm}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
