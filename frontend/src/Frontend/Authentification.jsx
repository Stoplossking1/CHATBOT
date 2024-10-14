import React, { useState } from 'react';
import { registerUser, loginUser } from '../firebaseFunctions';
import { auth, googleProvider, db } from '../Backend/Firebase'; // Importez googleProvider et db
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Importez les fonctions Firestore

const Authentification = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await registerUser(email, password, name, prenom, phone, address);
      } else {
        const token = await loginUser(email, password);
        console.log('Token : ', token);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Utilisateur connecté : ', user);

      // Enregistrez l'utilisateur dans votre base de données si nécessaire
      const userDoc = await getDoc(doc(db, "Utilisateurs", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "Utilisateurs", user.uid), {
          email: user.email,
          name: user.displayName,
          prenom: "", // Vous pouvez demander le prénom à l'utilisateur après la connexion
          phone: "",
          address: "",
          id: String(user.uid).padStart(3, '0'), // Format id à 3 chiffres
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2>{isRegistering ? 'S\'inscrire' : 'Se connecter'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegistering && (
          <>
            <div className="mb-3">
              <label>Nom</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Prénom</label>
              <input
                type="text"
                className="form-control"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Téléphone</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Adresse</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary">
          {isRegistering ? 'S\'inscrire' : 'Se connecter'}
        </button>
        <button
          type="button"
          className="btn btn-link"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Déjà inscrit ? Se connecter' : 'Pas encore inscrit ? S\'inscrire'}
        </button>
      </form>
      <button className="btn btn-danger" onClick={handleGoogleLogin}>
        Se connecter avec Google
      </button>
    </div>
  );
};

export default Authentification;
