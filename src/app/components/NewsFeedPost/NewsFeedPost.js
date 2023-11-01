import React from 'react';
import { useForm } from 'react-hook-form';
import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

import Likes from '@/app/map-components/Likes/Likes';
import { createPostComment, findOneUser } from '@/app/API';

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
          <Likes id={id} authorId={postAuthor} path={'posts'} userId={userId} />
          <button className="icon-button">
            <IconContext.Provider
              value={{ className: 'react-icons', size: 14 }}
            >
              <div className="profile-pic">
                <BiCommentDetail value={{ className: 'react-icons' }} />
              </div>
            </IconContext.Provider>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...register('content')}
            rows="2"
            className="form-input form-input-txtarea"
          ></textarea>

          <button className="primary-button form-button">Create Comment</button>
        </form>
      </div>
    </>
  );
};

export default NewsFeedPost;
