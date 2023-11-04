import React from 'react';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';
import { useForm } from 'react-hook-form';

import { IconContext } from 'react-icons';
import { MdOutlineClose } from 'react-icons/md';

import { createPostComment, getAllComments } from '@/app/API';

const PostView = ({
  postImage,
  setShowPostView,
  profilePic,
  setShowProfileView,
  setPostAuthor,
  postAuthor,
  user,
  id,
}) => {
  const { register, handleSubmit } = useForm();

  const [comments, setComments] = React.useState(null);

  // COOKIES
  const [cookies] = useCookies(['user']);
  const token = cookies.token;
  let decodedToken = undefined;
  let userId = undefined;
  if (token !== undefined) {
    decodedToken = jwt_decode(token);
    userId = decodedToken._id;
  }

  const onSubmit = async (data) => {
    data.author = decodedToken.userId;

    await createPostComment(id, data);

    console.log(id, data);
  };

  const handleClose = () => {
    setShowPostView(false);
    document.body.style.overflow = 'scroll';
  };

  const handleShowProfileView = () => {
    setShowPostView(false);
    document.body.style.overflow = 'scroll';
    setShowProfileView(true);
    setPostAuthor(postAuthor);
  };

  const getComments = async () => {
    const returnedComments = await getAllComments(id);
    console.log('RETUNRED', returnedComments);
    if (returnedComments !== null) {
      setComments(returnedComments);
    }
  };

  React.useEffect(() => {
    // request all comments
    getComments();
  }, []);
  return (
    <div className="post-view-container">
      <div className="post-view-content">
        <div className="postV-image-container">
          <div
            className="postV-image"
            style={{ backgroundImage: 'url(' + postImage + ')' }}
          ></div>
        </div>
        <div className="postV-content-container">
          <div className="post-meta">
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

            <button className="close-button">
              <IconContext.Provider
                value={{ className: 'react-icons', size: 34 }}
              >
                <MdOutlineClose
                  onClick={handleClose}
                  value={{ className: 'react-icons' }}
                />
              </IconContext.Provider>
            </button>
          </div>

          <div className="postV-comments"></div>

          <div className="comment-form-container">
            <form className="comment-box" onSubmit={handleSubmit(onSubmit)}>
              <textarea
                {...register('content')}
                rows="1"
                className="form-input form-input-txtarea"
                placeholder="Leave a comment..."
              ></textarea>

              <button className="primary-button form-button">Post</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView;
