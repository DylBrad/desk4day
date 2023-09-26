'use client';
import * as React from 'react';

import { listPosts } from '../API';
import Nav from '../components/Nav/Nav';
import NewsFeedPost from '../components/NewsFeedPost/NewsFeedPost';
import ProfileView from '../components/ProfileView/ProfileView';

const NewsFeed = () => {
  // Authentication
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(true);
  const [showProfileView, setShowProfileView] = React.useState(false);
  const [postAuthor, setPostAuthor] = React.useState(null);

  const [posts, setPosts] = React.useState([]);

  const getAllPosts = async () => {
    const posts = await listPosts();
    setPosts(posts.reverse());
  };

  React.useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <>
      <Nav
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
      ></Nav>
      {showProfileView ? (
        <ProfileView
          viewUsersId={postAuthor}
          setShowProfileView={setShowProfileView}
        />
      ) : (
        <div className="nav-child newsfeed-container">
          {posts.map((post) => {
            return (
              <NewsFeedPost
                setShowProfileView={setShowProfileView}
                setPostAuthor={setPostAuthor}
                key={post._id}
                postAuthor={post.author}
                postImage={post.image}
                postDescription={post.description}
                likes={post.likes}
                id={post._id}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default NewsFeed;
