import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Profil from './Profil'; 
import Authentification from './Authentification';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="navbar-menu">
            <div className="navbar-start">
              <Link to="/profil" className="navbar-item">Profil</Link>
              <Link to="/auth" className="navbar-item">S'authentifier</Link>
            </div>
          </div>
        </header>
        <Routes>
          <Route path="/profil" element={<Profil />} />
          <Route path="/auth" element={<Authentification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

