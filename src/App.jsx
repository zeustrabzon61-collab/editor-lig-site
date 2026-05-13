import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StandingsPage from './pages/StandingsPage';
import FixturesPage from './pages/FixturesPage';
import AdminPanel from './pages/AdminPanel';
import Leaderboards from './pages/Leaderboards';
import PlayersPage from './pages/PlayersPage';

import Auth from './pages/Auth';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/puan-durumu" element={<StandingsPage />} />
            <Route path="/fikstur" element={<FixturesPage />} />
            <Route path="/istatistikler" element={<Leaderboards />} />
            <Route path="/oyuncular" element={<PlayersPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/takimlar" element={<div className="container page-container"><h2 className="section-title">Takımlar</h2><p>Pek yakında...</p></div>} />
          </Routes>
        </main>
        
        <footer className="footer">
          <div className="container">
            <p>&copy; 2026 Editör Lig. Tüm Hakları Saklıdır.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
