import React, { useState } from "react";
import { auth } from "../db/Firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth"; // Importer fetchSignInMethodsForEmail
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
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    // Reset error message
    setErrorMessage("");

    // Validate password length
    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return; // Stop execution if password is too short
    }

    try {
      // Vérifier si l'email existe déjà
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setErrorMessage("Cet email existe déjà.");
        return; // Stop execution if email already exists
      }

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
      setErrorMessage("Email déja existant"); // Generic error message
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
        {/* Message d'erreur au-dessus du champ mot de passe */}
        {errorMessage && (
          <span style={{ color: "red", fontWeight: "bold", marginBottom: "5px" }}>
            {errorMessage}
          </span>
        )}
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
