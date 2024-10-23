import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import EmailSignin from "../img/user.png";
import { auth } from "../db/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


const NavBar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <nav className="nav-bar">
    


    <Link to="/" className="custom-link">
      <h3>Project X React</h3>
    </Link>

      {user ? (
        <>

        
      <Link to="/profil">
      <button className="profile-button" type="button"  >
        Profil
      </button>
      </Link>

        <button onClick={signOut} className="sign-out" type="button">
          Sign Out
        </button>       

        </>
        
      ) : (
        <>
          <button className="login-button">
            <img
              onClick={() => navigate("/login")}
              src={EmailSignin}
              alt="Sign in"
              type="button"
            />
          </button>
          <button className="sign-in">
            <img
              onClick={googleSignIn}
              src={GoogleSignin}
              alt="sign in with google"
              type="button"
            />
          </button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
