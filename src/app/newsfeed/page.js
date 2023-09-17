'use client';
import * as React from 'react';

import { listPosts } from '../API';
import Nav from '../components/Nav/Nav';
import NewsFeedPost from '../components/NewsFeedPost/NewsFeedPost';

const NewsFeed = () => {
  // Authentication
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(true);

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
      <div className="nav-child newsfeed-container">
        {posts.map((post) => {
          return (
            <NewsFeedPost
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
    </>
  );
};

export default NewsFeed;
