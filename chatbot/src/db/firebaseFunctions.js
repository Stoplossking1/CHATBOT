// firebaseFunctions.js
import { auth, db } from './Firebase'; // Importez votre configuration Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Fonction d'inscription
export const registerUser = async (email, password, name, prenom, phone, address) => {
  try {
    // Créer l'utilisateur avec Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Hacher le mot de passe avant de l'enregistrer dans Firestore
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Créer un document pour l'utilisateur
    await setDoc(doc(db, "Utilisateurs", user.uid), {
      email,
      hashedPassword,
      name,
      prenom,
      phone,
      address,
      id: String(user.uid).padStart(3, '0') // Format id à 3 chiffres
    });
    
    console.log('Utilisateur enregistré : ', user.uid);
  } catch (error) {
    console.error("Erreur lors de l'inscription : ", error);
  }
};

// Fonction de connexion
export const loginUser = async (email, password) => {
  try {
    // Connexion de l'utilisateur
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Vérifier si l'utilisateur existe dans Firestore
    const userDoc = await getDoc(doc(db, "Utilisateurs", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const isMatch = await bcrypt.compare(password, data.hashedPassword);
      if (isMatch) {
        console.log('Connexion réussie ! Token : ', user.accessToken);
        return user.accessToken; // Retourne le token pour l'utilisateur
      } else {
        throw new Error("Mot de passe incorrect");
      }
    } else {
      throw new Error("Utilisateur non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion : ", error);
  }
};
