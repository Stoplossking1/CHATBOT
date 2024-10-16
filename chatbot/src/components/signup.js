import React, { useState } from "react";
import { auth } from "../db/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../db/Firebase"; // Import Firestore
import { doc, setDoc } from "firebase/firestore"; // Firestore methods
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For the name
  const [prenom, setPrenom] = useState(""); // For the prenom
  const [address, setAddress] = useState(""); // For the address
  const [phone, setPhone] = useState(""); // For the phone number
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user info in Firestore under "Utilisateurs" collection
      await setDoc(doc(db, "Utilisateurs", user.uid), {
        id: user.uid,
        email: user.email,
        name: name,
        prenom: prenom,
        address: address,
        phone: phone,
        hashedPassword: password // Typically you'd hash the password, but keeping it for demonstration
      });

      alert("User created successfully!");
      navigate("/"); // Redirect to home page after signup
    } catch (error) {
      console.error("Error signing up", error);
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
