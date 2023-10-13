'use client';
import * as React from 'react';
import { useCookies } from 'react-cookie';

import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';
import { GrAddCircle } from 'react-icons/gr';

import jwt_decode from 'jwt-decode';

import ProfilePost from '../components/ProfilePost/ProfilePost';
import EditProfileForm from '../components/EditProfileForm/EditProfileForm';
import NewPostForm from '../components/NewPostForm/NewPostForm';
import PostOptionsMenu from '../components/PostOptionsMenu/PostOptionsMenu';
import EditPostForm from '../components/EditPostForm/EditPostForm';

import Nav from '../components/Nav/Nav';

import { listCurrentUserPosts, findOneUser } from '../API';
import DeleteConfirm from '../components/DeleteConfirm/DeleteConfirm';

const Profile = () => {
  const [showNewPostForm, setShowNewPostForm] = React.useState(false);
  // Posts
  const [posts, setPosts] = React.useState([]);
  // Edit posts
  const [showPostOptionsMenu, setShowPostOptionsMenu] = React.useState(false);
  const [showEditPostForm, setShowEditPostForm] = React.useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [postFormPlaceholder, setPostFormPlaceholder] = React.useState('');
  const [postId, setPostId] = React.useState('');
  // Profile info
  const [profilePic, setProfilePic] = React.useState(null);
  const [profileBio, setProfileBio] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [showEditProfileForm, setShowEditProfileForm] = React.useState(false);
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
    setPosts(posts.reverse());
  };

  const getUserProfilePic = async () => {
    const id = decodedToken.userId;
    const user = await findOneUser(id);
    const profilePicture = user.profile_pic;
    let bio = null;
    if (user.bio) {
      bio = user.bio;
    }
    setProfilePic(profilePicture);
    const userName = user.username;
    setUsername(userName);
    setProfileBio(bio);
  };

  React.useEffect(() => {
    getUsersPosts();
    getUserProfilePic();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    console.log('SHOW: ', showPostOptionsMenu);
    // eslint-disable-next-line
  }, [showPostOptionsMenu]);

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
              <div
                className="profile-pic-container"
                style={{ backgroundImage: `url(${profilePic})` }}
              ></div>
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
              <ProfilePost
                postImage={post.image}
                postDescription={post.description}
                postId={post._id}
                setPostId={setPostId}
                setShowEditPostForm={setShowEditPostForm}
                setPostFormPlaceholder={setPostFormPlaceholder}
                setShowPostOptionsMenu={setShowPostOptionsMenu}
              />
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
        {showEditPostForm ? (
          <EditPostForm
            postId={postId}
            setPostId={setPostId}
            setShowEditPostForm={setShowEditPostForm}
            setPostFormPlaceholder={setPostFormPlaceholder}
            postFormPlaceholder={postFormPlaceholder}
          />
        ) : null}

        {showPostOptionsMenu ? (
          <PostOptionsMenu
            setShowEditPostForm={setShowEditPostForm}
            setShowPostOptionsMenu={setShowPostOptionsMenu}
            setShowConfirmDelete={setShowConfirmDelete}
            postId={postId}
          />
        ) : null}

        {showConfirmDelete && (
          <DeleteConfirm
            postId={postId}
            setShowConfirmDelete={setShowConfirmDelete}
            setShowPostOptionsMenu={setShowPostOptionsMenu}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
