import React from 'react';
import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

import Likes from '@/app/map-components/Likes/Likes';
import { findUsersPublicInfo, getOneComment } from '@/app/API';
import PostView from '../PostView/PostView';

const NewsFeedPost = ({
  setPostAuthor,
  setShowProfileView,
  postAuthor,
  postImage,
  postDescription,
  id,
  commentsCount,
}) => {
  const [user, setUser] = React.useState(null);
  const [profilePic, setProfilePic] = React.useState(null);
  const [comment, setComment] = React.useState(null);
  const [commentAuthorPic, setCommentAuthorPic] = React.useState(null);
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
    const user = await findUsersPublicInfo(postAuthor);
    setUser(user);
    setProfilePic(user.profile_pic);
  };
  const getCommentData = async () => {
    const commentData = await getOneComment(id);
    if (commentData !== null) {
      setComment(commentData);
    }
    // maybe get comment authors picture here??

    let author;
    if (commentData !== null) {
      author = await findUsersPublicInfo(commentData.author);
      setCommentAuthorPic(author.profile_pic);
    }
  };

  React.useEffect(() => {
    findUser();
    getCommentData();
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
                <span className="ml-10">{commentsCount}</span>
              </button>
            </div>
          </div>
          {comment && (
            <div className="comment">
              <div
                className="profile-pic-nf"
                style={{ backgroundImage: 'url(' + commentAuthorPic + ')' }}
              ></div>
              <p>{comment.content}</p>
            </div>
          )}
          <button onClick={handleShowPost} className="add-comment-p">
            <p>Add a comment..</p>
          </button>
        </div>
      </div>
      {showPostView && (
        <PostView
          postImage={postImage}
          postDescription={postDescription}
          setShowPostView={setShowPostView}
          profilePic={profilePic}
          setShowProfileView={setShowProfileView}
          setPostAuthor={setPostAuthor}
          postAuthor={postAuthor}
          user={user}
          id={id}
        />
      )}
    </>
  );
};

export default NewsFeedPost;
