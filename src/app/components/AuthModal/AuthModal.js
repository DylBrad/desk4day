import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import {
  createUser,
  loginUser,
  findUserByEmail,
  sendVerificationEmail,
} from '@/app/API';

const AuthModal = (props) => {
  const [password, setPassword] = React.useState(null);
  const [confirmPassword, setConfirmPassword] = React.useState(null);
  const [error, setError] = React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [showVerificationPopup, setShowVerificationPopup] =
    React.useState(false);

  const { register, handleSubmit } = useForm();

  const handleClick = () => {
    props.setShowAuthModal(false);
  };

  const handleConfirm = () => {
    props.setIsSignUp(false);
    setShowVerificationPopup(false);
  };

  const onSubmit = async (data) => {
    try {
      if (props.isSignUp && password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (props.isSignUp) {
        await createUser(data);

        // setCookie('token', created.token);
        // props.setIsSignUp(false);
        // props.setShowAuthModal(false);
        // window.location.reload(false);

        setShowVerificationPopup(true);
      }

      // Send email verification to the users email address??
      const email = data.email.toLowerCase();

      const user = await findUserByEmail(email);
      if (!props.isSignUp && user.verified == false) {
        console.log(
          'User not verified! A verification link will be sent to your provided email address',
        );

        alert(
          'Not verified! We will send a verification link momentarily. Check your emails for a verification link.',
        );

        sendVerificationEmail(user._id, email);

        return;
      }

      if (!props.isSignUp) {
        const loggedIn = await loginUser(data);

        if (loggedIn.token !== undefined) {
          setCookie('token', loggedIn.token);
        }

        props.setShowAuthModal(false);
        window.location.reload(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!showVerificationPopup && (
        <div className="auth-modal">
          <div className="close-icon" onClick={handleClick}>
            ✖
          </div>
          <h2>{props.isSignUp ? 'Create Account' : 'Please Log In'}</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
            {props.isSignUp && (
              <>
                <label htmlFor="username">Username</label>
                <input {...register('username')} required />
              </>
            )}

            <label htmlFor="email">Email</label>
            <input type="email" {...register('email')} required />

            <label htmlFor="password">Password</label>
            <input
              {...register('password')}
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            {props.isSignUp && (
              <>
                <label htmlFor="password-check">Confirm Password</label>
                <input
                  type="password"
                  id="password-check"
                  name="password-check"
                  placeholder="Confirm Password"
                  required={true}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}

            <button>{props.isSignUp ? 'Create Account' : 'Log in'}</button>
            {error ? <h3 className="error">{error}</h3> : null}
          </form>
        </div>
      )}
      {showVerificationPopup && (
        <div className="auth-modal">
          <p>
            A verification email has been sent to your email address. Please
            verify to log in.
          </p>
          <button onClick={handleConfirm}>Log In</button>
        </div>
      )}
    </>
  );
};

export default AuthModal;
