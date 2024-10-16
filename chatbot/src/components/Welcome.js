import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../db/Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import projectX from "../img/crossed.png";
import EmailSignin from "../img/user.png";
import { useNavigate } from "react-router-dom"; // Import navigation

const Welcome = () => {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const navigate = useNavigate(); // Hook to navigate to other pages

  return (
    <main className="welcome">
      <h2>Welcome to my React Chat project.</h2>
      <img src={projectX} alt="Project X logo" width={50} height={50} />
      <p>Sign in to chat!</p>

      {/* Google Sign-In Button */}
      <button className="sign-in">
        <img
          onClick={googleSignIn}
          src={GoogleSignin}
          alt="sign in with google"
          type="button"
        />
      </button>

      {/* Email Sign-In Button to redirect to Login page */}
      <button
        className="sign-in"
        onClick={() => navigate("/login")} // Use navigate to go to Login page
      >
        <img src={EmailSignin} alt="Sign in" type="button" />
      </button>
    </main>
  );
};

export default Welcome;
