import React from 'react';
import { useForm } from 'react-hook-form';
import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

import Likes from '@/app/map-components/Likes/Likes';
import { createPostComment, findOneUser } from '@/app/API';
import PostView from '../PostView/PostView';

const NewsFeedPost = ({
  setPostAuthor,
  setShowProfileView,
  postAuthor,
  postImage,
  postDescription,
  id,
}) => {
  const { register, handleSubmit } = useForm();
  const [user, setUser] = React.useState(null);
  const [profilePic, setProfilePic] = React.useState(null);
  const [showPostView, setShowPostView] = React.useState(false);

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

  const onSubmit = async (data) => {
    data.author = decodedToken.userId;

    await createPostComment(id, data);

    console.log(id, data);
  };

  React.useEffect(() => {
    findUser();
    // eslint-disable-next-line
  }, []);

  const handleShowProfileView = () => {
    setShowProfileView(true);
    setPostAuthor(postAuthor);
  };

  const handleShowPost = () => {
    setShowPostView(true);
    document.body.style.overflow = 'hidden';
  };

  return (
    <>
      <div className="newsfeed-post">
        <div className="author-details" onClick={handleShowProfileView}>
          {profilePic ? (
            <div
              className="profile-pic-nf"
              style={{ backgroundImage: 'url(' + profilePic + ')' }}
            ></div>
          ) : (
            <IconContext.Provider
              value={{ className: 'react-icons', size: 24 }}
            >
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
          <div className="post-icons">
            <div className="post-icons-child">
              <Likes
                id={id}
                authorId={postAuthor}
                path={'posts'}
                userId={userId}
              />
            </div>
            <div className="post-icons-child">
              <button className="icon-button" onClick={handleShowPost}>
                <IconContext.Provider
                  value={{ className: 'react-icons', size: 14 }}
                >
                  <BiCommentDetail value={{ className: 'react-icons' }} />
                </IconContext.Provider>
              </button>
            </div>
          </div>
        </div>
        <form className="comment-box" onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...register('content')}
            rows="2"
            className="form-input form-input-txtarea"
          ></textarea>

          <button className="primary-button form-button">Post</button>
        </form>
      </div>
      {showPostView && (
        <PostView postImage={postImage} setShowPostView={setShowPostView} />
      )}
    </>
  );
};

export default NewsFeedPost;
