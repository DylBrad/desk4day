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
          <h1>mAppy</h1>
          <ul>
            <li>
              <GrMapLocation className="react-icons" size="24" />
              <Link className="span" href="/">
                Home
              </Link>
            </li>
            <li>
              <CgFeed className="react-icons" size="24" />
              <Link className="span" href="/newsfeed">
                Newsfeed
              </Link>
            </li>
            {authToken && (
              <li>
                <FaUserAlt className="react-icons" size="24" />
                <Link className="span" href="/profile">
                  Profile
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
                Create Account
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
