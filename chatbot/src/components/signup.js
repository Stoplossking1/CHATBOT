import React, { useState } from "react";
import { auth } from "../db/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../db/Firebase"; // Import Firestore
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore methods
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [prenom, setPrenom] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error
  const [passwordError, setPasswordError] = useState(""); // State for password error
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Reset error messages
    setEmailError("");
    setPasswordError("");

    // Basic validation
    if (password.length < 6) {
      setPasswordError("Password devrait être au minimum 6 characteres");
      return;
    }

    // Check if email is already in use
    const emailDoc = await getDoc(doc(db, "Utilisateurs", email));
    if (emailDoc.exists()) {
      setEmailError("Email deja existant");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "Utilisateurs", user.uid), {
        id: user.uid,
        email: user.email,
        name,
        prenom,
        address,
        phone,
        hashedPassword: password,
      });

      alert("User created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error signing up", error);
      setEmailError("Email deja existant");
    }
  };

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={handleSignup}>
        <h2>Signup</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="error-message" style={{ color: 'red' }}>
          {emailError}
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="error-message" style={{ color: 'red' }}>
          {passwordError}
        </div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
