import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./db/Firebase";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import Login from "./components/Login"; // New login page
import Signup from "./components/signup";
import Profil from "./components/Profil";

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          {/* If user is not logged in, route to the Welcome page or the Login page */}
          {!user ? (
            <>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} /> 
            </>
          ) : (
            // If user is logged in, route to the ChatBox and Profil components
            <>
              <Route path="/" element={<ChatBox />} />
              <Route path="/profil" element={<Profil />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
