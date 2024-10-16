import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import EmailSignin from "../img/user.png";
import { auth } from "../db/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
      <h1 onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        Project X React Chat
      </h1>
      {user && (
        <div className="button-group">
          <button
            onClick={() => navigate("/profil")}
            className="profil-button"
            type="button"
          >
            Profil
          </button>

          <button onClick={signOut} className="sign-out" type="button">
            Sign Out
          </button>
        </div>
      )}

      {!user && (
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
