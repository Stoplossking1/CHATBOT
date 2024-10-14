import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../Backend/Firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profil = () => {
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const [profileImage, setProfileImage] = useState("https://bootdey.com/img/Content/avatar/avatar6.png");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [prenom, setPrenom] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const docRef = doc(db, 'Utilisateurs', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || "");
          setPrenom(userData.prenom || "");
          setEmail(userData.email || "");
          setPhone(userData.phone || "");
          setAddress(userData.address || "");
          setProfileImage(userData.profileImage || profileImage);
        } else {
          console.log("No such document!");
        }

        const storageRef = ref(storage, `profile_pictures/Photo${userId}.png`);
        try {
          const url = await getDownloadURL(storageRef);
          setProfileImage(url);
        } catch (error) {
          console.error("Image not found in storage", error);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profile_pictures/Photo${userId}.png`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfileImage(url);
      await updateDoc(doc(db, 'Utilisateurs', userId), { profileImage: url });
    }
  };

  const handleSaveChanges = async () => {
    if (userId) {
      const docRef = doc(db, 'Utilisateurs', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          name: name,
          prenom: prenom,
          email,
          phone,
          address: address,
          profileImage: profileImage,
        });
      } else {
        await setDoc(docRef, {
          name: name,
          prenom: prenom,
          email,
          phone,
          address: address,
          profileImage: profileImage,
        });
      }

      alert('Profil mis à jour avec succès !');
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      try {
        // Réauthentifier l'utilisateur
        await reauthenticateWithCredential(user, credential);

        // Mettre à jour le mot de passe
        await updatePassword(user, newPassword);
        alert('Mot de passe mis à jour avec succès !');
        setCurrentPassword("");
        setNewPassword("");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe : ", error);
        alert("Échec de la mise à jour du mot de passe. Veuillez vérifier votre mot de passe actuel.");
      }
    } else {
      alert("L'utilisateur n'est pas authentifié.");
    }
  };

  return (
    <div className="container">
      <div className="main-body">
        <div className="row">
          <div className="col-lg-4">
            <div className="card" style={{ height: '100%' }}>
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="profile-image" 
                  />
                  <div className="mt-3">
                    <h4>{name} {prenom}</h4>
                    <input type="file" onChange={handleImageChange} className="btn btn-primary mb-2" />
                  </div>
                </div>
                <hr className="my-4" />
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-sm-3"><h6 className="mb-0">Nom</h6></div>
                  <div className="col-sm-9 text-secondary">
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3"><h6 className="mb-0">Prénom</h6></div>
                  <div className="col-sm-9 text-secondary">
                    <input type="text" className="form-control" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3"><h6 className="mb-0">Email</h6></div>
                  <div className="col-sm-9 text-secondary">
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3"><h6 className="mb-0">Téléphone</h6></div>
                  <div className="col-sm-9 text-secondary">
                    <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3"><h6 className="mb-0">Adresse</h6></div>
                  <div className="col-sm-9 text-secondary">
                    <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3"></div>
                  <div className="col-sm-9 text-secondary">
                    <button className="btn btn-primary px-4" onClick={handleSaveChanges}>Modifier</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section pour changer le mot de passe */}
        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5>Changer le mot de passe</h5>
                <div className="row mb-3">
                  <div className="col-sm-3"><h6 className="mb-0">Mot de passe actuel</h6></div>
                  <div className="col-sm-9 text-secondary">
                    <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3"><h6 className="mb-0">Nouveau mot de passe</h6></div>
                  <div className="col-sm-9 text-secondary">
                    <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-9 text-secondary">
                    <button className="btn btn-secondary px-4" onClick={handleChangePassword}>Changer mot de passe</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
