'use client';
import * as React from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { GrMapLocation } from 'react-icons/gr';
import { FaUserAlt } from 'react-icons/fa';
import { CgFeed } from 'react-icons/cg';
import AuthModal from '../AuthModal/AuthModal';

const Nav = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const authToken = cookies.token;

  const handleSignUp = () => {
    props.setShowAuthModal(true);
    props.setIsSignUp(true);
  };

  const handleLogIn = () => {
    props.setShowAuthModal(true);
    props.setIsSignUp(false);
  };

  const handleLogOut = () => {
    console.log('log me out');
    removeCookie('token', cookies.token);
    window.location.reload(false);
  };

  return (
    <>
      <nav className="main-navigation">
        <div className="nav-top-section">
          <h1>Desk4Day</h1>
          <ul>
            <li className="nav-list-item">
              <Link className="span" href="/">
                <GrMapLocation className="react-icons" size="24" />
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-list-item">
              <Link className="span" href="/newsfeed">
                <CgFeed className="react-icons" size="24" />
                <span>Newsfeed</span>
              </Link>
            </li>
            {authToken && (
              <li className="nav-list-item">
                <Link className="span" href="/profile">
                  <FaUserAlt className="react-icons" size="24" />
                  <span>Profile</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
        <section className="nav-btn-container">
          {authToken ? (
            <button className="primary-button" onClick={handleLogOut}>
              Sign Out
            </button>
          ) : (
            <>
              <button className="primary-button" onClick={handleSignUp}>
                Sign Up
              </button>
              <button className="primary-button" onClick={handleLogIn}>
                Log In
              </button>
            </>
          )}
        </section>
      </nav>
      {props.showAuthModal && (
        <AuthModal
          setShowAuthModal={props.setShowAuthModal}
          isSignUp={props.isSignUp}
          setIsSignUp={props.setIsSignUp}
        />
      )}
    </>
  );
};

export default Nav;
