import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../db/Firebase"; // Assurez-vous d'importer `storage`
import { addDoc, collection, serverTimestamp, getDoc, doc } from "firebase/firestore"; // Importez getDoc pour obtenir les données de l'utilisateur
import { ref, getDownloadURL } from "firebase/storage";

const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userName, setUserName] = useState("Anonyme"); // Valeur par défaut pour le nom
  const [userPrenom, setUserPrenom] = useState(""); // Pour le prénom

  // URL de l'image par défaut pour les utilisateurs anonymes
  const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVJ7wiPO_KAfAiO-sdNhERAqgT9dF3Bmqhh96308BdqK5gtKsWXGXYw9uFLJsaLC-DqQY&usqp=CAU";

  // Récupérer l'image de profil et les données de l'utilisateur à partir de Firebase
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        // Référence à l'image de profil dans Firebase Storage
        const storageRef = ref(storage, `profile_pictures/Photo${userId}.png`);

        // Récupérer les données de l'utilisateur
        const userDoc = await getDoc(doc(db, 'Utilisateurs', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || "Anonyme"); // Utiliser le nom de l'utilisateur ou "Anonyme" par défaut
          setUserPrenom(userData.prenom || ""); // Utiliser le prénom de l'utilisateur ou vide
        }

        try {
          // Essayer d'obtenir l'URL de l'image
          const url = await getDownloadURL(storageRef);
          setUserPhoto(url);
        } catch (error) {
          setUserPhoto(defaultAvatar); // Utiliser l'image par défaut si aucune image n'est trouvée
        }
      } else {
        setUserPhoto(defaultAvatar); // Utiliser l'image par défaut si l'utilisateur n'est pas authentifié
      }
    };

    fetchUserProfile();
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    const { uid } = auth.currentUser;

    await addDoc(collection(db, "messages"), {
      text: message,
      name: `${userName} ${userPrenom}`, // Utiliser le nom et le prénom de l'utilisateur
      avatar: userPhoto, // Utiliser l'URL de l'image de profil récupérée
      createdAt: serverTimestamp(),
      uid,
    });

    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={sendMessage} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;
